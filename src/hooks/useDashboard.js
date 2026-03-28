import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { getCurrentUser } from '@/utils/jwt'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

export function useDashboard() {
  const { t } = useLanguage()
  const user = useMemo(() => getCurrentUser(), [])
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [brandToDelete, setBrandToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [displayLogo, setDisplayLogo] = useState(null)
  const [logoLoadError, setLogoLoadError] = useState(false)
  const logoInputRef = useRef(null)

  // Auth / brands
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

  const brands = useMemo(() => meData?.brands || [], [meData])
  const brandIdFromStorage = localStorage.getItem('brand_id')
  const brandNameFromStorage = localStorage.getItem('brand_name')

  const brandExistsInList = brands.length > 0 && brands.some((brand) => brand.brand_id === brandIdFromStorage)

  const brandId = brandIdFromStorage
    ? brands.length === 0 || brandExistsInList
      ? brandIdFromStorage
      : brands[0]?.brand_id
    : brands[0]?.brand_id || null

  const currentBrand = brands.find((brand) => brand.brand_id === brandId)
  const currentBrandName = currentBrand?.brand_name || brandNameFromStorage || 'Dashboard'
  const hasBrands = brands.length > 0

  // Logo URL — ephemeral display logo (after upload) or from auth/me brand data
  const brandLogoUrl = useMemo(() => {
    if (displayLogo) return displayLogo
    return currentBrand?.logo_url || null
  }, [displayLogo, currentBrand])

  // Reset ephemeral state when brand changes
  useEffect(() => {
    setDisplayLogo(null)
    setLogoLoadError(false)
  }, [brandId])

  // Sync localStorage with valid brandId
  useEffect(() => {
    if (brands.length > 0 && brandId) {
      const storedBrandId = localStorage.getItem('brand_id')
      if (!storedBrandId) {
        localStorage.setItem('brand_id', brandId)
        if (currentBrand?.brand_name) {
          localStorage.setItem('brand_name', currentBrand.brand_name)
        }
      }
    }
  }, [brands, brandId, currentBrand])

  // Sync brand_name when currentBrand updates
  useEffect(() => {
    if (currentBrand?.brand_name && currentBrand.brand_id === brandId) {
      localStorage.setItem('brand_name', currentBrand.brand_name)
    }
  }, [currentBrand, brandId])

  // Logo upload
  const handleLogoChange = useCallback(
    async (e) => {
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

          // Persist versioned URL for page refreshes
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

          // Show base64 immediately
          setDisplayLogo(base64)

          // Invalidate caches so programs refetch with new logo when needed
          queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
          queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms', brandId] })
          queryClient.invalidateQueries({ queryKey: ['brand', brandId] })
          queryClient.invalidateQueries({ queryKey: ['loyaltyProgram'] })

          toast.success(t('dashboardLogoUpdated'))
          setIsUploadingLogo(false)
        }
        reader.onerror = () => {
          toast.error(t('dashboardLogoReadError'))
          setIsUploadingLogo(false)
        }
        reader.readAsDataURL(file)
      } catch {
        toast.error(t('dashboardLogoUpdateError'))
        setIsUploadingLogo(false)
      }
      e.target.value = ''
    },
    [brandId, queryClient, t],
  )

  // Brand selection
  const handleSelectBrand = useCallback(
    (brand) => {
      if (!brand?.brand_id) return
      localStorage.setItem('brand_id', brand.brand_id)
      localStorage.setItem('brand_name', brand.brand_name)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] })
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      window.location.reload()
    },
    [queryClient],
  )

  const handleCreateBrand = useCallback(() => {
    navigate('/onboarding')
  }, [navigate])

  // Brand deletion
  const handleDeleteBrand = useCallback(
    async (brandIdToDelete) => {
      try {
        await api.brands.delete(brandIdToDelete)

        if (brandIdToDelete === brandId) {
          const remainingBrands = brands.filter((b) => b.brand_id !== brandIdToDelete)
          if (remainingBrands.length > 0) {
            localStorage.setItem('brand_id', remainingBrands[0].brand_id)
            localStorage.setItem('brand_name', remainingBrands[0].brand_name)
          } else {
            localStorage.removeItem('brand_id')
            localStorage.removeItem('brand_name')
            navigate('/onboarding')
            return
          }
        }

        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
        queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms'] })
        queryClient.invalidateQueries({ queryKey: ['stores'] })
        queryClient.invalidateQueries({ queryKey: ['customers'] })
        toast.success(t('dashboardBrandDeleted'))
      } catch (error) {
        console.error('Error deleting brand:', error)
        toast.error(error?.response?.data?.message || t('dashboardBrandDeleteError'))
      }
    },
    [brandId, brands, navigate, queryClient, t],
  )

  return {
    // Data
    brandId,
    brands,
    currentBrand,
    currentBrandName,
    hasBrands,
    brandLogoUrl,
    meData,

    // Loading / error
    isLoading: meLoading,
    isError: meError,

    // Logo
    handleLogoChange,
    isUploadingLogo,
    logoLoadError,
    setLogoLoadError,
    logoInputRef,

    // Brand management
    handleSelectBrand,
    handleCreateBrand,
    handleDeleteBrand,
    brandToDelete,
    setBrandToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  }
}
