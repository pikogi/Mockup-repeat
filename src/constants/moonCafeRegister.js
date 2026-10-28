import { cashOf, isVoided, menuLine, salesSummary } from '@/constants/moonCafeSales'
import { loadShowcaseState, saveShowcaseState } from '@/constants/moonCafeShowcase'

// Register shifts (apertura/cierre de caja) and open tables for Café Moon's Caja.
// Until the demo user touches them, both are seeded relative to "now" so the register
// always starts with an open shift and a couple of tables in progress.
export const SHIFT_STORAGE_KEY = 'repeat_shift_mooncafe'
export const TABS_STORAGE_KEY = 'repeat_tabs_mooncafe'

export const DEFAULT_OPENING_CASH = 20000

export const MOONCAFE_TABLES = [...Array.from({ length: 10 }, (_, i) => `Mesa ${i + 1}`), 'Barra']

export const MOVEMENT_REASONS = {
  in: ['Cambio para la caja', 'Aporte del dueño', 'Otro'],
  out: ['Pago a proveedor', 'Retiro del dueño', 'Gastos varios', 'Otro'],
}

export const VOID_REASONS = ['Error de carga', 'Devolución', 'El cliente se arrepintió', 'Otro']

const MINUTE = 60000
const DAY = 86400000
const iso = (ms) => new Date(ms).toISOString()

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* si localStorage falla, el cambio queda solo en memoria para esta sesión */
  }
}

// ─── Shifts ───────────────────────────────────────────────────────────────────

function buildSeedShift() {
  const now = Date.now()
  const startOfDay = new Date().setHours(0, 0, 0, 0)
  const eightAm = new Date().setHours(8, 0, 0, 0)
  // Opens before the oldest seed sale (140 min ago) and never before midnight.
  const openedAt = Math.max(startOfDay, Math.min(eightAm, now - 165 * MINUTE))
  const withdrawalAt = openedAt + 45 * MINUTE
  return {
    id: 'seed-shift',
    store_id: 'store-1',
    cashier_id: 2,
    opened_at: iso(openedAt),
    opening_cash: DEFAULT_OPENING_CASH,
    movements:
      withdrawalAt < now
        ? [{ id: 'seed-mov-1', type: 'out', amount: 5000, reason: 'Pago a proveedor', at: iso(withdrawalAt) }]
        : [],
  }
}

const SEED_HISTORY = [
  { daysAgo: 1, cashier: 3, total: 412300, count: 87, cash: 98400, identifiedPct: 41, counted: 113400, diff: 0 },
  { daysAgo: 2, cashier: 2, total: 386900, count: 79, cash: 91200, identifiedPct: 38, counted: 105900, diff: -300 },
  { daysAgo: 3, cashier: 3, total: 455100, count: 94, cash: 102700, identifiedPct: 36, counted: 117700, diff: 0 },
]

function buildSeedHistory() {
  const eightAm = new Date().setHours(8, 0, 0, 0)
  return SEED_HISTORY.map((h, i) => {
    const opened = eightAm - h.daysAgo * DAY
    const card = Math.round((h.total - h.cash) * 0.55)
    const qr = Math.round((h.total - h.cash) * 0.3)
    const expected = DEFAULT_OPENING_CASH + h.cash - 5000
    return {
      id: `seed-closed-${i}`,
      store_id: 'store-1',
      cashier_id: h.cashier,
      opened_at: iso(opened),
      closed_at: iso(opened + 12 * 60 * MINUTE),
      opening_cash: DEFAULT_OPENING_CASH,
      movements: [
        { id: `seed-closed-mov-${i}`, type: 'out', amount: 5000, reason: 'Pago a proveedor', at: iso(opened) },
      ],
      expected_cash: expected,
      counted_cash: expected + h.diff,
      difference: h.diff,
      note: h.diff ? 'Faltó cambio en un vuelto' : '',
      summary: {
        total: h.total,
        count: h.count,
        average: Math.round(h.total / h.count),
        identifiedPct: h.identifiedPct,
        rewardsRedeemed: 4,
        discountsTotal: 0,
        tipsTotal: Math.round(h.total * 0.04),
        voidedCount: i === 1 ? 1 : 0,
        voidedTotal: i === 1 ? 4200 : 0,
        byMethod: [
          { id: 'efectivo', total: h.cash, count: Math.round(h.count * 0.25) },
          { id: 'tarjeta', total: card, count: Math.round(h.count * 0.4) },
          { id: 'transferencia', total: h.total - h.cash - card - qr, count: Math.round(h.count * 0.1) },
          { id: 'qr', total: qr, count: Math.round(h.count * 0.25) },
        ],
        byCashier: [{ id: h.cashier, total: h.total, count: h.count, tips: Math.round(h.total * 0.04) }],
      },
    }
  })
}

// { current: Shift | null, history: closed shifts, newest first }
export function loadShiftState() {
  const stored = readJSON(SHIFT_STORAGE_KEY)
  if (stored && Array.isArray(stored.history)) return stored
  return { current: buildSeedShift(), history: buildSeedHistory() }
}

export const saveShiftState = (state) => writeJSON(SHIFT_STORAGE_KEY, state)

export const shiftSales = (shift, sales) =>
  sales.filter(
    (s) =>
      (!s.store_id || s.store_id === shift.store_id) &&
      s.created_at >= shift.opened_at &&
      (!shift.closed_at || s.created_at <= shift.closed_at),
  )

export function expectedCash(shift, sales) {
  const cashSales = shiftSales(shift, sales)
    .filter((s) => !isVoided(s))
    .reduce((sum, s) => sum + cashOf(s), 0)
  const ins = shift.movements.filter((m) => m.type === 'in').reduce((sum, m) => sum + m.amount, 0)
  const outs = shift.movements.filter((m) => m.type === 'out').reduce((sum, m) => sum + m.amount, 0)
  return { opening: shift.opening_cash, cashSales, ins, outs, total: shift.opening_cash + cashSales + ins - outs }
}

// JSON-safe copy of salesSummary (no icon components) to keep in the closed shift.
export function shiftSummarySnapshot(shift, sales) {
  const summary = salesSummary(shiftSales(shift, sales))
  return {
    ...summary,
    byMethod: summary.byMethod.map(({ id, total, count }) => ({ id, total, count })),
  }
}

// ─── Open tables ──────────────────────────────────────────────────────────────

const SEED_TABS = [
  {
    table: 'Mesa 3',
    minutesAgo: 25,
    member: 9,
    lines: [
      ['cappuccino', 'v2', 2],
      ['medialunas', null, 1],
    ],
  },
  {
    table: 'Mesa 7',
    minutesAgo: 10,
    member: null,
    lines: [
      ['latte', null, 1],
      ['cheesecake', null, 1],
    ],
  },
]

function buildSeedTabs() {
  const now = Date.now()
  return SEED_TABS.map((t, i) => ({
    id: `seed-tab-${i}`,
    table: t.table,
    opened_at: iso(now - t.minutesAgo * MINUTE),
    member_id: t.member,
    cashier_id: 2,
    lines: t.lines.map(([id, variant, qty]) => menuLine(id, variant, qty)),
  }))
}

export function loadTabs() {
  const stored = readJSON(TABS_STORAGE_KEY)
  return Array.isArray(stored) ? stored : buildSeedTabs()
}

export const saveTabs = (tabs) => writeJSON(TABS_STORAGE_KEY, tabs)

export const tabTotal = (tab) => tab.lines.reduce((sum, l) => sum + l.unit_price * l.qty, 0)

// ─── Stock ────────────────────────────────────────────────────────────────────

// Applies sold (sign -1) or returned (sign +1) quantities to showcase items that track stock.
export function applyStockDelta(lines, sign) {
  const state = loadShowcaseState()
  const qtyByItem = new Map()
  lines
    .filter((l) => !l.custom)
    .forEach((l) => {
      const key = `${l.showcase_id}:${l.item_id}`
      qtyByItem.set(key, (qtyByItem.get(key) ?? 0) + l.qty)
    })
  const showcases = state.showcases.map((s) => ({
    ...s,
    items: s.items.map((i) => {
      const qty = qtyByItem.get(`${s.id}:${i.id}`)
      return qty && i.stock_enabled ? { ...i, stock: Math.max(0, Number(i.stock) + sign * qty) } : i
    }),
  }))
  saveShowcaseState({ ...state, showcases })
  return showcases
}
