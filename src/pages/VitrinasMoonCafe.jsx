import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, ExternalLink, LayoutGrid, List, Plus, ShoppingBag, SlidersHorizontal, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShowcaseSettingsDialog } from '@/components/showcase/ShowcaseAdminSections'
import useMoonCafeShowcase, { genId, showcasePublicUrl } from '@/hooks/useMoonCafeShowcase'

function ShowcaseCard({ showcase, brand, onDelete }) {
  const covers = showcase.items.filter((i) => i.image_url).slice(0, 3)
  const visibleCount = showcase.items.filter((i) => i.visible).length

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(showcasePublicUrl(showcase.id))
      toast.success('Enlace copiado')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <Link to={`/vitrina/mooncafe-demo/${showcase.id}`} className="block">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 grid grid-cols-3 gap-0.5">
          {covers.length > 0 ? (
            covers.map((i) => <img key={i.id} src={i.image_url} alt="" className="w-full h-full object-cover" />)
          ) : (
            <div className="col-span-3 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: brand.color }} />
            <p className="font-semibold text-gray-900 dark:text-white truncate">{showcase.name}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
            <span>
              {showcase.items.length} {showcase.items.length === 1 ? 'ítem' : 'ítems'} · {visibleCount} visibles
            </span>
            <span className="flex items-center gap-1">
              {showcase.layout === 'list' ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
              {showcase.layout === 'list' ? 'Lista' : 'Galería'}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-1">
          <a
            href={`/showcase-demo/mooncafe/${showcase.id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver vitrina"
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={copyLink}
            title="Copiar enlace"
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(showcase)}
            title="Eliminar"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to={`/vitrina/mooncafe-demo/${showcase.id}`}>Editar</Link>
        </Button>
      </div>
    </motion.div>
  )
}

export default function VitrinasMoonCafe() {
  const navigate = useNavigate()
  const { brand, showcases, update } = useMoonCafeShowcase()
  const [creating, setCreating] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const createShowcase = () => {
    const name = creating?.trim()
    if (!name) return
    const id = genId()
    update((prev) => ({
      ...prev,
      showcases: [...prev.showcases, { id, name, layout: 'gallery', categories: [], items: [] }],
    }))
    setCreating(null)
    navigate(`/vitrina/mooncafe-demo/${id}`)
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
              <ShoppingBag className="w-8 h-8" /> Vitrinas
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Muestra tus productos con precios en una página pública que puedes compartir o poner en un QR.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Ajustes
            </Button>
            <Button onClick={() => setCreating('')}>
              <Plus className="w-4 h-4 mr-2" /> Nueva vitrina
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcases.map((s) => (
            <ShowcaseCard key={s.id} showcase={s} brand={brand} onDelete={setDeleting} />
          ))}
          <button
            onClick={() => setCreating('')}
            className="min-h-[220px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Crear vitrina</span>
          </button>
        </div>
      </div>

      <Dialog open={creating !== null} onOpenChange={(open) => !open && setCreating(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva vitrina</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              autoFocus
              placeholder="Ej: Menú de almuerzo"
              value={creating ?? ''}
              onChange={(e) => setCreating(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createShowcase()}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreating(null)}>
              Cancelar
            </Button>
            <Button onClick={createShowcase} disabled={!creating?.trim()}>
              Crear vitrina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSettings && (
        <ShowcaseSettingsDialog
          open
          onOpenChange={setShowSettings}
          brand={brand}
          onSave={(next) => {
            update((prev) => ({ ...prev, brand: next }))
            setShowSettings(false)
            toast.success('Ajustes guardados')
          }}
        />
      )}

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar la vitrina &quot;{deleting?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán también todos sus ítems y su enlace dejará de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                update((prev) => ({ ...prev, showcases: prev.showcases.filter((s) => s.id !== deleting.id) }))
                setDeleting(null)
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
