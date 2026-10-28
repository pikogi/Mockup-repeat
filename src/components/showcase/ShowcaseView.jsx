import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Package, X } from 'lucide-react'
import { AddToOrder, CartBar, CheckoutSheet, OrderSent } from '@/components/showcase/ShowcaseOrdering'
import { lineKey } from '@/constants/moonCafeSales'
import { formatShowcasePrice, isOutOfStock, itemDisplayPrice } from '@/constants/moonCafeShowcase'
import { cn } from '@/lib/utils'

// Vista pública de una vitrina. La usan la página pública y la "Vista móvil" del
// admin. `compact` fuerza el layout de teléfono (las clases responsive dependen
// del viewport, no del contenedor) y monta el modal de detalle dentro del marco.

function ItemImage({ item, className }) {
  return (
    <div className={cn('relative bg-gray-100 flex items-center justify-center overflow-hidden', className)}>
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <Package className="w-1/3 max-w-8 h-auto text-gray-300" strokeWidth={1.5} />
      )}
    </div>
  )
}

function StockBadge() {
  return (
    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-red-600 border border-red-100">
      Sin stock
    </span>
  )
}

function GalleryCard({ item, color, compact, onOpen }) {
  const soldOut = isOutOfStock(item)
  return (
    <button
      onClick={() => onOpen(item)}
      className={cn(
        'text-left bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]',
        soldOut && 'opacity-60',
      )}
      style={{ borderColor: `${color}80` }}
    >
      <div className="relative">
        <ItemImage item={item} className={compact ? 'h-24' : 'h-28 sm:h-36'} />
        {soldOut && <StockBadge />}
      </div>
      <div className={compact ? 'p-2.5' : 'p-3'}>
        <p className={cn('font-semibold text-gray-900 leading-tight', compact ? 'text-xs' : 'text-sm')}>{item.name}</p>
        {item.description && (
          <p className={cn('text-gray-500 mt-0.5 line-clamp-2', compact ? 'text-[10px]' : 'text-xs')}>
            {item.description}
          </p>
        )}
        <p className={cn('font-bold text-gray-900 mt-1.5', compact ? 'text-xs' : 'text-sm')}>
          {itemDisplayPrice(item)}
        </p>
      </div>
    </button>
  )
}

function ListRow({ item, color, compact, onOpen }) {
  const soldOut = isOutOfStock(item)
  return (
    <button
      onClick={() => onOpen(item)}
      className={cn(
        'w-full text-left bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-start gap-3',
        compact ? 'p-2.5' : 'p-3',
        soldOut && 'opacity-60',
      )}
      style={{ borderColor: `${color}80` }}
    >
      {item.image_url && (
        <ItemImage item={item} className={cn('rounded-xl flex-shrink-0', compact ? 'w-12 h-12' : 'w-16 h-16')} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('font-semibold text-gray-900 leading-tight', compact ? 'text-xs' : 'text-sm')}>
            {item.name}
          </p>
          <p className={cn('font-bold text-gray-900 whitespace-nowrap', compact ? 'text-xs' : 'text-sm')}>
            {itemDisplayPrice(item)}
          </p>
        </div>
        {item.description && (
          <p className={cn('text-gray-500 mt-0.5 line-clamp-2', compact ? 'text-[10px]' : 'text-xs')}>
            {item.description}
          </p>
        )}
        {soldOut && <p className="text-[10px] font-semibold text-red-600 mt-1">Sin stock</p>}
      </div>
    </button>
  )
}

function ItemDetail({ item, compact, onClose, onAdd }) {
  const soldOut = isOutOfStock(item)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50',
        compact ? 'absolute items-end sm:items-end' : 'fixed p-0 sm:p-4',
      )}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className={cn(
          'relative bg-white w-full overflow-hidden shadow-xl',
          compact ? 'rounded-t-2xl' : 'max-w-sm rounded-t-3xl sm:rounded-3xl',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-gray-900"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
        <ItemImage item={item} className={compact ? 'h-36' : 'h-48'} />
        <div className={compact ? 'p-4 space-y-3' : 'p-5 space-y-4'}>
          <div>
            <p className={cn('font-bold text-gray-900', compact ? 'text-sm' : 'text-lg')}>{item.name}</p>
            {item.description && (
              <p className={cn('text-gray-600 mt-1', compact ? 'text-xs' : 'text-sm')}>{item.description}</p>
            )}
          </div>
          {onAdd ? (
            <AddToOrder item={item} soldOut={soldOut} onAdd={onAdd} />
          ) : (
            <>
              {item.price_type === 'variants' ? (
                <div className="rounded-xl bg-gray-50 divide-y divide-gray-100">
                  {item.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between px-3 py-2.5">
                      <span className={cn('text-gray-600', compact ? 'text-xs' : 'text-sm')}>{v.name}</span>
                      <span className={cn('font-bold text-gray-900', compact ? 'text-sm' : 'text-base')}>
                        {formatShowcasePrice(v.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 flex items-center justify-between px-3 py-3">
                  <span className={cn('text-gray-500', compact ? 'text-[11px]' : 'text-xs')}>Precio</span>
                  <span className={cn('font-bold text-gray-900', compact ? 'text-base' : 'text-xl')}>
                    {formatShowcasePrice(item.price)}
                  </span>
                </div>
              )}
              {soldOut && <p className="text-xs font-semibold text-red-600 text-center">Sin stock por el momento</p>}
              <button
                onClick={onClose}
                className={cn(
                  'w-full rounded-xl bg-gray-900 text-white font-semibold',
                  compact ? 'py-2 text-xs' : 'py-3 text-sm',
                )}
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// `ordering` (optional) turns the showcase into a WhatsApp ordering page; see CheckoutSheet.
export default function ShowcaseView({ brand, showcase, layout, compact = false, ordering }) {
  const [openItem, setOpenItem] = useState(null)
  const [cart, setCart] = useState([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [sentOrder, setSentOrder] = useState(null)

  const addToCart = (item, variant, qty) => {
    const key = lineKey(showcase.id, item.id, variant?.id)
    setCart((prev) =>
      prev.some((l) => l.key === key)
        ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [
            ...prev,
            {
              key,
              showcase_id: showcase.id,
              item_id: item.id,
              name: item.name,
              variant_name: variant?.name ?? null,
              category: item.category,
              image_url: item.image_url,
              unit_price: Number(variant?.price ?? item.price ?? 0),
              qty,
            },
          ],
    )
    setOpenItem(null)
  }

  const changeQty = (key, delta) =>
    setCart((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0))

  const sectionRefs = useRef({})
  const color = brand.color || '#111827'
  const activeLayout = layout ?? showcase.layout

  const visibleItems = showcase.items.filter((i) => i.visible)
  // Categorías en el orden definido por el admin; los ítems sin categoría van al final.
  const sections = [
    ...showcase.categories.map((cat) => ({ name: cat, items: visibleItems.filter((i) => i.category === cat) })),
    { name: 'Otros', items: visibleItems.filter((i) => !i.category || !showcase.categories.includes(i.category)) },
  ].filter((s) => s.items.length > 0)

  const scrollTo = (name) => sectionRefs.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className={cn('bg-gray-50', compact ? 'relative h-full' : 'min-h-screen')}>
      {/* In compact mode the content scrolls inside the phone frame, and the detail
          sheet is a sibling so it stays pinned to the frame instead of the content. */}
      <div className={compact ? 'h-full overflow-y-auto' : undefined} style={{ scrollbarWidth: 'none' }}>
        {/* Header */}
        <header
          className="relative overflow-hidden"
          style={
            brand.banner_url
              ? { backgroundImage: `url(${brand.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          <div
            className={cn(
              'absolute inset-0',
              brand.banner_url ? 'bg-black/50' : 'bg-gradient-to-b from-gray-900 to-gray-950',
            )}
          />
          <div
            className={cn(
              'relative flex items-center gap-3 mx-auto',
              compact ? 'px-4 pt-8 pb-4' : 'max-w-3xl px-4 sm:px-6 py-5',
            )}
          >
            <div
              className={cn(
                'rounded-2xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0',
                compact ? 'w-11 h-11' : 'w-14 h-14',
              )}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <Package className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className="min-w-0">
              <p className={cn('font-bold text-white leading-tight truncate', compact ? 'text-sm' : 'text-lg')}>
                {brand.name}
              </p>
              <p className={cn('text-white/90 font-medium truncate', compact ? 'text-[11px]' : 'text-sm')}>
                {showcase.name}
              </p>
              {brand.subtitle && (
                <p className={cn('text-white/60 truncate', compact ? 'text-[10px]' : 'text-xs')}>{brand.subtitle}</p>
              )}
            </div>
          </div>
        </header>

        {/* Category chips */}
        {sections.length > 1 && (
          <nav className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur border-b border-gray-100">
            <div
              className={cn(
                'flex gap-2 overflow-x-auto mx-auto',
                compact ? 'px-3 py-2' : 'max-w-3xl px-4 sm:px-6 py-3',
              )}
              style={{ scrollbarWidth: 'none' }}
            >
              {sections.map((s) => (
                <button
                  key={s.name}
                  onClick={() => scrollTo(s.name)}
                  className={cn(
                    'flex-shrink-0 rounded-full border border-gray-200 bg-white font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 transition-colors',
                    compact ? 'px-2.5 py-1 text-[9px]' : 'px-3.5 py-1.5 text-[11px]',
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Sections */}
        <main
          className={cn(
            'mx-auto',
            compact ? 'px-3 py-3 space-y-5' : 'max-w-3xl px-4 sm:px-6 py-6 space-y-8',
            cart.length > 0 && 'pb-28',
          )}
        >
          {sections.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Esta vitrina todavía no tiene productos.</p>
            </div>
          )}
          {sections.map((s) => (
            <section key={s.name} ref={(el) => (sectionRefs.current[s.name] = el)} className="scroll-mt-14">
              <h2 className={cn('font-bold text-gray-900 mb-2.5', compact ? 'text-sm' : 'text-lg')}>{s.name}</h2>
              {activeLayout === 'list' ? (
                <div className="space-y-2.5">
                  {s.items.map((item) => (
                    <ListRow key={item.id} item={item} color={color} compact={compact} onOpen={setOpenItem} />
                  ))}
                </div>
              ) : (
                <div className={cn('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3')}>
                  {s.items.map((item) => (
                    <GalleryCard key={item.id} item={item} color={color} compact={compact} onOpen={setOpenItem} />
                  ))}
                </div>
              )}
            </section>
          ))}
          <p className={cn('text-center text-gray-400 pt-2', compact ? 'text-[9px]' : 'text-xs')}>
            Creado con <span className="font-semibold text-gray-500">repeat</span>
          </p>
        </main>
      </div>

      <AnimatePresence>
        {openItem && (
          <ItemDetail
            item={openItem}
            compact={compact}
            onClose={() => setOpenItem(null)}
            onAdd={ordering ? addToCart : undefined}
          />
        )}
      </AnimatePresence>

      {ordering && (
        <>
          {!checkoutOpen && <CartBar cart={cart} color={color} onOpen={() => setCheckoutOpen(true)} />}
          <CheckoutSheet
            open={checkoutOpen && cart.length > 0}
            cart={cart}
            ordering={ordering}
            onChangeQty={changeQty}
            onClose={() => setCheckoutOpen(false)}
            onSent={(order) => {
              setCart([])
              setCheckoutOpen(false)
              setSentOrder(order)
            }}
          />
          <OrderSent order={sentOrder} onClose={() => setSentOrder(null)} />
        </>
      )}
    </div>
  )
}
