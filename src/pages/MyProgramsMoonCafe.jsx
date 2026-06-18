import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/auth/LanguageContext'
import ProgramListItem from '@/components/programs/ProgramListItem'
import { MOONCAFE_CLUBS } from '@/constants/moonCafeClubs'

export default function MyProgramsMoonCafe() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const flowSuffix = location.pathname.includes('points') ? 'mooncafe-points' : 'mooncafe'

  const filteredCards = MOONCAFE_CLUBS.filter(
    (card) =>
      card.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.card_title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (card) => {
    navigate(`/editclub-demo/${flowSuffix}?club=${card.id}`)
  }

  const handleCreateClick = () => {
    toast.info('Esto es una demo — la creación de nuevos clubes no está disponible.')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">{t('myPrograms')}</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('myProgramsSubtitle')}</p>
            </div>
            <Button
              size="lg"
              onClick={handleCreateClick}
              className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
            >
              <Plus className="w-5 h-5" />
              {t('createProgram')}
            </Button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('searchPrograms')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {filteredCards.map((card) => (
            <ProgramListItem
              key={card.id}
              card={card}
              brand={null}
              currentUser={null}
              onEdit={handleEdit}
              onToggleActive={() => {}}
              onDelete={() => {}}
              memberCount={card.members}
              isDeleting={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
