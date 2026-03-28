import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, Edit, Share2, TrendingUp, Trash2, QrCode, Download, FileImage, Loader2 } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import PricingModal from '@/components/subscription/PricingModal'
import FlyerPreview from '@/components/programs/FlyerPreview'
import FlyerPDF from '@/components/programs/FlyerPDF'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function ProgramListItem({ card, onEdit, onToggleActive, onDelete, brand, currentUser, memberCount }) {
  const { t } = useLanguage()
  const [showPricing, setShowPricing] = useState(false)
  const [showQr, setShowQr] = useState(false)

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
              <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={handlePreview}>
                <Eye className="w-4 h-4" />
                {t('programPreview')}
              </Button>
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
