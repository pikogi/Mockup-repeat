import { useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import ShowcaseView from '@/components/showcase/ShowcaseView'
import {
  findMemberByPhone,
  nextOrderNumber,
  orderMessageForStore,
  saveNewOrder,
  waLink,
} from '@/constants/moonCafeOrders'
import { loadSales, memberLoyalty } from '@/constants/moonCafeSales'
import { DEFAULT_SHOWCASES } from '@/constants/moonCafeShowcase'
import useMoonCafeShowcase, { genId } from '@/hooks/useMoonCafeShowcase'

// `withOrdering` (roadmap only, /showcase-roadmap/...) adds the WhatsApp ordering cart.
export default function PublicShowcaseMoonCafe({ withOrdering = false }) {
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

  // Saves the order (it shows up in the admin's Pedidos board) and builds the WhatsApp
  // message the customer sends to the store.
  const ordering = withOrdering && {
    deliveryEnabled: brand.delivery_enabled,
    deliveryFee: brand.delivery_fee,
    findMember: (phone) => {
      const member = findMemberByPhone(phone)
      return member && { name: member.name, ...memberLoyalty(member, loadSales()) }
    },
    onSubmit: (draft) => {
      const order = {
        ...draft,
        id: genId(),
        number: nextOrderNumber(),
        created_at: new Date().toISOString(),
        status: 'nuevo',
        sale_id: null,
      }
      saveNewOrder(order)
      return { ...order, whatsappUrl: waLink(brand.whatsapp, orderMessageForStore(order, brand.name)) }
    },
  }

  return <ShowcaseView brand={brand} showcase={showcase} ordering={ordering || undefined} />
}
