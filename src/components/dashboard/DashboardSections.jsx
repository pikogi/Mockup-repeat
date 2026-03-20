import {
  LayoutDashboard,
  Loader2,
  Plus,
  Check,
  Building2,
  Trash2,
  Pencil,
  Store,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { format, subMonths } from 'date-fns'
import { useLanguage } from '@/components/auth/LanguageContext'

export function BrandLogoButton({
  brandLogoUrl,
  currentBrandName,
  isUploading,
  logoLoadError,
  onLogoLoadError,
  logoInputRef,
  onLogoChange,
}) {
  return (
    <>
      <button
        type="button"
        className="relative cursor-pointer"
        aria-label="Cambiar logo"
        onClick={() => logoInputRef.current?.click()}
      >
        {brandLogoUrl && !logoLoadError ? (
          <img
            src={brandLogoUrl}
            alt={currentBrandName}
            className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-lg"
            onError={() => onLogoLoadError(true)}
          />
        ) : (
          <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-gray-700 dark:text-gray-300" />
        )}
        <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
          {isUploading ? (
            <Loader2 className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400 animate-spin" />
          ) : (
            <Pencil className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </button>
      <input ref={logoInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={onLogoChange} />
    </>
  )
}

export function BrandSelectorDropdown({ brands, brandId, onSelectBrand, onCreateBrand, onRequestDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 md:h-9 gap-1 md:gap-2 px-2 md:px-3 hover:bg-accent transition-colors text-xs md:text-sm self-end -mt-1 md:mt-2.5"
        >
          <Plus className="w-2 h-2 md:w-4 md:h-4" />
          <span>Mis Marcas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Mis Marcas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {brands.map((brand) => (
          <DropdownMenuItem
            key={brand.brand_id}
            onClick={() => onSelectBrand(brand)}
            className={`group flex items-center justify-between cursor-pointer ${
              brand.brand_id === brandId ? 'bg-accent font-medium' : 'hover:bg-accent/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span>{brand.brand_name}</span>
            </div>
            <div className="flex items-center gap-2">
              {brand.brand_id === brandId && <Check className="w-4 h-4 text-primary" />}
              {brands.length > 1 && (
                <button
                  aria-label={`Eliminar ${brand.brand_name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRequestDelete(brand)
                  }}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onCreateBrand}
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 text-primary font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Crear nueva marca</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DeleteBrandDialog({ open, onOpenChange, brandToDelete, onConfirmDelete }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar marca?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar &quot;{brandToDelete?.brand_name}&quot;? Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (brandToDelete) {
                await onConfirmDelete(brandToDelete.brand_id)
                onOpenChange(false)
              }
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DashboardFilters({
  stores,
  dateFilter,
  setDateFilter,
  customDate,
  setCustomDate,
  selectedStore,
  setSelectedStore,
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end gap-2">
        {stores.length > 1 && (
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-900">
              <Store className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder={t('filterStore')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStores')}</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.store_name || store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-900">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder={t('filterPeriod')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t('periodDefault')}</SelectItem>
            <SelectItem value="7d">{t('period7d')}</SelectItem>
            <SelectItem value="month">{t('periodMonth')}</SelectItem>
            <SelectItem value="custom">{t('periodCustom')}</SelectItem>
          </SelectContent>
        </Select>

        <AnimatePresence>
          {dateFilter === 'custom' && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Desde</Label>
                  <Input
                    type="date"
                    className="bg-white dark:bg-gray-900 w-full md:w-[160px] h-10"
                    value={format(customDate.from, 'yyyy-MM-dd')}
                    min={format(subMonths(new Date(), 3), 'yyyy-MM-dd')}
                    max={format(customDate.to, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (!e.target.value) return
                      setCustomDate((prev) => ({ ...prev, from: new Date(e.target.value + 'T00:00:00') }))
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Hasta</Label>
                  <Input
                    type="date"
                    className="bg-white dark:bg-gray-900 w-full md:w-[160px] h-10"
                    value={format(customDate.to, 'yyyy-MM-dd')}
                    min={format(customDate.from, 'yyyy-MM-dd')}
                    max={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (!e.target.value) return
                      setCustomDate((prev) => ({ ...prev, to: new Date(e.target.value + 'T00:00:00') }))
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
