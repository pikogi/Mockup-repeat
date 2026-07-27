import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Crown,
  DollarSign,
  Layers,
  Pencil,
  Repeat,
  ShoppingCart,
  Trash2,
  TrendingUp,
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

const CATEGORY_OPTIONS = ['Bebidas calientes', 'Bebidas frías', 'Postres', 'Panadería']
const SEGMENT_OPTIONS = ['VIP', 'Frecuentes', 'Nuevos', 'En riesgo de fuga']

const CONDITION_OPTIONS = [
  { value: 'cart_min', label: 'Monto mínimo de compra', desc: 'Se activa cuando el carrito supera un monto.' },
  { value: 'visit_number', label: 'Número de visita', desc: 'Se activa en una visita específica (ej. la 5ta).' },
  { value: 'inactivity', label: 'Cliente inactivo', desc: 'Se activa si el cliente no vuelve hace X días.' },
  { value: 'category', label: 'Categoría de producto', desc: 'Se activa al comprar de una categoría específica.' },
  { value: 'segment', label: 'Segmento de cliente', desc: 'Se activa solo para un grupo de clientes.' },
]

const CONDITION_ICON = {
  cart_min: ShoppingCart,
  visit_number: Repeat,
  inactivity: Clock,
  category: Layers,
  segment: Crown,
}

const DISCOUNT_OPTIONS = [
  { value: 'percent', label: '% de descuento' },
  { value: 'fixed', label: 'Monto fijo ($)' },
]

const INITIAL_RULES = [
  {
    id: 1,
    name: '15% off con carrito desde $8.000',
    conditionType: 'cart_min',
    conditionValue: 8000,
    discountType: 'percent',
    discountValue: 15,
    enabled: true,
    appliedCount: 86,
    discountGiven: 47200,
    avgTicket: 9800,
  },
  {
    id: 2,
    name: '$800 off en tu 5ta visita',
    conditionType: 'visit_number',
    conditionValue: 5,
    discountType: 'fixed',
    discountValue: 800,
    enabled: true,
    appliedCount: 22,
    discountGiven: 17600,
    avgTicket: 6200,
  },
  {
    id: 3,
    name: '20% off si no volviste en 30 días',
    conditionType: 'inactivity',
    conditionValue: 30,
    discountType: 'percent',
    discountValue: 20,
    enabled: true,
    appliedCount: 14,
    discountGiven: 9800,
    avgTicket: 3500,
  },
  {
    id: 4,
    name: '10% off en Postres',
    conditionType: 'category',
    conditionValue: 'Postres',
    discountType: 'percent',
    discountValue: 10,
    enabled: true,
    appliedCount: 63,
    discountGiven: 18900,
    avgTicket: 3100,
  },
  {
    id: 5,
    name: '25% off para clientes VIP',
    conditionType: 'segment',
    conditionValue: 'VIP',
    discountType: 'percent',
    discountValue: 25,
    enabled: false,
    appliedCount: 0,
    discountGiven: 0,
    avgTicket: 0,
  },
]

function conditionLabel(rule) {
  switch (rule.conditionType) {
    case 'cart_min':
      return `Carrito ≥ $${Number(rule.conditionValue).toLocaleString('es-AR')}`
    case 'visit_number':
      return `En la visita #${rule.conditionValue}`
    case 'inactivity':
      return `Inactivo ${rule.conditionValue}+ días`
    case 'category':
      return `Categoría: ${rule.conditionValue}`
    case 'segment':
      return `Segmento: ${rule.conditionValue}`
    default:
      return ''
  }
}

function discountLabel(rule) {
  return rule.discountType === 'percent' ? `${rule.discountValue}% off` : `$${rule.discountValue} off`
}

function defaultConditionValue(conditionType) {
  if (conditionType === 'cart_min') return 5000
  if (conditionType === 'visit_number') return 3
  if (conditionType === 'inactivity') return 15
  if (conditionType === 'category') return CATEGORY_OPTIONS[0]
  if (conditionType === 'segment') return SEGMENT_OPTIONS[0]
  return ''
}

function RuleCard({ rule, onChange, onDelete, isTopRule }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({
    name: rule.name,
    conditionType: rule.conditionType,
    conditionValue: rule.conditionValue,
    discountType: rule.discountType,
    discountValue: rule.discountValue,
  })

  const ConditionIcon = CONDITION_ICON[rule.conditionType]
  const noActivity = rule.appliedCount === 0

  const openEdit = () => {
    setDraft({
      name: rule.name,
      conditionType: rule.conditionType,
      conditionValue: rule.conditionValue,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
    })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!draft.name.trim()) return toast.error('El nombre no puede estar vacío')
    onChange({
      ...rule,
      name: draft.name.trim(),
      conditionType: draft.conditionType,
      conditionValue: draft.conditionValue,
      discountType: draft.discountType,
      discountValue: Number(draft.discountValue) || rule.discountValue,
    })
    setIsEditing(false)
    toast.success('Regla actualizada')
  }

  const handleDelete = () => {
    onDelete(rule.id)
    toast.success('Regla eliminada')
  }

  return (
    <Card
      className={cn(
        'border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
        rule.enabled
          ? 'border-l-4 border-l-violet-400 border-gray-200 dark:border-gray-700'
          : 'border-gray-100 dark:border-gray-800 opacity-60',
      )}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 flex items-center gap-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              rule.enabled ? 'bg-violet-50 dark:bg-violet-900/20' : 'bg-gray-100 dark:bg-gray-800',
            )}
          >
            <ConditionIcon className={cn('w-4 h-4', rule.enabled ? 'text-violet-500' : 'text-gray-400')} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{rule.name}</span>
              {isTopRule && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                  <TrendingUp className="w-2.5 h-2.5" />
                  Más usada
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
              <span className="font-medium text-gray-500 dark:text-gray-400">SI</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {conditionLabel(rule)}
              </span>
              <span className="font-medium text-gray-500 dark:text-gray-400">ENTONCES</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 font-semibold">
                {discountLabel(rule)}
              </span>
              {noActivity && <span className="italic text-gray-300 dark:text-gray-600">· Sin actividad aún</span>}
            </div>
          </div>

          <Switch
            checked={rule.enabled}
            onCheckedChange={(v) => onChange({ ...rule, enabled: v })}
            className="flex-shrink-0"
          />
        </div>

        {/* Stats bar */}
        {rule.appliedCount > 0 && (
          <div className="px-4 pb-4 flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-gray-200">{rule.appliedCount}</strong> aplicaciones
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-gray-200">
                  ${rule.discountGiven.toLocaleString('es-AR')}
                </strong>{' '}
                descontados
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ticket prom.{' '}
                <strong className="text-gray-800 dark:text-gray-200">${rule.avgTicket.toLocaleString('es-AR')}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="px-4 py-2.5 border-t border-gray-50 dark:border-gray-800 flex items-center gap-3">
          <button
            onClick={() => (isEditing ? setIsEditing(false) : openEdit())}
            className={cn(
              'flex items-center gap-1 text-xs transition-colors',
              isEditing
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

        {/* Expandable edit panel */}
        <AnimatePresence initial={false}>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-3 border-t border-gray-50 dark:border-gray-800 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nombre</Label>
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="text-sm h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">¿Cuándo se activa?</Label>
                  <div className="space-y-1.5">
                    {CONDITION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            conditionType: opt.value,
                            conditionValue: defaultConditionValue(opt.value),
                          }))
                        }
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-left transition-all',
                          draft.conditionType === opt.value
                            ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                        )}
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            draft.conditionType === opt.value ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600',
                          )}
                        />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block text-xs font-medium',
                              draft.conditionType === opt.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500',
                            )}
                          >
                            {opt.label}
                          </span>
                          <span className="block text-[11px] text-gray-400 truncate">{opt.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      {draft.conditionType === 'cart_min' && 'Monto mínimo ($)'}
                      {draft.conditionType === 'visit_number' && 'Número de visita'}
                      {draft.conditionType === 'inactivity' && 'Días de inactividad'}
                      {draft.conditionType === 'category' && 'Categoría'}
                      {draft.conditionType === 'segment' && 'Segmento'}
                    </Label>
                    {draft.conditionType === 'category' || draft.conditionType === 'segment' ? (
                      <select
                        value={draft.conditionValue}
                        onChange={(e) => setDraft((d) => ({ ...d, conditionValue: e.target.value }))}
                        className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5 h-8"
                      >
                        {(draft.conditionType === 'category' ? CATEGORY_OPTIONS : SEGMENT_OPTIONS).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type="number"
                        value={draft.conditionValue}
                        onChange={(e) => setDraft((d) => ({ ...d, conditionValue: e.target.value }))}
                        className="text-sm h-8"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Descuento</Label>
                    <select
                      value={draft.discountType}
                      onChange={(e) => setDraft((d) => ({ ...d, discountType: e.target.value }))}
                      className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5 h-8"
                    >
                      {DISCOUNT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">
                    Valor del descuento ({draft.discountType === 'percent' ? '%' : '$'})
                  </Label>
                  <Input
                    type="number"
                    value={draft.discountValue}
                    onChange={(e) => setDraft((d) => ({ ...d, discountValue: e.target.value }))}
                    className="text-sm h-8"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="flex-1 h-8 text-xs">
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} className="flex-1 h-8 text-xs">
                    Guardar
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

export function DescuentosAutomaticosContent() {
  const [rules, setRules] = useState(INITIAL_RULES)
  const [dateFilter, setDateFilter] = useState('month')
  const [customDate, setCustomDate] = useState({
    from: startOfMonthUTC(new Date()),
    to: new Date(),
  })

  const handleChange = (updated) => setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  const handleDelete = (id) => setRules((prev) => prev.filter((r) => r.id !== id))

  const { fromDate, toDate } = useMemo(() => {
    const to = new Date()
    if (dateFilter === '7d') return { fromDate: subDaysUTC(to, 7), toDate: to }
    if (dateFilter === 'month') return { fromDate: startOfMonthUTC(to), toDate: to }
    return { fromDate: customDate.from, toDate: customDate.to }
  }, [dateFilter, customDate])

  const periodDays = useMemo(() => Math.max(1, Math.round((toDate - fromDate) / 86400000)), [fromDate, toDate])
  const scale = Math.min(1, periodDays / 30)

  const scaledRules = useMemo(
    () =>
      rules.map((r) => ({
        ...r,
        appliedCount: Math.round(r.appliedCount * scale),
        discountGiven: Math.round(r.discountGiven * scale),
      })),
    [rules, scale],
  )

  const topRuleId = useMemo(() => {
    const withActivity = scaledRules.filter((r) => r.appliedCount > 0)
    if (withActivity.length === 0) return null
    return withActivity.reduce((top, r) => (r.appliedCount > top.appliedCount ? r : top)).id
  }, [scaledRules])

  const computedStats = useMemo(() => {
    const active = rules.filter((r) => r.enabled).length
    const totalApplied = scaledRules.reduce((s, r) => s + r.appliedCount, 0)
    const totalDiscount = scaledRules.reduce((s, r) => s + r.discountGiven, 0)
    const withActivity = scaledRules.filter((r) => r.appliedCount > 0)
    const avgTicket =
      withActivity.length > 0
        ? Math.round(
            withActivity.reduce((s, r) => s + r.avgTicket * r.appliedCount, 0) /
              withActivity.reduce((s, r) => s + r.appliedCount, 0),
          )
        : 0

    return [
      {
        label: 'Reglas activas',
        value: String(active),
        sub: `de ${rules.length} creadas`,
        icon: Zap,
        color: 'text-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
      },
      {
        label: 'Aplicaciones en el período',
        value: String(totalApplied),
        sub: 'descuentos aplicados solos',
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      },
      {
        label: 'Descuento total otorgado',
        value: `$${totalDiscount.toLocaleString('es-AR')}`,
        sub: 'en el período',
        icon: DollarSign,
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
      },
      {
        label: 'Ticket promedio con descuento',
        value: avgTicket > 0 ? `$${avgTicket.toLocaleString('es-AR')}` : '—',
        sub: 'ponderado por uso',
        icon: TrendingUp,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      },
    ]
  }, [rules, scaledRules])

  const sortedRules = useMemo(
    () =>
      [...scaledRules].sort((a, b) => {
        if (a.enabled !== b.enabled) return a.enabled ? -1 : 1
        return b.appliedCount - a.appliedCount
      }),
    [scaledRules],
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
          A diferencia de los cupones, estos descuentos se aplican solos en el momento de la compra — sin códigos ni
          canjes.
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

      {/* Rule list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {sortedRules.map((r) => (
          <RuleCard
            key={r.id}
            rule={r}
            onChange={handleChange}
            onDelete={handleDelete}
            isTopRule={r.id === topRuleId}
          />
        ))}
      </motion.div>
    </>
  )
}

export default function DescuentosAutomaticosRoadmap() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Descuentos automáticos</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Definí reglas que descuentan solas en el momento de la compra, sin cupones ni códigos.
          </p>
        </motion.div>
        <DescuentosAutomaticosContent />
      </div>
    </div>
  )
}
