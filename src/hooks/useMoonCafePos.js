import { useEffect, useMemo, useState } from 'react'
import { MOONCAFE_MEMBERS } from '@/constants/moonCafeMembers'
import { modifiersPrice } from '@/constants/moonCafeModifiers'
import { applyStockDelta, loadTabs, saveTabs, TABS_STORAGE_KEY } from '@/constants/moonCafeRegister'
import {
  isToday,
  lineKey,
  loadSales,
  memberLoyalty,
  membersWithSales,
  nextTicketNumber,
  REWARD_CATEGORY,
  SALES_STORAGE_KEY,
  salesSummary,
  saveSale,
  VOIDS_STORAGE_KEY,
  voidSaleById,
} from '@/constants/moonCafeSales'
import { isOutOfStock, loadShowcaseState, SHOWCASE_STORAGE_KEY } from '@/constants/moonCafeShowcase'
import { genId } from '@/hooks/useMoonCafeShowcase'

// Every visible showcase item, flattened into one catalog for the register.
function buildCatalog(showcases) {
  return showcases.flatMap((s) =>
    s.items.filter((i) => i.visible).map((i) => ({ ...i, showcase_id: s.id, key: lineKey(s.id, i.id) })),
  )
}

// Manual discount amount over what's left after the reward: a percentage or a fixed amount.
function manualDiscountAmount(discount, base) {
  if (!discount || base <= 0) return 0
  const value = Number(discount.value) || 0
  const amount = discount.type === 'percent' ? Math.round((base * value) / 100) : value
  return Math.min(base, Math.max(0, amount))
}

// State for the Café Moon register: catalog (from the showcases), the open ticket, open
// tables and the day's sales. Everything persists to localStorage; other tabs update live.
export default function useMoonCafePos() {
  const [showcases, setShowcases] = useState(() => loadShowcaseState().showcases)
  const [sales, setSales] = useState(loadSales)
  const [lines, setLines] = useState([])
  const [memberId, setMemberId] = useState(null)
  const [redeemReward, setRedeemReward] = useState(false)
  const [payment, setPayment] = useState('tarjeta')
  // null = single payment method; otherwise rows of { id, method, amount }.
  const [split, setSplit] = useState(null)
  const [manualDiscount, setManualDiscount] = useState(null)
  // null, { type: 'percent', value } or { type: 'amount', value }
  const [tip, setTip] = useState(null)
  const [tabs, setTabs] = useState(loadTabs)
  const [activeTabId, setActiveTabId] = useState(null)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SHOWCASE_STORAGE_KEY) setShowcases(loadShowcaseState().showcases)
      if (e.key === SALES_STORAGE_KEY || e.key === VOIDS_STORAGE_KEY) setSales(loadSales())
      if (e.key === TABS_STORAGE_KEY) setTabs(loadTabs())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const catalog = useMemo(() => buildCatalog(showcases), [showcases])
  const categories = useMemo(() => [...new Set(catalog.map((i) => i.category).filter(Boolean))], [catalog])
  const members = useMemo(() => membersWithSales(sales), [sales])
  const member = members.find((m) => m.id === memberId) ?? null
  // Loyalty is computed from the raw demo member (not the sales-adjusted one) to avoid double counting.
  const rawMember = MOONCAFE_MEMBERS.find((m) => m.id === memberId)
  const memberCard = useMemo(() => (rawMember ? memberLoyalty(rawMember, sales) : null), [rawMember, sales])

  // ─── Ticket ───
  // Options (milk, extras…) and the note are part of the line key, so a cappuccino with
  // almond milk and a regular one stay as separate lines.
  const addItem = (item, variant, { modifiers = [], note = '' } = {}) => {
    if (isOutOfStock(item)) return
    const cleanNote = note.trim()
    const key = [
      lineKey(item.showcase_id, item.id, variant?.id),
      ...modifiers.map((m) => `${m.group}.${m.id}`),
      cleanNote,
    ]
      .filter(Boolean)
      .join('|')
    const basePrice = Number(variant?.price ?? item.price ?? 0)
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
      return [
        ...prev,
        {
          key,
          showcase_id: item.showcase_id,
          item_id: item.id,
          name: item.name,
          variant_name: variant?.name ?? null,
          category: item.category,
          image_url: item.image_url,
          base_price: basePrice,
          unit_price: basePrice + modifiersPrice(modifiers),
          modifiers,
          note: cleanNote,
          qty: 1,
        },
      ]
    })
  }

  const changeQty = (key, delta) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0))

  const removeLine = (key) => setLines((prev) => prev.filter((l) => l.key !== key))

  // "Monto libre": an amount that isn't in the catalog (e.g. "Varios").
  const addCustomLine = (name, amount) =>
    setLines((prev) => [
      ...prev,
      {
        key: `custom-${genId()}`,
        custom: true,
        name: name.trim() || 'Varios',
        variant_name: null,
        category: null,
        image_url: null,
        unit_price: Number(amount),
        qty: 1,
      },
    ])

  const selectMember = (id) => {
    setMemberId(id)
    setRedeemReward(false)
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.qty, 0)
  const rewardLine = lines
    .filter((l) => l.category === REWARD_CATEGORY)
    .reduce((cheapest, l) => (!cheapest || l.unit_price < cheapest.unit_price ? l : cheapest), null)
  const canRedeem = Boolean(memberCard?.rewardsAvailable && rewardLine)
  // `discount` is the redeemed reward; the manual discount applies to what's left. The free
  // coffee covers the coffee itself: paid extras (almond milk, extra shot) are still charged.
  const discount = redeemReward && canRedeem ? (rewardLine.base_price ?? rewardLine.unit_price) : 0
  const manualAmount = manualDiscountAmount(manualDiscount, subtotal - discount)
  const total = subtotal - discount - manualAmount

  // The tip is charged on top of the total but isn't a sale: it's reported apart so the
  // owner can split it among the staff.
  const tipAmount = !tip
    ? 0
    : tip.type === 'percent'
      ? Math.round((total * tip.value) / 100)
      : Math.max(0, Number(tip.value) || 0)
  const charge = total + tipAmount

  const payments = split
    ? split.filter((p) => Number(p.amount) > 0).map((p) => ({ method: p.method, amount: Number(p.amount) }))
    : [{ method: payment, amount: charge }]
  const paid = payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = charge - paid
  const canCheckout = lines.length > 0 && (!split || remaining === 0)

  // Starts a split payment with part in cash and the rest by card.
  const startSplit = () =>
    setSplit([
      { id: genId(), method: 'efectivo', amount: '' },
      { id: genId(), method: 'tarjeta', amount: String(charge) },
    ])

  // ─── Open tables ───
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null

  const writeTabs = (next) => {
    saveTabs(next)
    setTabs(next)
  }

  // Keeps the open table in sync with the ticket while it's loaded in the register.
  useEffect(() => {
    if (!activeTabId) return
    const current = loadTabs()
    writeTabs(current.map((t) => (t.id === activeTabId ? { ...t, lines, member_id: memberId } : t)))
  }, [activeTabId, lines, memberId])

  const resetTicket = () => {
    setLines([])
    setMemberId(null)
    setRedeemReward(false)
    setManualDiscount(null)
    setTip(null)
    setSplit(null)
    setActiveTabId(null)
  }

  // Saves the ticket to a table (adding to it if it's already open) and frees the register.
  const saveToTab = (table, cashierId) => {
    const current = loadTabs()
    const existing = current.find((t) => t.table === table)
    if (existing) {
      const merged = [...existing.lines]
      lines.forEach((l) => {
        const i = merged.findIndex((m) => m.key === l.key)
        if (i >= 0) merged[i] = { ...merged[i], qty: merged[i].qty + l.qty }
        else merged.push(l)
      })
      writeTabs(
        current.map((t) => (t.id === existing.id ? { ...t, lines: merged, member_id: t.member_id ?? memberId } : t)),
      )
    } else {
      writeTabs([
        ...current,
        {
          id: genId(),
          table,
          opened_at: new Date().toISOString(),
          member_id: memberId,
          cashier_id: cashierId,
          lines,
        },
      ])
    }
    resetTicket()
  }

  const openTab = (id) => {
    const tab = loadTabs().find((t) => t.id === id)
    if (!tab) return
    setLines(tab.lines)
    setMemberId(tab.member_id)
    setRedeemReward(false)
    setManualDiscount(null)
    setTip(null)
    setSplit(null)
    setActiveTabId(id)
  }

  // Leaves the table open and goes back to a quick sale; an emptied table is closed.
  const leaveTab = () => {
    if (lines.length === 0) writeTabs(loadTabs().filter((t) => t.id !== activeTabId))
    resetTicket()
  }

  // Charges the ticket: persists the sale (with who charged it, where and how), awards a
  // stamp to the member, discounts stock and closes the table. Returns the sale plus the
  // member's new card.
  const checkout = (shift) => {
    const methods = [...new Set(payments.map((p) => p.method))]
    const sale = {
      id: genId(),
      number: nextTicketNumber(sales),
      created_at: new Date().toISOString(),
      lines,
      subtotal,
      discount,
      manual_discount: manualAmount ? { ...manualDiscount, amount: manualAmount } : null,
      total,
      tip: tipAmount,
      payment_method: methods.length > 1 ? 'mixto' : methods[0],
      payments,
      member_id: memberId,
      stamps_earned: memberId ? 1 : 0,
      reward_redeemed: discount > 0,
      cashier_id: shift?.cashier_id ?? null,
      store_id: shift?.store_id ?? null,
      table: activeTab?.table ?? null,
    }
    saveSale(sale)
    const nextSales = loadSales()
    setSales(nextSales)
    setShowcases(applyStockDelta(lines, -1))
    if (activeTab) writeTabs(loadTabs().filter((t) => t.id !== activeTab.id))

    const result = { sale, member, card: rawMember ? memberLoyalty(rawMember, nextSales) : null }
    resetTicket()
    return result
  }

  // Voids a sale: it leaves the KPIs and the cash count, the member gets back the stamp
  // (and the free coffee, if they redeemed it) and sold items go back to stock.
  const voidSale = (sale, reason, by) => {
    voidSaleById(sale.id, { voided_at: new Date().toISOString(), reason, by })
    // Seed sales never discounted stock, so there's nothing to give back.
    if (!sale.id.startsWith('seed-')) setShowcases(applyStockDelta(sale.lines, 1))
    setSales(loadSales())
  }

  const todaySales = useMemo(() => sales.filter((s) => isToday(s.created_at)), [sales])
  const summary = useMemo(() => salesSummary(todaySales), [todaySales])

  return {
    catalog,
    categories,
    members,
    sales,
    todaySales,
    summary,
    lines,
    member,
    memberCard,
    payment,
    setPayment,
    split,
    setSplit,
    startSplit,
    payments,
    remaining,
    canCheckout,
    manualDiscount,
    setManualDiscount,
    manualAmount,
    tip,
    setTip,
    tipAmount,
    charge,
    tabs,
    activeTab,
    saveToTab,
    openTab,
    leaveTab,
    addCustomLine,
    voidSale,
    redeemReward,
    setRedeemReward,
    canRedeem,
    rewardLine,
    subtotal,
    discount,
    total,
    addItem,
    changeQty,
    removeLine,
    selectMember,
    resetTicket,
    checkout,
  }
}
