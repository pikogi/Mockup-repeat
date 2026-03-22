import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { format, subDays, addDays, startOfMonth } from 'date-fns'

export function useDashboardHome(brandId) {
  const [dateFilter, setDateFilter] = useState('default')
  const [customDate, setCustomDate] = useState({
    from: new Date(),
    to: new Date(),
  })
  const [selectedStore, setSelectedStore] = useState('all')

  const storeId = selectedStore !== 'all' ? selectedStore : null

  // Stable key for customDate to avoid query refetches on unrelated state changes
  const customDateKey = dateFilter === 'custom' ? `${customDate.from?.getTime()}-${customDate.to?.getTime()}` : ''

  const getDateRange = useCallback(() => {
    const now = new Date()
    if (dateFilter === '7d') return { start: subDays(now, 7), end: now }
    if (dateFilter === 'month') return { start: startOfMonth(now), end: now }
    if (dateFilter === 'custom' && customDate?.from) {
      return { start: customDate.from, end: customDate.to || customDate.from }
    }
    return { start: subDays(now, 30), end: now }
  }, [dateFilter, customDate])

  // Stores for filter dropdown
  const { data: stores = [] } = useQuery({
    queryKey: ['stores', brandId],
    queryFn: async () => {
      if (!brandId) return []
      const res = await api.stores.list(brandId)
      const raw = res?.data || res || []
      return raw.map((store) => {
        const id = store.store_id || store.id
        return { ...store, id, store_id: id }
      })
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Brand stats (stamps, rewards, total_users, total_active_programs)
  const { data: brandStats, isLoading: statsLoading } = useQuery({
    queryKey: ['brandStats', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return null
      const range = getDateRange()
      const from = format(range.start, 'yyyy-MM-dd')
      const to = format(addDays(range.end, 1), 'yyyy-MM-dd')
      const res = await api.brands.getStats(brandId, { storeId, from, to })
      return res?.data || res || null
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })

  // Daily new user history for chart — replaces both brandTotalMembersCount and brandRangedUsers queries
  const { data: userHistory = [] } = useQuery({
    queryKey: ['brandUserHistory', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      const range = getDateRange()
      const from = format(range.start, 'yyyy-MM-dd')
      const to = format(addDays(range.end, 1), 'yyyy-MM-dd')
      const res = await api.brands.getStatsUsers(brandId, { from, to, storeId })
      return res?.data || res || []
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Daily transaction history for stamps chart
  const { data: transactionHistory = [] } = useQuery({
    queryKey: ['brandTransactionHistory', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      const range = getDateRange()
      const from = format(range.start, 'yyyy-MM-dd')
      const to = format(addDays(range.end, 1), 'yyyy-MM-dd')
      const res = await api.brands.getStatsTransactions(brandId, { from, to, storeId })
      return res?.data || res || []
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Daily redemption history for rewards chart
  const { data: redemptionHistory = [] } = useQuery({
    queryKey: ['brandRedemptionHistory', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      const range = getDateRange()
      const from = format(range.start, 'yyyy-MM-dd')
      const to = format(addDays(range.end, 1), 'yyyy-MM-dd')
      const res = await api.brands.getStatsRedemptions(brandId, { from, to, storeId })
      return res?.data || res || []
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Derived stats — directly from brandStats, no extra queries needed
  const membersCount = brandStats?.total_users ?? 0
  const activePrograms = brandStats?.total_active_programs ?? 0
  const stampsCount = brandStats?.transactions_by_type?.stamp_added ?? 0
  const rewardsCount = brandStats?.total_completed_redemptions ?? 0

  // Chart data combining user history + transaction history + redemption history
  const chartData = useMemo(() => {
    const range = getDateRange()

    // Build day-by-day maps
    const usersByDate = new Map()
    userHistory.forEach((entry) => {
      if (entry.date) usersByDate.set(entry.date, entry.new_users ?? 0)
    })

    const stampsByDate = new Map()
    transactionHistory.forEach((entry) => {
      if (entry.date) stampsByDate.set(entry.date, entry.stamp_added ?? 0)
    })

    const redemptionsByDate = new Map()
    redemptionHistory.forEach((entry) => {
      if (entry.date) redemptionsByDate.set(entry.date, entry.completed ?? 0)
    })

    // Generate one entry per day in the range
    const days = []
    const cursor = new Date(range.start)
    cursor.setHours(0, 0, 0, 0)
    const end = new Date(range.end)
    end.setHours(23, 59, 59, 999)

    while (cursor <= end) {
      days.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }

    if (days.length === 0) return []

    return days.map((day) => {
      const key = format(day, 'yyyy-MM-dd')
      return {
        date: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        fullDate: day.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        adds: usersByDate.get(key) ?? 0,
        scans: stampsByDate.get(key) ?? 0,
        redemptions: redemptionsByDate.get(key) ?? 0,
      }
    })
  }, [userHistory, transactionHistory, redemptionHistory, getDateRange])

  return {
    // Filters
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    selectedStore,
    setSelectedStore,
    stores,

    // Stats
    membersCount,
    activePrograms,
    stampsCount,
    rewardsCount,

    // Chart
    chartData,

    // Loading
    statsLoading,
  }
}
