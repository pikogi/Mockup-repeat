import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calculator,
  ChevronDown,
  LockKeyhole,
  Store,
  UserCog,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MOONCAFE_STORES } from '@/constants/moonCafeClubs'
import { DEFAULT_OPENING_CASH, MOVEMENT_REASONS } from '@/constants/moonCafeRegister'
import { paymentMethod } from '@/constants/moonCafeSales'
import { formatShowcasePrice } from '@/constants/moonCafeShowcase'
import { cashierName, MOONCAFE_CASHIERS } from '@/constants/moonCafeTeam'
import { cn } from '@/lib/utils'

const formatTime = (iso) => new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
const formatDay = (iso) => {
  const day = new Date(iso).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
  return day.charAt(0).toUpperCase() + day.slice(1)
}
const storeName = (id) => MOONCAFE_STORES.find((s) => s.store_id === id)?.store_name ?? 'Sucursal'

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function NativeSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
    >
      {children}
    </select>
  )
}

// Live text for a cash difference: it either balances, has extra or is short.
export function DifferenceLabel({ difference, className }) {
  return (
    <span
      className={cn(
        'font-semibold tabular-nums',
        difference === 0 ? 'text-emerald-700' : difference > 0 ? 'text-amber-700' : 'text-red-600',
        className,
      )}
    >
      {difference === 0
        ? 'Cuadra'
        : difference > 0
          ? `Sobran ${formatShowcasePrice(difference)}`
          : `Faltan ${formatShowcasePrice(-difference)}`}
    </span>
  )
}

// ─── Shift bar ────────────────────────────────────────────────────────────────

export function ShiftBar({ shift, expected, onMovement, onChangeCashier, onClose }) {
  return (
    <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20 px-4 py-3">
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-600" />
          </span>
          Caja abierta
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <Store className="w-4 h-4" /> {storeName(shift.store_id)}
        </span>
        <span className="text-gray-600 dark:text-gray-300">
          {cashierName(shift.cashier_id)} · desde {formatTime(shift.opened_at)}
        </span>
        <span className="flex items-center gap-1.5 text-gray-900 dark:text-white">
          <Wallet className="w-4 h-4" /> Efectivo en caja:{' '}
          <strong className="tabular-nums">{formatShowcasePrice(expected.total)}</strong>
        </span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onMovement} className="bg-white dark:bg-gray-900">
          <ArrowDownToLine className="w-4 h-4 mr-1.5" /> Ingreso / retiro
        </Button>
        <Button variant="outline" size="sm" onClick={onChangeCashier} className="bg-white dark:bg-gray-900">
          <UserCog className="w-4 h-4 mr-1.5" /> Cajero
        </Button>
        <Button size="sm" onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white">
          <LockKeyhole className="w-4 h-4 mr-1.5" /> Cerrar caja
        </Button>
      </div>
    </div>
  )
}

// ─── Open shift ───────────────────────────────────────────────────────────────

export function OpenShiftPanel({ lastClosed, onOpen }) {
  const [cashierId, setCashierId] = useState(String(MOONCAFE_CASHIERS[1].id))
  const [storeId, setStoreId] = useState(MOONCAFE_STORES[0].store_id)
  const [opening, setOpening] = useState(String(DEFAULT_OPENING_CASH))

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-4">
        <LockKeyhole className="w-6 h-6 text-emerald-700" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">La caja está cerrada</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Cuenta el efectivo con el que arrancas el turno. Al cerrar, Repeat te dice cuánto debería haber.
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          onOpen({ cashier_id: Number(cashierId), store_id: storeId, opening_cash: opening })
        }}
      >
        <Field label="Cajero">
          <NativeSelect value={cashierId} onChange={setCashierId}>
            {MOONCAFE_CASHIERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} · {c.role}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Sucursal">
          <NativeSelect value={storeId} onChange={setStoreId}>
            {MOONCAFE_STORES.map((s) => (
              <option key={s.store_id} value={s.store_id}>
                {s.store_name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Fondo inicial (efectivo)">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
            className="h-11 text-lg font-semibold"
          />
        </Field>
        {lastClosed && (
          <p className="text-xs text-gray-500">
            Último cierre: {formatDay(lastClosed.closed_at)} con {formatShowcasePrice(lastClosed.counted_cash)} en caja.
          </p>
        )}
        <Button type="submit" className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white">
          Abrir caja
        </Button>
      </form>
    </div>
  )
}

// ─── Cash movement ────────────────────────────────────────────────────────────

export function CashMovementDialog({ open, onOpenChange, onSave }) {
  const [type, setType] = useState('out')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState(MOVEMENT_REASONS.out[0])

  const changeType = (next) => {
    setType(next)
    setReason(MOVEMENT_REASONS[next][0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ingreso o retiro de efectivo</DialogTitle>
          <DialogDescription>Queda registrado en el turno y ajusta el efectivo esperado al cerrar.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!(Number(amount) > 0)) return
            onSave({ type, amount, reason })
            setAmount('')
            onOpenChange(false)
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'out', label: 'Retiro', icon: ArrowUpFromLine },
              { id: 'in', label: 'Ingreso', icon: ArrowDownToLine },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => changeType(id)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium',
                  type === id
                    ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                    : 'border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300',
                )}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
          <Field label="Monto">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-11 text-lg font-semibold"
            />
          </Field>
          <Field label="Motivo">
            <NativeSelect value={reason} onChange={setReason}>
              {MOVEMENT_REASONS[type].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Button type="submit" disabled={!(Number(amount) > 0)} className="w-full h-11">
            Registrar {type === 'out' ? 'retiro' : 'ingreso'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ChangeCashierDialog({ open, onOpenChange, current, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>¿Quién está cobrando?</DialogTitle>
          <DialogDescription>Las próximas ventas quedan a nombre de esta persona.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {MOONCAFE_CASHIERS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c.id)
                onOpenChange(false)
              }}
              className={cn(
                'w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
                c.id === current
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'border-gray-200 hover:border-gray-400 dark:border-gray-700',
              )}
            >
              <span className="font-medium text-gray-900 dark:text-white">{c.full_name}</span>
              <span className="text-xs text-gray-500">{c.role}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Close shift ──────────────────────────────────────────────────────────────

function Row({ label, value, strong, muted }) {
  return (
    <div className={cn('flex justify-between text-sm', muted && 'text-gray-500', strong && 'font-semibold')}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

export function CloseShiftDialog({ open, onOpenChange, shift, expected, summary, onConfirm }) {
  const [counted, setCounted] = useState('')
  const [note, setNote] = useState('')
  const difference = counted === '' ? null : Number(counted) - expected.total

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" /> Cerrar caja
          </DialogTitle>
          <DialogDescription>
            Turno de {cashierName(shift.cashier_id)} desde las {formatTime(shift.opened_at)} · {summary.count} tickets
            por {formatShowcasePrice(summary.total)}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 space-y-1.5">
          <Row label="Fondo inicial" value={formatShowcasePrice(expected.opening)} muted />
          <Row label="+ Cobros en efectivo (con propinas)" value={formatShowcasePrice(expected.cashSales)} muted />
          {expected.ins > 0 && <Row label="+ Ingresos" value={formatShowcasePrice(expected.ins)} muted />}
          {expected.outs > 0 && <Row label="− Retiros" value={formatShowcasePrice(expected.outs)} muted />}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-1.5">
            <Row label="Efectivo esperado" value={formatShowcasePrice(expected.total)} strong />
          </div>
        </div>

        <Field label="Efectivo contado">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            autoFocus
            value={counted}
            onChange={(e) => setCounted(e.target.value)}
            placeholder="¿Cuánto hay en la caja?"
            className="h-12 text-xl font-bold"
          />
        </Field>
        {difference !== null && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-center text-lg">
            <DifferenceLabel difference={difference} />
          </motion.p>
        )}
        <Field label="Nota (opcional)">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={difference ? 'Ej: faltó cambio en un vuelto' : ''}
            rows={2}
          />
        </Field>
        <Button
          disabled={counted === ''}
          onClick={() => {
            onConfirm({ counted_cash: counted, note })
            setCounted('')
            setNote('')
          }}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
        >
          Cerrar turno
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// ─── Shift report (cierre Z) ──────────────────────────────────────────────────

export function ShiftReport({ shift }) {
  const s = shift.summary
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Vendido', value: formatShowcasePrice(s.total) },
          { label: 'Tickets', value: s.count },
          { label: 'Con cliente', value: `${s.identifiedPct}%` },
        ].map((k) => (
          <div key={k.label} className="rounded-xl bg-gray-50 dark:bg-gray-800/60 px-3 py-2.5">
            <p className="text-[11px] text-gray-500">{k.label}</p>
            <p className="font-bold text-gray-900 dark:text-white tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Por medio de pago</p>
        {s.byMethod
          .filter((m) => m.total > 0)
          .map((m) => (
            <Row key={m.id} label={`${paymentMethod(m.id).label} (${m.count})`} value={formatShowcasePrice(m.total)} />
          ))}
      </div>
      {s.byCashier.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Por cajero</p>
          {s.byCashier.map((c) => (
            <Row
              key={c.id}
              label={`${cashierName(c.id) ?? 'Sin asignar'} (${c.count})`}
              value={formatShowcasePrice(c.total)}
            />
          ))}
        </div>
      )}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Efectivo</p>
        <Row label="Esperado" value={formatShowcasePrice(shift.expected_cash)} />
        <Row label="Contado" value={formatShowcasePrice(shift.counted_cash)} />
        <div className="flex justify-between">
          <span>Diferencia</span>
          <DifferenceLabel difference={shift.difference} />
        </div>
        {shift.movements.map((m) => (
          <Row
            key={m.id}
            muted
            label={`${m.type === 'out' ? 'Retiro' : 'Ingreso'} · ${m.reason}`}
            value={`${m.type === 'out' ? '−' : '+'}${formatShowcasePrice(m.amount)}`}
          />
        ))}
      </div>
      {s.tipsTotal > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Propinas a repartir</p>
          {s.byCashier
            .filter((c) => c.tips > 0)
            .map((c) => (
              <Row key={c.id} label={cashierName(c.id) ?? 'Sin asignar'} value={formatShowcasePrice(c.tips)} />
            ))}
          <Row label="Total propinas" value={formatShowcasePrice(s.tipsTotal)} strong />
        </div>
      )}
      {(s.voidedCount > 0 || s.discountsTotal > 0 || s.rewardsRedeemed > 0) && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Control</p>
          {s.voidedCount > 0 && (
            <Row label={`Ventas anuladas (${s.voidedCount})`} value={formatShowcasePrice(s.voidedTotal)} />
          )}
          {s.discountsTotal > 0 && <Row label="Descuentos manuales" value={formatShowcasePrice(s.discountsTotal)} />}
          {s.rewardsRedeemed > 0 && <Row label="Premios canjeados" value={s.rewardsRedeemed} />}
        </div>
      )}
      {shift.note && <p className="text-xs text-gray-500 italic">“{shift.note}”</p>}
    </div>
  )
}

export function ShiftClosedDialog({ report, onClose }) {
  return (
    <Dialog open={!!report} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {report && (
          <>
            <DialogHeader>
              <DialogTitle>Caja cerrada</DialogTitle>
              <DialogDescription>
                {storeName(report.store_id)} · {cashierName(report.cashier_id)} · {formatTime(report.opened_at)} a{' '}
                {formatTime(report.closed_at)}
              </DialogDescription>
            </DialogHeader>
            <ShiftReport shift={report} />
            <Button onClick={onClose} className="w-full h-11">
              Listo
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── History ──────────────────────────────────────────────────────────────────

export function ShiftHistory({ history }) {
  const [openId, setOpenId] = useState(null)
  if (history.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-12">Todavía no cerraste ningún turno.</p>
  }
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
      {history.map((shift) => {
        const open = openId === shift.id
        return (
          <div key={shift.id}>
            <button
              onClick={() => setOpenId(open ? null : shift.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-900 dark:text-white">
                  {formatDay(shift.closed_at)} · {formatTime(shift.opened_at)} a {formatTime(shift.closed_at)}
                </span>
                <span className="block text-xs text-gray-500">
                  {cashierName(shift.cashier_id)} · {shift.summary.count} tickets
                </span>
              </span>
              <span className="text-sm font-semibold tabular-nums">{formatShowcasePrice(shift.summary.total)}</span>
              <DifferenceLabel difference={shift.difference} className="text-xs w-24 text-right" />
              <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
              <div className="px-4 pb-5 pt-1">
                <ShiftReport shift={shift} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
