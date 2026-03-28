import { Loader2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/auth/LanguageContext'
import { useDashboard } from '@/hooks/useDashboard'
import { BrandLogoButton, BrandSelectorDropdown, DeleteBrandDialog } from '@/components/dashboard/DashboardSections'
import DashboardHome from './DashboardHome'

export default function Dashboard() {
  const { t } = useLanguage()
  const {
    brandId,
    brands,
    currentBrandName,
    hasBrands,
    brandLogoUrl,
    meData,
    isLoading: meLoading,
    isError: meError,
    handleLogoChange,
    isUploadingLogo,
    logoLoadError,
    setLogoLoadError,
    logoInputRef,
    handleSelectBrand,
    handleCreateBrand,
    handleDeleteBrand,
    brandToDelete,
    setBrandToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  } = useDashboard()

  if (meLoading && !meData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (meError || !meData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        {t('dashboardLoadError')}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <BrandLogoButton
                  brandLogoUrl={brandLogoUrl}
                  currentBrandName={currentBrandName}
                  isUploading={isUploadingLogo}
                  logoLoadError={logoLoadError}
                  onLogoLoadError={setLogoLoadError}
                  logoInputRef={logoInputRef}
                  onLogoChange={handleLogoChange}
                />
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground truncate min-w-0">
                  {currentBrandName}
                </h1>
                {hasBrands && (
                  <BrandSelectorDropdown
                    brands={brands}
                    brandId={brandId}
                    onSelectBrand={handleSelectBrand}
                    onCreateBrand={handleCreateBrand}
                    onRequestDelete={(brand) => {
                      setBrandToDelete(brand)
                      setIsDeleteDialogOpen(true)
                    }}
                  />
                )}
                <DeleteBrandDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                  brandToDelete={brandToDelete}
                  onConfirmDelete={handleDeleteBrand}
                />
                {!hasBrands && (
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleCreateBrand}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('dashboardSubtitle')}</p>
          </div>
        </motion.div>

        <div className="mt-8">
          <DashboardHome brandId={brandId} />
        </div>
      </div>
    </div>
  )
}
