import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Activity, ArrowUpDown, CreditCard, Filter, Gift, QrCode, Search, Trophy, UserPlus, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import CustomerDetailModal from '../components/customers/CustomerDetailModal'
import { CustomerCard, CustomerEmptyState } from '@/components/customers/CustomersSections'

const PROGRAM = {
  program_name: 'Club de Fidelidad Moon Cafe',
  program_rules: { stamps_required: 5 },
}

const makeCard = (id, balance, visits, rewardsCount) => ({
  card_id: `mc${id}`,
  current_balance: balance,
  total_visits: visits,
  redemptions: Array.from({ length: rewardsCount }, (_, i) => ({ status: 'completed', id: i })),
  program: PROGRAM,
})

const RAW_MEMBERS = [
  {
    id: 1,
    name: 'Carlos Martínez',
    email: 'carlos.mtz@gmail.com',
    joined: '2026-01-08',
    balance: 4,
    visits: 22,
    rewards: 4,
    phone: '+54 9 351 412-3344',
    birthday: '1990-03-15',
  },
  {
    id: 2,
    name: 'Sofía Ramírez',
    email: 'sofi.ramirez@gmail.com',
    joined: '2026-01-15',
    balance: 2,
    visits: 17,
    rewards: 3,
    phone: '+54 9 351 508-7621',
    birthday: '1995-07-22',
  },
  {
    id: 3,
    name: 'Andrés Morales',
    email: 'andres.m@hotmail.com',
    joined: '2026-02-01',
    balance: 0,
    visits: 10,
    rewards: 2,
    phone: '+54 9 351 623-0198',
    birthday: '1988-11-04',
  },
  {
    id: 4,
    name: 'Valentina Cruz',
    email: 'valen.cruz@icloud.com',
    joined: '2026-02-10',
    balance: 3,
    visits: 8,
    rewards: 1,
    phone: '+54 9 351 741-5530',
    birthday: '1997-01-30',
  },
  {
    id: 5,
    name: 'Lucía Herrera',
    email: 'lucia.h@gmail.com',
    joined: '2026-02-20',
    balance: 1,
    visits: 6,
    rewards: 1,
    phone: '+54 9 351 899-2267',
    birthday: '1993-05-18',
  },
  {
    id: 6,
    name: 'Mateo Flores',
    email: 'mateo.flores@gmail.com',
    joined: '2026-03-03',
    balance: 4,
    visits: 14,
    rewards: 2,
    phone: '+54 9 351 312-4480',
    birthday: '1991-09-09',
  },
  {
    id: 7,
    name: 'Camila Ortiz',
    email: 'cami.ortiz@yahoo.com',
    joined: '2026-03-12',
    balance: 2,
    visits: 7,
    rewards: 1,
    birthday: '1999-12-03',
  },
  {
    id: 8,
    name: 'Diego Vargas',
    email: 'diego.v@gmail.com',
    joined: '2026-03-25',
    balance: 0,
    visits: 5,
    rewards: 1,
    phone: '+54 9 351 487-9915',
    birthday: '1992-06-17',
  },
  {
    id: 9,
    name: 'Martina Rojas',
    email: 'marti.rojas@gmail.com',
    joined: '2026-04-05',
    balance: 3,
    visits: 3,
    rewards: 0,
    phone: '+54 9 351 556-1023',
    birthday: '1996-02-14',
  },
  {
    id: 10,
    name: 'Sebastián Castro',
    email: 'seba.castro@hotmail.com',
    joined: '2026-04-14',
    balance: 1,
    visits: 2,
    rewards: 0,
    birthday: '1994-08-27',
  },
  {
    id: 11,
    name: 'Isabella Méndez',
    email: 'isa.mendez@gmail.com',
    joined: '2026-04-22',
    balance: 2,
    visits: 2,
    rewards: 0,
    phone: '+54 9 351 730-6642',
    birthday: '1998-04-11',
  },
  {
    id: 12,
    name: 'Tomás Navarro',
    email: 'tomas.nav@gmail.com',
    joined: '2026-05-01',
    balance: 1,
    visits: 1,
    rewards: 0,
    phone: '+54 9 351 621-8874',
    birthday: '1995-10-22',
  },
]

const ACTIVITY_EVENTS = (() => {
  const now = new Date()
  const events = []
  const types = ['stamp', 'stamp', 'stamp', 'new_user', 'reward', 'completed']
  RAW_MEMBERS.forEach((m, mi) => {
    const count = Math.min(m.visits, 5)
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor((mi * 3 + i * 2) % 14)
      const d = new Date(now)
      d.setUTCDate(d.getUTCDate() - daysAgo)
      const dateKey = d.toISOString().split('T')[0]
      const hour = 9 + ((mi * 5 + i * 3) % 10)
      const min = (mi * 7 + i * 13) % 60
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      const type = types[(mi + i) % types.length]
      events.push({ id: `${m.id}-${i}`, type, userName: m.name, email: m.email, time, dateKey })
    }
  })
  return events.sort((a, b) => b.dateKey.localeCompare(a.dateKey) || b.time.localeCompare(a.time))
})()

const EVENT_META = {
  stamp: {
    label: 'Sello entregado',
    detail: '+1 sello',
    icon: QrCode,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    color: 'text-amber-500',
  },
  new_user: {
    label: 'Nuevo miembro',
    detail: 'Se unió',
    icon: UserPlus,
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    color: 'text-indigo-500',
  },
  reward: {
    label: 'Premio canjeado',
    detail: 'Premio canjeado',
    icon: Gift,
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    color: 'text-purple-500',
  },
  completed: {
    label: 'Tarjeta completada',
    detail: 'Tarjeta completa',
    icon: Trophy,
    bg: 'bg-green-50 dark:bg-green-900/20',
    color: 'text-green-500',
  },
}

const TYPE_FILTERS = [
  { key: 'all', label: 'Todos los tipos' },
  { key: 'stamp', label: 'Sellos' },
  { key: 'reward', label: 'Premios' },
  { key: 'new_user', label: 'Nuevos' },
  { key: 'completed', label: 'Completadas' },
]

function formatEventDate(dateKey, time) {
  const d = new Date(dateKey + 'T00:00:00Z')
  const dateStr = d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
  return `${dateStr}, ${time}`
}

const MEMBERS = RAW_MEMBERS.map((m) => ({
  user_id: m.id,
  full_name: m.name,
  email: m.email,
  created_at: `${m.joined}T00:00:00Z`,
  programs: [{ program_name: PROGRAM.program_name }],
}))

const USER_STATS_MAP = Object.fromEntries(
  RAW_MEMBERS.map((m) => [
    m.id,
    {
      loyalty_cards: [makeCard(m.id, m.balance, m.visits, m.rewards)],
      ...(m.phone && { phone: m.phone }),
      ...(m.birthday && { birth_date: m.birthday }),
    },
  ]),
)

const TABS = [
  { key: 'members', label: 'Miembros', icon: Users },
  { key: 'activity', label: 'Actividad', icon: Activity },
]

export default function CustomersMoonCafe() {
  const [activeView, setActiveView] = useState('members')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')

  const handleCustomerClick = useCallback((member) => {
    setSelectedCustomer(member)
    window.parent?.postMessage({ type: 'tour-customer-clicked' }, '*')
  }, [])

  const filtered = MEMBERS.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'visits') {
      return (
        (USER_STATS_MAP[b.user_id]?.loyalty_cards[0]?.total_visits ?? 0) -
        (USER_STATS_MAP[a.user_id]?.loyalty_cards[0]?.total_visits ?? 0)
      )
    }
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Miembros</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Gestioná y conocé a los clientes de tu programa.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-6">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === key
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'activity' ? (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 rounded-xl w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_FILTERS.map((f) => (
                      <SelectItem key={f.key} value={f.key}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Count */}
              {(() => {
                const filtered =
                  typeFilter === 'all' ? ACTIVITY_EVENTS : ACTIVITY_EVENTS.filter((e) => e.type === typeFilter)
                return (
                  <>
                    <p className="text-gray-600 dark:text-gray-400">
                      Mostrando{' '}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{filtered.length}</span> de{' '}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{ACTIVITY_EVENTS.length}</span>{' '}
                      transacciones
                    </p>
                    <div className="space-y-3">
                      {filtered.map((ev) => {
                        const meta = EVENT_META[ev.type] ?? EVENT_META.stamp
                        const Icon = meta.icon
                        return (
                          <div
                            key={ev.id}
                            className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                          >
                            <div
                              className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-5 h-5 ${meta.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{meta.detail}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{meta.label}</span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {ev.userName} · {ev.email}
                              </p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{PROGRAM.program_name}</p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 tabular-nums">
                              {formatEventDate(ev.dateKey, ev.time)}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()}
            </motion.div>
          ) : (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap items-end gap-4 mb-8">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por email o nombre"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700"
                  />
                </div>

                <Select defaultValue="all">
                  <SelectTrigger className="h-10 rounded-xl w-full sm:w-40">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Programa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los programas</SelectItem>
                    <SelectItem value="mooncafe">Club de Fidelidad Moon Cafe</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 rounded-xl w-full sm:w-44">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Ordenar por</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Fecha de ingreso</SelectItem>
                    <SelectItem value="visits">Visitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Count */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{sorted.length}</span> de{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">{MEMBERS.length}</span> miembros
              </p>

              {/* List */}
              {sorted.length === 0 ? (
                <CustomerEmptyState />
              ) : (
                <div className="space-y-3">
                  {sorted.map((member) => (
                    <motion.div key={member.user_id} layout transition={{ layout: { duration: 0.2 } }}>
                      <CustomerCard
                        member={member}
                        userData={USER_STATS_MAP[member.user_id]}
                        onClick={handleCustomerClick}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail modal */}
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            brandId={null}
            initialData={USER_STATS_MAP[selectedCustomer.user_id]}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </div>
  )
}
