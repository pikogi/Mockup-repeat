import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

function normalizeStores(raw) {
  return raw.map((store) => {
    const id = store.store_id || store.id
    return { ...store, id, store_id: id }
  })
}

function mapProgramToCard(program) {
  return {
    id: program.program_id || program.id,
    club_name: program.program_name,
    card_title: program.program_name,
    description: program.description,
    logo_url: program.brand?.logo_url || program.wallet_design?.logo_url || program.program_rules?.logo_url || '',
    card_color: program.wallet_design?.hex_background_color || program.program_rules?.card_color || '#000000',
    gradient_color: program.program_rules?.gradient_color || '#F59E0B',
    reward_text: program.reward_description,
    reward_tiers: program.reward_rules?.reward_tiers || [],
    terms: program.program_rules?.terms || '',
    stamps_required: program.program_rules?.stamps_required || 20,
    is_active: program.is_active !== false,
    contact_email: program.program_rules?.contact_email || '',
    contact_phone: program.program_rules?.contact_phone || '',
    website: program.program_rules?.website || '',
    security_ticket_required: program.program_rules?.security_ticket_required || false,
    security_geofence_required: program.program_rules?.security_geofence_required || false,
    security_cooldown_hours: program.program_rules?.security_cooldown_hours || 0,
    validity_stamps_days: program.program_rules?.card_validity_days ?? program.program_rules?.validity_stamps_days ?? 0,
    validity_reward_days: program.program_rules?.validity_reward_days || 0,
    validity_duration_days: program.program_rules?.validity_duration_days || 0,
    collect_name: program.program_rules?.collect_name !== false,
    collect_email: program.program_rules?.collect_email !== false,
    collect_phone: program.program_rules?.collect_phone || false,
    collect_birthday: program.program_rules?.collect_birthday || false,
    created_date: program.created_date || program.start_date,
    short_url: program.short_url || null,
    member_count: program.member_count || 0,
  }
}

export function useMyPrograms(brandId) {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [deletingIds, setDeletingIds] = useState({})
  const [selectedStore, setSelectedStore] = useState('all')

  const storeId = selectedStore !== 'all' ? selectedStore : null

  // Stores for filter dropdown
  const { data: stores = [] } = useQuery({
    queryKey: ['stores', brandId],
    queryFn: async () => {
      if (!brandId) return []
      try {
        const res = await api.stores.list(brandId)
        const raw = res?.data || res || []
        return normalizeStores(raw)
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  const queryKey = useMemo(() => ['loyaltyPrograms', brandId, storeId], [brandId, storeId])

  const { data: programs = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!brandId) return []
      try {
        const res = await api.loyaltyPrograms.list(brandId, { storeId })
        return res?.data || res || []
      } catch (error) {
        if (error?.response?.status === 404) return []
        throw error
      }
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  const cards = useMemo(() => programs.map(mapProgramToCard), [programs])

  // Derive member counts from program data instead of separate queries
  const memberCounts = useMemo(() => {
    const counts = {}
    for (const p of programs) {
      const id = p.program_id || p.id
      if (id) counts[id] = p.member_count || 0
    }
    return counts
  }, [programs])

  // Toggle active — optimistic update via queryClient
  const toggleProgramActive = async (programId, newActiveState) => {
    const previous = queryClient.getQueryData(queryKey)

    queryClient.setQueryData(queryKey, (old) =>
      old?.map((p) => ((p.program_id || p.id) === programId ? { ...p, is_active: newActiveState } : p)),
    )

    try {
      await api.loyaltyPrograms.update(programId, { is_active: newActiveState })
      toast.success(newActiveState ? t('programActivated') : t('programDeactivated'))
    } catch (error) {
      queryClient.setQueryData(queryKey, previous)
      toast.error(error?.message || t('programToggleError'))
    }
  }

  // Delete — optimistic remove
  const deleteProgram = async (programId) => {
    if (!programId) return
    const previous = queryClient.getQueryData(queryKey)

    setDeletingIds((prev) => ({ ...prev, [programId]: true }))
    queryClient.setQueryData(queryKey, (old) => old?.filter((p) => (p.program_id || p.id) !== programId))

    try {
      await api.loyaltyPrograms.delete(programId)
      queryClient.invalidateQueries({ queryKey: ['brandUsers'] })
      toast.success(t('programDeleted'))
    } catch (error) {
      const isNotFound = error?.response?.status === 404
      if (!isNotFound) {
        queryClient.setQueryData(queryKey, previous)
        toast.error(error?.message || t('programDeleteError'))
      } else {
        toast.success(t('programDeleted'))
      }
    } finally {
      setDeletingIds((prev) => {
        // eslint-disable-next-line no-unused-vars
        const { [programId]: _, ...rest } = prev
        return rest
      })
    }
  }

  const isDeletingProgram = (programId) => !!deletingIds[programId]

  return {
    cards,
    isLoading,
    memberCounts,
    toggleProgramActive,
    deleteProgram,
    isDeletingProgram,
    stores,
    selectedStore,
    setSelectedStore,
  }
}
