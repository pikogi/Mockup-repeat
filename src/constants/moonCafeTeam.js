// Café Moon staff. The Team page lists MOONCAFE_TEAM; the register (Caja) also lets the owner charge.
export const MOONCAFE_TEAM = [
  {
    id: 2,
    full_name: 'Tomás Ibáñez',
    email: 'tomas@cafemoon.com.ar',
    assigned_branch_id: 'store-1',
  },
  {
    id: 3,
    full_name: 'Carla Núñez',
    email: 'carla@cafemoon.com.ar',
    assigned_branch_id: 'store-1',
  },
]

export const MOONCAFE_CASHIERS = [
  { id: 1, full_name: 'Encargado', role: 'Dueño', assigned_branch_id: 'store-1' },
  ...MOONCAFE_TEAM.map((m) => ({ ...m, role: 'Cajero' })),
]

export const cashierName = (id) => MOONCAFE_CASHIERS.find((c) => c.id === id)?.full_name ?? null
