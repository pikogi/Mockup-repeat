import PropTypes from 'prop-types'
import { memo } from 'react'
import { Store, Plus, MapPin, Trash2, Pencil, QrCode, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
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
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

export function StoresLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-40 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="space-y-2 flex-1">
            <div className="w-48 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse ml-6" />
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="w-20 h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function StoresEmptyState() {
  const { t } = useLanguage()

  return (
    <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
      <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('storeNoStoresEmpty')}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t('storeNoStoresEmptyDesc')}</p>
    </Card>
  )
}

export function StoreFormDialog({
  open,
  onOpenChange,
  editingStore,
  formData,
  setFormData,
  onSubmit,
  onClose,
  isMutating,
}) {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
        >
          <Plus className="w-5 h-5" />
          {t('storeNewStore')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingStore ? t('storeEditStore') : t('storeNewStore')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('storeName')}</Label>
            <Input
              id="name"
              required
              placeholder={t('storeNamePlaceholder')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t('storeAddress')}</Label>
            <Input
              id="address"
              placeholder={t('storeAddressPlaceholder')}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t('storeCity')}</Label>
            <Input
              id="city"
              placeholder={t('storeCityPlaceholder')}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isMutating}>
              {editingStore ? t('storeSaveChanges') : t('storeCreateStore')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

StoreFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  editingStore: PropTypes.object,
  formData: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isMutating: PropTypes.bool,
}

export const StoreCard = memo(function StoreCard({ store, onEdit, onDelete, onShowQr, isDeleting }) {
  const { t } = useLanguage()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="p-6 hover:shadow-lg transition-shadow group relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl">
            <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:h-8 md:w-8"
              onClick={() => onEdit(store)}
              aria-label={`${t('edit')} ${store.store_name || store.name}`}
            >
              <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:h-8 md:w-8 hover:text-red-600"
                  disabled={isDeleting}
                  aria-label={`${t('delete')} ${store.store_name || store.name}`}
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirmAreYouSure')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('storeDeleteDesc')} &quot;{store.store_name || store.name}&quot; {t('storeDeleteDescSuffix')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const storeIdToDelete = store.store_id || store.id
                      if (!storeIdToDelete) {
                        toast.error(t('storeIdError'))
                        return
                      }
                      onDelete(storeIdToDelete)
                    }}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? t('storeDeleting') : t('storeDelete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate">
          {store.store_name || store.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 flex-1">
          {store.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="break-all">{store.address}</span>
            </div>
          )}
          {store.city && (
            <div className="pl-6">
              <span>{store.city}</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
            ID: {String(store.store_id || store.id || '').slice(0, 8) || 'N/A'}...
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950"
            onClick={() => onShowQr(store)}
          >
            <QrCode className="w-4 h-4" />
            {t('storeViewQr')}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
})

StoreCard.propTypes = {
  store: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowQr: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
}

export function StoreQrDialog({ open, onOpenChange, store, qrUrl }) {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{t('storeQrTitle')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          {store && (
            <>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                  alt={`QR ${store.store_name || store.name}`}
                  className="w-48 h-48"
                  loading="lazy"
                />
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-gray-100">{store.store_name || store.name}</p>
                {qrUrl ? (
                  <p className="text-xs mt-1 break-all">{qrUrl}</p>
                ) : (
                  <p className="text-xs mt-1 text-gray-400 dark:text-gray-500 italic">{t('storeUrlUnavailable')}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('storeQrScanDesc')}</p>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              const link = document.createElement('a')
              link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrUrl)}`
              link.download = `qr-${store?.store_name || store?.name}.png`
              link.target = '_blank'
              link.click()
            }}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {t('storeDownloadQr')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

StoreQrDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  store: PropTypes.object,
  qrUrl: PropTypes.string,
}
