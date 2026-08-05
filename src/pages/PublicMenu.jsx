import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Coins, X, ShoppingBag, ChevronDown, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'repeat_catalog'

function loadCatalog() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      // normalize categories to strings if they were objects
      if (Array.isArray(data.categories) && data.categories.length > 0 && typeof data.categories[0] === 'object') {
        data.categories = data.categories.map((c) => c.name ?? c)
      }
      return data
    }
  } catch {
    /* ignore */
  }
  return { items: [], categories: [], settings: { name: 'Menú', color: '#111827', logo_url: '' } }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value, priceType) {
  if (value == null) return null
  return priceType === 'points'
    ? `${Math.round(value).toLocaleString('es-AR')} pts`
    : `$${Math.round(value).toLocaleString('es-AR')}`
}

function formatPrice(item) {
  return formatCurrency(item.price, item.price_type)
}

// ─── Ordering options (static demo data, same for every product) ──────────────

const VARIANT_OPTIONS = [
  { id: 'simple', label: 'Simple', multiplier: 1 },
  { id: 'doble', label: 'Doble', multiplier: 1.25 },
  { id: 'triple', label: 'Triple', multiplier: 1.42 },
]

const ADDON_OPTIONS = [
  { id: 'queso', label: 'Queso extra', pct: 0.08 },
  { id: 'panceta', label: 'Panceta', pct: 0.15 },
  { id: 'huevo', label: 'Huevo frito', pct: 0.1 },
  { id: 'papas', label: 'Papas grandes', pct: 0.2 },
]

const OBSERVATIONS_MAX = 150

function roundToStep(value, priceType) {
  const step = priceType === 'points' ? 10 : 100
  return Math.round(value / step) * step
}

// Base variant (multiplier 1) always resolves to the catalog's exact price — only the
// delta added by bigger presentations gets rounded to a clean step.
function getVariantPrice(item, option) {
  return item.price + roundToStep(item.price * (option.multiplier - 1), item.price_type)
}

// ─── Variant option (radio row) ────────────────────────────────────────────────

function VariantOption({ option, item, color, selected, onSelect }) {
  const price = getVariantPrice(item, option)
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-colors"
      style={
        selected ? { borderColor: color, borderWidth: 2, backgroundColor: `${color}0d` } : { borderColor: '#e5e7eb' }
      }
    >
      <span className="flex items-center gap-3">
        <span
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: selected ? color : '#d1d5db' }}
        >
          {selected && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />}
        </span>
        <span className="text-sm font-medium text-gray-900">{option.label}</span>
      </span>
      <span className="text-sm font-semibold text-gray-900">{formatCurrency(price, item.price_type)}</span>
    </button>
  )
}

// ─── Item detail modal ────────────────────────────────────────────────────────

function ItemModal({ item, color, onClose }) {
  const [variant, setVariant] = useState(VARIANT_OPTIONS[0].id)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [addonsOpen, setAddonsOpen] = useState(false)
  const [observations, setObservations] = useState('')
  const [quantity, setQuantity] = useState(1)

  const activeVariant = VARIANT_OPTIONS.find((v) => v.id === variant) ?? VARIANT_OPTIONS[0]
  const basePrice = getVariantPrice(item, activeVariant)
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_OPTIONS.find((a) => a.id === id)
    return sum + (addon ? roundToStep(item.price * addon.pct, item.price_type) : 0)
  }, 0)
  const unitPrice = basePrice + addonsTotal
  const total = unitPrice * quantity
  const canAdd = item.available && !(item.stock_enabled && item.stock === 0)

  const toggleAddon = (id) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const handleAddClick = () => {
    toast(`Agregaste ${quantity} × ${item.name} — ${formatCurrency(total, item.price_type)}`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 bg-gray-100 flex-shrink-0">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-14 h-14 text-gray-300" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {!item.available && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-full shadow">
                No disponible
              </span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            <div>
              {item.category && (
                <span className="text-xs font-semibold uppercase tracking-wide mb-1 block" style={{ color }}>
                  {item.category}
                </span>
              )}
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              {item.description && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>}
              {item.stock_enabled && (
                <span
                  className={cn(
                    'inline-block mt-2 text-xs font-semibold px-3 py-1.5 rounded-full',
                    item.stock === 0 || item.stock == null
                      ? 'bg-red-50 text-red-500'
                      : 'bg-emerald-50 text-emerald-600',
                  )}
                >
                  {item.stock === 0 || item.stock == null ? 'Sin stock' : `${item.stock} disponibles`}
                </span>
              )}
            </div>

            {formatPrice(item) ? (
              <>
                {/* Presentaciones */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Presentaciones</h3>
                  <div className="space-y-2">
                    {VARIANT_OPTIONS.map((opt) => (
                      <VariantOption
                        key={opt.id}
                        option={opt}
                        item={item}
                        color={color}
                        selected={variant === opt.id}
                        onSelect={setVariant}
                      />
                    ))}
                  </div>
                </section>

                {/* Adicionales */}
                <section className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAddonsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50"
                  >
                    <span className="text-left">
                      <span className="block text-sm font-bold text-gray-900">Complementos para tu pedido</span>
                      <span className="block text-xs text-gray-400 mt-0.5">Adicionales · elegí las que quieras</span>
                    </span>
                    <ChevronDown
                      className={cn('w-4 h-4 text-gray-400 transition-transform', addonsOpen && 'rotate-180')}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {addonsOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 space-y-1">
                          {ADDON_OPTIONS.map((addon) => {
                            const price = roundToStep(item.price * addon.pct, item.price_type)
                            const checked = selectedAddons.includes(addon.id)
                            return (
                              <label
                                key={addon.id}
                                className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleAddon(addon.id)}
                                    className="w-4 h-4 rounded border-gray-300"
                                    style={{ accentColor: color }}
                                  />
                                  <span className="text-sm text-gray-700">{addon.label}</span>
                                </span>
                                <span className="text-sm text-gray-500">
                                  + {formatCurrency(price, item.price_type)}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                {/* Observaciones */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Observaciones</h3>
                  <textarea
                    value={observations}
                    maxLength={OBSERVATIONS_MAX}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ej: sin cebolla, poca sal..."
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none"
                    style={{ '--tw-ring-color': `${color}55` }}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {observations.length}/{OBSERVATIONS_MAX}
                  </div>
                </section>
              </>
            ) : (
              <span className="text-sm text-gray-400">Precio no disponible</span>
            )}
          </div>
        </div>

        {formatPrice(item) && (
          <div className="flex-shrink-0 border-t border-gray-100 p-4 flex items-center gap-3 bg-white">
            <div className="flex items-center border border-gray-200 rounded-full flex-shrink-0">
              <button
                type="button"
                disabled={!item.available}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-gray-900">{quantity}</span>
              <button
                type="button"
                disabled={!item.available}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-600 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAddClick}
              className="flex-1 h-11 rounded-full text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: color }}
            >
              Agregar · {formatCurrency(total, item.price_type)}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Item card ────────────────────────────────────────────────────────────────

function CatalogItem({ item, color, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'w-full text-left bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all',
        item.available ? 'border-gray-100' : 'border-gray-200 opacity-60',
      )}
    >
      <div className="relative h-36 bg-gray-100">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {item.stock_enabled && item.stock === 0 && item.available && (
          <div className="absolute bottom-2 left-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/90 text-white">Sin stock</span>
          </div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <p className="font-semibold text-sm text-gray-900 leading-tight line-clamp-1">{item.name}</p>
        {item.description && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>}
        {formatPrice(item) && (
          <div className="flex items-center gap-1 pt-0.5">
            {item.price_type === 'points' && <Coins className="w-3.5 h-3.5" style={{ color }} />}
            <span className="text-sm font-bold" style={{ color }}>
              {formatPrice(item)}
            </span>
          </div>
        )}
      </div>
    </motion.button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PublicMenu() {
  const [catalog, setCatalog] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const pillsRef = useRef(null)

  useEffect(() => {
    const data = loadCatalog()
    setCatalog(data)
    const available = data.items.filter((i) => i.available)
    const firstCat = data.categories.find((c) => available.some((i) => i.category === c))
    if (firstCat) setActiveCategory(firstCat)
  }, [])

  if (!catalog) return null

  const { items, categories, settings } = catalog
  const color = settings?.color || '#111827'
  const name = settings?.name || 'Mi negocio'
  const subtitle = settings?.subtitle || 'Gracias por elegirnos'
  const logoUrl = settings?.logo_url || ''
  const bannerUrl = settings?.banner_url || ''

  const availableItems = items.filter((i) => i.available)
  const visibleItems =
    activeCategory === 'all' ? availableItems : availableItems.filter((i) => i.category === activeCategory)

  const usedCategories = categories.filter((c) => availableItems.some((i) => i.category === c))

  const hasPills = usedCategories.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 relative overflow-hidden shadow-sm" style={{ backgroundColor: color }}>
        {/* Banner image + gradient overlay */}
        {bannerUrl && (
          <>
            <img src={bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/80" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10">
          <div
            className={cn('max-w-2xl mx-auto px-4 flex gap-3', bannerUrl ? 'pt-8 pb-5 flex-col' : 'py-4 items-center')}
          >
            {bannerUrl ? (
              /* ── Banner layout: logo + text stacked ── */
              <div className="flex items-end gap-3">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 flex-shrink-0 shadow-lg"
                  />
                )}
                <div className="min-w-0 pb-0.5">
                  <h1 className="text-white font-bold text-xl leading-tight drop-shadow">{name}</h1>
                  <p className="text-white/70 text-sm mt-0.5 drop-shadow">{subtitle}</p>
                </div>
              </div>
            ) : (
              /* ── No banner: compact row ── */
              <>
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/20 flex-shrink-0"
                  />
                )}
                {!logoUrl && (
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-white font-bold text-lg leading-tight truncate">{name}</h1>
                  <p className="text-white/60 text-xs">{subtitle}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Category pills — sticky bar below header */}
      {hasPills && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div
            ref={pillsRef}
            className="max-w-2xl mx-auto flex gap-2 px-4 py-2.5 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {usedCategories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? 'all' : cat)}
                  className={cn(
                    'flex items-center px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all border',
                    isActive
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                  style={isActive ? { backgroundColor: color, borderColor: color } : {}}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {availableItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">El catálogo no tiene ítems disponibles.</p>
          </motion.div>
        ) : visibleItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Sin ítems en esta categoría.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {visibleItems.map((item) => (
              <CatalogItem key={item.id} item={item} color={color} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedItem && (
          <ItemModal key={selectedItem.id} item={selectedItem} color={color} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
