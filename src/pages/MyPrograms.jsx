import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { getCurrentUser } from '@/utils/jwt'
import { useMyPrograms } from '@/hooks/useMyPrograms'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search, CreditCard, Store } from 'lucide-react'
import ProgramListItem from '../components/programs/ProgramListItem'
import { ProgramListSkeleton, EmptyProgramsState } from '@/components/programs/MyProgramsSections'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import StoreFilterSelect from '@/components/shared/StoreFilterSelect'

export default function MyPrograms() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const user = useMemo(() => getCurrentUser(), [])
  const brandId = localStorage.getItem('brand_id')

  // Brand data for subscription checks in ProgramListItem
  const { data: meData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me()
      return res?.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  const brand = meData?.brands?.find((b) => b.brand_id === brandId) || meData?.brands?.[0] || null

  const {
    cards,
    isLoading,
    memberCounts,
    toggleProgramActive,
    deleteProgram,
    isDeletingProgram,
    stores,
    selectedStore,
    setSelectedStore,
  } = useMyPrograms(brandId)

  const filteredCards = cards.filter(
    (card) =>
      card.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.card_title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (card) => {
    navigate(createPageUrl('CreateClub') + `?edit=${card.id}`)
  }

  const handleToggleActive = (card, newValue) => {
    if (!card.id) return
    toggleProgramActive(card.id, newValue)
  }

  const handleDelete = (cardId) => {
    if (!cardId) return
    deleteProgram(cardId)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">{t('myPrograms')}</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('myProgramsSubtitle')}</p>
            </div>
          </div>

          {(cards.length > 0 || isLoading || selectedStore !== 'all') && (
            <div className="flex flex-col gap-4">
              <Link to={createPageUrl('CreateClub')} className="w-full md:w-fit md:hidden">
                <Button
                  size="lg"
                  className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
                >
                  <Plus className="w-5 h-5" />
                  {t('createProgram')}
                </Button>
              </Link>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={t('searchPrograms')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
                  />
                </div>
                <StoreFilterSelect stores={stores} selectedStore={selectedStore} setSelectedStore={setSelectedStore} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Cards List */}
        {isLoading ? (
          <ProgramListSkeleton />
        ) : filteredCards.length === 0 ? (
          selectedStore !== 'all' ? (
            <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
              <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('noProgramsForStore')}</h3>
              <p className="text-gray-500 dark:text-gray-400">{t('noProgramsForStoreDesc')}</p>
            </Card>
          ) : (
            <EmptyProgramsState />
          )
        ) : (
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <ProgramListItem
                key={card.id}
                card={card}
                brand={brand}
                currentUser={user}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
                memberCount={memberCounts[card.id] || 0}
                isDeleting={isDeletingProgram(card.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
