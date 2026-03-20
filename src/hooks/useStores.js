import { useState, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import { toast } from 'sonner'

export function useStores(brandId) {
  const queryClient = useQueryClient()

  // UI state
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isQrOpen, setQrOpen] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [selectedQrStore, setSelectedQrStore] = useState(null)
  const [formData, setFormData] = useState({ name: '', address: '', city: '', lat: 0, lng: 0 })
  const [deletingIds, setDeletingIds] = useState({})
  const [isMutating, setIsMutating] = useState(false)

  const queryKey = useMemo(() => ['stores', brandId], [brandId])

  // Stores list — shared cache with useDashboardHome and useClubForm
  const { data: stores = [], isLoading } = useQuery({
    queryKey,
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

  // Form helpers
  const resetForm = useCallback(() => {
    setFormData({ name: '', address: '', city: '', lat: 0, lng: 0 })
    setEditingStore(null)
  }, [])

  const handleClose = useCallback(() => {
    setDialogOpen(false)
    resetForm()
  }, [resetForm])

  const handleEdit = useCallback((store) => {
    setEditingStore(store)
    setFormData({
      name: store.store_name || '',
      address: store.address || '',
      city: store.city || '',
      lat: store.latitude || 0,
      lng: store.longitude || 0,
    })
    setDialogOpen(true)
  }, [])

  const handleShowQr = useCallback((store) => {
    setSelectedQrStore(store)
    setQrOpen(true)
  }, [])

  // Create store — optimistic update
  const createStore = useCallback(
    async (storeData) => {
      if (!brandId) return
      setIsMutating(true)
      const tempId = `temp-${Date.now()}`
      const optimisticStore = {
        id: tempId,
        store_id: tempId,
        store_name: storeData.name,
        address: storeData.address || '',
        city: storeData.city || '',
        latitude: storeData.lat || null,
        longitude: storeData.lng || null,
      }
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old) => [...(old || []), optimisticStore])

      try {
        const response = await api.stores.create(
          brandId,
          storeData.name,
          storeData.address,
          storeData.city,
          storeData.lat || null,
          storeData.lng || null,
        )
        const newStore = response?.data || response
        const storeId = newStore.store_id || newStore.id
        queryClient.setQueryData(queryKey, (old) =>
          old.map((s) => (s.id === tempId ? { ...newStore, id: storeId, store_id: storeId } : s)),
        )
        resetForm()
        setDialogOpen(false)
        toast.success('Sucursal creada exitosamente')
      } catch (error) {
        queryClient.setQueryData(queryKey, previous)
        toast.error(error?.response?.data?.message || error?.message || 'Error al crear la sucursal')
      } finally {
        setIsMutating(false)
      }
    },
    [brandId, queryClient, queryKey, resetForm],
  )

  // Update store — optimistic update
  const updateStore = useCallback(
    async (storeId, storeData) => {
      setIsMutating(true)
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old) =>
        old?.map((s) =>
          (s.store_id || s.id) === storeId
            ? {
                ...s,
                store_name: storeData.name || s.store_name,
                address: storeData.address ?? s.address,
                city: storeData.city ?? s.city,
                latitude: storeData.lat ?? s.latitude,
                longitude: storeData.lng ?? s.longitude,
              }
            : s,
        ),
      )

      try {
        const updateData = {}
        if (storeData.name) updateData.store_name = storeData.name
        if (storeData.address !== undefined) updateData.address = storeData.address
        if (storeData.city !== undefined) updateData.city = storeData.city
        if (storeData.lat !== undefined) updateData.latitude = storeData.lat
        if (storeData.lng !== undefined) updateData.longitude = storeData.lng

        const response = await api.stores.update(storeId, updateData)
        const updated = response?.data || response
        if (updated) {
          queryClient.setQueryData(queryKey, (old) =>
            old?.map((s) =>
              (s.store_id || s.id) === storeId
                ? {
                    ...updated,
                    id: updated.store_id || updated.id || storeId,
                    store_id: updated.store_id || updated.id || storeId,
                  }
                : s,
            ),
          )
        }
        resetForm()
        setDialogOpen(false)
        toast.success('Sucursal actualizada exitosamente')
      } catch (error) {
        queryClient.setQueryData(queryKey, previous)
        toast.error(error?.response?.data?.message || error?.message || 'Error al actualizar la sucursal')
      } finally {
        setIsMutating(false)
      }
    },
    [queryClient, queryKey, resetForm],
  )

  // Delete store — optimistic removal
  const deleteStore = useCallback(
    async (storeId) => {
      if (!storeId) return
      const previous = queryClient.getQueryData(queryKey)
      setDeletingIds((prev) => ({ ...prev, [storeId]: true }))
      queryClient.setQueryData(queryKey, (old) => old?.filter((s) => (s.store_id || s.id) !== storeId))

      try {
        await api.stores.delete(storeId)
        queryClient.invalidateQueries({ queryKey: ['stores'] })
        toast.success('Sucursal eliminada exitosamente')
      } catch (error) {
        queryClient.setQueryData(queryKey, previous)
        toast.error(error?.response?.data?.message || error?.message || 'Error al eliminar la sucursal')
      } finally {
        setDeletingIds((prev) => {
          // eslint-disable-next-line no-unused-vars
          const { [storeId]: _, ...rest } = prev
          return rest
        })
      }
    },
    [queryClient, queryKey],
  )

  // Submit handler for create/edit form
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!brandId && !editingStore) {
        toast.error('Error de autenticación. Por favor, recarga la página.')
        return
      }
      if (editingStore) {
        updateStore(editingStore.id, formData)
      } else {
        createStore(formData)
      }
    },
    [brandId, editingStore, formData, createStore, updateStore],
  )

  // QR URL generator
  const getQrUrl = useCallback((store) => {
    if (!store) return ''
    const storeId = store.store_id || store.id
    return `${window.location.origin}/public/store/${storeId}`
  }, [])

  const isDeletingStore = useCallback((id) => !!deletingIds[id], [deletingIds])

  return {
    stores,
    isLoading,
    isDialogOpen,
    setDialogOpen,
    isQrOpen,
    setQrOpen,
    editingStore,
    selectedQrStore,
    formData,
    setFormData,
    isMutating,
    handleSubmit,
    handleEdit,
    handleClose,
    handleShowQr,
    deleteStore,
    isDeletingStore,
    getQrUrl,
  }
}
