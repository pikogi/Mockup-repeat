import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@/utils/jwt'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const hasToken = !!localStorage.getItem('auth_token')
  const user = hasToken ? getCurrentUser() : null
  const isLoading = false // Ya no es asíncrono

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const hasJoinParam = urlParams.has('join_brand')
    const joinBrand = urlParams.get('join_brand')
    const branchId = urlParams.get('branch_id')

    // Si no hay token, redirigir inmediatamente a login (con o sin join param)
    if (!hasToken) {
      let loginUrl = '/login'
      const params = new URLSearchParams()
      if (joinBrand) params.set('join_brand', joinBrand)
      if (branchId) params.set('branch_id', branchId)
      if (params.toString()) {
        loginUrl += '?' + params.toString()
      }
      navigate(loginUrl, { replace: true })
      return
    }

    // Si hay token, esperar a que la query termine
    if (!isLoading) {
      // Si hay join_brand y usuario logueado, dejar que Layout lo maneje
      if (hasJoinParam && user) {
        // Redirigir a dashboard para que Layout procese el join
        navigate('/dashboard', { replace: true })
        return
      }

      // Si no hay join param, manejar redirección normal
      if (!hasJoinParam) {
        if (user) {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      }
    }
  }, [user, isLoading, navigate, hasToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
      <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
    </div>
  )
}
