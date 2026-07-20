import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Package,
  Coins,
  X,
  ExternalLink,
  Settings,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'repeat_catalog'

function loadCatalog() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      // migrate object[] categories back to string[]
      if (Array.isArray(data.categories) && data.categories.length > 0 && typeof data.categories[0] === 'object') {
        data.categories = data.categories.map((c) => c.name ?? c)
      }
      if (!data.settings)
        data.settings = {
          name: '',
          subtitle: 'Gracias por elegirnos',
          color: '#111827',
          logo_url: '',
          logo_type: 'square',
          banner_url: '',
        }
      if (data.settings && data.settings.subtitle === undefined) data.settings.subtitle = 'Gracias por elegirnos'
      if (data.settings && data.settings.name === 'Mi Menú') data.settings.name = ''
      if (data.settings && data.settings.logo_type === undefined) data.settings.logo_type = 'square'
      if (data.settings && data.settings.banner_url === undefined) data.settings.banner_url = ''
      return data
    }
  } catch {
    /* ignore */
  }
  return {
    items: [],
    categories: [],
    settings: {
      name: '',
      subtitle: 'Gracias por elegirnos',
      color: '#111827',
      logo_url: '',
      logo_type: 'square',
      banner_url: '',
    },
  }
}

function saveCatalog(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─── Image utils ──────────────────────────────────────────────────────────────

async function compressImage(file, maxDim = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  description: '',
  image_url: null,
  price_type: 'points',
  price: '',
  category: '',
  stock_enabled: false,
  stock: '',
  available: true,
}

// ─── ImagePicker ──────────────────────────────────────────────────────────────

function ImagePicker({ value, onChange, maxDim = 800, className = 'h-32', label = 'Subir imagen' }) {
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await compressImage(file, maxDim)
    onChange(dataUrl)
    e.target.value = ''
  }

  if (value) {
    return (
      <div
        className={cn('relative rounded-xl overflow-hidden bg-gray-100 group cursor-pointer', className)}
        onClick={() => inputRef.current?.click()}
      >
        <img src={value} alt="preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <button
          type="button"
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onChange(null)
          }}
        >
          <X className="w-3 h-3" />
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        'w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 dark:border-gray-700',
        'flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-500 transition-colors',
        className,
      )}
    >
      <Upload className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </button>
  )
}

// ─── Item card ────────────────────────────────────────────────────────────────

function ItemCard({ item, onEdit, onDelete, onToggle, onDuplicate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all',
        item.available
          ? 'border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
          : 'border-gray-200 dark:border-gray-700 opacity-60',
      )}
    >
      <div className="relative h-36 bg-gray-100 dark:bg-gray-800">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-full border">
              No disponible
            </span>
          </div>
        )}
        {item.category && (
          <span className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full bg-black/50 text-white">
            {item.category}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white leading-tight">{item.name}</p>
          {item.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {item.price_type === 'points' ? (
              <Coins className="w-4 h-4 text-amber-500" />
            ) : (
              <span className="text-sm font-bold text-gray-500">$</span>
            )}
            <span className="font-bold text-gray-900 dark:text-white">
              {item.price != null ? item.price.toLocaleString('es-AR') : '—'}
            </span>
            {item.price_type === 'points' && <span className="text-xs text-gray-400">pts</span>}
          </div>
          {item.stock_enabled && (
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                item.stock === 0
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
              )}
            >
              {item.stock === 0 ? 'Sin stock' : `Stock: ${item.stock}`}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onEdit(item)}
              title="Editar"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate(item)}
              title="Duplicar"
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Eliminar"
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onToggle(item.id)}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              item.available
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200',
            )}
          >
            {item.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {item.available ? 'Visible' : 'Oculto'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Item form dialog ─────────────────────────────────────────────────────────

function ItemFormDialog({ open, onOpenChange, formData, setFormData, onSave, editingId, categories }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Editar ítem' : 'Nuevo ítem'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label>Imagen</Label>
            <ImagePicker
              value={formData.image_url}
              onChange={(v) => setFormData((f) => ({ ...f, image_url: v }))}
              className="h-36"
              label="Subir imagen del producto"
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Nombre <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="Ej: Café con leche"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Descripción opcional..."
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
              className="w-full h-10 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Precio</Label>
            <div className="flex gap-2">
              <div className="flex rounded-lg border border-input overflow-hidden text-sm flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setFormData((f) => ({ ...f, price_type: 'points' }))}
                  className={cn(
                    'px-3 py-2 font-medium transition-colors flex items-center gap-1.5',
                    formData.price_type === 'points'
                      ? 'bg-gray-900 text-white'
                      : 'bg-background text-gray-500 hover:bg-gray-50',
                  )}
                >
                  <Coins className="w-3.5 h-3.5" /> Puntos
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((f) => ({ ...f, price_type: 'money' }))}
                  className={cn(
                    'px-3 py-2 font-medium transition-colors',
                    formData.price_type === 'money'
                      ? 'bg-gray-900 text-white'
                      : 'bg-background text-gray-500 hover:bg-gray-50',
                  )}
                >
                  $ Pesos
                </button>
              </div>
              <Input
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Control de stock</Label>
              <Switch
                checked={formData.stock_enabled}
                onCheckedChange={(v) => setFormData((f) => ({ ...f, stock_enabled: v }))}
              />
            </div>
            <AnimatePresence>
              {formData.stock_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    type="number"
                    placeholder="Cantidad disponible"
                    value={formData.stock}
                    onChange={(e) => setFormData((f) => ({ ...f, stock: e.target.value }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Visible en catálogo</p>
              <p className="text-xs text-gray-400">Los clientes pueden verlo</p>
            </div>
            <Switch
              checked={formData.available}
              onCheckedChange={(v) => setFormData((f) => ({ ...f, available: v }))}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={onSave} disabled={!formData.name.trim()}>
              {editingId ? 'Guardar cambios' : 'Agregar ítem'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Settings panel ───────────────────────────────────────────────────────────

function SettingsPanel({ settings, onChange }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-5 border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuración del catálogo</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* ─ Logo ─ */}
        <div className="space-y-2">
          <Label className="text-xs">Logo (500 × 500)</Label>
          <div className="flex justify-center">
            <div className="w-24">
              <ImagePicker
                value={settings.logo_url || null}
                onChange={(v) => onChange({ ...settings, logo_url: v || '' })}
                maxDim={500}
                className="h-24 rounded-2xl"
                label="Subir logo"
              />
            </div>
          </div>
        </div>

        {/* ─ Text + Color ─ */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre / Marca</Label>
            <Input
              placeholder="Moon Café"
              value={settings.name}
              onChange={(e) => onChange({ ...settings, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subtítulo</Label>
            <Input
              placeholder="Gracias por elegirnos"
              value={settings.subtitle ?? ''}
              onChange={(e) => onChange({ ...settings, subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Color principal</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={settings.color}
                onChange={(e) => onChange({ ...settings, color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
              <Input
                value={settings.color}
                onChange={(e) => onChange({ ...settings, color: e.target.value })}
                placeholder="#111827"
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─ Banner ─ */}
      <div className="space-y-1.5">
        <Label className="text-xs">Banner del header</Label>
        <ImagePicker
          value={settings.banner_url || null}
          onChange={(v) => onChange({ ...settings, banner_url: v || '' })}
          maxDim={1200}
          className="h-28"
          label="Subir imagen de banner (recomendado: 1200 × 400)"
        />
      </div>
    </div>
  )
}

// ─── Mobile preview ───────────────────────────────────────────────────────────

function MobilePreview({ iframeKey }) {
  return (
    <div className="sticky top-[15vh] mt-16">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">Vista móvil</p>
      <div className="relative mx-auto rounded-[2.5rem] bg-gray-900 shadow-2xl" style={{ width: 270, padding: 10 }}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-gray-700" />
        <div className="rounded-[2rem] overflow-hidden bg-white" style={{ height: 536 }}>
          <iframe
            key={iframeKey}
            src="/catalog/my-menu"
            className="w-full h-full border-0 bg-gray-50"
            title="Vista previa del catálogo"
          />
        </div>
        <div className="flex justify-center mt-2.5 mb-1">
          <div className="w-20 h-1 rounded-full bg-gray-700" />
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">Se actualiza al guardar cambios</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Menu() {
  const [catalog, setCatalog] = useState(loadCatalog)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [filterCat, setFilterCat] = useState('all')
  const [newCatInput, setNewCatInput] = useState('')
  const [showCatManager, setShowCatManager] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [iframeKey, setIframeKey] = useState(0)
  const refreshTimer = useRef(null)

  const { items, categories, settings } = catalog

  useEffect(() => {
    saveCatalog(catalog)
    clearTimeout(refreshTimer.current)
    refreshTimer.current = setTimeout(() => setIframeKey((k) => k + 1), 500)
    return () => clearTimeout(refreshTimer.current)
  }, [catalog])

  const filtered = filterCat === 'all' ? items : items.filter((i) => i.category === filterCat)

  const openAdd = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      description: item.description || '',
      image_url: item.image_url || null,
      price_type: item.price_type || 'points',
      price: item.price ?? '',
      category: item.category || '',
      stock_enabled: item.stock_enabled || false,
      stock: item.stock ?? '',
      available: item.available !== false,
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return
    const item = {
      id: editingId || genId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      image_url: formData.image_url || null,
      price_type: formData.price_type,
      price: formData.price === '' ? null : Number(formData.price),
      category: formData.category,
      stock_enabled: formData.stock_enabled,
      stock: formData.stock_enabled && formData.stock !== '' ? Number(formData.stock) : null,
      available: formData.available,
    }
    setCatalog((prev) => ({
      ...prev,
      items: editingId ? prev.items.map((i) => (i.id === editingId ? item : i)) : [...prev.items, item],
    }))
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setCatalog((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }))
    setDeleteConfirm(null)
  }

  const handleDuplicate = (item) => {
    setCatalog((prev) => ({ ...prev, items: [...prev.items, { ...item, id: genId(), name: `${item.name} (copia)` }] }))
  }

  const toggleAvailable = (id) => {
    setCatalog((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)),
    }))
  }

  const addCategory = () => {
    const name = newCatInput.trim()
    if (!name || categories.includes(name)) return
    setCatalog((prev) => ({ ...prev, categories: [...prev.categories, name] }))
    setNewCatInput('')
    setShowCatManager(false)
  }

  const removeCategory = (cat) => {
    setCatalog((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
      items: prev.items.map((i) => (i.category === cat ? { ...i, category: '' } : i)),
    }))
    if (filterCat === cat) setFilterCat('all')
  }

  const updateSettings = (newSettings) => setCatalog((prev) => ({ ...prev, settings: newSettings }))

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto flex gap-8 items-start">
        {/* ── Left: management ── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menú / Catálogo</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings((v) => !v)}
                className={cn(
                  'p-2 rounded-lg border transition-colors',
                  showSettings
                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-300'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
                )}
              >
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <a
                href="/catalog/my-menu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Ver catálogo
              </a>
              <Button onClick={openAdd} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Agregar ítem
              </Button>
            </div>
          </div>

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-5"
              >
                <SettingsPanel settings={settings} onChange={updateSettings} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categories row — always visible */}
          <div className="mb-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setFilterCat('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors',
                    filterCat === 'all'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200',
                  )}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors',
                      filterCat === cat
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200',
                    )}
                  >
                    {cat}
                    <span className="text-xs opacity-60">{items.filter((i) => i.category === cat).length}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCategory(cat)
                      }}
                      className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCatManager((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors border',
                  showCatManager
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                    : 'border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600 hover:border-gray-400',
                )}
              >
                <Plus className="w-3.5 h-3.5" /> Categoría
              </button>
            </div>

            <AnimatePresence>
              {showCatManager && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 pt-1">
                    <Input
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                      placeholder="Nombre de la categoría..."
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={addCategory} disabled={!newCatInput.trim()}>
                      Agregar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Sin ítems todavía</p>
                <p className="text-sm text-gray-400 mt-1">Agregá tu primer producto o servicio.</p>
              </div>
              <Button onClick={openAdd} className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" /> Agregar primer ítem
              </Button>
            </motion.div>
          )}

          {/* Items grid */}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={setDeleteConfirm}
                  onToggle={toggleAvailable}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}

          {items.length > 0 && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Sin ítems en esta categoría.</div>
          )}
        </div>

        {/* ── Right: mobile preview ── */}
        <div className="hidden xl:block flex-shrink-0">
          <MobilePreview iframeKey={iframeKey} />
        </div>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-center font-semibold text-gray-900 dark:text-white mb-1">¿Eliminar ítem?</p>
              <p className="text-center text-sm text-gray-500 mb-5">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ItemFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        editingId={editingId}
        categories={categories}
      />
    </div>
  )
}
