import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Users, CreditCard, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
import CustomerDetailModal from '../components/customers/CustomerDetailModal'
import { CustomerCard, CustomerEmptyState } from '@/components/customers/CustomersSections'

const PROGRAM = {
  program_name: 'Club de Puntos Glow',
  program_rules: { stamps_required: 150, unit_label: 'puntos' },
}

const makeCard = (id, balance, visits, rewardsCount) => ({
  card_id: `glp${id}`,
  current_balance: balance,
  total_visits: visits,
  redemptions: Array.from({ length: rewardsCount }, (_, i) => ({ status: 'completed', id: i })),
  program: PROGRAM,
})

const RAW_MEMBERS = [
  {
    id: 1,
    name: 'Valentina Gómez',
    email: 'vale.gomez@gmail.com',
    joined: '2026-01-10',
    balance: 90,
    visits: 18,
    rewards: 2,
    phone: '+54 9 351 412-3344',
    birthday: '1993-04-12',
  },
  {
    id: 2,
    name: 'Sofía Ríos',
    email: 'sofi.rios@gmail.com',
    joined: '2026-01-18',
    balance: 60,
    visits: 14,
    rewards: 1,
    phone: '+54 9 351 508-7621',
    birthday: '1997-09-05',
  },
  {
    id: 3,
    name: 'Camila Torres',
    email: 'cami.torres@hotmail.com',
    joined: '2026-02-03',
    balance: 0,
    visits: 8,
    rewards: 1,
    phone: '+54 9 351 623-0198',
    birthday: '1990-11-20',
  },
  {
    id: 4,
    name: 'Luciana Pérez',
    email: 'lu.perez@icloud.com',
    joined: '2026-02-14',
    balance: 75,
    visits: 6,
    rewards: 0,
    phone: '+54 9 351 741-5530',
    birthday: '1998-02-28',
  },
  {
    id: 5,
    name: 'Marina López',
    email: 'mari.lopez@gmail.com',
    joined: '2026-02-22',
    balance: 30,
    visits: 5,
    rewards: 0,
    phone: '+54 9 351 899-2267',
    birthday: '1995-06-14',
  },
  {
    id: 6,
    name: 'Florencia Castro',
    email: 'flor.castro@gmail.com',
    joined: '2026-03-05',
    balance: 110,
    visits: 12,
    rewards: 1,
    phone: '+54 9 351 312-4480',
    birthday: '1991-07-30',
  },
  {
    id: 7,
    name: 'Agustina Ramos',
    email: 'agus.ramos@yahoo.com',
    joined: '2026-03-14',
    balance: 40,
    visits: 4,
    rewards: 0,
    birthday: '2000-03-18',
  },
  {
    id: 8,
    name: 'Clara Medina',
    email: 'clara.m@gmail.com',
    joined: '2026-03-27',
    balance: 15,
    visits: 3,
    rewards: 0,
    phone: '+54 9 351 487-9915',
    birthday: '1994-10-07',
  },
  {
    id: 9,
    name: 'Julia Fernández',
    email: 'juli.fdz@gmail.com',
    joined: '2026-04-06',
    balance: 55,
    visits: 4,
    rewards: 0,
    phone: '+54 9 351 556-1023',
    birthday: '1999-01-25',
  },
  {
    id: 10,
    name: 'Daniela Sosa',
    email: 'dani.sosa@hotmail.com',
    joined: '2026-04-15',
    balance: 20,
    visits: 2,
    rewards: 0,
    birthday: '1996-12-03',
  },
  {
    id: 11,
    name: 'Antonella Ruiz',
    email: 'anto.ruiz@gmail.com',
    joined: '2026-04-24',
    balance: 35,
    visits: 3,
    rewards: 0,
    phone: '+54 9 351 730-6642',
    birthday: '1992-08-16',
  },
  {
    id: 12,
    name: 'Paula Díaz',
    email: 'pau.diaz@gmail.com',
    joined: '2026-05-02',
    balance: 10,
    visits: 1,
    rewards: 0,
    phone: '+54 9 351 621-8874',
    birthday: '1997-05-09',
  },
]

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

export default function CustomersGlowPoints() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Miembros</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Gestioná y conocé a las miembros de tu programa de puntos.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-end gap-4 mb-8"
        >
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
              <SelectItem value="glow-points">Club de Puntos Glow</SelectItem>
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
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{sorted.length}</span> de{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{MEMBERS.length}</span> miembros
          </p>
        </motion.div>

        {sorted.length === 0 ? (
          <CustomerEmptyState />
        ) : (
          <div className="space-y-3">
            {sorted.map((member) => (
              <motion.div key={member.user_id} layout transition={{ layout: { duration: 0.2 } }}>
                <CustomerCard member={member} userData={USER_STATS_MAP[member.user_id]} onClick={handleCustomerClick} />
              </motion.div>
            ))}
          </div>
        )}

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
