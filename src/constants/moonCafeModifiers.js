// Product options for Café Moon's register (Caja): milk, extras, to go… They're set per
// category, since showcase items don't carry them. `single` groups take one option (the
// first is the default); `multi` groups take any number.
export const MODIFIER_GROUPS = [
  {
    id: 'milk',
    name: 'Leche',
    type: 'single',
    categories: ['Cafés'],
    options: [
      { id: 'entera', name: 'Entera', price: 0 },
      { id: 'descremada', name: 'Descremada', price: 0 },
      { id: 'almendras', name: 'Almendras', price: 500 },
      { id: 'avena', name: 'Avena', price: 500 },
    ],
  },
  {
    id: 'coffee-extras',
    name: 'Extras',
    type: 'multi',
    categories: ['Cafés'],
    options: [
      { id: 'shot', name: 'Shot extra', price: 800 },
      { id: 'vainilla', name: 'Jarabe de vainilla', price: 500 },
      { id: 'crema', name: 'Crema', price: 400 },
      { id: 'sin-azucar', name: 'Sin azúcar', price: 0 },
    ],
  },
  {
    id: 'cold-extras',
    name: 'Extras',
    type: 'multi',
    categories: ['Bebidas frías'],
    options: [
      { id: 'sin-hielo', name: 'Sin hielo', price: 0 },
      { id: 'sin-azucar', name: 'Sin azúcar', price: 0 },
    ],
  },
  {
    id: 'lunch-extras',
    name: 'Extras',
    type: 'multi',
    categories: ['Almuerzo'],
    options: [
      { id: 'huevo', name: 'Huevo', price: 700 },
      { id: 'palta', name: 'Palta', price: 900 },
      { id: 'sin-tacc', name: 'Pan sin TACC', price: 1200 },
    ],
  },
  {
    id: 'service',
    name: 'Servicio',
    type: 'single',
    categories: ['Cafés', 'Bebidas frías', 'Pastelería', 'Almuerzo'],
    options: [
      { id: 'aca', name: 'Para tomar acá', price: 0 },
      { id: 'llevar', name: 'Para llevar', price: 0 },
    ],
  },
]

export const modifierGroupsFor = (item) => MODIFIER_GROUPS.filter((g) => g.categories.includes(item.category))

// Default selection: first option of every single-choice group, nothing in multi groups.
export const defaultSelection = (groups) =>
  Object.fromEntries(groups.map((g) => [g.id, g.type === 'single' ? [g.options[0].id] : []]))

// Selected options as ticket modifiers. Defaults that change nothing (whole milk, "para
// tomar acá") are left out so the ticket only shows what's different.
export function selectionToModifiers(groups, selection) {
  return groups.flatMap((g) =>
    g.options
      .filter((o) => selection[g.id]?.includes(o.id))
      .filter((o) => !(g.type === 'single' && o.id === g.options[0].id))
      .map((o) => ({ group: g.id, id: o.id, name: o.name, price: o.price })),
  )
}

export const modifiersPrice = (modifiers = []) => modifiers.reduce((sum, m) => sum + m.price, 0)

// Short text for a line's options and note, e.g. "Almendras · Shot extra · “bien caliente”".
export const lineOptionsText = (line) =>
  [...(line.modifiers ?? []).map((m) => m.name), line.note && `“${line.note}”`].filter(Boolean).join(' · ')
