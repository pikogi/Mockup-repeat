import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { getCurrentUser } from '@/utils/jwt'
import useProgramsStore from '@/stores/useProgramsStore'
import { Loader2, Plus, LayoutDashboard, Check, Building2, Trash2, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Step3CTA from '@/components/dashboard/Step3CTA'
import DashboardHome from './DashboardHome'
import { useLanguage } from '@/components/auth/LanguageContext'
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
import { toast } from 'sonner'

export default function Dashboard() {
  const user = React.useMemo(() => getCurrentUser(), [])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useLanguage()

  const [brandToDelete, setBrandToDelete] = React.useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)
  const logoInputRef = React.useRef(null)

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !brandId) return
    setIsUploadingLogo(true)
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const base64 = ev.target.result
        await api.brands.update(brandId, { logo_image: base64 })
        // Compute versioned S3 URL to bust browser cache
        const s3LogoUrl = api.images.getLogoUrl(brandId)
        const version = Date.now()
        const versionedUrl = s3LogoUrl ? `${s3LogoUrl}?v=${version}` : null
        // Persist versioned URL so it survives page refreshes
        if (versionedUrl) {
          try {
            localStorage.setItem(`brand_logo_url_${brandId}`, versionedUrl)
          } catch {
            /* ignore */
          }
          try {
            localStorage.setItem(`brand_logo_version_${brandId}`, String(version))
          } catch {
            /* ignore */
          }
        }
        // Update store: ephemeral base64 for immediate display + versioned URL for persistence
        setDisplayLogo(brandId, base64)
        updateBrandLogo(brandId, versionedUrl || base64)
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
        queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms', brandId] })
        queryClient.invalidateQueries({ queryKey: ['brand', brandId] })
        queryClient.invalidateQueries({ queryKey: ['loyaltyProgram'] })
        fetchPrograms(brandId, true)
        toast.success('Logo actualizado')
        setIsUploadingLogo(false)
      }
      reader.onerror = () => {
        toast.error('Error al leer la imagen')
        setIsUploadingLogo(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Error al actualizar el logo')
      setIsUploadingLogo(false)
    }
    e.target.value = ''
  }

  const {
    data: meData,
    isLoading: meLoading,
    isError: meError,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me()
      return res?.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const brands = meData?.brands || []
  const brandIdFromStorage = localStorage.getItem('brand_id')
  const brandNameFromStorage = localStorage.getItem('brand_name')

  // Determinar brand_id activo:
  // 1. Si localStorage tiene un brand_id, usarlo (confiar mientras carga)
  // 2. Si brands ya cargó y el brand_id no existe, usar la primera marca
  // 3. Si no hay nada en localStorage, usar la primera marca disponible
  const brandExistsInList = brands.length > 0 && brands.some((brand) => brand.brand_id === brandIdFromStorage)

  const brandId = brandIdFromStorage
    ? brands.length === 0 || brandExistsInList
      ? brandIdFromStorage
      : brands[0]?.brand_id
    : brands[0]?.brand_id || null

  // Encontrar la marca actual por brand_id
  const currentBrand = brands.find((brand) => brand.brand_id === brandId)

  const handleSelectBrand = (brand) => {
    if (!brand?.brand_id) return

    // Guardar brand_id y brand_name en localStorage
    localStorage.setItem('brand_id', brand.brand_id)
    localStorage.setItem('brand_name', brand.brand_name)

    // Invalidar queries relacionadas con brands y datos dependientes
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] })
    queryClient.invalidateQueries({ queryKey: ['stores'] })
    queryClient.invalidateQueries({ queryKey: ['customers'] })

    // Recargar la página para actualizar todos los componentes
    window.location.reload()
  }

  const handleCreateBrand = () => {
    navigate('/onboarding')
  }

  const handleDeleteBrand = async (brandIdToDelete) => {
    try {
      await api.brands.delete(brandIdToDelete)

      // Si se eliminó la marca activa, cambiar a otra marca o redirigir
      if (brandIdToDelete === brandId) {
        const remainingBrands = brands.filter((b) => b.brand_id !== brandIdToDelete)
        if (remainingBrands.length > 0) {
          // Cambiar a la primera marca disponible
          localStorage.setItem('brand_id', remainingBrands[0].brand_id)
          localStorage.setItem('brand_name', remainingBrands[0].brand_name)
        } else {
          // No hay más marcas, redirigir a onboarding
          localStorage.removeItem('brand_id')
          localStorage.removeItem('brand_name')
          navigate('/onboarding')
          return
        }
      }

      // Invalidar queries para actualizar datos
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] })
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })

      toast.success('Marca eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar marca:', error)
      toast.error(error?.response?.data?.message || 'Error al eliminar la marca')
    }
  }

  // Sincronizar localStorage con brand_id válido cuando hay marcas disponibles
  React.useEffect(() => {
    if (brands.length > 0 && brandId) {
      const storedBrandId = localStorage.getItem('brand_id')
      // Solo guardar si no hay brand_id en localStorage
      if (!storedBrandId) {
        localStorage.setItem('brand_id', brandId)
        if (currentBrand?.brand_name) {
          localStorage.setItem('brand_name', currentBrand.brand_name)
        }
      }
    }
  }, [brands, brandId, currentBrand])

  // Sincronizar brand_name en localStorage cuando se actualiza currentBrand
  React.useEffect(() => {
    if (currentBrand?.brand_name && currentBrand.brand_id === brandId) {
      localStorage.setItem('brand_name', currentBrand.brand_name)
    }
  }, [currentBrand, brandId])

  // Usar el store de Zustand para loyalty programs (sincronizado con CreateClub)
  const {
    programs: loyaltyPrograms,
    isLoading: programsLoading,
    fetchPrograms,
    displayLogos,
    setDisplayLogo,
    updateBrandLogo,
  } = useProgramsStore()

  // Cargar programas cuando hay brandId
  React.useEffect(() => {
    if (brandId) {
      fetchPrograms(brandId)
    }
  }, [brandId, fetchPrograms])

  // El logo viene de brand.logo_url devuelto por el endpoint de programas
  const brandLogoUrl = (brandId && displayLogos[brandId]) || loyaltyPrograms[0]?.brand?.logo_url || null

  const [logoLoadError, setLogoLoadError] = React.useState(false)

  // Resetear el error cuando cambia la marca o el logo
  React.useEffect(() => {
    setLogoLoadError(false)
  }, [brandId, brandLogoUrl])

  // Mostrar loader solo en la primera carga
  if ((meLoading && !meData) || (programsLoading && loyaltyPrograms.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  // Mostrar error si falla la carga de datos del usuario
  if (meError || !meData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Error cargando el dashboard
      </div>
    )
  }

  const currentBrandName = currentBrand?.brand_name || brandNameFromStorage || 'Dashboard'
  const hasBrands = brands.length > 0

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Encabezado con título de marca y botón + - siempre visible */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
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
                      onError={() => setLogoLoadError(true)}
                    />
                  ) : (
                    <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-gray-700 dark:text-gray-300" />
                  )}
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                    {isUploadingLogo ? (
                      <Loader2 className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400 animate-spin" />
                    ) : (
                      <Pencil className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground truncate min-w-0">
                  {currentBrandName}
                </h1>
                {hasBrands && (
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
                      {brands.length > 0 && (
                        <>
                          {brands.map((brand) => (
                            <DropdownMenuItem
                              key={brand.brand_id}
                              onClick={() => handleSelectBrand(brand)}
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
                                      setBrandToDelete(brand)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                )}
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleCreateBrand}
                        className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 text-primary font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Crear nueva marca</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar marca?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar &quot;{brandToDelete?.brand_name}&quot;? Esta acción no se
                        puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          if (brandToDelete) {
                            await handleDeleteBrand(brandToDelete.brand_id)
                            setIsDeleteDialogOpen(false)
                            setBrandToDelete(null)
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

        {/* Contenido del dashboard */}
        <div className="mt-8">
          {!loyaltyPrograms || loyaltyPrograms.length === 0 ? <Step3CTA /> : <DashboardHome brandId={brandId} />}
        </div>
      </div>
    </div>
  )
}
