import ShowcaseView from '@/components/showcase/ShowcaseView'
import { BURGER_BRAND, BURGER_SHOWCASE } from '@/constants/burgerShowcase'
import { orderMessageForStore, waLink } from '@/constants/moonCafeOrders'

// Toro Burgers has no admin, so orders aren't stored: the page only numbers them and
// builds the WhatsApp message.
let lastOrderNumber = 1200

const ordering = {
  deliveryEnabled: BURGER_BRAND.delivery_enabled,
  deliveryFee: BURGER_BRAND.delivery_fee,
  notePlaceholder: 'Ej: sin cebolla, timbre 3B',
  findMember: () => null,
  onSubmit: (draft) => {
    const order = { ...draft, number: ++lastOrderNumber }
    return { ...order, whatsappUrl: waLink(BURGER_BRAND.whatsapp, orderMessageForStore(order, BURGER_BRAND.name)) }
  },
}

export default function PublicShowcaseBurger() {
  return <ShowcaseView brand={BURGER_BRAND} showcase={BURGER_SHOWCASE} ordering={ordering} />
}
