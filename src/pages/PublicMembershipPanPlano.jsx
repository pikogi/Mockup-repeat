import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Tag,
  Megaphone,
  Calendar,
  Check,
  Share2,
  Crown,
  Lock,
  Package,
  CheckCircle2,
  Zap,
  Clock,
  Users,
  Gift,
  Mail,
  Info,
  CreditCard,
  Send,
  Pizza,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Data ──────────────────────────────────────────────────────────────────────

const COLOR = '#1a1a1a'

const PROGRAM = {
  name: 'Club Pan Plano',
  logo_url: '/pan-plano-logo.jpg',
  brand: 'Pan Plano',
}

const TIERS = [
  { id: 'tier-regular', name: 'Regular', color: '#6b7280', sub_price: null },
  { id: 'tier-maestro', name: 'Maestro', color: '#444444', sub_price: 1200, sub_period: 'monthly' },
]

const BENEFITS = [
  {
    id: 2001,
    name: 'Pizza gratis en tu cumpleaños',
    description: 'Una pizza individual de tu elección sin costo el día de tu cumple. Válido en cualquier sucursal.',
    use_type: 'onetime',
    tier_required: 'all',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2002,
    name: '2x1 los martes en pizzas individuales',
    description: 'Pedís una y te llevás dos. Válido en toda la carta de pizzas individuales.',
    use_type: 'monthly',
    tier_required: 'all',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2003,
    name: '15% de descuento en toda la carta',
    description: 'Descuento automático en cada visita. Sin mínimo de consumo.',
    use_type: 'unlimited',
    tier_required: 'all',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2004,
    name: 'Reserva prioritaria sin espera',
    description: 'Reservá tu mesa con prioridad en cualquier sucursal. Sin espera garantizada.',
    use_type: 'unlimited',
    tier_required: 'tier-maestro',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2005,
    name: 'Postre gratis en cada visita',
    description: 'Elegí un postre de la carta sin costo adicional en cada visita. Válido una vez por día.',
    use_type: 'monthly',
    tier_required: 'tier-maestro',
    image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2006,
    name: 'Bebida gratis en tu próxima visita',
    description: 'Una bebida de la carta sin cargo. Acumulable, no vence en el mes.',
    use_type: 'onetime',
    tier_required: 'tier-maestro',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&q=80',
  },
]

const POSTS = [
  {
    id: 1,
    type: 'novedad',
    title: 'Nueva pizza: burrata e higos de temporada',
    body: 'Masa fermentada 48 hs, burrata importada y reducción de balsámico. Solo por julio.',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop&q=80',
    date: '10 jul',
  },
  {
    id: 2,
    type: 'promo',
    title: 'Martes de 2x1 — toda la semana',
    body: 'Aprovechá tu beneficio de socio. Válido en toda la carta de pizzas individuales.',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop&q=80',
    date: '7 jul',
  },
  {
    id: 3,
    type: 'evento',
    title: 'Noche de maridaje — pizza + vino',
    body: 'Junto al sommelier de Vino La Rioja, exploramos 4 combinaciones perfectas. Cupos limitados.',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop&q=80',
    date: '28 jun',
  },
  {
    id: 4,
    type: 'novedad',
    title: 'Nueva carta de verano 2026',
    body: 'Ingredientes frescos de estación, masa madre y nuevas combinaciones. Descubrila en sucursal.',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&q=80',
    date: '20 jun',
  },
  {
    id: 5,
    type: 'promo',
    title: 'Socios Maestro: cena para dos con vino incluido',
    body: 'Solo este mes, los socios Maestro pueden reservar una cena para dos con una botella de vino de cortesía. Cupos limitados.',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80',
    date: '15 jun',
  },
]

const ACTIVITY = [
  { id: 1, type: 'visit', label: 'Visita — Pizza burrata + vino', date: '12 jul 2026' },
  { id: 2, type: 'redeemed', label: '2x1 en pizzas individuales', date: '8 jul 2026' },
  { id: 3, type: 'visit', label: 'Visita — Pizza napolitana + birra', date: '1 jul 2026' },
  { id: 4, type: 'visit', label: 'Visita — Tabla de entrantes', date: '24 jun 2026' },
  { id: 5, type: 'redeemed', label: 'Pizza gratis — cumpleaños', date: '15 jun 2026' },
]

const GIFT_OPTIONS = [
  { id: 1, label: '$3.000', desc: 'Gift card · una pizza + bebida para una persona', price: '$3.000' },
  { id: 2, label: '$6.000', desc: 'Gift card · pizza para dos con postre incluido', price: '$6.000' },
  { id: 3, label: '$12.000', desc: 'Gift card · cena completa para dos con vino', price: '$12.000' },
  { id: 4, label: 'Noche de pizza', desc: 'Gift card especial · cena para 4 con tabla y pizzas', price: '$20.000' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isAccessible(benefit, tierId) {
  if (benefit.tier_required === 'all') return true
  const current = TIERS.find((t) => t.id === tierId)
  const required = TIERS.find((t) => t.id === benefit.tier_required)
  if (!current || !required) return false
  return TIERS.indexOf(current) >= TIERS.indexOf(required)
}

const BADGE_STYLES = {
  promo: { label: 'Promo', bg: 'bg-rose-500', icon: Tag },
  novedad: { label: 'Novedad', bg: 'bg-red-700', icon: Megaphone },
  evento: { label: 'Evento', bg: 'bg-amber-500', icon: Calendar },
}

const USE_TYPE_META = {
  unlimited: { label: '∞ Ilimitado', color: 'text-emerald-600 bg-emerald-50' },
  monthly: { label: '↻ 1x por mes', color: 'text-blue-600 bg-blue-50' },
  onetime: { label: '⚡ 1 solo uso', color: 'text-amber-600 bg-amber-50' },
}

// ─── Subscribe Drawer ─────────────────────────────────────────────────────────

function SubscribeDrawer({ onClose, onSuccess }) {
  const [step, setStep] = useState('plan')
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 1600)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={step !== 'success' ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'plan' && (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className="relative px-5 pt-5 pb-6"
                style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #333333 100%)` }}
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,200,100,0.2)' }}
                  >
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base leading-tight">Club Pan Plano Maestro</p>
                    <p className="text-white/50 text-xs mt-0.5">Desbloqueá todos los beneficios</p>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">$1.200</span>
                  <span className="text-white/60 text-sm mb-1">/mes</span>
                </div>
                <p className="text-white/40 text-xs mt-1">Cancelás cuando quieras. Sin permanencia.</p>
              </div>
              <div className="px-5 py-5 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Incluye</p>
                {[
                  '15% de descuento en toda la carta',
                  'Reserva prioritaria sin espera',
                  'Pizza gratis en tu cumpleaños',
                  '2x1 los martes en pizzas individuales',
                  'Beneficios en comercios adheridos',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${COLOR}15` }}
                    >
                      <Check className="w-3 h-3" style={{ color: COLOR }} />
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <Button
                  className="w-full h-12 rounded-2xl font-bold text-white"
                  style={{ backgroundColor: COLOR }}
                  onClick={() => setStep('pay')}
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'pay' && (
            <motion.div
              key="pay"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
                <button
                  onClick={() => setStep('plan')}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <p className="font-semibold text-gray-900">Confirmar suscripción</p>
              </div>
              <div className="px-5 py-5 space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-semibold text-gray-900">Club Pan Plano Maestro</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Facturación</span>
                    <span className="font-semibold text-gray-900">Mensual</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-sm font-semibold text-gray-700">Total hoy</span>
                    <span className="text-sm font-black text-gray-900">$1.200</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Método de pago</p>
                  <div
                    className="rounded-2xl border-2 p-3.5 flex items-center gap-3"
                    style={{ borderColor: `${COLOR}50`, backgroundColor: `${COLOR}06` }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Visa •••• 4242</p>
                      <p className="text-xs text-gray-400">Vence 08/27</p>
                    </div>
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: COLOR }} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Al confirmar, autorizás el cobro de <strong>$1.200</strong> hoy y cada mes hasta cancelar.
                </p>
                <Button
                  className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: COLOR }}
                  disabled={loading}
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
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #333333 100%)` }}
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <p className="text-2xl font-black text-gray-900">¡Ya sos Maestro!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tu suscripción está activa. Todos tus beneficios están desbloqueados.
                </p>
              </div>
              <Button
                className="w-full h-11 rounded-xl font-semibold text-white"
                style={{ backgroundColor: COLOR }}
                onClick={() => {
                  onSuccess()
                  onClose()
                }}
              >
                Ver mis beneficios
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Gift card modal ──────────────────────────────────────────────────────────

function GiftCardModal({ card, onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const handleSend = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className="p-6 pb-4 relative"
                style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #333333 100%)` }}
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <CreditCard className="w-8 h-8 text-white/80 mb-3" />
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Regalo · {card.label}</p>
                <p className="text-white text-3xl font-black mt-1">{card.price}</p>
                <p className="text-white/70 text-sm mt-1">{card.desc}</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">¿A quién se la regalás?</p>
                  <p className="text-xs text-gray-400 mt-0.5">Le enviamos la gift card por email.</p>
                </div>
                <form onSubmit={handleSend} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@ejemplo.com"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!email.trim()}
                    className="w-full h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                    style={{ backgroundColor: COLOR }}
                  >
                    <Send className="w-4 h-4" />
                    Continuar al pago · {card.price}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center space-y-3"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${COLOR}20` }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: COLOR }} />
              </div>
              <p className="text-lg font-bold text-gray-900">¡Gift card enviada!</p>
              <p className="text-sm text-gray-500">
                Enviamos la gift card a <strong>{email}</strong>.
              </p>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl text-white text-sm font-bold mt-2"
                style={{ backgroundColor: COLOR }}
              >
                Listo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function GiftCardSection() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const scrollRef = useRef(null)
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 268, behavior: 'smooth' })

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Regalá Pan Plano</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="gift-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2.5">
                <div className="hidden sm:flex items-center justify-end gap-1 mb-1">
                  {[-1, 1].map((dir) => (
                    <button
                      key={dir}
                      onClick={() => scroll(dir)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm"
                    >
                      {dir < 0 ? (
                        <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </button>
                  ))}
                </div>
                <div
                  ref={scrollRef}
                  className="sm:flex sm:gap-3 sm:overflow-x-auto sm:pb-2 sm:space-y-0 space-y-2.5"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {GIFT_OPTIONS.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelected(card)}
                      className="sm:flex-shrink-0 sm:w-64 w-full rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left p-4 space-y-1"
                    >
                      <p className="text-2xl font-black" style={{ color: COLOR }}>
                        {card.price}
                      </p>
                      <p className="text-xs font-semibold text-gray-700">{card.label}</p>
                      <p className="text-xs text-gray-400 leading-snug">{card.desc}</p>
                      <div className="pt-1">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                          style={{ backgroundColor: COLOR }}
                        >
                          Regalar →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {selected && <GiftCardModal card={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}

// ─── Posts carousel ───────────────────────────────────────────────────────────

function PostsCarousel() {
  const handleRef = useRef(null)
  const isPaused = useRef(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const looped = [...POSTS, ...POSTS]

  const pauseTimer = useRef(null)
  const scroll = (dir) => {
    handleRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })
    isPaused.current = true
    clearTimeout(pauseTimer.current)
    pauseTimer.current = setTimeout(() => {
      isPaused.current = false
    }, 2000)
  }

  useEffect(() => {
    const el = handleRef.current
    if (!el) return
    const iv = setInterval(() => {
      if (!isPaused.current) el.scrollBy({ left: 1, behavior: 'smooth' })
    }, 30)
    return () => clearInterval(iv)
  }, [])

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: COLOR }} />
            <h2 className="text-sm font-semibold text-gray-700 sm:text-2xl sm:font-black sm:text-gray-900 leading-none">
              Novedades
            </h2>
          </div>
          <div className="flex gap-1">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm"
              >
                {dir < 0 ? (
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={handleRef}
          onMouseEnter={() => {
            isPaused.current = true
          }}
          onMouseLeave={() => {
            isPaused.current = false
          }}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {looped.map((post, i) => {
            const badge = BADGE_STYLES[post.type]
            const BadgeIcon = badge.icon
            return (
              <button
                key={i}
                onClick={() => setSelectedPost(post)}
                className="flex-shrink-0 w-44 sm:w-60 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all text-left"
              >
                <div className="relative h-28 sm:h-36 overflow-hidden">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span
                    className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${badge.bg}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                  </span>
                  <span className="absolute bottom-2 right-2 text-white/80 text-xs">{post.date}</span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.body}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-52 overflow-hidden">
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                {(() => {
                  const badge = BADGE_STYLES[selectedPost.type]
                  const BadgeIcon = badge.icon
                  return (
                    <span
                      className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  )
                })()}
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedPost.title}</h2>
                  <span className="text-xs text-gray-400 flex-shrink-0 mt-1">{selectedPost.date}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedPost.body}</p>
                <Button
                  className="w-full h-11 rounded-xl font-semibold text-white mt-2"
                  style={{ backgroundColor: COLOR }}
                  onClick={() => setSelectedPost(null)}
                >
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Benefit card ─────────────────────────────────────────────────────────────

function BenefitCard({ benefit, accessible, redeemedMonthly, redeemedOnetime, onSelect }) {
  const meta = USE_TYPE_META[benefit.use_type]
  const usedMonthly = benefit.use_type === 'monthly' && redeemedMonthly.has(benefit.id)
  const usedOnetime = benefit.use_type === 'onetime' && redeemedOnetime.has(benefit.id)
  const isUsed = usedMonthly || usedOnetime
  const isLocked = !accessible

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={!isLocked && !isUsed ? { scale: 0.98 } : {}}
      onClick={() => !isLocked && onSelect(benefit)}
      disabled={isLocked || isUsed}
      className={`w-full h-full text-left bg-white rounded-2xl border transition-all overflow-hidden ${isLocked ? 'opacity-55 cursor-not-allowed border-gray-200' : isUsed ? 'border-gray-200 cursor-default' : 'border-gray-200 hover:border-gray-400 hover:shadow-md cursor-pointer'}`}
    >
      <div
        className="relative w-full overflow-hidden flex"
        style={{ aspectRatio: '16/9', backgroundColor: `${COLOR}08` }}
      >
        {benefit.image_url ? (
          <img src={benefit.image_url} alt={benefit.name} className="w-full h-full object-cover block" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-1.5 shadow">
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        )}
        {isUsed && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="bg-white rounded-full px-2.5 py-1 shadow flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-gray-700">{usedMonthly ? 'Usado este mes' : 'Canjeado'}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{benefit.name}</p>
        <div className="flex flex-col items-start gap-1">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}
          >
            {meta.label}
          </span>
          {isLocked && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
              <Lock className="w-2.5 h-2.5" />
              {TIERS.find((t) => t.id === benefit.tier_required)?.name}
            </span>
          )}
        </div>
        {!isLocked && !isUsed && (
          <div
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-white text-xs font-bold"
            style={{ backgroundColor: COLOR }}
          >
            <span>Generar cupón</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
        {isUsed && (
          <div className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            <p className="text-xs text-emerald-700 font-medium">{usedMonthly ? 'Usado este mes' : 'Canjeado'}</p>
          </div>
        )}
      </div>
    </motion.button>
  )
}

// ─── Benefit modal ────────────────────────────────────────────────────────────

function BenefitModal({ benefit, onClose, onSuccess }) {
  const [step, setStep] = useState('detail')
  const [code] = useState(() => 'PP-' + Math.random().toString(36).slice(2, 6).toUpperCase())
  const meta = USE_TYPE_META[benefit.use_type]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={step === 'detail' ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'detail' && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: `${COLOR}08` }}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                {benefit.image_url ? (
                  <img
                    src={benefit.image_url}
                    alt={benefit.name}
                    className="h-28 w-28 object-cover rounded-2xl shadow-lg"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: COLOR }}
                  >
                    <Package className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{benefit.name}</h2>
                  {benefit.description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{benefit.description}</p>
                  )}
                </div>
                <div
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ backgroundColor: `${COLOR}08` }}
                >
                  <span className="font-semibold text-gray-800">Tipo de beneficio</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                </div>
                {benefit.use_type === 'monthly' && (
                  <div className="flex items-center gap-3 text-sm text-blue-600">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Disponible una vez por mes. Se resetea el 1° de cada mes.</span>
                  </div>
                )}
                {benefit.use_type === 'onetime' && (
                  <div className="flex items-center gap-3 text-sm text-amber-600">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Beneficio de un solo uso. Una vez canjeado no puede regenerarse.</span>
                  </div>
                )}
                <Button
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: COLOR }}
                  onClick={() => setStep('confirm')}
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep('detail')}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <h2 className="text-lg font-bold text-gray-900">Confirmar canje</h2>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
                  {benefit.image_url ? (
                    <img
                      src={benefit.image_url}
                      alt={benefit.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${COLOR}12` }}
                    >
                      <Package className="w-7 h-7" style={{ color: COLOR }} />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{benefit.name}</p>
                    {benefit.description && <p className="text-xs text-gray-500 mt-0.5">{benefit.description}</p>}
                  </div>
                </div>
                {benefit.use_type === 'onetime' && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs text-amber-800 font-medium">
                      ⚠️ Este beneficio es de un solo uso. Después no podrás volver a canjearlo.
                    </p>
                  </div>
                )}
                <Button
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: COLOR }}
                  onClick={() => {
                    setStep('success')
                    onSuccess(benefit)
                  }}
                >
                  Generar cupón
                </Button>
              </div>
            </motion.div>
          )}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 space-y-5 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${COLOR}15` }}
              >
                <CheckCircle2 className="w-9 h-9" style={{ color: COLOR }} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">¡Cupón generado!</h2>
                <p className="text-sm text-gray-500 mt-1">Mostrá este código en caja para usar tu beneficio.</p>
              </div>
              <div
                className="rounded-2xl p-5 space-y-1"
                style={{ backgroundColor: `${COLOR}08`, border: `2px dashed ${COLOR}30` }}
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Código de canje</p>
                <p className="text-3xl font-black tracking-widest" style={{ color: COLOR }}>
                  {code}
                </p>
                <p className="text-xs text-gray-400">{benefit.name}</p>
              </div>
              <Button
                className="w-full h-11 rounded-xl font-semibold text-white"
                style={{ backgroundColor: COLOR }}
                onClick={onClose}
              >
                Listo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function PublicMembershipPanPlano() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [tierId, setTierId] = useState('tier-regular')
  const [redeemedMonthly, setRedeemedMonthly] = useState(new Set())
  const [redeemedOnetime, setRedeemedOnetime] = useState(new Set())
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [activityOpen, setActivityOpen] = useState(false)
  const [activityExpanded, setActivityExpanded] = useState(false)
  const [shareDone, setShareDone] = useState(false)
  const [showEmailLookup, setShowEmailLookup] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [howOpen, setHowOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  const currentTier = TIERS.find((t) => t.id === tierId) || TIERS[0]
  const isMaestro = tierId === 'tier-maestro'
  const accessible = BENEFITS.filter((b) => loggedIn && isAccessible(b, tierId))

  const handleShare = async () => {
    const url = `${window.location.origin}/membership/pan-plano-demo`
    try {
      if (navigator.share) await navigator.share({ title: PROGRAM.name, url })
      else await navigator.clipboard.writeText(url)
      setShareDone(true)
      setTimeout(() => setShareDone(false), 2500)
    } catch {
      /* cancelled */
    }
  }

  const handleEmailLookup = (e) => {
    e.preventDefault()
    setLoggedIn(true)
    setShowEmailLookup(false)
    setEmailInput('')
  }

  const handleRedeemSuccess = (benefit) => {
    if (benefit.use_type === 'monthly') setRedeemedMonthly((prev) => new Set([...prev, benefit.id]))
    if (benefit.use_type === 'onetime') setRedeemedOnetime((prev) => new Set([...prev, benefit.id]))
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: 'radial-gradient(circle, #00000012 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b shadow-sm" style={{ background: COLOR, borderColor: '#333333' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <img
            src={PROGRAM.logo_url}
            alt={PROGRAM.brand}
            className="w-10 h-10 rounded-xl object-contain bg-white p-1"
          />
          <div>
            <h1 className="font-bold leading-tight text-white">{PROGRAM.name}</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {PROGRAM.brand}
            </p>
          </div>
        </div>
        {/* Ticker */}
        <div
          className="overflow-hidden py-1.5"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-white text-xs font-medium px-8">
                🍕 Pizza italiana auténtica ·🫙 Masa fermentada 48 hs · 🧀 Burrata importada · 🍷 Maridaje de vinos · 🎉
                Eventos privados · ✨ Nueva carta de verano
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </div>

      {/* Novedades carousel */}
      <div className="max-w-5xl mx-auto px-4 pt-5">
        <PostsCarousel />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Member card */}
        {loggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 space-y-3 sm:max-w-xl"
            style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #333333 100%)` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: currentTier.color }}
              >
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-white">
                <p className="text-xs opacity-80 uppercase tracking-wider mb-1">Nivel {currentTier.name}</p>
                <p className="text-2xl font-black leading-none">
                  Martín <span className="text-base font-semibold opacity-70">González</span>
                </p>
              </div>
            </div>

            {!isMaestro ? (
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-0 rounded-full bg-yellow-400/60" />
                </div>
                <div className="flex items-center justify-between text-white text-xs opacity-70">
                  <span>
                    Desbloqueá <span className="font-bold opacity-100 text-yellow-300">todos los beneficios</span>{' '}
                    siendo Maestro
                  </span>
                  <button
                    onClick={() => setSubscribeOpen(true)}
                    className="flex items-center gap-0.5 text-yellow-400 font-bold opacity-100 underline underline-offset-2 active:opacity-70 transition-opacity"
                    style={{ fontSize: 12 }}
                  >
                    <Zap className="w-3 h-3" />
                    Suscribirme
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-white text-xs font-medium">Maestro activo · Se renueva el 17 ago</span>
              </div>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-left active:scale-[0.98]"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(251,191,36,0.2)' }}
              >
                <Users className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold leading-tight">Invitar amigos</p>
                <p className="text-white/50 text-xs leading-tight mt-0.5">Compartí Club Pan Plano con quien quieras</p>
              </div>
              <AnimatePresence mode="wait">
                {shareDone ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  </motion.div>
                ) : (
                  <motion.div key="share" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Share2 className="w-4 h-4 text-white/30 flex-shrink-0" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Activity */}
            <div>
              <button
                onClick={() => setActivityOpen((v) => !v)}
                className="w-full flex items-center justify-between py-1 text-white/70 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Actividad</span>
                </div>
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform"
                  style={{ transform: activityOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              <AnimatePresence>
                {activityOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-xl overflow-hidden">
                      {(activityExpanded ? ACTIVITY : ACTIVITY.slice(0, 4)).map((entry) => (
                        <div key={entry.id} className="flex items-center gap-3 px-3 py-2.5 bg-white/10">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                            {entry.type === 'redeemed' ? (
                              <Gift className="w-4 h-4 text-white" />
                            ) : (
                              <Pizza className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{entry.label}</p>
                            <p className="text-xs text-white/50">{entry.date}</p>
                          </div>
                          {entry.type === 'redeemed' && (
                            <span className="text-xs font-bold flex-shrink-0 text-white/60">Cupón</span>
                          )}
                        </div>
                      ))}
                      {ACTIVITY.length > 4 && (
                        <button
                          onClick={() => setActivityExpanded((v) => !v)}
                          className="w-full py-2 text-xs text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10"
                        >
                          {activityExpanded ? 'Ver menos' : `Ver ${ACTIVITY.length - 4} más`}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 border sm:max-w-lg sm:mx-auto"
            style={{ backgroundColor: `${COLOR}08`, borderColor: `${COLOR}20` }}
          >
            <AnimatePresence mode="wait">
              {!showEmailLookup ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${COLOR}15` }}
                    >
                      <Gift className="w-5 h-5" style={{ color: COLOR }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">¿Todavía no sos parte?</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Accedé a beneficios exclusivos y comercios aliados.
                      </p>
                      <button
                        onClick={() => setShowEmailLookup(true)}
                        className="text-xs mt-1.5 font-medium underline underline-offset-2"
                        style={{ color: COLOR }}
                      >
                        ¿Ya sos socio? Ver mis beneficios →
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmailLookup(true)}
                    className="w-full sm:w-auto text-center text-sm font-bold px-4 py-2.5 rounded-xl text-white"
                    style={{ backgroundColor: COLOR }}
                  >
                    Unirme →
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="email"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: COLOR }} />
                    <p className="text-sm font-semibold text-gray-800">Ingresá tu email para ver tus beneficios</p>
                  </div>
                  <form onSubmit={handleEmailLookup} className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="flex-1 h-9 px-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-9 px-4 text-xs font-bold rounded-xl text-white whitespace-nowrap"
                      style={{ backgroundColor: COLOR }}
                    >
                      Ver →
                    </button>
                  </form>
                  <button
                    onClick={() => {
                      setShowEmailLookup(false)
                      setEmailInput('')
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ← Volver
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Cómo funciona */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setHowOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">¿Cómo funciona?</p>
            <motion.div animate={{ rotate: howOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {howOpen && (
              <motion.div
                key="how"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2.5">
                  {[
                    {
                      step: '1',
                      text: 'Registrate gratis y accedés automáticamente al nivel Regular con beneficios inmediatos.',
                    },
                    {
                      step: '2',
                      text: 'Suscribite a Maestro por $1.200/mes para desbloquear todos los beneficios y comercios adheridos.',
                    },
                    {
                      step: '3',
                      text: 'Generá un cupón por cada beneficio y presentalo en caja para usarlo en tu próxima visita.',
                    },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3 text-sm text-gray-600">
                      <span
                        className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: COLOR }}
                      >
                        {s.step}
                      </span>
                      {s.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Regalá */}
        <GiftCardSection />

        {/* Benefits grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: COLOR }} />
              <h2 className="text-2xl font-black text-gray-900 leading-none">Beneficios</h2>
            </div>
            {loggedIn && (
              <p className="text-sm text-gray-500">
                {accessible.length} de {BENEFITS.length} disponibles
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((benefit) => (
              <BenefitCard
                key={benefit.id}
                benefit={benefit}
                accessible={loggedIn && isAccessible(benefit, tierId)}
                redeemedMonthly={redeemedMonthly}
                redeemedOnetime={redeemedOnetime}
                onSelect={setSelectedBenefit}
              />
            ))}
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-gray-300">by Repeat.la</p>
        </div>
      </div>

      <AnimatePresence>
        {subscribeOpen && (
          <SubscribeDrawer
            onClose={() => setSubscribeOpen(false)}
            onSuccess={() => {
              setTierId('tier-maestro')
              setLoggedIn(true)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBenefit && (
          <BenefitModal
            benefit={selectedBenefit}
            onClose={() => setSelectedBenefit(null)}
            onSuccess={handleRedeemSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
