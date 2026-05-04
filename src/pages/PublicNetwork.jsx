import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  X,
  Sparkles,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  Tag,
  Utensils,
  Scissors,
  Shirt,
  Dumbbell,
  Wrench,
  Star,
  Zap,
  CreditCard,
  Search,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MERCHANTS = [
  {
    id: 1,
    name: 'La Rueda',
    category: 'Gastronomía',
    promo: 'Menú de mediodía',
    promo_original: '$12.000',
    promo_price: 8500,
    promo_desc: 'Entrada + plato principal + postre + bebida. De lunes a viernes de 12 a 15hs.',
    color: '#dc2626',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80',
    address: 'Av. Corrientes 1234, CABA',
    rating: 4.8,
    reviews: 124,
    slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
    featured: true,
  },
  {
    id: 2,
    name: 'El Grano Café',
    category: 'Gastronomía',
    promo: 'Brunch completo',
    promo_original: '$9.500',
    promo_price: 6000,
    promo_desc: 'Tostadas, huevos revueltos, jugo y café. Sábados y domingos de 9 a 13hs.',
    color: '#92400e',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=80',
    address: 'Thames 880, Palermo',
    rating: 4.6,
    reviews: 89,
    slots: ['09:00', '09:30', '10:00', '10:30', '11:00'],
    featured: false,
  },
  {
    id: 3,
    name: 'Misushi',
    category: 'Gastronomía',
    promo: 'Combo 20 piezas',
    promo_original: '$16.000',
    promo_price: 11000,
    promo_desc: '20 piezas a elección + edamame + 2 bebidas. Válido cualquier día.',
    color: '#0f172a',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop&q=80',
    address: 'Gurruchaga 1540, Palermo',
    rating: 4.9,
    reviews: 210,
    slots: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
    featured: true,
  },
  {
    id: 4,
    name: 'Spa Alma',
    category: 'Belleza',
    promo: 'Masaje 60 min',
    promo_original: '$26.000',
    promo_price: 18000,
    promo_desc: 'Masaje relajante de cuerpo completo con aceites esenciales. Primera visita.',
    color: '#7c3aed',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop&q=80',
    address: 'Arenales 2100, Recoleta',
    rating: 4.7,
    reviews: 67,
    slots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
    featured: false,
  },
  {
    id: 5,
    name: 'Leroma Gelato',
    category: 'Gastronomía',
    promo: 'Box degustación',
    promo_original: '$8.000',
    promo_price: 5000,
    promo_desc: '500g de helado artesanal en 4 sabores a elección + cucurucho de regalo.',
    color: '#111111',
    image_url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&h=400&fit=crop&q=80',
    address: 'Santa Fe 3200, Palermo',
    rating: 4.5,
    reviews: 43,
    slots: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    featured: false,
  },
  {
    id: 6,
    name: 'Barber Club',
    category: 'Belleza',
    promo: 'Corte + barba',
    promo_original: '$14.000',
    promo_price: 9000,
    promo_desc: 'Corte de autor + arreglo de barba + lavado con tratamiento. Primera visita.',
    color: '#1c1917',
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop&q=80',
    address: 'Serrano 1450, Palermo',
    rating: 4.8,
    reviews: 156,
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    featured: true,
  },
  {
    id: 7,
    name: 'Urbana Store',
    category: 'Indumentaria',
    promo: 'Remera + jean',
    promo_original: '$34.000',
    promo_price: 22000,
    promo_desc: 'Combo remera premium + jean slim de temporada. Tallas S a XL disponibles.',
    color: '#1d4ed8',
    image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop&q=80',
    address: 'Honduras 5200, Palermo',
    rating: 4.4,
    reviews: 38,
    slots: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00'],
    featured: false,
  },
  {
    id: 8,
    name: 'FitZone',
    category: 'Fitness',
    promo: 'Semana de prueba',
    promo_original: '$12.000',
    promo_price: 3000,
    promo_desc: '7 días de acceso ilimitado al gimnasio + una clase de prueba con personal trainer.',
    color: '#0f766e',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80',
    address: 'Av. del Libertador 4500, Palermo',
    rating: 4.6,
    reviews: 92,
    slots: ['07:00', '08:00', '09:00', '17:00', '18:00', '19:00'],
    featured: false,
  },
  {
    id: 9,
    name: 'Yoga Studio Zen',
    category: 'Fitness',
    promo: '3 clases de yoga',
    promo_original: '$13.500',
    promo_price: 7500,
    promo_desc: '3 clases de yoga a elección de estilo. Todos los niveles. Válido 30 días.',
    color: '#065f46',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80',
    address: 'Uriarte 2340, Palermo',
    rating: 4.9,
    reviews: 71,
    slots: ['08:00', '09:00', '10:00', '18:00', '19:00', '20:00'],
    featured: false,
  },
  {
    id: 10,
    name: 'AutoSpa Wash',
    category: 'Servicios',
    promo: 'Detailing completo',
    promo_original: '$40.000',
    promo_price: 25000,
    promo_desc: 'Lavado interior + exterior + encerado + limpieza de tapizados. Solo con turno.',
    color: '#1e3a8a',
    image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop&q=80',
    address: 'Av. Cabildo 2800, Belgrano',
    rating: 4.5,
    reviews: 29,
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    featured: false,
  },
  {
    id: 11,
    name: 'Centro Relax',
    category: 'Servicios',
    promo: 'Masaje 90 min',
    promo_original: '$35.000',
    promo_price: 22000,
    promo_desc: 'Masaje descontracturante + piedras calientes + aromaterapia. Primera visita.',
    color: '#4c1d95',
    image_url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&h=400&fit=crop&q=80',
    address: 'Av. Santa Fe 1800, Recoleta',
    rating: 4.7,
    reviews: 54,
    slots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
    featured: false,
  },
  {
    id: 12,
    name: 'Zapatería Roots',
    category: 'Indumentaria',
    promo: 'Zapatillas de temporada',
    promo_original: '$52.000',
    promo_price: 35000,
    promo_desc: 'Modelos seleccionados de la nueva colección con descuento exclusivo Repeat.',
    color: '#854d0e',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=80',
    address: 'Florida 456, Centro',
    rating: 4.3,
    reviews: 22,
    slots: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00'],
    featured: false,
  },
]

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', Icon: Tag },
  { id: 'Gastronomía', label: 'Gastro', Icon: Utensils },
  { id: 'Belleza', label: 'Belleza', Icon: Scissors },
  { id: 'Indumentaria', label: 'Ropa', Icon: Shirt },
  { id: 'Fitness', label: 'Fitness', Icon: Dumbbell },
  { id: 'Servicios', label: 'Servicios', Icon: Wrench },
]

const DATES = ['Hoy', 'Mañana', 'Mié 7', 'Jue 8', 'Vie 9', 'Sáb 10']

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDiscount(m) {
  return Math.round((1 - m.promo_price / parseInt(m.promo_original.replace(/\D/g, ''))) * 100)
}

function formatPrice(n) {
  return '$' + n.toLocaleString('es-AR')
}

function getCategoryColor(category) {
  const map = {
    Gastronomía: { bg: '#fef3c7', text: '#92400e' },
    Belleza: { bg: '#f3e8ff', text: '#6d28d9' },
    Indumentaria: { bg: '#dbeafe', text: '#1e40af' },
    Fitness: { bg: '#d1fae5', text: '#065f46' },
    Servicios: { bg: '#e0e7ff', text: '#3730a3' },
  }
  return map[category] || { bg: '#f3f4f6', text: '#374151' }
}

// ─── Featured strip (horizontal scroll) ──────────────────────────────────────
function FeaturedStrip({ merchants, onSelect }) {
  const featured = merchants.filter((m) => m.featured)
  if (!featured.length) return null

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 px-4 mb-3">
        <Zap className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" />
        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Destacados</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
        {featured.map((m, i) => {
          const discount = getDiscount(m)
          return (
            <motion.button
              key={m.id}
              onClick={() => onSelect(m)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 rounded-2xl overflow-hidden text-left relative cursor-pointer"
              style={{ width: 220 }}
            >
              <div className="relative" style={{ height: 120 }}>
                <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div
                  className="absolute top-2 right-2 text-white text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#facc15', color: '#000' }}
                >
                  -{discount}%
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm leading-tight">{m.name}</p>
                  <p className="text-white/70 text-xs mt-0.5 leading-tight line-clamp-1">{m.promo}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: m.color }} />
              </div>
              <div className="bg-white px-3 py-2.5 flex items-center justify-between border border-t-0 border-gray-100 rounded-b-2xl">
                <div>
                  <span className="font-black text-gray-900 text-sm">{formatPrice(m.promo_price)}</span>
                  <span className="text-gray-400 text-xs line-through ml-1.5">{m.promo_original}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  <span className="font-semibold text-gray-600">{m.rating}</span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Merchant card (grid) ─────────────────────────────────────────────────────
function MerchantCard({ merchant, onSelect, index }) {
  const discount = getDiscount(merchant)
  const catStyle = getCategoryColor(merchant.category)

  return (
    <motion.button
      onClick={() => onSelect(merchant)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      whileTap={{ scale: 0.97 }}
      layout
      className="w-full text-left bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Image */}
      <div className="relative" style={{ aspectRatio: '16/10' }}>
        <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Discount badge */}
        <div
          className="absolute top-2.5 left-2.5 text-black text-xs font-black px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#facc15' }}
        >
          -{discount}%
        </div>

        {/* Rating */}
        <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
          <Star className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" />
          <span className="text-white text-xs font-semibold">{merchant.rating}</span>
        </div>

        {/* Color accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: merchant.color }} />
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Category chip */}
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
          style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
        >
          {merchant.category}
        </span>

        <p className="font-bold text-gray-900 text-sm leading-snug mb-0.5">{merchant.name}</p>
        <p className="text-xs text-gray-500 leading-snug line-clamp-1 mb-2.5">{merchant.promo}</p>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-gray-900 text-base">{formatPrice(merchant.promo_price)}</span>
            <span className="text-xs text-gray-400 line-through">{merchant.promo_original}</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold" style={{ color: merchant.color }}>
            <span>Reservar</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['Oferta', 'Fecha y hora', 'Pago']
function StepBar({ current }) {
  const idx = ['detail', 'booking', 'checkout'].indexOf(current)
  if (idx < 0) return null
  return (
    <div className="flex items-center gap-2 px-5 pt-2 pb-4">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all duration-300"
              style={
                i < idx
                  ? { backgroundColor: '#16a34a', color: '#fff' }
                  : i === idx
                    ? { backgroundColor: '#0f172a', color: '#fff' }
                    : { backgroundColor: '#f3f4f6', color: '#9ca3af' }
              }
            >
              {i < idx ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </div>
            <span className="text-xs font-semibold hidden sm:block" style={{ color: i <= idx ? '#111827' : '#9ca3af' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="flex-1 h-px transition-all duration-500"
              style={{ backgroundColor: i < idx ? '#16a34a' : '#e5e7eb' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Bottom sheet ─────────────────────────────────────────────────────────────
function MerchantSheet({ merchant, onClose }) {
  const [step, setStep] = useState('detail')
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const catStyle = getCategoryColor(merchant.category)

  const repeatFee = Math.round(merchant.promo_price * 0.1)
  const merchantReceives = merchant.promo_price - repeatFee
  const discount = getDiscount(merchant)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl flex flex-col"
        style={{ maxHeight: '93dvh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Step bar */}
        {step !== 'confirmed' && <StepBar current={step} />}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Detalle ── */}
            {step === 'detail' && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Hero */}
                <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
                  <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: merchant.color }} />
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="px-5 pt-4 pb-8">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
                        style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                      >
                        {merchant.category}
                      </span>
                      <h2 className="text-xl font-black text-gray-900 leading-tight">{merchant.name}</h2>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 rounded-xl px-2.5 py-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                      <span className="text-sm font-bold text-gray-900">{merchant.rating}</span>
                      <span className="text-xs text-gray-400">({merchant.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                    <span>{merchant.address}</span>
                  </div>

                  {/* Promo card */}
                  <div className="rounded-2xl overflow-hidden border border-gray-100 mb-5 shadow-sm">
                    <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: catStyle.bg }}>
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: catStyle.text }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: catStyle.text }}>
                        Oferta exclusiva Repeat
                      </span>
                    </div>
                    <div className="px-4 py-4 bg-white">
                      <p className="font-bold text-gray-900 text-base mb-1">{merchant.promo}</p>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{merchant.promo_desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-gray-900">{formatPrice(merchant.promo_price)}</span>
                        <span className="text-sm text-gray-400 line-through">{merchant.promo_original}</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('booking')}
                    className="w-full py-4 rounded-2xl font-black text-base text-black transition-all active:scale-[0.98]"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    Reservar y pagar →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Fecha y hora ── */}
            {step === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.22 }}
              >
                <div className="px-5 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setStep('detail')}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
                      aria-label="Volver"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
                    </button>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Reserva en</p>
                      <h2 className="font-black text-gray-900 text-base">{merchant.name}</h2>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4" style={{ color: merchant.color }} />
                      <p className="text-sm font-bold text-gray-800">Elegí el día</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                      {DATES.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedDate(i)
                            setSelectedSlot(null)
                          }}
                          className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                          style={
                            selectedDate === i
                              ? { backgroundColor: merchant.color, color: '#fff' }
                              : { backgroundColor: '#f3f4f6', color: '#374151' }
                          }
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" style={{ color: merchant.color }} />
                      <p className="text-sm font-bold text-gray-800">Elegí el horario</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {merchant.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className="py-3 rounded-xl text-sm font-semibold transition-all duration-150"
                          style={
                            selectedSlot === slot
                              ? { backgroundColor: merchant.color, color: '#fff' }
                              : { backgroundColor: '#f3f4f6', color: '#374151' }
                          }
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!selectedSlot}
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 rounded-2xl font-black text-base text-black transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    {selectedSlot ? `Continuar · ${DATES[selectedDate]} ${selectedSlot}hs` : 'Elegí un horario'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Checkout ── */}
            {step === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.22 }}
              >
                <div className="px-5 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setStep('booking')}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
                      aria-label="Volver"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
                    </button>
                    <h2 className="font-black text-gray-900 text-base">Confirmá tu reserva</h2>
                  </div>

                  {/* Resumen */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-200">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: merchant.color }}
                      >
                        <span className="text-white font-black text-base">{merchant.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{merchant.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {DATES[selectedDate]} · {selectedSlot}hs
                        </p>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 font-medium">{merchant.promo}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Precio promo</span>
                      <span className="font-bold text-gray-900">{formatPrice(merchant.promo_price)}</span>
                    </div>
                  </div>

                  {/* Split Repeat */}
                  <div className="rounded-2xl border border-gray-200 overflow-hidden mb-4">
                    <div className="px-4 py-3 flex items-center gap-2.5" style={{ backgroundColor: '#0f172a' }}>
                      <img src="/logo.png" alt="Repeat" className="w-5 h-5 rounded-md flex-shrink-0" />
                      <span className="text-xs font-bold text-white">Procesado por Repeat</span>
                    </div>
                    <div className="px-4 py-3 space-y-2 bg-white">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Para {merchant.name} (90%)</span>
                        <span className="font-semibold text-gray-900">{formatPrice(merchantReceives)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fee Repeat (10%)</span>
                        <span className="font-semibold text-gray-400">{formatPrice(repeatFee)}</span>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-black text-gray-900 text-base">{formatPrice(merchant.promo_price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div className="rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3 mb-6 bg-white">
                    <div className="w-10 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-400 mt-0.5">Visa · vence 09/28</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 cursor-pointer">Cambiar</span>
                  </div>

                  <button
                    onClick={() => setStep('confirmed')}
                    className="w-full py-4 rounded-2xl font-black text-base text-black transition-all active:scale-[0.98]"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    Pagar {formatPrice(merchant.promo_price)}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Confirmación ── */}
            {step === 'confirmed' && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-5 pt-4 pb-10 flex flex-col items-center text-center">
                  {/* Check animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    <Check className="w-10 h-10 text-black" strokeWidth={3} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <h2 className="text-2xl font-black text-gray-900 mb-1">¡Reserva confirmada!</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      {merchant.name} · {DATES[selectedDate]} a las {selectedSlot}hs
                    </p>
                  </motion.div>

                  {/* QR mock */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-3xl border-2 border-gray-100 p-5 mb-5 w-full max-w-xs shadow-sm"
                  >
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                      Mostrá este QR al llegar
                    </p>
                    <div className="mx-auto" style={{ width: 156, height: 156 }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=156x156&data=repeat-booking-${merchant.id}-${Date.now()}`}
                        alt="QR de reserva"
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-4 font-mono">#{Math.floor(Math.random() * 90000) + 10000}</p>
                  </motion.div>

                  {/* Split recap */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 mb-6 border border-gray-100"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Pagaste</span>
                      <span className="font-bold text-gray-900">{formatPrice(merchant.promo_price)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{merchant.name} recibe</span>
                      <span>{formatPrice(merchantReceives)}</span>
                    </div>
                  </motion.div>

                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl font-black text-base bg-gray-900 text-white transition-all active:scale-[0.98]"
                  >
                    Volver a la red
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function PublicNetwork() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedMerchant, setSelectedMerchant] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  const countFor = (id) => (id === 'Todos' ? MERCHANTS.length : MERCHANTS.filter((m) => m.category === id).length)

  const filtered = MERCHANTS.filter((m) => {
    const matchCat = activeCategory === 'Todos' || m.category === activeCategory
    const q = searchQuery.trim().toLowerCase()
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.promo.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 60)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: '#f8fafc' }}>
      {/* ── Header ── */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#0f172a' }}>
        {/* Top bar */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
              /* ── Search mode ── */
              <motion.div
                key="search"
                className="flex-1 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div
                  className="flex-1 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar comercios u ofertas…"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                    style={{ minWidth: 0 }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-white/40 hover:text-white/70 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={closeSearch}
                  className="text-white/50 hover:text-white transition-colors text-xs font-semibold flex-shrink-0 ml-1"
                >
                  Cancelar
                </button>
              </motion.div>
            ) : (
              /* ── Default mode ── */
              <motion.div
                key="default"
                className="flex items-center gap-3 flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <img src="/logo.png" alt="Repeat" className="w-9 h-9 rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-white font-black text-lg leading-none tracking-tight">Red Repeat</h1>
                  <p className="text-white/35 text-xs mt-0.5 leading-none">Ofertas exclusivas</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={openSearch}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    aria-label="Buscar"
                  >
                    <Search className="w-4 h-4 text-white/70" />
                  </button>
                  <div
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span className="text-black text-xs font-black">{MERCHANTS.length}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category tabs */}
        <div className="flex overflow-x-auto px-4 pb-0" style={{ scrollbarWidth: 'none', gap: 0 }}>
          {CATEGORIES.map(({ id, label, Icon }) => {
            const active = activeCategory === id
            const count = countFor(id)
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className="relative flex-shrink-0 flex items-center gap-1.5 px-3.5 pb-3 pt-1 text-xs font-bold transition-colors duration-150"
                style={{ color: active ? '#facc15' : 'rgba(255,255,255,0.4)' }}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
                {count > 0 && !active && (
                  <span
                    className="text-[9px] font-bold leading-none rounded-full px-1 py-px"
                    style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
                  >
                    {count}
                  </span>
                )}
                {/* Sliding underline */}
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#facc15' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            )
          })}
        </div>
        {/* Tab bottom border */}
        <div className="h-px mx-0" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">
        {/* Featured strip — only on "Todos" without search */}
        <AnimatePresence>
          {activeCategory === 'Todos' && !searchQuery && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', marginLeft: '-1rem', marginRight: '-1rem' }}
            >
              <FeaturedStrip merchants={MERCHANTS} onSelect={setSelectedMerchant} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section title / search results label */}
        <div className="flex items-center justify-between mb-3">
          <AnimatePresence mode="wait" initial={false}>
            {searchQuery ? (
              <motion.div
                key="search-label"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm font-bold text-gray-900">Resultados para &ldquo;{searchQuery}&rdquo;</span>
              </motion.div>
            ) : (
              <motion.div
                key="cat-label"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {activeCategory !== 'Todos' && (
                  <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#0f172a' }} />
                )}
                <h2 className="text-sm font-bold text-gray-900">
                  {activeCategory === 'Todos' ? 'Todos los comercios' : activeCategory}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-xs text-gray-400 font-medium tabular-nums">{filtered.length} resultados</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((m, i) => (
              <MerchantCard key={m.id} merchant={m} onSelect={setSelectedMerchant} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              {searchQuery ? <Search className="w-6 h-6 text-gray-400" /> : <Tag className="w-6 h-6 text-gray-400" />}
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">{searchQuery ? 'Sin resultados' : 'Sin comercios'}</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              {searchQuery
                ? `No encontramos resultados para "${searchQuery}".`
                : 'No hay comercios en esta categoría todavía.'}
            </p>
            {searchQuery && (
              <button
                onClick={closeSearch}
                className="mt-4 text-xs font-bold px-4 py-2 rounded-full"
                style={{ backgroundColor: '#0f172a', color: '#fff' }}
              >
                Limpiar búsqueda
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Sheet ── */}
      <AnimatePresence>
        {selectedMerchant && (
          <MerchantSheet
            key={selectedMerchant.id}
            merchant={selectedMerchant}
            onClose={() => setSelectedMerchant(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
