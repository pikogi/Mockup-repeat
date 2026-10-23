import { useState } from 'react'
import { Link2 } from 'lucide-react'
import LinksPageView from '@/components/hub/LinksPageView'
import { loadHubConfig } from '@/constants/moonCafeHub'

export default function PublicHubMoonCafe() {
  const [config] = useState(loadHubConfig)

  if (!config.published) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
        <Link2 className="w-10 h-10 text-gray-300" />
        <p className="font-semibold text-gray-700">Esta página no está disponible.</p>
      </div>
    )
  }

  return <LinksPageView config={config} />
}
