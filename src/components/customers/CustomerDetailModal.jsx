import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Mail,
  CreditCard,
  Stamp,
  Gift,
  Calendar,
  TrendingUp,
  Smartphone,
  Cake,
  Loader2,
  Plus,
  CheckCircle2,
  Store,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { api } from '@/api/client'
import { getTransactionErrorMessage } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLanguage } from '@/components/auth/LanguageContext'

const CONFETTI_PIECES = [
  { left: '8%', color: '#22c55e', w: 8, h: 10, rotate: 120, dur: 1.2, delay: 0 },
  { left: '18%', color: '#86efac', w: 6, h: 8, rotate: -80, dur: 1.5, delay: 0.1 },
  { left: '28%', color: '#4ade80', w: 10, h: 6, rotate: 200, dur: 1.3, delay: 0.2 },
  { left: '38%', color: '#16a34a', w: 7, h: 9, rotate: -150, dur: 1.6, delay: 0.05 },
  { left: '48%', color: '#bbf7d0', w: 9, h: 7, rotate: 90, dur: 1.4, delay: 0.15 },
  { left: '58%', color: '#22c55e', w: 6, h: 10, rotate: -200, dur: 1.2, delay: 0.3 },
  { left: '68%', color: '#4ade80', w: 8, h: 6, rotate: 160, dur: 1.7, delay: 0 },
  { left: '78%', color: '#86efac', w: 10, h: 8, rotate: -90, dur: 1.3, delay: 0.2 },
  { left: '88%', color: '#16a34a', w: 7, h: 7, rotate: 240, dur: 1.5, delay: 0.1 },
  { left: '13%', color: '#22c55e', w: 9, h: 5, rotate: -180, dur: 1.6, delay: 0.25 },
  { left: '23%', color: '#4ade80', w: 5, h: 9, rotate: 100, dur: 1.4, delay: 0.35 },
  { left: '43%', color: '#bbf7d0', w: 8, h: 7, rotate: -120, dur: 1.2, delay: 0.4 },
  { left: '63%', color: '#22c55e', w: 7, h: 10, rotate: 180, dur: 1.8, delay: 0.05 },
  { left: '73%', color: '#86efac', w: 10, h: 6, rotate: -60, dur: 1.3, delay: 0.3 },
  { left: '83%', color: '#4ade80', w: 6, h: 8, rotate: 300, dur: 1.5, delay: 0.15 },
  { left: '33%', color: '#dcfce7', w: 8, h: 8, rotate: -240, dur: 1.4, delay: 0.45 },
  { left: '53%', color: '#15803d', w: 7, h: 5, rotate: 80, dur: 1.6, delay: 0.35 },
  { left: '93%', color: '#4ade80', w: 5, h: 9, rotate: -300, dur: 1.3, delay: 0.2 },
  { left: '3%', color: '#86efac', w: 9, h: 7, rotate: 220, dur: 1.7, delay: 0.1 },
  { left: '73%', color: '#22c55e', w: 6, h: 6, rotate: -140, dur: 1.5, delay: 0.5 },
]

export default function CustomerDetailModal({ customer, brandId, initialData, onClose }) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [isConfirming, setIsConfirming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)

  const userId = customer?.user_id

  const { data: stores = [] } = useQuery({
    queryKey: ['stores', brandId],
    queryFn: async () => {
      if (!brandId) return []
      const res = await api.stores.list(brandId)
      return res?.data || res || []
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Auto-seleccionar tienda: valida localStorage contra las tiendas cargadas
  useEffect(() => {
    if (stores.length === 0) return
    const stored = localStorage.getItem('operating_branch_id')
    const isValid = stored && stores.some((s) => (s.store_id || s.id) === stored)
    if (isValid) {
      setSelectedStore(stored)
    } else if (stores.length === 1) {
      const storeId = stores[0].store_id || stores[0].id
      setSelectedStore(storeId)
      localStorage.setItem('operating_branch_id', storeId)
    }
  }, [stores])

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId)
    localStorage.setItem('operating_branch_id', storeId)
  }

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userStats', brandId, userId],
    queryFn: async () => {
      const res = await api.brands.getStatsUser(brandId, userId)
      return res?.data || res
    },
    enabled: !!brandId && !!userId,
    initialData,
  })

  // Auto-seleccionar card: si solo hay una, usarla directamente
  const autoSelectedCardId = userData?.loyalty_cards?.length === 1 ? userData.loyalty_cards[0].card_id : selectedCardId

  useEffect(() => {
    if (!showRedeemSuccess) return
    const timer = setTimeout(() => setShowRedeemSuccess(false), 2500)
    return () => clearTimeout(timer)
  }, [showRedeemSuccess])

  const multipleCards = (userData?.loyalty_cards?.length ?? 0) > 1
  // Si hay múltiples cards, solo mostrar la elegida. Si hay una sola, usarla directamente.
  const activeCard =
    userData?.loyalty_cards?.find((lc) => lc.card_id === autoSelectedCardId) ??
    (multipleCards ? null : userData?.loyalty_cards?.[0])

  const customerName = userData?.full_name || customer?.full_name || 'Cliente'
  const customerEmail = userData?.email || customer?.email || 'Sin correo registrado'
  const customerPhone = userData?.phone || customer?.phone
  const customerCreatedAt = userData?.registered_at || customer?.created_at
  const customerBirthDate = userData?.birth_date

  // Mismo flujo que ScanQR: transactions.create + regenerar imagen
  const addStampMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStore) throw new Error(t('customerSelectStoreFirst'))
      if (!autoSelectedCardId) throw new Error(t('customerCardNotFound'))

      await api.transactions.create(autoSelectedCardId, selectedStore, 'stamp_added', 'stamp', 1)

      const programId = activeCard?.program?.program_id
      if (programId) {
        const prevImages = (() => {
          try {
            return JSON.parse(localStorage.getItem(`program_images_${programId}`) || '{}')
          } catch {
            return {}
          }
        })()
        if (prevImages.background || prevImages.stamp || prevImages.logo) {
          api.images
            .createStampCard(
              programId,
              prevImages.background || null,
              prevImages.stamp || null,
              prevImages.logo || null,
              prevImages.color || '#ffffff',
            )
            .catch(() => {})
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats', brandId, userId] })
      queryClient.invalidateQueries({ queryKey: ['brandUsers'] })
      setIsConfirming(false)
      setShowSuccess(true)
    },
    onError: (err) => {
      setIsConfirming(false)
      toast.error(getTransactionErrorMessage(err, t('customerStampError')))
    },
  })

  const redeemMutation = useMutation({
    mutationFn: async (redemptionId) => {
      await api.redemptions.update(redemptionId, 'completed')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats', brandId, userId] })
      setShowRedeemSuccess(true)
    },
    onError: (err) => {
      toast.error(err.message || t('customerRedeemError'))
    },
  })

  if (!customer) return null

  return (
    <Dialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <AnimatePresence>
            {showRedeemSuccess && (
              <motion.div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Confetti */}
                {CONFETTI_PIECES.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-sm"
                    style={{ width: p.w, height: p.h, backgroundColor: p.color, left: p.left, top: -12 }}
                    animate={{ y: 520, rotate: p.rotate, opacity: [1, 1, 0] }}
                    transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
                  />
                ))}

                {/* Message */}
                <motion.div
                  className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>
                <motion.h3
                  className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('customerRewardRedeemed')}
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  {customerName}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t('customerDetailTitle')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Customer Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-700 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{customerEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {customerCreatedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t('customerJoined')} <strong>{format(new Date(customerCreatedAt), 'dd MMM yyyy')}</strong>
                    </span>
                  </div>
                )}

                {customerPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {t('customerPhone')} <strong>{customerPhone}</strong>
                    </span>
                  </div>
                )}

                {customerBirthDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Cake className="w-4 h-4" />
                    <span>
                      {t('customerBirthday')} <strong>{format(new Date(customerBirthDate), 'dd MMM')}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Program selector (arriba, solo si hay múltiples) */}
            {multipleCards && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <Select value={selectedCardId || ''} onValueChange={setSelectedCardId}>
                  <SelectTrigger className="h-10 flex-1">
                    <SelectValue placeholder={t('customerSelectProgram')} />
                  </SelectTrigger>
                  <SelectContent>
                    {userData?.loyalty_cards?.map((lc) => (
                      <SelectItem key={lc.card_id} value={lc.card_id}>
                        {lc.program?.program_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stats del programa seleccionado */}
            {userLoading ? (
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : multipleCards && !activeCard ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                {t('customerSelectProgramMetrics')}
              </p>
            ) : activeCard ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-3 text-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                      <Stamp className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                      {activeCard.current_balance ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('customerCurrentStamps')}</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                      {activeCard.total_visits ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('customerTotalVisits')}</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-2">
                      <Gift className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                      {activeCard.redemptions?.filter((r) => r.status === 'completed').length || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('customerRewardsRedeemed')}</p>
                  </Card>
                </div>
                <Card className="p-4 bg-gradient-to-r from-amber-50 dark:from-amber-950 to-yellow-50 dark:to-yellow-950">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('customerProgressToReward')}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((activeCard.current_balance ?? 0) / (activeCard.program?.program_rules?.stamps_required ?? 10)) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activeCard.current_balance ?? 0} {t('of')}{' '}
                    {activeCard.program?.program_rules?.stamps_required ?? 10} {t('stampPlural')}
                  </p>
                </Card>
              </div>
            ) : null}

            {/* Pending redemption banner */}
            {(() => {
              const pending = activeCard?.redemptions?.find((r) => r.status === 'pending')
              if (!pending) return null
              return (
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                      {t('customerPendingReward')}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                    {activeCard.program?.reward_description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => redeemMutation.mutate(pending.redemption_id)}
                    disabled={redeemMutation.isPending}
                  >
                    {redeemMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    {t('customerRedeemReward')}
                  </Button>
                </div>
              )
            })()}

            {/* Transaction history */}
            {activeCard?.transactions?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('customerHistory')}</h4>
                </div>
                <Card className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                  {[...activeCard.transactions]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((tx) => (
                      <div key={tx.transaction_id} className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Stamp className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {tx.transaction_type === 'stamp_added' ? t('customerStampAdded') : tx.transaction_type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                          {format(new Date(tx.created_at), 'dd MMM yyyy, HH:mm')}
                        </span>
                      </div>
                    ))}
                </Card>
              </div>
            )}

            {/* Store indicator / selector */}
            {stores.length > 0 && (
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                {stores.length === 1 ? (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {stores[0].store_name || stores[0].name}
                  </span>
                ) : (
                  <Select value={selectedStore || ''} onValueChange={handleStoreSelect}>
                    <SelectTrigger className="h-10 flex-1">
                      <SelectValue placeholder={t('customerSelectStore')} />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.store_id || store.id} value={store.store_id || store.id}>
                          {store.store_name || store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Add Stamp Button with Confirmation */}
            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                  disabled={addStampMutation.isPending || userLoading || !selectedStore || !autoSelectedCardId}
                >
                  {addStampMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {addStampMutation.isPending ? t('customerAdding') : t('customerAddStampManually')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirmAreYouSure')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('customerAddStampConfirmDesc')} {customerName}
                    {t('customerAddStampConfirmSuffix')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => addStampMutation.mutate()}>{t('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Success Dialog */}
            <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
              <AlertDialogContent className="sm:max-w-xs">
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xl">{t('customerStampDelivered')}</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      {t('customerStampAddedTo')} {customerName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter className="sm:justify-center">
                  <AlertDialogAction onClick={() => setShowSuccess(false)} className="w-full">
                    {t('accept')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
