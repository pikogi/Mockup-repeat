import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/utils/jwt'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Shield, Users, MapPin, Search, Pencil, Trash2, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

import { UserPlus, Copy, Mail, Send, Loader2 } from 'lucide-react'
import PricingModal from '@/components/subscription/PricingModal'

export default function Team() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [showInvite, setShowInvite] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedBranchId, setSelectedBranchId] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [inviteStep, setInviteStep] = useState('form') // form | success
  const [lastSentEmail, setLastSentEmail] = useState('')

  const handleSendInvite = async () => {
    if (!inviteEmail) return
    const cleanEmail = inviteEmail.trim()
    if (!cleanEmail) return

    setIsSending(true)
    try {
      throw new Error(
        'Funcionalidad no disponible. El endpoint /functions/sendInvitation no está documentado en el YAML de Insomnia.',
      )
    } catch (error) {
      console.error('Invitation error:', error)
      toast.error(`${t('teamInviteEmailError')}: ${error.message}`)
      // If email fails, show manual copy step instead of generic error
      setLastSentEmail(cleanEmail)
      setInviteStep('manual')
    } finally {
      setIsSending(false)
    }
  }

  // Reset step when dialog opens/closes
  useEffect(() => {
    if (showInvite) {
      setInviteStep('form')
      setInviteEmail('')
      setSelectedBranchId('')
    }
  }, [showInvite])
  const [formData, setFormData] = useState({ role: 'brand_staff', assigned_branch_id: 'all' })

  const queryClient = useQueryClient()

  // Fetch current user to check permissions
  const currentUser = getCurrentUser()

  // NOTA: api.brands.get() no existe en el YAML de Insomnia
  const brand = null // No disponible - endpoint no existe en YAML

  // Fetch all users (only allowed for admins)
  const users = []
  const isLoading = false

  const stores = []

  // Filtrar sucursales de la marca del usuario
  const brandStores = stores.filter((store) => store.brand_id === currentUser?.brand_id)

  const handleAddMember = () => {
    if (brand?.subscription_plan === 'free') {
      setShowPricing(true)
      return
    }
    setShowInvite(true)
  }

  const getInviteLink = () => {
    if (!brand?.id) return ''
    const baseUrl = `${window.location.origin}/?join_brand=${brand.id}`
    if (selectedBranchId) {
      return `${baseUrl}&branch_id=${selectedBranchId}`
    }
    return baseUrl
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(getInviteLink())
    toast.success(t('teamLinkCopied'))
  }

  const handleMailto = () => {
    const subject = encodeURIComponent(
      `${t('teamEmailSubject')} ${brand?.brand_name || 'una marca'} ${t('teamEmailInRepeat')}`,
    )
    const body = encodeURIComponent(
      `${t('teamEmailBody')} ${brand?.brand_name || 'una marca'} ${t('teamEmailBodySuffix')}\n${getInviteLink()}\n\n${t('teamEmailRegards')}`,
    )
    window.open(`mailto:${lastSentEmail}?subject=${subject}&body=${body}`, '_blank')
  }

  const updateUserMutation = useMutation({
    mutationFn: () => {
      throw new Error(
        'Funcionalidad no disponible. El endpoint /entities/User no está documentado en el YAML de Insomnia.',
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
      toast.success(t('saveChanges'))
    },
    onError: () => {
      toast.error(t('teamUserUpdateError'))
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: () => {
      throw new Error(
        'Funcionalidad no disponible. El endpoint /entities/User no está documentado en el YAML de Insomnia.',
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(t('teamUserDeleted'))
    },
    onError: () => {
      toast.error(t('teamUserDeleteError'))
    },
  })

  const handleDelete = (userId) => {
    deleteUserMutation.mutate(userId)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      role: user.type_user || user.user_type || 'brand_staff',
      assigned_branch_id: user.assigned_branch_id || 'all',
    })
  }

  const handleSave = () => {
    if (!editingUser) return

    // Prepare update data
    const updateData = {
      role: formData.role,
      assigned_branch_id: formData.assigned_branch_id === 'all' ? null : formData.assigned_branch_id,
    }

    updateUserMutation.mutate({ id: editingUser.id, data: updateData })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (currentUser?.type_user !== 'brand_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Access Denied. Admins only.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">{t('team')}</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('manageTeamDesc')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            <Button
              size="lg"
              className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
              onClick={handleAddMember}
            >
              <UserPlus className="w-5 h-5" />
              {t('teamAddMember')}
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
              />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white dark:bg-gray-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        user.type_user === 'brand_admin'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                        {user.full_name || t('teamNoName')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 md:gap-6 md:items-center">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('role')}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.type_user === 'brand_admin'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        }`}
                      >
                        {user.type_user === 'brand_admin' ? t('admin') : t('employee')}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('store')}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {user.assigned_branch_id
                          ? stores.find((s) => s.id === user.assigned_branch_id)?.name || 'Unknown'
                          : t('allStores')}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="h-10 md:h-9" onClick={() => handleEdit(user)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      {t('edit')}
                    </Button>

                    {currentUser?.id !== user.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 md:h-9 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('delete')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('confirmAreYouSure')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('teamDeleteDesc')} &quot;{user.full_name || user.email}
                              &quot; {t('teamDeleteDescSuffix')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('editUser')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('role')}</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand_staff">{t('employee')}</SelectItem>
                    <SelectItem value="brand_admin">{t('admin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('store')}</Label>
                <Select
                  value={formData.assigned_branch_id}
                  onValueChange={(val) => setFormData({ ...formData, assigned_branch_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allStores')}</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.role === 'brand_admin' || formData.role === 'admin'
                    ? t('teamAdminStoreHint')
                    : t('teamStaffStoreHint')}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingUser(null)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={updateUserMutation.isPending}>
                {t('save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PricingModal open={showPricing} onOpenChange={setShowPricing} brand={brand} />

        {/* Invite Dialog */}
        <Dialog open={showInvite} onOpenChange={setShowInvite}>
          <DialogContent>
            {inviteStep === 'form' ? (
              <>
                <DialogHeader>
                  <DialogTitle>{t('teamInviteTitle')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>{t('store')}</Label>
                    <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('teamInviteStorePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {brandStores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('teamInviteStoreHint')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('teamInviteEmailLabel')}</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('teamInviteEmailPlaceholder')}
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <Button
                        onClick={handleSendInvite}
                        disabled={!inviteEmail || !selectedBranchId || isSending}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('teamInviteEmailHint')}</p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                        {t('teamInviteOrCopy')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={getInviteLink()}
                        className="bg-gray-50 dark:bg-gray-800 font-mono text-xs"
                      />
                      <Button variant="outline" size="icon" onClick={copyInviteLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('teamInviteLinkHint')}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowInvite(false)}>
                    {t('close')}
                  </Button>
                </DialogFooter>
              </>
            ) : inviteStep === 'success' ? (
              <>
                <DialogHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <DialogTitle className="text-center text-xl">{t('teamInviteSuccessTitle')}</DialogTitle>
                  <DialogDescription className="text-center">
                    {t('teamInviteSuccessDesc')}{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lastSentEmail}</span>{' '}
                    {t('teamInviteSuccessDescSuffix')}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 flex flex-col gap-3">
                  <Button onClick={() => setInviteStep('form')} variant="outline" className="w-full">
                    {t('teamInviteAnother')}
                  </Button>
                  <Button onClick={() => setShowInvite(false)} className="w-full bg-green-600 hover:bg-green-700">
                    {t('teamUnderstood')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <DialogTitle className="text-center text-xl">{t('teamManualSendTitle')}</DialogTitle>
                  <DialogDescription className="text-center pt-2">
                    {t('teamManualSendDesc')}{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lastSentEmail}</span>{' '}
                    {t('teamManualSendDescSuffix')}
                    <br />
                    <br />
                    {t('teamManualSendHint')}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input readOnly value={getInviteLink()} className="bg-gray-50 dark:bg-gray-800 font-mono text-xs" />
                    <Button variant="outline" size="icon" onClick={copyInviteLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleMailto}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {t('teamSendFromEmail')}
                  </Button>
                  <Button onClick={() => setShowInvite(false)} variant="outline" className="w-full">
                    {t('teamLinkCopiedDone')}
                  </Button>
                  <Button onClick={() => setInviteStep('form')} variant="ghost" className="w-full text-sm">
                    {t('teamTryOtherEmail')}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
