import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/api/client';
import { toast } from 'sonner';

const useStoresStore = create(
  persist(
    (set, get) => ({
  // Estado inicial
  stores: [],
  isLoading: false,
  error: null,
  
  // Estados de UI
  isDialogOpen: false,
  isQrOpen: false,
  editingStore: null,
  selectedQrStore: null,
  formData: { name: '', address: '', city: '', lat: 0, lng: 0 },
  
  // Estados de mutación
  isCreating: false,
  isUpdating: false,
  deletingStoreIds: {}, // { [storeId]: true }

  // Acciones de UI
  setDialogOpen: (open) => set({ isDialogOpen: open }),
  setQrOpen: (open) => set({ isQrOpen: open }),
  setEditingStore: (store) => set({ editingStore: store }),
  setSelectedQrStore: (store) => set({ selectedQrStore: store }),
  setFormData: (data) => set((state) => ({ 
    formData: typeof data === 'function' ? data(state.formData) : { ...state.formData, ...data }
  })),
  resetForm: () => set({ 
    formData: { name: '', address: '', city: '', lat: 0, lng: 0 },
    editingStore: null 
  }),

  // Acción para obtener stores
  fetchStores: async (brandId) => {
    if (!brandId) return;

    const { stores } = get();

    const mapStores = (raw) => raw.map(store => {
      const storeId = store.store_id || store.id;
      return { ...store, id: storeId, store_id: storeId };
    });

    const applyFetchResult = (fetched, isLoading = false) => {
      const deletingIds = get().deletingStoreIds;
      const fetchedIds = new Set(fetched.map(s => s.store_id || s.id));
      // Limpiar de deletingIds los que el servidor ya confirmó que no existen
      const confirmedGone = Object.keys(deletingIds).filter(id => !fetchedIds.has(id));
      const newDeletingIds = { ...deletingIds };
      confirmedGone.forEach(id => delete newDeletingIds[id]);
      // No restaurar los que siguen en deletingIds
      const filtered = mapStores(fetched).filter(s => !newDeletingIds[s.store_id || s.id]);
      set({ stores: filtered, deletingStoreIds: newDeletingIds, ...(isLoading !== null && { isLoading }) });
    };

    // Si ya hay stores en cache, hacer fetch en background sin mostrar loader
    if (stores.length > 0) {
      try {
        const res = await api.stores.list(brandId);
        applyFetchResult(res?.data || res || [], null);
      } catch {
        // Silent fail — usamos el cache
      }
      return;
    }

    // Primera carga — mostrar loader
    set({ isLoading: true, error: null });
    try {
      const res = await api.stores.list(brandId);
      applyFetchResult(res?.data || res || [], false);
    } catch (error) {
      console.error('[STORES STORE] Error fetching stores:', error);
      set({ error: error?.message || 'Error al obtener las sucursales', isLoading: false });
      toast.error('Error al obtener las sucursales');
    }
  },

  // Acción para crear store con actualización optimista
  createStore: async (brandId, storeData) => {
    const { stores } = get();
    
    // Generar ID temporal único
    const tempId = `temp-${Date.now()}`;
    
    // Crear objeto de tienda temporal (optimista)
    const optimisticStore = {
      id: tempId,
      store_id: tempId,
      store_name: storeData.name,
      name: storeData.name,
      address: storeData.address || '',
      city: storeData.city || '',
      latitude: storeData.lat || null,
      longitude: storeData.lng || null,
    };

    // Guardar estado anterior para revertir en caso de error
    const previousStores = [...stores];

    // Actualizar estado optimistamente
    set({ 
      stores: [...stores, optimisticStore],
      isCreating: true 
    });

    try {
      // Llamar a la API
      const response = await api.stores.create(
        brandId,
        storeData.name,
        storeData.address,
        storeData.city,
        storeData.lat || null,
        storeData.lng || null
      );

      // Reemplazar la tienda temporal con los datos reales del servidor
      const newStore = response?.data || response;
      if (newStore) {
        const storeId = newStore.store_id || newStore.id;
        const mappedStore = {
          ...newStore,
          id: storeId,
          store_id: storeId
        };

        set((state) => ({
          stores: state.stores.map(store => 
            store.id === tempId ? mappedStore : store
          ),
          isCreating: false,
          isDialogOpen: false
        }));
      }

      get().resetForm();
      toast.success('Sucursal creada exitosamente');
    } catch (error) {
      // Revertir al estado anterior en caso de error
      set({ 
        stores: previousStores,
        isCreating: false 
      });
      console.error('[STORES STORE] Error creating store:', error);
      toast.error(error?.message || 'Error al crear la sucursal');
    }
  },

  // Acción para actualizar store con actualización optimista
  updateStore: async (storeId, storeData) => {
    const { stores } = get();
    
    // Encontrar y guardar el store anterior
    const previousStore = stores.find(store => (store.store_id || store.id) === storeId);
    if (!previousStore) {
      toast.error('No se encontró la sucursal a actualizar');
      return;
    }

    // Guardar estado anterior para revertir en caso de error
    const previousStores = [...stores];

    // Actualizar store optimistamente
    const optimisticUpdate = {
      ...previousStore,
      store_name: storeData.name || previousStore.store_name,
      name: storeData.name || previousStore.name,
      address: storeData.address !== undefined ? storeData.address : previousStore.address,
      city: storeData.city !== undefined ? storeData.city : previousStore.city,
      latitude: storeData.lat !== undefined ? storeData.lat : previousStore.latitude,
      longitude: storeData.lng !== undefined ? storeData.lng : previousStore.longitude,
    };

    set((state) => ({
      stores: state.stores.map(store => 
        (store.store_id || store.id) === storeId ? optimisticUpdate : store
      ),
      isUpdating: true
    }));

    try {
      // Preparar datos para la API
      const updateData = {};
      if (storeData.name) updateData.store_name = storeData.name;
      if (storeData.address !== undefined) updateData.address = storeData.address;
      if (storeData.city !== undefined) updateData.city = storeData.city;
      if (storeData.lat !== undefined) updateData.latitude = storeData.lat;
      if (storeData.lng !== undefined) updateData.longitude = storeData.lng;

      // Llamar a la API
      const response = await api.stores.update(storeId, updateData);

      // Actualizar con la respuesta del servidor
      const updatedStore = response?.data || response;
      if (updatedStore) {
        const mappedStore = {
          ...updatedStore,
          id: updatedStore.store_id || updatedStore.id || storeId,
          store_id: updatedStore.store_id || updatedStore.id || storeId
        };

        set((state) => ({
          stores: state.stores.map(store => 
            (store.store_id || store.id) === storeId ? mappedStore : store
          ),
          isUpdating: false,
          isDialogOpen: false
        }));
      } else {
        // Si no hay respuesta, mantener la actualización optimista
        set({ isUpdating: false, isDialogOpen: false });
      }

      get().resetForm();
      toast.success('Sucursal actualizada exitosamente');
    } catch (error) {
      // Revertir al estado anterior en caso de error
      set({ 
        stores: previousStores,
        isUpdating: false 
      });
      console.error('[STORES STORE] Error updating store:', error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error al actualizar la sucursal'
      );
    }
  },

  // Función helper para verificar si un store específico se está eliminando
  isDeletingStore: (storeId) => {
    const { deletingStoreIds } = get();
    return !!deletingStoreIds[storeId];
  },

  // Acción para eliminar store con actualización optimista
  deleteStore: async (storeId) => {
    if (!storeId) {
      toast.error('No se pudo obtener el ID de la sucursal');
      return;
    }

    const { stores } = get();
    
    // Encontrar y guardar el store a eliminar
    const storeToDelete = stores.find(
      store => (store.store_id || store.id) === storeId
    );
    
    if (!storeToDelete) {
      toast.error('No se encontró la sucursal a eliminar');
      return;
    }

    // Guardar estado anterior para revertir en caso de error
    const previousStores = [...stores];

    // Actualizar estado optimistamente (eliminar del array y agregar a deletingStoreIds)
    set((state) => ({
      stores: state.stores.filter(store => (store.store_id || store.id) !== storeId),
      deletingStoreIds: { ...state.deletingStoreIds, [storeId]: true }
    }));

    try {
      // Llamar a la API
      await api.stores.delete(storeId);
      // NO limpiar deletingStoreIds aquí — fetchStores lo limpiará cuando el servidor
      // confirme que el store ya no existe. Esto evita la race condition donde un
      // fetchStores en vuelo restaura el store recién eliminado.
      toast.success('Sucursal eliminada exitosamente');
    } catch (error) {
      // Revertir al estado anterior y remover de deletingStoreIds en caso de error
      set((state) => {
        // eslint-disable-next-line no-unused-vars
        const { [storeId]: _, ...rest } = state.deletingStoreIds;
        return {
          stores: previousStores,
          deletingStoreIds: rest
        };
      });
      console.error('[STORES STORE] Error deleting store:', error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error al eliminar la sucursal'
      );
    }
  },
    }),
    {
      name: 'stores-storage',
      partialize: (state) => ({ stores: state.stores }),
    }
  )
);

export default useStoresStore;
