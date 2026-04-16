import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Eye,
  Edit,
  Share2,
  TrendingUp,
  Trash2,
  QrCode,
  Download,
  FileImage,
  Loader2,
  Newspaper,
  Plus,
  X,
  Megaphone,
  Tag,
  Calendar,
  ImageIcon,
  Star,
  Package,
  CreditCard,
} from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatePresence, motion } from 'framer-motion'
import PricingModal from '@/components/subscription/PricingModal'
import FlyerPreview from '@/components/programs/FlyerPreview'
import FlyerPDF from '@/components/programs/FlyerPDF'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

const POST_TYPES = [
  {
    value: 'promo',
    label: 'Promoción',
    icon: Tag,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
  {
    value: 'novedad',
    label: 'Novedad',
    icon: Megaphone,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  {
    value: 'evento',
    label: 'Evento',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  },
]

const EMPTY_POST = { type: 'promo', title: '', description: '', image_url: '', expires_at: '' }

function SurveyConfigModal({ open, onOpenChange, program }) {
  const [question, setQuestion] = useState('¿Cómo fue tu experiencia?')
  const [saved, setSaved] = useState('¿Cómo fue tu experiencia?')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-0">
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-500" />
            Encuesta · <span className="font-normal text-gray-500 text-base">{program.club_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Pregunta principal */}
          <div className="space-y-2">
            <Label htmlFor="survey_question">Pregunta de satisfacción</Label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Se muestra al cliente cuando canjea un premio del catálogo.
            </p>
            <Input
              id="survey_question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Cómo fue tu experiencia?"
              className="h-10"
            />
            {saved && (
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
                Activo: &quot;{saved}&quot;
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vista previa</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 text-center">
              {question || '¿Cómo fue tu experiencia?'}
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <Star key={v} className="w-7 h-7 text-gray-300" />
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">Tocá una estrella para calificar</p>
          </div>

          <Button
            disabled={!question.trim()}
            onClick={() => {
              setSaved(question.trim())
              toast.success('Encuesta guardada')
            }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PostsDrawer({ open, onOpenChange, program }) {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_POST)
  const [imagePreview, setImagePreview] = useState(null)
  const [tickerText, setTickerText] = useState('')
  const [savedTicker, setSavedTicker] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    setPosts((prev) => [
      { id: Date.now(), ...form, image_url: imagePreview || '', created_at: new Date().toISOString() },
      ...prev,
    ])
    setForm(EMPTY_POST)
    setImagePreview(null)
    setShowForm(false)
    toast.success('Novedad publicada')
  }

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCancel = () => {
    setForm(EMPTY_POST)
    setImagePreview(null)
    setShowForm(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg flex flex-col p-0 max-h-[90vh]">
        <DialogHeader className="px-6 py-5 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-gray-500" />
            Novedades · <span className="font-normal text-gray-500 text-base">{program.club_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Anuncio del ticker */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Anuncio del ticker</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mensaje que corre en la barra superior del catálogo público.
            </p>
            <Textarea
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              placeholder="Ej: 🚀 Referí un amigo y ganá 100 puntos · 🎁 Acumulá en cada compra"
              className="resize-none text-sm"
              rows={2}
            />
            {savedTicker && (
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Activo: &quot;{savedTicker}&quot;
              </p>
            )}
            <Button
              type="button"
              size="sm"
              disabled={!tickerText.trim()}
              onClick={() => {
                setSavedTicker(tickerText.trim())
                toast.success('Anuncio guardado')
              }}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Guardar anuncio
            </Button>
          </div>

          {/* Botón nueva novedad / formulario */}
          <AnimatePresence initial={false}>
            {!showForm ? (
              <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full gap-2 bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <Plus className="w-4 h-4" />
                  Nueva novedad
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nueva novedad</p>
                  <button
                    onClick={handleCancel}
                    className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tipo */}
                <div className="space-y-1.5">
                  <Label>Tipo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {POST_TYPES.map((pt) => {
                      const Icon = pt.icon
                      const selected = form.type === pt.value
                      return (
                        <button
                          key={pt.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, type: pt.value }))}
                          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                            selected
                              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {pt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-1.5">
                  <Label htmlFor="post_title">Título</Label>
                  <Input
                    id="post_title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Ej: 2x1 en cafés este fin de semana"
                    className="h-10"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <Label htmlFor="post_desc">
                    Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Textarea
                    id="post_desc"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Contá los detalles de la novedad..."
                    className="resize-none text-sm"
                    rows={3}
                  />
                </div>

                {/* Imagen + Vencimiento en la misma fila */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>
                      Imagen <span className="text-gray-400 font-normal">(opcional)</span>
                    </Label>
                    <label className="cursor-pointer flex items-center gap-2 h-10 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      {imagePreview ? (
                        <img src={imagePreview} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="text-xs text-gray-500 truncate">{imagePreview ? 'Cambiar' : 'Subir'}</span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="post_expires">
                      Vence <span className="text-gray-400 font-normal">(opcional)</span>
                    </Label>
                    <Input
                      id="post_expires"
                      type="date"
                      value={form.expires_at}
                      onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!form.title.trim()}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black gap-2"
                >
                  Publicar novedad
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lista de posts */}
          {posts.length === 0 && !showForm && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Todavía no hay novedades publicadas</p>
              <p className="text-xs mt-1">Las novedades aparecen en el catálogo público del programa</p>
            </div>
          )}

          {posts.map((post) => {
            const pt = POST_TYPES.find((t) => t.value === post.type) || POST_TYPES[0]
            const Icon = pt.icon
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-32 object-cover" />}
                <div className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${pt.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        {pt.label}
                      </span>
                      {post.expires_at && <span className="text-xs text-gray-400">· Vence {post.expires_at}</span>}
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{post.title}</p>
                  {post.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{post.description}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ProgramListItem({ card, onEdit, onToggleActive, onDelete, brand, currentUser, memberCount }) {
  const { t } = useLanguage()
  const [showPricing, setShowPricing] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [showPosts, setShowPosts] = useState(false)
  const [showSurveyConfig, setShowSurveyConfig] = useState(false)

  // Flyer states
  const [flyerTemplate, setFlyerTemplate] = useState('classic')
  const [customTitle, setCustomTitle] = useState('')
  const [customSubtitle, setCustomSubtitle] = useState('')
  const [customReward, setCustomReward] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)

  // Obtener brand_id desde localStorage
  const brandId = localStorage.getItem('brand_id')

  const shareUrl = (() => {
    if (card.short_url) {
      const raw = card.short_url
      // If it's already a full URL, use it as-is
      if (raw.startsWith('http')) return raw
      // If it's just the short code (no domain), construct the full URL
      return `${window.location.origin}/s/${raw}`
    }
    try {
      const url = new URL('/publicprogram', window.location.origin)
      url.searchParams.set('id', card.id)
      if (brandId) {
        url.searchParams.set('brand_id', brandId)
      }
      return url.toString()
    } catch {
      return window.location.href
    }
  })()

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(t('linkCopied'))
    } catch {
      toast.error(t('linkCopyError'))
    }
  }

  const checkProAccess = () => {
    const isAdmin = currentUser?.type_user === 'brand_admin'

    // Only block admins on free plan - employees can always share/preview
    if (isAdmin && brand?.subscription_plan === 'free') {
      setShowPricing(true)
      return false
    }
    return true
  }

  const handlePreview = () => {
    if (!checkProAccess()) return
    window.open(shareUrl, '_blank')
  }

  const handleShowQr = () => {
    if (!checkProAccess()) return
    setShowQr(true)
  }

  const handleShare = async () => {
    if (!checkProAccess()) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: card.club_name,
          text: `${t('programJoinShare')} ${card.club_name}!`,
          url: shareUrl,
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      copyShareLink()
    }
  }

  const downloadFlyer = async () => {
    setIsDownloading(true)

    try {
      const title = customTitle || card.club_name || t('programLoyaltyProgram')
      const subtitle = customSubtitle || t('flyerSubtitlePlaceholder')
      const reward = customReward || card.reward_text || t('flyerRewardPlaceholder')
      const accentColor = card.card_color || '#8B5CF6'

      // QR URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}`

      // Generate PDF using @react-pdf/renderer
      const blob = await pdf(
        <FlyerPDF
          template={flyerTemplate}
          title={title}
          subtitle={subtitle}
          reward={reward}
          accentColor={accentColor}
          qrUrl={qrUrl}
          logoUrl={card.logo_url || null}
        />,
      ).toBlob()

      // Download the PDF
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `flyer-${card.club_name}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('flyerDownloadSuccess'))
    } catch (error) {
      console.error('Error downloading flyer:', error)
      toast.error(t('flyerDownloadError'))
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadQrOnly = async () => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}`
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qr-${card.club_name}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success(t('qrDownloadSuccess'))
    } catch (error) {
      console.error('Error downloading QR:', error)
      toast.error(t('qrDownloadError'))
    }
  }

  const resetFlyerForm = () => {
    setCustomTitle('')
    setCustomSubtitle('')
    setCustomReward('')
    setFlyerTemplate('classic')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Program Preview */}
          <div
            className="w-full md:w-48 h-48 md:h-auto relative"
            style={{
              background: card.card_color || '#000000',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="font-bold text-lg mb-1 truncate px-2">{card.club_name}</h4>
              </div>
            </div>
          </div>

          {/* Program Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">{card.club_name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{card.reward_text}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={card.is_active}
                      onCheckedChange={(checked) => onToggleActive && onToggleActive(card, checked)}
                    />
                    <span
                      className={`text-sm font-medium ${card.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {card.is_active ? t('programActive') : t('programInactive')}
                    </span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {memberCount !== undefined ? memberCount : card.total_scans || 0} {t('members')}
                  </Badge>
                </div>
              </div>
            </div>

            {card.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{card.description}</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {card.program_type_id === '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8">
                      <Eye className="w-4 h-4" />
                      {t('programPreview')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <button
                      onClick={() => window.open(`/catalog/${card.id}`, '_blank')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      Ver catálogo
                    </button>
                    <button
                      onClick={handlePreview}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Ver tarjeta
                    </button>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={handlePreview}>
                  <Eye className="w-4 h-4" />
                  {t('programPreview')}
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={() => onEdit(card)}>
                <Edit className="w-4 h-4" />
                {t('programEdit')}
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={handleShowQr}>
                <QrCode className="w-4 h-4" />
                {t('programViewQr')}
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                {t('programShareLink')}
              </Button>

              {card.program_type_id === '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157' && (
                <>
                  <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={() => setShowPosts(true)}>
                    <Newspaper className="w-4 h-4" />
                    Novedades
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-10 md:h-8"
                    onClick={() => setShowSurveyConfig(true)}
                  >
                    <Star className="w-4 h-4" />
                    Encuesta
                  </Button>
                </>
              )}

              {currentUser?.type_user === 'brand_admin' && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-10 md:h-8 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('programDelete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('confirmAreYouSure')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('programDeleteDesc')} &quot;{card.club_name}&quot; {t('programDeleteDescSuffix')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(card.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {t('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </Card>
      <PostsDrawer open={showPosts} onOpenChange={setShowPosts} program={card} />
      <SurveyConfigModal open={showSurveyConfig} onOpenChange={setShowSurveyConfig} program={card} />
      <PricingModal open={showPricing} onOpenChange={setShowPricing} brand={brand} />

      {/* QR Dialog */}
      <Dialog
        open={showQr}
        onOpenChange={(open) => {
          setShowQr(open)
          if (!open) resetFlyerForm()
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">{t('programQrTitle')}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="gap-2">
                <QrCode className="w-4 h-4" />
                {t('programQrOnly')}
              </TabsTrigger>
              <TabsTrigger value="flyer" className="gap-2">
                <FileImage className="w-4 h-4" />
                {t('programFlyerPrint')}
              </TabsTrigger>
            </TabsList>

            {/* Solo QR Tab */}
            <TabsContent value="qr" className="mt-4">
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                    alt={`QR ${card.club_name}`}
                    className="w-48 h-48"
                    loading="lazy"
                  />
                </div>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{card.club_name}</p>
                  <p className="text-xs mt-1 break-all max-w-xs">{shareUrl}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('programQrScanDesc')}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    toast.success(t('linkCopied'))
                  }}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t('programCopyLink')}
                </Button>
                <Button variant="secondary" onClick={downloadQrOnly} className="gap-2">
                  <Download className="w-4 h-4" />
                  {t('programDownloadQr')}
                </Button>
              </div>
            </TabsContent>

            {/* Flyer Tab */}
            <TabsContent value="flyer" className="mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Side: Controls */}
                <div className="space-y-4">
                  {/* Template Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('flyerTemplate')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'classic', name: t('flyerClassic') },
                        { id: 'minimal', name: t('flyerMinimal') },
                        { id: 'promo', name: t('flyerPromo') },
                      ].map((tmpl) => (
                        <button
                          key={tmpl.id}
                          onClick={() => setFlyerTemplate(tmpl.id)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            flyerTemplate === tmpl.id
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {tmpl.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Title */}
                  <div>
                    <Label htmlFor="customTitle" className="text-sm font-medium">
                      {t('flyerTitle')}
                    </Label>
                    <Input
                      id="customTitle"
                      placeholder={card.club_name}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Custom Subtitle */}
                  <div>
                    <Label htmlFor="customSubtitle" className="text-sm font-medium">
                      {t('flyerSubtitle')}
                    </Label>
                    <Input
                      id="customSubtitle"
                      placeholder={t('flyerSubtitlePlaceholder')}
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Custom Reward */}
                  <div>
                    <Label htmlFor="customReward" className="text-sm font-medium">
                      {t('flyerReward')}
                    </Label>
                    <Input
                      id="customReward"
                      placeholder={card.reward_text || t('flyerRewardPlaceholder')}
                      value={customReward}
                      onChange={(e) => setCustomReward(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Download Button */}
                  <Button onClick={downloadFlyer} disabled={isDownloading} className="w-full gap-2 mt-4">
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('flyerGenerating')}
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {t('flyerDownload')}
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Side: Preview */}
                <div className="flex flex-col items-center">
                  <Label className="text-sm font-medium mb-2 block w-full">{t('livePreview')}</Label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800 p-2">
                    <div
                      style={{
                        transform: 'scale(0.45)',
                        transformOrigin: 'top left',
                        width: '180px',
                        height: '255px',
                      }}
                    >
                      <FlyerPreview
                        card={card}
                        template={flyerTemplate}
                        customTitle={customTitle || null}
                        customSubtitle={customSubtitle || null}
                        customReward={customReward || null}
                        shareUrl={shareUrl}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">{t('flyerDownloadNote')}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
