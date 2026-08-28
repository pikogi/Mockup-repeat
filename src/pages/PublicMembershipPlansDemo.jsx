import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  Check,
  ChevronLeft,
  CreditCard,
  CheckCircle2,
  Crown,
  Sparkles,
  Wallet,
  Pause,
  Ban,
  RotateCcw,
  Settings,
  Clock3,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { loadMembershipData } from '@/constants/membershipDemoData'
import { formatMoney, periodLabel } from '@/lib/membershipFormat'
import { addDaysUTC } from '@/utils/date'

// ─── Landing + comparación de planes ───────────────────────────────────────────

function PlanCompareCard({ plan, highlighted, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-3xl p-6 flex flex-col bg-white border ${
        highlighted ? 'border-2 shadow-xl' : 'border-gray-100 shadow-sm'
      }`}
      style={highlighted ? { borderColor: plan.color } : {}}
    >
      {highlighted && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: plan.color }}
        >
          Más elegido
        </span>
      )}
      <p className="font-bold text-lg text-gray-900">{plan.name}</p>
      <p className="text-sm text-gray-500 mt-1 mb-4 min-h-[40px]">{plan.description}</p>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-black text-gray-900">{formatMoney(plan.price)}</span>
        <span className="text-sm text-gray-400 mb-1">/{periodLabel(plan.billing_period_days)}</span>
      </div>
      {plan.trial_days > 0 && (
        <p className="text-xs font-semibold mb-4" style={{ color: plan.color }}>
          Primeros {plan.trial_days} días gratis
        </p>
      )}
      <div className="space-y-2.5 flex-1 mb-6 mt-2">
        {[...plan.included_services, ...plan.perks].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${plan.color}15` }}
            >
              <Check className="w-3 h-3" style={{ color: plan.color }} />
            </div>
            <span className="text-sm text-gray-700">{item.name}</span>
          </div>
        ))}
        {plan.discount_pct > 0 && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${plan.color}15` }}
            >
              <Check className="w-3 h-3" style={{ color: plan.color }} />
            </div>
            <span className="text-sm text-gray-700">{plan.discount_pct}% off en productos</span>
          </div>
        )}
      </div>
      <Button
        className="w-full h-11 rounded-xl font-bold text-white"
        style={{ backgroundColor: plan.color }}
        onClick={() => onSelect(plan)}
      >
        Elegir {plan.name}
      </Button>
    </motion.div>
  )
}

function LandingStep({ settings, plans, onSelectPlan, onViewExpiredExample }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="text-white text-center py-14 px-4"
        style={{ background: `linear-gradient(135deg, ${settings.color} 0%, #000 100%)` }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">{settings.subtitle}</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-2">{settings.business_name}</h1>
        <p className="text-white/60 max-w-md mx-auto">
          Sumate a la membresía y llevá tu experiencia al siguiente nivel.
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <PlanCompareCard key={plan.id} plan={plan} highlighted={i === 1} onSelect={onSelectPlan} />
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">Cancelás cuando quieras. Sin permanencia.</p>
        <p className="text-center text-xs text-gray-300 mt-2">
          ¿Ya sos miembro y venció tu membresía?{' '}
          <button onClick={onViewExpiredExample} className="underline hover:text-gray-500 transition-colors">
            Ver ejemplo
          </button>
        </p>
      </div>
    </div>
  )
}

// ─── Checkout ───────────────────────────────────────────────────────────────────

function CheckoutStep({ plan, onBack, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const canConfirm = name.trim() && email.trim()

  const handleConfirm = () => {
    if (!canConfirm) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess({ name, email })
    }, 1600)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Banner con el color del plan */}
        <div
          className="relative px-6 pt-6 pb-11"
          style={{ background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}99 100%)` }}
        >
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Logo placeholder, superpuesto al banner */}
        <div className="flex justify-center -mt-9">
          <div className="w-[72px] h-[72px] rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
        </div>

        <p className="font-semibold text-gray-900 text-center mt-3">Confirmar suscripción</p>

        <div className="px-6 pt-5 pb-6 space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="font-semibold text-gray-900">{plan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Facturación</span>
              <span className="font-semibold text-gray-900">Cada {periodLabel(plan.billing_period_days)}</span>
            </div>
            {plan.trial_days > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Prueba gratis</span>
                <span className="font-semibold text-gray-900">{plan.trial_days} días</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Suscripción</span>
              <span className="text-xl font-black" style={{ color: plan.color }}>
                {formatMoney(plan.price)}
                <span className="text-xs font-medium text-gray-400">/{periodLabel(plan.billing_period_days)}</span>
              </span>
            </div>
            {plan.trial_days > 0 && (
              <p className="text-xs text-gray-400 text-right">Hoy pagás $0 · empieza a cobrarse después de la prueba</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Método de pago</p>
            <div
              className="rounded-2xl border-2 p-3.5 flex items-center gap-3"
              style={{ borderColor: `${plan.color}50`, backgroundColor: `${plan.color}06` }}
            >
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Visa •••• 4242</p>
                <p className="text-xs text-gray-400">Vence 08/27</p>
              </div>
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Al confirmar, autorizás el cobro de <strong>{formatMoney(plan.price)}</strong>{' '}
            {plan.trial_days > 0 ? `luego de tu prueba gratis` : 'hoy'} y cada {periodLabel(plan.billing_period_days)}{' '}
            hasta cancelar.
          </p>

          <Button
            className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: plan.color }}
            disabled={loading || !canConfirm}
            onClick={handleConfirm}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              />
            ) : (
              'Confirmar suscripción'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Éxito ──────────────────────────────────────────────────────────────────────

function SuccessStep({ plan, onContinue }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: plan.color }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <div>
          <p className="text-2xl font-black text-gray-900">¡Bienvenido a {plan.name}!</p>
          <p className="text-sm text-gray-500 mt-1">Tu suscripción está activa.</p>
        </div>
        {plan.welcome_reward && (
          <div
            className="rounded-2xl p-4 flex items-center gap-3 text-left"
            style={{ backgroundColor: `${plan.color}10` }}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: plan.color }} />
            <p className="text-sm text-gray-700">
              Tu regalo de bienvenida: <strong>{plan.welcome_reward}</strong>
            </p>
          </div>
        )}
        <Button
          className="w-full h-11 rounded-xl font-semibold text-white"
          style={{ backgroundColor: plan.color }}
          onClick={onContinue}
        >
          Ver mi tarjeta de membresía
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Tarjeta digital ────────────────────────────────────────────────────────────

function CardStep({ plan, settings, member, renewalDate, onManage }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${plan.color} 0%, #000 100%)` }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              <span className="text-sm font-bold">{settings.business_name}</span>
            </div>
            <Wallet className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Miembro</p>
          <p className="text-xl font-bold mb-6">{member.name}</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs opacity-60">Plan</p>
              <p className="font-semibold">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-60">Válido hasta</p>
              <p className="font-semibold">{format(renewalDate, 'dd MMM yyyy')}</p>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-xs text-gray-400">
          Guardá esta tarjeta o accedé desde tu wallet cuando quieras.
        </p>
        <button
          onClick={onManage}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" /> Gestionar membresía
        </button>
      </div>
    </div>
  )
}

// ─── Gestionar membresía (pausar / cancelar) ───────────────────────────────────

function ManageStep({ plan, member, renewalDate, onBack, onPause, onCancel }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <p className="font-semibold text-gray-900">Gestionar membresía</p>
        </div>
        <div className="px-6 py-6 space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Miembro</span>
              <span className="font-semibold text-gray-900">{member.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="font-semibold text-gray-900">{plan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Próxima renovación</span>
              <span className="font-semibold text-gray-900">{format(renewalDate, 'dd MMM yyyy')}</span>
            </div>
          </div>

          {plan.allow_pause && (
            <button
              onClick={onPause}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Pause className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Pausar membresía</p>
                <p className="text-xs text-gray-400">No se te cobra hasta que la reactives</p>
              </div>
            </button>
          )}

          <button
            onClick={onCancel}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <Ban className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Cancelar membresía</p>
              <p className="text-xs text-gray-400">
                {plan.cancellation_policy === 'anytime'
                  ? 'Se cancela de inmediato'
                  : 'Seguís teniendo acceso hasta el fin del período actual'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Pausar membresía ───────────────────────────────────────────────────────────

function PauseConfirmStep({ plan, onBack, onConfirm }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
          <Pause className="w-7 h-7 text-amber-600" />
        </div>
        <div>
          <p className="text-xl font-black text-gray-900">¿Pausar tu membresía {plan.name}?</p>
          <p className="text-sm text-gray-500 mt-1">
            No se te va a cobrar mientras esté pausada. Podés reactivarla cuando quieras y seguir donde la dejaste.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Volver
          </Button>
          <Button className="flex-1 text-white" style={{ backgroundColor: plan.color }} onClick={onConfirm}>
            Pausar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function PausedStep({ plan, onReactivate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center space-y-4"
      >
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
          <Pause className="w-9 h-9 text-amber-600" />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">Membresía pausada</p>
          <p className="text-sm text-gray-500 mt-1">
            Tu plan {plan.name} está en pausa. Reactivala cuando quieras volver.
          </p>
        </div>
        <Button
          className="w-full h-11 rounded-xl font-semibold text-white"
          style={{ backgroundColor: plan.color }}
          onClick={onReactivate}
        >
          Reactivar membresía
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Cancelar membresía ─────────────────────────────────────────────────────────

const CANCEL_REASONS = ['Precio muy alto', 'Se mudó de ciudad', 'No usaba el beneficio', 'Otro motivo']

function CancelConfirmStep({ plan, onBack, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 space-y-5"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Ban className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">¿Cancelar tu membresía {plan.name}?</p>
            <p className="text-sm text-gray-500 mt-1">
              {plan.cancellation_policy === 'anytime'
                ? 'Perdés el acceso a los beneficios de inmediato.'
                : 'Seguís teniendo acceso a tus beneficios hasta el fin del período actual.'}
            </p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">¿Por qué cancelás? (opcional)</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Elegí un motivo" />
            </SelectTrigger>
            <SelectContent>
              {CANCEL_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Volver
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => onConfirm(reason)}>
            Cancelar membresía
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function CancelledStep({ plan, onRejoin }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center space-y-4"
      >
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <Ban className="w-9 h-9 text-gray-400" />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">Membresía cancelada</p>
          <p className="text-sm text-gray-500 mt-1">
            {plan.cancellation_policy === 'anytime'
              ? 'Ya no tenés acceso a los beneficios del plan.'
              : 'Tenés acceso hasta el fin del período que ya pagaste.'}
          </p>
        </div>
        <Button
          className="w-full h-11 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: plan.color }}
          onClick={onRejoin}
        >
          <RotateCcw className="w-4 h-4" /> Volver a unirme
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Membresía vencida ──────────────────────────────────────────────────────────

function ExpiredStep({ settings, onRenew }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center space-y-4"
      >
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
          <Clock3 className="w-9 h-9 text-orange-500" />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">Tu membresía venció</p>
          <p className="text-sm text-gray-500 mt-1">
            Ya no tenés acceso a los beneficios de {settings.business_name}. Renovala para volver a disfrutarlos.
          </p>
        </div>
        <Button
          className="w-full h-11 rounded-xl font-semibold text-white"
          style={{ backgroundColor: settings.color }}
          onClick={onRenew}
        >
          Renovar ahora
        </Button>
      </motion.div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PublicMembershipPlansDemo() {
  const [data] = useState(loadMembershipData)
  const { settings, plans } = data
  const activePlans = plans.filter((p) => p.active)

  // Un link "Compartir" en un plan (?plan=<id>) salta directo a su checkout.
  const [searchParams] = useSearchParams()
  const sharedPlan = plans.find((p) => p.id === searchParams.get('plan'))

  const [step, setStep] = useState(sharedPlan ? 'checkout' : 'landing')
  const [selectedPlan, setSelectedPlan] = useState(sharedPlan ?? null)
  const [member, setMember] = useState(null)
  const [renewalDate, setRenewalDate] = useState(null)

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    setStep('checkout')
  }

  const handleCheckoutSuccess = (memberInfo) => {
    setMember(memberInfo)
    setRenewalDate(addDaysUTC(new Date(), selectedPlan.billing_period_days || 30))
    setStep('success')
  }

  const handleRejoin = () => {
    setSelectedPlan(null)
    setMember(null)
    setStep('landing')
  }

  const handleViewExpiredExample = () => {
    setSelectedPlan(activePlans[0] ?? plans[0])
    setStep('expired')
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'landing' && (
        <motion.div key="landing" exit={{ opacity: 0 }}>
          <LandingStep
            settings={settings}
            plans={activePlans}
            onSelectPlan={handleSelectPlan}
            onViewExpiredExample={handleViewExpiredExample}
          />
        </motion.div>
      )}
      {step === 'checkout' && selectedPlan && (
        <motion.div key="checkout" exit={{ opacity: 0 }}>
          <CheckoutStep plan={selectedPlan} onBack={() => setStep('landing')} onSuccess={handleCheckoutSuccess} />
        </motion.div>
      )}
      {step === 'success' && selectedPlan && (
        <motion.div key="success" exit={{ opacity: 0 }}>
          <SuccessStep plan={selectedPlan} onContinue={() => setStep('card')} />
        </motion.div>
      )}
      {step === 'card' && selectedPlan && member && (
        <motion.div key="card" exit={{ opacity: 0 }}>
          <CardStep
            plan={selectedPlan}
            settings={settings}
            member={member}
            renewalDate={renewalDate}
            onManage={() => setStep('manage')}
          />
        </motion.div>
      )}
      {step === 'manage' && selectedPlan && member && (
        <motion.div key="manage" exit={{ opacity: 0 }}>
          <ManageStep
            plan={selectedPlan}
            member={member}
            renewalDate={renewalDate}
            onBack={() => setStep('card')}
            onPause={() => setStep('pause_confirm')}
            onCancel={() => setStep('cancel_confirm')}
          />
        </motion.div>
      )}
      {step === 'pause_confirm' && selectedPlan && (
        <motion.div key="pause_confirm" exit={{ opacity: 0 }}>
          <PauseConfirmStep plan={selectedPlan} onBack={() => setStep('manage')} onConfirm={() => setStep('paused')} />
        </motion.div>
      )}
      {step === 'paused' && selectedPlan && (
        <motion.div key="paused" exit={{ opacity: 0 }}>
          <PausedStep plan={selectedPlan} onReactivate={() => setStep('card')} />
        </motion.div>
      )}
      {step === 'cancel_confirm' && selectedPlan && (
        <motion.div key="cancel_confirm" exit={{ opacity: 0 }}>
          <CancelConfirmStep
            plan={selectedPlan}
            onBack={() => setStep('manage')}
            onConfirm={() => setStep('cancelled')}
          />
        </motion.div>
      )}
      {step === 'cancelled' && selectedPlan && (
        <motion.div key="cancelled" exit={{ opacity: 0 }}>
          <CancelledStep plan={selectedPlan} onRejoin={handleRejoin} />
        </motion.div>
      )}
      {step === 'expired' && selectedPlan && (
        <motion.div key="expired" exit={{ opacity: 0 }}>
          <ExpiredStep settings={settings} onRenew={handleRejoin} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
