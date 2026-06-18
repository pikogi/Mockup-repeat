import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Search, Shield, MapPin, Pencil, Trash2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MOONCAFE_STORES } from '@/constants/moonCafeClubs'

const MOONCAFE_TEAM = [
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

const DEFAULT_PERMISSIONS = {
  add_transactions: true,
  redeem_rewards: false,
  view_customer_email: false,
  view_customer_phone: false,
  view_customers: false,
  view_transactions: false,
  view_reports: false,
  view_sorteo: false,
}

function PermissionToggle({ label, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="space-y-0.5 pr-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5 flex-shrink-0" />
    </div>
  )
}

function PermissionSectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-5 mb-1">
      {children}
    </p>
  )
}

function InvitePersonalModal({ open, onOpenChange }) {
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS)

  const setPermission = (key, value) => setPermissions((prev) => ({ ...prev, [key]: value }))

  const handleViewSorteoChange = (checked) => {
    setPermissions((prev) => ({
      ...prev,
      view_sorteo: checked,
      // Sorteo requires "Ver clientes" to list participants — enabling it turns that on too.
      view_customers: checked ? true : prev.view_customers,
    }))
  }

  const handleSend = () => {
    toast.info('Esto es una demo — la invitación no se envía realmente.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invitar personal</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="invite_email">Email</Label>
            <Input id="invite_email" type="email" placeholder="persona@ejemplo.com" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite_name">Nombre completo</Label>
            <Input id="invite_name" placeholder="Juan Pérez" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite_phone">Teléfono (opcional)</Label>
            <Input id="invite_phone" placeholder="+54 9 11 0000 0000" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label>Sucursales</Label>
            <div className="flex flex-wrap gap-2">
              {MOONCAFE_STORES.map((store) => (
                <span
                  key={store.store_id}
                  className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"
                >
                  Moon Centro
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Las acciones se aplican a todas las sucursales seleccionadas; luego podés ajustarlas por sucursal. La
              visibilidad de datos del cliente vale para toda la marca.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Permisos</h4>

            <PermissionSectionLabel>Acciones</PermissionSectionLabel>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <PermissionToggle
                label="Agregar transacciones"
                checked={permissions.add_transactions}
                onCheckedChange={(v) => setPermission('add_transactions', v)}
              />
              <PermissionToggle
                label="Canjear recompensas"
                checked={permissions.redeem_rewards}
                onCheckedChange={(v) => setPermission('redeem_rewards', v)}
              />
            </div>

            <PermissionSectionLabel>Datos del cliente (toda la marca)</PermissionSectionLabel>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
              El personal ve el email y teléfono ocultos en todas las sucursales salvo que se habilite aquí.
            </p>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <PermissionToggle
                label="Ver email del cliente"
                checked={permissions.view_customer_email}
                onCheckedChange={(v) => setPermission('view_customer_email', v)}
              />
              <PermissionToggle
                label="Ver teléfono del cliente"
                checked={permissions.view_customer_phone}
                onCheckedChange={(v) => setPermission('view_customer_phone', v)}
              />
            </div>

            <PermissionSectionLabel>Acceso a páginas (toda la marca)</PermissionSectionLabel>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
              Controla qué páginas de la marca puede abrir el personal (Clientes, Transacciones, Reportes y Sorteos).
            </p>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <PermissionToggle
                label="Ver clientes"
                checked={permissions.view_customers}
                onCheckedChange={(v) => setPermission('view_customers', v)}
              />
              <PermissionToggle
                label="Ver transacciones"
                checked={permissions.view_transactions}
                onCheckedChange={(v) => setPermission('view_transactions', v)}
              />
              <PermissionToggle
                label="Ver reportes"
                checked={permissions.view_reports}
                onCheckedChange={(v) => setPermission('view_reports', v)}
              />
              <PermissionToggle
                label="Ver sorteo"
                description='Requiere "Ver clientes" para listar participantes; se activa automáticamente.'
                checked={permissions.view_sorteo}
                onCheckedChange={handleViewSorteoChange}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend} className="gap-2 bg-gray-900 hover:bg-gray-800 text-white">
              <Mail className="w-4 h-4" />
              Enviar invitación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function TeamMoonCafe() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const filteredUsers = MOONCAFE_TEAM.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDemoAction = () => {
    toast.info('Esto es una demo — la gestión del equipo no está disponible.')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">Equipo</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Invita y administra a tu equipo por sucursal</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            <Button
              size="lg"
              onClick={() => setShowInvite(true)}
              className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
            >
              <UserPlus className="w-5 h-5" />
              Invitar personal
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{user.full_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 md:gap-6 md:items-center">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Rol</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Colaborador
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Sucursal</p>
                    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {user.assigned_branch_id
                        ? MOONCAFE_STORES.find((s) => s.store_id === user.assigned_branch_id)?.store_name
                        : 'Todas las sucursales'}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="h-10 md:h-9" onClick={handleDemoAction}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 md:h-9 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
                    onClick={handleDemoAction}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <InvitePersonalModal open={showInvite} onOpenChange={setShowInvite} />
    </div>
  )
}
