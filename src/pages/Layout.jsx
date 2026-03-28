import { useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { api } from '@/api/client'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/utils/jwt'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate()
  const urlParams = new URLSearchParams(window.location.search)
  const joinBrandId = urlParams.get('join_brand')
  useEffect(() => {
    document.title = 'Repeat'
  }, [])

  const hasToken = !!localStorage.getItem('auth_token')
  const user = hasToken ? getCurrentUser() : null
  const userLoading = false // Ya no es asíncrono

  // Consultar /auth/me para obtener onboarding_completed y brands
  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me()
      return res?.data
    },
    enabled: !!user, // Solo consultar si hay usuario autenticado
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  // NOTA: api.brands.get() no existe en el YAML de Insomnia
  // const { isError: brandError } = useQuery({
  //   queryKey: ['checkBrand', user?.brand_id],
  //   queryFn: () => api.brands.get(user.brand_id),
  //   enabled: !!user?.brand_id,
  //   retry: false
  // });
  const brandError = false // No disponible - endpoint no existe en YAML

  useEffect(() => {
    // Nota: api.auth.updateMe() no existe en el backend según el YAML
    // Si necesitas actualizar datos del usuario, debe hacerse a través de otro endpoint
    // o el backend debe implementar PATCH /auth/me
    if (user?.brand_id && brandError) {
      // Brand deleted or not found - el token seguirá teniendo brand_id hasta que expire
      // o se actualice manualmente en el backend
      console.warn('Brand no encontrado pero el token aún contiene brand_id')
    }
    // Hard reset for specific user request - comentado porque updateMe no existe
    // if (user?.email === 'giaoliva1@gmail.com' && user?.brand_id === '6929b143307bbaf6a59f14c0') {
    //     api.auth.updateMe({ brand_id: null, app_role: 'owner' }).then(() => {
    //         window.location.reload();
    //     });
    // }
  }, [user, brandError])

  useEffect(() => {
    const handleJoin = async () => {
      // Esperar a que se carguen los datos de /auth/me antes de decidir redirigir
      if (meLoading) {
        return // Aún cargando datos, esperar
      }

      // 1. If user is not logged in but has join link, redirect to login
      if (!userLoading && !user && joinBrandId) {
        // Preservar parámetros de join en la URL al redirigir
        const currentUrl = window.location.href
        api.auth.redirectToLogin(currentUrl)
        return
      }

      if (user && joinBrandId) {
        // Obtener brand_id desde meData si está disponible, sino usar user.brand_id
        const effectiveBrandId = meData?.brands?.[0]?.brand_id || user.brand_id

        if (!effectiveBrandId) {
          // 2. User logged in, no brand -> Join
          // Nota: api.auth.updateMe() no existe en el backend
          // El usuario debe actualizar su información a través de otro endpoint
          // o el backend debe implementar PATCH /auth/me
          toast.info(
            'Para unirte a una marca, contacta al administrador o espera a que se implemente el endpoint de actualización de usuario.',
          )
          // Remove query params
          const url = new URL(window.location)
          url.searchParams.delete('join_brand')
          url.searchParams.delete('branch_id')
          window.history.replaceState({}, '', url)
        } else {
          // 3. User logged in but ALREADY has brand
          if (effectiveBrandId === joinBrandId) {
            toast.info('Ya eres miembro de esta marca.')
          } else {
            toast.error('Ya perteneces a una marca. Debes salirte para unirte a otra.')
          }
          // Remove query param so we don't keep checking
          const url = new URL(window.location)
          url.searchParams.delete('join_brand')
          window.history.replaceState({}, '', url)
        }
      }
    }

    handleJoin()
  }, [user, userLoading, joinBrandId, meData, meLoading, navigate])

  // Pages that should not show the sidebar/navigation
  const publicPages = ['publiccard', 'storelanding']
  const isPublicPage = publicPages.includes(currentPageName?.toLowerCase())

  if (isPublicPage) {
    return <>{children}</>
  }

  // Show loader while checking auth or loading user data
  if (userLoading || (user && meLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500 dark:text-yellow-400" />
        </div>
      </div>
    )
  }

  // Si no hay usuario y hay join_brand, redirigir a login (esto se maneja en el useEffect)
  if (!user && joinBrandId && !userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500 dark:text-yellow-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Sidebar />
      <main className="lg:ml-64 pb-24 lg:pb-0 pt-14 lg:pt-0">{children}</main>
    </div>
  )
}
