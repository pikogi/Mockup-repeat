import { ExternalLink } from 'lucide-react'

const COL_LEFT = [
  {
    title: 'Crear programa',
    badge: 'bg-yellow-100 text-yellow-800',
    links: [
      {
        label: 'Crear programa',
        url: '/createclub',
        desc: 'Formulario para crear o editar un programa de fidelización.',
        single: true,
      },
    ],
  },
  {
    title: 'Scan QR — Operador',
    badge: 'bg-indigo-100 text-indigo-700',
    links: [
      {
        label: 'Sellos',
        url: '/scanqr?demo=stamps',
        desc: 'Barra de progreso + agregar sello.',
        single: true,
      },
      {
        label: 'Puntos · Catálogo',
        url: '/scanqr?demo=points',
        desc: 'Agregar puntos / validar canje de catálogo.',
        single: true,
      },
      {
        label: 'Puntos · Directo',
        url: '/scanqr?demo=points-direct',
        desc: 'Agregar puntos / canje directo a descuento.',
        single: true,
      },
      {
        label: 'Membresía',
        url: '/scanqr?demo=membership',
        desc: 'Escaneo con programa de membresía.',
        single: true,
      },
      {
        label: 'Cashback',
        url: '/scanqr?demo=cashback',
        desc: 'Escaneo con programa de cashback.',
        single: true,
      },
    ],
  },
]

const COL_RIGHT = [
  {
    title: 'Mis programas',
    badge: 'bg-yellow-100 text-yellow-800',
    links: [
      {
        label: 'Mis programas',
        url: '/myprograms',
        desc: 'Lista de programas activos con acciones de gestión.',
        single: true,
      },
    ],
  },
  {
    title: 'Catálogo de Puntos — Cliente',
    badge: 'bg-blue-100 text-blue-700',
    links: [
      {
        label: 'Club Café Bonafide',
        url: '/catalog/cafe-demo',
        desc: 'Catálogo de premios. Cafetería.',
        single: true,
      },
      {
        label: 'Spa Alma',
        url: '/catalog/beauty-demo',
        desc: 'Catálogo de premios. Spa de belleza.',
        single: true,
      },
      {
        label: 'Barbería',
        url: '/catalog/barber-demo',
        desc: 'Catálogo de premios. Barbería clásica.',
        single: true,
      },
    ],
  },
  {
    title: 'Membresía — Cliente',
    badge: 'bg-purple-100 text-purple-700',
    links: [
      {
        label: 'Spa',
        url: '/membership/spa-demo',
        desc: 'Beneficios exclusivos. Spa de relajación.',
        single: true,
      },
      {
        label: 'Gimnasio',
        url: '/membership/gym-demo',
        desc: 'Beneficios exclusivos. Gimnasio y fitness.',
        single: true,
      },
    ],
  },
  {
    title: 'Cashback — Cliente',
    badge: 'bg-emerald-100 text-emerald-700',
    links: [
      {
        label: 'Cafetería',
        url: '/cashback/cafe-demo',
        desc: 'Cashback por compra. Café y pastelería.',
        single: true,
      },
      {
        label: 'Tienda de ropa',
        url: '/cashback/ropa-demo',
        desc: 'Cashback por compra. Indumentaria.',
        single: true,
      },
    ],
  },
]

function LinkCard({ link }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight">{link.label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{link.desc}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {link.single ? (
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Abrir
          </a>
        ) : (
          <>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Anónimo
            </a>
            <a
              href={link.urlMock}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Miembro
            </a>
          </>
        )}
      </div>
    </div>
  )
}

function Column({ sections }) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${section.badge}`}>{section.title}</span>
          </div>
          <div className="px-4 py-1">
            {section.links.map((link) => (
              <LinkCard key={link.label} link={link} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative overflow-hidden">
      {/* Sticky rocket pattern */}
      <div
        className="fixed inset-0 pointer-events-none select-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><text x='70' y='70' text-anchor='middle' font-size='24' opacity='0.12'>🚀</text><text x='210' y='210' text-anchor='middle' font-size='24' opacity='0.12'>🚀</text></svg>")`,
          backgroundSize: '280px 280px',
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-1.5 mb-8">
          <img src="/logo.png" alt="Repeat" className="rounded-2xl mx-auto" style={{ width: 64, height: 64 }} />
          <h1 className="text-xl font-bold text-gray-900">Links de demo</h1>
          <p className="text-sm text-gray-400">Todos los flujos disponibles para mostrar</p>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Column sections={COL_LEFT} />
          <Column sections={COL_RIGHT} />
        </div>
      </div>
    </div>
  )
}
