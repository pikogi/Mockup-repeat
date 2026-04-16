import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins,
  Package,
  ChevronRight,
  X,
  MapPin,
  Clock,
  Info,
  Megaphone,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronDown,
  Star,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Datos de ejemplo (mockup) ───────────────────────────────────────────────
const MOCK_PROGRAM = {
  name: 'Club Café Bonafide',
  logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&h=80&fit=crop&q=80',
  brand_color: '#2563EB',
  money_per_point: 1000,
  money_per_point_redeem: 100,
}

const MOCK_ITEMS = [
  {
    id: 1,
    name: 'Café mediano gratis',
    points_cost: 50,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80',
    stock_enabled: false,
    stock: null,
    description: 'Válido para cualquier variedad de café mediano.',
  },
  {
    id: 2,
    name: 'Medialunas x3',
    points_cost: 30,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80',
    stock_enabled: true,
    stock: 8,
    description: 'Tres medialunas de manteca recién horneadas.',
  },
  {
    id: 3,
    name: 'Descuento 20%',
    points_cost: 80,
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop&q=80',
    stock_enabled: false,
    stock: null,
    description: 'Aplicable a cualquier compra en una sola visita.',
  },
  {
    id: 4,
    name: 'Combo café + sandwich',
    points_cost: 120,
    image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=400&fit=crop&q=80',
    stock_enabled: true,
    stock: 3,
    description: 'Café a elección más sandwich de miga o tostado.',
  },
  {
    id: 5,
    name: 'Torta de cumpleaños',
    points_cost: 300,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80',
    stock_enabled: true,
    stock: 0,
    description: 'Torta de 1 kg a elección. Reservar con 48hs de anticipación.',
  },
]

const BADGE_STYLES = {
  promo: { label: 'Promo', bg: 'bg-rose-500', icon: Tag },
  novedad: { label: 'Novedad', bg: 'bg-violet-500', icon: Megaphone },
  evento: { label: 'Evento', bg: 'bg-amber-500', icon: Calendar },
}

const MOCK_POSTS = [
  {
    id: 1,
    type: 'promo',
    title: '2x1 en cafés los jueves',
    body: 'Todos los jueves de noviembre presentá tu tarjeta y llevate dos cafés al precio de uno. Válido de 8 a 12hs.',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop&q=80',
    date: '15 nov',
  },
  {
    id: 2,
    type: 'novedad',
    title: 'Nuevo menú de invierno',
    body: 'Incorporamos chocolates calientes, tés especiales y nuevas opciones de repostería. ¡Vení a probarlos!',
    image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&q=80',
    date: '10 nov',
  },
  {
    id: 3,
    type: 'evento',
    title: 'Open mic viernes 22',
    body: 'El próximo viernes 22 a las 20hs tenemos una nueva noche de música en vivo. Entrada libre con consumición.',
    image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop&q=80',
    date: '8 nov',
  },
  {
    id: 4,
    type: 'promo',
    title: 'Combo desayuno -15%',
    body: 'Café + medialuna + jugo con 15% de descuento todos los días hasta las 10hs.',
    image_url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=400&fit=crop&q=80',
    date: '3 nov',
  },
]

// ─── Carrusel de novedades ─────────────────────────────────────────────────────
function PostsCarousel({ posts, color }) {
  const scrollRef = useRef(null)
  const [selectedPost, setSelectedPost] = useState(null)
  // Triplicamos los items para simular loop infinito
  const loopedPosts = [...posts, ...posts, ...posts]
  const CARD_W = 236 // ancho card (224) + gap (12)

  // Al montar, posicionamos en el bloque del medio
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
    // Si llegó al último bloque, salta al del medio
    if (el.scrollLeft >= total * 2) {
      el.scrollLeft -= total
    }
    // Si llegó al primer bloque, salta al del medio
    if (el.scrollLeft < total * 0.05) {
      el.scrollLeft += total
    }
  }

  const isPaused = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused.current) scroll(1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Novedades</p>
          <div className="flex gap-1">
            <button
              onClick={() => scroll(-1)}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
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
          onTouchStart={() => {
            isPaused.current = true
          }}
          onTouchEnd={() => {
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
                className="flex-shrink-0 w-56 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all text-left"
              >
                {/* Imagen */}
                <div className="relative h-32 overflow-hidden">
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
                {/* Título */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.body}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal de post */}
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

// ─── Grid responsive según cantidad de ítems ─────────────────────────────────
// Mobile: ≤4 → 1 col, >4 → 2 cols
// Desktop (sm): ≤6 → 2 cols, 7-8 → 3 cols, >8 → 4 cols
function getGridClass(count) {
  const mobile = count > 4 ? 'grid-cols-2' : 'grid-cols-1'
  const desktop = count <= 6 ? 'sm:grid-cols-2' : count <= 8 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'
  return `grid ${mobile} ${desktop} gap-3`
}

// ─── Ítem del catálogo ────────────────────────────────────────────────────────
// compact=true → layout vertical (imagen arriba), usado en 3-4 columnas
function CatalogItem({ item, color, moneyPerPoint, onSelect, compact = false }) {
  const spendNeeded = (item.points_cost * moneyPerPoint).toLocaleString()
  const isOutOfStock = item.stock_enabled && item.stock === 0

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
      onClick={() => !isOutOfStock && onSelect(item)}
      disabled={isOutOfStock}
      className={`w-full text-left bg-white rounded-2xl border transition-all overflow-hidden ${
        isOutOfStock
          ? 'opacity-50 cursor-not-allowed border-gray-200'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md active:shadow-sm cursor-pointer'
      }`}
    >
      {compact ? (
        /* Layout vertical para 3-4 columnas */
        <div className="flex flex-col">
          <div className="w-full h-28 flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <Package className="w-10 h-10" style={{ color }} />
            )}
          </div>
          <div className="p-3 space-y-1.5">
            <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</p>
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}15`, color }}
            >
              <Coins className="w-3 h-3" />
              {item.points_cost} pts
            </span>
            <p className="text-xs text-gray-400">Gastar {spendNeeded}</p>
            {item.stock_enabled && !isOutOfStock && item.stock !== null && (
              <p className="text-xs text-amber-600 font-medium">Quedan {item.stock}</p>
            )}
            {isOutOfStock && <p className="text-xs text-red-500 font-medium">Sin stock</p>}
          </div>
        </div>
      ) : (
        /* Layout horizontal para 1-2 columnas */
        <div className="flex items-center gap-4 p-4">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}15` }}
            >
              <Package className="w-7 h-7" style={{ color }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
              {!isOutOfStock && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${color}15`, color }}
              >
                <Coins className="w-3 h-3" />
                {item.points_cost} pts
              </span>
              {item.stock_enabled && !isOutOfStock && item.stock !== null && (
                <span className="text-xs text-amber-600 font-medium">Quedan {item.stock}</span>
              )}
              {isOutOfStock && <span className="text-xs text-red-500 font-medium">Sin stock</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">Gastar {spendNeeded} para canjearlo</p>
          </div>
        </div>
      )}
    </motion.button>
  )
}

// ─── Modal de detalle ─────────────────────────────────────────────────────────
function ItemDetailModal({ item, color, moneyPerPoint, onClose, onSurvey }) {
  const spendNeeded = (item.points_cost * moneyPerPoint).toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen o color */}
        <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-28 w-28 object-cover rounded-2xl shadow-lg" />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: color }}
            >
              <Package className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
            {item.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>}
          </div>

          {/* Puntos necesarios */}
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: `${color}10` }}>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" style={{ color }} />
              <span className="font-semibold text-gray-800">Puntos necesarios</span>
            </div>
            <span className="text-2xl font-black" style={{ color }}>
              {item.points_cost}
            </span>
          </div>

          {/* Info de canje */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Canjeable en el local presentando tu tarjeta</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>
                Gastar <strong>{spendNeeded}</strong> para acumular los puntos necesarios
              </span>
            </div>
            {item.stock_enabled && item.stock !== null && (
              <div className="flex items-center gap-3 text-sm text-amber-600">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>
                  Stock limitado: quedan <strong>{item.stock}</strong> disponibles
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="pt-2 space-y-2">
            <Button
              className="w-full h-12 rounded-xl font-semibold text-white"
              style={{ backgroundColor: color }}
              onClick={onSurvey}
            >
              Entendido
            </Button>
            <p className="text-center text-xs text-gray-400">Acercate al local para canjear tus puntos</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Survey Modal ─────────────────────────────────────────────────────────────
function SurveyModal({ color, onClose }) {
  const [step, setStep] = useState('rating') // 'rating' | 'google' | 'thanks'
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')

  const handleRate = (val) => {
    setRating(val)
  }

  const handleSubmit = () => {
    if (!rating) return
    if (rating >= 4) setStep('google')
    else setStep('thanks')
  }

  const StarRow = ({ size = 'w-10 h-10', interactive = false }) => (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          onMouseEnter={() => interactive && setHovered(val)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && handleRate(val)}
          className={interactive ? 'transition-transform hover:scale-110 active:scale-95' : 'cursor-default'}
        >
          <Star
            className={`${size} transition-colors`}
            fill={(interactive ? hovered || rating : rating) >= val ? color : 'none'}
            stroke={(interactive ? hovered || rating : rating) >= val ? color : '#d1d5db'}
          />
        </button>
      ))}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {/* ── Paso 1: rating ── */}
          {step === 'rating' && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-7 space-y-5"
            >
              <div className="text-center space-y-1.5">
                <h2 className="text-xl font-bold text-gray-900">¿Cómo fue tu experiencia?</h2>
                <p className="text-sm text-gray-400">Tu opinión nos ayuda a mejorar</p>
              </div>

              <StarRow size="w-10 h-10" interactive />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentarios <span className="font-normal normal-case">(opcional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Contanos qué te gustó o qué podríamos mejorar..."
                  rows={3}
                  className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 resize-none outline-none focus:border-gray-400 placeholder:text-gray-300"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!rating}
                className="w-full h-11 rounded-xl font-semibold text-white"
                style={{ backgroundColor: color, opacity: rating ? 1 : 0.4 }}
              >
                Enviar
              </Button>
            </motion.div>
          )}

          {/* ── Paso 2a: invitación Google (4-5 ★) ── */}
          {step === 'google' && (
            <motion.div
              key="google"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-7 space-y-4"
            >
              <div className="text-center space-y-1">
                <span className="text-4xl">🌟</span>
                <h2 className="text-xl font-bold text-gray-900 pt-1">¡Nos alegra saberlo!</h2>
              </div>

              <StarRow size="w-6 h-6" />

              <div className="rounded-2xl bg-gray-50 p-4 space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">¿Podés dejarnos una reseña en Google?</p>
                <p className="text-gray-500 leading-relaxed">
                  Buscá la sucursal que más visitás y compartí tu experiencia. ¡Le ayuda mucho a otros clientes
                  encontrarnos!
                </p>
              </div>

              {comment && (
                <p className="text-xs text-gray-400 italic border-l-2 border-gray-200 pl-3">&ldquo;{comment}&rdquo;</p>
              )}

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: color }}
              >
                <ExternalLink className="w-4 h-4" />
                Buscar mi sucursal en Google
              </a>
              <button
                onClick={onClose}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Ahora no
              </button>
            </motion.div>
          )}

          {/* ── Paso 2b: gracias (1-3 ★) ── */}
          {step === 'thanks' && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-7 space-y-4"
            >
              <div className="text-center space-y-1">
                <span className="text-4xl">💚</span>
                <h2 className="text-xl font-bold text-gray-900 pt-1">¡Gracias por tu opinión!</h2>
                <p className="text-sm text-gray-500">Nos comprometemos a seguir mejorando.</p>
              </div>

              <StarRow size="w-6 h-6" />

              {comment && (
                <p className="text-xs text-gray-400 italic border-l-2 border-gray-200 pl-3">&ldquo;{comment}&rdquo;</p>
              )}

              <button
                onClick={onClose}
                className="w-full h-12 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: color }}
              >
                Cerrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function PublicCatalog() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSurvey, setShowSurvey] = useState(false)
  const [howOpen, setHowOpen] = useState(false)
  const color = MOCK_PROGRAM.brand_color

  const availableItems = useMemo(() => MOCK_ITEMS.filter((i) => !(i.stock_enabled && i.stock === 0)), [])
  const outOfStockItems = useMemo(() => MOCK_ITEMS.filter((i) => i.stock_enabled && i.stock === 0), [])
  const availableGridClass = getGridClass(availableItems.length)
  const outOfStockGridClass = getGridClass(outOfStockItems.length)
  const availableCompact = availableItems.length > 6
  const outOfStockCompact = outOfStockItems.length > 6

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: 'radial-gradient(circle, #00000012 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header + Ticker sticky juntos */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          {MOCK_PROGRAM.logo_url ? (
            <img src={MOCK_PROGRAM.logo_url} alt={MOCK_PROGRAM.name} className="w-10 h-10 rounded-xl object-contain" />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">{MOCK_PROGRAM.name}</h1>
            <p className="text-xs text-gray-400">Catálogo de canje</p>
          </div>
        </div>

        {/* Ticker de anuncio */}
        <div className="overflow-hidden py-1.5" style={{ backgroundColor: color }}>
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 18s linear infinite' }}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-white text-xs font-medium px-8">
                🚀 Referí un amigo y ganá 100 puntos &nbsp;·&nbsp; 🎁 Acumulá puntos en cada compra &nbsp;·&nbsp; ⭐
                Canjeá premios exclusivos para miembros
              </span>
            ))}
          </div>
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </div>

      {/* Carrusel de novedades */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <PostsCarousel posts={MOCK_POSTS} color={color} />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Banner de puntos */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-white">
            <p className="text-xs opacity-80 uppercase tracking-wider">Tus puntos</p>
            <p className="text-3xl font-black leading-none">—</p>
            <p className="text-xs opacity-70 mt-0.5">Consultá tu saldo en el local</p>
          </div>
          <div className="text-right text-white">
            <p className="text-xs opacity-70">Acumulás</p>
            <p className="text-sm font-bold">{MOCK_PROGRAM.money_per_point.toLocaleString()} = 1 pt</p>
          </div>
        </motion.div>

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
                key="how-content"
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
                      text: `Cada vez que gastás ${MOCK_PROGRAM.money_per_point.toLocaleString()} acumulás 1 punto`,
                    },
                    { step: '2', text: 'Elegí un premio del catálogo y acercate al local' },
                    { step: '3', text: 'Mostrá tu tarjeta del wallet y canjea tus puntos' },
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

        {/* Lista de ítems */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">{availableItems.length} premios disponibles</p>

          <div className={availableGridClass}>
            {availableItems.map((item, i) => (
              <motion.div key={item.id} transition={{ delay: i * 0.05 }}>
                <CatalogItem
                  item={item}
                  color={color}
                  moneyPerPoint={MOCK_PROGRAM.money_per_point}
                  onSelect={setSelectedItem}
                  compact={availableCompact}
                />
              </motion.div>
            ))}
          </div>

          {/* Sin stock al final */}
          {outOfStockItems.length > 0 && (
            <div className="pt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sin stock</p>
              <div className={outOfStockGridClass}>
                {outOfStockItems.map((item, i) => (
                  <motion.div key={item.id} transition={{ delay: i * 0.05 }}>
                    <CatalogItem
                      item={item}
                      color={color}
                      moneyPerPoint={MOCK_PROGRAM.money_per_point}
                      onSelect={setSelectedItem}
                      compact={outOfStockCompact}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-300">by Repeat.la</p>
        </div>
      </div>

      {/* Modal de detalle */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            color={color}
            moneyPerPoint={MOCK_PROGRAM.money_per_point}
            onClose={() => setSelectedItem(null)}
            onSurvey={() => {
              setSelectedItem(null)
              setTimeout(() => setShowSurvey(true), 200)
            }}
          />
        )}
      </AnimatePresence>

      {/* Survey modal */}
      <AnimatePresence>
        {showSurvey && <SurveyModal color={color} onClose={() => setShowSurvey(false)} />}
      </AnimatePresence>
    </div>
  )
}
