import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  GripVertical,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import {
  ItemFormSheet,
  ShowcaseItemCard,
  ShowcasePhonePreview,
  ShowcaseSettingsDialog,
} from '@/components/showcase/ShowcaseAdminSections'
import { EMPTY_ITEM_FORM, itemToForm } from '@/constants/moonCafeShowcase'
import useMoonCafeShowcase, { genId, showcasePublicUrl } from '@/hooks/useMoonCafeShowcase'
import { cn } from '@/lib/utils'

function CategoryChip({ name, count, active, dragging, onSelect, onRename, onRemove, dragHandlers }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)

  const commit = () => {
    const next = value.trim()
    if (next && next !== name) onRename(next)
    else setValue(name)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-gray-300 bg-white dark:bg-gray-900 pl-3 pr-1 py-0.5">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setValue(name)
              setEditing(false)
            }
          }}
          onBlur={commit}
          className="w-28 text-sm bg-transparent focus:outline-none"
        />
        <button onMouseDown={(e) => e.preventDefault()} onClick={commit} className="p-1 text-gray-500">
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      draggable
      {...dragHandlers}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap cursor-pointer transition-all select-none',
        active
          ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50',
        dragging && 'opacity-40 scale-95',
      )}
    >
      <GripVertical className="w-3.5 h-3.5 opacity-40 cursor-grab" />
      {name}
      <span className="opacity-50">{count}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
        className="opacity-50 hover:opacity-100"
        aria-label={`Renombrar ${name}`}
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="opacity-50 hover:opacity-100"
        aria-label={`Eliminar ${name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function VitrinaMoonCafe() {
  const { showcaseId } = useParams()
  const { brand, showcases, update, updateShowcase } = useMoonCafeShowcase()
  const showcase = showcases.find((s) => s.id === showcaseId)

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [form, setForm] = useState(null) // { id: string | null, initial }
  const [deleting, setDeleting] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [newCategory, setNewCategory] = useState(null)
  const [dragCat, setDragCat] = useState(null)

  if (!showcase) return <Navigate to="/vitrina/mooncafe-demo" replace />

  const { items, categories } = showcase
  const edit = (updater) => updateShowcase(showcase.id, updater)

  const query = search.trim().toLowerCase()
  const filtered = items
    .filter((i) => filterCat === 'all' || i.category === filterCat)
    .filter((i) => !query || i.name.toLowerCase().includes(query) || i.description?.toLowerCase().includes(query))

  const saveItem = (fields) => {
    edit((s) => ({
      ...s,
      items: form.id
        ? s.items.map((i) => (i.id === form.id ? { ...i, ...fields } : i))
        : [...s.items, { id: genId(), ...fields }],
    }))
    toast.success(form.id ? 'Ítem actualizado' : 'Ítem agregado')
    setForm(null)
  }

  const addCategory = (name) =>
    edit((s) => (s.categories.includes(name) ? s : { ...s, categories: [...s.categories, name] }))

  const renameCategory = (from, to) => {
    if (categories.includes(to)) return toast.error('Ya existe una categoría con ese nombre')
    edit((s) => ({
      ...s,
      categories: s.categories.map((c) => (c === from ? to : c)),
      items: s.items.map((i) => (i.category === from ? { ...i, category: to } : i)),
    }))
    if (filterCat === from) setFilterCat(to)
  }

  const removeCategory = (cat) => {
    edit((s) => ({
      ...s,
      categories: s.categories.filter((c) => c !== cat),
      items: s.items.map((i) => (i.category === cat ? { ...i, category: '' } : i)),
    }))
    if (filterCat === cat) setFilterCat('all')
  }

  const moveCategory = (from, to) => {
    if (!from || from === to) return
    edit((s) => {
      const next = s.categories.filter((c) => c !== from)
      next.splice(next.indexOf(to), 0, from)
      return { ...s, categories: next }
    })
  }

  const commitNewCategory = () => {
    const name = newCategory?.trim()
    if (name) addCategory(name)
    setNewCategory(null)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(showcasePublicUrl(showcase.id))
      toast.success('Enlace copiado')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          <Link
            to="/vitrina/mooncafe-demo"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a vitrinas
          </Link>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                <ShoppingBag className="w-8 h-8" /> {showcase.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-900">
                {[
                  ['gallery', 'Galería', LayoutGrid],
                  ['list', 'Lista', List],
                ].map(([value, label, Icon]) => (
                  <button
                    key={value}
                    onClick={() => edit((s) => ({ ...s, layout: value }))}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                      showcase.layout === value
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                    )}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowSettings(true)} title="Ajustes de la vitrina">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
              <Button variant="outline" asChild>
                <a href={`/showcase-demo/mooncafe/${showcase.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Ver vitrina
                </a>
              </Button>
              <Button variant="outline" size="icon" onClick={copyLink} title="Copiar enlace">
                <Copy className="w-4 h-4" />
              </Button>
              <Button onClick={() => setForm({ id: null, initial: EMPTY_ITEM_FORM })}>
                <Plus className="w-4 h-4 mr-2" /> Agregar ítem
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ítem..."
              className="pl-9 bg-white dark:bg-gray-900"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button
              onClick={() => setFilterCat('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
                filterCat === 'all'
                  ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 hover:bg-gray-50',
              )}
            >
              Todos <span className="opacity-60 ml-0.5">{items.length}</span>
            </button>
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                name={cat}
                count={items.filter((i) => i.category === cat).length}
                active={filterCat === cat}
                dragging={dragCat === cat}
                onSelect={() => setFilterCat(cat)}
                onRename={(to) => renameCategory(cat, to)}
                onRemove={() => removeCategory(cat)}
                dragHandlers={{
                  onDragStart: () => setDragCat(cat),
                  onDragOver: (e) => e.preventDefault(),
                  onDrop: () => moveCategory(dragCat, cat),
                  onDragEnd: () => setDragCat(null),
                }}
              />
            ))}
            {newCategory === null ? (
              <button
                onClick={() => setNewCategory('')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 hover:text-gray-900 hover:border-gray-400"
              >
                <Plus className="w-3.5 h-3.5" /> Categoría
              </button>
            ) : (
              <input
                autoFocus
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitNewCategory()
                  if (e.key === 'Escape') setNewCategory(null)
                }}
                onBlur={commitNewCategory}
                placeholder="Nueva categoría"
                className="w-40 px-3.5 py-1.5 rounded-full text-sm border border-gray-300 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            )}
          </div>

          {/* Items */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((item) => (
                  <ShowcaseItemCard
                    key={item.id}
                    item={item}
                    onEdit={(i) => setForm({ id: i.id, initial: itemToForm(i) })}
                    onDuplicate={(i) =>
                      edit((s) => ({ ...s, items: [...s.items, { ...i, id: genId(), name: `${i.name} (copia)` }] }))
                    }
                    onDelete={setDeleting}
                    onToggleVisible={(id) =>
                      edit((s) => ({
                        ...s,
                        items: s.items.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)),
                      }))
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-medium text-gray-700 dark:text-gray-300 mt-3">
                {items.length === 0 ? 'Tu vitrina todavía no tiene ítems' : 'No hay ítems que coincidan'}
              </p>
              {items.length === 0 && (
                <Button className="mt-4" onClick={() => setForm({ id: null, initial: EMPTY_ITEM_FORM })}>
                  <Plus className="w-4 h-4 mr-2" /> Agregar primer ítem
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="hidden xl:block flex-shrink-0 pt-24">
          <ShowcasePhonePreview brand={brand} showcase={showcase} />
        </div>
      </div>

      {form && (
        <ItemFormSheet
          key={form.id ?? 'new'}
          open
          onOpenChange={(open) => !open && setForm(null)}
          isEditing={Boolean(form.id)}
          categories={categories}
          onCreateCategory={addCategory}
          initialForm={form.initial}
          onSave={saveItem}
        />
      )}

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
            <AlertDialogTitle>¿Eliminar &quot;{deleting?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>Este ítem dejará de aparecer en tu vitrina.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                edit((s) => ({ ...s, items: s.items.filter((i) => i.id !== deleting.id) }))
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
