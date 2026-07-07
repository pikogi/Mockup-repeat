import { useState } from 'react'
import { Crown, Users, Gift, Plus, X, TrendingUp } from 'lucide-react'
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
    label: 'Miembros totales',
    value: '148',
    sub: '+12 este mes',
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    label: 'Nivel más alto',
    value: 'Gold',
    sub: '8 miembros',
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    label: 'Beneficios canjeados',
    value: '93',
    sub: 'este mes',
    icon: Gift,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    label: 'Retención',
    value: '87%',
    sub: '30 días activos',
    icon: TrendingUp,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
]

const INITIAL_TIERS = [
  { id: 'bronze', name: 'Bronze', min_spend: 0, color: '#cd7f32', members: 92, description: 'Acceso al programa base' },
  {
    id: 'silver',
    name: 'Silver',
    min_spend: 5000,
    color: '#94a3b8',
    members: 48,
    description: 'Beneficios exclusivos Silver',
  },
  {
    id: 'gold',
    name: 'Gold',
    min_spend: 15000,
    color: '#f59e0b',
    members: 8,
    description: 'Experiencia premium completa',
  },
]

const INITIAL_BENEFITS = [
  {
    id: 1,
    name: 'Café de bienvenida',
    description: '1 café gratis al unirse al nivel',
    tier_required: 'all',
    use_type: 'once',
    icon: '☕',
  },
  {
    id: 2,
    name: '10% off todos los días',
    description: 'Descuento permanente en todas las compras',
    tier_required: 'silver',
    use_type: 'unlimited',
    icon: '%',
  },
  {
    id: 3,
    name: 'Acceso a eventos privados',
    description: 'Invitaciones exclusivas a degustaciones y lanzamientos',
    tier_required: 'gold',
    use_type: 'unlimited',
    icon: '🎉',
  },
  {
    id: 4,
    name: 'Bebida gratis mensual',
    description: 'Una bebida de hasta $2.000 por mes',
    tier_required: 'silver',
    use_type: 'monthly',
    icon: '🥤',
  },
  {
    id: 5,
    name: 'Prioridad en cola',
    description: 'Pasá al frente en horas pico',
    tier_required: 'gold',
    use_type: 'unlimited',
    icon: '⚡',
  },
]

const USE_LABELS = { once: 'Una vez', unlimited: 'Ilimitado', monthly: 'Mensual' }

function TierBadge({ tier, size = 'sm' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full border',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-3 py-1',
      )}
      style={{ color: tier.color, borderColor: `${tier.color}40`, backgroundColor: `${tier.color}12` }}
    >
      <span style={{ color: tier.color }}>●</span>
      {tier.name}
    </span>
  )
}

function TierBar({ tiers, total }) {
  return (
    <div className="space-y-2">
      {[...tiers]
        .sort((a, b) => b.min_spend - a.min_spend)
        .map((tier) => {
          const pct = total > 0 ? Math.round((tier.members / total) * 100) : 0
          return (
            <div key={tier.id} className="flex items-center gap-3">
              <TierBadge tier={tier} />
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
              </div>
              <div className="text-right flex-shrink-0 w-20">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tier.members}</span>
                <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
              </div>
            </div>
          )
        })}
    </div>
  )
}

function BenefitCard({ benefit, tiers, onRemove }) {
  const tier = tiers.find((t) => t.id === benefit.tier_required)

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-lg leading-none">
        {benefit.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{benefit.name}</p>
          <button
            onClick={() => onRemove(benefit.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{benefit.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {tier ? (
            <TierBadge tier={tier} />
          ) : (
            <span className="text-[11px] text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
              Todos los niveles
            </span>
          )}
          <span className="text-[11px] text-gray-400">{USE_LABELS[benefit.use_type]}</span>
        </div>
      </div>
    </div>
  )
}

function AddBenefitForm({ tiers, onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [tierReq, setTierReq] = useState('all')
  const [useType, setUseType] = useState('unlimited')
  const [icon, setIcon] = useState('🎁')

  const handle = () => {
    if (!name.trim()) {
      toast.error('Ingresá un nombre')
      return
    }
    onAdd({
      id: Date.now(),
      name: name.trim(),
      description: desc.trim(),
      tier_required: tierReq,
      use_type: useType,
      icon,
    })
    setName('')
    setDesc('')
    setTierReq('all')
    setUseType('unlimited')
    setIcon('🎁')
    setOpen(false)
    toast.success('Beneficio agregado')
  }

  return (
    <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Agregar beneficio
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
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-5 gap-2 items-end">
                <div className="col-span-1 space-y-1.5">
                  <Label className="text-xs">Icono</Label>
                  <Input
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="text-center text-lg"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-4 space-y-1.5">
                  <Label className="text-xs">Nombre del beneficio</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: 15% off los martes"
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Descripción (opcional)</Label>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Explicá el beneficio brevemente"
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Nivel requerido</Label>
                  <select
                    value={tierReq}
                    onChange={(e) => setTierReq(e.target.value)}
                    className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  >
                    <option value="all">Todos los niveles</option>
                    {tiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Frecuencia de uso</Label>
                  <select
                    value={useType}
                    onChange={(e) => setUseType(e.target.value)}
                    className="w-full text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                  >
                    <option value="unlimited">Ilimitado</option>
                    <option value="once">Una vez</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button size="sm" onClick={handle} className="flex-1">
                  Agregar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AddTierForm({ onAdd }) {
  const [name, setName] = useState('')
  const [minSpend, setMinSpend] = useState('')
  const [color, setColor] = useState('#6366f1')

  const handle = () => {
    if (!name.trim() || minSpend === '') {
      toast.error('Completá nombre y gasto mínimo')
      return
    }
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      min_spend: Number(minSpend),
      color,
      members: 0,
      description: '',
    })
    setName('')
    setMinSpend('')
    setColor('#6366f1')
    toast.success('Nivel creado')
  }

  return (
    <div className="flex items-end gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="space-y-1">
        <Label className="text-xs">Color</Label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-white dark:bg-gray-900"
        />
      </div>
      <div className="flex-1 space-y-1.5">
        <Label className="text-xs">Nombre del nivel</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Platinum"
          className="text-sm h-9"
        />
      </div>
      <div className="w-28 space-y-1.5">
        <Label className="text-xs">Gasto mínimo ($)</Label>
        <Input
          type="number"
          value={minSpend}
          onChange={(e) => setMinSpend(e.target.value)}
          placeholder="30000"
          className="text-sm h-9"
        />
      </div>
      <Button size="sm" onClick={handle} className="h-9 flex-shrink-0">
        Agregar
      </Button>
    </div>
  )
}

export default function MembresiaRoadmap() {
  const [tiers, setTiers] = useState(INITIAL_TIERS)
  const [benefits, setBenefits] = useState(INITIAL_BENEFITS)
  const [tiersEnabled, setTiersEnabled] = useState(true)

  const total = tiers.reduce((s, t) => s + t.members, 0)

  const handleAddTier = (t) => setTiers((prev) => [...prev, t].sort((a, b) => a.min_spend - b.min_spend))
  const handleRemoveTier = (id) => setTiers((prev) => prev.filter((t) => t.id !== id))
  const handleAddBenefit = (b) => setBenefits((prev) => [b, ...prev])
  const handleRemoveBenefit = (id) => setBenefits((prev) => prev.filter((b) => b.id !== id))

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Membresía</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Niveles de fidelidad con beneficios exclusivos según cuánto gastan tus clientes.
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

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left — Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-2 space-y-4"
          >
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Niveles activos</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Tiers</span>
                    <Switch checked={tiersEnabled} onCheckedChange={setTiersEnabled} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  {total} miembros distribuidos en {tiers.length} niveles
                </p>

                <TierBar tiers={tiers} total={total} />

                {/* Tier cards */}
                <div className="space-y-2 mt-5">
                  {[...tiers]
                    .sort((a, b) => b.min_spend - a.min_spend)
                    .map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 group"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tier.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{tier.name}</p>
                          <p className="text-[11px] text-gray-400">
                            Desde ${tier.min_spend.toLocaleString('es-AR')} de gasto
                          </p>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {tier.members} miembros
                        </span>
                        {tiers.length > 1 && (
                          <button
                            onClick={() => handleRemoveTier(tier.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                <div className="mt-4">
                  <AddTierForm onAdd={handleAddTier} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right — Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="xl:col-span-3 space-y-4"
          >
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Catálogo de beneficios</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{benefits.length} beneficios configurados</p>
                  </div>
                  <div className="flex gap-1">
                    {tiers.map((t) => (
                      <TierBadge key={t.id} tier={t} />
                    ))}
                    <span className="text-[11px] text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
                      Todos
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {benefits.map((b, i) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <BenefitCard benefit={b} tiers={tiers} onRemove={handleRemoveBenefit} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <AddBenefitForm tiers={tiers} onAdd={handleAddBenefit} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
