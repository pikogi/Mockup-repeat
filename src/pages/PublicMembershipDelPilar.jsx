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
  RefreshCw,
  Zap,
  Clock,
  Users,
  Gift,
  Mail,
  Info,
  CreditCard,
  Send,
  Sparkles,
  Zap as ZapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Data ──────────────────────────────────────────────────────────────────────

const COLOR = '#3b1f0a'

const PROGRAM = {
  name: 'Club Del Pilar',
  logo_url: '/del-pilar-logo.jpg',
  brand_color: COLOR,
}

const TIERS = [
  { id: 't1', name: 'Bronce', min_spend: 0, color: '#cd7f32' },
  { id: 't2', name: 'Plata', min_spend: 500, color: '#9ca3af' },
  { id: 't3', name: 'Oro', min_spend: 1500, color: '#f59e0b' },
]

const BENEFITS = [
  {
    id: 1,
    name: '10% off en todos los productos',
    description: 'Descuento permanente en cada visita. Aplicable en pan, facturas, café y repostería.',
    use_type: 'unlimited',
    tier_required: 't1',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Degustación de producto nuevo',
    description: 'Probá gratis el producto de la semana antes de comprarlo. Una muestra por visita.',
    use_type: 'monthly',
    tier_required: 't1',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Café del día gratis',
    description: 'Un café cortado o americano gratis por visita. Válido una vez al mes.',
    use_type: 'monthly',
    tier_required: 't2',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Medialuna de manteca de regalo',
    description: 'Una medialuna de manteca gratis con cualquier café. Socios Plata en cada visita.',
    use_type: 'unlimited',
    tier_required: 't2',
    image_url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Torta de encargo con 20% off',
    description: 'Descuento exclusivo en tortas y postres de encargo. Sin mínimo de pedido.',
    use_type: 'unlimited',
    tier_required: 't3',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Kit panadería artesanal',
    description: 'Canasta con selección de panes artesanales + voucher de medialunas. Al alcanzar Oro.',
    use_type: 'onetime',
    tier_required: 't3',
    image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Sorteo escapada gastronómica',
    description: 'Sorteo anual entre socios Oro. Cena para dos en restaurante seleccionado.',
    use_type: 'raffle',
    tier_required: 't3',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&q=80',
  },
]

const POSTS = [
  {
    id: 1,
    type: 'novedad',
    title: 'Nuevo: Croissant de almendras y miel',
    body: 'Almendras tostadas y miel artesanal sobre masa hojaldrada. Socios Plata lo prueban primero este sábado.',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop&q=80',
    date: '2 may',
  },
  {
    id: 2,
    type: 'evento',
    title: 'Taller de pan artesanal — sáb 10',
    body: 'Aprendé a hacer pan de campo con el maestro panadero. Cupos limitados. Solo socios Oro.',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop&q=80',
    date: '28 abr',
  },
  {
    id: 3,
    type: 'promo',
    title: 'Mayo: 2x1 en medialunas los martes',
    body: 'Todos los martes de mayo llevás doble porción de medialunas de manteca recién horneadas.',
    image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&h=400&fit=crop&q=80',
    date: '25 abr',
  },
  {
    id: 4,
    type: 'promo',
    title: 'Tortas de cumpleaños -15% en mayo',
    body: 'Durante todo mayo las tortas de encargo tienen 15% de descuento para socios del Club.',
    image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop&q=80',
    date: '20 abr',
  },
]

const ACTIVITY = [
  { id: 1, type: 'spent', label: 'Visita — Café con leche + 2 medialunas', amount: '+45 pts', date: '2 may 2026' },
  { id: 2, type: 'redeemed', label: 'Degustación de producto nuevo', date: '2 may 2026' },
  { id: 3, type: 'referral', label: 'Referido — Sofía Herrera', date: '25 abr 2026' },
  { id: 4, type: 'spent', label: 'Visita — Docena de facturas variadas', amount: '+88 pts', date: '18 abr 2026' },
  { id: 5, type: 'redeemed', label: '10% off en productos', date: '18 abr 2026' },
  { id: 6, type: 'spent', label: 'Visita — Pan de campo + café americano', amount: '+38 pts', date: '10 abr 2026' },
]

const MEMBER_SPEND = 750
const MEMBER_REDEEMED_MONTHLY = new Set([2])
const MEMBER_REDEEMED_ONETIME = new Set([])

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getTier(spend) {
  const sorted = [...TIERS].sort((a, b) => b.min_spend - a.min_spend)
  return sorted.find((t) => spend >= t.min_spend) || TIERS[0]
}

function getNextTier(current) {
  const sorted = [...TIERS].sort((a, b) => a.min_spend - b.min_spend)
  const idx = sorted.findIndex((t) => t.id === current.id)
  return sorted[idx + 1] || null
}

function isAccessible(benefit, tier) {
  if (!tier) return false
  const required = TIERS.find((t) => t.id === benefit.tier_required)
  return !required || tier.min_spend >= required.min_spend
}

const BADGE_STYLES = {
  promo: { label: 'Promo', bg: 'bg-rose-500', icon: Tag },
  novedad: { label: 'Novedad', bg: 'bg-violet-500', icon: Megaphone },
  evento: { label: 'Evento', bg: 'bg-amber-500', icon: Calendar },
}

const USE_TYPE_META = {
  unlimited: { label: '∞ Ilimitado', color: 'text-emerald-600 bg-emerald-50' },
  monthly: { label: '↻ 1x por mes', color: 'text-blue-600 bg-blue-50', Icon: RefreshCw },
  onetime: { label: '⚡ 1 solo uso', color: 'text-amber-600 bg-amber-50', Icon: Zap },
  raffle: { label: '🎰 Sorteo', color: 'text-red-600 bg-red-50' },
}

// ─── Buy points drawer ─────────────────────────────────────────────────────────

const BAR_MAX = 1800

function getTierForPts(pts) {
  const sorted = [...TIERS].sort((a, b) => b.min_spend - a.min_spend)
  return sorted.find((t) => pts >= t.min_spend) || TIERS[0]
}

function BuyPointsDrawer({ currentPts, onClose }) {
  const maxBuy = Math.max(50, BAR_MAX - currentPts)
  const [sliderPts, setSliderPts] = useState(Math.min(200, maxBuy))
  const [step, setStep] = useState('slider')

  const afterPts = currentPts + sliderPts
  const price = `$${(sliderPts * 5).toLocaleString()}`
  const currentTier = getTierForPts(currentPts)
  const afterTier = getTierForPts(afterPts)
  const levelUp = afterTier.id !== currentTier.id
  const afterPct = Math.min((afterPts / BAR_MAX) * 100, 100)

  const sortedTiers = [...TIERS].sort((a, b) => a.min_spend - b.min_spend)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={step === 'slider' ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'slider' && (
            <motion.div key="slider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className="relative px-5 pt-5 pb-5"
                style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #6b3a1f 100%)` }}
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(245,193,0,0.2)' }}
                  >
                    <ZapIcon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base leading-tight">Comprá puntos</p>
                    <p className="text-white/50 text-xs mt-0.5">Subí de nivel y desbloqueá más beneficios</p>
                  </div>
                </div>

                {/* Tier progress strip */}
                <div className="mt-4 space-y-2">
                  <div className="relative h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      animate={{ width: `${afterPct}%` }}
                      transition={{ duration: 0.2 }}
                      style={{ background: `linear-gradient(90deg, ${currentTier.color}, ${afterTier.color})` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    {sortedTiers.map((tier) => {
                      const reached = afterPts >= tier.min_spend
                      return (
                        <div key={tier.id} className="flex flex-col items-center gap-0.5">
                          <span
                            className="text-xs font-bold"
                            style={{ color: reached ? tier.color : 'rgba(255,255,255,0.25)' }}
                          >
                            {tier.name}
                          </span>
                          <span
                            style={{ fontSize: 9, color: reached ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
                          >
                            {tier.min_spend === 0 ? '0' : `${tier.min_spend}`} pts
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="px-5 pt-5 pb-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">¿Cuántos puntos?</p>
                    <motion.span
                      key={sliderPts}
                      initial={{ scale: 0.85, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl font-black"
                      style={{ color: COLOR }}
                    >
                      +{sliderPts}
                      <span className="text-sm font-semibold text-gray-400 ml-1">pts</span>
                    </motion.span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={maxBuy}
                    step={50}
                    value={sliderPts}
                    onChange={(e) => setSliderPts(Number(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: COLOR }}
                  />
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>50 pts</span>
                    <span>{maxBuy} pts</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {sortedTiers
                    .filter((t) => t.min_spend > 0)
                    .map((tier) => {
                      const alreadyHas = currentPts >= tier.min_spend
                      const willUnlock = !alreadyHas && afterPts >= tier.min_spend
                      const ptsNeeded = Math.max(0, tier.min_spend - afterPts)
                      return (
                        <div
                          key={tier.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all"
                          style={{
                            borderColor: willUnlock ? tier.color : alreadyHas ? `${tier.color}40` : '#f3f4f6',
                            backgroundColor: willUnlock
                              ? `${tier.color}10`
                              : alreadyHas
                                ? `${tier.color}06`
                                : '#fafafa',
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: alreadyHas || willUnlock ? `${tier.color}20` : '#f3f4f6' }}
                          >
                            {alreadyHas ? (
                              <Check className="w-3.5 h-3.5" style={{ color: tier.color }} />
                            ) : willUnlock ? (
                              <Sparkles className="w-3.5 h-3.5" style={{ color: tier.color }} />
                            ) : (
                              <Lock className="w-3 h-3 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-bold"
                              style={{ color: alreadyHas || willUnlock ? tier.color : '#9ca3af' }}
                            >
                              Nivel {tier.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {alreadyHas
                                ? 'Ya lo tenés'
                                : willUnlock
                                  ? '¡Lo desbloqueás con esta compra!'
                                  : `Faltan ${ptsNeeded} pts más`}
                            </p>
                          </div>
                          {!alreadyHas && !willUnlock && (
                            <span className="text-xs font-semibold text-gray-300 flex-shrink-0">
                              {tier.min_spend} pts
                            </span>
                          )}
                        </div>
                      )
                    })}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-gray-500">Total después de comprar</span>
                    <span className="text-sm font-bold text-gray-900">{afterPts} pts</span>
                  </div>
                  <Button
                    className="w-full h-13 rounded-2xl font-bold text-white flex items-center justify-between px-5 text-base"
                    style={{ backgroundColor: COLOR, height: 52 }}
                    onClick={() => setStep('success')}
                  >
                    <span>Comprar {sliderPts} pts</span>
                    <span className="text-white/70 font-semibold text-sm">{price}</span>
                  </Button>
                </div>
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
                style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #6b3a1f 100%)` }}
              >
                <CheckCircle2 className="w-10 h-10 text-yellow-400" />
              </motion.div>
              <div>
                <p className="text-2xl font-black text-gray-900">+{sliderPts} pts</p>
                <p className="text-sm text-gray-500 mt-1">Ya podés usar tus nuevos beneficios.</p>
              </div>
              {levelUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ backgroundColor: `${afterTier.color}15`, border: `1.5px solid ${afterTier.color}40` }}
                >
                  <Crown className="w-6 h-6 flex-shrink-0" style={{ color: afterTier.color }} />
                  <div className="text-left">
                    <p className="text-sm font-black" style={{ color: afterTier.color }}>
                      ¡Nivel {afterTier.name} desbloqueado!
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Ahora tenés acceso a nuevos beneficios.</p>
                  </div>
                </motion.div>
              )}
              <Button
                className="w-full h-12 rounded-xl font-semibold text-white"
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

// ─── Gift card options ─────────────────────────────────────────────────────────

const GIFT_CARD_OPTIONS = [
  { id: 1, label: '$2.000', desc: 'Gift card de dinero · usala en cualquier compra', price: '$2.000', type: 'money' },
  { id: 2, label: '$5.000', desc: 'Gift card de dinero · usala en cualquier compra', price: '$5.000', type: 'money' },
  { id: 3, label: '$10.000', desc: 'Gift card de dinero · usala en cualquier compra', price: '$10.000', type: 'money' },
  {
    id: 4,
    label: 'Canasta panadería',
    desc: 'Gift card especial · selección de panes artesanales a elección',
    price: '$8.500',
    type: 'product',
  },
]

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
                style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #6b3a1f 100%)` }}
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
                  <p className="text-xs text-gray-400 mt-0.5">Le enviamos el regalo por email.</p>
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
              <p className="text-lg font-bold text-gray-900">¡Membresía enviada!</p>
              <p className="text-sm text-gray-500">
                Le enviamos la membresía a <strong>{email}</strong>. Puede activarla en cualquier visita.
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
  const CARD_W = 268

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Regalá Del Pilar</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="giftcard-content"
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
                  {GIFT_CARD_OPTIONS.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelected(card)}
                      className="w-full sm:flex-shrink-0 sm:w-64 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform text-left"
                      style={{
                        background:
                          card.type === 'product'
                            ? 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
                            : `linear-gradient(135deg, ${COLOR} 0%, #6b3a1f 100%)`,
                      }}
                    >
                      <div className="flex items-center justify-between px-4 pt-4 pb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {card.type === 'product' ? (
                            <span style={{ fontSize: 22 }}>🥐</span>
                          ) : (
                            <img src={PROGRAM.logo_url} alt={PROGRAM.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                          {card.type === 'product' ? 'Especial' : 'Gift card'}
                        </span>
                      </div>
                      <div className="px-4 pb-4">
                        <p className="text-white text-2xl font-black leading-none tracking-tight">{card.label}</p>
                        <p className="text-white/50 text-xs mt-1">{card.desc}</p>
                      </div>
                      <div className="px-4 py-3 bg-black/20 flex items-center justify-between">
                        <span className="text-white text-xs font-bold">Regalar · {card.price}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 pt-1">El destinatario recibe un código para canjear en el local.</p>
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

// ─── PostsCarousel ─────────────────────────────────────────────────────────────

function PostsCarousel({ posts }) {
  const scrollRef = useRef(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const looped = [...posts, ...posts, ...posts]
  const CARD_W = 236
  const initDone = useRef(false)
  const handleRef = (el) => {
    scrollRef.current = el
    if (el && !initDone.current) {
      el.scrollLeft = posts.length * CARD_W
      initDone.current = true
    }
  }
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const total = posts.length * CARD_W
    if (el.scrollLeft >= total * 2) el.scrollLeft -= total
    if (el.scrollLeft < total * 0.05) el.scrollLeft += total
  }
  const isPaused = useRef(false)
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })
  useEffect(() => {
    const iv = setInterval(() => {
      if (!isPaused.current) scroll(1)
    }, 3000)
    return () => clearInterval(iv)
  }, [])

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full flex-shrink-0 hidden sm:block" style={{ backgroundColor: COLOR }} />
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
          onScroll={handleScroll}
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
      className={`w-full h-full text-left bg-white rounded-2xl border transition-all overflow-hidden ${
        isLocked
          ? 'opacity-55 cursor-not-allowed border-gray-300'
          : isUsed
            ? 'border-gray-300 cursor-default'
            : 'border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer'
      }`}
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

// ─── Benefit detail modal ─────────────────────────────────────────────────────

function BenefitModal({ benefit, onClose, onSuccess }) {
  const [step, setStep] = useState('detail')
  const [code] = useState(() => 'DLP-' + Math.random().toString(36).slice(2, 6).toUpperCase())
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

export default function PublicMembershipDelPilar() {
  const [loggedIn, setLoggedIn] = useState(false)

  const totalSpend = loggedIn ? MEMBER_SPEND : 0
  const currentTier = getTier(totalSpend)
  const nextTier = getNextTier(currentTier)

  const [redeemedMonthly, setRedeemedMonthly] = useState(new Set())
  const [redeemedOnetime, setRedeemedOnetime] = useState(new Set())
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [activityOpen, setActivityOpen] = useState(false)
  const [activityExpanded, setActivityExpanded] = useState(false)
  const [shareDone, setShareDone] = useState(false)
  const [showEmailLookup, setShowEmailLookup] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [howOpen, setHowOpen] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/membership/del-pilar-membership-demo`
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
    setRedeemedMonthly(new Set(MEMBER_REDEEMED_MONTHLY))
    setRedeemedOnetime(new Set(MEMBER_REDEEMED_ONETIME))
    setShowEmailLookup(false)
    setEmailInput('')
  }

  const handleRedeemSuccess = (benefit) => {
    if (benefit.use_type === 'monthly') setRedeemedMonthly((prev) => new Set([...prev, benefit.id]))
    if (benefit.use_type === 'onetime') setRedeemedOnetime((prev) => new Set([...prev, benefit.id]))
  }

  const accessible = BENEFITS.filter((b) => loggedIn && isAccessible(b, currentTier))

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
      <div className="sticky top-0 z-10 border-b shadow-sm" style={{ background: '#f5c100', borderColor: '#e0b000' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <img
            src={PROGRAM.logo_url}
            alt={PROGRAM.name}
            className="w-10 h-10 rounded-xl object-contain border border-black/10"
          />
          <div>
            <h1 className="font-bold leading-tight text-gray-900">Bienvenido a Club Del Pilar</h1>
            <p className="text-xs italic text-gray-600">panadería artesanal</p>
          </div>
        </div>
        {/* Ticker */}
        <div
          className="overflow-hidden py-1.5"
          style={{ backgroundColor: COLOR, borderTop: '1px solid rgba(0,0,0,0.1)' }}
        >
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 18s linear infinite' }}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-yellow-300 text-xs font-medium px-8">
                🥐 Medialunas de manteca · ☕ Café de especialidad · 🍞 Pan artesanal · 🎂 Tortas de encargo · 🥖
                Facturas frescas · ✨ Productos nuevos cada semana
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </div>

      {/* Novedades carousel */}
      <div className="max-w-5xl mx-auto px-4 pt-5">
        <PostsCarousel posts={POSTS} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Member card */}
        {loggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 space-y-3 sm:max-w-xl"
            style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #6b3a1f 100%)` }}
          >
            {/* Tier + spend */}
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
                  {totalSpend.toLocaleString()} <span className="text-base font-semibold opacity-70">pts</span>
                </p>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalSpend / nextTier.min_spend) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-xs opacity-70">
                  <div className="flex items-center gap-2">
                    <span>
                      Te faltan{' '}
                      <span className="font-bold opacity-100">
                        {(nextTier.min_spend - totalSpend).toLocaleString()} pts
                      </span>
                    </span>
                    <span className="opacity-40">→</span>
                    <span className="font-bold opacity-100" style={{ color: nextTier.color }}>
                      NIVEL {nextTier.name.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setBuyOpen(true)}
                    className="flex items-center gap-0.5 text-yellow-400 font-bold opacity-100 underline underline-offset-2 active:opacity-70 transition-opacity"
                    style={{ fontSize: 12 }}
                  >
                    <ZapIcon className="w-3 h-3" />
                    Comprar pts
                  </button>
                </div>
              </div>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-left active:scale-[0.98]"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(245,193,0,0.2)' }}
              >
                <Users className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold leading-tight">Invitar amigos</p>
                <p className="text-white/50 text-xs leading-tight mt-0.5">Ganás puntos por cada invitación</p>
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
            {ACTIVITY.length > 0 && (
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
                              {entry.type === 'referral' ? (
                                <Users className="w-4 h-4 text-white" />
                              ) : entry.type === 'redeemed' ? (
                                <Gift className="w-4 h-4 text-white" />
                              ) : (
                                <Crown className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">{entry.label}</p>
                              <p className="text-xs text-white/50">{entry.date}</p>
                            </div>
                            {entry.amount && (
                              <span className="text-xs font-bold flex-shrink-0 text-white">{entry.amount}</span>
                            )}
                            {entry.type === 'redeemed' && (
                              <span className="text-xs font-bold flex-shrink-0 text-white/60">Cupón</span>
                            )}
                            {entry.type === 'referral' && (
                              <span className="text-xs font-bold flex-shrink-0 text-white">🎁</span>
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
            )}
          </motion.div>
        ) : (
          /* Anonymous view */
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
                        Accedé a café gratis, descuentos y beneficios exclusivos.
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
                  <a
                    href="/publicprogram?id=del-pilar-membership-demo"
                    className="w-full sm:w-auto text-center text-sm font-bold px-4 py-2.5 rounded-xl text-gray-900"
                    style={{ backgroundColor: '#f5c100' }}
                  >
                    Unirte →
                  </a>
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
                      className="h-9 px-4 text-xs font-bold rounded-xl text-gray-900 whitespace-nowrap"
                      style={{ backgroundColor: '#f5c100' }}
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
                    { step: '1', text: 'Registrate en el club y empezás en el nivel Bronce automáticamente.' },
                    {
                      step: '2',
                      text: 'Con cada compra acumulás puntos y subís de nivel para desbloquear más beneficios.',
                    },
                    { step: '3', text: 'Generá un cupón por cada beneficio y presentalo en caja para usarlo.' },
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

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {BENEFITS.map((benefit) => (
              <BenefitCard
                key={benefit.id}
                benefit={benefit}
                accessible={loggedIn && isAccessible(benefit, currentTier)}
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
        {buyOpen && <BuyPointsDrawer currentPts={totalSpend} onClose={() => setBuyOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBenefit && (
          <BenefitModal
            benefit={selectedBenefit}
            onClose={() => setSelectedBenefit(null)}
            onSuccess={(b) => {
              handleRedeemSuccess(b)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
