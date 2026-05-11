import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, CreditCard } from 'lucide-react'
import ProgramListItem from '../components/programs/ProgramListItem'
import { motion } from 'framer-motion'

const LEROMA_CARDS = [
  {
    id: 'heladeria-demo',
    club_name: 'Club Leroma',
    card_title: 'Programa de Puntos',
    reward_text: 'Canjeá puntos por helados y productos del catálogo',
    card_color: '#f59e0b',
    is_active: true,
    total_scans: 747,
    description: 'Acumulá puntos en cada visita y canjealos por tus helados favoritos.',
    logo_url: '/leroma-logo.jpg',
    short_url: null,
    program_type_id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157',
  },
]

export default function MyProgramsLeroma() {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = LEROMA_CARDS.filter(
    (c) =>
      c.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.card_title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">Mis programas</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Administrá y monitoreá tus programas de fidelización.</p>
            </div>
            <Link to="/createclub" className="hidden md:block">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
              >
                <Plus className="w-5 h-5" />
                Crear programa
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <Link to="/createclub" className="w-full md:w-fit md:hidden">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
              >
                <Plus className="w-5 h-5" />
                Crear programa
              </Button>
            </Link>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar programas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {filtered.map((card) => (
            <ProgramListItem
              key={card.id}
              card={card}
              brand={null}
              currentUser={null}
              onEdit={() => {}}
              onToggleActive={() => {}}
              onDelete={() => {}}
              memberCount={342}
              isDeleting={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
