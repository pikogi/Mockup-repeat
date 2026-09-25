import {
  ClipboardList,
  BookOpen,
  Gift,
  Coins,
  Crown,
  Instagram,
  MessageCircle,
  MapPin,
  Link2,
  Award,
} from 'lucide-react'

// Config del hub público de Café Moon (/hub-demo/mooncafe), editable desde el
// admin en /enlaces/mooncafe-demo. Sin backend real: se persiste en localStorage,
// mismo patrón que 'repeat_catalog' en Menu.jsx / PublicMenu.jsx, para que la
// página pública siempre refleje lo último guardado en el admin.
export const HUB_STORAGE_KEY = 'repeat_hub_config'

export const ICONS_BY_KEY = {
  clipboard: ClipboardList,
  book: BookOpen,
  gift: Gift,
  coins: Coins,
  crown: Crown,
  instagram: Instagram,
  whatsapp: MessageCircle,
  mappin: MapPin,
  link: Link2,
  award: Award,
}

// Los 3 programas de fidelidad de Café Moon. No son editables desde el admin —
// solo la fila "Club de Fidelidad" que despliega estas 3 opciones al hacer clic.
export const CLUB_OPTIONS = [
  {
    label: 'Programa de Sellos',
    description: 'Cada 5 cafés, 1 gratis',
    iconKey: 'gift',
    url: '/publicprogram-demo/mooncafe',
  },
  {
    label: 'Programa de Puntos',
    description: 'Acumulá y canjeá premios',
    iconKey: 'coins',
    url: '/publicprogram-demo/mooncafe-points',
  },
  {
    label: 'Moon Club · Membresía',
    description: 'Beneficios exclusivos',
    iconKey: 'crown',
    url: '/membership/moon-cafe-demo',
  },
]

// Enlaces de Repeat: fijos (no se pueden borrar), pero sí reordenar entre ellos.
export const DEFAULT_REPEAT_LINKS = [
  {
    id: 'encuesta',
    kind: 'encuesta',
    iconKey: 'clipboard',
    label: 'Encuesta de satisfacción',
    description: 'Contanos cómo te fue',
    url: '/encuesta/moon-cafe-demo',
    enabled: true,
  },
  {
    id: 'menu',
    kind: 'menu',
    iconKey: 'book',
    label: 'Menú',
    description: 'Café, comidas y postres',
    url: '/catalog/my-menu',
    enabled: true,
  },
  {
    id: 'club',
    kind: 'club',
    iconKey: 'gift',
    label: 'Club de Fidelidad',
    description: 'Sellos, Puntos y Moon Club',
    url: '/hub-demo/mooncafe',
    enabled: true,
  },
  {
    id: 'catalogo',
    kind: 'catalogo',
    iconKey: 'award',
    label: 'Catálogo de premios',
    description: 'Canjeá tus puntos por premios',
    url: '/catalog/mooncafe-puntos-demo',
    enabled: true,
  },
]

// Tus enlaces: editables y reordenables entre ellos, se pueden borrar y agregar más.
export const DEFAULT_EXTERNAL_LINKS = [
  {
    id: 'ig',
    kind: 'external',
    iconKey: 'instagram',
    label: 'Instagram',
    description: '@cafemoon',
    url: 'https://instagram.com/cafemoon',
    enabled: true,
  },
  {
    id: 'wa',
    kind: 'external',
    iconKey: 'whatsapp',
    label: 'WhatsApp',
    description: 'Hacé tu pedido',
    url: 'https://wa.me/5491100000000',
    enabled: true,
  },
  {
    id: 'maps',
    kind: 'external',
    iconKey: 'mappin',
    label: 'Cómo llegar',
    description: 'Av. Corrientes 1234, Buenos Aires',
    url: 'https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires',
    enabled: true,
  },
]

export const DEFAULT_HUB_CONFIG = {
  color: '#1a4a2e',
  // Imagen de fondo del encabezado (reemplaza el color de marca ahí cuando está definida).
  bannerUrl: '',
  // Color de fondo de toda la pantalla, detrás de las tarjetas de enlaces.
  pageBackground: '#f9fafb',
  subtitle: 'Elegí lo que buscás',
  repeatLinks: DEFAULT_REPEAT_LINKS,
  externalLinks: DEFAULT_EXTERNAL_LINKS,
}

// Si en una demo futura agregamos un nuevo enlace fijo de Repeat, esto asegura
// que aparezca para quienes ya tengan una config vieja guardada en localStorage
// (sin esto, el spread de más abajo pisaría repeatLinks entero con la lista
// vieja y el enlace nuevo nunca se vería hasta borrar el localStorage a mano).
function withNewDefaultRepeatLinks(savedRepeatLinks) {
  const savedIds = new Set(savedRepeatLinks.map((l) => l.id))
  const missing = DEFAULT_REPEAT_LINKS.filter((l) => !savedIds.has(l.id))
  return [...savedRepeatLinks, ...missing]
}

export function loadHubConfig() {
  try {
    const stored = localStorage.getItem(HUB_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && Array.isArray(parsed.repeatLinks) && Array.isArray(parsed.externalLinks)) {
        return { ...DEFAULT_HUB_CONFIG, ...parsed, repeatLinks: withNewDefaultRepeatLinks(parsed.repeatLinks) }
      }
    }
  } catch {
    /* localStorage puede fallar en navegación privada; usamos los valores por defecto */
  }
  return DEFAULT_HUB_CONFIG
}

export function saveHubConfig(config) {
  try {
    localStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(config))
  } catch {
    /* si localStorage falla, el cambio queda solo en memoria para esta sesión */
  }
}
