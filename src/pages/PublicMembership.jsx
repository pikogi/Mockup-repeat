import { useState, useRef, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  Megaphone,
  Calendar,
  Check,
  Share2,
  Crown,
  Shield,
  Lock,
  Package,
  CheckCircle2,
  RefreshCw,
  Zap,
  TrendingUp,
  Mail,
  Gift,
  Clock,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_SPA = {
  name: 'Spa Alma Club',
  logo_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=80&h=80&fit=crop&q=80',
  brand_color: '#7c3aed',
  activation: 'tiers',
  referral_reward_type: 'benefit',
  referral_reward_benefit: 'Una manicura express gratis',
}

const TIERS_SPA = [
  { id: 't1', name: 'Bronce', min_spend: 0, color: '#cd7f32' },
  { id: 't2', name: 'Plata', min_spend: 15000, color: '#9ca3af' },
  { id: 't3', name: 'Oro', min_spend: 40000, color: '#f59e0b' },
]

const CATALOG_SPA = [
  {
    id: 1,
    name: '10% de descuento en todos los servicios',
    description: 'Aplicable en cualquier visita. Sin mínimo de compra.',
    use_type: 'unlimited',
    tier_required: 't1',
    image_url: null,
  },
  {
    id: 2,
    name: 'Manicura express gratis',
    description: 'Una manicura de 30 minutos sin costo adicional.',
    use_type: 'monthly',
    tier_required: 't1',
    image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Acceso a sala de relajación',
    description: 'Hidroterapia y sauna disponibles antes o después de tu servicio.',
    use_type: 'unlimited',
    tier_required: 't2',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Masaje de 60 min gratis',
    description: 'Un masaje completo a elección incluido cada mes.',
    use_type: 'monthly',
    tier_required: 't2',
    image_url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Kit premium de bienvenida',
    description: 'Aromaterapia + crema corporal premium. Recibido al alcanzar Oro.',
    use_type: 'onetime',
    tier_required: 't3',
    image_url: null,
  },
  {
    id: 6,
    name: 'Tratamiento facial antiedad',
    description: 'Sesión completa de 45 min con productos de última generación.',
    use_type: 'monthly',
    tier_required: 't3',
    image_url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop&q=80',
  },
]

const MEMBER_SPA = {
  total_spend: 28000,
  redeemed_monthly: new Set([2]),
  redeemed_onetime: new Set([]),
}

const MOCK_GYM = {
  name: 'FitZone Premium',
  logo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop&q=80',
  brand_color: '#0f766e',
  activation: 'tiers',
  referral_reward_type: 'days',
  referral_reward_days: 15,
}

const TIERS_GYM = [
  { id: 't1', name: 'Básico', min_spend: 0, color: '#0ea5e9' },
  { id: 't2', name: 'Elite', min_spend: 20000, color: '#f59e0b' },
]

const CATALOG_GYM = [
  {
    id: 1,
    name: 'Acceso ilimitado al gimnasio',
    description: 'Todas las máquinas y zonas disponibles 7 días a la semana.',
    use_type: 'unlimited',
    tier_required: 't1',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Shake proteico post-entreno',
    description: 'Un shake proteico gratis por visita al área de cardio.',
    use_type: 'monthly',
    tier_required: 't1',
    image_url: 'https://images.unsplash.com/photo-1550963295-019d8a8a61f7?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Sesión de personal trainer',
    description: 'Una sesión personalizada con un trainer certificado.',
    use_type: 'monthly',
    tier_required: 't2',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Análisis corporal mensual',
    description: 'Medición de masa muscular, grasa corporal y seguimiento.',
    use_type: 'monthly',
    tier_required: 't2',
    image_url: null,
  },
  {
    id: 5,
    name: 'Kit de bienvenida Elite',
    description: 'Bolso + toalla + botella. Se entrega al alcanzar nivel Elite.',
    use_type: 'onetime',
    tier_required: 't2',
    image_url: null,
  },
]

const MEMBER_GYM = {
  total_spend: 32000,
  redeemed_monthly: new Set([2]),
  redeemed_onetime: new Set([5]),
}

const MOCK_DEFAULT = {
  name: 'Club Premium',
  logo_url: null,
  brand_color: '#7c3aed',
  activation: 'free',
  referral_reward_type: 'days',
  referral_reward_days: 30,
}

const TIERS_DEFAULT = []

const CATALOG_DEFAULT = [
  {
    id: 1,
    name: '15% de descuento en toda la tienda',
    description: 'Válido en todos los productos sin excepción.',
    use_type: 'unlimited',
    tier_required: 'all',
    image_url: null,
  },
  {
    id: 2,
    name: 'Envío gratis por mes',
    description: 'Un envío sin costo en tu próxima compra online.',
    use_type: 'monthly',
    tier_required: 'all',
    image_url: null,
  },
  {
    id: 3,
    name: 'Regalo de bienvenida',
    description: 'Un regalo especial al activar tu membresía.',
    use_type: 'onetime',
    tier_required: 'all',
    image_url: null,
  },
]

const MEMBER_DEFAULT = {
  total_spend: 0,
  redeemed_monthly: new Set([]),
  redeemed_onetime: new Set([]),
}

const MOCK_ACTIVITY_SPA = [
  { id: 1, type: 'spent', label: 'Visita · masaje + aromaterapia', amount: '$8.500', date: '16 abr 2026' },
  { id: 7, type: 'referral', label: 'Referido — Valentina Ríos', date: '13 abr 2026' },
  { id: 2, type: 'redeemed', label: 'Manicura express gratis', date: '12 abr 2026' },
  { id: 3, type: 'spent', label: 'Visita · hidroterapia', amount: '$12.000', date: '5 abr 2026' },
  { id: 4, type: 'redeemed', label: '10% descuento en servicios', date: '5 abr 2026' },
  { id: 5, type: 'spent', label: 'Visita · masaje relax', amount: '$7.500', date: '28 mar 2026' },
]

const MOCK_ACTIVITY_GYM = [
  { id: 1, type: 'spent', label: 'Cuota mensual — abril', amount: '$18.000', date: '1 abr 2026' },
  { id: 7, type: 'referral', label: 'Referido — Lucas Fernández', date: '28 mar 2026' },
  { id: 2, type: 'redeemed', label: 'Shake proteico post-entreno', date: '15 mar 2026' },
  { id: 3, type: 'spent', label: 'Cuota mensual — marzo', amount: '$14.000', date: '1 mar 2026' },
  { id: 4, type: 'redeemed', label: 'Sesión personal trainer', date: '20 feb 2026' },
  { id: 5, type: 'spent', label: 'Cuota mensual — febrero', amount: '$14.000', date: '1 feb 2026' },
]

const POSTS_SPA = [
  {
    id: 1,
    type: 'promo',
    title: 'Mes de la mujer: upgrade gratis',
    body: 'Durante mayo, las socias pueden hacer upgrade a masaje de 90 min sin costo extra.',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop&q=80',
    date: '2 may',
  },
  {
    id: 2,
    type: 'novedad',
    title: 'Nuevo servicio: facial con LED',
    body: 'Terapia de luz LED para tratamiento antiedad, con descuento para socias.',
    image_url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop&q=80',
    date: '28 abr',
  },
  {
    id: 3,
    type: 'evento',
    title: 'Retiro de bienestar — sábado 18',
    body: 'Tarde completa: meditación, masajes y hidroterapia. Solo para socias activas.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop&q=80',
    date: '25 abr',
  },
]

const POSTS_GYM = [
  {
    id: 1,
    type: 'promo',
    title: 'Trae un amigo gratis en mayo',
    body: 'Todo mayo podés traer un invitado sin costo. Solo presentá tu tarjeta.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80',
    date: '1 may',
  },
  {
    id: 2,
    type: 'novedad',
    title: 'Nueva sala de funcional',
    body: 'Renovamos el área de entrenamiento funcional con equipamiento nuevo.',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80',
    date: '20 abr',
  },
  {
    id: 3,
    type: 'evento',
    title: 'Clase maestra con Coach Marcos',
    body: 'Sábado 17 a las 10hs: clase abierta de HIIT con coach invitado.',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&q=80',
    date: '14 abr',
  },
]

const BADGE_STYLES = {
  promo: { label: 'Promo', bg: 'bg-rose-500', icon: Tag },
  novedad: { label: 'Novedad', bg: 'bg-violet-500', icon: Megaphone },
  evento: { label: 'Evento', bg: 'bg-amber-500', icon: Calendar },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getTierForSpend(tiers, spend) {
  if (!tiers.length) return null
  const sorted = [...tiers].sort((a, b) => b.min_spend - a.min_spend)
  return sorted.find((t) => spend >= t.min_spend) || sorted[sorted.length - 1]
}

function getNextTier(tiers, currentTier) {
  if (!currentTier) return null
  const sorted = [...tiers].sort((a, b) => a.min_spend - b.min_spend)
  const idx = sorted.findIndex((t) => t.id === currentTier.id)
  return sorted[idx + 1] || null
}

function isBenefitAccessible(benefit, currentTier, tiers) {
  if (benefit.tier_required === 'all' || !tiers.length) return true
  if (!currentTier) return false
  const required = tiers.find((t) => t.id === benefit.tier_required)
  if (!required) return true
  return currentTier.min_spend >= required.min_spend
}

const USE_TYPE_META = {
  unlimited: { label: '∞ Ilimitado', icon: null, color: 'text-emerald-600 bg-emerald-50' },
  monthly: { label: '1x por mes', icon: RefreshCw, color: 'text-blue-600 bg-blue-50' },
  onetime: { label: '1 solo uso', icon: Zap, color: 'text-amber-600 bg-amber-50' },
}

// ─── Carrusel ──────────────────────────────────────────────────────────────────

function PostsCarousel({ posts, color }) {
  const scrollRef = useRef(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const loopedPosts = [...posts, ...posts, ...posts]
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
  useEffect(() => {
    const iv = setInterval(() => {
      if (!isPaused.current) scrollRef.current?.scrollBy({ left: CARD_W, behavior: 'smooth' })
    }, 3200)
    return () => clearInterval(iv)
  }, [])

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Novedades para socios</p>
          <div className="flex gap-1">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                onClick={() => scrollRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })}
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
          {loopedPosts.map((post, i) => {
            const badge = BADGE_STYLES[post.type]
            const BadgeIcon = badge.icon
            return (
              <button
                key={i}
                onClick={() => setSelectedPost(post)}
                className="flex-shrink-0 w-56 sm:w-72 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all text-left"
              >
                <div className="relative h-32 sm:h-44 overflow-hidden">
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
                  className="w-full h-11 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: color }}
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

// ─── Modal de canje de beneficio ───────────────────────────────────────────────

function BenefitRedeemModal({ benefit, color, onClose, onSuccess }) {
  const [step, setStep] = useState('detail') // 'detail' | 'confirm' | 'success'
  const [code] = useState(() => 'MBR-' + Math.random().toString(36).slice(2, 6).toUpperCase())
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
          {/* ── Detalle ── */}
          {step === 'detail' && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative h-36 flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
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
                    className="h-24 w-24 object-cover rounded-2xl shadow-lg"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: color }}
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
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${meta.color}`}
                  >
                    {benefit.use_type === 'unlimited' && '∞ Ilimitado'}
                    {benefit.use_type === 'monthly' && '1x por mes'}
                    {benefit.use_type === 'onetime' && '1 solo uso'}
                  </span>
                </div>
                {benefit.use_type === 'unlimited' && (
                  <p className="text-xs text-gray-500">
                    Podés generar un cupón en cada visita. Presentalo en caja para aplicar el beneficio.
                  </p>
                )}
                {benefit.use_type === 'monthly' && (
                  <p className="text-xs text-gray-500">
                    Disponible una vez por mes. Al usar el cupón quedará marcado como utilizado hasta el mes siguiente.
                  </p>
                )}
                {benefit.use_type === 'onetime' && (
                  <p className="text-xs text-gray-500">
                    Este beneficio es de un solo uso. Una vez canjeado no podrás volver a generarlo.
                  </p>
                )}
                <Button
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: color }}
                  onClick={() => setStep('confirm')}
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Confirmar ── */}
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
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Package className="w-7 h-7" style={{ color }} />
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
                      ⚠️ Este beneficio es de un solo uso. Después de generar el cupón no podrás volver a canjearlo.
                    </p>
                  </div>
                )}
                <Button
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: color }}
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

          {/* ── Éxito ── */}
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
                style={{ backgroundColor: `${color}20` }}
              >
                <CheckCircle2 className="w-9 h-9" style={{ color }} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">¡Cupón generado!</h2>
                <p className="text-sm text-gray-500 mt-1">Mostrá este código en caja para usar tu beneficio.</p>
              </div>
              <div
                className="rounded-2xl p-5 space-y-1"
                style={{ backgroundColor: `${color}10`, border: `2px dashed ${color}40` }}
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Código de canje</p>
                <p className="text-3xl font-black tracking-widest" style={{ color }}>
                  {code}
                </p>
                <p className="text-xs text-gray-400">{benefit.name}</p>
              </div>
              <Button
                className="w-full h-11 rounded-xl font-semibold text-white"
                style={{ backgroundColor: color }}
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

// ─── Tarjeta de beneficio ──────────────────────────────────────────────────────

function BenefitCard({ benefit, color, accessible, redeemedMonthly, redeemedOnetime, onRedeem, index, requiredTier }) {
  const meta = USE_TYPE_META[benefit.use_type]
  const usedMonthly = benefit.use_type === 'monthly' && redeemedMonthly.has(benefit.id)
  const usedOnetime = benefit.use_type === 'onetime' && redeemedOnetime.has(benefit.id)
  const isUsed = usedMonthly || usedOnetime

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: 'easeOut' }}
      className={`bg-white rounded-2xl border overflow-hidden transition-shadow ${
        accessible ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 opacity-60'
      }`}
    >
      {/* Imagen */}
      {benefit.image_url && (
        <div className="relative h-20 overflow-hidden">
          <img src={benefit.image_url} alt={benefit.name} className="w-full h-full object-cover" />
          {!accessible && (
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
                <span className="text-xs font-semibold text-gray-700">
                  {usedMonthly ? 'Usado este mes' : 'Canjeado'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-3 space-y-2">
        <div>
          <p className="text-xs font-semibold text-gray-900 leading-tight">{benefit.name}</p>
          {benefit.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{benefit.description}</p>}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}
          >
            {benefit.use_type === 'unlimited' && '∞ Ilimitado'}
            {benefit.use_type === 'monthly' && '↻ 1x por mes'}
            {benefit.use_type === 'onetime' && '⚡ 1 solo uso'}
          </span>
          {!accessible && requiredTier && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: requiredTier.color }}
            >
              <Lock className="w-2.5 h-2.5" />
              {requiredTier.name}
            </span>
          )}
        </div>

        {/* Acción */}
        {!accessible ? (
          <div className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Requiere nivel <strong>{requiredTier?.name}</strong>
            </p>
          </div>
        ) : isUsed ? (
          <div className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            <p className="text-xs text-emerald-700 font-medium">{usedMonthly ? 'Usado este mes' : 'Canjeado'}</p>
          </div>
        ) : (
          <Button
            className="w-full h-8 rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: color }}
            onClick={() => onRedeem(benefit)}
          >
            Generar cupón
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────

export default function PublicMembership() {
  const { programId } = useParams()
  const [searchParams] = useSearchParams()
  const isMember = !!searchParams.get('card')

  const isSpa = programId === 'spa-demo'
  const isGym = programId === 'gym-demo'

  const program = isSpa ? MOCK_SPA : isGym ? MOCK_GYM : MOCK_DEFAULT
  const tiers = isSpa ? TIERS_SPA : isGym ? TIERS_GYM : TIERS_DEFAULT
  const catalog = isSpa ? CATALOG_SPA : isGym ? CATALOG_GYM : CATALOG_DEFAULT
  const memberData = isSpa ? MEMBER_SPA : isGym ? MEMBER_GYM : MEMBER_DEFAULT
  const posts = isSpa ? POSTS_SPA : isGym ? POSTS_GYM : POSTS_SPA
  const activity = isSpa ? MOCK_ACTIVITY_SPA : isGym ? MOCK_ACTIVITY_GYM : []

  const color = program.brand_color

  const totalSpend = isMember ? memberData.total_spend : 0
  const currentTier = getTierForSpend(tiers, totalSpend)
  const nextTier = getNextTier(tiers, currentTier)

  const [redeemedMonthly, setRedeemedMonthly] = useState(isMember ? new Set(memberData.redeemed_monthly) : new Set())
  const [redeemedOnetime, setRedeemedOnetime] = useState(isMember ? new Set(memberData.redeemed_onetime) : new Set())
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [howOpen, setHowOpen] = useState(false)
  const [shareDone, setShareDone] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)
  const [activityExpanded, setActivityExpanded] = useState(false)
  const [showEmailLookup, setShowEmailLookup] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  const handleRedeemSuccess = (benefit) => {
    if (benefit.use_type === 'monthly') setRedeemedMonthly((prev) => new Set([...prev, benefit.id]))
    if (benefit.use_type === 'onetime') setRedeemedOnetime((prev) => new Set([...prev, benefit.id]))
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/membership/${programId}`
    try {
      if (navigator.share) await navigator.share({ title: program.name, url })
      else await navigator.clipboard.writeText(url)
      setShareDone(true)
      setTimeout(() => setShareDone(false), 2500)
    } catch {
      /* cancelled */
    }
  }

  const handleEmailLookup = (e) => {
    e.preventDefault()
    window.location.href = `/membership/${programId}?card=mock`
  }

  // Accesibles = los que puede usar según su tier
  const accessibleIds = new Set(catalog.filter((b) => isBenefitAccessible(b, currentTier, tiers)).map((b) => b.id))

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: 'radial-gradient(circle, #00000012 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          {program.logo_url ? (
            <img src={program.logo_url} alt={program.name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 leading-tight truncate">{program.name}</h1>
            <p className="text-xs text-gray-400">Club de socios</p>
          </div>
          {isMember && !currentTier && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <Shield className="w-3.5 h-3.5" />
              Socio activo
            </span>
          )}
        </div>

        <div className="overflow-hidden py-1.5" style={{ backgroundColor: color }}>
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-white text-xs font-medium px-8">
                {isSpa
                  ? '✨ Masajes y tratamientos exclusivos · 💅 Manicura gratis mensual · 🌟 Beneficios según tu nivel'
                  : isGym
                    ? '🏋️ Acceso ilimitado al gym · 🥤 Shake mensual incluido · 👟 Personal trainer para socios Elite'
                    : '⭐ Beneficios exclusivos para socios · 🎁 Descuentos y productos gratis'}
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-5 space-y-6 pb-10">
        {/* Hero anónimo */}
        {!isMember && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
          >
            <div
              className="px-5 pt-5 pb-4"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-white">
                  <p className="text-xs opacity-70 uppercase tracking-wider mb-1">Club de socios</p>
                  <p className="text-2xl font-black leading-tight">{program.name}</p>
                  <p className="text-sm opacity-80 mt-1">
                    {tiers.length > 0
                      ? `${tiers.length} niveles · ${catalog.length} beneficios exclusivos`
                      : `${catalog.length} beneficios para socios`}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
              {tiers.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold"
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                      {tier.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="bg-white px-5 py-4 flex flex-col gap-3 border border-t-0 rounded-b-2xl"
              style={{ borderColor: `${color}30` }}
            >
              <AnimatePresence mode="wait">
                {!showEmailLookup ? (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Accedé a todos los beneficios</p>
                      <button
                        onClick={() => setShowEmailLookup(true)}
                        className="text-xs mt-0.5 font-medium underline underline-offset-2"
                        style={{ color }}
                      >
                        ¿Ya sos socio? Ver mis beneficios →
                      </button>
                    </div>
                    <a
                      href={`/publicprogram?id=${programId}`}
                      className="text-sm font-bold px-4 py-2.5 rounded-xl text-black shrink-0"
                      style={{ backgroundColor: '#facc15' }}
                    >
                      Unirse →
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
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color }} />
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
                        className="h-9 px-4 text-xs font-bold rounded-xl text-black whitespace-nowrap"
                        style={{ backgroundColor: '#facc15' }}
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
            </div>
          </motion.div>
        )}

        {/* Carrusel */}
        <PostsCarousel posts={posts} color={color} />

        {/* Card de miembro — debajo de novedades */}
        {isMember && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
          >
            {/* Tier + spend */}
            <div className="flex items-center gap-4">
              {currentTier ? (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: currentTier.color }}
                >
                  <Crown className="w-7 h-7 text-white" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              )}
              <div className="text-white flex-1">
                <p className="text-xs opacity-70 uppercase tracking-wider">
                  {currentTier ? `Nivel ${currentTier.name}` : 'Socio activo'}
                </p>
                {tiers.length > 0 && (
                  <>
                    <p className="text-3xl font-black leading-none">${totalSpend.toLocaleString()}</p>
                    <p className="text-xs opacity-70 mt-0.5">gasto acumulado</p>
                  </>
                )}
                {!tiers.length && <p className="text-lg font-bold mt-0.5">{program.name}</p>}
              </div>
            </div>

            {/* Progreso al próximo nivel */}
            {nextTier && (
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalSpend / nextTier.min_spend) * 100, 100)}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-xs opacity-70">
                  <span>
                    Te faltan{' '}
                    <span className="font-bold opacity-100">${(nextTier.min_spend - totalSpend).toLocaleString()}</span>{' '}
                    para nivel
                  </span>
                  <span className="font-bold opacity-100" style={{ color: nextTier.color }}>
                    {nextTier.name}
                  </span>
                </div>
              </div>
            )}
            {!nextTier && tiers.length > 0 && (
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/15">
                <Crown className="w-4 h-4 text-white" />
                <p className="text-xs text-white font-semibold">¡Estás en el nivel más alto!</p>
              </div>
            )}

            {/* Invitar amigos */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold text-center"
            >
              <AnimatePresence mode="wait">
                {shareDone ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" /> Link copiado
                  </motion.span>
                ) : (
                  <motion.span
                    key="share"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" /> Invitar amigos
                    </span>
                    <span className="opacity-75 font-normal truncate max-w-[220px]">
                      Ganás{' '}
                      {program.referral_reward_type === 'benefit'
                        ? program.referral_reward_benefit || 'un beneficio exclusivo'
                        : `${program.referral_reward_days} días gratis`}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Actividad */}
            {activity.length > 0 && (
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
                      <div className="mt-2 space-y-0 rounded-xl overflow-hidden">
                        {(activityExpanded ? activity : activity.slice(0, 4)).map((entry) => (
                          <div key={entry.id} className="flex items-center gap-3 px-3 py-2.5 bg-white/10">
                            {entry.type === 'referral' ? (
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                            ) : entry.type === 'redeemed' ? (
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Gift className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                            )}
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
                              <span className="text-xs font-bold flex-shrink-0 text-white">
                                {program.referral_reward_type === 'benefit'
                                  ? '🎁'
                                  : `+${program.referral_reward_days}d`}
                              </span>
                            )}
                          </div>
                        ))}
                        {activity.length > 4 && (
                          <button
                            onClick={() => setActivityExpanded((v) => !v)}
                            className="w-full py-2 text-xs text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10"
                          >
                            {activityExpanded ? 'Ver menos' : `Ver ${activity.length - 4} más`}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
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
                  {(tiers.length > 0
                    ? [
                        { step: '1', text: 'Registrate en el programa y empezás en el primer nivel automáticamente.' },
                        {
                          step: '2',
                          text: 'Con cada compra acumulás gasto y podés subir de nivel para desbloquear más beneficios.',
                        },
                        { step: '3', text: 'Generá un cupón por cada beneficio y presentalo en caja para usarlo.' },
                      ]
                    : [
                        { step: '1', text: 'Registrate en el programa y accedés a todos los beneficios al instante.' },
                        { step: '2', text: 'Generá un cupón por cada beneficio disponible.' },
                        { step: '3', text: 'Presentá el código en caja para aplicar el beneficio.' },
                      ]
                  ).map((s) => (
                    <div key={s.step} className="flex items-center gap-3 text-sm text-gray-600">
                      <span
                        className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: color }}
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

        {/* Beneficios */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {isMember
                ? `${accessibleIds.size} de ${catalog.length} beneficios disponibles`
                : `${catalog.length} beneficios del club`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {catalog.map((benefit, i) => {
              const accessible = isMember && accessibleIds.has(benefit.id)
              const requiredTier =
                benefit.tier_required !== 'all' ? tiers.find((t) => t.id === benefit.tier_required) : null
              return (
                <BenefitCard
                  key={benefit.id}
                  benefit={benefit}
                  color={color}
                  accessible={accessible}
                  redeemedMonthly={redeemedMonthly}
                  redeemedOnetime={redeemedOnetime}
                  onRedeem={setSelectedBenefit}
                  index={i}
                  requiredTier={requiredTier}
                />
              )
            })}
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-gray-300">by Repeat.la</p>
        </div>
      </div>

      {/* Modal de canje */}
      <AnimatePresence>
        {selectedBenefit && (
          <BenefitRedeemModal
            benefit={selectedBenefit}
            color={color}
            onClose={() => setSelectedBenefit(null)}
            onSuccess={(benefit) => {
              handleRedeemSuccess(benefit)
              // modal remains open to show success step
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
