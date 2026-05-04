import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  X,
  ChevronRight,
  Star,
  Clock,
  Phone,
  Tag,
  Utensils,
  Scissors,
  Dumbbell,
  Wrench,
  Search,
  MessageCircle,
  Navigation,
  BadgeCheck,
  Zap,
  ChevronDown,
  Instagram,
  Percent,
  CheckCircle,
  Ticket,
  Copy,
  Check,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────
const BUSINESSES = [
  {
    id: 1,
    name: 'Barber Club Palermo',
    category: 'Belleza',
    description:
      'Barbería clásica con un toque moderno. Especializados en cortes de autor y tratamientos capilares para hombres.',
    tags: ['Corte', 'Barba', 'Tratamiento'],
    address: 'Serrano 1450, Palermo',
    distance: '280m',
    hours: { open: true, label: 'Cierra a las 20hs' },
    phone: '+5491134567890',
    instagram: 'barberclubpalermo',
    rating: 4.8,
    reviews: 156,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=400&fit=crop&q=80',
    color: '#1c1917',
    promoted: true,
    promos: [
      {
        id: 'p1',
        title: 'Corte + barba a $9.000',
        original: '$14.000',
        desc: 'Primera visita. Incluye lavado y tratamiento.',
        expiry: '31 may',
      },
    ],
    services: [
      { name: 'Corte clásico', price: '$8.500' },
      { name: 'Corte + barba', price: '$13.000' },
      { name: 'Arreglo de barba', price: '$5.500' },
      { name: 'Tratamiento capilar', price: '$11.000' },
    ],
  },
  {
    id: 2,
    name: 'Spa Alma',
    category: 'Belleza',
    description:
      'Centro de bienestar y relajación. Masajes, tratamientos faciales y terapias holísticas en un espacio de calma total.',
    tags: ['Masajes', 'Facial', 'Aromaterapia'],
    address: 'Arenales 2100, Recoleta',
    distance: '1.2km',
    hours: { open: true, label: 'Cierra a las 19hs' },
    phone: '+5491145678901',
    instagram: 'spaalma.ba',
    rating: 4.7,
    reviews: 67,
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=400&fit=crop&q=80',
    color: '#7c3aed',
    promoted: true,
    promos: [
      {
        id: 'p2',
        title: 'Masaje 60 min a $18.000',
        original: '$26.000',
        desc: 'Masaje relajante de cuerpo completo con aceites esenciales.',
        expiry: '15 jun',
      },
      {
        id: 'p3',
        title: 'Facial + masaje 90 min a $28.000',
        original: '$42.000',
        desc: 'Combo exclusivo para nuevos clientes. Con cita previa.',
        expiry: '15 jun',
      },
    ],
    services: [
      { name: 'Masaje relajante 60min', price: '$22.000' },
      { name: 'Masaje piedras calientes', price: '$28.000' },
      { name: 'Facial hidratante', price: '$18.500' },
      { name: 'Aromaterapia 90min', price: '$32.000' },
    ],
  },
  {
    id: 3,
    name: 'La Rueda',
    category: 'Gastronomía',
    description:
      'Restaurante familiar con más de 20 años en el barrio. Cocina tradicional argentina, amplio salón y estacionamiento.',
    tags: ['Almuerzo', 'Cena', 'Delivery'],
    address: 'Av. Corrientes 1234, CABA',
    distance: '450m',
    hours: { open: true, label: 'Cierra a las 24hs' },
    phone: '+5491156789012',
    instagram: 'larueda.resto',
    rating: 4.8,
    reviews: 124,
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop&q=80',
    color: '#dc2626',
    promoted: false,
    promos: [
      {
        id: 'p4',
        title: 'Menú mediodía a $8.500',
        original: '$12.000',
        desc: 'Entrada + plato + postre + bebida. Lunes a viernes de 12 a 15hs.',
        expiry: 'todos los días',
      },
    ],
    services: [
      { name: 'Menú mediodía', price: '$8.500' },
      { name: 'Parrillada para 2', price: '$34.000' },
      { name: 'Empanadas (6u)', price: '$6.000' },
      { name: 'Milanesa napolitana', price: '$12.500' },
    ],
  },
  {
    id: 4,
    name: 'Misushi',
    category: 'Gastronomía',
    description:
      'El mejor sushi de Palermo. Rolls creativos, sashimi fresco del día y combos para compartir. También hacemos delivery.',
    tags: ['Sushi', 'Japonesa', 'Delivery'],
    address: 'Gurruchaga 1540, Palermo',
    distance: '600m',
    hours: { open: false, label: 'Abre a las 19hs' },
    phone: '+5491167890123',
    instagram: 'misushi.arg',
    rating: 4.9,
    reviews: 210,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&h=400&fit=crop&q=80',
    color: '#0f172a',
    promoted: false,
    promos: [],
    services: [
      { name: 'Combo 20 piezas', price: '$11.000' },
      { name: 'Combo 40 piezas', price: '$20.000' },
      { name: 'Sashimi 12u', price: '$14.000' },
      { name: 'Ramen especial', price: '$9.500' },
    ],
  },
  {
    id: 5,
    name: 'FitZone',
    category: 'Fitness',
    description:
      'Gimnasio equipado con las últimas máquinas, clases grupales, área de pesas libre y personal trainers certificados.',
    tags: ['Musculación', 'Clases', 'Personal trainer'],
    address: 'Av. del Libertador 4500, Palermo',
    distance: '850m',
    hours: { open: true, label: 'Cierra a las 22hs' },
    phone: '+5491178901234',
    instagram: 'fitzone.palermo',
    rating: 4.6,
    reviews: 92,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=400&fit=crop&q=80',
    color: '#0f766e',
    promoted: false,
    promos: [
      {
        id: 'p5',
        title: 'Semana de prueba a $3.000',
        original: '$12.000',
        desc: '7 días de acceso ilimitado + clase de prueba con personal trainer.',
        expiry: '30 jun',
      },
    ],
    services: [
      { name: 'Membresía mensual', price: '$28.000' },
      { name: 'Semana de prueba', price: '$3.000' },
      { name: 'Personal trainer (1hs)', price: '$15.000' },
      { name: 'Clase grupal suelta', price: '$4.500' },
    ],
  },
  {
    id: 6,
    name: 'Leroma Gelato',
    category: 'Gastronomía',
    description:
      'Heladería artesanal. Elaboramos con leche de tambo y frutas de estación. Sin conservantes, sin colorantes artificiales.',
    tags: ['Helados', 'Vegano', 'Sin TACC'],
    address: 'Santa Fe 3200, Palermo',
    distance: '320m',
    hours: { open: true, label: 'Cierra a las 23hs' },
    phone: '+5491189012345',
    instagram: 'leroma.gelato',
    rating: 4.5,
    reviews: 43,
    image_url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&h=400&fit=crop&q=80',
    color: '#111111',
    promoted: false,
    promos: [],
    services: [
      { name: '1/4 kg a elección', price: '$3.500' },
      { name: '1/2 kg a elección', price: '$6.500' },
      { name: 'Box degustación', price: '$8.000' },
      { name: 'Milkshake especial', price: '$5.500' },
    ],
  },
  {
    id: 7,
    name: 'Yoga Studio Zen',
    category: 'Fitness',
    description:
      'Espacio de yoga y meditación para todos los niveles. Clases reducidas para atención personalizada y ambiente tranquilo.',
    tags: ['Yoga', 'Meditación', 'Pilates'],
    address: 'Uriarte 2340, Palermo',
    distance: '700m',
    hours: { open: false, label: 'Abre mañana 8hs' },
    phone: '+5491190123456',
    instagram: 'yogazenpalermo',
    rating: 4.9,
    reviews: 71,
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop&q=80',
    color: '#065f46',
    promoted: false,
    promos: [
      {
        id: 'p6',
        title: '3 clases por $7.500',
        original: '$13.500',
        desc: 'Cualquier estilo a elección. Todos los niveles. Válido 30 días.',
        expiry: '30 jun',
      },
    ],
    services: [
      { name: 'Clase suelta', price: '$4.500' },
      { name: 'Pack 4 clases', price: '$16.000' },
      { name: 'Pack 8 clases', price: '$28.000' },
      { name: 'Retiro de un día', price: '$18.000' },
    ],
  },
  {
    id: 9,
    name: 'AutoSpa Wash',
    category: 'Servicios',
    description:
      'Lavado y detailing profesional de autos. Trabajamos solo con cita previa para garantizar calidad y tiempo de entrega.',
    tags: ['Lavado', 'Detailing', 'Con turno'],
    address: 'Av. Cabildo 2800, Belgrano',
    distance: '2.3km',
    hours: { open: true, label: 'Cierra a las 18hs' },
    phone: '+5491112345678',
    instagram: 'autospawash',
    rating: 4.5,
    reviews: 29,
    image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=400&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&h=400&fit=crop&q=80',
    color: '#1e3a8a',
    promoted: false,
    promos: [],
    services: [
      { name: 'Lavado exterior', price: '$8.000' },
      { name: 'Lavado completo', price: '$14.000' },
      { name: 'Detailing básico', price: '$25.000' },
      { name: 'Detailing full', price: '$45.000' },
    ],
  },
]

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', Icon: Tag },
  { id: 'Gastronomía', label: 'Gastro', Icon: Utensils },
  { id: 'Belleza', label: 'Belleza', Icon: Scissors },
  { id: 'Fitness', label: 'Fitness', Icon: Dumbbell },
  { id: 'Servicios', label: 'Servicios', Icon: Wrench },
]

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

// ─── Business card (horizontal) ───────────────────────────────────────────────
function BusinessCard({ business, onSelect, index }) {
  const catStyle = getCategoryColor(business.category)

  return (
    <motion.button
      onClick={() => onSelect(business)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      layout
      className="w-full text-left bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer flex gap-0"
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
        <img src={business.image_url} alt={business.name} className="w-full h-full object-cover" loading="lazy" />
        {business.promoted && (
          <div className="absolute top-1.5 left-1.5 bg-yellow-400 rounded-md px-1 py-0.5">
            <Zap className="w-2.5 h-2.5 text-black" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 px-3 py-2.5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">{business.name}</p>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-xs font-bold text-gray-700">{business.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
            >
              {business.category}
            </span>
            <span className="text-[10px] text-gray-400">·</span>
            <span className="text-[10px] text-gray-400">{business.distance}</span>
          </div>

          {/* Tags */}
          <div className="flex gap-1 flex-wrap">
            {business.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] text-gray-500 bg-gray-100 rounded-md px-1.5 py-0.5 leading-none">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-1 mt-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: business.hours.open ? '#16a34a' : '#9ca3af' }}
          />
          <span className="text-[10px] font-medium" style={{ color: business.hours.open ? '#16a34a' : '#9ca3af' }}>
            {business.hours.open ? 'Abierto' : 'Cerrado'}
          </span>
          <span className="text-[10px] text-gray-400">· {business.hours.label}</span>
        </div>

        {/* Promo badge */}
        {business.promos?.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-md px-1.5 py-0.5">
              <Percent className="w-2.5 h-2.5 text-orange-500" />
              <span className="text-[10px] font-bold text-orange-600">
                {business.promos.length === 1 ? '1 promo activa' : `${business.promos.length} promos activas`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center pr-3 flex-shrink-0">
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </motion.button>
  )
}

// ─── Promoted strip ───────────────────────────────────────────────────────────
function PromotedStrip({ businesses, onSelect }) {
  const promoted = businesses.filter((b) => b.promoted)
  if (!promoted.length) return null

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 px-4 mb-2.5">
        <Zap className="w-3 h-3 text-yellow-500" fill="currentColor" />
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Promocionados</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
        {promoted.map((b, i) => {
          const catStyle = getCategoryColor(b.category)
          return (
            <motion.button
              key={b.id}
              onClick={() => onSelect(b)}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.25 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all text-left cursor-pointer"
              style={{ width: 200 }}
            >
              <div className="relative" style={{ height: 110 }}>
                <img src={b.cover_url} alt={b.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-black" fill="currentColor" />
                  <span className="text-black text-[10px] font-black">Destacado</span>
                </div>
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-white font-black text-sm leading-tight line-clamp-1">{b.name}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: b.color }} />
              </div>
              <div className="px-3 py-2.5 flex items-center justify-between">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                  >
                    {b.category}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: b.hours.open ? '#16a34a' : '#9ca3af' }}
                    />
                    <span className="text-[10px] text-gray-400">{b.hours.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-bold text-gray-700">{b.rating}</span>
                </div>
              </div>
            </motion.button>
          )
        })}

        {/* CTA card: "Promocioná tu negocio" */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: promoted.length * 0.08, duration: 0.25 }}
          className="flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-gray-300 transition-colors"
          style={{ width: 160 }}
        >
          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-xs font-bold text-gray-800 leading-snug mb-0.5">¿Tenés un negocio?</p>
          <p className="text-[10px] text-gray-400 leading-snug">Mostralo en la red</p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Business detail sheet ────────────────────────────────────────────────────
function BusinessSheet({ business, onClose }) {
  const [servicesExpanded, setServicesExpanded] = useState(false)
  const catStyle = getCategoryColor(business.category)
  const visibleServices = servicesExpanded ? business.services : business.services.slice(0, 3)

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl flex flex-col"
        style={{ maxHeight: '92dvh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Cover */}
          <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
            <img src={business.cover_url} alt={business.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: business.color }} />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {business.promoted && (
              <div className="absolute top-3 left-3 bg-yellow-400 rounded-full px-2.5 py-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-black" fill="currentColor" />
                <span className="text-black text-[10px] font-black">Destacado</span>
              </div>
            )}
          </div>

          <div className="px-5 pt-4 pb-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                  >
                    {business.category}
                  </span>
                  {business.promoted && <BadgeCheck className="w-4 h-4 text-yellow-500" fill="#fef9c3" />}
                </div>
                <h2 className="text-xl font-black text-gray-900 leading-tight">{business.name}</h2>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-2.5 py-1.5 flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                <span className="text-sm font-bold text-gray-900">{business.rating}</span>
                <span className="text-xs text-gray-400">({business.reviews})</span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs">{business.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">{business.distance}</span>
              </div>
            </div>

            {/* Hours */}
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-4"
              style={{ backgroundColor: business.hours.open ? '#f0fdf4' : '#f9fafb' }}
            >
              <Clock
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: business.hours.open ? '#16a34a' : '#9ca3af' }}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: business.hours.open ? '#15803d' : '#6b7280' }}>
                  {business.hours.open ? 'Abierto ahora' : 'Cerrado ahora'}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">{business.hours.label}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{business.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {business.tags.map((t) => (
                <span key={t} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            {/* Promos */}
            {business.promos?.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-3.5 h-3.5 text-orange-500" />
                  <h3 className="text-sm font-bold text-gray-900">Promociones activas</h3>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">
                    {business.promos.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {business.promos.map((promo) => {
                    const orig = parseInt(promo.original.replace(/\D/g, ''))
                    const curr = parseInt(
                      promo.title
                        .match(/[\d.]+/g)
                        ?.join('')
                        .replace('.', '') ?? orig,
                    )
                    const disc = orig > 0 ? Math.round((1 - curr / orig) * 100) : 0
                    return (
                      <div key={promo.id} className="rounded-2xl overflow-hidden border border-orange-100">
                        <div
                          className="px-4 py-2.5 flex items-center justify-between"
                          style={{ backgroundColor: '#fff7ed' }}
                        >
                          <div className="flex items-center gap-2">
                            <Percent className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                            <span className="text-xs font-black text-orange-700">{promo.title}</span>
                          </div>
                          {disc > 0 && (
                            <span className="text-[10px] font-black text-white bg-orange-500 px-2 py-0.5 rounded-full flex-shrink-0">
                              -{disc}%
                            </span>
                          )}
                        </div>
                        <div className="px-4 py-3 bg-white flex items-end justify-between gap-3">
                          <p className="text-xs text-gray-500 leading-relaxed flex-1">{promo.desc}</p>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[10px] text-gray-400 line-through">{promo.original}</p>
                            <p className="text-[10px] text-gray-400">Vence: {promo.expiry}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Services */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Servicios y precios</h3>
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <AnimatePresence initial={false}>
                  {visibleServices.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0"
                      style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}
                    >
                      <span className="text-sm text-gray-700">{s.name}</span>
                      <span className="text-sm font-bold text-gray-900">{s.price}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {business.services.length > 3 && (
                  <button
                    onClick={() => setServicesExpanded((e) => !e)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    style={{ backgroundColor: '#f9fafb' }}
                  >
                    {servicesExpanded ? 'Ver menos' : `Ver ${business.services.length - 3} más`}
                    <motion.div animate={{ rotate: servicesExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </button>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <a
                href={`https://wa.me/${business.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-black transition-all active:scale-[0.98]"
                style={{ backgroundColor: '#facc15' }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`tel:${business.phone}`}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Phone className="w-4 h-4" />
                Llamar
              </a>
            </div>

            {/* Instagram */}
            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />@{business.instagram}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ─── Promote your business banner ─────────────────────────────────────────────
function PromoteBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="mx-0 mt-6 rounded-2xl overflow-hidden border border-yellow-200"
      style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)' }}
    >
      <div className="px-4 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Zap className="w-5 h-5 text-black" fill="currentColor" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-900 leading-tight">¿Tenés un negocio?</p>
          <p className="text-xs text-gray-600 mt-0.5 leading-snug">
            Sumalo a la red y llegá a miles de clientes cerca tuyo.
          </p>
        </div>
        <button className="flex-shrink-0 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-colors px-3 py-2 rounded-xl">
          Sumarme
        </button>
      </div>
    </motion.div>
  )
}

// ─── Voucher sheet ────────────────────────────────────────────────────────────
function VoucherSheet({ business, promo, disc, onClose }) {
  const [copied, setCopied] = useState(false)
  const code = promo.id.toUpperCase().padEnd(8, '0').slice(0, 8)

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
      >
        <div className="flex justify-center pt-3 pb-0">
          <div className="w-9 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header strip */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 110 }}>
          <img src={business.cover_url} alt={business.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: business.color }} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-black text-base leading-tight">{business.name}</p>
            <p className="text-white/60 text-xs">{business.address}</p>
          </div>
        </div>

        <div className="px-5 pt-5 pb-8">
          {/* Promo detail */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Descuento exclusivo</p>
              <p className="text-lg font-black text-gray-900 leading-snug">{promo.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{promo.desc}</p>
            </div>
            {disc > 0 && (
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-orange-500 flex flex-col items-center justify-center">
                <span className="text-white text-lg font-black leading-none">-{disc}%</span>
              </div>
            )}
          </div>

          {/* Voucher code */}
          <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 px-4 py-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                  Código de descuento
                </span>
              </div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-100 px-2 py-0.5 rounded-full">
                1 uso · válido hasta {promo.expiry}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-gray-900 tracking-widest">{code}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{ backgroundColor: copied ? '#dcfce7' : '#fff7ed', color: copied ? '#15803d' : '#ea580c' }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Single-use notice */}
          <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-3.5 py-3 mb-5">
            <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Este descuento es exclusivo para miembros de Red Repeat.{' '}
              <span className="font-bold text-gray-700">Válido para 1 canje por usuario.</span> Mostrá el código al
              cajero antes de pagar.
            </p>
          </div>

          {/* CTA */}
          <a
            href={`https://wa.me/${business.phone.replace(/\D/g, '')}?text=Hola%2C%20quiero%20usar%20el%20descuento%20${code}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-sm text-black transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#facc15' }}
          >
            <MessageCircle className="w-4 h-4" />
            Avisar al negocio por WhatsApp
          </a>
        </div>
      </motion.div>
    </>
  )
}

// ─── Promo card (feed) ───────────────────────────────────────────────────────
function PromoCard({ business, promo, claimed, onClaim, onSelect, index }) {
  const catStyle = getCategoryColor(business.category)
  const orig = parseInt(promo.original.replace(/\D/g, ''))
  const curr = parseInt(promo.title.match(/\d[\d.]*$/)?.[0]?.replace('.', '') ?? orig)
  const disc = orig > 0 && curr < orig ? Math.round((1 - curr / orig) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      layout
      className="bg-white rounded-2xl overflow-hidden border transition-all duration-200"
      style={{ borderColor: claimed ? '#bbf7d0' : '#f3f4f6' }}
    >
      {/* Business image strip */}
      <button onClick={() => onSelect(business)} className="relative w-full block" style={{ height: 110 }}>
        <img src={business.cover_url} alt={business.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: business.color }} />

        {claimed ? (
          <div className="absolute top-2.5 left-2.5 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" />
            Reclamado
          </div>
        ) : disc > 0 ? (
          <div className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
            -{disc}%
          </div>
        ) : null}

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
            >
              {business.category}
            </span>
            <span className="text-white text-[11px] font-bold truncate">{business.name}</span>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span className="text-white text-xs font-bold">{business.rating}</span>
          </div>
        </div>
      </button>

      {/* Promo info */}
      <div className="px-3.5 pt-3 pb-3.5">
        <p className="font-black text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{promo.title}</p>

        <div className="flex items-center gap-1.5 mb-3">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: business.hours.open ? '#16a34a' : '#9ca3af' }}
          />
          <span className="text-[11px] font-medium" style={{ color: business.hours.open ? '#16a34a' : '#9ca3af' }}>
            {business.hours.open ? 'Abierto' : 'Cerrado'}
          </span>
          <span className="text-gray-300 text-[10px]">·</span>
          <span className="text-[11px] text-gray-400">{business.distance}</span>
        </div>

        {/* Claim button */}
        {claimed ? (
          <button
            onClick={() => onClaim(business, promo, disc)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Ver mi código
          </button>
        ) : (
          <button
            onClick={() => onClaim(business, promo, disc)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#0f172a', color: '#fff' }}
          >
            <Ticket className="w-3.5 h-3.5" />
            Reclamar descuento
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function PublicNetwork() {
  const [mainTab, setMainTab] = useState('promos') // 'promos' | 'negocios'
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [claimedPromos, setClaimedPromos] = useState(new Set())
  const [activeVoucher, setActiveVoucher] = useState(null) // { business, promo, disc }
  const searchRef = useRef(null)

  // Flat list of all promos with business attached
  const allPromos = BUSINESSES.flatMap((b) => b.promos.map((p) => ({ business: b, promo: p })))

  const filteredPromos = allPromos.filter(({ business, promo }) => {
    const matchCat = activeCategory === 'Todos' || business.category === activeCategory
    const q = searchQuery.trim().toLowerCase()
    const matchQ =
      !q ||
      business.name.toLowerCase().includes(q) ||
      promo.title.toLowerCase().includes(q) ||
      promo.desc.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  const filteredBusinesses = BUSINESSES.filter((b) => {
    const matchCat = activeCategory === 'Todos' || b.category === activeCategory
    const q = searchQuery.trim().toLowerCase()
    const matchQ = !q || b.name.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q))
    return matchCat && matchQ
  })

  const countFor = (id) => {
    if (mainTab === 'promos') {
      return id === 'Todos' ? allPromos.length : allPromos.filter(({ business }) => business.category === id).length
    }
    return id === 'Todos' ? BUSINESSES.length : BUSINESSES.filter((b) => b.category === id).length
  }

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 60)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  const switchTab = (tab) => {
    setMainTab(tab)
    setActiveCategory('Todos')
    closeSearch()
  }

  const handleClaim = (business, promo, disc) => {
    setClaimedPromos((prev) => new Set([...prev, promo.id]))
    setActiveVoucher({ business, promo, disc })
  }

  const resultCount = mainTab === 'promos' ? filteredPromos.length : filteredBusinesses.length
  const resultLabel = mainTab === 'promos' ? 'promos' : 'negocios'

  return (
    <div className="min-h-dvh" style={{ backgroundColor: '#f8fafc' }}>
      {/* ── Header ── */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: '#0f172a' }}>
        {/* Top bar */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
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
                    placeholder={mainTab === 'promos' ? 'Buscá una promo…' : 'Buscá un negocio…'}
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
                  <div className="flex items-center gap-1 mt-0.5">
                    <Navigation className="w-2.5 h-2.5 text-white/40" />
                    <p className="text-white/35 text-xs leading-none">Palermo, Buenos Aires</p>
                  </div>
                </div>
                <button
                  onClick={openSearch}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4 text-white/70" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main tabs: Promos | Negocios */}
        <div className="px-4 pb-3">
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
            {[
              { id: 'promos', label: 'Promos', Icon: Percent },
              { id: 'negocios', label: 'Negocios', Icon: Tag },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className="relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors duration-150"
                style={{ color: mainTab === id ? '#000' : 'rgba(255,255,255,0.4)' }}
              >
                {mainTab === id && (
                  <motion.div
                    layoutId="main-tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: '#facc15' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon className="w-3 h-3 relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
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
                {!active && count > 0 && (
                  <span
                    className="text-[9px] font-bold leading-none rounded-full px-1 py-px"
                    style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
                  >
                    {count}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="cat-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#facc15' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            )
          })}
        </div>
        <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-10">
        <AnimatePresence mode="wait" initial={false}>
          {/* ── PROMOS tab ── */}
          {mainTab === 'promos' && (
            <motion.div
              key="promos"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">
                  {searchQuery
                    ? `"${searchQuery}"`
                    : activeCategory === 'Todos'
                      ? 'Ofertas cerca tuyo'
                      : activeCategory}
                </h2>
                <span className="text-xs text-gray-400 font-medium tabular-nums">
                  {resultCount} {resultLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredPromos.map(({ business, promo }, i) => (
                    <PromoCard
                      key={promo.id}
                      business={business}
                      promo={promo}
                      claimed={claimedPromos.has(promo.id)}
                      onClaim={handleClaim}
                      onSelect={setSelectedBusiness}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {filteredPromos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <Percent className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Sin promos</p>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    {searchQuery ? `Sin resultados para "${searchQuery}".` : 'No hay promos en esta categoría.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={closeSearch}
                      className="mt-4 text-xs font-bold px-4 py-2 rounded-full text-white"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </motion.div>
              )}

              {!searchQuery && <PromoteBanner />}
            </motion.div>
          )}

          {/* ── NEGOCIOS tab ── */}
          {mainTab === 'negocios' && (
            <motion.div
              key="negocios"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
            >
              {/* Promoted strip */}
              {activeCategory === 'Todos' && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ overflow: 'hidden', marginLeft: '-1rem', marginRight: '-1rem' }}
                >
                  <PromotedStrip businesses={BUSINESSES} onSelect={setSelectedBusiness} />
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">
                  {searchQuery ? `"${searchQuery}"` : activeCategory === 'Todos' ? 'Cerca tuyo' : activeCategory}
                </h2>
                <span className="text-xs text-gray-400 font-medium tabular-nums">
                  {resultCount} {resultLabel}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <AnimatePresence mode="popLayout">
                  {filteredBusinesses.map((b, i) => (
                    <BusinessCard key={b.id} business={b} onSelect={setSelectedBusiness} index={i} />
                  ))}
                </AnimatePresence>
              </div>

              {filteredBusinesses.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Sin resultados</p>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    {searchQuery ? `Sin negocios para "${searchQuery}".` : 'No hay negocios en esta categoría.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={closeSearch}
                      className="mt-4 text-xs font-bold px-4 py-2 rounded-full text-white"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </motion.div>
              )}

              {!searchQuery && <PromoteBanner />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Business sheet ── */}
      <AnimatePresence>
        {selectedBusiness && (
          <BusinessSheet
            key={selectedBusiness.id}
            business={selectedBusiness}
            onClose={() => setSelectedBusiness(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Voucher sheet ── */}
      <AnimatePresence>
        {activeVoucher && (
          <VoucherSheet
            key={activeVoucher.promo.id}
            business={activeVoucher.business}
            promo={activeVoucher.promo}
            disc={activeVoucher.disc}
            onClose={() => setActiveVoucher(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
