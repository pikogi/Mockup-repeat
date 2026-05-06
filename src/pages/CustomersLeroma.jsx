import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Gift, TrendingUp, Star, X, Phone, Mail, Calendar, IceCream } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const MEMBERS = [
  {
    id: 1,
    name: 'Valentina Gómez',
    email: 'vale.gomez@gmail.com',
    phone: '+54 9 11 2345-6789',
    joined: '12 ene 2026',
    points: 340,
    visits: 28,
    rewards: 3,
    lastVisit: 'Hace 2 días',
  },
  {
    id: 2,
    name: 'Matías Rodríguez',
    email: 'mati.rdz@hotmail.com',
    phone: '+54 9 11 3456-7890',
    joined: '3 feb 2026',
    points: 210,
    visits: 17,
    rewards: 2,
    lastVisit: 'Ayer',
  },
  {
    id: 3,
    name: 'Lucía Fernández',
    email: 'luciafe@gmail.com',
    phone: '+54 9 11 4567-8901',
    joined: '20 ene 2026',
    points: 85,
    visits: 7,
    rewards: 0,
    lastVisit: 'Hace 5 días',
  },
  {
    id: 4,
    name: 'Santiago Martínez',
    email: 'santi.mtz@gmail.com',
    phone: '+54 9 11 5678-9012',
    joined: '8 mar 2026',
    points: 420,
    visits: 35,
    rewards: 4,
    lastVisit: 'Hoy',
  },
  {
    id: 5,
    name: 'Camila Torres',
    email: 'cami.torres@icloud.com',
    phone: '+54 9 11 6789-0123',
    joined: '15 feb 2026',
    points: 155,
    visits: 13,
    rewards: 1,
    lastVisit: 'Hace 1 semana',
  },
  {
    id: 6,
    name: 'Ignacio López',
    email: 'nacho.lpz@gmail.com',
    phone: '+54 9 11 7890-1234',
    joined: '2 abr 2026',
    points: 60,
    visits: 5,
    rewards: 0,
    lastVisit: 'Hace 3 días',
  },
  {
    id: 7,
    name: 'Agustina Pérez',
    email: 'agus.pz@yahoo.com',
    phone: '+54 9 11 8901-2345',
    joined: '25 ene 2026',
    points: 510,
    visits: 42,
    rewards: 5,
    lastVisit: 'Hace 4 días',
  },
  {
    id: 8,
    name: 'Nicolás Silva',
    email: 'nico.silva@gmail.com',
    phone: '+54 9 11 9012-3456',
    joined: '10 mar 2026',
    points: 130,
    visits: 11,
    rewards: 1,
    lastVisit: 'Ayer',
  },
  {
    id: 9,
    name: 'Florencia Díaz',
    email: 'flor.diaz@gmail.com',
    phone: '+54 9 11 0123-4567',
    joined: '18 abr 2026',
    points: 40,
    visits: 4,
    rewards: 0,
    lastVisit: 'Hoy',
  },
  {
    id: 10,
    name: 'Tomás García',
    email: 'tomas.g@hotmail.com',
    phone: '+54 9 11 1234-5678',
    joined: '5 feb 2026',
    points: 290,
    visits: 24,
    rewards: 2,
    lastVisit: 'Hace 6 días',
  },
]

const POINTS_FOR_REWARD = 200

function MemberDetailSheet({ member, onClose }) {
  const progressPct = Math.min(100, (member.points / POINTS_FOR_REWARD) * 100)
  const pointsToNext = Math.max(0, POINTS_FOR_REWARD - member.points)

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl"
        style={{ maxHeight: '80dvh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
      >
        <div className="flex justify-center pt-3">
          <div className="w-9 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80dvh - 20px)' }}>
          <div className="px-6 pt-4 pb-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center text-2xl font-black text-amber-600">
                  {member.name[0]}
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">{member.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Miembro desde {member.joined}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: 'Puntos',
                  value: member.points,
                  icon: Star,
                  color: 'text-amber-500',
                  bg: 'bg-amber-50 dark:bg-amber-950',
                },
                {
                  label: 'Visitas',
                  value: member.visits,
                  icon: TrendingUp,
                  color: 'text-blue-500',
                  bg: 'bg-blue-50 dark:bg-blue-950',
                },
                {
                  label: 'Premios',
                  value: member.rewards,
                  icon: Gift,
                  color: 'text-purple-500',
                  bg: 'bg-purple-50 dark:bg-purple-950',
                },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`rounded-2xl p-3 text-center ${bg}`}>
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
                  <p className="text-xl font-black text-gray-900 dark:text-gray-100">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Points progress */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Progreso al próximo premio</span>
                <span className="text-sm font-black text-amber-500">
                  {member.points}/{POINTS_FOR_REWARD} pts
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                {pointsToNext > 0 ? `Le faltan ${pointsToNext} puntos` : '¡Tiene un premio disponible!'}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contacto</h3>
              {[
                { icon: Mail, value: member.email },
                { icon: Phone, value: member.phone },
                { icon: Calendar, value: `Última visita: ${member.lastVisit}` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

function MemberCard({ member, index, onClick }) {
  const progressPct = Math.min(100, (member.points / POINTS_FOR_REWARD) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(member)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center flex-shrink-0 text-base font-black text-amber-600">
            {member.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">{member.name}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{member.lastVisit}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{member.email}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                <strong className="text-gray-800 dark:text-gray-200">{member.points}</strong> pts
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <strong className="text-gray-800 dark:text-gray-200">{member.visits}</strong> visitas
              </span>
              <span className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-purple-400" />
                <strong className="text-gray-800 dark:text-gray-200">{member.rewards}</strong> premios
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1 mt-2">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-1 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function CustomersLeroma() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = MEMBERS.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <img
              src="/leroma-logo.jpg"
              alt="Leroma Gelato"
              className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-contain flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">Miembros</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Leroma Gelato · {MEMBERS.length} miembros</p>
            </div>
          </div>
        </motion.div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total miembros', value: MEMBERS.length, icon: Users, color: 'from-blue-500 to-blue-600' },
            {
              label: 'Premios canjeados',
              value: MEMBERS.reduce((s, m) => s + m.rewards, 0),
              icon: Gift,
              color: 'from-purple-500 to-purple-600',
            },
            {
              label: 'Visitas totales',
              value: MEMBERS.reduce((s, m) => s + m.visits, 0),
              icon: IceCream,
              color: 'from-amber-500 to-orange-500',
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-4 border-0 shadow-md">
              <div className="flex items-center gap-3 md:hidden">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color} flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} w-fit mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white dark:bg-gray-900"
          />
        </div>

        {/* List */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} onClick={setSelected} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Sin resultados para &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail sheet */}
      <AnimatePresence>
        {selected && <MemberDetailSheet key={selected.id} member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
