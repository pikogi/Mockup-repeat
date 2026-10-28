import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Armchair,
  Ban,
  Check,
  ChevronDown,
  Gift,
  PenLine,
  Percent,
  Split,
  Minus,
  Plus,
  QrCode,
  Receipt,
  ScanLine,
  Search,
  Stamp,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { ItemOptionsDialog } from '@/components/pos/ItemOptionsDialog'
import {
  CustomAmountDialog,
  DiscountDialog,
  SplitPayment,
  TablePicker,
  TipSelector,
  VoidSaleDialog,
} from '@/components/pos/TicketExtras'
import WhatsAppIcon from '@/components/shared/WhatsAppIcon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MOONCAFE_MEMBERS } from '@/constants/moonCafeMembers'
import { lineOptionsText, modifierGroupsFor } from '@/constants/moonCafeModifiers'
import {
  cashOf,
  isVoided,
  memberLoyalty,
  paymentMethod,
  PAYMENT_METHODS,
  salePayments,
  STAMPS_REQUIRED,
} from '@/constants/moonCafeSales'
import { formatShowcasePrice, isOutOfStock, itemDisplayPrice } from '@/constants/moonCafeShowcase'
import { cashierName } from '@/constants/moonCafeTeam'
import { cn } from '@/lib/utils'

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

const formatTime = (iso) => new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

function StampDots({ filled, size = 'md' }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: STAMPS_REQUIRED }, (_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full flex items-center justify-center',
            size === 'sm' ? 'w-3 h-3' : 'w-6 h-6',
            i < filled ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700',
          )}
        >
          {size !== 'sm' && i < filled && <Check className="w-3.5 h-3.5" />}
        </span>
      ))}
    </div>
  )
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export function PosCatalog({ catalog, categories, onAdd, onCustom }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [optionsItem, setOptionsItem] = useState(null)
  const [customOpen, setCustomOpen] = useState(false)

  const items = catalog.filter(
    (i) =>
      (category === 'all' || i.category === category) &&
      (!query.trim() || i.name.toLowerCase().includes(query.trim().toLowerCase())),
  )

  const handleClick = (item) => {
    if (isOutOfStock(item)) return
    const hasVariants = item.price_type === 'variants' && item.variants.length > 0
    if (hasVariants || modifierGroupsFor(item).length > 0) setOptionsItem(item)
    else onAdd(item)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto"
          className="pl-9"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {['all', ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors',
              category === c
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700',
            )}
          >
            {c === 'all' ? 'Todo' : c}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-12">No encontramos productos con esa búsqueda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-3">
          {category === 'all' && !query.trim() && (
            <button
              onClick={() => setCustomOpen(true)}
              className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-2 p-4 min-h-[160px] text-gray-500 hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-colors"
            >
              <PenLine className="w-6 h-6" />
              <span className="text-sm font-semibold">Monto libre</span>
              <span className="text-xs text-center">Cobra algo que no está en el catálogo</span>
            </button>
          )}
          {items.map((item) => {
            const out = isOutOfStock(item)
            return (
              <button
                key={item.key}
                onClick={() => handleClick(item)}
                disabled={out}
                className={cn(
                  'group text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all',
                  out ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
                )}
              >
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                  {item.image_url && (
                    <img src={item.image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                  )}
                  {out ? (
                    <span className="absolute top-2 left-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-900/80 text-white">
                      Sin stock
                    </span>
                  ) : (
                    item.stock_enabled && (
                      <span className="absolute top-2 left-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-gray-800">
                        Quedan {item.stock}
                      </span>
                    )
                  )}
                  {!out && (
                    <span className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white text-gray-900 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{itemDisplayPrice(item)}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {optionsItem && (
        <ItemOptionsDialog
          key={optionsItem.key}
          item={optionsItem}
          onOpenChange={(open) => !open && setOptionsItem(null)}
          onAdd={onAdd}
        />
      )}
      <CustomAmountDialog open={customOpen} onOpenChange={setCustomOpen} onAdd={onCustom} />
    </div>
  )
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export function CustomerPicker({ open, onOpenChange, sales, onSelect }) {
  const [query, setQuery] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setScanning(false)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const digits = q.replace(/\D/g, '')
    return MOONCAFE_MEMBERS.filter(
      (m) => !q || m.name.toLowerCase().includes(q) || (digits && m.phone?.replace(/\D/g, '').includes(digits)),
    )
  }, [query])

  // Simulated wallet-card scan: shows the scanner for a moment and picks a member.
  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      const member = MOONCAFE_MEMBERS[Math.floor(Math.random() * MOONCAFE_MEMBERS.length)]
      onSelect(member.id)
      onOpenChange(false)
    }, 1600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Identificar cliente</DialogTitle>
          <DialogDescription>Escanea su tarjeta o búscalo por nombre o teléfono.</DialogDescription>
        </DialogHeader>

        {scanning ? (
          <div className="flex flex-col items-center py-8">
            <div className="relative w-48 h-48 rounded-2xl bg-gray-900 overflow-hidden flex items-center justify-center">
              <QrCode className="w-24 h-24 text-white/80" />
              <motion.div
                className="absolute inset-x-4 h-0.5 bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.8)]"
                initial={{ top: '12%' }}
                animate={{ top: ['12%', '88%', '12%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">Escaneando tarjeta…</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={handleScan} className="w-full h-11">
              <ScanLine className="w-4 h-4 mr-2" /> Escanear QR de la tarjeta
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre o teléfono"
                className="pl-9"
              />
            </div>
            <div className="max-h-72 overflow-y-auto -mx-1 px-1 space-y-1">
              {results.map((m) => {
                const card = memberLoyalty(m, sales)
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelect(m.id)
                      onOpenChange(false)
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                  >
                    <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {initials(m.name)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">{m.name}</span>
                      <span className="block text-xs text-gray-500 truncate">{m.phone ?? m.email}</span>
                    </span>
                    {card.rewardsAvailable > 0 ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Premio
                      </span>
                    ) : (
                      <StampDots filled={card.stamps} size="sm" />
                    )}
                  </button>
                )
              })}
              {results.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">No hay socios que coincidan.</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MemberLoyaltyCard({ member, card, canRedeem, redeemReward, onToggleRedeem, onClear }) {
  const nextStamps = card.stamps + 1
  const completes = nextStamps === STAMPS_REQUIRED

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30 p-3.5 space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {initials(member.name)}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{member.name}</p>
          <p className="text-xs text-gray-500 truncate">
            {member.visits} visitas · {card.stamps}/{STAMPS_REQUIRED} sellos
          </p>
        </div>
        <button onClick={onClear} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-white/70">
          <X className="w-4 h-4" />
        </button>
      </div>

      <StampDots filled={card.stamps} />

      {card.rewardsAvailable > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 p-2.5">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="flex-1 text-xs font-medium text-amber-900 dark:text-amber-200">
              Tiene {card.rewardsAvailable === 1 ? 'un café gratis' : `${card.rewardsAvailable} cafés gratis`} para
              canjear
            </p>
            <Button
              size="sm"
              variant={redeemReward ? 'default' : 'outline'}
              disabled={!canRedeem}
              onClick={onToggleRedeem}
              className={cn('h-7 text-xs', redeemReward && 'bg-amber-600 hover:bg-amber-700')}
            >
              {redeemReward ? 'Canjeado' : 'Canjear'}
            </Button>
          </div>
          {!canRedeem && (
            <p className="text-[11px] text-amber-700/80 mt-1.5 ml-6">Agrega un café al ticket para canjearlo.</p>
          )}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
        <Stamp className="w-3.5 h-3.5" />
        {completes ? 'Con esta compra completa su tarjeta y gana un café gratis' : 'Esta compra suma +1 sello'}
      </p>
    </div>
  )
}

// ─── Ticket ───────────────────────────────────────────────────────────────────

export function PosTicket({ pos, onCheckout, onSaveToTab }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [tablePickerOpen, setTablePickerOpen] = useState(false)
  const [discountOpen, setDiscountOpen] = useState(false)
  const [received, setReceived] = useState('')
  const {
    lines,
    member,
    memberCard,
    sales,
    payment,
    setPayment,
    redeemReward,
    setRedeemReward,
    canRedeem,
    rewardLine,
    subtotal,
    discount,
    manualDiscount,
    setManualDiscount,
    manualAmount,
    total,
    tip,
    setTip,
    tipAmount,
    charge,
    split,
    setSplit,
    startSplit,
    payments,
    remaining,
    canCheckout,
    tabs,
    activeTab,
    leaveTab,
    changeQty,
    removeLine,
    selectMember,
  } = pos

  // Un-redeem automatically if the coffee that made it possible leaves the ticket.
  useEffect(() => {
    if (redeemReward && !canRedeem) setRedeemReward(false)
  }, [redeemReward, canRedeem, setRedeemReward])

  useEffect(() => setReceived(''), [payment, lines.length, split])

  // Change is given back on the cash part only (all of it, unless the payment is split).
  const cashDue = split ? cashOf({ payments }) : payment === 'efectivo' ? charge : 0
  const change = Number(received) - cashDue
  const units = lines.reduce((sum, l) => sum + l.qty, 0)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <Receipt className="w-5 h-5" /> Ticket
        </h2>
        {lines.length > 0 && <span className="text-xs text-gray-500">{units} productos</span>}
      </div>

      {activeTab && (
        <div className="flex items-center gap-2 mb-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 px-3 py-2 text-sm">
          <Armchair className="w-4 h-4 text-amber-700" />
          <span className="flex-1 font-semibold text-amber-900 dark:text-amber-200">{activeTab.table}</span>
          <button onClick={leaveTab} className="text-xs font-medium text-amber-800 hover:underline dark:text-amber-300">
            Dejar abierta
          </button>
        </div>
      )}

      {member && memberCard ? (
        <MemberLoyaltyCard
          member={member}
          card={memberCard}
          canRedeem={canRedeem}
          redeemReward={redeemReward}
          onToggleRedeem={() => setRedeemReward(!redeemReward)}
          onClear={() => selectMember(null)}
        />
      ) : (
        <button
          onClick={() => setPickerOpen(true)}
          className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-3.5 py-3 text-left hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
        >
          <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UserRound className="w-5 h-5 text-gray-500" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">Identificar cliente</span>
            <span className="block text-xs text-gray-500">Escanea su tarjeta para sumar sellos</span>
          </span>
          <ScanLine className="w-5 h-5 text-gray-400" />
        </button>
      )}

      <div className="flex-1 min-h-[120px] mt-4 space-y-2 overflow-y-auto">
        {lines.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-400">
            <Plus className="w-6 h-6 mb-2" />
            <p className="text-sm">Toca un producto para agregarlo</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.div
                key={l.key}
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3"
              >
                {l.image_url ? (
                  <img src={l.image_url} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <span className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {l.name}
                    {l.variant_name && <span className="text-gray-500 font-normal"> · {l.variant_name}</span>}
                  </p>
                  {lineOptionsText(l) && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 truncate">{lineOptionsText(l)}</p>
                  )}
                  <p className="text-xs text-gray-500">{formatShowcasePrice(l.unit_price * l.qty)}</p>
                </div>
                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => (l.qty === 1 ? removeLine(l.key) : changeQty(l.key, -1))}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    {l.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                  <button
                    onClick={() => changeQty(l.key, 1)}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatShowcasePrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-amber-700 dark:text-amber-400">
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" /> Premio: {rewardLine?.name} gratis
            </span>
            <span className="tabular-nums">−{formatShowcasePrice(discount)}</span>
          </div>
        )}
        {manualAmount > 0 && (
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <button onClick={() => setDiscountOpen(true)} className="flex items-center gap-1.5 hover:underline">
              <Percent className="w-3.5 h-3.5" /> Descuento
              {manualDiscount.type === 'percent' && ` (${manualDiscount.value}%)`}
              {manualDiscount.reason && <span className="text-xs text-gray-400">· {manualDiscount.reason}</span>}
            </button>
            <span className="tabular-nums">−{formatShowcasePrice(manualAmount)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-1">
          <span className="font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
            {formatShowcasePrice(total)}
          </span>
        </div>
      </div>

      {lines.length > 0 && (
        <div className="flex gap-2 mt-3">
          {!manualAmount && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setDiscountOpen(true)}>
              <Percent className="w-3.5 h-3.5 mr-1.5" /> Descuento
            </Button>
          )}
          {!activeTab && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setTablePickerOpen(true)}>
              <Armchair className="w-3.5 h-3.5 mr-1.5" /> Guardar en mesa
            </Button>
          )}
        </div>
      )}

      {total > 0 && <TipSelector tip={tip} onChange={setTip} tipAmount={tipAmount} />}

      {split ? (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Pago dividido</span>
            <button onClick={() => setSplit(null)} className="text-xs text-gray-500 hover:underline">
              Un solo medio
            </button>
          </div>
          <SplitPayment rows={split} onChange={setSplit} remaining={remaining} total={total} />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPayment(id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border py-2 text-[11px] font-medium transition-colors',
                payment === id
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
      {!split && total > 0 && (
        <button
          onClick={startSplit}
          className="flex items-center gap-1.5 mx-auto mt-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <Split className="w-3.5 h-3.5" /> Dividir pago
        </button>
      )}

      {cashDue > 0 && (
        <div className="flex items-center gap-3 mt-3">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={received}
            onChange={(e) => setReceived(e.target.value)}
            placeholder="Paga con"
            className="h-9"
          />
          <span
            className={cn(
              'text-sm whitespace-nowrap',
              change >= 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400',
            )}
          >
            Vuelto:{' '}
            <strong className="tabular-nums">{received && change >= 0 ? formatShowcasePrice(change) : '—'}</strong>
          </span>
        </div>
      )}

      <Button
        onClick={onCheckout}
        disabled={!canCheckout}
        className="w-full h-12 mt-4 text-base bg-emerald-700 hover:bg-emerald-800 text-white"
      >
        Cobrar {lines.length > 0 && formatShowcasePrice(charge)}
      </Button>
      {!member && lines.length > 0 && (
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Sin cliente identificado, esta venta no suma sellos.
        </p>
      )}

      <CustomerPicker open={pickerOpen} onOpenChange={setPickerOpen} sales={sales} onSelect={selectMember} />
      <TablePicker
        open={tablePickerOpen}
        onOpenChange={setTablePickerOpen}
        tabs={tabs}
        onPick={(table) => {
          setTablePickerOpen(false)
          onSaveToTab(table)
        }}
      />
      {discountOpen && (
        <DiscountDialog
          open
          onOpenChange={setDiscountOpen}
          base={subtotal - discount}
          current={manualDiscount}
          onApply={setManualDiscount}
        />
      )}
    </div>
  )
}

// ─── Checkout result ──────────────────────────────────────────────────────────

export function CheckoutSuccessDialog({ result, onClose }) {
  const sale = result?.sale
  const method = sale && paymentMethod(sale.payment_method)
  const card = result?.card
  const completed = card && sale.stamps_earned > 0 && card.stamps === 0

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm text-center">
        {sale && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-emerald-700" />
            </motion.div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-center text-xl">Venta cobrada</DialogTitle>
              <DialogDescription className="text-center">
                Ticket #{sale.number}
                {sale.table && ` · ${sale.table}`} ·{' '}
                {sale.payments?.length > 1
                  ? sale.payments
                      .map((p) => `${paymentMethod(p.method).label} ${formatShowcasePrice(p.amount)}`)
                      .join(' + ')
                  : method.label}
              </DialogDescription>
            </DialogHeader>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
              {formatShowcasePrice(sale.total + (sale.tip ?? 0))}
            </p>
            {sale.tip > 0 && (
              <p className="text-xs text-gray-500 -mt-2">
                {formatShowcasePrice(sale.total)} + {formatShowcasePrice(sale.tip)} de propina
              </p>
            )}

            {result.member && card ? (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 space-y-3 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {result.member.name.split(' ')[0]} sumó +1 sello
                </p>
                <StampDots filled={completed ? STAMPS_REQUIRED : card.stamps} />
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  {completed
                    ? '¡Completó su tarjeta! Tiene un café gratis para su próxima visita.'
                    : STAMPS_REQUIRED - card.stamps === 1
                      ? '¡Le falta 1 sello para su café gratis!'
                      : `Le faltan ${STAMPS_REQUIRED - card.stamps} sellos para su café gratis.`}
                </p>
                {sale.reward_redeemed && (
                  <p className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                    <Gift className="w-3.5 h-3.5" /> Canjeó su café gratis en esta compra.
                  </p>
                )}
                <p className="text-[11px] text-gray-500">Su tarjeta en la wallet ya se actualizó.</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Venta sin cliente identificado: no sumó sellos.</p>
            )}

            <Button onClick={onClose} className="w-full h-11">
              Nueva venta
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Sales today ──────────────────────────────────────────────────────────────

function Kpi({ label, value, hint, highlight }) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4',
        highlight
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
          : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
      )}
    >
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}

export function SalesToday({ sales, summary, onVoid }) {
  const [openId, setOpenId] = useState(null)
  const [cashier, setCashier] = useState('all')
  const [voiding, setVoiding] = useState(null)
  const memberName = (id) => MOONCAFE_MEMBERS.find((m) => m.id === id)?.name
  const valid = sales.filter((s) => !isVoided(s))
  const identified = valid.filter((s) => s.member_id).length
  const cashierIds = [...new Set(sales.map((s) => s.cashier_id).filter(Boolean))]
  const visible = cashier === 'all' ? sales : sales.filter((s) => s.cashier_id === cashier)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Ventas de hoy" value={formatShowcasePrice(summary.total)} />
        <Kpi
          label="Tickets"
          value={summary.count}
          hint={
            summary.voidedCount > 0 ? `${summary.voidedCount} anulado${summary.voidedCount === 1 ? '' : 's'}` : null
          }
        />
        <Kpi label="Ticket promedio" value={formatShowcasePrice(summary.average)} />
        <Kpi
          label="Clientes identificados"
          value={`${summary.identifiedPct}%`}
          hint={`${identified} de ${summary.count} tickets sumaron sellos`}
          highlight
        />
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Por medio de pago</h3>
            {summary.byMethod.map(({ id, label, icon: Icon, total, count }) => (
              <div key={id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Icon className="w-4 h-4" /> {label}
                    <span className="text-xs text-gray-400">({count})</span>
                  </span>
                  <span className="font-medium tabular-nums">{formatShowcasePrice(total)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${summary.total ? Math.min(100, (total / summary.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {summary.rewardsRedeemed > 0 && (
              <p className="flex items-center gap-2 text-sm text-amber-700 pt-2 border-t border-gray-100 dark:border-gray-800">
                <Gift className="w-4 h-4" />{' '}
                {summary.rewardsRedeemed === 1
                  ? '1 premio canjeado hoy'
                  : `${summary.rewardsRedeemed} premios canjeados hoy`}
              </p>
            )}
          </div>

          {summary.byCashier.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Por cajero</h3>
              {summary.byCashier.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {cashierName(c.id)} <span className="text-xs text-gray-400">({c.count})</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-medium tabular-nums">{formatShowcasePrice(c.total)}</span>
                    {c.tips > 0 && (
                      <span className="block text-[11px] text-gray-500 tabular-nums">
                        + {formatShowcasePrice(c.tips)} propinas
                      </span>
                    )}
                  </span>
                </div>
              ))}
              {(summary.discountsTotal > 0 || summary.voidedCount > 0 || summary.tipsTotal > 0) && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1 text-xs text-gray-500">
                  {summary.tipsTotal > 0 && (
                    <p className="flex justify-between">
                      <span>Propinas (no suman a ventas)</span>
                      <span className="tabular-nums">{formatShowcasePrice(summary.tipsTotal)}</span>
                    </p>
                  )}
                  {summary.discountsTotal > 0 && (
                    <p className="flex justify-between">
                      <span>Descuentos manuales</span>
                      <span className="tabular-nums">−{formatShowcasePrice(summary.discountsTotal)}</span>
                    </p>
                  )}
                  {summary.voidedCount > 0 && (
                    <p className="flex justify-between text-red-600">
                      <span>Anuladas ({summary.voidedCount})</span>
                      <span className="tabular-nums">{formatShowcasePrice(summary.voidedTotal)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {cashierIds.length > 1 && (
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {['all', ...cashierIds].map((id) => (
                <button
                  key={id}
                  onClick={() => setCashier(id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-colors',
                    cashier === id
                      ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700',
                  )}
                >
                  {id === 'all' ? 'Todos' : cashierName(id)}
                </button>
              ))}
            </div>
          )}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {visible.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-12">Todavía no hay ventas hoy.</p>
            )}
            {visible.map((s) => {
              const { icon: Icon, label } = paymentMethod(s.payment_method)
              const name = memberName(s.member_id)
              const open = openId === s.id
              const voided = isVoided(s)
              return (
                <div key={s.id} className={cn(voided && 'bg-gray-50/60 dark:bg-gray-800/20')}>
                  <button
                    onClick={() => setOpenId(open ? null : s.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <span className="text-xs text-gray-400 tabular-nums w-11">{formatTime(s.created_at)}</span>
                    <span className={cn('flex-1 min-w-0', voided && 'opacity-60')}>
                      <span className="flex items-center gap-1.5 flex-wrap text-sm font-medium text-gray-900 dark:text-white">
                        {name ? (
                          <>
                            <Users className="w-3.5 h-3.5 text-emerald-600" /> {name}
                          </>
                        ) : (
                          <span className="text-gray-500 font-normal">Sin cliente</span>
                        )}
                        {s.reward_redeemed && <Gift className="w-3.5 h-3.5 text-amber-600" />}
                        {s.table && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <Armchair className="w-3 h-3" /> {s.table}
                          </span>
                        )}
                        {s.channel === 'whatsapp' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#25D366]/10 text-[#128C7E]">
                            <WhatsAppIcon className="w-3 h-3" /> Pedido #{s.order_number}
                          </span>
                        )}
                        {voided && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                            <Ban className="w-3 h-3" /> Anulada
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-gray-500 truncate">
                        #{s.number}
                        {s.cashier_id && ` · ${cashierName(s.cashier_id)}`} ·{' '}
                        {s.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}
                      </span>
                    </span>
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" aria-label={label} />
                    <span
                      className={cn(
                        'text-sm font-semibold tabular-nums w-20 text-right',
                        voided && 'line-through text-gray-400',
                      )}
                    >
                      {formatShowcasePrice(s.total)}
                    </span>
                    <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 pl-[4.25rem] space-y-1 text-sm">
                      {s.lines.map((l) => (
                        <div key={l.key} className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>
                            {l.qty}× {l.name}
                            {l.variant_name && ` · ${l.variant_name}`}
                            {lineOptionsText(l) && (
                              <span className="block text-xs text-gray-400">{lineOptionsText(l)}</span>
                            )}
                          </span>
                          <span className="tabular-nums">{formatShowcasePrice(l.unit_price * l.qty)}</span>
                        </div>
                      ))}
                      {s.tip > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Propina</span>
                          <span className="tabular-nums">+{formatShowcasePrice(s.tip)}</span>
                        </div>
                      )}
                      {s.discount > 0 && (
                        <div className="flex justify-between text-amber-700">
                          <span>Premio canjeado</span>
                          <span className="tabular-nums">−{formatShowcasePrice(s.discount)}</span>
                        </div>
                      )}
                      {s.manual_discount && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>
                            Descuento
                            {s.manual_discount.type === 'percent' && ` (${s.manual_discount.value}%)`}
                            {s.manual_discount.reason && ` · ${s.manual_discount.reason}`}
                          </span>
                          <span className="tabular-nums">−{formatShowcasePrice(s.manual_discount.amount)}</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 pt-1">
                        {salePayments(s)
                          .map((p) =>
                            s.payments?.length > 1
                              ? `${paymentMethod(p.method).label} ${formatShowcasePrice(p.amount)}`
                              : paymentMethod(p.method).label,
                          )
                          .join(' + ')}
                        {s.stamps_earned > 0 && !voided && ` · +${s.stamps_earned} sello`}
                      </p>
                      {voided ? (
                        <p className="text-xs text-red-600">
                          Anulada a las {formatTime(s.void.voided_at)} · {s.void.reason}
                          {s.void.by && ` · ${cashierName(s.void.by)}`}
                        </p>
                      ) : (
                        onVoid && (
                          <button
                            onClick={() => setVoiding(s)}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline pt-1"
                          >
                            <Ban className="w-3.5 h-3.5" /> Anular venta
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <VoidSaleDialog sale={voiding} onOpenChange={(open) => !open && setVoiding(null)} onConfirm={onVoid} />
    </div>
  )
}
