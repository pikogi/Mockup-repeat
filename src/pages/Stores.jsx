import { useMemo } from 'react'
import { Store } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCurrentUser } from '@/utils/jwt'
import { useStores } from '@/hooks/useStores'
import {
  StoresLoadingSkeleton,
  StoresEmptyState,
  StoreFormDialog,
  StoreCard,
  StoreQrDialog,
} from '@/components/stores/StoresSections'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function Stores() {
  const { t } = useLanguage()
  const user = useMemo(() => getCurrentUser(), [])
  const brandId = localStorage.getItem('brand_id')

  const {
    stores,
    isLoading,
    isDialogOpen,
    setDialogOpen,
    isQrOpen,
    setQrOpen,
    editingStore,
    selectedQrStore,
    formData,
    setFormData,
    isMutating,
    handleSubmit,
    handleEdit,
    handleClose,
    handleShowQr,
    deleteStore,
    isDeletingStore,
    getQrUrl,
  } = useStores(brandId)

  if (!user || user.type_user !== 'brand_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('accessDenied')}</p>
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
                <Store className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">{t('storesTitle')}</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('storesSubtitle')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            <StoreFormDialog
              open={isDialogOpen}
              onOpenChange={setDialogOpen}
              editingStore={editingStore}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onClose={handleClose}
              isMutating={isMutating}
            />
          </div>
        </motion.div>

        {isLoading ? (
          <StoresLoadingSkeleton />
        ) : stores.length === 0 ? (
          <StoresEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onEdit={handleEdit}
                onDelete={deleteStore}
                onShowQr={handleShowQr}
                isDeleting={isDeletingStore(store.id)}
              />
            ))}
          </div>
        )}

        <StoreQrDialog
          open={isQrOpen}
          onOpenChange={setQrOpen}
          store={selectedQrStore}
          qrUrl={getQrUrl(selectedQrStore)}
        />
      </div>
    </div>
  )
}
