import { useState } from 'react'
import { Ticket, Users, Percent, Plus, ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATS = [
  {
    label: 'Cupones activos',
    value: '3',
    sub: '1 vence esta semana',
    icon: Ticket,
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    label: 'Canjeados (30d)',
    value: '61',
    sub: '+18 vs mes anterior',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    label: 'Tasa de canje',
    value: '42%',
    sub: 'de cupones emitidos',
    icon: Percent,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    label: 'Miembros alcanzados',
    value: '148',
    sub: 'en último envío',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
]

const INITIAL_COUPONS = [
  {
    id: 1,
    name: 'Café gratis en tu cumpleaños',
    type: 'free_item',
    value: null,
    trigger: 'birthday',
    triggerLabel: 'Cumpleaños',
    validityDays: 7,
    issued: 12,
    redeemed: 11,
    enabled: true,
    expiresAt: null,
  },
  {
    id: 2,
    name: '20% off en tu primera visita del mes',
    type: 'percent',
    value: 20,
    trigger: 'monthly',
    triggerLabel: 'Mensual',
    validityDays: 30,
    issued: 148,
    redeemed: 38,
    enabled: true,
    expiresAt: '2026-07-01',
  },
  {
    id: 3,
    name: '$500 de descuento al completar tarjeta',
    type: 'fixed',
    value: 500,
    trigger: 'stamp_complete',
    triggerLabel: 'Al completar tarjeta',
    validityDays: 14,
    issued: 27,
    redeemed: 12,
    enabled: true,
    expiresAt: null,
  },
  {
    id: 4,
    name: 'Bienvenida — café gratis',
    type: 'free_item',
    value: null,
    trigger: 'signup',
    triggerLabel: 'Al registrarse',
    validityDays: 7,
    issued: 34,
    redeemed: 29,
    enabled: false,
    expiresAt: null,
  },
]

const TRIGGER_OPTIONS = [
  { value: 'signup', label: 'Al registrarse', desc: 'Se emite cuando el cliente completa el registro.' },
  { value: 'birthday', label: 'Cumpleaños', desc: 'Se emite en la fecha de cumpleaños del miembro.' },
  { value: 'stamp_complete', label: 'Al completar tarjeta', desc: 'Cuando el cliente llena todos los sellos.' },
  { value: 'monthly', label: 'Mensual', desc: 'Se emite una vez por mes a todos los miembros activos.' },
]

const BENEFIT_OPTIONS = [
  { value: 'percent', label: '% de descuento' },
  { value: 'fixed', label: 'Monto fijo ($)' },
  { value: 'free_item', label: 'Ítem gratis' },
]

function benefitLabel(coupon) {
  if (coupon.type === 'percent') return `${coupon.value}% off`
  if (coupon.type === 'fixed') return `$${coupon.value} off`
  return 'Gratis'
}

function CouponCard({ coupon, onChange }) {
  const [expanded, setExpanded] = useState(false)
  const redemptionRate = coupon.issued > 0 ? Math.round((coupon.redeemed / coupon.issued) * 100) : 0

  return (
    <Card
      className={cn(
        'border shadow-sm transition-all duration-200 overflow-hidden',
        coupon.enabled
          ? 'border-l-4 border-l-orange-400 border-gray-100 dark:border-gray-800'
          : 'border-gray-100 dark:border-gray-800 opacity-60',
      )}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
              <Ticket className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{coupon.name}</p>
                <Switch
                  checked={coupon.enabled}
                  onCheckedChange={(v) => onChange({ ...coupon, enabled: v })}
                  className="flex-shrink-0"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-[11px] font-semibold bg-orange-50 dark:bg-orange-900/30 text-orange-600 px-2 py-0.5 rounded-full">
                  {benefitLabel(coupon)}
                </span>
                <span className="text-[11px] text-gray-400">{coupon.triggerLabel}</span>
                <span className="text-[11px] text-gray-400">· {coupon.validityDays}d de validez</span>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
            <div className="text-center">
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">{coupon.issued}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Emitidos</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">{coupon.redeemed}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Canjeados</p>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-emerald-600">{redemptionRate}%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Tasa</p>
              <div className="h-0.5 rounded-full bg-gray-100 dark:bg-gray-800 mt-1 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${redemptionRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-t border-gray-50 dark:border-gray-800 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" /> Cerrar
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Ver más
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 space-y-2 border-t border-gray-50 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                {coupon.expiresAt && (
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                    Vence el {new Date(coupon.expiresAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                  </div>
                )}
                <p>
                  Trigger: <strong className="text-gray-700 dark:text-gray-300">{coupon.triggerLabel}</strong>
                </p>
                <p>
                  Validez:{' '}
                  <strong className="text-gray-700 dark:text-gray-300">{coupon.validityDays} días desde emisión</strong>
                </p>
                <p>
                  Beneficio: <strong className="text-gray-700 dark:text-gray-300">{benefitLabel(coupon)}</strong>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function CreateCouponPanel({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState('signup')
  const [benefit, setBenefit] = useState('percent')
  const [value, setValue] = useState('')
  const [validity, setValidity] = useState('30')

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Ingresá un nombre para el cupón')
      return
    }
    const selected = TRIGGER_OPTIONS.find((t) => t.value === trigger)
    onAdd({
      id: Date.now(),
      name: name.trim(),
      type: benefit,
      value: benefit === 'free_item' ? null : Number(value) || null,
      trigger,
      triggerLabel: selected?.label || trigger,
      validityDays: Number(validity) || 30,
      issued: 0,
      redeemed: 0,
      enabled: true,
      expiresAt: null,
    })
    setName('')
    setTrigger('signup')
    setBenefit('percent')
    setValue('')
    setValidity('30')
    setOpen(false)
    toast.success('Cupón creado')
  }

  return (
    <Card className="border border-dashed border-gray-200 dark:border-gray-700 shadow-none">
      <CardContent className="p-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo cupón
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nombre del cupón</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: 10% off para miembros VIP"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">¿Cómo se obtiene?</Label>
                  <div className="space-y-1.5">
                    {TRIGGER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTrigger(opt.value)}
                        className={cn(
                          'w-full flex items-start gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all',
                          trigger === opt.value
                            ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                        )}
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full mt-1 flex-shrink-0',
                            trigger === opt.value ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600',
                          )}
                        />
                        <div>
                          <p
                            className={cn(
                              'text-xs font-semibold',
                              trigger === opt.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500',
                            )}
                          >
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Beneficio</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {BENEFIT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setBenefit(opt.value)}
                        className={cn(
                          'py-2 rounded-lg border-2 text-xs font-semibold transition-all',
                          benefit === opt.value
                            ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-gray-900 dark:text-gray-100'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {benefit !== 'free_item' && (
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={benefit === 'percent' ? '20' : '500'}
                      className="text-sm mt-1.5"
                    />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Validez (días)</Label>
                  <Input
                    type="number"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleCreate} className="flex-1">
                    Crear
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default function CuponesRoadmap() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS)
  const [filter, setFilter] = useState('all')

  const handleChange = (updated) => setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  const handleAdd = (c) => setCoupons((prev) => [c, ...prev])

  const filtered =
    filter === 'all'
      ? coupons
      : filter === 'active'
        ? coupons.filter((c) => c.enabled)
        : coupons.filter((c) => !c.enabled)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Cupones</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Creá y gestioná cupones de descuento que tus clientes reciben automáticamente.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
                <CardContent className="p-5">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}>
                    <s.icon className={cn('w-4.5 h-4.5', s.color)} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter + list */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-1 mb-5">
            {[
              { id: 'all', label: `Todos (${coupons.length})` },
              { id: 'active', label: `Activos (${coupons.filter((c) => c.enabled).length})` },
              { id: 'inactive', label: 'Inactivos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                  filter === f.id
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CouponCard coupon={c} onChange={handleChange} />
              </motion.div>
            ))}
            <CreateCouponPanel onAdd={handleAdd} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
