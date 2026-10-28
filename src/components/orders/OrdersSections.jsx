import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Gift, Stamp, Store, Truck, UserPlus, X } from 'lucide-react'
import WhatsAppIcon from '@/components/shared/WhatsAppIcon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { nextStage, ORDER_STAGES, orderMessageForCustomer, waLink } from '@/constants/moonCafeOrders'
import { paymentMethod, PAYMENT_METHODS, STAMPS_REQUIRED } from '@/constants/moonCafeSales'
import { formatShowcasePrice } from '@/constants/moonCafeShowcase'
import { cn } from '@/lib/utils'

function minutesAgo(iso) {
  const min = Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000))
  if (min < 1) return 'Recién'
  if (min < 60) return `Hace ${min} min`
  const h = Math.floor(min / 60)
  return `Hace ${h} h`
}

// Re-renders every 30s so "Hace N min" stays current while the board is open.
function useTick() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(id)
  }, [])
}

// ─── Funnel + KPIs ────────────────────────────────────────────────────────────

export function OrdersFunnel({ metrics }) {
  const top = metrics.funnel[0].value || 1
  return (
    <div className="grid lg:grid-cols-[1fr_auto] gap-4">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Embudo de hoy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metrics.funnel.map((step, i) => {
            const prev = metrics.funnel[i - 1]?.value
            const conversion = prev ? Math.round((step.value / prev) * 100) : null
            return (
              <div key={step.label} className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{step.value}</span>
                  {conversion !== null && (
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{conversion}%</span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-emerald-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(4, (step.value / top) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{step.label}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-56">
        {[
          { label: 'Vendido por WhatsApp', value: formatShowcasePrice(metrics.revenue) },
          { label: 'Ticket promedio', value: formatShowcasePrice(metrics.average) },
          { label: 'Pedidos de socios', value: `${metrics.memberPct}%` },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3"
          >
            <p className="text-[11px] font-medium text-gray-500">{k.label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────

function MemberBadge({ card }) {
  if (!card) {
    return (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">
        No es socio
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
      <Stamp className="w-3 h-3" /> Socio · {card.stamps}/{STAMPS_REQUIRED}
      {card.rewardsAvailable > 0 && <Gift className="w-3 h-3 text-amber-600" />}
    </span>
  )
}

function OrderCard({ order, card, onAdvance, onCancel }) {
  const stage = ORDER_STAGES.find((s) => s.id === order.status)
  const delivered = order.status === 'entregado'
  const ModeIcon = order.mode === 'delivery' ? Truck : Store

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={cn(
        'rounded-xl border bg-white dark:bg-gray-900 p-3.5 space-y-2.5 shadow-sm',
        order.status === 'nuevo' ? 'border-sky-300 dark:border-sky-800' : 'border-gray-200 dark:border-gray-800',
        delivered && 'opacity-80',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-gray-900 dark:text-white">#{order.number}</span>
        <span className="text-[11px] text-gray-400">{minutesAgo(order.created_at)}</span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{order.customer.name}</p>
        <MemberBadge card={card} />
      </div>

      <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
        {order.lines.map((l) => (
          <li key={l.key} className="truncate">
            {l.qty}× {l.name}
            {l.variant_name && <span className="text-gray-400"> ({l.variant_name})</span>}
          </li>
        ))}
      </ul>
      {order.note && <p className="text-xs italic text-amber-700 dark:text-amber-400">“{order.note}”</p>}

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-gray-500 min-w-0">
          <ModeIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{order.mode === 'delivery' ? order.address : 'Retiro'}</span>
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
          {formatShowcasePrice(order.total)}
        </span>
      </div>

      {delivered ? (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[11px] text-gray-500">
            {order.payment_method ? `Cobrado · ${paymentMethod(order.payment_method).label}` : 'Entregado'}
          </span>
          {!card && (
            <a
              href={waLink(order.customer.phone, orderMessageForCustomer(order, null))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invitar al club
            </a>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-1">
          <a
            href={waLink(order.customer.phone, orderMessageForCustomer(order, card))}
            target="_blank"
            rel="noopener noreferrer"
            title="Escribirle por WhatsApp"
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[#25D366] hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
          <Button size="sm" className="flex-1 h-9" onClick={onAdvance}>
            {stage.action} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          {order.status === 'nuevo' && (
            <button
              onClick={onCancel}
              title="Rechazar pedido"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export function OrdersBoard({ orders, cardFor, onMove, onDeliver }) {
  useTick()
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
      {ORDER_STAGES.map((stage) => {
        const items = orders.filter((o) => o.status === stage.id)
        return (
          <div key={stage.id} className="flex-1 min-w-[250px] snap-start">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={cn('w-2 h-2 rounded-full', stage.color)} />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{stage.label}</h3>
              <span className="text-xs text-gray-400 tabular-nums">{items.length}</span>
            </div>
            <div className="rounded-2xl bg-gray-100/70 dark:bg-gray-900/50 p-2 space-y-2 min-h-[160px]">
              <AnimatePresence initial={false}>
                {items.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    card={cardFor(order)}
                    onAdvance={() =>
                      nextStage(order.status) === 'entregado'
                        ? onDeliver(order)
                        : onMove(order.id, nextStage(order.status))
                    }
                    onCancel={() => onMove(order.id, 'cancelado')}
                  />
                ))}
              </AnimatePresence>
              {items.length === 0 && <p className="text-xs text-gray-400 text-center py-8">Sin pedidos</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Deliver + charge ─────────────────────────────────────────────────────────

export function DeliverDialog({ order, card, onClose, onConfirm }) {
  const [method, setMethod] = useState('efectivo')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (order) {
      setMethod(order.mode === 'delivery' ? 'efectivo' : 'qr')
      setResult(null)
    }
  }, [order])

  if (!order) return null
  const firstName = order.customer.name.split(' ')[0]

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        {result ? (
          <div className="text-center space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center">Pedido #{order.number} entregado</DialogTitle>
              <DialogDescription className="text-center">
                La venta quedó registrada en Caja por {formatShowcasePrice(order.total)}.
              </DialogDescription>
            </DialogHeader>
            {result.card ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-200">
                {firstName} sumó +1 sello · {result.card.stamps}/{STAMPS_REQUIRED}
                {result.card.rewardsAvailable > 0 && ' · ¡tiene un café gratis!'}
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                {firstName} todavía no es socio. Invítalo al club para que sume sellos con sus pedidos.
              </div>
            )}
            <a
              href={waLink(
                order.customer.phone,
                orderMessageForCustomer({ ...order, status: 'entregado' }, result.card),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 rounded-xl bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4" />
              {result.card ? 'Avisarle por WhatsApp' : 'Invitarlo por WhatsApp'}
            </a>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Listo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Entregar pedido #{order.number}</DialogTitle>
              <DialogDescription>
                {order.customer.name} · {formatShowcasePrice(order.total)}
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">¿Cómo pagó?</p>
              <div className="grid grid-cols-4 gap-2">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border py-2 text-[11px] font-medium',
                      method === id
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                        : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300',
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {card ? (
              <p className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                <Stamp className="w-4 h-4" /> {firstName} suma +1 sello con este pedido
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <UserPlus className="w-4 h-4" /> {firstName} no es socio: no suma sellos
              </p>
            )}
            <Button
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={() => setResult({ card: onConfirm(order, method) })}
            >
              Entregar y cobrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────

// WhatsApp number and delivery options, stored on the showcase brand.
export function OrdersSettingsDialog({ open, onOpenChange, brand, onSave }) {
  const [draft, setDraft] = useState(brand)
  const set = (fields) => setDraft((d) => ({ ...d, ...fields }))
  const validWhatsapp = draft.whatsapp.replace(/\D/g, '').length >= 8

  useEffect(() => {
    if (open) setDraft(brand)
  }, [open, brand])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustes de pedidos</DialogTitle>
          <DialogDescription>Tus clientes arman el pedido en la vitrina y te lo envían por WhatsApp.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>WhatsApp que recibe los pedidos</Label>
            <Input
              value={draft.whatsapp}
              onChange={(e) => set({ whatsapp: e.target.value })}
              placeholder="+54 9 11 2345-6789"
              className={cn(!validWhatsapp && 'border-red-400')}
            />
            <p className="text-xs text-gray-500">Con código de país. Ahí llega el mensaje con el detalle del pedido.</p>
          </div>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="font-medium text-gray-900 dark:text-white">Ofrecer delivery</span>
            <Switch checked={draft.delivery_enabled} onCheckedChange={(v) => set({ delivery_enabled: v })} />
          </label>
          {draft.delivery_enabled && (
            <div className="space-y-2">
              <Label>Costo de envío</Label>
              <Input
                type="number"
                min={0}
                value={draft.delivery_fee}
                onChange={(e) => set({ delivery_fee: e.target.value === '' ? '' : Number(e.target.value) })}
                className="w-40"
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(draft)} disabled={!validWhatsapp}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
