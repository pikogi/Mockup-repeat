import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Gift, Minus, Plus, ShoppingBag, Stamp, Store, Trash2, Truck, X } from 'lucide-react'
import WhatsAppIcon from '@/components/shared/WhatsAppIcon'
import { formatShowcasePrice } from '@/constants/moonCafeShowcase'
import { cn } from '@/lib/utils'

// Ordering UI for the public showcase: add-to-order controls in the item detail,
// a floating cart bar and the checkout sheet that sends the order by WhatsApp.

const WHATSAPP_GREEN = '#25D366'

export function AddToOrder({ item, soldOut, onAdd }) {
  const hasVariants = item.price_type === 'variants' && item.variants.length > 0
  const [variantId, setVariantId] = useState(hasVariants ? item.variants[0].id : null)
  const [qty, setQty] = useState(1)
  const variant = item.variants.find((v) => v.id === variantId)
  const unitPrice = Number(variant?.price ?? item.price ?? 0)

  return (
    <div className="space-y-3">
      {hasVariants && (
        <div className="rounded-xl bg-gray-50 divide-y divide-gray-100">
          {item.variants.map((v) => (
            <label key={v.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer">
              <input
                type="radio"
                name="variant"
                checked={variantId === v.id}
                onChange={() => setVariantId(v.id)}
                className="accent-gray-900"
              />
              <span className="flex-1 text-sm text-gray-700">{v.name}</span>
              <span className="text-sm font-bold text-gray-900">{formatShowcasePrice(v.price)}</span>
            </label>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-gray-200">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-gray-600"
            aria-label="Restar"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-gray-600"
            aria-label="Sumar"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          disabled={soldOut}
          onClick={() => onAdd(item, variant, qty)}
          className="flex-1 h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-40"
        >
          {soldOut ? 'Sin stock' : `Agregar · ${formatShowcasePrice(unitPrice * qty)}`}
        </button>
      </div>
    </div>
  )
}

export function CartBar({ cart, color, onOpen }) {
  const units = cart.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = cart.reduce((sum, l) => sum + l.unit_price * l.qty, 0)

  return (
    <AnimatePresence>
      {units > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          className="fixed inset-x-0 bottom-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <button
            onClick={onOpen}
            className="w-full max-w-md mx-auto h-14 rounded-2xl text-white font-semibold flex items-center justify-between px-5 shadow-xl"
            style={{ backgroundColor: color }}
          >
            <span className="flex items-center gap-2">
              <span className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[11px] font-bold flex items-center justify-center"
                  style={{ color }}
                >
                  {units}
                </span>
              </span>
              <span className="ml-2">Ver mi pedido</span>
            </span>
            <span className="tabular-nums">{formatShowcasePrice(subtotal)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-red-600">{error}</span>}
    </label>
  )
}

const inputClass =
  'w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400'

// `ordering` = { deliveryEnabled, deliveryFee, notePlaceholder?, findMember(phone) → { name, stamps, rewardsAvailable } | null,
// onSubmit(draft) → order with `number` and `whatsappUrl` }
export function CheckoutSheet({ open, cart, ordering, onChangeQty, onClose, onSent }) {
  const [form, setForm] = useState({ name: '', phone: '', mode: 'pickup', address: '', note: '' })
  const [touched, setTouched] = useState(false)
  const set = (fields) => setForm((f) => ({ ...f, ...fields }))

  const subtotal = cart.reduce((sum, l) => sum + l.unit_price * l.qty, 0)
  const deliveryFee = form.mode === 'delivery' ? Number(ordering.deliveryFee) || 0 : 0
  const total = subtotal + deliveryFee
  const member = ordering.findMember(form.phone)

  const errors = {
    name: !form.name.trim() && 'Escribe tu nombre',
    phone: form.phone.replace(/\D/g, '').length < 8 && 'Escribe tu WhatsApp con código de área',
    address: form.mode === 'delivery' && !form.address.trim() && 'Escribe la dirección de entrega',
  }
  const valid = !Object.values(errors).some(Boolean)

  const handleSubmit = () => {
    setTouched(true)
    if (!valid || cart.length === 0) return
    const order = ordering.onSubmit({
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      mode: form.mode,
      address: form.mode === 'delivery' ? form.address.trim() : '',
      note: form.note.trim(),
      lines: cart,
      subtotal,
      delivery_fee: deliveryFee,
      total,
    })
    window.open(order.whatsappUrl, '_blank', 'noopener')
    onSent(order)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            className="relative bg-white w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Tu pedido</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-3">
                {cart.map((l) => (
                  <div key={l.key} className="flex items-center gap-3">
                    {l.image_url && <img src={l.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {l.name}
                        {l.variant_name && <span className="font-normal text-gray-500"> · {l.variant_name}</span>}
                      </p>
                      <p className="text-xs text-gray-500">{formatShowcasePrice(l.unit_price * l.qty)}</p>
                    </div>
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => onChangeQty(l.key, -1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500"
                        aria-label="Restar"
                      >
                        {l.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="w-5 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                      <button
                        onClick={() => onChangeQty(l.key, 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500"
                        aria-label="Sumar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {ordering.deliveryEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pickup', label: 'Retiro en local', icon: Store },
                    { id: 'delivery', label: 'Delivery', icon: Truck },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => set({ mode: id })}
                      className={cn(
                        'h-12 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2',
                        form.mode === id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700',
                      )}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <Field label="Tu nombre" error={touched && errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => set({ name: e.target.value })}
                    placeholder="Nombre y apellido"
                    className={inputClass}
                  />
                </Field>
                <Field label="Tu WhatsApp" error={touched && errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set({ phone: e.target.value })}
                    placeholder="+54 9 351 123-4567"
                    className={inputClass}
                  />
                </Field>
                {member && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                    <Stamp className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-emerald-900">
                      ¡Hola {member.name.split(' ')[0]}! Este pedido suma <strong>1 sello</strong> en tu tarjeta (
                      {member.stamps}/5).
                      {member.rewardsAvailable > 0 && (
                        <span className="flex items-center gap-1 mt-1 font-semibold text-amber-700">
                          <Gift className="w-3.5 h-3.5" /> Tienes un café gratis: avísanos si quieres canjearlo.
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {form.mode === 'delivery' && (
                  <Field label="Dirección de entrega" error={touched && errors.address}>
                    <input
                      value={form.address}
                      onChange={(e) => set({ address: e.target.value })}
                      placeholder="Calle, número, piso"
                      className={inputClass}
                    />
                  </Field>
                )}
                <Field label="Nota (opcional)">
                  <input
                    value={form.note}
                    onChange={(e) => set({ note: e.target.value })}
                    placeholder={ordering.notePlaceholder ?? 'Ej: sin azúcar, timbre 3B'}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="space-y-1.5 text-sm border-t border-gray-100 pt-4">
                {deliveryFee > 0 && (
                  <>
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="tabular-nums">{formatShowcasePrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Envío</span>
                      <span className="tabular-nums">{formatShowcasePrice(deliveryFee)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="tabular-nums">{formatShowcasePrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={cart.length === 0}
                className="w-full h-14 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ backgroundColor: WHATSAPP_GREEN }}
              >
                <WhatsAppIcon className="w-5 h-5" /> Enviar pedido por WhatsApp
              </button>
              <p className="text-[11px] text-gray-400 text-center -mt-2">
                Se abre WhatsApp con tu pedido listo para enviar.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function OrderSent({ order, onClose }) {
  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-xl"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">¡Pedido #{order.number} armado!</p>
              <p className="text-sm text-gray-500 mt-1">
                Envía el mensaje en WhatsApp y te confirmamos por ahí. Total {formatShowcasePrice(order.total)}.
              </p>
            </div>
            <a
              href={order.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: WHATSAPP_GREEN }}
            >
              <WhatsAppIcon className="w-5 h-5" /> Abrir WhatsApp
            </a>
            <button onClick={onClose} className="w-full h-11 rounded-2xl bg-gray-100 text-gray-800 font-semibold">
              Seguir viendo el menú
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
