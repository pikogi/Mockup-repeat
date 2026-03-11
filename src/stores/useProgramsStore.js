import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/api/client';
import { toast } from 'sonner';

const useProgramsStore = create(
  persist(
    (set, get) => ({
  // Estado inicial
  programs: [],
  isLoading: false,
  error: null,
  lastModified: null, // Timestamp de última modificación local

  // Estados de mutación
  isCreating: false,
  isUpdating: false,
  deletingProgramIds: {},

  // Acción para obtener programs
  fetchPrograms: async (brandId, forceRefresh = false) => {
    if (!brandId) return;

    const { programs, lastModified, isCreating } = get();

    // No hacer fetch si estamos en medio de una creación
    if (isCreating) {
      return;
    }

    // Si hubo una modificación reciente (menos de 10 segundos), no sobrescribir
    const recentlyModified = lastModified && (Date.now() - lastModified < 10000);

    // Si ya hay programas y no es refresh forzado
    if (programs.length > 0 && !forceRefresh) {
      // Si fue modificado recientemente, no hacer fetch
      if (recentlyModified) {
        return;
      }
      // Fetch en background sin mostrar loader
      try {
        const res = await api.loyaltyPrograms.list(brandId);
        const fetchedPrograms = res?.data || res || [];
        const currentStore = get().programs;
        const mappedPrograms = fetchedPrograms.map(program => {
          const existing = currentStore.find(p => (p.program_id || p.id) === (program.program_id || program.id));
          return {
            ...program,
            id: program.program_id || program.id,
            program_id: program.program_id || program.id,
            wallet_design: program.wallet_design || existing?.wallet_design,
            images: program.images || existing?.images,
            // El backend no persiste is_active vía PATCH → preservar el valor local
            is_active: existing !== undefined ? existing.is_active : program.is_active,
          };
        });
        // Solo actualizar si no hubo modificaciones mientras esperábamos
        // y si el servidor tiene al menos tantos programas como nosotros
        const currentState = get();
        const currentLastModified = currentState.lastModified;
        const currentPrograms = currentState.programs;
        const stillRecent = currentLastModified && (Date.now() - currentLastModified < 10000);

        if (!stillRecent) {
          const deletingIds = get().deletingProgramIds;
          const fetchedIds = new Set(mappedPrograms.map(p => p.program_id || p.id));
          // Limpiar de deletingIds los que el servidor ya confirmó que no existen
          const newDeletingIds = { ...deletingIds };
          Object.keys(deletingIds).forEach(id => { if (!fetchedIds.has(id)) delete newDeletingIds[id]; });
          const filteredPrograms = mappedPrograms.filter(p => !newDeletingIds[p.program_id || p.id]);
          set({ programs: filteredPrograms, deletingProgramIds: newDeletingIds });
        }
      } catch (error) {
        // Silent fail for background fetch
      }
      return;
    }

    // Primera carga - mostrar loader
    set({ isLoading: true, error: null });
    try {
      const res = await api.loyaltyPrograms.list(brandId);
      const fetchedPrograms = res?.data || res || [];
      const currentStore = get().programs;
      const mappedPrograms = fetchedPrograms.map(program => {
        const existing = currentStore.find(p => (p.program_id || p.id) === (program.program_id || program.id));
        return {
          ...program,
          id: program.program_id || program.id,
          program_id: program.program_id || program.id,
          wallet_design: program.wallet_design || existing?.wallet_design,
          images: program.images || existing?.images,
          // El backend no persiste is_active vía PATCH → preservar el valor local
          is_active: existing !== undefined ? existing.is_active : program.is_active,
        };
      });
      // Verificar que no se haya creado un programa mientras hacíamos fetch
      const currentState = get();
      if (currentState.programs.length > 0 && mappedPrograms.length < currentState.programs.length) {
        set({ isLoading: false });
        return;
      }
      const deletingIds = get().deletingProgramIds;
      const fetchedIds = new Set(mappedPrograms.map(p => p.program_id || p.id));
      const newDeletingIds = { ...deletingIds };
      Object.keys(deletingIds).forEach(id => { if (!fetchedIds.has(id)) delete newDeletingIds[id]; });
      const filteredPrograms = mappedPrograms.filter(p => !newDeletingIds[p.program_id || p.id]);
      set({ programs: filteredPrograms, deletingProgramIds: newDeletingIds, isLoading: false });
    } catch (error) {
      set({
        error: error?.message || 'Error al obtener los programas',
        isLoading: false
      });
      toast.error('Error al obtener los programas');
    }
  },

  // Acción para crear program con actualización optimista
  createProgram: async (brandId, programData) => {
    const { programs } = get();

    const tempId = `temp-${Date.now()}`;

    const optimisticProgram = {
      id: tempId,
      program_id: tempId,
      program_name: programData.program_name,
      description: programData.description || '',
      reward_description: programData.reward_description || '',
      program_type_id: programData.program_type_id,
      program_rules: programData.program_rules || {},
      reward_rules: programData.reward_rules || {},
      is_active: true,
      created_date: new Date().toISOString(),
    };

    const previousPrograms = [...programs];

    set({
      programs: [optimisticProgram, ...programs],
      isCreating: true,
      lastModified: Date.now()
    });

    try {
      // program_rules ya viene con required_customer_fields anidado desde CreateClub
      const programRules = programData.program_rules || {};

      const dataToSend = {
        program_type_id: programData.program_type_id,
        brand_id: brandId,
        program_name: programData.program_name,
        description: programData.description,
        start_date: new Date().toISOString(),
        reward_description: programData.reward_description,
        program_rules: programRules,
        reward_rules: programData.reward_rules || {},
        wallet_design: programData.wallet_design || { hex_background_color: null },
        store_ids: programData.store_ids || [],
      };
      const response = await api.loyaltyPrograms.create(dataToSend);
      const newProgram = response?.data || response;
      if (newProgram) {
        const programId = newProgram.program_id || newProgram.id;
        const mappedProgram = {
          ...newProgram,
          id: programId,
          program_id: programId,
          wallet_design: newProgram.wallet_design || dataToSend.wallet_design,
        };

        set((state) => ({
          programs: state.programs.map(program =>
            program.id === tempId ? mappedProgram : program
          ),
          isCreating: false,
          lastModified: Date.now()
        }));
      } else {
        set({ isCreating: false });
      }

      toast.success('Programa creado exitosamente');
      return { success: true, program: newProgram };
    } catch (error) {
      set({
        programs: previousPrograms,
        isCreating: false
      });
      toast.error(error?.message || 'Error al crear el programa');
      return { success: false, error };
    }
  },

  // Acción para actualizar program con actualización optimista
  updateProgram: async (programId, programData) => {
    const { programs } = get();

    const previousProgram = programs.find(p => (p.program_id || p.id) === programId);
    if (!previousProgram) {
      toast.error('No se encontró el programa a actualizar');
      return { success: false };
    }

    const previousPrograms = [...programs];

    const optimisticUpdate = {
      ...previousProgram,
      program_name: programData.program_name || previousProgram.program_name,
      description: programData.description !== undefined ? programData.description : previousProgram.description,
      reward_description: programData.reward_description !== undefined ? programData.reward_description : previousProgram.reward_description,
      program_rules: programData.program_rules || previousProgram.program_rules,
      reward_rules: programData.reward_rules || previousProgram.reward_rules,
      is_active: programData.is_active !== undefined ? programData.is_active : previousProgram.is_active,
    };

    set((state) => ({
      programs: state.programs.map(program =>
        (program.program_id || program.id) === programId ? optimisticUpdate : program
      ),
      isUpdating: true,
      lastModified: Date.now()
    }));

    try {
      const updateData = {};
      if (programData.program_name) updateData.program_name = programData.program_name;
      if (programData.description !== undefined) updateData.description = programData.description;
      if (programData.reward_description !== undefined) updateData.reward_description = programData.reward_description;
      if (programData.program_rules) updateData.program_rules = programData.program_rules;
      if (programData.reward_rules) updateData.reward_rules = programData.reward_rules;
      if (programData.is_active !== undefined) updateData.is_active = programData.is_active;
      if (programData.wallet_design) updateData.wallet_design = programData.wallet_design;

      const response = await api.loyaltyPrograms.update(programId, updateData);

      const updatedProgram = response?.data || response;
      if (updatedProgram) {
        // PATCH puede devolver un objeto parcial o vacío → usar optimisticUpdate como base
        // para que program_name y otros campos nunca queden undefined.
        const mappedProgram = {
          ...optimisticUpdate,
          ...updatedProgram,
          id: updatedProgram.program_id || updatedProgram.id || programId,
          program_id: updatedProgram.program_id || updatedProgram.id || programId,
          // PATCH no devuelve `images` ni `wallet_design` → preservar lo enviado o el anterior
          images: updatedProgram.images || previousProgram?.images,
          wallet_design: updatedProgram.wallet_design || programData.wallet_design || previousProgram?.wallet_design,
        };

        set((state) => ({
          programs: state.programs.map(program =>
            (program.program_id || program.id) === programId ? mappedProgram : program
          ),
          isUpdating: false,
          lastModified: Date.now()
        }));
      } else {
        set({ isUpdating: false, lastModified: Date.now() });
      }

      toast.success('Programa actualizado exitosamente');
      return { success: true };
    } catch (error) {
      set({
        programs: previousPrograms,
        isUpdating: false
      });
      toast.error(error?.message || 'Error al actualizar el programa');
      return { success: false, error };
    }
  },

  // Toggle is_active
  toggleProgramActive: async (programId, newActiveState) => {
    const { programs } = get();

    const previousProgram = programs.find(p => (p.program_id || p.id) === programId);
    if (!previousProgram) {
      toast.error('No se encontró el programa');
      return;
    }

    const previousPrograms = [...programs];

    set((state) => ({
      programs: state.programs.map(program =>
        (program.program_id || program.id) === programId
          ? { ...program, is_active: newActiveState }
          : program
      ),
      lastModified: Date.now()
    }));

    try {
      await api.loyaltyPrograms.update(programId, { is_active: newActiveState });
      toast.success(newActiveState ? 'Programa activado' : 'Programa desactivado');
    } catch (error) {
      set({ programs: previousPrograms });
      toast.error(error?.message || 'Error al cambiar estado del programa');
    }
  },

  isDeletingProgram: (programId) => {
    const { deletingProgramIds } = get();
    return !!deletingProgramIds[programId];
  },

  deleteProgram: async (programId) => {
    if (!programId) {
      toast.error('No se pudo obtener el ID del programa');
      return;
    }

    const { programs } = get();

    const programToDelete = programs.find(
      p => (p.program_id || p.id) === programId
    );

    if (!programToDelete) {
      toast.error('No se encontró el programa a eliminar');
      return;
    }

    const previousPrograms = [...programs];

    set((state) => ({
      programs: state.programs.filter(p => (p.program_id || p.id) !== programId),
      deletingProgramIds: { ...state.deletingProgramIds, [programId]: true },
      lastModified: Date.now()
    }));

    try {
      await api.loyaltyPrograms.delete(programId);
      // NO limpiar deletingProgramIds aquí — fetchPrograms lo limpiará cuando el servidor
      // confirme que el programa ya no existe. Evita race condition con fetchPrograms en vuelo.
      toast.success('Programa eliminado exitosamente');
    } catch (error) {
      const isNotFound = error?.response?.status === 404;
      set((state) => {
        const { [programId]: _, ...rest } = state.deletingProgramIds;
        // Si el backend dice 404, el programa ya no existe → mantener el delete optimista
        if (isNotFound) return { deletingProgramIds: rest };
        return { programs: previousPrograms, deletingProgramIds: rest };
      });
      if (isNotFound) {
        toast.success('Programa eliminado exitosamente');
      } else {
        toast.error(error?.message || 'Error al eliminar el programa');
      }
    }
  },

  clearPrograms: () => set({ programs: [], isLoading: false, error: null }),
    }),
    {
      name: 'programs-storage',
      partialize: (state) => ({ programs: state.programs }),
    }
  )
);

export default useProgramsStore;
