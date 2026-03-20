import { useState, useMemo, useCallback } from 'react'
import { api } from '@/api/client'
import { getCurrentUser } from '@/utils/jwt'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

const PAGE_LIMIT = 25

export function useCustomers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [sortBy, setSortBy] = useState('date')

  const user = getCurrentUser()

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me()
      return res?.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  const brandIdFromStorage = localStorage.getItem('brand_id')
  const brandId = brandIdFromStorage || meData?.brands?.[0]?.brand_id
  const brand = meData?.brands?.find((b) => b.brand_id === brandId) || meData?.brands?.[0] || null

  // Loyalty programs (shares cache with useMyPrograms via same queryKey)
  const { data: programs = [], isFetched: programsFetched } = useQuery({
    queryKey: ['loyaltyPrograms', brandId],
    queryFn: async () => {
      if (!brandId) return []
      const res = await api.loyaltyPrograms.list(brandId)
      return res?.data || res || []
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  const cards = useMemo(
    () =>
      programs.map((program) => ({
        id: program.program_id || program.id,
        club_name: program.program_name,
        card_title: program.program_name,
      })),
    [programs],
  )

  // Server-side cursor pagination with useInfiniteQuery
  const programFilter = selectedCard === 'all' ? null : selectedCard

  const {
    data,
    isLoading: membersLoading,
    isError: membersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['brandUsers', brandId, programFilter],
    queryFn: async ({ pageParam }) => {
      const params = { limit: PAGE_LIMIT }
      if (pageParam) params.cursor = pageParam
      if (programFilter) params.programId = programFilter
      const res = await api.brands.getUsers(brandId, params)
      return res
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.pagination?.next_cursor ?? undefined,
    enabled: !!brandId && programsFetched,
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = meLoading || (!brandId ? false : !programsFetched || membersLoading)

  // Flatten paginated results into members array
  const members = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => {
      const items = Array.isArray(page?.data) ? page.data : []
      return items.map((user) => ({
        user_id: user.user_id || user.id,
        full_name: user.full_name || user.customer_full_name || null,
        email: user.email || null,
        phone: user.phone_number || user.phone || null,
        birth_date: user.birth_date || null,
        created_at: user.created_at || user.created_date,
        loyalty_cards: user.loyalty_cards || [],
        programs: (user.loyalty_cards || []).map((lc) => ({
          program_id: lc.program?.program_id,
          program_name: lc.program?.program_name,
          program_rules: lc.program?.program_rules,
        })),
      }))
    })
  }, [data])

  const totalCount = data?.pages?.[0]?.pagination?.total ?? 0

  // Client-side search filter on loaded data
  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
          (member.email || '').toLowerCase().includes(q) ||
          (member.full_name || '').toLowerCase().includes(q) ||
          (member.phone || '').includes(searchQuery)
        )
      }),
    [members, searchQuery],
  )

  // Build userStatsMap from inline data (same shape as stats/users/{userId} response)
  const userStatsMap = useMemo(() => {
    const map = {}
    for (const member of members) {
      map[member.user_id] = {
        loyalty_cards: member.loyalty_cards,
        full_name: member.full_name,
        email: member.email,
        phone: member.phone,
        birth_date: member.birth_date,
        registered_at: member.created_at,
      }
    }
    return map
  }, [members])

  // Sort
  const sortedMembers = useMemo(() => {
    if (sortBy === 'date') {
      return [...filteredMembers].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    }
    return [...filteredMembers].sort((a, b) => {
      const aData = userStatsMap[a.user_id]
      const bData = userStatsMap[b.user_id]
      if (sortBy === 'stamps') {
        return (bData?.loyalty_cards?.[0]?.current_balance ?? 0) - (aData?.loyalty_cards?.[0]?.current_balance ?? 0)
      }
      if (sortBy === 'visits') {
        return (bData?.loyalty_cards?.[0]?.total_visits ?? 0) - (aData?.loyalty_cards?.[0]?.total_visits ?? 0)
      }
      return 0
    })
  }, [filteredMembers, sortBy, userStatsMap])

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleCardChange = useCallback((v) => {
    setSelectedCard(v)
    setSearchQuery('')
  }, [])

  const handleSortChange = useCallback((v) => {
    setSortBy(v)
  }, [])

  return {
    brandId,
    brand,
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
  }
}
