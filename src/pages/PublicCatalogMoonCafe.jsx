import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Gift, Package, ChevronRight, X, Clock, Info, Megaphone, Tag, Calendar, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BRAND_COLOR = '#1a4a2e'
const PROGRAM_NAME = 'Club Moon Cafe'
const MONEY_PER_POINT = 1000

const ITEMS = [
  {
    id: 1,
    name: 'Medialunas',
    points_cost: 5,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80',
    stock_enabled: false,
    stock: null,
    description: 'Una porción de 3 medialunas de manteca artesanales.',
  },
  {
    id: 2,
    name: 'Flat white',
    points_cost: 10,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80',
    stock_enabled: false,
    stock: null,
    description: 'Café espresso doble con leche vaporizada. Nuestro clásico.',
  },
  {
    id: 3,
    name: 'Combo desayuno',
    points_cost: 15,
    image_url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=400&fit=crop&q=80',
    stock_enabled: false,
    stock: null,
    description: 'Café + medialuna + jugo. El desayuno completo.',
  },
  {
    id: 4,
    name: 'Descuento 20%',
    points_cost: 20,
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop&q=80',
    stock_enabled: false,
    stock: null,
    description: 'Aplicable a cualquier compra en una sola visita.',
  },
  {
    id: 5,
    name: 'Torta artesanal',
    points_cost: 50,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80',
    stock_enabled: true,
    stock: 2,
    description: 'Torta artesanal de 1 kg a elección. Reservar con 24hs de anticipación.',
  },
]

const POSTS = [
  {
    id: 1,
    type: 'promo',
    title: '2x1 en cafés todos los jueves',
    body: 'En cafés todos los jueves — pides uno y te traemos dos. Válido en cualquier sucursal.',
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop&q=80',
    date: '3 jul',
  },
  {
    id: 2,
    type: 'promo',
    title: 'Desayuno completo a precio especial',
    body: 'Café + medialuna + jugo. Solo hasta fin de julio.',
    image_url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&h=400&fit=crop&q=80',
    date: '15 jul',
  },
  {
    id: 3,
    type: 'novedad',
    title: 'Nuevos fríos de temporada',
    body: 'Tereré de limón, cold brew con naranja y limonada de jengibre. Solo por julio.',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop&q=80',
    date: '7 jul',
  },
  {
    id: 4,
    type: 'evento',
    title: 'Cata de cafés de origen — sáb 19',
    body: 'Junto a nuestros baristas, exploramos 4 orígenes distintos. Cupos limitados.',
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop&q=80',
    date: '25 jun',
  },
]

const BADGE_STYLES = {
  promo: { label: 'Promo', bg: 'bg-rose-500', icon: Tag },
  novedad: { label: 'Novedad', bg: 'bg-violet-500', icon: Megaphone },
  evento: { label: 'Evento', bg: 'bg-amber-500', icon: Calendar },
}

function PostsCarousel({ posts }) {
  const scrollRef = useRef(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const loopedPosts = [...posts, ...posts, ...posts]
  const CARD_W = 268
  const initDone = useRef(false)
  const isPaused = useRef(false)

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused.current) scroll(1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' })

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BRAND_COLOR }} />
            <h2 className="text-3xl font-black text-gray-900">Novedades</h2>
          </div>
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
          onTouchStart={() => {
            isPaused.current = true
          }}
          onTouchEnd={() => {
            isPaused.current = false
          }}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loopedPosts.map((post, i) => {
            const badge = BADGE_STYLES[post.type] || BADGE_STYLES.novedad
            const BadgeIcon = badge.icon
            return (
              <button
                key={i}
                onClick={() => setSelectedPost(post)}
                className="flex-shrink-0 w-64 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all text-left"
              >
                <div className="relative h-36 overflow-hidden">
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
                  <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">{post.title}</p>
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
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                {(() => {
                  const badge = BADGE_STYLES[selectedPost.type] || BADGE_STYLES.novedad
                  const BadgeIcon = badge.icon
                  return (
                    <span
                      className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" /> {badge.label}
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
                  style={{ backgroundColor: BRAND_COLOR }}
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

function ItemModal({ item, onClose }) {
  const spendNeeded = (item.points_cost * MONEY_PER_POINT).toLocaleString()

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
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: `${BRAND_COLOR}15` }}>
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
              style={{ backgroundColor: BRAND_COLOR }}
            >
              <Package className="w-10 h-10 text-white" />
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
            {item.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>}
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ backgroundColor: `${BRAND_COLOR}10` }}
          >
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" style={{ color: BRAND_COLOR }} />
              <span className="font-semibold text-gray-800">Puntos necesarios</span>
            </div>
            <span className="text-2xl font-black" style={{ color: BRAND_COLOR }}>
              {item.points_cost}
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>
                Gasta <strong>${spendNeeded}</strong> para acumular los puntos necesarios
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
          <div className="pt-2 space-y-2">
            <Button
              className="w-full h-12 rounded-xl font-semibold text-white"
              style={{ backgroundColor: BRAND_COLOR }}
              onClick={onClose}
            >
              Entendido
            </Button>
            <p className="text-center text-xs text-gray-400">Únete al club para poder canjear tus puntos</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PublicCatalogMoonCafe() {
  const [selectedItem, setSelectedItem] = useState(null)

  const availableItems = ITEMS.filter((i) => !(i.stock_enabled && i.stock === 0))
  const outOfStockItems = ITEMS.filter((i) => i.stock_enabled && i.stock === 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ backgroundColor: BRAND_COLOR }}>
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-3">
          <img
            src="/moon-cafe-logo.png"
            alt="Café Moon"
            className="w-16 h-16 rounded-xl object-contain flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{PROGRAM_NAME}</h1>
            <p className="text-sm text-white/60">Catálogo de canje</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6 space-y-6">
        {/* Novedades */}
        <PostsCarousel posts={POSTS} />

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 border"
          style={{ backgroundColor: `${BRAND_COLOR}10`, borderColor: `${BRAND_COLOR}25` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${BRAND_COLOR}20` }}
              >
                <Gift className="w-5 h-5" style={{ color: BRAND_COLOR }} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">¿Todavía no eres parte del Club?</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Únete al programa y empieza a acumular puntos en cada visita.
                </p>
              </div>
            </div>
            <a
              href="/publicprogram-demo/mooncafe-points"
              className="sm:flex-shrink-0 flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-black text-sm whitespace-nowrap"
              style={{ backgroundColor: '#facc15' }}
            >
              Unirte al Club →
            </a>
          </div>
        </motion.div>

        {/* Premios */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BRAND_COLOR }} />
            <h2 className="text-3xl font-black text-gray-900">Premios</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableItems.map((item) => {
              const spendNeeded = (item.points_cost * MONEY_PER_POINT).toLocaleString()
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left bg-white rounded-2xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-5">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${BRAND_COLOR}15` }}
                      >
                        <Package className="w-9 h-9" style={{ color: BRAND_COLOR }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-base">{item.name}</p>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mt-1.5"
                        style={{ backgroundColor: `${BRAND_COLOR}15`, color: BRAND_COLOR }}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        {item.points_cost} pts
                      </span>
                      <p className="text-sm text-gray-400 mt-1.5">Gastar ${spendNeeded} para canjearlo</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </motion.button>
              )
            })}

            {outOfStockItems.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sin stock</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-50">
                  {outOfStockItems.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-not-allowed"
                      >
                        <div className="flex items-center gap-4 p-5">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100">
                              <Package className="w-9 h-9 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-base">{item.name}</p>
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mt-1.5 bg-gray-100 text-gray-500">
                              <Coins className="w-3.5 h-3.5" />
                              {item.points_cost} pts
                            </span>
                            <p className="text-sm text-red-400 mt-1.5 font-medium">Sin stock</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-300">Powered by Repeat.la</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  )
}
