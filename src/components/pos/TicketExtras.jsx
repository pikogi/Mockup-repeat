import { useState } from 'react'
import { Armchair, Ban, Clock, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MOONCAFE_TABLES, tabTotal, VOID_REASONS } from '@/constants/moonCafeRegister'
import { PAYMENT_METHODS } from '@/constants/moonCafeSales'
import { formatShowcasePrice } from '@/constants/moonCafeShowcase'
import { genId } from '@/hooks/useMoonCafeShowcase'
import { cn } from '@/lib/utils'

const minutesSince = (iso) => Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000))

function ChoiceChip({ active, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
          : 'border-gray-200 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300',
        className,
      )}
    >
      {children}
    </button>
  )
}

// ─── Monto libre ──────────────────────────────────────────────────────────────

export function CustomAmountDialog({ open, onOpenChange, onAdd }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!(Number(amount) > 0)) return
    onAdd(name, amount)
    setName('')
    setAmount('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Monto libre</DialogTitle>
          <DialogDescription>Cobra algo que no está en tu catálogo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="custom-amount">Monto</Label>
            <Input
              id="custom-amount"
              type="number"
              inputMode="numeric"
              min={1}
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-12 text-2xl font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="custom-name">Descripción (opcional)</Label>
            <Input id="custom-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Varios" />
          </div>
          <Button type="submit" disabled={!(Number(amount) > 0)} className="w-full h-11">
            Agregar al ticket
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Descuento ────────────────────────────────────────────────────────────────

const PERCENT_PRESETS = [5, 10, 15, 20]
const DISCOUNT_REASONS = ['Cliente frecuente', 'Producto con detalle', 'Promoción', 'Empleado']

export function DiscountDialog({ open, onOpenChange, base, current, onApply }) {
  const [type, setType] = useState(current?.type ?? 'percent')
  const [value, setValue] = useState(current?.value ?? 10)
  const [reason, setReason] = useState(current?.reason ?? '')

  const numeric = Number(value) || 0
  const amount = Math.min(base, type === 'percent' ? Math.round((base * numeric) / 100) : numeric)
  const valid = numeric > 0 && (type === 'amount' || numeric <= 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Descuento</DialogTitle>
          <DialogDescription>Se aplica sobre el total del ticket.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <ChoiceChip active={type === 'percent'} onClick={() => setType('percent')}>
              Porcentaje
            </ChoiceChip>
            <ChoiceChip active={type === 'amount'} onClick={() => setType('amount')}>
              Monto fijo
            </ChoiceChip>
          </div>
          {type === 'percent' && (
            <div className="grid grid-cols-4 gap-2">
              {PERCENT_PRESETS.map((p) => (
                <ChoiceChip key={p} active={numeric === p} onClick={() => setValue(p)}>
                  {p}%
                </ChoiceChip>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-11"
            />
            <span className="text-sm text-gray-500 w-6">{type === 'percent' ? '%' : '$'}</span>
          </div>
          <div className="space-y-1.5">
            <Label>Motivo</Label>
            <div className="flex flex-wrap gap-1.5">
              {DISCOUNT_REASONS.map((r) => (
                <ChoiceChip
                  key={r}
                  active={reason === r}
                  onClick={() => setReason(reason === r ? '' : r)}
                  className="px-2.5 py-1 text-xs rounded-full"
                >
                  {r}
                </ChoiceChip>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-sm rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3">
            <span className="text-gray-500">Descuento</span>
            <span className="font-semibold tabular-nums">−{formatShowcasePrice(valid ? amount : 0)}</span>
          </div>
          <div className="flex gap-2">
            {current && (
              <Button
                variant="outline"
                onClick={() => {
                  onApply(null)
                  onOpenChange(false)
                }}
              >
                Quitar
              </Button>
            )}
            <Button
              disabled={!valid}
              className="flex-1 h-11"
              onClick={() => {
                onApply({ type, value: numeric, reason })
                onOpenChange(false)
              }}
            >
              Aplicar descuento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Pago dividido ────────────────────────────────────────────────────────────

export function SplitPayment({ rows, onChange, remaining, total }) {
  const setRow = (id, fields) => onChange(rows.map((r) => (r.id === id ? { ...r, ...fields } : r)))
  // With two methods, typing one amount fills the other with the rest.
  const setAmount = (id, amount) => {
    if (rows.length !== 2) return setRow(id, { amount })
    const rest = Math.max(0, total - (Number(amount) || 0))
    onChange(rows.map((r) => (r.id === id ? { ...r, amount } : { ...r, amount: String(rest) })))
  }
  const removeRow = (id) => onChange(rows.filter((r) => r.id !== id))

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <select
            value={row.method}
            onChange={(e) => setRow(row.id, { method: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={row.amount}
            onChange={(e) => setAmount(row.id, e.target.value)}
            placeholder="0"
            className="h-9 flex-1"
          />
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setRow(row.id, { amount: String((Number(row.amount) || 0) + remaining) })}
              className="text-[11px] font-medium text-emerald-700 whitespace-nowrap hover:underline"
            >
              + resto
            </button>
          )}
          {rows.length > 2 && (
            <button type="button" onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-gray-700">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between text-xs">
        {rows.length < PAYMENT_METHODS.length ? (
          <button
            type="button"
            onClick={() => onChange([...rows, { id: genId(), method: 'qr', amount: '' }])}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar medio
          </button>
        ) : (
          <span />
        )}
        <span
          className={cn(
            'font-semibold tabular-nums',
            remaining === 0 ? 'text-emerald-700' : remaining > 0 ? 'text-amber-700' : 'text-red-600',
          )}
        >
          {remaining === 0
            ? 'Pago completo'
            : remaining > 0
              ? `Falta ${formatShowcasePrice(remaining)}`
              : `Sobra ${formatShowcasePrice(-remaining)}`}
        </span>
      </div>
    </div>
  )
}

// ─── Mesas ────────────────────────────────────────────────────────────────────

export function TablePicker({ open, onOpenChange, tabs, onPick }) {
  const occupied = new Map(tabs.map((t) => [t.table, t]))
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guardar en mesa</DialogTitle>
          <DialogDescription>
            La cuenta queda abierta y la cobras cuando el cliente pida pagar. Si la mesa ya está abierta, se suma a su
            cuenta.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {MOONCAFE_TABLES.map((table) => {
            const tab = occupied.get(table)
            return (
              <button
                key={table}
                onClick={() => onPick(table)}
                className={cn(
                  'rounded-xl border px-2 py-3 text-center transition-colors',
                  tab
                    ? 'border-amber-300 bg-amber-50 hover:border-amber-500 dark:border-amber-800 dark:bg-amber-950/30'
                    : 'border-gray-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-white',
                )}
              >
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">{table}</span>
                <span className="block text-[11px] text-gray-500 tabular-nums">
                  {tab ? formatShowcasePrice(tabTotal(tab)) : 'Libre'}
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function OpenTabsStrip({ tabs, activeTabId, onOpen }) {
  if (tabs.length === 0) return null
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
        <Armchair className="w-4 h-4" /> Mesas abiertas
      </span>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onOpen(t.id)}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
            t.id === activeTabId
              ? 'border-amber-500 bg-amber-500 text-white'
              : 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200',
          )}
        >
          <span className="font-semibold">{t.table}</span>
          <span className="tabular-nums">{formatShowcasePrice(tabTotal(t))}</span>
          <span
            className={cn('flex items-center gap-0.5 text-xs', t.id === activeTabId ? 'text-white/80' : 'opacity-70')}
          >
            <Clock className="w-3 h-3" /> {minutesSince(t.opened_at)} min
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Anular venta ─────────────────────────────────────────────────────────────

export function VoidSaleDialog({ sale, onOpenChange, onConfirm }) {
  const [reason, setReason] = useState(VOID_REASONS[0])

  return (
    <Dialog open={!!sale} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {sale && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" /> Anular ticket #{sale.number}
              </DialogTitle>
              <DialogDescription>
                {formatShowcasePrice(sale.total)} sale de las ventas del día y del arqueo de caja.
                {sale.member_id && ' El cliente pierde el sello de esta compra.'}
                {sale.reward_redeemed && ' Su café gratis vuelve a quedar disponible.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label>Motivo</Label>
              <div className="grid grid-cols-2 gap-2">
                {VOID_REASONS.map((r) => (
                  <ChoiceChip key={r} active={reason === r} onClick={() => setReason(r)} className="text-xs">
                    {r}
                  </ChoiceChip>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  onConfirm(sale, reason)
                  onOpenChange(false)
                }}
              >
                Anular venta
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Propina ──────────────────────────────────────────────────────────────────

const TIP_PRESETS = [10, 15]

export function TipSelector({ tip, onChange, tipAmount }) {
  const custom = tip?.type === 'amount'
  const isPreset = (p) => tip?.type === 'percent' && tip.value === p

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Propina</span>
        {tipAmount > 0 && <span className="text-sm tabular-nums text-gray-700">+{formatShowcasePrice(tipAmount)}</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <ChoiceChip active={!tip} onClick={() => onChange(null)} className="px-1 py-1.5 text-xs">
          Sin propina
        </ChoiceChip>
        {TIP_PRESETS.map((p) => (
          <ChoiceChip
            key={p}
            active={isPreset(p)}
            onClick={() => onChange({ type: 'percent', value: p })}
            className="px-1 py-1.5 text-xs"
          >
            {p}%
          </ChoiceChip>
        ))}
        <ChoiceChip
          active={custom}
          onClick={() => onChange({ type: 'amount', value: 0 })}
          className="px-1 py-1.5 text-xs"
        >
          Otro
        </ChoiceChip>
      </div>
      {custom && (
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          autoFocus
          value={tip?.value || ''}
          onChange={(e) => onChange({ type: 'amount', value: Number(e.target.value) || 0 })}
          placeholder="Monto de la propina"
          className="h-9"
        />
      )}
    </div>
  )
}
