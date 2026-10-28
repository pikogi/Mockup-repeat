import { ArrowLeftRight, Banknote, CreditCard, QrCode, Split } from 'lucide-react'
import { MOONCAFE_MEMBERS, MOONCAFE_STAMPS_PROGRAM } from '@/constants/moonCafeMembers'
import { DEFAULT_SHOWCASES } from '@/constants/moonCafeShowcase'
import { MOONCAFE_TEAM } from '@/constants/moonCafeTeam'

// Caja (POS liviano) de Café Moon. Las ventas que se cobran en /caja/mooncafe-demo se
// guardan en localStorage; las ventas "semilla" del día se generan en cada carga
// relativas a la hora actual, así "Ventas de hoy" nunca arranca vacío en una demo.
export const SALES_STORAGE_KEY = 'repeat_sales_mooncafe'
// Voided sales live apart ({ [saleId]: { voided_at, reason, by } }) so seed sales can be voided too.
export const VOIDS_STORAGE_KEY = 'repeat_sales_voids_mooncafe'

export const STAMPS_REQUIRED = MOONCAFE_STAMPS_PROGRAM.program_rules.stamps_required
// Category whose cheapest item is discounted when a member redeems their free coffee.
export const REWARD_CATEGORY = 'Cafés'

export const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'transferencia', label: 'Transferencia', icon: ArrowLeftRight },
  { id: 'qr', label: 'QR', icon: QrCode },
]

// Only used to display sales paid with more than one method.
const MIXED_PAYMENT = { id: 'mixto', label: 'Mixto', icon: Split }

export const paymentMethod = (id) =>
  id === MIXED_PAYMENT.id ? MIXED_PAYMENT : (PAYMENT_METHODS.find((m) => m.id === id) ?? PAYMENT_METHODS[0])

// Sales charged before split payments existed (and WhatsApp orders) only have payment_method.
// Payments include the tip, since it's charged in the same transaction.
export const salePayments = (sale) =>
  sale.payments ?? [{ method: sale.payment_method, amount: sale.total + (sale.tip ?? 0) }]

export const cashOf = (sale) =>
  salePayments(sale)
    .filter((p) => p.method === 'efectivo')
    .reduce((sum, p) => sum + p.amount, 0)

export const isVoided = (sale) => sale.status === 'voided'

export const lineKey = (showcaseId, itemId, variantId) => [showcaseId, itemId, variantId].filter(Boolean).join(':')

// ─── Seed sales ───────────────────────────────────────────────────────────────

const SEED_TICKETS = [
  {
    minutesAgo: 12,
    member: 2,
    pay: 'qr',
    lines: [
      ['flat-white', null, 1],
      ['medialunas', null, 1],
    ],
  },
  { minutesAgo: 27, member: null, pay: 'efectivo', lines: [['cappuccino', 'v2', 2]] },
  {
    minutesAgo: 41,
    member: 11,
    tip: 10,
    table: 'Mesa 2',
    pay: 'tarjeta',
    lines: [
      ['latte', null, 1],
      ['cheesecake', null, 1],
    ],
  },
  {
    minutesAgo: 58,
    member: null,
    pay: 'tarjeta',
    lines: [
      ['tostado', null, 1],
      ['limonada', null, 1],
    ],
  },
  {
    minutesAgo: 76,
    member: 5,
    tip: 10,
    pay: 'transferencia',
    lines: [
      ['bowl', null, 1],
      ['cold-brew', null, 1],
    ],
  },
  { minutesAgo: 95, member: null, pay: 'efectivo', lines: [['flat-white', null, 1]] },
  {
    minutesAgo: 118,
    member: 6,
    pay: 'qr',
    lines: [
      ['cappuccino', 'v1', 1],
      ['medialunas', null, 2],
    ],
  },
  {
    minutesAgo: 140,
    member: null,
    table: 'Mesa 6',
    pay: 'tarjeta',
    lines: [
      ['latte', null, 2],
      ['tostado', null, 2],
    ],
  },
]

const MENU = DEFAULT_SHOWCASES.find((s) => s.id === 'menu')

// Ticket line for a menu item, used by seed sales and seed open tables.
export function menuLine(itemId, variantId, qty) {
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

function buildSeedSales() {
  const now = Date.now()
  const startOfDay = new Date().setHours(0, 0, 0, 0)
  return SEED_TICKETS.map((t, i) => {
    const lines = t.lines.map(([id, variant, qty]) => menuLine(id, variant, qty))
    const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.qty, 0)
    const tip = t.tip ? Math.round((subtotal * t.tip) / 100) : 0
    return {
      id: `seed-${i}`,
      number: 1000 + SEED_TICKETS.length - i,
      // Early in the morning there isn't room for 140 minutes of sales: squeeze them into today.
      created_at: new Date(
        Math.max(now - t.minutesAgo * 60000, startOfDay + (SEED_TICKETS.length - i) * 60000),
      ).toISOString(),
      lines,
      subtotal,
      discount: 0,
      total: subtotal,
      payment_method: t.pay,
      tip,
      payments: [{ method: t.pay, amount: subtotal + tip }],
      member_id: t.member,
      stamps_earned: t.member ? 1 : 0,
      reward_redeemed: false,
      cashier_id: MOONCAFE_TEAM[i % MOONCAFE_TEAM.length].id,
      store_id: 'store-1',
      table: t.table ?? null,
    }
  })
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function loadStoredSales() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SALES_STORAGE_KEY))
    if (Array.isArray(parsed)) return parsed
  } catch {
    /* localStorage puede fallar en navegación privada; arrancamos sin ventas guardadas */
  }
  return []
}

function loadVoids() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VOIDS_STORAGE_KEY))
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    /* sin anulaciones guardadas */
  }
  return {}
}

// Newest first: stored (real demo) sales, then today's seed sales, with voids applied.
export function loadSales() {
  const voids = loadVoids()
  return [...loadStoredSales(), ...buildSeedSales()]
    .map((s) => (voids[s.id] ? { ...s, status: 'voided', void: voids[s.id] } : s))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function voidSaleById(id, info) {
  try {
    localStorage.setItem(VOIDS_STORAGE_KEY, JSON.stringify({ ...loadVoids(), [id]: info }))
  } catch {
    /* si localStorage falla, la anulación no se guarda */
  }
}

export function saveSale(sale) {
  try {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify([sale, ...loadStoredSales()]))
  } catch {
    /* si localStorage falla, la venta queda solo en memoria para esta sesión */
  }
}

export const nextTicketNumber = (sales) => Math.max(1000, ...sales.map((s) => s.number)) + 1

export const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString()

// ─── Loyalty ──────────────────────────────────────────────────────────────────

// Stamps card of a member after applying every POS sale on top of the demo balance:
// every STAMPS_REQUIRED stamps turn into a free coffee that stays available until redeemed.
export function memberLoyalty(member, sales) {
  // A voided sale gives back its stamp and, if it redeemed one, the free coffee.
  const own = sales.filter((s) => s.member_id === member.id && !isVoided(s))
  const totalStamps = member.balance + own.reduce((sum, s) => sum + s.stamps_earned, 0)
  const redeemed = own.filter((s) => s.reward_redeemed).length
  const lastSale = own.reduce((last, s) => (!last || s.created_at > last ? s.created_at : last), null)
  return {
    stamps: totalStamps % STAMPS_REQUIRED,
    rewardsAvailable: Math.max(0, Math.floor(totalStamps / STAMPS_REQUIRED) - redeemed),
    purchases: own.length,
    redeemed,
    lastSale,
  }
}

// Demo members with their balance, visits and last visit updated by POS sales.
export function membersWithSales(sales) {
  return MOONCAFE_MEMBERS.map((m) => {
    const loyalty = memberLoyalty(m, sales)
    if (!loyalty.purchases) return m
    const daysAgo = Math.max(0, Math.floor((Date.now() - new Date(loyalty.lastSale)) / 86400000))
    return {
      ...m,
      balance: loyalty.stamps,
      visits: m.visits + loyalty.purchases,
      rewards: m.rewards + loyalty.redeemed,
      firstTxDaysAgo: Math.min(m.firstTxDaysAgo ?? daysAgo, daysAgo),
    }
  })
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export function salesSummary(allSales) {
  const sales = allSales.filter((s) => !isVoided(s))
  const voided = allSales.filter(isVoided)
  const total = sales.reduce((sum, s) => sum + s.total, 0)
  const identified = sales.filter((s) => s.member_id).length
  const payments = sales.flatMap(salePayments)
  const cashierIds = [...new Set(sales.map((s) => s.cashier_id).filter(Boolean))]
  return {
    total,
    count: sales.length,
    average: sales.length ? Math.round(total / sales.length) : 0,
    identifiedPct: sales.length ? Math.round((identified / sales.length) * 100) : 0,
    rewardsRedeemed: sales.filter((s) => s.reward_redeemed).length,
    discountsTotal: sales.reduce((sum, s) => sum + (s.manual_discount?.amount ?? 0), 0),
    tipsTotal: sales.reduce((sum, s) => sum + (s.tip ?? 0), 0),
    voidedCount: voided.length,
    voidedTotal: voided.reduce((sum, s) => sum + s.total, 0),
    byMethod: PAYMENT_METHODS.map((m) => {
      const own = payments.filter((p) => p.method === m.id)
      return { ...m, count: own.length, total: own.reduce((sum, p) => sum + p.amount, 0) }
    }),
    byCashier: cashierIds.map((id) => {
      const own = sales.filter((s) => s.cashier_id === id)
      return {
        id,
        count: own.length,
        total: own.reduce((sum, s) => sum + s.total, 0),
        tips: own.reduce((sum, s) => sum + (s.tip ?? 0), 0),
      }
    }),
  }
}
