// Vitrinas (catálogos públicos de productos) de Café Moon. El admin vive en
// /vitrina/mooncafe-demo y la página pública en /showcase-demo/mooncafe/:id.
// Sin backend real: se persiste en localStorage (mismo patrón que el hub de
// enlaces en moonCafeHub.js) para que la vista pública refleje lo último guardado.
export const SHOWCASE_STORAGE_KEY = 'repeat_showcase_mooncafe'

const img = (id) => `https://images.unsplash.com/${id}?w=600&q=75`

// Identidad compartida por todas las vitrinas de la marca ("Ajustes de la vitrina").
export const DEFAULT_SHOWCASE_BRAND = {
  name: 'Café Moon',
  subtitle: 'Café de especialidad',
  color: '#1a4a2e',
  logo_url: '/moon-cafe-logo.png',
  banner_url: '',
  // IDs de MOONCAFE_STORES donde se muestran las vitrinas.
  store_ids: ['store-1'],
  // Pedidos por WhatsApp desde la vitrina pública (roadmap, ver moonCafeOrders.js).
  whatsapp: '+54 9 11 2345-6789',
  delivery_enabled: true,
  delivery_fee: 1500,
}

export const DEFAULT_SHOWCASES = [
  {
    id: 'menu',
    name: 'Menú',
    layout: 'gallery',
    categories: ['Cafés', 'Bebidas frías', 'Pastelería', 'Almuerzo'],
    items: [
      {
        id: 'flat-white',
        name: 'Flat white',
        description: 'Doble ristretto con leche texturizada.',
        image_url: img('photo-1577968897966-3d4325b36b61'),
        category: 'Cafés',
        price_type: 'single',
        price: 4800,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        description: 'Espresso con leche vaporizada y espuma cremosa.',
        image_url: img('photo-1572442388796-11668a67e53d'),
        category: 'Cafés',
        price_type: 'variants',
        price: null,
        variants: [
          { id: 'v1', name: 'Chico', price: 4200 },
          { id: 'v2', name: 'Grande', price: 5200 },
        ],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'latte',
        name: 'Latte de vainilla',
        description: 'Espresso, leche y un toque de vainilla natural.',
        image_url: img('photo-1461023058943-07fcbe16d735'),
        category: 'Cafés',
        price_type: 'single',
        price: 5400,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'cold-brew',
        name: 'Cold brew',
        description: 'Extracción en frío por 18 horas, servido con hielo.',
        image_url: img('photo-1517701604599-bb29b565090c'),
        category: 'Bebidas frías',
        price_type: 'single',
        price: 5600,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'limonada',
        name: 'Limonada con menta',
        description: 'Limón exprimido, menta fresca y jengibre.',
        image_url: img('photo-1621263764928-df1444c5e859'),
        category: 'Bebidas frías',
        price_type: 'single',
        price: 4500,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'medialunas',
        name: 'Medialunas x3',
        description: 'Tres medialunas de manteca, tiernas y doradas.',
        image_url: img('photo-1555507036-ab1f4038808a'),
        category: 'Pastelería',
        price_type: 'single',
        price: 3600,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'cheesecake',
        name: 'Cheesecake de frutos rojos',
        description: 'Base crocante y coulis de frutos rojos caseros.',
        image_url: img('photo-1533134242443-d4fd215305ad'),
        category: 'Pastelería',
        price_type: 'single',
        price: 6200,
        variants: [],
        stock_enabled: true,
        stock: 0,
        visible: true,
      },
      {
        id: 'tostado',
        name: 'Tostado de jamón y queso',
        description: 'Pan de masa madre, jamón natural y queso fundido.',
        image_url: img('photo-1528736235302-52922df5c122'),
        category: 'Almuerzo',
        price_type: 'single',
        price: 7800,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'bowl',
        name: 'Bowl de granola',
        description: 'Granola artesanal con yogur, frutas de temporada y miel.',
        image_url: img('photo-1511690743698-d9d85f2fbf38'),
        category: 'Almuerzo',
        price_type: 'single',
        price: 6900,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
    ],
  },
  {
    id: 'cafe-en-grano',
    name: 'Café en grano',
    layout: 'list',
    categories: ['Orígenes', 'Blends'],
    items: [
      {
        id: 'colombia',
        name: 'Colombia Huila 250 g',
        description: 'Notas a caramelo, cítricos y chocolate con leche.',
        image_url: img('photo-1559056199-641a0ac8b55e'),
        category: 'Orígenes',
        price_type: 'variants',
        price: null,
        variants: [
          { id: 'v1', name: 'En grano', price: 14500 },
          { id: 'v2', name: 'Molido', price: 14500 },
        ],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'etiopia',
        name: 'Etiopía Yirgacheffe 250 g',
        description: 'Floral, notas a jazmín y durazno.',
        image_url: img('photo-1587734195503-904fca47e0e9'),
        category: 'Orígenes',
        price_type: 'single',
        price: 16800,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
      {
        id: 'blend-moon',
        name: 'Blend Moon 500 g',
        description: 'Nuestro blend de la casa, ideal para espresso.',
        image_url: img('photo-1611854779393-1b2da9d400fe'),
        category: 'Blends',
        price_type: 'single',
        price: 24000,
        variants: [],
        stock_enabled: false,
        stock: null,
        visible: true,
      },
    ],
  },
]

export const DEFAULT_SHOWCASE_STATE = { brand: DEFAULT_SHOWCASE_BRAND, showcases: DEFAULT_SHOWCASES }

export function loadShowcaseState() {
  try {
    const stored = localStorage.getItem(SHOWCASE_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && Array.isArray(parsed.showcases)) {
        return { brand: { ...DEFAULT_SHOWCASE_BRAND, ...parsed.brand }, showcases: parsed.showcases }
      }
    }
  } catch {
    /* localStorage puede fallar en navegación privada; usamos los valores por defecto */
  }
  return DEFAULT_SHOWCASE_STATE
}

export function saveShowcaseState(state) {
  try {
    localStorage.setItem(SHOWCASE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* si localStorage falla, el cambio queda solo en memoria para esta sesión */
  }
}

export function formatShowcasePrice(value) {
  if (value == null || value === '') return '—'
  return `$ ${Number(value).toLocaleString('en-US')}`
}

// Precio que se muestra en tarjetas: el único, o "desde" el menor de las variantes.
export function itemDisplayPrice(item) {
  if (item.price_type === 'variants') {
    const prices = item.variants.map((v) => v.price).filter((p) => p != null && p !== '')
    if (prices.length === 0) return '—'
    return `Desde ${formatShowcasePrice(Math.min(...prices))}`
  }
  return formatShowcasePrice(item.price)
}

export const isOutOfStock = (item) => item.stock_enabled && Number(item.stock) === 0

// Form shape used by the admin's add/edit item sheet.
export const EMPTY_ITEM_FORM = {
  name: '',
  description: '',
  image_url: '',
  category: '',
  price_type: 'single',
  price: '',
  variants: [{ id: 'v1', name: '', price: '' }],
  stock_enabled: false,
  stock: '',
  visible: true,
}

export function itemToForm(item) {
  return {
    ...EMPTY_ITEM_FORM,
    ...item,
    price: item.price ?? '',
    stock: item.stock ?? '',
    variants: item.variants?.length ? item.variants : EMPTY_ITEM_FORM.variants,
  }
}
