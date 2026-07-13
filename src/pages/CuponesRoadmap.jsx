import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  Pencil,
  Percent,
  Ticket,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import DateFilterSelect from '@/components/shared/DateFilterSelect'
import { startOfMonthUTC, subDaysUTC } from '@/utils/date'

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
    expiresAt: '2026-07-15',
    campaigns: [
      { id: 1, name: 'Vuelta de vacaciones ☀️', type: 'manual', sent: 114, redeemed: 29, date: '2026-06-20' },
      { id: 2, name: 'Automatización — Inactividad', type: 'auto', sent: 34, redeemed: 9, date: '2026-05-15' },
    ],
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
    campaigns: [
      { id: 1, name: 'Reactivación temprana', type: 'auto', sent: 15, redeemed: 7, date: '2026-07-01' },
      { id: 2, name: 'Fin de temporada ☕', type: 'manual', sent: 12, redeemed: 5, date: '2026-05-28' },
    ],
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

const BENEFIT_STYLE = {
  percent: 'text-violet-600 bg-violet-50 dark:bg-violet-900/30',
  fixed: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
  free_item: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
}

function benefitLabel(coupon) {
  if (coupon.type === 'percent') return `${coupon.value}% off`
  if (coupon.type === 'fixed') return `$${coupon.value} off`
  return 'Gratis'
}

function daysUntilExpiry(dateStr) {
  return Math.ceil((new Date(dateStr + 'T12:00:00') - new Date()) / 86400000)
}

function CouponCard({ coupon, onChange, onDelete, fromDate, toDate }) {
  const [mode, setMode] = useState(null) // null | 'campaigns' | 'editing'
  const [draft, setDraft] = useState({
    name: coupon.name,
    trigger: coupon.trigger,
    benefit: coupon.type,
    value: coupon.value ?? '',
    validityDays: coupon.validityDays,
  })

  const rate = coupon.issued > 0 ? Math.round((coupon.redeemed / coupon.issued) * 100) : 0
  const expiryDays = coupon.expiresAt ? daysUntilExpiry(coupon.expiresAt) : null
  const expiringSoon = expiryDays !== null && expiryDays <= 7 && expiryDays >= 0
  const highConversion = rate >= 70 && coupon.issued >= 5
  const noActivity = coupon.issued === 0

  const campaignsInPeriod = useMemo(() => {
    if (!coupon.campaigns) return []
    return coupon.campaigns.filter((c) => {
      const d = new Date(c.date + 'T12:00:00')
      return d >= fromDate && d <= toDate
    })
  }, [coupon.campaigns, fromDate, toDate])

  const handleSaveEdit = () => {
    if (!draft.name.trim()) return toast.error('El nombre no puede estar vacío')
    const triggerOpt = TRIGGER_OPTIONS.find((t) => t.value === draft.trigger)
    onChange({
      ...coupon,
      name: draft.name.trim(),
      trigger: draft.trigger,
      triggerLabel: triggerOpt?.label ?? draft.trigger,
      type: draft.benefit,
      value: draft.benefit === 'free_item' ? null : Number(draft.value) || coupon.value,
      validityDays: Number(draft.validityDays) || coupon.validityDays,
    })
    setMode(null)
    toast.success('Cupón actualizado')
  }

  const handleDelete = () => {
    onDelete(coupon.id)
    toast.success('Cupón eliminado')
  }

  const toggleMode = (next) => setMode((prev) => (prev === next ? null : next))

  return (
    <Card
      className={cn(
        'border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
        coupon.enabled
          ? expiringSoon
            ? 'border-l-4 border-l-amber-400 border-gray-200 dark:border-gray-700'
            : 'border-l-4 border-l-orange-400 border-gray-200 dark:border-gray-700'
          : 'border-gray-100 dark:border-gray-800 opacity-60',
      )}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 flex items-center gap-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              coupon.enabled
                ? expiringSoon
                  ? 'bg-amber-50 dark:bg-amber-900/20'
                  : 'bg-orange-50 dark:bg-orange-900/20'
                : 'bg-gray-100 dark:bg-gray-800',
            )}
          >
            <Ticket
              className={cn(
                'w-4 h-4',
                coupon.enabled ? (expiringSoon ? 'text-amber-500' : 'text-orange-500') : 'text-gray-400',
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{coupon.name}</span>
              <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', BENEFIT_STYLE[coupon.type])}>
                {benefitLabel(coupon)}
              </span>
              {highConversion && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                  <TrendingUp className="w-2.5 h-2.5" />
                  Alta conversión
                </span>
              )}
              {expiringSoon && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full text-amber-700 bg-amber-50 dark:bg-amber-900/20">
                  <Clock className="w-2.5 h-2.5" />
                  Vence en {expiryDays}d
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{coupon.triggerLabel}</span>
              <span>·</span>
              <span>{coupon.validityDays}d de validez</span>
              {noActivity && <span className="italic text-gray-300 dark:text-gray-600">· Sin envíos aún</span>}
            </div>
          </div>

          <Switch
            checked={coupon.enabled}
            onCheckedChange={(v) => onChange({ ...coupon, enabled: v })}
            className="flex-shrink-0"
          />
        </div>

        {/* Stats bar */}
        {coupon.issued > 0 && (
          <div className="px-4 pb-4 flex items-center gap-3">
            <span className="text-xs text-gray-400 w-[90px] text-right flex-shrink-0">{coupon.issued} emitidos</span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rate}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className={cn(
                  'h-full rounded-full',
                  rate >= 70 ? 'bg-emerald-500' : rate >= 40 ? 'bg-orange-400' : 'bg-gray-400',
                )}
              />
            </div>
            <span className="text-xs text-gray-400 w-[90px] flex-shrink-0">{coupon.redeemed} canjeados</span>
            <span
              className={cn(
                'text-xs font-bold w-9 text-right flex-shrink-0',
                rate >= 70 ? 'text-emerald-600' : rate >= 40 ? 'text-orange-500' : 'text-gray-500',
              )}
            >
              {rate}%
            </span>
          </div>
        )}

        {/* Action bar */}
        <div className="px-4 py-2.5 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDraft({
                  name: coupon.name,
                  trigger: coupon.trigger,
                  benefit: coupon.type,
                  value: coupon.value ?? '',
                  validityDays: coupon.validityDays,
                })
                toggleMode('editing')
              }}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                mode === 'editing'
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              <Pencil className="w-3 h-3" /> Editar
            </button>
            <span className="text-gray-200 dark:text-gray-700 select-none">|</span>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Eliminar
            </button>
          </div>

          {coupon.campaigns?.length > 0 && (
            <button
              onClick={() => toggleMode('campaigns')}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                mode === 'campaigns'
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              {campaignsInPeriod.length > 0
                ? `${campaignsInPeriod.length} campaña${campaignsInPeriod.length > 1 ? 's' : ''} en el período`
                : 'Sin campañas en el período'}
              {mode === 'campaigns' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Expandable panel */}
        <AnimatePresence initial={false}>
          {mode !== null && (
            <motion.div
              key={mode}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-3 border-t border-gray-50 dark:border-gray-800">
                {mode === 'campaigns' && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Campañas en el período
                    </p>
                    {campaignsInPeriod.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Ninguna campaña en este período</p>
                    ) : (
                      campaignsInPeriod.map((c) => {
                        const cRate = Math.round((c.redeemed / c.sent) * 100)
                        return (
                          <div
                            key={c.id}
                            className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2.5"
                          >
                            <div className="flex-shrink-0">
                              {c.type === 'auto' ? (
                                <Zap className="w-3.5 h-3.5 text-violet-500" />
                              ) : (
                                <Mail className="w-3.5 h-3.5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{c.name}</p>
                              <p className="text-[11px] text-gray-400">
                                {new Date(c.date + 'T12:00:00').toLocaleDateString('es-AR', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {c.redeemed}/{c.sent}
                              </p>
                              <p className="text-[11px] text-emerald-600 font-semibold">{cRate}% canje</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                {mode === 'editing' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Nombre</Label>
                      <Input
                        value={draft.name}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        className="text-sm h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">¿Cómo se obtiene?</Label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {TRIGGER_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setDraft((d) => ({ ...d, trigger: opt.value }))}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-left transition-all',
                              draft.trigger === opt.value
                                ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                            )}
                          >
                            <span
                              className={cn(
                                'w-2 h-2 rounded-full flex-shrink-0',
                                draft.trigger === opt.value ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600',
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs font-medium',
                                draft.trigger === opt.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500',
                              )}
                            >
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1 col-span-1">
                        <Label className="text-xs">Beneficio</Label>
                        <select
                          value={draft.benefit}
                          onChange={(e) => setDraft((d) => ({ ...d, benefit: e.target.value }))}
                          className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5 h-8"
                        >
                          {BENEFIT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {draft.benefit !== 'free_item' && (
                        <div className="space-y-1 col-span-1">
                          <Label className="text-xs">Valor ({draft.benefit === 'percent' ? '%' : '$'})</Label>
                          <Input
                            type="number"
                            value={draft.value}
                            onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
                            className="text-sm h-8"
                          />
                        </div>
                      )}
                      <div className="space-y-1 col-span-1">
                        <Label className="text-xs">Validez (días)</Label>
                        <Input
                          type="number"
                          value={draft.validityDays}
                          onChange={(e) => setDraft((d) => ({ ...d, validityDays: e.target.value }))}
                          className="text-sm h-8"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => setMode(null)} className="flex-1 h-8 text-xs">
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit} className="flex-1 h-8 text-xs">
                        Guardar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export function CuponesContent() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS)
  const [dateFilter, setDateFilter] = useState('month')
  const [customDate, setCustomDate] = useState({
    from: startOfMonthUTC(new Date()),
    to: new Date(),
  })

  const handleChange = (updated) => setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  const handleDelete = (id) => setCoupons((prev) => prev.filter((c) => c.id !== id))

  const { fromDate, toDate } = useMemo(() => {
    const to = new Date()
    if (dateFilter === '7d') return { fromDate: subDaysUTC(to, 7), toDate: to }
    if (dateFilter === 'month') return { fromDate: startOfMonthUTC(to), toDate: to }
    return { fromDate: customDate.from, toDate: customDate.to }
  }, [dateFilter, customDate])

  const periodDays = useMemo(() => Math.max(1, Math.round((toDate - fromDate) / 86400000)), [fromDate, toDate])

  const computedStats = useMemo(() => {
    const active = coupons.filter((c) => c.enabled).length
    const expiringSoon = coupons.filter((c) => c.expiresAt && c.enabled && daysUntilExpiry(c.expiresAt) <= 7).length

    // Scale issued/redeemed proportionally to the period (30d = full, 7d = ~25%, custom = proportional)
    const scale = Math.min(1, periodDays / 30)
    const totalIssued = Math.round(coupons.reduce((s, c) => s + c.issued, 0) * scale)
    const totalRedeemed = Math.round(coupons.reduce((s, c) => s + c.redeemed, 0) * scale)
    const rate = totalIssued > 0 ? Math.round((totalRedeemed / totalIssued) * 100) : 0

    return [
      {
        label: 'Cupones activos',
        value: String(active),
        sub: expiringSoon > 0 ? `${expiringSoon} vence pronto` : 'Todos vigentes',
        icon: Ticket,
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
      },
      {
        label: 'Canjeados en el período',
        value: String(totalRedeemed),
        sub: `de ${totalIssued} emitidos`,
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      },
      {
        label: 'Tasa de canje',
        value: `${rate}%`,
        sub: 'promedio del período',
        icon: Percent,
        color: 'text-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
      },
      {
        label: 'Miembros alcanzados',
        value: String(totalIssued),
        sub: 'en el período',
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      },
    ]
  }, [coupons, periodDays])

  const sortedCoupons = useMemo(
    () =>
      [...coupons].sort((a, b) => {
        if (a.enabled !== b.enabled) return a.enabled ? -1 : 1
        const aExp = a.expiresAt ? daysUntilExpiry(a.expiresAt) : Infinity
        const bExp = b.expiresAt ? daysUntilExpiry(b.expiresAt) : Infinity
        if (aExp <= 7 && bExp > 7) return -1
        if (bExp <= 7 && aExp > 7) return 1
        return b.issued - a.issued
      }),
    [coupons],
  )

  return (
    <>
      {/* Date filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center gap-4"
      >
        <DateFilterSelect
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customDate={customDate}
          setCustomDate={setCustomDate}
        />
        <p className="text-xs text-gray-400">
          Creá cupones desde{' '}
          <span className="font-medium text-gray-500 dark:text-gray-400">Mis Clubes → Editar programa</span>
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {computedStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}>
                  <s.icon className={cn('w-4 h-4', s.color)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Coupon list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {sortedCoupons.map((c) => (
          <CouponCard
            key={c.id}
            coupon={c}
            onChange={handleChange}
            onDelete={handleDelete}
            fromDate={fromDate}
            toDate={toDate}
          />
        ))}
      </motion.div>
    </>
  )
}

export default function CuponesRoadmap() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Cupones</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Creá y gestioná cupones de descuento que tus clientes reciben automáticamente.
          </p>
        </motion.div>
        <CuponesContent />
      </div>
    </div>
  )
}
