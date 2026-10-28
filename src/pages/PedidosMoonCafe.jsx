import { useState } from 'react'
import { ExternalLink, Inbox, Settings, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { DeliverDialog, OrdersBoard, OrdersFunnel, OrdersSettingsDialog } from '@/components/orders/OrdersSections'
import { Button } from '@/components/ui/button'
import useMoonCafeOrders from '@/hooks/useMoonCafeOrders'
import useMoonCafeShowcase from '@/hooks/useMoonCafeShowcase'

export default function PedidosMoonCafe() {
  const { orders, metrics, move, deliver, simulate, cardFor } = useMoonCafeOrders()
  const { brand, update } = useMoonCafeShowcase()
  const [delivering, setDelivering] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const saveSettings = ({ whatsapp, delivery_enabled, delivery_fee }) => {
    update((prev) => ({ ...prev, brand: { ...prev.brand, whatsapp, delivery_enabled, delivery_fee } }))
    setSettingsOpen(false)
    toast.success('Ajustes guardados')
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
              <Inbox className="w-8 h-8" /> Pedidos
            </h1>
            <p className="text-gray-500 mt-1">
              Los pedidos que tus clientes arman en tu vitrina y te envían por WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)} title="Ajustes de pedidos">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => simulate(brand.delivery_fee)}>
              <Sparkles className="w-4 h-4 mr-2" /> Simular pedido
            </Button>
            <Button asChild>
              <a href="/showcase-roadmap/mooncafe/menu" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> Pedir desde la vitrina
              </a>
            </Button>
          </div>
        </div>

        <OrdersFunnel metrics={metrics} />
        <OrdersBoard orders={orders} cardFor={cardFor} onMove={move} onDeliver={setDelivering} />
      </div>

      <DeliverDialog
        order={delivering}
        card={delivering && cardFor(delivering)}
        onClose={() => setDelivering(null)}
        onConfirm={deliver}
      />
      <OrdersSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} brand={brand} onSave={saveSettings} />
    </div>
  )
}
