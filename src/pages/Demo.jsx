import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Package,
  ArrowRightLeft,
  Star,
  Newspaper,
  ShieldCheck,
  Tag,
  Megaphone,
  Calendar,
  Trash2,
  Plus,
  ExternalLink,
  Eye,
  Edit,
  Share2,
  TrendingUp,
  QrCode,
  ChevronDown,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ACCENT = '#FBBF24'
const POINTS_COLOR = '#2563EB'

// ─── Laptop frame ─────────────────────────────────────────────────────────────
function LaptopFrame({ children, url = 'repeat.la/createclub' }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Browser chrome */}
      <div className="bg-gray-200 rounded-t-xl px-4 pt-3 pb-2 flex items-center gap-2 border border-b-0 border-gray-300">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center border border-gray-300">
          {url}
        </div>
      </div>
      {/* Screen */}
      <div
        className="bg-white border border-gray-300 rounded-b-xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '68vh', overflowY: 'auto' }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Pantalla 1: CreateClub — Catálogo ────────────────────────────────────────
function CreateClubCatalogScreen() {
  const items = [
    {
      id: 1,
      name: 'Café espresso',
      pts: 50,
      img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=80&h=80&fit=crop',
    },
    {
      id: 2,
      name: 'Medialunas x3',
      pts: 30,
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop',
    },
    {
      id: 3,
      name: 'Tostado mixto',
      pts: 80,
      img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop',
    },
  ]
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-100 p-4 flex-shrink-0 hidden lg:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
            <span className="text-xs font-black text-black">R</span>
          </div>
          <span className="font-bold text-gray-900">Repeat</span>
        </div>
        {['Inicio', 'Dashboard', 'Mis Programas', 'Clientes', 'Tiendas', 'Equipo'].map((item, i) => (
          <div
            key={item}
            className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 2 ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-500'}`}
          >
            {item}
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear nuevo programa</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              {/* Tipo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tipo de programa</label>
                <div className="h-10 border border-gray-200 rounded-lg px-3 flex items-center justify-between bg-white text-sm">
                  <span className="font-medium text-gray-900">Puntos</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nombre del programa</label>
                <div className="h-10 border border-gray-200 rounded-lg px-3 flex items-center text-sm text-gray-700 bg-white">
                  Club Café Bonafide
                </div>
              </div>
              {/* Acumulación */}
              <div className="border-t pt-5 space-y-3">
                <p className="font-semibold text-gray-900">Configuración de puntos</p>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Acumulación</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 flex-1 border border-gray-200 rounded-lg px-3 flex items-center text-sm text-gray-700">
                      $1.000
                    </div>
                    <span className="text-sm text-gray-500">=</span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">1 punto</span>
                  </div>
                </div>
                {/* Modo de canje */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Modo de canje</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 p-3 rounded-xl border-2 border-gray-200 text-left opacity-60">
                      <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Conversión directa</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 rounded-xl border-2 border-blue-400 bg-blue-50 text-left">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-gray-800">Catálogo</span>
                    </div>
                  </div>
                </div>
                {/* Catálogo */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Ítems del catálogo</p>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
                    >
                      <img
                        src={item.img}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        crossOrigin="anonymous"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs font-semibold text-blue-600">{item.pts} pts</p>
                      </div>
                      <Trash2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </div>
                  ))}
                  <div className="flex items-center gap-2 h-9 border border-dashed border-gray-300 rounded-xl px-3 text-xs text-gray-400">
                    <Plus className="w-3.5 h-3.5" /> Agregar ítem...
                  </div>
                </div>
              </div>
              <button className="w-full h-12 rounded-xl bg-yellow-400 text-black font-bold text-sm">
                Crear programa
              </button>
            </div>
            {/* Preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-64 rounded-3xl overflow-hidden shadow-xl border-8 border-gray-900 bg-gray-900">
                <div className="bg-blue-600 p-5 text-white">
                  <p className="text-xs opacity-70 mb-1">Club Café Bonafide</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-60">Tus puntos</p>
                      <p className="text-4xl font-black">120</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 bg-white/10 rounded-xl p-2 text-xs">
                    <span className="opacity-70">Acumulás</span> $1.000 = 1 pt
                  </div>
                </div>
                <div className="bg-gray-900 p-3 space-y-2">
                  <p className="text-xs text-gray-400 font-medium px-1">Canjeá tus puntos</p>
                  {items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-800 rounded-xl p-2">
                      <img src={item.img} className="w-8 h-8 rounded-lg object-cover" crossOrigin="anonymous" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{item.name}</p>
                        <p className="text-xs text-blue-400 font-bold">{item.pts} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pantalla 2: CreateClub — Conversión directa ──────────────────────────────
function CreateClubDirectScreen() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-56 bg-white border-r border-gray-100 p-4 flex-shrink-0 hidden lg:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
            <span className="text-xs font-black text-black">R</span>
          </div>
          <span className="font-bold text-gray-900">Repeat</span>
        </div>
        {['Inicio', 'Dashboard', 'Mis Programas', 'Clientes', 'Tiendas', 'Equipo'].map((item, i) => (
          <div
            key={item}
            className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 2 ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-500'}`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear nuevo programa</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tipo de programa</label>
                <div className="h-10 border border-gray-200 rounded-lg px-3 flex items-center justify-between text-sm">
                  <span className="font-medium">Puntos</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nombre del programa</label>
                <div className="h-10 border border-gray-200 rounded-lg px-3 flex items-center text-sm text-gray-700">
                  Club Café Bonafide
                </div>
              </div>
              <div className="border-t pt-5 space-y-3">
                <p className="font-semibold text-gray-900">Configuración de puntos</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 flex-1 border border-gray-200 rounded-lg px-3 flex items-center text-sm">
                    $1.000
                  </div>
                  <span className="text-sm text-gray-500">=</span>
                  <span className="text-sm font-semibold whitespace-nowrap">1 punto</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1 p-3 rounded-xl border-2 border-blue-400 bg-blue-50">
                    <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-800">Conversión directa</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-xl border-2 border-gray-200 opacity-60">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Catálogo</span>
                  </div>
                </div>
                {/* Valor de canje */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Valor de canje</label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 whitespace-nowrap">1 punto =</span>
                    <div className="h-10 flex-1 border border-gray-200 rounded-lg px-3 flex items-center text-sm">
                      $100
                    </div>
                  </div>
                </div>
                {/* Ejemplo */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Ejemplo</p>
                  <div className="space-y-1.5 text-sm text-blue-900">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        1
                      </span>
                      <span>
                        Gasta <strong>$5.000</strong> → gana <strong>5 puntos</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        2
                      </span>
                      <span>
                        Al canjear obtiene <strong>$500</strong> de descuento
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full h-12 rounded-xl bg-yellow-400 text-black font-bold text-sm">
                Crear programa
              </button>
            </div>
            {/* Preview tarjeta */}
            <div className="flex justify-center">
              <div className="w-64 rounded-3xl overflow-hidden shadow-xl border-8 border-gray-900">
                <div className="bg-blue-600 p-5 text-white">
                  <p className="text-xs opacity-70 mb-1">Club Café Bonafide</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-60">Tus puntos</p>
                      <p className="text-4xl font-black">120</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-white/10 rounded-xl p-2 text-center">
                      <p className="text-xs opacity-60">Acumulás</p>
                      <p className="text-xs font-bold">$1.000 = 1pt</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 text-center">
                      <p className="text-xs opacity-60">Canjeás</p>
                      <p className="text-xs font-bold">1pt = $100</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 text-center space-y-1">
                  <p className="text-xs text-gray-500">Saldo equivalente</p>
                  <p className="text-2xl font-black text-blue-600">$12.000</p>
                  <p className="text-xs text-gray-400">disponibles para canjear</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pantalla 3: MyPrograms ────────────────────────────────────────────────────
function MyProgramsScreen({ highlightPosts = false, highlightSurvey = false }) {
  const programs = [
    { id: 1, name: 'Sellos Café', color: '#c0392b', type: 'Sellos', members: 48, active: true, isPoints: false },
    { id: 2, name: 'Club Café Bonafide', color: '#2563EB', type: 'Puntos', members: 123, active: true, isPoints: true },
  ]
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-56 bg-white border-r border-gray-100 p-4 flex-shrink-0 hidden lg:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
            <span className="text-xs font-black text-black">R</span>
          </div>
          <span className="font-bold text-gray-900">Repeat</span>
        </div>
        {['Inicio', 'Dashboard', 'Mis Programas', 'Clientes', 'Tiendas', 'Equipo'].map((item, i) => (
          <div
            key={item}
            className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 2 ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-500'}`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Programas</h1>
        <div className="space-y-4">
          {programs.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                <div
                  className="w-40 flex-shrink-0 flex items-center justify-center p-6"
                  style={{ backgroundColor: p.color }}
                >
                  <p className="text-white font-bold text-sm text-center leading-tight">{p.name}</p>
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span className="text-xs text-gray-500">{p.active ? 'Activo' : 'Inactivo'}</span>
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {p.members} miembros
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Vista previa', icon: Eye },
                      { label: 'Editar', icon: Edit },
                      { label: 'Ver QR', icon: QrCode },
                      { label: 'Compartir', icon: Share2 },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                    {p.isPoints && (
                      <>
                        <motion.button
                          animate={
                            highlightPosts
                              ? {
                                  scale: [1, 1.08, 1],
                                  boxShadow: ['0 0 0 0 #FBBF2400', '0 0 0 6px #FBBF2440', '0 0 0 0 #FBBF2400'],
                                }
                              : {}
                          }
                          transition={{ repeat: highlightPosts ? Infinity : 0, duration: 1.5 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 text-xs text-yellow-700 font-medium"
                        >
                          <Newspaper className="w-3.5 h-3.5" />
                          Novedades
                        </motion.button>
                        <motion.button
                          animate={
                            highlightSurvey
                              ? {
                                  scale: [1, 1.08, 1],
                                  boxShadow: ['0 0 0 0 #FBBF2400', '0 0 0 6px #FBBF2440', '0 0 0 0 #FBBF2400'],
                                }
                              : {}
                          }
                          transition={{ repeat: highlightSurvey ? Infinity : 0, duration: 1.5, delay: 0.3 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 text-xs text-yellow-700 font-medium"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Encuesta
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Pantalla 4: Novedades modal ───────────────────────────────────────────────
function NovedadesScreen() {
  const posts = [
    {
      id: 1,
      type: 'promo',
      icon: Tag,
      label: 'Promoción',
      color: 'bg-orange-100 text-orange-700',
      title: '2x1 en cafés este finde',
      desc: 'Válido sábado y domingo de 9 a 13hs.',
      img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=160&fit=crop',
    },
    {
      id: 2,
      type: 'evento',
      icon: Calendar,
      label: 'Evento',
      color: 'bg-purple-100 text-purple-700',
      title: 'Tarde de degustación',
      desc: 'Sumate el jueves 18hs. Entrada libre.',
      img: null,
    },
  ]
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-56 bg-white border-r border-gray-100 p-4 flex-shrink-0 hidden lg:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
            <span className="text-xs font-black text-black">R</span>
          </div>
          <span className="font-bold text-gray-900">Repeat</span>
        </div>
        {['Inicio', 'Dashboard', 'Mis Programas', 'Clientes', 'Tiendas', 'Equipo'].map((item, i) => (
          <div
            key={item}
            className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 2 ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-500'}`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-8 relative">
        {/* Background blurred */}
        <div className="opacity-30 pointer-events-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Programas</h1>
          <div className="bg-white rounded-2xl border border-gray-100 h-24" />
        </div>
        {/* Modal centrado */}
        <div
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-gray-500" />
              <span className="font-bold text-gray-900">Novedades</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-sm">Club Café Bonafide</span>
            </div>
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              {/* Ticker */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-semibold text-gray-700">Anuncio del ticker</p>
                </div>
                <div className="h-9 border border-gray-200 rounded-lg bg-white px-3 flex items-center text-xs text-gray-500">
                  🚀 Referí un amigo y ganá 100 puntos · 🎁 Acumulá en cada compra
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Activo
                </div>
              </div>
              <div className="border-t border-gray-100" />
              {/* Posts */}
              <button className="w-full h-10 rounded-xl bg-yellow-400 text-black text-sm font-semibold flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Nueva novedad
              </button>
              {posts.map((post) => {
                const Icon = post.icon
                return (
                  <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {post.img && (
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-24 object-cover"
                        crossOrigin="anonymous"
                      />
                    )}
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${post.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          {post.label}
                        </span>
                        <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pantalla 5: Encuesta ─────────────────────────────────────────────────────
function EncuestaScreen() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-56 bg-white border-r border-gray-100 p-4 flex-shrink-0 hidden lg:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
            <span className="text-xs font-black text-black">R</span>
          </div>
          <span className="font-bold text-gray-900">Repeat</span>
        </div>
        {['Inicio', 'Dashboard', 'Mis Programas', 'Clientes', 'Tiendas', 'Equipo'].map((item, i) => (
          <div
            key={item}
            className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 2 ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-500'}`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-8 relative">
        <div className="opacity-30 pointer-events-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Programas</h1>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <div className="flex items-start gap-6 w-full max-w-2xl">
            {/* Config modal */}
            <div className="bg-white rounded-2xl shadow-2xl flex-1 overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-500" />
                <span className="font-bold text-gray-900">Encuesta</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 text-sm">Club Café Bonafide</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Pregunta de satisfacción</label>
                  <p className="text-xs text-gray-400">Se muestra al cliente cuando canjea un premio.</p>
                  <div className="h-10 border border-gray-200 rounded-lg px-3 flex items-center text-sm text-gray-700">
                    ¿Cómo fue tu experiencia?
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Activo
                  </div>
                </div>
                {/* Preview */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vista previa del cliente
                  </p>
                  <p className="text-sm font-bold text-gray-900">¿Cómo fue tu experiencia?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onMouseEnter={() => setHovered(v)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(v)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className="w-7 h-7 transition-colors"
                          fill={(hovered || rating) >= v ? POINTS_COLOR : 'none'}
                          stroke={(hovered || rating) >= v ? POINTS_COLOR : '#d1d5db'}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-300">Tocá una estrella para calificar</p>
                </div>
                <button className="w-full h-10 rounded-xl bg-yellow-400 text-black text-sm font-semibold">
                  Guardar
                </button>
              </div>
            </div>
            {/* Arrow + resultado */}
            <AnimatePresence>
              {rating >= 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-2xl w-64 p-5 space-y-3 text-center flex-shrink-0"
                >
                  <span className="text-3xl">🌟</span>
                  <p className="font-bold text-gray-900 text-sm">¡Nos alegra saberlo!</p>
                  <div className="rounded-xl bg-gray-50 p-3 text-xs text-left space-y-1">
                    <p className="font-semibold text-gray-800">¿Podés dejarnos una reseña?</p>
                    <p className="text-gray-500">Buscá la sucursal que más visitás en Google Maps.</p>
                  </div>
                  <div
                    className="flex items-center justify-center gap-1.5 h-9 rounded-xl text-white text-xs font-semibold"
                    style={{ backgroundColor: POINTS_COLOR }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Buscar en Google Maps
                  </div>
                </motion.div>
              )}
              {rating > 0 && rating < 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-2xl w-64 p-5 space-y-3 text-center flex-shrink-0"
                >
                  <span className="text-3xl">💚</span>
                  <p className="font-bold text-gray-900 text-sm">¡Gracias por tu opinión!</p>
                  <p className="text-xs text-gray-500">Nos comprometemos a seguir mejorando.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pantalla 6: Catálogo público ─────────────────────────────────────────────
function CatalogScreen() {
  return <iframe src="/catalog/demo" className="w-full border-0" style={{ height: '68vh' }} title="Catálogo público" />
}

// ─── Definición de slides ─────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'intro',
    label: 'Intro',
    type: 'title',
  },
  {
    id: 'create-catalog',
    label: 'Puntos · Catálogo',
    type: 'screen',
    url: 'repeat.la/createclub',
    caption: 'Crear programa de Puntos — modo Catálogo',
    sub: 'El operador configura los ítems canjeables con imagen, descripción y puntos necesarios.',
    component: <CreateClubCatalogScreen />,
  },
  {
    id: 'create-direct',
    label: 'Puntos · Directo',
    type: 'screen',
    url: 'repeat.la/createclub',
    caption: 'Crear programa de Puntos — Conversión directa',
    sub: 'Alternativamente, cada punto equivale a un monto de descuento configurable.',
    component: <CreateClubDirectScreen />,
  },
  {
    id: 'myprograms',
    label: 'Mis Programas',
    type: 'screen',
    url: 'repeat.la/myprograms',
    caption: 'Mis Programas — botones Novedades y Encuesta',
    sub: 'Los programas de Puntos tienen dos nuevas acciones exclusivas.',
    component: <MyProgramsScreen highlightPosts highlightSurvey />,
  },
  {
    id: 'novedades',
    label: 'Novedades',
    type: 'screen',
    url: 'repeat.la/myprograms',
    caption: 'Novedades y ticker de anuncio',
    sub: 'Publicá promociones, eventos y novedades que aparecen en el catálogo público del cliente.',
    component: <NovedadesScreen />,
  },
  {
    id: 'encuesta',
    label: 'Encuesta',
    type: 'screen',
    url: 'repeat.la/myprograms',
    caption: 'Encuesta de satisfacción',
    sub: '4-5 estrellas invita a dejar reseña en Google Maps. 1-3 estrella agradece el feedback internamente.',
    component: <EncuestaScreen />,
  },
  {
    id: 'catalog',
    label: 'Catálogo público',
    type: 'screen',
    url: 'repeat.la/catalog/demo',
    caption: 'Catálogo público — vista del cliente',
    sub: 'Página pública sin login. El cliente ve los premios, las novedades y puede canjear sus puntos.',
    component: <CatalogScreen />,
  },
]

// ─── Slide de título ──────────────────────────────────────────────────────────
function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center mx-auto shadow-xl">
          <span className="text-3xl font-black text-black">R</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
          Programa de
          <br />
          <span style={{ color: ACCENT }}>Puntos</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-xl mx-auto leading-relaxed">
          Nuevas funcionalidades para fidelizar clientes, comunicar novedades y medir satisfacción.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {[
          { icon: Coins, label: 'Programa de Puntos' },
          { icon: Package, label: 'Catálogo de Premios' },
          { icon: Newspaper, label: 'Novedades' },
          { icon: Star, label: 'Encuesta' },
          { icon: ShieldCheck, label: 'Control de Fraude' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
          >
            <Icon className="w-4 h-4" style={{ color: ACCENT }} />
            {label}
          </div>
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gray-600 text-sm flex items-center gap-2"
      >
        <ChevronRight className="w-4 h-4" /> Presioná la flecha para comenzar
      </motion.p>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Demo() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current],
  )

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1)
  }, [current, goTo])
  const next = useCallback(() => {
    if (current < SLIDES.length - 1) goTo(current + 1)
  }, [current, goTo])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const slide = SLIDES[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="fixed inset-0 flex flex-col select-none" style={{ backgroundColor: '#0F172A' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 flex-shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center">
            <span className="text-xs font-black text-black">R</span>
          </div>
          <span className="text-white text-sm font-semibold">Repeat</span>
          <span className="text-gray-600 text-sm">·</span>
          <span className="text-gray-400 text-sm">Nuevas funcionalidades</span>
        </div>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="group flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors hover:bg-white/10"
            >
              <div
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/20 group-hover:bg-white/40'}`}
              />
            </button>
          ))}
        </div>
        <span className="text-gray-500 text-sm tabular-nums">
          {current + 1} / {SLIDES.length}
        </span>
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col"
          >
            {slide.type === 'title' ? (
              <TitleSlide />
            ) : (
              <div className="flex-1 flex flex-col px-8 pt-5 pb-2 overflow-hidden">
                {/* Caption */}
                <div className="mb-4 flex-shrink-0">
                  <h2 className="text-white font-bold text-xl">{slide.caption}</h2>
                  <p className="text-gray-400 text-sm mt-0.5">{slide.sub}</p>
                </div>
                {/* Screen */}
                <div className="flex-1 overflow-hidden">
                  <LaptopFrame url={slide.url}>{slide.component}</LaptopFrame>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 flex-shrink-0">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        <div className="text-xs text-gray-600 hidden md:block">← → para navegar</div>

        <button
          onClick={next}
          disabled={current === SLIDES.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed text-gray-300 hover:bg-white/10 hover:text-white"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
