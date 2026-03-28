import { useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Users, CreditCard, ArrowUpDown, Loader2 } from 'lucide-react'
import DateFilterSelect from '@/components/shared/DateFilterSelect'
import StoreFilterSelect from '@/components/shared/StoreFilterSelect'
import { motion } from 'framer-motion'
import CustomerDetailModal from '../components/customers/CustomerDetailModal'
import {
  CustomerCard,
  CustomerListSkeleton,
  CustomerErrorState,
  CustomerEmptyState,
} from '@/components/customers/CustomersSections'
import { useLanguage } from '@/components/auth/LanguageContext'
import { useCustomers } from '@/hooks/useCustomers'

export default function Customers() {
  const { t } = useLanguage()

  const {
    brandId,
    cards,
    isLoading,
    membersError,
    sortedMembers,
    totalCount,
    searchQuery,
    selectedCard,
    sortBy,
    handleSearchChange,
    handleCardChange,
    handleSortChange,
    selectedCustomer,
    setSelectedCustomer,
    userStatsMap,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    stores,
    selectedStore,
    setSelectedStore,
  } = useCustomers()

  const handleCustomerClick = useCallback(
    (member) => {
      setSelectedCustomer(member)
    },
    [setSelectedCustomer],
  )

  // Infinite scroll sentinel
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (!hasNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage()
      },
      { rootMargin: '200px' },
    )
    const el = sentinelRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [hasNextPage, fetchNextPage])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">{t('customers')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('customersSubtitle')}</p>
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
              placeholder={t('searchEmail')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700"
            />
          </div>

          <StoreFilterSelect stores={stores} selectedStore={selectedStore} setSelectedStore={setSelectedStore} />

          <Select value={selectedCard} onValueChange={handleCardChange}>
            <SelectTrigger className="h-10 rounded-xl w-full sm:w-40">
              <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder={t('filterProgram')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allPrograms')}</SelectItem>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.club_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="h-10 rounded-xl w-full sm:w-44">
              <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">Ordenar por</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha registro</SelectItem>
              <SelectItem value="visits">Visitas totales</SelectItem>
            </SelectContent>
          </Select>

          <DateFilterSelect
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customDate={customDate}
            setCustomDate={setCustomDate}
            maxMonthsBack={6}
          />
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{sortedMembers.length}</span> de{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{totalCount}</span> {t('customersCount')}
          </p>
        </motion.div>

        {/* Customers List */}
        {isLoading ? (
          <CustomerListSkeleton />
        ) : membersError ? (
          <CustomerErrorState />
        ) : sortedMembers.length === 0 ? (
          <CustomerEmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {sortedMembers.map((member, index) => (
                <motion.div key={member.user_id || index} layout transition={{ layout: { duration: 0.2 } }}>
                  <CustomerCard member={member} userData={userStatsMap[member.user_id]} onClick={handleCustomerClick} />
                </motion.div>
              ))}
            </div>

            {hasNextPage && (
              <div ref={sentinelRef} className="flex justify-center py-6">
                {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-gray-400" />}
              </div>
            )}
          </>
        )}

        {/* Customer Detail Modal */}
        <CustomerDetailModal
          customer={selectedCustomer}
          brandId={brandId}
          initialData={selectedCustomer ? userStatsMap[selectedCustomer.user_id] : undefined}
          onClose={() => setSelectedCustomer(null)}
        />
      </div>
    </div>
  )
}
