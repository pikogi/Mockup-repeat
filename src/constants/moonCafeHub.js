import { BookOpen, ClipboardList, CreditCard, Globe, ShoppingBag } from 'lucide-react'
import { loadShowcaseState } from '@/constants/moonCafeShowcase'

// Config de la página pública de links de Café Moon (/hub-demo/mooncafe), editable
// desde el admin en /enlaces/mooncafe-demo. Sin backend real: se persiste en
// localStorage para que la página pública refleje lo último guardado en el admin.
// La key cambió con el rediseño (antes 'repeat_hub_config') porque la forma de los
// datos es otra y no vale la pena migrar configs viejas de una demo.
export const HUB_STORAGE_KEY = 'repeat_links_mooncafe'

export const LINKS_URL_PREFIX = 'club.repeat.la/public/links/'
export const SLUG_PATTERN = /^[a-z0-9-]{3,60}$/i

// Destinos de Repeat que se pueden agregar desde "Agregar destino de Repeat". Cada
// uno tiene opciones (qué vitrina, qué programa…) y una etiqueta por defecto.
export const REPEAT_DESTINATIONS = {
  vitrina: {
    label: 'Vitrina',
    icon: ShoppingBag,
    // Las vitrinas se leen en vivo para que una vitrina creada en el admin aparezca acá.
    getOptions: () =>
      loadShowcaseState().showcases.map((s) => ({
        id: s.id,
        label: s.name,
        url: `/showcase-demo/mooncafe/${s.id}`,
      })),
  },
  programa: {
    label: 'Programa',
    icon: CreditCard,
    getOptions: () => [
      { id: 'sellos', label: 'Club Moon Café · Sellos', url: '/publicprogram-demo/mooncafe' },
      { id: 'puntos', label: 'Club Moon Café · Puntos', url: '/publicprogram-demo/mooncafe-points' },
      { id: 'membresia', label: 'Moon Club · Membresía', url: '/membership/moon-cafe-demo' },
    ],
  },
  catalogo: {
    label: 'Catálogo',
    icon: BookOpen,
    getOptions: () => [{ id: 'premios', label: 'Catálogo de premios', url: '/catalog/mooncafe-puntos-demo' }],
  },
  encuesta: {
    label: 'Encuesta',
    icon: ClipboardList,
    getOptions: () => [{ id: 'satisfaccion', label: 'Encuesta de satisfacción', url: '/encuesta/moon-cafe-demo' }],
  },
}

export const EXTERNAL_LINK = { label: 'Link', icon: Globe }

export const linkMeta = (link) => (link.type === 'external' ? EXTERNAL_LINK : REPEAT_DESTINATIONS[link.type])

export function resolveLinkUrl(link) {
  if (link.type === 'external') return link.url
  const options = REPEAT_DESTINATIONS[link.type]?.getOptions() ?? []
  return (options.find((o) => o.id === link.target) ?? options[0])?.url ?? null
}

export const DEFAULT_HUB_CONFIG = {
  title: 'Café Moon',
  subtitle: 'Tu café de especialidad',
  slug: 'cafe-moon',
  color: '#2f7a4f',
  published: true,
  links: [
    { id: 'l1', type: 'vitrina', target: 'menu', label: 'Menú', enabled: true },
    { id: 'l2', type: 'programa', target: 'sellos', label: 'Club Moon Café', enabled: true },
    { id: 'l3', type: 'programa', target: 'membresia', label: 'Moon Club · Membresía', enabled: true },
    { id: 'l4', type: 'catalogo', target: 'premios', label: 'Catálogo de premios', enabled: true },
    {
      id: 'l5',
      type: 'encuesta',
      target: 'satisfaccion',
      label: 'Gana 10% de descuento en tu próxima visita',
      enabled: true,
    },
    { id: 'l6', type: 'external', label: 'Instagram', url: 'https://instagram.com/cafemoon', enabled: true },
    {
      id: 'l7',
      type: 'external',
      label: 'Cómo llegar',
      url: 'https://maps.google.com/?q=Av.+Corrientes+1234+Buenos+Aires',
      enabled: true,
    },
  ],
}

export function loadHubConfig() {
  try {
    const stored = localStorage.getItem(HUB_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && Array.isArray(parsed.links)) return { ...DEFAULT_HUB_CONFIG, ...parsed }
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
