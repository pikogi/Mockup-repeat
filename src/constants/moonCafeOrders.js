import { MOONCAFE_STORES } from '@/constants/moonCafeClubs'
import { MOONCAFE_MEMBERS } from '@/constants/moonCafeMembers'
import { lineKey } from '@/constants/moonCafeSales'
import { DEFAULT_SHOWCASES, formatShowcasePrice } from '@/constants/moonCafeShowcase'

// Pedidos por WhatsApp de Café Moon. El cliente arma el pedido en la vitrina pública,
// se guarda acá y se abre WhatsApp con el detalle; el comercio lo gestiona en
// /pedidos/mooncafe-demo moviéndolo por las etapas del embudo. Los pedidos semilla se
// regeneran en cada carga relativos a la hora actual; en localStorage solo se guardan
// los pedidos nuevos y los cambios de etapa.
export const ORDERS_STORAGE_KEY = 'repeat_orders_mooncafe'

export const ORDER_STAGES = [
  { id: 'nuevo', label: 'Nuevos', action: 'Confirmar', color: 'bg-sky-500' },
  { id: 'confirmado', label: 'Confirmados', action: 'Preparar', color: 'bg-violet-500' },
  { id: 'preparando', label: 'En preparación', action: 'Marcar listo', color: 'bg-amber-500' },
  { id: 'listo', label: 'Listos', action: 'Entregar', color: 'bg-emerald-500' },
  { id: 'entregado', label: 'Entregados', action: null, color: 'bg-gray-400' },
]

export const stageIndex = (id) => ORDER_STAGES.findIndex((s) => s.id === id)
export const nextStage = (id) => ORDER_STAGES[stageIndex(id) + 1]?.id ?? null

// Demo storefront traffic, used as the top of the conversion funnel.
export const SHOWCASE_VISITS_TODAY = 186

export const ORDER_MODES = {
  pickup: { label: 'Retiro en local' },
  delivery: { label: 'Delivery' },
}

// ─── Phones ───────────────────────────────────────────────────────────────────

export const cleanPhone = (phone) => phone?.replace(/\D/g, '') ?? ''

export const waLink = (phone, text) => `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(text)}`

// Matches on the last 8 digits so "+54 9 351 …" and "351 …" are the same person.
export function findMemberByPhone(phone) {
  const digits = cleanPhone(phone).slice(-8)
  if (digits.length < 8) return null
  return MOONCAFE_MEMBERS.find((m) => cleanPhone(m.phone).slice(-8) === digits) ?? null
}

// ─── Seed orders ──────────────────────────────────────────────────────────────

const MENU = DEFAULT_SHOWCASES.find((s) => s.id === 'menu')

function seedLine(itemId, variantId, qty) {
  const item = MENU.items.find((i) => i.id === itemId)
  const variant = item.variants.find((v) => v.id === variantId)
  return {
    key: lineKey(MENU.id, item.id, variant?.id),
    showcase_id: MENU.id,
    item_id: item.id,
    name: item.name,
    variant_name: variant?.name ?? null,
    category: item.category,
    image_url: item.image_url,
    unit_price: Number(variant?.price ?? item.price),
    qty,
  }
}

const SEED_ORDERS = [
  {
    minutesAgo: 3,
    status: 'nuevo',
    name: 'Sofía Ramírez',
    phone: '+54 9 351 508-7621',
    mode: 'delivery',
    address: 'Bv. San Juan 455, piso 3',
    lines: [
      ['cappuccino', 'v2', 2],
      ['medialunas', null, 1],
    ],
  },
  {
    minutesAgo: 7,
    status: 'nuevo',
    name: 'Julián Pereyra',
    phone: '+54 9 351 677-2041',
    mode: 'pickup',
    lines: [
      ['latte', null, 1],
      ['tostado', null, 1],
    ],
    note: 'El tostado sin tomate, por favor',
  },
  {
    minutesAgo: 14,
    status: 'confirmado',
    name: 'Valentina Cruz',
    phone: '+54 9 351 741-5530',
    mode: 'pickup',
    lines: [['flat-white', null, 2]],
  },
  {
    minutesAgo: 22,
    status: 'preparando',
    name: 'Martina Rojas',
    phone: '+54 9 351 556-1023',
    mode: 'delivery',
    address: 'Obispo Trejo 1020',
    lines: [
      ['bowl', null, 1],
      ['limonada', null, 1],
    ],
  },
  {
    minutesAgo: 31,
    status: 'listo',
    name: 'Nicolás Ferreyra',
    phone: '+54 9 351 402-8817',
    mode: 'pickup',
    lines: [
      ['cold-brew', null, 1],
      ['medialunas', null, 1],
    ],
  },
  {
    minutesAgo: 48,
    status: 'entregado',
    name: 'Carlos Martínez',
    phone: '+54 9 351 412-3344',
    mode: 'pickup',
    lines: [['flat-white', null, 1]],
  },
  {
    minutesAgo: 65,
    status: 'entregado',
    name: 'Paula Giménez',
    phone: '+54 9 351 230-5598',
    mode: 'delivery',
    address: 'Av. Colón 1650',
    lines: [
      ['tostado', null, 2],
      ['cappuccino', 'v1', 2],
    ],
  },
]

const SEED_DELIVERY_FEE = 1500

function buildSeedOrders() {
  const now = Date.now()
  const startOfDay = new Date().setHours(0, 0, 0, 0)
  return SEED_ORDERS.map((o, i) => {
    const lines = o.lines.map(([id, variant, qty]) => seedLine(id, variant, qty))
    const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.qty, 0)
    const deliveryFee = o.mode === 'delivery' ? SEED_DELIVERY_FEE : 0
    return {
      id: `seed-order-${i}`,
      number: 2040 - i,
      created_at: new Date(
        Math.max(now - o.minutesAgo * 60000, startOfDay + (SEED_ORDERS.length - i) * 60000),
      ).toISOString(),
      customer: { name: o.name, phone: o.phone },
      mode: o.mode,
      address: o.address ?? '',
      note: o.note ?? '',
      lines,
      subtotal,
      delivery_fee: deliveryFee,
      total: subtotal + deliveryFee,
      status: o.status,
      sale_id: null,
    }
  })
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const EMPTY_STATE = { created: [], updates: {} }

function loadStored() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY))
    if (parsed && Array.isArray(parsed.created)) return { created: parsed.created, updates: parsed.updates ?? {} }
  } catch {
    /* localStorage puede fallar en navegación privada; arrancamos solo con los pedidos semilla */
  }
  return EMPTY_STATE
}

function saveStored(state) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* si localStorage falla, el cambio queda solo en memoria para esta sesión */
  }
}

// Newest first, with any stage change applied and the member matched by phone.
export function loadOrders() {
  const { created, updates } = loadStored()
  return [...created, ...buildSeedOrders()]
    .map((o) => ({ ...o, ...updates[o.id], member: findMemberByPhone(o.customer.phone) }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function saveNewOrder(order) {
  const state = loadStored()
  saveStored({ ...state, created: [order, ...state.created] })
}

export function updateOrder(id, fields) {
  const state = loadStored()
  saveStored({ ...state, updates: { ...state.updates, [id]: { ...state.updates[id], ...fields } } })
}

export const nextOrderNumber = () => Math.max(2040, ...loadOrders().map((o) => o.number)) + 1

// ─── WhatsApp messages ────────────────────────────────────────────────────────

const lineText = (l) =>
  `• ${l.qty}× ${l.name}${l.variant_name ? ` (${l.variant_name})` : ''} — ${formatShowcasePrice(l.unit_price * l.qty)}`

// Message the customer sends to the store when submitting the order from the showcase.
export function orderMessageForStore(order, brandName) {
  return [
    `¡Hola ${brandName}! Quiero hacer un pedido 🛍️`,
    '',
    `*Pedido #${order.number}*`,
    ...order.lines.map(lineText),
    '',
    order.delivery_fee ? `Subtotal: ${formatShowcasePrice(order.subtotal)}` : null,
    order.delivery_fee ? `Envío: ${formatShowcasePrice(order.delivery_fee)}` : null,
    `*Total: ${formatShowcasePrice(order.total)}*`,
    '',
    order.mode === 'delivery' ? `🛵 Delivery a: ${order.address}` : '🏪 Retiro en el local',
    `👤 ${order.customer.name}`,
    order.note ? `📝 ${order.note}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

// Status update the store sends back to the customer when the order changes stage.
export function orderMessageForCustomer(order, card) {
  const firstName = order.customer.name.split(' ')[0]
  const store = MOONCAFE_STORES[0].store_name
  switch (order.status) {
    case 'nuevo':
    case 'confirmado':
      return `¡Hola ${firstName}! Confirmamos tu pedido #${order.number} por ${formatShowcasePrice(order.total)}. Te avisamos cuando esté listo ☕`
    case 'preparando':
      return `¡Hola ${firstName}! Tu pedido #${order.number} ya está en preparación ☕`
    case 'listo':
      return order.mode === 'delivery'
        ? `¡Hola ${firstName}! Tu pedido #${order.number} ya salió y va en camino 🛵`
        : `¡Hola ${firstName}! Tu pedido #${order.number} está listo. Puedes pasar a retirarlo por ${store}.`
    default:
      if (card) {
        return `¡Gracias por tu pedido, ${firstName}! Sumaste 1 sello en tu tarjeta Moon Club ☕ Llevas ${card.stamps}/5${card.rewardsAvailable ? ' y tienes un café gratis esperándote 🎁' : ''}.`
      }
      return `¡Gracias por tu pedido, ${firstName}! ¿Quieres sumar sellos con cada pedido y ganar cafés gratis? Únete a Moon Club: ${window.location.origin}/publicprogram?demo=mooncafe`
  }
}
