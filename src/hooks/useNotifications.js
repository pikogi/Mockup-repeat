import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

export function useNotifications(brandId) {
  const { t } = useLanguage()

  // Form state
  const [programId, setProgramId] = useState('')
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Programs list for the selector
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['loyaltyPrograms', brandId],
    queryFn: async () => {
      if (!brandId) return []
      const res = await api.loyaltyPrograms.list(brandId)
      const raw = res?.data || res || []
      return raw.map((p) => ({
        id: p.program_id || p.id,
        name: p.program_name,
      }))
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  const canSend = useMemo(() => header.trim().length > 0 && body.trim().length > 0, [header, body])

  const resetForm = useCallback(() => {
    setHeader('')
    setBody('')
    setProgramId('')
  }, [])

  const handleSend = useCallback(async () => {
    if (!brandId || !canSend) return
    setIsSending(true)
    try {
      toast.success(t('notificationSent'))
      resetForm()
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || t('notificationError'))
    } finally {
      setIsSending(false)
    }
  }, [brandId, canSend, resetForm, t])

  return {
    programs,
    programsLoading,
    programId,
    setProgramId,
    header,
    setHeader,
    body,
    setBody,
    isSending,
    canSend,
    handleSend,
  }
}
