import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  defaultSelection,
  modifierGroupsFor,
  modifiersPrice,
  selectionToModifiers,
} from '@/constants/moonCafeModifiers'
import { formatShowcasePrice } from '@/constants/moonCafeShowcase'
import { cn } from '@/lib/utils'

const NOTE_SUGGESTIONS = ['Bien caliente', 'Tibio', 'Poca espuma', 'Sin canela']

function OptionChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
          : 'border-gray-200 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300',
      )}
    >
      {children}
    </button>
  )
}

const priceTag = (price) => (price ? ` +${formatShowcasePrice(price)}` : '')

// Variant + options (milk, extras, to go) + note for an item before it goes to the ticket.
// Defaults are preselected so a plain order is a single tap on "Agregar".
export function ItemOptionsDialog({ item, onOpenChange, onAdd }) {
  const groups = modifierGroupsFor(item)
  const hasVariants = item.price_type === 'variants' && item.variants.length > 0
  const [variantId, setVariantId] = useState(hasVariants ? item.variants[0].id : null)
  const [selection, setSelection] = useState(() => defaultSelection(groups))
  const [note, setNote] = useState('')

  const variant = hasVariants ? item.variants.find((v) => v.id === variantId) : null
  const modifiers = selectionToModifiers(groups, selection)
  const price = Number(variant?.price ?? item.price ?? 0) + modifiersPrice(modifiers)

  const toggle = (group, optionId) =>
    setSelection((prev) => {
      if (group.type === 'single') return { ...prev, [group.id]: [optionId] }
      const current = prev[group.id] ?? []
      return {
        ...prev,
        [group.id]: current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId],
      }
    })

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>Elige cómo lo quiere tu cliente.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {hasVariants && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.category === 'Cafés' ? 'Tamaño' : 'Opción'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-colors',
                      v.id === variantId
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                        : 'border-gray-200 hover:border-gray-400 dark:border-gray-700',
                    )}
                  >
                    <span className="font-medium">{v.name}</span>
                    <span className="tabular-nums opacity-80">{formatShowcasePrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.id} className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {group.name}
                {group.type === 'multi' && <span className="font-normal text-gray-400"> · opcional</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.options.map((o) => (
                  <OptionChip
                    key={o.id}
                    active={selection[group.id]?.includes(o.id)}
                    onClick={() => toggle(group, o.id)}
                  >
                    {o.name}
                    {priceTag(o.price)}
                  </OptionChip>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Nota <span className="font-normal text-gray-400">· opcional</span>
            </p>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej: bien caliente" />
            {groups.some((g) => g.id === 'milk') && (
              <div className="flex flex-wrap gap-1.5">
                {NOTE_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNote(s)}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          className="w-full h-12 text-base"
          onClick={() => {
            onAdd(item, variant, { modifiers, note })
            onOpenChange(false)
          }}
        >
          Agregar · {formatShowcasePrice(price)}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
