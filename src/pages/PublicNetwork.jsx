import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, Sparkles, Store, ChevronRight, Check, Calendar, Clock } from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MERCHANTS = [
  {
    id: 1,
    name: 'La Rueda',
    category: 'Gastronomía',
    promo: 'Menú de mediodía a $8.500',
    promo_original: '$12.000',
    promo_price: 8500,
    promo_desc: 'Entrada + plato principal + postre + bebida. De lunes a viernes de 12 a 15hs.',
    color: '#dc2626',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
    address: 'Av. Corrientes 1234, CABA',
    slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
  },
  {
    id: 2,
    name: 'El Grano Café',
    category: 'Gastronomía',
    promo: 'Brunch completo a $6.000',
    promo_original: '$9.500',
    promo_price: 6000,
    promo_desc: 'Tostadas, huevos revueltos, jugo y café. Sábados y domingos de 9 a 13hs.',
    color: '#92400e',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&q=80',
    address: 'Thames 880, Palermo',
    slots: ['09:00', '09:30', '10:00', '10:30', '11:00'],
  },
  {
    id: 3,
    name: 'Misushi',
    category: 'Gastronomía',
    promo: 'Combo 20 piezas a $11.000',
    promo_original: '$16.000',
    promo_price: 11000,
    promo_desc: '20 piezas a elección + edamame + 2 bebidas. Válido cualquier día.',
    color: '#0f172a',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop&q=80',
    address: 'Gurruchaga 1540, Palermo',
    slots: ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
  },
  {
    id: 4,
    name: 'Spa Alma',
    category: 'Belleza',
    promo: 'Masaje 60 min a $18.000',
    promo_original: '$26.000',
    promo_price: 18000,
    promo_desc: 'Masaje relajante de cuerpo completo con aceites esenciales. Primera visita.',
    color: '#7c3aed',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&q=80',
    address: 'Arenales 2100, Recoleta',
    slots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
  },
  {
    id: 5,
    name: 'Leroma Gelato',
    category: 'Gastronomía',
    promo: 'Box degustación a $5.000',
    promo_original: '$8.000',
    promo_price: 5000,
    promo_desc: '500g de helado artesanal en 4 sabores a elección + cucurucho de regalo.',
    color: '#111111',
    image_url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop&q=80',
    address: 'Santa Fe 3200, Palermo',
    slots: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  },
  {
    id: 6,
    name: 'Barber Club',
    category: 'Belleza',
    promo: 'Corte + barba a $9.000',
    promo_original: '$14.000',
    promo_price: 9000,
    promo_desc: 'Corte de autor + arreglo de barba + lavado con tratamiento. Primera visita.',
    color: '#1c1917',
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop&q=80',
    address: 'Serrano 1450, Palermo',
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  },
  {
    id: 7,
    name: 'Urbana Store',
    category: 'Indumentaria',
    promo: 'Remera + jean a $22.000',
    promo_original: '$34.000',
    promo_price: 22000,
    promo_desc: 'Combo remera premium + jean slim de temporada. Tallas S a XL disponibles.',
    color: '#1d4ed8',
    image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop&q=80',
    address: 'Honduras 5200, Palermo',
    slots: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00'],
  },
  {
    id: 8,
    name: 'FitZone',
    category: 'Fitness',
    promo: 'Semana de prueba a $3.000',
    promo_original: '$12.000',
    promo_price: 3000,
    promo_desc: '7 días de acceso ilimitado al gimnasio + una clase de prueba con personal trainer.',
    color: '#0f766e',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&q=80',
    address: 'Av. del Libertador 4500, Palermo',
    slots: ['07:00', '08:00', '09:00', '17:00', '18:00', '19:00'],
  },
  {
    id: 9,
    name: 'Yoga Studio Zen',
    category: 'Fitness',
    promo: '3 clases a $7.500',
    promo_original: '$13.500',
    promo_price: 7500,
    promo_desc: '3 clases de yoga a elección de estilo. Todos los niveles. Válido 30 días.',
    color: '#065f46',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80',
    address: 'Uriarte 2340, Palermo',
    slots: ['08:00', '09:00', '10:00', '18:00', '19:00', '20:00'],
  },
  {
    id: 10,
    name: 'AutoSpa Wash',
    category: 'Servicios',
    promo: 'Detailing completo a $25.000',
    promo_original: '$40.000',
    promo_price: 25000,
    promo_desc: 'Lavado interior + exterior + encerado + limpieza de tapizados. Solo con turno.',
    color: '#1e3a8a',
    image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop&q=80',
    address: 'Av. Cabildo 2800, Belgrano',
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
  },
  {
    id: 11,
    name: 'Centro Relax',
    category: 'Servicios',
    promo: 'Masaje 90 min a $22.000',
    promo_original: '$35.000',
    promo_price: 22000,
    promo_desc: 'Masaje descontracturante + piedras calientes + aromaterapia. Primera visita.',
    color: '#4c1d95',
    image_url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=300&fit=crop&q=80',
    address: 'Av. Santa Fe 1800, Recoleta',
    slots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
  },
  {
    id: 12,
    name: 'Zapatería Roots',
    category: 'Indumentaria',
    promo: 'Zapatillas de temporada a $35.000',
    promo_original: '$52.000',
    promo_price: 35000,
    promo_desc: 'Modelos seleccionados de la nueva colección con descuento exclusivo Repeat.',
    color: '#854d0e',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80',
    address: 'Florida 456, Centro',
    slots: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00'],
  },
]

const CATEGORIES = ['Todos', 'Gastronomía', 'Belleza', 'Indumentaria', 'Fitness', 'Servicios']

const DATES = ['Hoy', 'Mañana', 'Mié 7', 'Jue 8', 'Vie 9', 'Sáb 10']

function getCategoryStyle(category) {
  const map = {
    Gastronomía: { bg: '#fef9c3', text: '#854d0e' },
    Belleza: { bg: '#fae8ff', text: '#7e22ce' },
    Indumentaria: { bg: '#dbeafe', text: '#1e40af' },
    Fitness: { bg: '#d1fae5', text: '#065f46' },
    Servicios: { bg: '#e0e7ff', text: '#3730a3' },
  }
  return map[category] || { bg: '#f3f4f6', text: '#374151' }
}

function formatPrice(n) {
  return '$' + n.toLocaleString('es-AR')
}

// ─── Merchant card ────────────────────────────────────────────────────────────
function MerchantCard({ merchant, onSelect }) {
  const discount = Math.round((1 - merchant.promo_price / parseInt(merchant.promo_original.replace(/\D/g, ''))) * 100)

  return (
    <motion.button
      onClick={() => onSelect(merchant)}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="relative" style={{ aspectRatio: '4/3' }}>
        <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Discount badge */}
        <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
          -{discount}%
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: merchant.color }} />
      </div>
      <div className="p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{merchant.category}</span>
        <p className="font-bold text-gray-900 text-sm leading-tight mt-0.5 mb-2">{merchant.name}</p>
        <p className="text-xs text-gray-600 leading-snug line-clamp-1 mb-2">{merchant.promo}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-black text-gray-900">{formatPrice(merchant.promo_price)}</span>
          <span className="text-xs text-gray-400 line-through">{merchant.promo_original}</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold" style={{ color: merchant.color }}>
          <span>Reservar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.button>
  )
}

// ─── Bottom sheet con flujo completo ─────────────────────────────────────────
function MerchantSheet({ merchant, onClose }) {
  const [step, setStep] = useState('detail') // 'detail' | 'booking' | 'checkout' | 'confirmed'
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const style = getCategoryStyle(merchant.category)

  const repeatFee = Math.round(merchant.promo_price * 0.1)
  const merchantReceives = merchant.promo_price - repeatFee

  const handlePay = () => setStep('confirmed')

  return (
    <>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        key="sheet"
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl overflow-hidden"
        style={{ maxHeight: '92vh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 40 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 24px)' }}>
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Detalle + promo ── */}
            {step === 'detail' && (
              <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Hero */}
                <div className="relative mx-4 mt-2 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
                  <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: merchant.color }} />
                  <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="px-5 pt-4 pb-8">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {merchant.category}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 mt-0.5">{merchant.name}</h2>
                    </div>
                    <div
                      className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md"
                      style={{ backgroundColor: merchant.color }}
                    >
                      <Store className="w-5 h-5 text-white/90" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    {merchant.address}
                  </div>

                  {/* Promo box */}
                  <div className="rounded-2xl overflow-hidden mb-5 border border-gray-100">
                    <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: style.bg }}>
                      <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: style.text }} />
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: style.text }}>
                        Oferta exclusiva Repeat
                      </span>
                    </div>
                    <div className="px-4 py-4 bg-white">
                      <p className="font-bold text-gray-900 text-base mb-1">{merchant.promo}</p>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">{merchant.promo_desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-gray-900">{formatPrice(merchant.promo_price)}</span>
                        <span className="text-sm text-gray-400 line-through">{merchant.promo_original}</span>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                          {Math.round(
                            (1 - merchant.promo_price / parseInt(merchant.promo_original.replace(/\D/g, ''))) * 100,
                          )}
                          % OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('booking')}
                    className="w-full py-4 rounded-2xl font-bold text-base text-black transition-opacity active:opacity-80"
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
              >
                <div className="px-5 pt-4 pb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <button
                      onClick={() => setStep('detail')}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
                    </button>
                    <div>
                      <p className="text-xs text-gray-400">Reserva en</p>
                      <h2 className="font-bold text-gray-900">{merchant.name}</h2>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-700">Elegí el día</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                      {DATES.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedDate(i)
                            setSelectedSlot(null)
                          }}
                          className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
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
                      <Clock className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-700">Elegí el horario</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {merchant.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className="py-2.5 rounded-xl text-sm font-semibold transition-all"
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
                    className="w-full py-4 rounded-2xl font-bold text-base text-black transition-opacity disabled:opacity-40"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    Continuar al pago →
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
              >
                <div className="px-5 pt-4 pb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <button
                      onClick={() => setStep('booking')}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
                    </button>
                    <h2 className="font-bold text-gray-900">Confirmá tu reserva</h2>
                  </div>

                  {/* Resumen */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: merchant.color }}
                      >
                        <Store className="w-5 h-5 text-white/90" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{merchant.name}</p>
                        <p className="text-xs text-gray-500">
                          {DATES[selectedDate]} · {selectedSlot}hs
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{merchant.promo}</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total de la promo</span>
                        <span className="font-semibold text-gray-900">{formatPrice(merchant.promo_price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Split Repeat */}
                  <div className="rounded-2xl border border-gray-200 overflow-hidden mb-5">
                    <div className="px-4 py-3 bg-gray-900 flex items-center gap-2">
                      <img src="/logo.png" alt="Repeat" className="w-5 h-5 rounded-md" />
                      <span className="text-xs font-bold text-white">Procesado por Repeat</span>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Para {merchant.name} (90%)</span>
                        <span className="font-semibold text-gray-900">{formatPrice(merchantReceives)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fee Repeat (10%)</span>
                        <span className="font-semibold text-gray-500">{formatPrice(repeatFee)}</span>
                      </div>
                      <div className="h-px bg-gray-100 my-1" />
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total a pagar</span>
                        <span className="font-black text-gray-900 text-base">{formatPrice(merchant.promo_price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card mock */}
                  <div className="rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3 mb-6">
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-400">Visa · vence 09/28</p>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold">Cambiar</span>
                  </div>

                  <button
                    onClick={handlePay}
                    className="w-full py-4 rounded-2xl font-bold text-base text-black transition-opacity active:opacity-80"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="px-5 pt-6 pb-10 flex flex-col items-center text-center">
                  {/* Check */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{ backgroundColor: '#facc15' }}
                  >
                    <Check className="w-10 h-10 text-black" strokeWidth={3} />
                  </motion.div>

                  <h2 className="text-2xl font-black text-gray-900 mb-1">¡Reserva confirmada!</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {merchant.name} · {DATES[selectedDate]} a las {selectedSlot}hs
                  </p>

                  {/* QR mock */}
                  <div className="bg-white rounded-3xl border-2 border-gray-200 p-5 mb-6 w-full max-w-xs">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Mostrá este QR al llegar
                    </p>
                    <div className="mx-auto" style={{ width: 160, height: 160 }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=repeat-booking-${merchant.id}-${Date.now()}`}
                        alt="QR de reserva"
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-4">Reserva #{Math.floor(Math.random() * 90000) + 10000}</p>
                  </div>

                  {/* Split recap */}
                  <div className="w-full bg-gray-50 rounded-2xl px-4 py-3 mb-6 text-sm">
                    <div className="flex justify-between text-gray-500 mb-1">
                      <span>Pagaste</span>
                      <span className="font-semibold text-gray-900">{formatPrice(merchant.promo_price)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>{merchant.name} recibe</span>
                      <span>{formatPrice(merchantReceives)}</span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl font-bold text-base bg-gray-900 text-white transition-opacity active:opacity-80"
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

  const filtered = activeCategory === 'Todos' ? MERCHANTS : MERCHANTS.filter((m) => m.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <div className="sticky top-0 z-10" style={{ background: '#0f172a' }}>
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-3">
          <img src="/logo.png" alt="Repeat" className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div>
            <h1 className="text-white font-black text-lg leading-none">Red Repeat</h1>
            <p className="text-white/40 text-xs mt-0.5">Ofertas exclusivas para miembros</p>
          </div>
          <div className="ml-auto bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">
            {MERCHANTS.length} comercios
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                activeCategory === cat
                  ? { backgroundColor: '#facc15', color: '#000' }
                  : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-5">
        {activeCategory !== 'Todos' && (
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-semibold text-gray-900">{filtered.length}</span> ofertas en {activeCategory}
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((m) => (
              <MerchantCard key={m.id} merchant={m} onSelect={setSelectedMerchant} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Sheet */}
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
