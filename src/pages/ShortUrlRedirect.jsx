import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/api/client'
import { Loader2 } from 'lucide-react'

export default function ShortUrlRedirect() {
  const { code } = useParams()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!code) {
      setError(true)
      return
    }
    api.shortUrls
      .resolve(code)
      .then((res) => {
        const url = res?.data?.original_url
        if (typeof url === 'string') window.location.replace(url)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [code])

  if (error) return <div className="min-h-screen flex items-center justify-center text-gray-500">Enlace no válido</div>

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
    </div>
  )
}
