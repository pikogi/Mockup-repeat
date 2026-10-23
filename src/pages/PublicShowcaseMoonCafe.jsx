import { useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import ShowcaseView from '@/components/showcase/ShowcaseView'
import { DEFAULT_SHOWCASES } from '@/constants/moonCafeShowcase'
import useMoonCafeShowcase from '@/hooks/useMoonCafeShowcase'

export default function PublicShowcaseMoonCafe() {
  const { showcaseId } = useParams()
  const { brand, showcases } = useMoonCafeShowcase()
  // Fallback to the sample data so a shared link never looks empty on a new device.
  const showcase = showcases.find((s) => s.id === showcaseId) ?? DEFAULT_SHOWCASES.find((s) => s.id === showcaseId)

  if (!showcase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
        <ShoppingBag className="w-10 h-10 text-gray-300" />
        <p className="font-semibold text-gray-700">Esta vitrina no existe o ya no está disponible.</p>
      </div>
    )
  }

  return <ShowcaseView brand={brand} showcase={showcase} />
}
