import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Package, Palette, Pencil, Plus, Store, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import ShowcaseView from '@/components/showcase/ShowcaseView'
import { MOONCAFE_STORES } from '@/constants/moonCafeClubs'
import { isOutOfStock, itemDisplayPrice } from '@/constants/moonCafeShowcase'
import { genId } from '@/hooks/useMoonCafeShowcase'
import { cn } from '@/lib/utils'

// ─── Image picker ─────────────────────────────────────────────────────────────

// Downscales to a JPEG data URL so uploaded images stay small enough for localStorage.
function fileToCompressedDataUrl(file, maxDim) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ImagePicker({ value, onChange, maxDim = 800, className = 'h-32', label = 'Subir imagen' }) {
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(await fileToCompressedDataUrl(file, maxDim))
    e.target.value = ''
  }

  const input = <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

  if (value) {
    return (
      <div
        className={cn('relative rounded-xl overflow-hidden bg-gray-100 group cursor-pointer', className)}
        onClick={() => inputRef.current?.click()}
      >
        <img src={value} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <button
          type="button"
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-900"
          onClick={(e) => {
            e.stopPropagation()
            onChange('')
          }}
          aria-label="Quitar imagen"
        >
          <X className="w-3 h-3" />
        </button>
        {input}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        'w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 dark:border-gray-700',
        'flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-600 transition-colors',
        className,
      )}
    >
      <Upload className="w-5 h-5" />
      <span className="text-sm">{label}</span>
      {input}
    </button>
  )
}

// ─── Item card ────────────────────────────────────────────────────────────────

export function ShowcaseItemCard({ item, onEdit, onDuplicate, onDelete, onToggleVisible }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm',
        !item.visible && 'opacity-60',
      )}
    >
      <div className="relative h-36 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Package className="w-7 h-7 text-gray-400" strokeWidth={1.5} />
        )}
        {item.category && (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-700/80 text-white">
            {item.category}
          </span>
        )}
        {isOutOfStock(item) && (
          <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-white text-red-600">
            Sin stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-900 dark:text-white leading-tight">{item.name}</p>
        {item.description && <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>}
        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1.5">{itemDisplayPrice(item)}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              title="Editar"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate(item)}
              title="Duplicar"
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item)}
              title="Eliminar"
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            Visible
            <Switch checked={item.visible} onCheckedChange={() => onToggleVisible(item.id)} />
          </label>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Item form (side sheet) ───────────────────────────────────────────────────

function SettingRow({ title, description, checked, onCheckedChange, children }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      {children}
    </div>
  )
}

export function ItemFormSheet({ open, onOpenChange, isEditing, categories, onCreateCategory, initialForm, onSave }) {
  const [form, setForm] = useState(initialForm)
  const [newCategory, setNewCategory] = useState(null)
  const set = (fields) => setForm((f) => ({ ...f, ...fields }))

  const validVariants = form.variants.filter((v) => v.name.trim() && v.price !== '')
  const canSave = form.name.trim() && (form.price_type === 'single' ? form.price !== '' : validVariants.length > 0)

  const createCategory = () => {
    const name = newCategory?.trim()
    if (!name) return
    onCreateCategory(name)
    set({ category: name })
    setNewCategory(null)
  }

  const updateVariant = (id, fields) =>
    set({ variants: form.variants.map((v) => (v.id === id ? { ...v, ...fields } : v)) })

  const handleSave = () => {
    if (!canSave) return
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      image_url: form.image_url,
      category: form.category,
      price_type: form.price_type,
      price: form.price_type === 'single' ? Number(form.price) : null,
      variants:
        form.price_type === 'variants'
          ? validVariants.map((v) => ({ id: v.id, name: v.name.trim(), price: Number(v.price) }))
          : [],
      stock_enabled: form.stock_enabled,
      stock: form.stock_enabled && form.stock !== '' ? Number(form.stock) : null,
      visible: form.visible,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-xl">{isEditing ? 'Editar ítem' : 'Agregar ítem'}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="space-y-2">
            <Label>Imagen</Label>
            <ImagePicker
              value={form.image_url}
              onChange={(v) => set({ image_url: v })}
              className="h-36"
              label="Subir imagen del producto"
            />
          </div>

          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input placeholder="Ej: Café con leche" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Descripción opcional..."
              rows={3}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {newCategory === null ? (
              <button
                type="button"
                onClick={() => setNewCategory('')}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900"
              >
                <Plus className="w-4 h-4" /> Crear categoría
              </button>
            ) : (
              <div className="flex gap-2">
                <Input
                  autoFocus
                  placeholder="Nombre de la categoría"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createCategory()}
                />
                <Button size="sm" className="h-10" onClick={createCategory} disabled={!newCategory.trim()}>
                  Crear
                </Button>
                <Button size="sm" variant="ghost" className="h-10" onClick={() => setNewCategory(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de precio</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['single', 'Precio único'],
                ['variants', 'Variantes'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set({ price_type: value })}
                  className={cn(
                    'h-11 rounded-lg border font-medium transition-colors',
                    form.price_type === value
                      ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {form.price_type === 'single' ? (
            <div className="space-y-2">
              <Label>Precio *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  min="0"
                  className="pl-7"
                  value={form.price}
                  onChange={(e) => set({ price: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Variantes *</Label>
              <div className="space-y-2">
                {form.variants.map((v) => (
                  <div key={v.id} className="flex gap-2">
                    <Input
                      placeholder="Ej: Grande"
                      value={v.name}
                      onChange={(e) => updateVariant(v.id, { name: e.target.value })}
                    />
                    <div className="relative w-36 flex-shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        min="0"
                        className="pl-7"
                        value={v.price}
                        onChange={(e) => updateVariant(v.id, { price: e.target.value })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-gray-400 hover:text-red-500"
                      disabled={form.variants.length === 1}
                      onClick={() => set({ variants: form.variants.filter((x) => x.id !== v.id) })}
                      aria-label="Quitar variante"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => set({ variants: [...form.variants, { id: genId(), name: '', price: '' }] })}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900"
              >
                <Plus className="w-4 h-4" /> Agregar variante
              </button>
            </div>
          )}

          <SettingRow
            title="Control de stock"
            description='Muestra "Sin stock" cuando se agote.'
            checked={form.stock_enabled}
            onCheckedChange={(v) => set({ stock_enabled: v })}
          >
            {form.stock_enabled && (
              <Input
                type="number"
                min="0"
                placeholder="Cantidad disponible"
                value={form.stock}
                onChange={(e) => set({ stock: e.target.value })}
              />
            )}
          </SettingRow>

          <SettingRow
            title="Visible en catálogo"
            description="Los clientes pueden verlo en la vitrina."
            checked={form.visible}
            onCheckedChange={(v) => set({ visible: v })}
          />
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={!canSave}>
            {isEditing ? 'Guardar cambios' : 'Agregar ítem'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Brand settings dialog ────────────────────────────────────────────────────

export function ShowcaseSettingsDialog({ open, onOpenChange, brand, onSave }) {
  const [draft, setDraft] = useState(brand)
  const set = (fields) => setDraft((d) => ({ ...d, ...fields }))
  const validColor = /^#[0-9a-f]{6}$/i.test(draft.color)

  const toggleStore = (id) =>
    set({
      store_ids: draft.store_ids.includes(id) ? draft.store_ids.filter((s) => s !== id) : [...draft.store_ids, id],
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Ajustes de la vitrina</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" /> Apariencia
            </TabsTrigger>
            <TabsTrigger value="stores" className="gap-2">
              <Store className="w-4 h-4" /> Sucursales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-5 pt-2">
            <p className="text-sm text-gray-500">La identidad compartida por todas las vitrinas de tu marca.</p>

            <div className="space-y-2">
              <Label>Nombre a mostrar</Label>
              <Input value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Café Moon" />
              <p className="text-xs text-gray-500">Si lo dejas vacío se usa el nombre de la marca.</p>
            </div>

            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={draft.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Color principal</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={validColor ? draft.color : '#000000'}
                  onChange={(e) => set({ color: e.target.value })}
                  className="w-12 h-10 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <Input
                  value={draft.color}
                  onChange={(e) => set({ color: e.target.value })}
                  className={cn('w-36 font-mono', !validColor && 'border-red-400')}
                />
              </div>
              <p className="text-xs text-gray-500">Color de acento de la página pública (formato #RRGGBB).</p>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 items-center">
              <Label>Logo</Label>
              <ImagePicker
                value={draft.logo_url}
                onChange={(v) => set({ logo_url: v })}
                maxDim={500}
                className="w-24 h-24"
                label="Subir"
              />
              <Label>Banner</Label>
              <ImagePicker
                value={draft.banner_url}
                onChange={(v) => set({ banner_url: v })}
                maxDim={1200}
                className="h-24"
                label="Subir banner (1200 × 400)"
              />
            </div>
          </TabsContent>

          <TabsContent value="stores" className="space-y-3 pt-2">
            <p className="text-sm text-gray-500">Elige en qué sucursales se muestran tus vitrinas.</p>
            {MOONCAFE_STORES.map((store) => (
              <label
                key={store.store_id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Checkbox
                  checked={draft.store_ids.includes(store.store_id)}
                  onCheckedChange={() => toggleStore(store.store_id)}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{store.store_name}</p>
                  <p className="text-sm text-gray-500">
                    {store.address}, {store.city}
                  </p>
                </div>
              </label>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(draft)} disabled={!validColor}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Mobile preview ───────────────────────────────────────────────────────────

export function ShowcasePhonePreview({ brand, showcase }) {
  return (
    <div className="sticky top-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">Vista móvil</p>
      <div className="relative mx-auto rounded-[2.5rem] bg-gray-900 shadow-2xl" style={{ width: 300, padding: 10 }}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-gray-700 z-20" />
        <div className="rounded-[2rem] overflow-hidden bg-white" style={{ height: 580 }}>
          <ShowcaseView brand={brand} showcase={showcase} compact />
        </div>
        <div className="flex justify-center mt-2.5 mb-1">
          <div className="w-20 h-1 rounded-full bg-gray-700" />
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">Así ven la vitrina tus clientes.</p>
    </div>
  )
}
