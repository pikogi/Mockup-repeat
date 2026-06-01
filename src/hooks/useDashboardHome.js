import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { addDaysUTC, formatDateUTC, startOfMonthUTC, subDaysUTC } from '@/utils/date'

const calcTrend = (current, prev) => {
  if (prev == null || prev === 0) return null
  const pct = Math.round(((current - prev) / prev) * 100)
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

// ── Mock data for demo mode ───────────────────────────────────
const MOCK_NAMES = [
  'María González',
  'Juan García',
  'Carlos Rodríguez',
  'Ana Martínez',
  'Luis Fernández',
  'Laura López',
  'Diego Sánchez',
  'Sofía Pérez',
  'Martín Torres',
  'Valentina Díaz',
  'Pablo Moreno',
  'Camila Ruiz',
  'Andrés Vargas',
  'Florencia Castro',
  'Sebastián Romero',
  'Lucía Navarro',
  'Nicolás Herrera',
  'Valeria Jiménez',
  'Tomás Molina',
  'Gabriela Medina',
]

const MOCK_DAILY = [
  { adds: 3, scans: 22, points: 310, redemptions: 2, completions: 2 },
  { adds: 5, scans: 31, points: 480, redemptions: 3, completions: 3 },
  { adds: 2, scans: 19, points: 260, redemptions: 1, completions: 1 },
  { adds: 4, scans: 28, points: 420, redemptions: 3, completions: 3 },
  { adds: 6, scans: 35, points: 550, redemptions: 4, completions: 4 },
  { adds: 3, scans: 25, points: 390, redemptions: 3, completions: 3 },
  { adds: 2, scans: 18, points: 240, redemptions: 3, completions: 2 },
]
const MOCK_PREV_DAILY = [
  { adds: 2, scans: 18, points: 250, redemptions: 1, completions: 1 },
  { adds: 3, scans: 22, points: 320, redemptions: 2, completions: 2 },
  { adds: 4, scans: 24, points: 360, redemptions: 2, completions: 2 },
  { adds: 2, scans: 16, points: 210, redemptions: 1, completions: 1 },
  { adds: 5, scans: 29, points: 440, redemptions: 3, completions: 3 },
  { adds: 2, scans: 21, points: 300, redemptions: 2, completions: 2 },
  { adds: 1, scans: 14, points: 180, redemptions: 2, completions: 1 },
]

const MOCK_TOP_CUSTOMERS = [
  { id: 1, name: 'Paula Vega', email: 'pau@email.com', visits: 33, stamps: 33, lastVisit: '29 may 2026' },
  { id: 2, name: 'Lucía Fernández', email: 'lucia@email.com', visits: 31, stamps: 31, lastVisit: '29 may 2026' },
  { id: 3, name: 'Sofía Martínez', email: 'sofi@email.com', visits: 29, stamps: 29, lastVisit: '28 may 2026' },
  { id: 4, name: 'Camila Torres', email: 'cami@email.com', visits: 27, stamps: 27, lastVisit: '28 may 2026' },
  { id: 5, name: 'Valentina Ríos', email: 'vale@email.com', visits: 24, stamps: 24, lastVisit: '28 may 2026' },
  { id: 6, name: 'Ana García', email: 'ana@email.com', visits: 22, stamps: 22, lastVisit: '29 may 2026' },
  { id: 7, name: 'Nicolás Peralta', email: 'nico@email.com', visits: 20, stamps: 20, lastVisit: '25 may 2026' },
  { id: 8, name: 'Julieta Morales', email: 'juli@email.com', visits: 19, stamps: 19, lastVisit: '26 may 2026' },
  { id: 9, name: 'Martín Gómez', email: 'martin@email.com', visits: 18, stamps: 18, lastVisit: '27 may 2026' },
  { id: 10, name: 'Sebastián López', email: 'seba@email.com', visits: 15, stamps: 15, lastVisit: '22 may 2026' },
]

const ACTIVITY_DAILY_30 = [
  { adds: 2, scans: 18, completions: 2, redemptions: 3 },
  { adds: 3, scans: 25, completions: 3, redemptions: 3 },
  { adds: 6, scans: 35, completions: 4, redemptions: 4 },
  { adds: 4, scans: 28, completions: 3, redemptions: 3 },
  { adds: 2, scans: 19, completions: 1, redemptions: 1 },
  { adds: 5, scans: 31, completions: 3, redemptions: 3 },
  { adds: 3, scans: 22, completions: 2, redemptions: 2 },
  { adds: 4, scans: 26, completions: 2, redemptions: 2 },
  { adds: 1, scans: 12, completions: 1, redemptions: 1 },
  { adds: 5, scans: 33, completions: 3, redemptions: 4 },
  { adds: 3, scans: 21, completions: 2, redemptions: 2 },
  { adds: 2, scans: 17, completions: 1, redemptions: 1 },
  { adds: 4, scans: 29, completions: 3, redemptions: 3 },
  { adds: 6, scans: 38, completions: 4, redemptions: 5 },
  { adds: 3, scans: 24, completions: 2, redemptions: 2 },
  { adds: 2, scans: 16, completions: 1, redemptions: 1 },
  { adds: 5, scans: 30, completions: 3, redemptions: 3 },
  { adds: 4, scans: 27, completions: 2, redemptions: 2 },
  { adds: 3, scans: 20, completions: 2, redemptions: 2 },
  { adds: 1, scans: 11, completions: 1, redemptions: 1 },
  { adds: 4, scans: 25, completions: 2, redemptions: 3 },
  { adds: 5, scans: 32, completions: 3, redemptions: 3 },
  { adds: 2, scans: 18, completions: 1, redemptions: 2 },
  { adds: 3, scans: 23, completions: 2, redemptions: 2 },
  { adds: 4, scans: 28, completions: 3, redemptions: 3 },
  { adds: 2, scans: 15, completions: 1, redemptions: 1 },
  { adds: 5, scans: 34, completions: 3, redemptions: 4 },
  { adds: 3, scans: 22, completions: 2, redemptions: 2 },
  { adds: 4, scans: 26, completions: 2, redemptions: 3 },
  { adds: 2, scans: 17, completions: 1, redemptions: 1 },
]

const MOCK_ACTIVITY_EVENTS = (() => {
  const now = new Date()
  const allEvents = []

  ACTIVITY_DAILY_30.forEach((day, dayIdx) => {
    const date = new Date(now)
    date.setUTCDate(date.getUTCDate() - dayIdx)
    const dateStr = date.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    const dateKey = date.toISOString().split('T')[0]

    const raw = []
    for (let i = 0; i < day.adds; i++) raw.push({ type: 'new_user', min: (dayIdx * 97 + i * 41) % 780 })
    for (let i = 0; i < day.scans; i++) raw.push({ type: 'stamp', min: (dayIdx * 61 + i * 29) % 780 })
    for (let i = 0; i < day.completions; i++) raw.push({ type: 'completed', min: (dayIdx * 113 + i * 53) % 780 })
    for (let i = 0; i < day.redemptions; i++) raw.push({ type: 'reward', min: (dayIdx * 79 + i * 67) % 780 })

    raw.sort((a, b) => b.min - a.min)

    raw.forEach(({ type, min }, i) => {
      const hour = 9 + Math.floor(min / 60)
      const minute = min % 60
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      const nameIdx = (dayIdx * 7 + i * 3 + type.length) % MOCK_NAMES.length
      allEvents.push({ id: `${dateKey}-${type}-${i}`, type, userName: MOCK_NAMES[nameIdx], time, dateStr, dateKey })
    })
  })

  return allEvents
})()

function buildMockReturn(dateFilter) {
  const now = new Date()
  const days = MOCK_DAILY.map((d, i) => {
    const day = new Date(now)
    day.setUTCDate(day.getUTCDate() - (6 - i))
    return {
      dayOfWeek: day.getUTCDay(),
      date: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      fullDate: day.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
      adds: d.adds,
      scans: d.scans,
      points: d.points,
      completions: d.completions,
      redemptions: d.redemptions,
      returning: Math.max(d.scans - d.adds, 0),
      prevAdds: MOCK_PREV_DAILY[i].adds,
      prevScans: MOCK_PREV_DAILY[i].scans,
      prevPoints: MOCK_PREV_DAILY[i].points,
      prevRedemptions: MOCK_PREV_DAILY[i].redemptions,
      prevReturning: Math.max(MOCK_PREV_DAILY[i].scans - MOCK_PREV_DAILY[i].adds, 0),
    }
  })

  const visitasCount = MOCK_DAILY.reduce((s, d) => s + d.scans, 0)
  const prevVisitasCount = MOCK_PREV_DAILY.reduce((s, d) => s + d.scans, 0)
  const newMembersInPeriod = MOCK_DAILY.reduce((s, d) => s + d.adds, 0)
  const prevNewMembersInPeriod = MOCK_PREV_DAILY.reduce((s, d) => s + d.adds, 0)
  const stampsCount = visitasCount
  const prevStampsCount = prevVisitasCount
  const rewardsCount = MOCK_DAILY.reduce((s, d) => s + d.redemptions, 0)
  const prevRewardsCount = MOCK_PREV_DAILY.reduce((s, d) => s + d.redemptions, 0)
  const membersCount = 342
  const redemptionRate = Math.round((rewardsCount / visitasCount) * 100 * 10) / 10

  return {
    dateFilter,
    setDateFilter: () => {},
    customDate: { from: new Date(), to: new Date() },
    setCustomDate: () => {},
    selectedStore: 'all',
    setSelectedStore: () => {},
    stores: [],
    membersCount,
    newMembersInPeriod,
    activePrograms: 2,
    stampsCount,
    pointsCount: 3240,
    rewardsCount,
    redemptionRate,
    visitasCount,
    uniqueVisitors: Math.round(visitasCount * 0.68),
    avgDailyVisits: Math.round(visitasCount / 7),
    returningVisits: Math.max(visitasCount - newMembersInPeriod, 0),
    activeMembers: Math.round(membersCount * 0.62),
    progressClubs: [
      {
        id: 'sellos',
        name: 'Club Sellos',
        type: 'stamps',
        distribution: [
          { label: '1 sello', count: 98 },
          { label: '2 sellos', count: 72 },
          { label: '3 sellos', count: 54 },
          { label: '4 sellos', count: 31 },
          { label: 'Canjearon', count: 19, ready: true },
        ],
      },
      {
        id: 'puntos',
        name: 'Club Puntos',
        type: 'points',
        distribution: [
          { label: '0 – 25%', count: 142 },
          { label: '25 – 50%', count: 89 },
          { label: '50 – 75%', count: 58 },
          { label: '75 – 99%', count: 34 },
          { label: 'Canjearon', count: 21, ready: true },
        ],
      },
    ],
    peakDay: days.reduce((max, d) => (d.scans > (max?.scans ?? 0) ? d : max), null),
    membersTrend: calcTrend(membersCount, 318),
    newMembersTrend: calcTrend(newMembersInPeriod, prevNewMembersInPeriod),
    stampsTrend: calcTrend(stampsCount, prevStampsCount),
    rewardsTrend: calcTrend(rewardsCount, prevRewardsCount),
    redemptionRateTrend: calcTrend(Math.round(redemptionRate), 9),
    visitasTrend: calcTrend(visitasCount, prevVisitasCount),
    chartData: days,
    activityEvents: MOCK_ACTIVITY_EVENTS,
    topCustomers: MOCK_TOP_CUSTOMERS,
    statsLoading: false,
  }
}

export function useDashboardHome(brandId, { demo = false } = {}) {
  const [dateFilter, setDateFilter] = useState('7d')
  const [customDate, setCustomDate] = useState({ from: new Date(), to: new Date() })
  const [selectedStore, setSelectedStore] = useState('all')

  const storeId = selectedStore !== 'all' ? selectedStore : null
  const customDateKey = dateFilter === 'custom' ? `${customDate.from?.getTime()}-${customDate.to?.getTime()}` : ''

  const getDateRange = useCallback(() => {
    const now = new Date()
    if (dateFilter === '7d') return { start: subDaysUTC(now, 7), end: now }
    if (dateFilter === 'month') return { start: startOfMonthUTC(now), end: now }
    if (dateFilter === 'custom' && customDate?.from) {
      return { start: customDate.from, end: customDate.to || customDate.from }
    }
    return { start: subDaysUTC(now, 30), end: now }
  }, [dateFilter, customDate])

  const getPrevDateRange = useCallback(() => {
    const current = getDateRange()
    const durationDays = Math.round((current.end.getTime() - current.start.getTime()) / 86400000) + 1
    return {
      start: subDaysUTC(current.start, durationDays),
      end: subDaysUTC(current.start, 1),
    }
  }, [getDateRange])

  // Stores for filter dropdown
  const { data: stores = [] } = useQuery({
    queryKey: ['stores', brandId],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const res = await api.stores.list(brandId)
        const raw = res?.data || res || []
        return raw.map((store) => {
          const id = store.store_id || store.id
          return { ...store, id, store_id: id }
        })
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  // ── Current period ────────────────────────────────────────────

  const { data: brandStats, isLoading: statsLoading } = useQuery({
    queryKey: ['brandStats', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return null
      try {
        const range = getDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStats(brandId, { storeId, from, to })
        return res?.data || res || null
      } catch (error) {
        if (error?.response?.status === 404) return null
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })

  const { data: userHistory = [] } = useQuery({
    queryKey: ['brandUserHistory', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const range = getDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStatsUsers(brandId, { from, to, storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  const { data: transactionHistory = [] } = useQuery({
    queryKey: ['brandTransactionHistory', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const range = getDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStatsTransactions(brandId, { from, to, storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  const { data: redemptionHistory = [] } = useQuery({
    queryKey: ['brandRedemptionHistory', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const range = getDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStatsRedemptions(brandId, { from, to, storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  // ── Previous period ───────────────────────────────────────────

  const { data: prevBrandStats } = useQuery({
    queryKey: ['brandStatsPrev', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return null
      try {
        const range = getPrevDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStats(brandId, { storeId, from, to })
        return res?.data || res || null
      } catch (error) {
        if (error?.response?.status === 404) return null
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  const { data: prevUserHistory = [] } = useQuery({
    queryKey: ['brandUserHistoryPrev', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const range = getPrevDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStatsUsers(brandId, { from, to, storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  const { data: prevTransactionHistory = [] } = useQuery({
    queryKey: ['brandTransactionHistoryPrev', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const range = getPrevDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStatsTransactions(brandId, { from, to, storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  const { data: prevRedemptionHistory = [] } = useQuery({
    queryKey: ['brandRedemptionHistoryPrev', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const range = getPrevDateRange()
        const from = formatDateUTC(range.start)
        const to = formatDateUTC(addDaysUTC(range.end, 1))
        const res = await api.brands.getStatsRedemptions(brandId, { from, to, storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId && !demo,
    staleTime: 5 * 60 * 1000,
  })

  // ── Derived metrics ───────────────────────────────────────────

  const membersCount = brandStats?.total_users ?? 0
  const activePrograms = brandStats?.total_active_programs ?? 0
  const stampsCount = brandStats?.transactions_by_type?.stamp_added ?? 0
  const rewardsCount = brandStats?.total_completed_redemptions ?? 0
  const redemptionRate = brandStats?.redemption_rate ?? 0

  const visitasCount = useMemo(() => {
    const types = brandStats?.transactions_by_type ?? {}
    return Object.values(types).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0)
  }, [brandStats])

  const newMembersInPeriod = useMemo(() => userHistory.reduce((sum, e) => sum + (e.new_users ?? 0), 0), [userHistory])

  const prevMembersCount = prevBrandStats?.total_users ?? 0
  const prevStampsCount = prevBrandStats?.transactions_by_type?.stamp_added ?? 0
  const prevRewardsCount = prevBrandStats?.total_completed_redemptions ?? 0
  const prevRedemptionRate = prevBrandStats?.redemption_rate ?? 0

  const prevVisitasCount = useMemo(() => {
    const types = prevBrandStats?.transactions_by_type ?? {}
    return Object.values(types).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0)
  }, [prevBrandStats])

  const prevNewMembersInPeriod = useMemo(
    () => prevUserHistory.reduce((sum, e) => sum + (e.new_users ?? 0), 0),
    [prevUserHistory],
  )

  const membersTrend = prevBrandStats ? calcTrend(membersCount, prevMembersCount) : null
  const newMembersTrend = prevBrandStats ? calcTrend(newMembersInPeriod, prevNewMembersInPeriod) : null
  const stampsTrend = prevBrandStats ? calcTrend(stampsCount, prevStampsCount) : null
  const rewardsTrend = prevBrandStats ? calcTrend(rewardsCount, prevRewardsCount) : null
  const redemptionRateTrend = prevBrandStats
    ? calcTrend(Math.round(redemptionRate), Math.round(prevRedemptionRate))
    : null
  const visitasTrend = prevBrandStats ? calcTrend(visitasCount, prevVisitasCount) : null

  // ── Chart data ────────────────────────────────────────────────

  const chartData = useMemo(() => {
    const range = getDateRange()
    const prevRange = getPrevDateRange()

    const usersByDate = new Map()
    userHistory.forEach((e) => {
      if (e.date) usersByDate.set(e.date, e.new_users ?? 0)
    })
    const stampsByDate = new Map()
    transactionHistory.forEach((e) => {
      if (e.date) stampsByDate.set(e.date, e.stamp_added ?? 0)
    })
    const completionsByDate = new Map()
    transactionHistory.forEach((e) => {
      if (e.date) completionsByDate.set(e.date, e.reward_redeemed ?? 0)
    })
    const redemptionsByDate = new Map()
    redemptionHistory.forEach((e) => {
      if (e.date) redemptionsByDate.set(e.date, e.completed ?? 0)
    })

    const prevUsersByDate = new Map()
    prevUserHistory.forEach((e) => {
      if (e.date) prevUsersByDate.set(e.date, e.new_users ?? 0)
    })
    const prevStampsByDate = new Map()
    prevTransactionHistory.forEach((e) => {
      if (e.date) prevStampsByDate.set(e.date, e.stamp_added ?? 0)
    })
    const prevRedemptionsByDate = new Map()
    prevRedemptionHistory.forEach((e) => {
      if (e.date) prevRedemptionsByDate.set(e.date, e.completed ?? 0)
    })

    const days = []
    const cursor = new Date(range.start)
    cursor.setUTCHours(0, 0, 0, 0)
    const end = new Date(range.end)
    end.setUTCHours(23, 59, 59, 999)
    while (cursor <= end) {
      days.push(new Date(cursor))
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }

    const prevDays = []
    const prevCursor = new Date(prevRange.start)
    prevCursor.setUTCHours(0, 0, 0, 0)
    const prevEnd = new Date(prevRange.end)
    prevEnd.setUTCHours(23, 59, 59, 999)
    while (prevCursor <= prevEnd) {
      prevDays.push(new Date(prevCursor))
      prevCursor.setUTCDate(prevCursor.getUTCDate() + 1)
    }

    if (days.length === 0) return []

    return days.map((day, i) => {
      const key = formatDateUTC(day)
      const prevDay = prevDays[i]
      const prevKey = prevDay ? formatDateUTC(prevDay) : null
      return {
        dayOfWeek: day.getUTCDay(),
        date: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        fullDate: day.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        }),
        adds: usersByDate.get(key) ?? 0,
        scans: stampsByDate.get(key) ?? 0,
        completions: completionsByDate.get(key) ?? 0,
        redemptions: redemptionsByDate.get(key) ?? 0,
        prevAdds: prevKey != null ? (prevUsersByDate.get(prevKey) ?? 0) : null,
        prevScans: prevKey != null ? (prevStampsByDate.get(prevKey) ?? 0) : null,
        prevRedemptions: prevKey != null ? (prevRedemptionsByDate.get(prevKey) ?? 0) : null,
      }
    })
  }, [
    userHistory,
    transactionHistory,
    redemptionHistory,
    prevUserHistory,
    prevTransactionHistory,
    prevRedemptionHistory,
    getDateRange,
    getPrevDateRange,
  ])

  const avgDailyVisits = chartData.length > 0 ? Math.round(visitasCount / chartData.length) : 0
  const returningVisits = Math.max(visitasCount - newMembersInPeriod, 0)
  const activeMembers = Math.round(membersCount * 0.62)
  const progressClubs = [
    {
      id: 'sellos',
      name: 'Club Sellos',
      type: 'stamps',
      distribution: [
        { label: '1 sello', count: Math.round(membersCount * 0.286) },
        { label: '2 sellos', count: Math.round(membersCount * 0.21) },
        { label: '3 sellos', count: Math.round(membersCount * 0.158) },
        { label: '4 sellos', count: Math.round(membersCount * 0.09) },
        { label: 'Canjearon', count: Math.round(membersCount * 0.056), ready: true },
      ],
    },
    {
      id: 'puntos',
      name: 'Club Puntos',
      type: 'points',
      distribution: [
        { label: '0 – 25%', count: Math.round(membersCount * 0.415) },
        { label: '25 – 50%', count: Math.round(membersCount * 0.26) },
        { label: '50 – 75%', count: Math.round(membersCount * 0.17) },
        { label: '75 – 99%', count: Math.round(membersCount * 0.099) },
        { label: 'Canjearon', count: Math.round(membersCount * 0.056), ready: true },
      ],
    },
  ]

  const peakDay = useMemo(() => {
    if (chartData.length === 0) return null
    const best = chartData.reduce((max, d) => (d.scans > (max?.scans ?? 0) ? d : max), null)
    return best?.scans > 0 ? best : null
  }, [chartData])

  if (demo) return buildMockReturn(dateFilter)

  return {
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    selectedStore,
    setSelectedStore,
    stores,
    membersCount,
    newMembersInPeriod,
    activePrograms,
    stampsCount,
    rewardsCount,
    redemptionRate,
    visitasCount,
    uniqueVisitors: 0,
    pointsCount: 0,
    avgDailyVisits,
    returningVisits,
    activeMembers,
    progressClubs,
    peakDay,
    membersTrend,
    newMembersTrend,
    stampsTrend,
    rewardsTrend,
    redemptionRateTrend,
    visitasTrend,
    chartData,
    activityEvents: [],
    topCustomers: [],
    statsLoading,
  }
}
