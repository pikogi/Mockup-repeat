import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  findMemberByPhone,
  loadOrders,
  nextOrderNumber,
  ORDERS_STORAGE_KEY,
  saveNewOrder,
  SHOWCASE_VISITS_TODAY,
  updateOrder,
} from '@/constants/moonCafeOrders'
import { loadShiftState } from '@/constants/moonCafeRegister'
import {
  isToday,
  lineKey,
  loadSales,
  memberLoyalty,
  nextTicketNumber,
  SALES_STORAGE_KEY,
  saveSale,
} from '@/constants/moonCafeSales'
import { loadShowcaseState } from '@/constants/moonCafeShowcase'
import { genId } from '@/hooks/useMoonCafeShowcase'

// Customers used by "Simular pedido": a mix of club members and people who aren't in the club yet.
const SIMULATED_CUSTOMERS = [
  { name: 'Lucía Herrera', phone: '+54 9 351 899-2267' },
  { name: 'Mateo Flores', phone: '+54 9 351 312-4480' },
  { name: 'Tomás Navarro', phone: '+54 9 351 621-8874' },
  { name: 'Agustina Paz', phone: '+54 9 351 588-3310' },
  { name: 'Federico Luna', phone: '+54 9 351 744-9021' },
  { name: 'Romina Sosa', phone: '+54 9 351 615-7702' },
]
const SIMULATED_ADDRESSES = ['Av. Vélez Sarsfield 780', 'Duarte Quirós 1234, 2°B', 'Belgrano 455']

const pick = (list) => list[Math.floor(Math.random() * list.length)]

function buildSimulatedOrder(deliveryFee) {
  const menu = loadShowcaseState().showcases.find((s) => s.id === 'menu')
  const items = menu.items.filter((i) => i.visible && !(i.stock_enabled && Number(i.stock) === 0))
  const chosen = [...items].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3))
  const lines = chosen.map((item) => {
    const variant = item.price_type === 'variants' ? pick(item.variants) : null
    return {
      key: lineKey(menu.id, item.id, variant?.id),
      showcase_id: menu.id,
      item_id: item.id,
      name: item.name,
      variant_name: variant?.name ?? null,
      category: item.category,
      image_url: item.image_url,
      unit_price: Number(variant?.price ?? item.price),
      qty: 1 + Math.floor(Math.random() * 2),
    }
  })
  const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.qty, 0)
  const delivery = Math.random() < 0.5
  const fee = delivery ? Number(deliveryFee) || 0 : 0
  return {
    id: genId(),
    number: nextOrderNumber(),
    created_at: new Date().toISOString(),
    customer: pick(SIMULATED_CUSTOMERS),
    mode: delivery ? 'delivery' : 'pickup',
    address: delivery ? pick(SIMULATED_ADDRESSES) : '',
    note: '',
    lines,
    subtotal,
    delivery_fee: fee,
    total: subtotal + fee,
    status: 'nuevo',
    sale_id: null,
  }
}

// WhatsApp orders board for Café Moon. Orders placed from the public showcase in
// another tab show up live (storage event) with a toast.
export default function useMoonCafeOrders() {
  const [orders, setOrders] = useState(loadOrders)
  const [sales, setSales] = useState(loadSales)
  const knownIds = useRef(new Set(orders.map((o) => o.id)))

  const reload = () => {
    const next = loadOrders()
    next
      .filter((o) => !knownIds.current.has(o.id))
      .forEach((o) => toast.success(`Nuevo pedido #${o.number}`, { description: `${o.customer.name} · por WhatsApp` }))
    knownIds.current = new Set(next.map((o) => o.id))
    setOrders(next)
  }

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ORDERS_STORAGE_KEY) reload()
      if (e.key === SALES_STORAGE_KEY) setSales(loadSales())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const move = (id, status) => {
    updateOrder(id, { status })
    reload()
  }

  // Delivers and charges the order: registers the sale in the register (Caja), which
  // awards the stamp when the phone belongs to a club member.
  const deliver = (order, paymentMethod) => {
    const member = findMemberByPhone(order.customer.phone)
    const currentSales = loadSales()
    // Charged into the open register shift (if any) so cash orders count in the closing.
    const shift = loadShiftState().current
    const sale = {
      id: genId(),
      number: nextTicketNumber(currentSales),
      created_at: new Date().toISOString(),
      lines: order.lines,
      subtotal: order.subtotal,
      discount: 0,
      total: order.total,
      payment_method: paymentMethod,
      payments: [{ method: paymentMethod, amount: order.total }],
      member_id: member?.id ?? null,
      stamps_earned: member ? 1 : 0,
      reward_redeemed: false,
      channel: 'whatsapp',
      order_number: order.number,
      cashier_id: shift?.cashier_id ?? null,
      store_id: shift?.store_id ?? 'store-1',
    }
    saveSale(sale)
    updateOrder(order.id, { status: 'entregado', sale_id: sale.id, payment_method: paymentMethod })
    const nextSales = loadSales()
    setSales(nextSales)
    reload()
    return member ? memberLoyalty(member, nextSales) : null
  }

  const simulate = (deliveryFee) => {
    saveNewOrder(buildSimulatedOrder(deliveryFee))
    reload()
  }

  const cardFor = (order) => (order.member ? memberLoyalty(order.member, sales) : null)

  const active = useMemo(() => orders.filter((o) => o.status !== 'cancelado'), [orders])

  const metrics = useMemo(() => {
    const today = active.filter((o) => isToday(o.created_at))
    const confirmed = today.filter((o) => o.status !== 'nuevo')
    const delivered = today.filter((o) => o.status === 'entregado')
    const revenue = today.reduce((sum, o) => sum + o.total, 0)
    return {
      funnel: [
        { label: 'Visitas a la vitrina', value: SHOWCASE_VISITS_TODAY + today.length * 3 },
        { label: 'Pedidos por WhatsApp', value: today.length },
        { label: 'Confirmados', value: confirmed.length },
        { label: 'Entregados', value: delivered.length },
      ],
      revenue,
      average: today.length ? Math.round(revenue / today.length) : 0,
      memberPct: today.length ? Math.round((today.filter((o) => o.member).length / today.length) * 100) : 0,
      inProgress: today.length - delivered.length,
    }
  }, [active])

  return { orders: active, metrics, move, deliver, simulate, cardFor }
}
