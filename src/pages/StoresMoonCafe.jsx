import { useState } from 'react'
import { Store } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { StoreFormDialog, StoreCard, StoreQrDialog } from '@/components/stores/StoresSections'
import { MOONCAFE_STORES } from '@/constants/moonCafeClubs'

const EMPTY_FORM = { name: '', address: '', city: '' }

export default function StoresMoonCafe() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isQrOpen, setQrOpen] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [selectedQrStore, setSelectedQrStore] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const handleEdit = (store) => {
    setEditingStore(store)
    setFormData({ name: store.store_name, address: store.address || '', city: store.city || '' })
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setEditingStore(null)
    setFormData(EMPTY_FORM)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.info('Esto es una demo — los cambios no se guardan.')
    handleClose()
  }

  const handleDelete = () => {
    toast.info('Esto es una demo — la eliminación de sucursales no está disponible.')
  }

  const handleShowQr = (store) => {
    setSelectedQrStore(store)
    setQrOpen(true)
  }

  const getQrUrl = (store) => (store ? `${window.location.origin}/publicprogram-demo/mooncafe` : '')

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">Sucursales</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Gestiona las ubicaciones de tu negocio</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            <StoreFormDialog
              open={isDialogOpen}
              onOpenChange={(open) => (open ? setDialogOpen(true) : handleClose())}
              editingStore={editingStore}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onClose={handleClose}
              isMutating={false}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOONCAFE_STORES.map((store) => (
            <StoreCard
              key={store.store_id}
              store={store}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShowQr={handleShowQr}
              isDeleting={false}
            />
          ))}
        </div>

        <StoreQrDialog
          open={isQrOpen}
          onOpenChange={setQrOpen}
          store={selectedQrStore}
          qrUrl={getQrUrl(selectedQrStore)}
        />
      </div>
    </div>
  )
}
