// Shared campaign store for Moon Café demo.
// Backed by sessionStorage so campaigns sent in Comunicación persist when
// the user navigates to Miembros in the same browser session.

const EMAIL_KEY = 'mc_email_campaigns'
const PUSH_KEY = 'mc_push_campaigns'

const INITIAL_EMAILS = [
  {
    id: 1,
    subject: '¡Nuevo menú de otoño disponible! 🍂',
    preview:
      'Esta temporada incorporamos nuevas opciones de café de especialidad y pastelería artesanal. Visitanos y descubrí los sabores de la estación.',
    program: 'Todos los miembros',
    sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: 148,
  },
  {
    id: 2,
    subject: 'Doble sellos este fin de semana ☕✨',
    preview:
      'Sábado y domingo acumulás el doble de sellos en todas tus compras. ¡Es tu momento de completar la tarjeta más rápido!',
    program: 'Todos los miembros',
    sent_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: 148,
  },
  {
    id: 3,
    subject: 'Abrimos nueva sucursal en Palermo 📍',
    preview:
      'Ahora también estamos en Thames 1540. Pasá a conocernos y seguí acumulando sellos en cualquiera de nuestros locales.',
    program: 'Sucursal Centro',
    sent_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: 92,
  },
  {
    id: 4,
    subject: 'Tu opinión nos importa — contanos cómo fue tu visita',
    preview: 'Queremos seguir mejorando. Respondé estas 3 preguntas rápidas y llevate un sello extra.',
    program: 'Todos los miembros',
    sent_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: 131,
  },
]

function read(key, fallback) {
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }
  return fallback
}

function write(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function getEmailCampaigns() {
  return read(EMAIL_KEY, INITIAL_EMAILS)
}

export function getPushCampaigns() {
  return read(PUSH_KEY, [])
}

export function addEmailCampaign(item) {
  const updated = [item, ...getEmailCampaigns()]
  write(EMAIL_KEY, updated)
  return updated
}

export function addPushCampaign(item) {
  const updated = [item, ...getPushCampaigns()]
  write(PUSH_KEY, updated)
  return updated
}
