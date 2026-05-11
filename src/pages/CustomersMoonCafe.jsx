import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Users, CreditCard, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
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
  },
  {
    id: 2,
    name: 'Sofía Ramírez',
    email: 'sofi.ramirez@gmail.com',
    joined: '2026-01-15',
    balance: 2,
    visits: 17,
    rewards: 3,
  },
  {
    id: 3,
    name: 'Andrés Morales',
    email: 'andres.m@hotmail.com',
    joined: '2026-02-01',
    balance: 0,
    visits: 10,
    rewards: 2,
  },
  {
    id: 4,
    name: 'Valentina Cruz',
    email: 'valen.cruz@icloud.com',
    joined: '2026-02-10',
    balance: 3,
    visits: 8,
    rewards: 1,
  },
  { id: 5, name: 'Lucía Herrera', email: 'lucia.h@gmail.com', joined: '2026-02-20', balance: 1, visits: 6, rewards: 1 },
  {
    id: 6,
    name: 'Mateo Flores',
    email: 'mateo.flores@gmail.com',
    joined: '2026-03-03',
    balance: 4,
    visits: 14,
    rewards: 2,
  },
  {
    id: 7,
    name: 'Camila Ortiz',
    email: 'cami.ortiz@yahoo.com',
    joined: '2026-03-12',
    balance: 2,
    visits: 7,
    rewards: 1,
  },
  { id: 8, name: 'Diego Vargas', email: 'diego.v@gmail.com', joined: '2026-03-25', balance: 0, visits: 5, rewards: 1 },
  {
    id: 9,
    name: 'Martina Rojas',
    email: 'marti.rojas@gmail.com',
    joined: '2026-04-05',
    balance: 3,
    visits: 3,
    rewards: 0,
  },
  {
    id: 10,
    name: 'Sebastián Castro',
    email: 'seba.castro@hotmail.com',
    joined: '2026-04-14',
    balance: 1,
    visits: 2,
    rewards: 0,
  },
  {
    id: 11,
    name: 'Isabella Méndez',
    email: 'isa.mendez@gmail.com',
    joined: '2026-04-22',
    balance: 2,
    visits: 2,
    rewards: 0,
  },
  {
    id: 12,
    name: 'Tomás Navarro',
    email: 'tomas.nav@gmail.com',
    joined: '2026-05-01',
    balance: 1,
    visits: 1,
    rewards: 0,
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
  RAW_MEMBERS.map((m) => [m.id, { loyalty_cards: [makeCard(m.id, m.balance, m.visits, m.rewards)] }]),
)

export default function CustomersMoonCafe() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const handleCustomerClick = useCallback((member) => setSelectedCustomer(member), [])

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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Miembros</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Gestioná y conocé a los clientes de tu programa.</p>
        </motion.div>

        {/* Filters */}
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
        </motion.div>

        {/* Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{sorted.length}</span> de{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{MEMBERS.length}</span> miembros
          </p>
        </motion.div>

        {/* List */}
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
