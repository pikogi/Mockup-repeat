import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import DemoGuideCard from '@/components/demo/DemoGuideCard'

const MOONCAFE_STEPS = [
  {
    url: '/publicprogram-demo/mooncafe',
    title: 'Registro de cliente',
    desc: 'El cliente escanea el QR y se une al programa de sellos de Moon Café.',
    fullWidth: false,
  },
  {
    url: '/wallet-demo/mooncafe',
    title: 'Guardar tarjeta',
    desc: 'El cliente guarda la tarjeta digital en la wallet de su celular.',
    fullWidth: false,
    phoneFrame: true,
  },
  {
    url: '/dashboard-demo/mooncafe',
    title: 'Panel de control',
    desc: 'Una vez dentro de Repeat, verás las métricas de tus programas en tiempo real.',
    fullWidth: true,
  },
  {
    url: '/scan-demo/mooncafe',
    title: 'Registrar visita',
    desc: 'El botón amarillo de escaneo registra la visita del cliente al instante.',
    fullWidth: false,
    desktopSubSteps: [
      {
        url: '/dashboard-demo/mooncafe',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        title: 'Opción 1: Escaneo QR',
        desc: 'Escanea la tarjeta del cliente desde el lector de QR para registrar la visita al instante.',
      },
      {
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega la visita manualmente.',
      },
    ],
    mobileSubSteps: [
      {
        url: '/dashboard-demo/mooncafe',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        url: '/scan-demo/mooncafe',
        title: 'Opción 1: Escaneo QR',
        desc: 'Toca el botón amarillo para escanear la tarjeta del cliente y registrar la visita al instante.',
      },
      {
        url: '/scan-demo/mooncafe',
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega la visita manualmente.',
      },
    ],
  },
]

const MOONCAFE_POINTS_STEPS = [
  {
    url: '/publicprogram-demo/mooncafe-points',
    title: 'Registro de cliente',
    desc: 'El cliente escanea el QR y se une al programa de puntos de Moon Café.',
    fullWidth: false,
  },
  {
    url: '/wallet-demo/mooncafe-points',
    title: 'Guardar tarjeta',
    desc: 'El cliente guarda la tarjeta de puntos en la wallet de su celular.',
    fullWidth: false,
    phoneFrame: true,
  },
  {
    url: '/dashboard/mooncafe-points-demo',
    title: 'Panel de control',
    desc: 'Una vez dentro de Repeat, verás las métricas de tus programas en tiempo real.',
    fullWidth: true,
  },
  {
    url: '/scan-demo/mooncafe-points',
    title: 'Registrar visita',
    desc: 'El botón amarillo de escaneo registra la visita del cliente al instante.',
    fullWidth: false,
    desktopSubSteps: [
      {
        url: '/dashboard/mooncafe-points-demo',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        title: 'Opción 1: Escaneo QR',
        desc: 'Escanea la tarjeta del cliente desde el lector de QR para registrar la visita al instante.',
      },
      {
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega la visita manualmente.',
      },
    ],
    mobileSubSteps: [
      {
        url: '/dashboard/mooncafe-points-demo',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        url: '/scan-demo/mooncafe-points',
        title: 'Opción 1: Escaneo QR',
        desc: 'Toca el botón amarillo para escanear la tarjeta del cliente y registrar los puntos al instante.',
      },
      {
        url: '/scan-demo/mooncafe-points',
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega los puntos manualmente.',
      },
    ],
  },
]

/* ─── Marco de celular (desktop) ─────────────────────────────────────────── */
function PhoneFrame({ children }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 390,
          height: 760,
          background: '#111',
          borderRadius: 52,
          padding: 14,
          boxShadow: '0 0 0 2px #2a2a2a, 0 0 0 4px #444, 0 30px 80px rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 126,
            height: 34,
            background: '#111',
            borderRadius: '0 0 22px 22px',
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 40,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── Pantalla de bienvenida ─────────────────────────────────────────────── */
function WelcomeScreen({ onStart }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px 28px',
        textAlign: 'center',
      }}
    >
      <img
        src="/logo.png"
        alt="Repeat"
        style={{
          width: 72,
          height: 72,
          objectFit: 'contain',
          borderRadius: 18,
          marginBottom: 32,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.07)',
        }}
      />
      <h1
        style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 800,
          margin: '0 0 12px',
          lineHeight: 1.2,
          letterSpacing: -0.5,
        }}
      >
        Bienvenido al tour de Repeat
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.42)',
          fontSize: 15,
          margin: '0 0 48px',
          lineHeight: 1.6,
          maxWidth: 280,
        }}
      >
        Conoce cómo funciona el sistema de fidelización en menos de 2 minutos.
      </p>
      <button
        onClick={onStart}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '16px 0',
          background: '#eab308',
          color: '#000',
          fontWeight: 800,
          fontSize: 16,
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
          letterSpacing: 0.2,
        }}
      >
        Comenzar tour →
      </button>
    </div>
  )
}

/* ─── Pantalla de cafetería con QR ──────────────────────────────────────── */
function CafeScreen({ onNext, cafeImage }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Foto de la cafetería */}
      <img
        src={cafeImage}
        alt="Cafetería"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />

      {/* Overlay sutil en la parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))',
          pointerEvents: 'none',
        }}
      />

      {/* Card de guía */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          background: '#fff',
          borderRadius: 16,
          padding: '16px 16px 14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          border: '2px solid #eab308',
          zIndex: 30,
        }}
      >
        {/* Barra de progreso decorativa */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#eab308' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
        </div>

        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>El cliente escanea el QR</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
          En tu local hay un QR de Repeat. El cliente lo escanea y accede al formulario de registro del programa.
        </p>
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '11px 0',
            background: '#eab308',
            color: '#000',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          Escanear QR →
        </button>
      </div>
    </div>
  )
}

/* ─── Pantalla de pricing final ──────────────────────────────────────────── */
const WA_NUMBERS = {
  AR: '5493517881653',
  default: '5215657529234',
}

const PRICING_PLANS = [
  {
    name: 'Club Base',
    desc: 'El punto de entrada para digitalizar tu programa de fidelidad.',
    highlight: false,
    features: [
      'Clientes ilimitados',
      'Hasta 5 condiciones de club',
      'Base de datos de clientes',
      'Sin necesidad de app',
    ],
    notIncluded: ['Notificaciones push', 'Miembros de equipo ilimitados', 'Sorteo'],
    prices: {
      ar: { mensual: 19999, semianual: 16999, anual: 14999 },
      mx: { mensual: 299, semianual: 254, anual: 224 },
    },
  },
  {
    name: 'Club de Lealtad',
    desc: 'El programa de fidelidad digital para que tus clientes vuelvan más seguido.',
    highlight: false,
    features: [
      'Clientes ilimitados',
      'Miembros de equipo ilimitados',
      'Notificaciones push',
      'Sorteo',
      'Sin necesidad de app',
    ],
    notIncluded: ['Encuesta de satisfacción', 'Menú y catálogo digital'],
    prices: {
      ar: { mensual: 29999, semianual: 25499, anual: 22499 },
      mx: { mensual: 499, semianual: 424, anual: 374 },
    },
  },
  {
    name: 'Club Full',
    desc: 'Todo lo del plan base más encuesta de satisfacción y menú digital.',
    highlight: true,
    features: ['Todo lo del Club de Lealtad', 'Encuesta de satisfacción', 'Menú y catálogo digital'],
    notIncluded: [],
    prices: {
      ar: { mensual: 49999, semianual: 42499, anual: 37499 },
      mx: { mensual: 799, semianual: 679, anual: 599 },
    },
  },
]

const BILLING_CYCLES = [
  { key: 'mensual', label: 'Mensual' },
  { key: 'semianual', label: 'Semestral', badge: '15% off 🚀' },
  { key: 'anual', label: 'Anual', badge: '25% off 🔥' },
]

function fmtPrice(n, isAR) {
  return isAR ? new Intl.NumberFormat('es-AR').format(n) : new Intl.NumberFormat('es-MX').format(n)
}

function PricingScreen({ onRestart, onBack, country }) {
  const [billing, setBilling] = useState('mensual')
  const [branches, setBranches] = useState(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  const cardRefs = useRef([])
  const isAR = country === 'AR'
  const priceKey = isAR ? 'ar' : 'mx'
  const currency = isAR ? 'ARS' : 'MXN'
  const isEnterprise = branches === 'enterprise'
  const branchCount = isEnterprise ? 0 : branches

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    if (!isMobile || cards.length === 0) {
      cards.forEach((c) => (c.style.height = 'auto'))
      return
    }
    cards.forEach((c) => (c.style.height = 'auto'))
    const max = Math.max(...cards.map((c) => c.offsetHeight))
    cards.forEach((c) => (c.style.height = max + 'px'))
  }, [billing, branches, isMobile])

  const waNumber = WA_NUMBERS[country] ?? WA_NUMBERS.default
  const waUrl =
    `https://wa.me/${waNumber}?text=` +
    encodeURIComponent('Hola, acabo de ver la demo de Repeat y quiero saber más sobre los planes.')
  const waSalesUrl =
    `https://wa.me/${waNumber}?text=` +
    encodeURIComponent('Hola, quisiera consultar por el precio preferencial para más de 3 sucursales.')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to bottom, #f9fafb, #fff)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '36px 20px 40px',
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#ef4444',
          marginBottom: 10,
        }}
      >
        Precios
      </span>
      <h1
        style={{
          color: '#111827',
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 800,
          margin: '0 0 8px',
          letterSpacing: -0.5,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        Elige el plan que se adapta
        <br />a tu negocio
      </h1>
      <p
        style={{
          color: '#6b7280',
          fontSize: 14,
          margin: '0 0 28px',
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 340,
        }}
      >
        🎁 <strong>Prueba gratis por 7 días</strong> · Cancelá cuando quieras
      </p>

      {/* Billing toggle — full-width en mobile, pill en desktop */}
      {isMobile ? (
        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: 400,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 99,
            padding: 4,
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            boxSizing: 'border-box',
          }}
        >
          {[
            { key: 'mensual', label: 'Mensual' },
            { key: 'semianual', label: 'Semestral -15% 🚀' },
            { key: 'anual', label: 'Anual -25% 🔥' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setBilling(key)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.3,
                background: billing === key ? '#111827' : 'transparent',
                color: billing === key ? '#fff' : '#6b7280',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 99,
            padding: '6px',
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          {BILLING_CYCLES.map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => setBilling(key)}
              style={{
                padding: '8px 16px',
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                background: billing === key ? (key === 'anual' ? '#facc15' : '#111827') : 'transparent',
                color: billing === key ? (key === 'anual' ? '#000' : '#fff') : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              {label}
              {badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 99,
                    background: key === 'anual' ? '#fee2e2' : '#d1fae5',
                    color: key === 'anual' ? '#92400e' : '#065f46',
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selector de sucursales */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
          {isAR ? '¿Cuántas sucursales tenés?' : '¿Cuántas sucursales tienes?'}
        </label>
        <select
          value={branches}
          onChange={(e) => setBranches(e.target.value === 'enterprise' ? 'enterprise' : Number(e.target.value))}
          style={{
            padding: '8px 16px',
            borderRadius: 99,
            border: '1px solid #e5e7eb',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            fontSize: 13,
            color: '#374151',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value={0}>Solo una sucursal</option>
          <option value={1}>2 sucursales</option>
          <option value={2}>3 sucursales</option>
          <option value="enterprise">Más de 3 sucursales (precio preferencial)</option>
        </select>
      </div>

      {/* Plan cards — white cards like pricing-section-3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          alignItems: 'stretch',
          gap: 20,
          width: '100%',
          maxWidth: 820,
          marginBottom: 32,
        }}
      >
        {PRICING_PLANS.map((plan, i) => {
          const basePrice = plan.prices[priceKey][billing]
          const baseMonthly = plan.prices[priceKey]['mensual']
          const totalPrice = isEnterprise ? basePrice : basePrice + branchCount * basePrice * 0.5
          const totalMonthly = isEnterprise ? baseMonthly : baseMonthly + branchCount * baseMonthly * 0.5
          const periodTotal = totalPrice * (billing === 'semianual' ? 6 : billing === 'anual' ? 12 : 1)
          const showOld = billing !== 'mensual'

          return (
            <div
              key={plan.name}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                background: '#fff',
                border: plan.highlight ? '2px solid #facc15' : '1px solid #e5e7eb',
                borderRadius: 20,
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                boxSizing: 'border-box',
              }}
            >
              {/* Savings badge */}
              {billing === 'semianual' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 99,
                    }}
                  >
                    15% de ahorro 🚀
                  </span>
                </div>
              )}
              {billing === 'anual' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <span
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 99,
                    }}
                  >
                    25% de ahorro 🔥
                  </span>
                </div>
              )}

              {/* Name + description */}
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 6px', textAlign: 'center' }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px', textAlign: 'center', lineHeight: 1.5 }}>
                {plan.desc}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                {isEnterprise ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                      Precio preferencial
                    </p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Más de 3 sucursales</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                      <span style={{ fontSize: 44, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                        ${fmtPrice(totalPrice, isAR)}
                      </span>
                      <span style={{ fontSize: 16, color: '#9ca3af', fontWeight: 500, marginBottom: 4 }}>/mes</span>
                    </div>
                    {branchCount > 0 && (
                      <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                        Incluye {branchCount + 1} sucursales
                      </span>
                    )}
                    {showOld && (
                      <span style={{ fontSize: 12, color: '#d1d5db', textDecoration: 'line-through', marginTop: 2 }}>
                        ${fmtPrice(totalMonthly, isAR)}/mes
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: '#d1d5db', marginTop: 2 }}>{currency}</span>
                    {billing === 'semianual' && (
                      <p
                        style={{
                          fontSize: 12,
                          color: '#6b7280',
                          marginTop: 8,
                          background: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: 8,
                          width: '100%',
                          boxSizing: 'border-box',
                          textAlign: 'center',
                        }}
                      >
                        💰 Pago semestral: ${fmtPrice(periodTotal, isAR)} {currency}
                      </p>
                    )}
                    {billing === 'anual' && (
                      <p
                        style={{
                          fontSize: 12,
                          color: '#6b7280',
                          marginTop: 8,
                          background: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: 8,
                          width: '100%',
                          boxSizing: 'border-box',
                          textAlign: 'center',
                        }}
                      >
                        💰 Pago anual: ${fmtPrice(periodTotal, isAR)} {currency}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* CTA */}
              <a
                href={isEnterprise ? waSalesUrl : waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 0',
                  background: '#facc15',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 12,
                  textDecoration: 'none',
                  marginBottom: 20,
                }}
              >
                {isEnterprise ? 'Contactar a ventas →' : 'Comenzar ahora →'}
              </a>

              {/* Features — flex:1 so this section fills remaining card height, equalizing all cards */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 10px',
                  }}
                >
                  Incluye:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#111827',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, lineHeight: 1 }}>✓</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#fee2e2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 800, lineHeight: 1 }}>✕</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Volver / Reiniciar */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: 13,
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          ← Volver
        </button>
        <span style={{ color: '#e5e7eb', fontSize: 13 }}>|</span>
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: 13,
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          Ver demo otra vez
        </button>
      </div>
    </div>
  )
}

/* ─── Shell principal ────────────────────────────────────────────────────── */
export default function DemoShell({ flow, isRoadmap = false }) {
  const baseSteps = flow === 'mooncafe-points' ? MOONCAFE_POINTS_STEPS : MOONCAFE_STEPS
  const steps = isRoadmap
    ? baseSteps.slice(2).map((s) => {
        const replaceUrl = (url) => (url === '/dashboard-demo/mooncafe' ? '/dashboard/mooncafe-roadmap' : url)
        return {
          ...s,
          url: s.url ? replaceUrl(s.url) : s.url,
          desktopSubSteps: s.desktopSubSteps?.map((ss) => ({ ...ss, url: ss.url ? replaceUrl(ss.url) : ss.url })),
          mobileSubSteps: s.mobileSubSteps?.map((ss) => ({ ...ss, url: ss.url ? replaceUrl(ss.url) : ss.url })),
        }
      })
    : baseSteps
  const cafeImage = '/cafe-mostrador.jpg'

  const [phase, setPhase] = useState(isRoadmap ? 'steps' : 'welcome') // 'welcome' | 'cafe' | 'steps'
  const [currentStep, setCurrentStep] = useState(0)
  const [subStep, setSubStep] = useState(0)
  const [done, setDone] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  const [scanActive, setScanActive] = useState(false)
  const [country, setCountry] = useState('')
  const iframeRef = useRef(null)

  useEffect(() => {
    // Use Cloudflare's trace endpoint — client-side friendly, no CORS, no rate limits.
    // Equivalent to Repeat.la's /api/geo server-side proxy but adapted for a static SPA.
    fetch('https://cloudflare.com/cdn-cgi/trace')
      .then((r) => r.text())
      .then((text) => {
        const loc = text.match(/loc=([A-Z]{2})/)?.[1]
        if (loc) setCountry(loc)
      })
      .catch(() => {
        // Last resort: timezone-based detection
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (tz.startsWith('America/Argentina')) setCountry('AR')
      })
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-next') setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
      if (e.data?.type === 'scan-opened') setScanActive(true)
      if (e.data?.type === 'scan-closed') setScanActive(false)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [steps.length])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (subStep > 0) {
      iframeRef.current?.contentWindow?.postMessage({ type: 'demo-substep', subStep }, '*')
    }
  }, [subStep])

  const handleRestart = () => {
    setDone(false)
    setCurrentStep(0)
    setSubStep(0)
    setPhase('welcome')
  }

  // Pre-pasos: welcome y cafe
  if (phase === 'welcome') {
    const content = <WelcomeScreen onStart={() => setPhase('cafe')} />
    return isDesktop ? <PhoneFrame>{content}</PhoneFrame> : <div style={{ position: 'fixed', inset: 0 }}>{content}</div>
  }
  if (phase === 'cafe') {
    const content = <CafeScreen cafeImage={cafeImage} onNext={() => setPhase('steps')} />
    return isDesktop ? <PhoneFrame>{content}</PhoneFrame> : <div style={{ position: 'fixed', inset: 0 }}>{content}</div>
  }

  // Tour completado → pantalla de pricing
  if (done) {
    return <PricingScreen onRestart={handleRestart} onBack={() => setDone(false)} country={country} />
  }

  // Flujo principal de pasos
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const activeSubSteps = isDesktop ? step.desktopSubSteps : step.mobileSubSteps
  const useSubSteps = isLastStep && activeSubSteps
  const activeSubStepUrl = useSubSteps ? activeSubSteps[subStep]?.url : null
  const rawUrl = activeSubStepUrl ?? step.url
  const iframeUrl = rawUrl + (rawUrl.includes('?') ? '&shell=1' : '?shell=1')
  const showPhoneFrame = step.phoneFrame && isDesktop
  const lastStep = steps[steps.length - 1]
  const displaySubSteps = isDesktop ? lastStep.desktopSubSteps : lastStep.mobileSubSteps
  const displaySteps = displaySubSteps ? [...steps.slice(0, -1), ...displaySubSteps] : steps
  const displayCurrentStep = useSubSteps ? steps.length - 1 + subStep : currentStep
  const mobileSubStepsActive = !isDesktop && !!useSubSteps

  const handleNext = () => {
    setScanActive(false)
    if (useSubSteps && subStep < activeSubSteps.length - 1) {
      setSubStep((s) => s + 1)
      return
    }
    if (currentStep === steps.length - 1) {
      setDone(true)
    } else {
      setCurrentStep((s) => s + 1)
      setSubStep(0)
    }
  }

  const handlePrev = () => {
    setScanActive(false)
    if (useSubSteps && subStep > 0) {
      setSubStep((s) => s - 1)
      return
    }
    if (currentStep === 0 && !isRoadmap) {
      setPhase('cafe')
    } else {
      setCurrentStep((s) => s - 1)
      setSubStep(0)
    }
  }

  const brandName = flow === 'mooncafe-points' ? 'Moon Café · Puntos' : 'Moon Café · Sellos'

  const demoIframe = (
    <iframe
      ref={iframeRef}
      key={iframeUrl}
      src={iframeUrl}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="Demo"
    />
  )

  if (showPhoneFrame) {
    return (
      <>
        <PhoneFrame>{demoIframe}</PhoneFrame>
        {!scanActive && (
          <DemoGuideCard
            steps={displaySteps}
            currentStep={displayCurrentStep}
            onPrev={handlePrev}
            onNext={handleNext}
            brandName={brandName}
            brandLogo="/moon-cafe-logo.png"
            done={done}
            onRestart={handleRestart}
            positionTop={mobileSubStepsActive}
            isDesktop={isDesktop}
          />
        )}
      </>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#fff',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      {demoIframe}
      {!scanActive && (
        <DemoGuideCard
          steps={displaySteps}
          currentStep={displayCurrentStep}
          onPrev={handlePrev}
          onNext={handleNext}
          brandName={brandName}
          brandLogo="/moon-cafe-logo.png"
          done={done}
          onRestart={handleRestart}
          positionTop={mobileSubStepsActive}
          isDesktop={isDesktop}
        />
      )}
    </div>
  )
}
