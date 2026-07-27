import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Copy,
  X,
  ChevronDown,
  Star,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const INITIAL_PREMIOS = [
  {
    id: 1,
    name: 'Medialunas',
    description: 'Una porción de 3 medialunas de manteca artesanales.',
    cost: 5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=75',
    active: true,
    stock: null,
  },
  {
    id: 2,
    name: 'Flat white',
    description: 'Café espresso doble con leche vaporizada. Nuestro clásico.',
    cost: 10,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=75',
    active: true,
    stock: null,
  },
]

const INITIAL_NOVEDADES = [
  {
    id: 1,
    type: 'Novedad',
    title: '2x1 en cafés todos los jueves',
    description: 'En cafés todos los jueves — pides uno y te traemos dos. Válido en cualquier sucursal.',
    date: '3 jul 2026',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&q=75',
    active: true,
  },
  {
    id: 2,
    type: 'Promo',
    title: 'Desayuno completo a precio especial',
    description: 'Café + medialuna + jugo. Solo hasta fin de julio.',
    date: '15 jul 2026',
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=200&q=75',
    active: true,
  },
]

const TIPO_BADGE_COLORS = {
  Novedad: 'bg-purple-100 text-purple-700 border-purple-200',
  Promo: 'bg-amber-100 text-amber-700 border-amber-200',
  Evento: 'bg-blue-100 text-blue-700 border-blue-200',
}

function NuevoPremioModal({ onClose }) {
  const [form, setForm] = useState({ name: '', description: '', cost: '', stock: false, active: true })

  const handleSave = () => {
    if (!form.name || !form.cost) {
      toast.error('Completa los campos obligatorios.')
      return
    }
    toast.info('Esto es una demo — los cambios no se guardan.')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Nuevo premio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label>
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ej: Café gratis"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descripción del premio"
              className="mt-1"
            />
          </div>
          <div>
            <Label>
              Costo en puntos <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              value={form.cost}
              onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))}
              placeholder="Ej: 10"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Imagen</Label>
            <div className="mt-1 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Esto es una demo.')}>
                Subir imagen
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Controlar stock</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Limitar la cantidad disponible</p>
            </div>
            <Switch checked={form.stock} onCheckedChange={(v) => setForm((p) => ({ ...p, stock: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Activo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visible para los clientes</p>
            </div>
            <Switch checked={form.active} onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))} />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t dark:border-gray-800">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function NuevaNovedadModal({ onClose }) {
  const [form, setForm] = useState({ type: 'Novedad', title: '', description: '', date: '', active: true })
  const [typeOpen, setTypeOpen] = useState(false)
  const TIPOS = ['Novedad', 'Promo', 'Evento']

  const handleSave = () => {
    if (!form.title) {
      toast.error('Completa el título.')
      return
    }
    toast.info('Esto es una demo — los cambios no se guardan.')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Nueva novedad</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label>Tipo</Label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setTypeOpen((p) => !p)}
                className="w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {form.type}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {typeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg">
                  {TIPOS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setForm((p) => ({ ...p, type: t }))
                        setTypeOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <Label>
              Título <span className="text-xs text-gray-400 ml-1">{form.title.length}/100</span>
            </Label>
            <Input
              value={form.title}
              maxLength={100}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ej: 2x1 todos los jueves"
              className="mt-1"
            />
          </div>
          <div>
            <Label>
              Descripción <span className="text-xs text-gray-400 ml-1">{form.description.length}/500</span>
            </Label>
            <textarea
              value={form.description}
              maxLength={500}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descripción de la novedad"
              rows={3}
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Imagen</Label>
            <div className="mt-1 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Esto es una demo.')}>
                Subir imagen
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Activo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visible para los clientes</p>
            </div>
            <Switch checked={form.active} onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))} />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t dark:border-gray-800">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function CatalogoDePremiosMoonCafe() {
  const [activeTab, setActiveTab] = useState('premios')
  const [premios, setPremios] = useState(INITIAL_PREMIOS)
  const [novedades] = useState(INITIAL_NOVEDADES)
  const [showNuevoPremio, setShowNuevoPremio] = useState(false)
  const [showNuevaNovedades, setShowNuevaNovedades] = useState(false)

  const handleNotAvailable = () => toast.info('Esto es una demo — esta acción no está disponible.')

  const togglePremio = (id) => {
    setPremios((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/myprograms-demo/mooncafe">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a mis programas
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Package className="w-7 h-7 text-purple-600" />
                <h1 className="text-3xl font-bold text-foreground">Catálogo de premios</h1>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Club Moon Cafe · Gestiona los premios que tus clientes canjean con puntos
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/catalog/mooncafe-puntos-demo?card=mock" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Ver página pública
                </Button>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toast.info('Link copiado (demo)')
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
              {activeTab === 'premios' ? (
                <Button size="sm" className="gap-2" onClick={() => setShowNuevoPremio(true)}>
                  <Plus className="w-4 h-4" />
                  Nuevo premio
                </Button>
              ) : (
                <Button size="sm" className="gap-2" onClick={() => setShowNuevaNovedades(true)}>
                  <Plus className="w-4 h-4" />
                  Nueva novedad
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
          {[
            { key: 'premios', label: 'Premios', icon: Star },
            { key: 'novedades', label: 'Novedades', icon: Sparkles },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                activeTab === key
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Premios tab */}
        {activeTab === 'premios' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {premios.map((premio) => (
              <Card key={premio.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={premio.image}
                    alt={premio.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{premio.name}</h3>
                      <Badge variant="outline" className="text-purple-700 bg-purple-50 border-purple-200 flex-shrink-0">
                        {premio.cost} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{premio.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => togglePremio(premio.id)}
                      className={cn(
                        'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors',
                        premio.active ? 'text-emerald-500 hover:text-emerald-600' : '',
                      )}
                      title={premio.active ? 'Desactivar' : 'Activar'}
                    >
                      {premio.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleNotAvailable}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={handleNotAvailable} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Novedades tab */}
        {activeTab === 'novedades' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {novedades.map((novedad) => (
              <Card key={novedad.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={novedad.image}
                    alt={novedad.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          'flex-shrink-0 text-xs',
                          TIPO_BADGE_COLORS[novedad.type] || TIPO_BADGE_COLORS['Novedad'],
                        )}
                      >
                        {novedad.type}
                      </Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{novedad.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{novedad.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{novedad.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleNotAvailable}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={handleNotAvailable} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNuevoPremio && <NuevoPremioModal onClose={() => setShowNuevoPremio(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showNuevaNovedades && <NuevaNovedadModal onClose={() => setShowNuevaNovedades(false)} />}
      </AnimatePresence>
    </div>
  )
}
