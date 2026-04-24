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
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Gift,
  Mail,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CAFE = {
  name: 'Café Bonafide',
  logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&h=80&fit=crop&q=80',
  brand_color: '#059669',
  cashback_percentage: 8,
  min_redeem: 500,
  balance: 1240,
  total_earned: 3800,
  total_redeemed: 2560,
}

const MOCK_ROPA = {
  name: 'Tienda Mila',
  logo_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop&q=80',
  brand_color: '#db2777',
  cashback_percentage: 5,
  min_redeem: 1000,
  balance: 620,
  total_earned: 2100,
  total_redeemed: 1480,
}

const MOCK_DEFAULT = {
  name: 'Club Cashback',
  logo_url: null,
  brand_color: '#059669',
  cashback_percentage: 6,
  min_redeem: 500,
  balance: 380,
  total_earned: 1900,
  total_redeemed: 1520,
}

const ACTIVITY_CAFE = [
  { id: 1, type: 'earned', label: 'Compra en local', amount: 320, purchase: 4000, date: '18 abr 2026' },
  { id: 2, type: 'redeemed', label: 'Canje en caja', amount: 500, date: '15 abr 2026' },
  { id: 3, type: 'earned', label: 'Compra en local', amount: 240, purchase: 3000, date: '10 abr 2026' },
  { id: 4, type: 'earned', label: 'Compra en local', amount: 480, purchase: 6000, date: '5 abr 2026' },
  { id: 5, type: 'redeemed', label: 'Canje en caja', amount: 500, date: '2 abr 2026' },
  { id: 6, type: 'earned', label: 'Compra en local', amount: 200, purchase: 2500, date: '28 mar 2026' },
]

const ACTIVITY_ROPA = [
  { id: 1, type: 'earned', label: 'Compra online', amount: 375, purchase: 7500, date: '17 abr 2026' },
  { id: 2, type: 'earned', label: 'Compra en local', amount: 245, purchase: 4900, date: '8 abr 2026' },
  { id: 3, type: 'redeemed', label: 'Canje en caja', amount: 1000, date: '1 abr 2026' },
  { id: 4, type: 'earned', label: 'Compra online', amount: 500, purchase: 10000, date: '20 mar 2026' },
  { id: 5, type: 'earned', label: 'Compra en local', amount: 480, purchase: 9600, date: '12 mar 2026' },
]

const POSTS_CAFE = [
  {
    id: 1,
    type: 'promo',
    title: 'Doble cashback los sábados',
    body: 'Cada sábado de abril acumulás el doble de cashback en todas tus compras.',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop&q=80',
    date: '15 abr',
  },
  {
    id: 2,
    type: 'novedad',
    title: 'Cashback en delivery también',
    body: 'Ahora acumulás cashback también en tus pedidos a domicilio. ¡Sin mínimo!',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop&q=80',
    date: '8 abr',
  },
  {
    id: 3,
    type: 'evento',
    title: 'Finde de triple cashback — 26 y 27',
    body: 'El último finde de abril triplicamos el cashback en todos los productos.',
    image_url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=400&fit=crop&q=80',
    date: '3 abr',
  },
]

const POSTS_ROPA = [
  {
    id: 1,
    type: 'promo',
    title: '10% de cashback en nueva colección',
    body: 'Comprás de la nueva colección de invierno y acumulás el doble de cashback.',
    image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&q=80',
    date: '14 abr',
  },
  {
    id: 2,
    type: 'novedad',
    title: 'Ahora podés canjear en cuotas',
    body: 'Tu saldo de cashback se puede usar en múltiples compras. No hace falta usarlo todo junto.',
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop&q=80',
    date: '6 abr',
  },
  {
    id: 3,
    type: 'evento',
    title: 'Sale de temporada — cashback x2',
    body: 'Durante la sale de temporada toda compra acumula el doble de cashback.',
    image_url: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=600&h=400&fit=crop&q=80',
    date: '1 abr',
  },
]

const BADGE_STYLES = {
  promo: { label: 'Promo', bg: 'bg-rose-500', icon: Tag },
  novedad: { label: 'Novedad', bg: 'bg-violet-500', icon: Megaphone },
  evento: { label: 'Evento', bg: 'bg-amber-500', icon: Calendar },
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
      if (!isPaused.current) scroll(1)
    }, 3200)
    return () => clearInterval(iv)
  }, [])
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Novedades</p>
          <div className="flex gap-1">
            <button
              onClick={() => scroll(-1)}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
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
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
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

// ─── Modal de canje ────────────────────────────────────────────────────────────
function RedeemModal({ program, balance, color, onClose }) {
  const [step, setStep] = useState('confirm') // 'confirm' | 'success'
  const canRedeem = balance >= program.min_redeem
  const [redeemCode] = useState(() => 'CB-' + Math.random().toString(36).slice(2, 7).toUpperCase())

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={step === 'confirm' ? onClose : undefined}
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
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-5"
            >
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">Usar cashback</h2>
              </div>

              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ backgroundColor: `${color}10`, border: `1.5px solid ${color}30` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Tu saldo disponible</span>
                  <span className="text-2xl font-black" style={{ color }}>
                    ${balance.toLocaleString()}
                  </span>
                </div>
                {!canRedeem && (
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Necesitás al menos <strong>${program.min_redeem.toLocaleString()}</strong> para hacer un canje. Te
                      faltan <strong>${(program.min_redeem - balance).toLocaleString()}</strong>.
                    </span>
                  </div>
                )}
              </div>

              {canRedeem && (
                <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-600">Saldo actual</span>
                    <span className="font-semibold text-gray-900">${balance.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-600">Se descontarán</span>
                    <span className="font-semibold text-red-500">− ${balance.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-gray-800">Saldo restante</span>
                    <span className="font-bold text-gray-400">$0</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full h-12 rounded-xl font-semibold text-white"
                style={{ backgroundColor: canRedeem ? color : undefined }}
                disabled={!canRedeem}
                onClick={() => setStep('success')}
              >
                {canRedeem ? 'Confirmar canje' : `Necesitás $${program.min_redeem.toLocaleString()} mínimo`}
              </Button>
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
                style={{ backgroundColor: `${color}20` }}
              >
                <CheckCircle2 className="w-9 h-9" style={{ color }} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">¡Canje listo!</h2>
                <p className="text-sm text-gray-500 mt-1">Mostrá este código en caja para aplicar el descuento.</p>
              </div>
              <div
                className="rounded-2xl p-5 space-y-1"
                style={{ backgroundColor: `${color}12`, border: `2px dashed ${color}40` }}
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Código de canje</p>
                <p className="text-3xl font-black tracking-widest" style={{ color }}>
                  {redeemCode}
                </p>
                <p className="text-xs text-gray-400">${balance.toLocaleString()} de descuento</p>
              </div>
              <Button
                className="w-full h-11 rounded-xl font-semibold text-white"
                style={{ backgroundColor: color }}
                onClick={onClose}
              >
                Cerrar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────
export default function PublicCashback() {
  const { programId } = useParams()
  const [searchParams] = useSearchParams()
  const isMember = !!searchParams.get('card')

  const isCafe = programId === 'cafe-demo'
  const isRopa = programId === 'ropa-demo'

  const program = isCafe ? MOCK_CAFE : isRopa ? MOCK_ROPA : MOCK_DEFAULT
  const activity = isCafe ? ACTIVITY_CAFE : isRopa ? ACTIVITY_ROPA : ACTIVITY_CAFE
  const posts = isCafe ? POSTS_CAFE : isRopa ? POSTS_ROPA : POSTS_CAFE

  const color = program.brand_color
  const [balance] = useState(isMember ? program.balance : 0)
  const [howOpen, setHowOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)
  const [activityExpanded, setActivityExpanded] = useState(false)
  const [showRedeem, setShowRedeem] = useState(false)
  const [shareDone, setShareDone] = useState(false)
  const [showEmailLookup, setShowEmailLookup] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  const canRedeem = balance >= program.min_redeem
  const progressPct = Math.min((balance / program.min_redeem) * 100, 100)
  const missing = Math.max(0, program.min_redeem - balance)

  const handleShare = async () => {
    const url = `${window.location.origin}/cashback/${programId}`
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
    window.location.href = `/cashback/${programId}?card=mock`
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
              <Wallet className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">{program.name}</h1>
            <p className="text-xs text-gray-400">Club Cashback · {program.cashback_percentage}% de devolución</p>
          </div>
        </div>

        {/* Ticker */}
        <div className="overflow-hidden py-1.5" style={{ backgroundColor: color }}>
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-white text-xs font-medium px-8">
                💰 Acumulás {program.cashback_percentage}% de cada compra · 🎁 Canjeás tu saldo como descuento en caja ·
                ✅ Sin vencimiento
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-5 space-y-6 pb-10">
        {/* Banner principal — miembro */}
        {isMember ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
          >
            {/* Saldo */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div className="text-white flex-1">
                <p className="text-xs opacity-70 uppercase tracking-wider">Tu saldo cashback</p>
                <p className="text-4xl font-black leading-none">${balance.toLocaleString()}</p>
                <p className="text-xs opacity-70 mt-0.5">{program.cashback_percentage}% en cada compra</p>
              </div>
              {canRedeem && (
                <button
                  onClick={() => setShowRedeem(true)}
                  className="bg-white text-sm font-bold px-4 py-2 rounded-xl transition-opacity hover:opacity-90 flex-shrink-0"
                  style={{ color }}
                >
                  Canjear
                </button>
              )}
            </div>

            {/* Barra hacia mínimo de canje */}
            {!canRedeem && (
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-xs opacity-70">
                  <span>
                    Te faltan <span className="font-bold opacity-100">${missing.toLocaleString()}</span> para canjear
                  </span>
                  <span>Mínimo ${program.min_redeem.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total acumulado', value: `$${program.total_earned.toLocaleString()}`, icon: ArrowDownLeft },
                { label: 'Total canjeado', value: `$${program.total_redeemed.toLocaleString()}`, icon: ArrowUpRight },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="bg-white/15 rounded-xl px-3 py-2.5 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white/70 flex-shrink-0" />
                    <div>
                      <p className="text-white/60 text-xs">{s.label}</p>
                      <p className="text-white font-bold text-sm">{s.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Compartir */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold"
            >
              <AnimatePresence mode="wait">
                {shareDone ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Compartir con un amigo
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
                    <span className="text-xs font-semibold uppercase tracking-wider">Historial</span>
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
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${entry.type === 'earned' ? 'bg-white/20' : 'bg-white/10'}`}
                            >
                              {entry.type === 'earned' ? (
                                <TrendingUp className="w-4 h-4 text-white" />
                              ) : (
                                <Gift className="w-4 h-4 text-white/70" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">{entry.label}</p>
                              <p className="text-xs text-white/50">{entry.date}</p>
                            </div>
                            <span
                              className={`text-xs font-bold flex-shrink-0 ${entry.type === 'earned' ? 'text-white' : 'text-white/60'}`}
                            >
                              {entry.type === 'earned' ? '+' : '−'}${entry.amount.toLocaleString()}
                            </span>
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
        ) : (
          /* Banner anónimo */
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
                  <p className="text-xs opacity-70 uppercase tracking-wider mb-1">Cashback</p>
                  <p className="text-3xl font-black">{program.cashback_percentage}%</p>
                  <p className="text-sm opacity-80 mt-1">de devolución en cada compra</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div
              className="bg-white px-5 py-4 flex items-center justify-between gap-3 border border-t-0 rounded-b-2xl"
              style={{ borderColor: `${color}30` }}
            >
              <AnimatePresence mode="wait">
                {!showEmailLookup ? (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-3 w-full"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Acumulá plata de vuelta</p>
                      <button
                        onClick={() => setShowEmailLookup(true)}
                        className="text-xs mt-0.5 font-medium underline underline-offset-2"
                        style={{ color }}
                      >
                        ¿Ya sos miembro? Ver mi saldo →
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
                    className="w-full space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color }} />
                      <p className="text-sm font-semibold text-gray-800">Ingresá tu email para ver tu saldo</p>
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
                        Ver saldo →
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

        {/* Cómo funciona el cashback */}
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
                      text: `Comprás en ${program.name} → acumulás ${program.cashback_percentage}% de cashback automáticamente.`,
                    },
                    {
                      step: '2',
                      text: `Cuando tu saldo llega a $${program.min_redeem.toLocaleString()}, podés usarlo como descuento en tu próxima compra.`,
                    },
                    {
                      step: '3',
                      text: 'Presentás tu tarjeta en caja, el operador aplica el descuento y tu saldo se resetea.',
                    },
                  ].map((s) => (
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

        {/* Cards informativas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: TrendingUp,
              title: `${program.cashback_percentage}% de devolución`,
              desc: 'En cada compra, sin excepciones.',
            },
            {
              icon: Wallet,
              title: `Mínimo $${program.min_redeem.toLocaleString()}`,
              desc: 'Necesitás ese saldo para hacer tu primer canje.',
            },
            {
              icon: Gift,
              title: 'Sin vencimiento',
              desc: 'Tu saldo no se pierde. Usalo cuando quieras.',
            },
          ].map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-300">by Repeat.la</p>
        </div>
      </div>

      {/* Modal de canje */}
      <AnimatePresence>
        {showRedeem && (
          <RedeemModal program={program} balance={balance} color={color} onClose={() => setShowRedeem(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
