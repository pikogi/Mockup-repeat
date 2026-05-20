import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Monitor, RotateCcw, Smartphone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function IPhone({ url }) {
  const iframeRef = useRef(null)
  return (
    <div
      style={{
        width: 393,
        height: 852,
        background: '#1a1a1a',
        borderRadius: 54,
        padding: 12,
        boxShadow: '0 0 0 1.5px #3a3a3a, 0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px #2a2a2a',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Side buttons left */}
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: 140,
          width: 3,
          height: 36,
          background: '#2e2e2e',
          borderRadius: '3px 0 0 3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: 190,
          width: 3,
          height: 64,
          background: '#2e2e2e',
          borderRadius: '3px 0 0 3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: 268,
          width: 3,
          height: 64,
          background: '#2e2e2e',
          borderRadius: '3px 0 0 3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -3,
          top: 200,
          width: 3,
          height: 100,
          background: '#2e2e2e',
          borderRadius: '0 3px 3px 0',
        }}
      />
      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          borderRadius: 44,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 50,
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '14px 28px 0',
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
              <rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4" />
              <rect x="4.5" y="4" width="3" height="8" rx="1" opacity="0.6" />
              <rect x="9" y="2" width="3" height="10" rx="1" opacity="0.8" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
              <path
                d="M3.5 6.5C4.9 5.1 6.4 4.3 8 4.3s3.1.8 4.5 2.2"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M1 4C3 2 5.4 1 8 1s5 1 7 3"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
              <rect x="2" y="2" width="16" height="8" rx="2" fill="white" />
              <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
        </div>
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            background: '#000',
            borderRadius: 20,
            zIndex: 20,
          }}
        />
        {/* iframe */}
        <iframe
          ref={iframeRef}
          src={url}
          style={{ position: 'absolute', top: 50, left: 0, width: '100%', height: 'calc(100% - 50px)', border: 'none' }}
          title="Mobile preview"
        />
        {/* Home indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            background: 'rgba(255,255,255,0.35)',
            borderRadius: 3,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

function Laptop({ url, width = 1100 }) {
  return (
    <div style={{ width, flexShrink: 0 }}>
      {/* Browser chrome */}
      <div
        style={{
          background: '#2a2a2a',
          borderRadius: '12px 12px 0 0',
          padding: '10px 14px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1.5px solid #3a3a3a',
          borderBottom: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div
          style={{
            flex: 1,
            background: '#1a1a1a',
            borderRadius: 6,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            gap: 6,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
          <span style={{ color: '#888', fontSize: 11, fontFamily: 'system-ui' }}>repeat.la{url}</span>
        </div>
      </div>
      {/* Screen */}
      <div
        style={{
          background: '#fff',
          border: '1.5px solid #3a3a3a',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
          height: 800,
        }}
      >
        <iframe
          src={url}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Desktop preview"
        />
      </div>
    </div>
  )
}

const MOONCAFE_FLOW = [
  {
    type: 'phone',
    url: '/publicprogram-demo/mooncafe',
    label: 'Registro',
    desc: 'El cliente escanea el QR y se une al programa de sellos.',
  },
  {
    type: 'phone',
    url: '/wallet-demo/mooncafe',
    label: 'Guardar Tarjeta',
    desc: 'El cliente guarda la tarjeta en la wallet de su celular.',
  },
  {
    type: 'phone',
    url: '/scan-demo/mooncafe',
    label: 'Scan',
    desc: 'El operador escanea la tarjeta y agrega un sello.',
  },
  {
    type: 'laptop',
    url: '/dashboard/mooncafe-demo',
    mobileUrl: '/dashboard-hint/mooncafe',
    label: 'Dashboard',
    desc: 'Panel de control con métricas del programa de sellos.',
  },
]

const MOONCAFE_POINTS_FLOW = [
  {
    type: 'phone',
    url: '/publicprogram-demo/mooncafe-points',
    label: 'Registro',
    desc: 'El cliente escanea el QR y se une al programa de puntos.',
  },
  {
    type: 'phone',
    url: '/wallet-demo/mooncafe-points',
    label: 'Guardar Tarjeta',
    desc: 'El cliente guarda la tarjeta de puntos en su wallet.',
  },
  {
    type: 'phone',
    url: '/scan-demo/mooncafe-points',
    label: 'Scan',
    desc: 'El operador presiona el botón de escaneo para registrar la visita y sumar puntos.',
  },
  {
    type: 'laptop',
    url: '/dashboard/mooncafe-points-demo',
    mobileUrl: '/dashboard-hint/mooncafe-points',
    label: 'Dashboard',
    desc: 'Panel de control con métricas del programa de puntos.',
  },
]

const GYM_FLOW = [
  {
    type: 'phone',
    url: '/publicprogram-demo/mooncafe',
    label: 'Registro',
    desc: 'El alumno escanea el QR y se une al programa de fidelización del gym.',
  },
  {
    type: 'phone',
    url: '/wallet-demo/gym',
    label: 'Mi Progreso',
    desc: 'El alumno ve su nivel, XP acumulado, racha de asistencia y desafíos activos.',
  },
  {
    type: 'phone',
    url: '/scan-demo/gym',
    label: 'Check-in',
    desc: 'El operador registra la llegada del alumno. Suma XP y actualiza su racha.',
  },
  {
    type: 'laptop',
    url: '/dashboard/gym-demo',
    mobileUrl: '/dashboard-hint/gym',
    label: 'Dashboard',
    desc: 'Panel de control con métricas, check-ins por día y distribución de niveles.',
  },
]

const GLOW_FLOW = [
  {
    type: 'phone',
    url: '/publicprogram-demo/glow',
    label: 'Registro',
    desc: 'La clienta escanea el QR y se une al programa de sellos de Glow Estética.',
  },
  {
    type: 'phone',
    url: '/wallet-demo/glow',
    label: 'Guardar Tarjeta',
    desc: 'La clienta guarda la tarjeta de sellos en la wallet de su celular.',
  },
  {
    type: 'phone',
    url: '/scan-demo/glow',
    label: 'Scan',
    desc: 'El operador escanea la tarjeta y agrega un sello.',
  },
  {
    type: 'laptop',
    url: '/dashboard/glow-demo',
    mobileUrl: '/dashboard-hint/glow',
    label: 'Dashboard',
    desc: 'Panel de control con métricas del programa de sellos.',
  },
]

const GLOW_POINTS_FLOW = [
  {
    type: 'phone',
    url: '/publicprogram-demo/glow-points',
    label: 'Registro',
    desc: 'La clienta escanea el QR y se une al programa de puntos de Glow Estética.',
  },
  {
    type: 'phone',
    url: '/wallet-demo/glow-points',
    label: 'Guardar Tarjeta',
    desc: 'La clienta guarda la tarjeta de puntos en la wallet de su celular.',
  },
  {
    type: 'phone',
    url: '/scan-demo/glow-points',
    label: 'Scan',
    desc: 'El operador presiona el botón de escaneo para registrar la visita y sumar puntos.',
  },
  {
    type: 'laptop',
    url: '/dashboard/glow-points-demo',
    mobileUrl: '/dashboard-hint/glow-points',
    label: 'Dashboard',
    desc: 'Panel de control con métricas del programa de puntos.',
  },
]

const BARBER_FLOW = [
  {
    type: 'phone',
    url: '/membership/barber-membership-demo',
    label: 'Tarjeta de Miembro',
    desc: 'El cliente accede a su tarjeta digital con su nivel y los beneficios en comercios aliados.',
  },
  {
    type: 'phone',
    url: '/comercio-amigo/barber-demo',
    label: 'Comercio Aliado',
    desc: 'El comercio aliado escanea el QR del cliente y valida el descuento al instante.',
  },
  {
    type: 'laptop',
    url: '/dashboard/barber-demo',
    mobileUrl: '/dashboard-hint/barber',
    label: 'Dashboard',
    desc: 'El dueño gestiona la red de comercios aliados y ve las métricas de uso.',
  },
]

const LEROMA_FLOW = [
  {
    type: 'phone',
    url: '/publicprogram?demo=leroma',
    label: 'Registro',
    desc: 'El cliente escanea el QR y se une al programa desde su celular.',
  },
  {
    type: 'phone',
    url: '/membership/leroma-membership-demo?card=mock',
    label: 'Membresía',
    desc: 'El socio ve sus puntos, nivel y experiencias disponibles.',
  },
  {
    type: 'phone',
    url: '/scanqr?demo=points',
    label: 'Scan QR',
    desc: 'El operador escanea el QR del cliente y suma puntos.',
  },
  {
    type: 'laptop',
    url: '/dashboard/leroma-demo',
    label: 'Dashboard',
    desc: 'Panel de control del negocio con métricas y miembros.',
  },
]

function DemoFlow({ flow }) {
  const [active, setActive] = useState(0)
  const screen = flow[active]

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-next') setActive((a) => Math.min(a + 1, flow.length - 1))
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [flow.length])

  const LAPTOP_W = 1440
  const isMobile = window.innerWidth < 768
  const effectiveType = isMobile && screen.type === 'laptop' ? 'phone' : screen.type
  const availH = window.innerHeight - 120
  const phoneScale = Math.min(1, availH / 852)
  const laptopScale = Math.min(1, availH / 800)
  const scale =
    effectiveType === 'phone'
      ? Math.min(phoneScale, (window.innerWidth - 80) / 393)
      : Math.min(laptopScale, (window.innerWidth - 80) / LAPTOP_W)
  const frameNaturalH = effectiveType === 'phone' ? 852 : 800

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 24 }}>
      {/* Step selector */}
      {isMobile ? (
        /* Mobile: number bubbles + active description card */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: '0 20px',
          }}
        >
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {flow.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: `1.5px solid ${active === i ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  background: active === i ? '#fff' : 'rgba(255,255,255,0.08)',
                  color: active === i ? '#0f172a' : 'rgba(255,255,255,0.4)',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: 'system-ui',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop: original full cards in a row */
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px' }}>
          {flow.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 14,
                border: `1.5px solid ${active === i ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
                background: active === i ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: 160,
                maxWidth: 210,
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: active === i ? '#fff' : 'rgba(255,255,255,0.12)',
                  color: active === i ? '#0f172a' : 'rgba(255,255,255,0.4)',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'system-ui',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </span>
              <div>
                <p
                  style={{
                    color: active === i ? '#fff' : 'rgba(255,255,255,0.45)',
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: 'system-ui',
                    marginBottom: 3,
                  }}
                >
                  {s.label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'system-ui', lineHeight: 1.4 }}>
                  {s.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Frame */}
      <div style={{ height: frameNaturalH * scale, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', flexShrink: 0 }}>
          {effectiveType === 'phone' ? (
            <IPhone url={isMobile && screen.mobileUrl ? screen.mobileUrl : screen.url} />
          ) : (
            <Laptop url={screen.url} width={LAPTOP_W} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function Preview() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const url = searchParams.get('url')
  const [view, setView] = useState('both')

  const isMoonCafe = location.pathname === '/demo-mooncafe'
  const isMoonCafePoints = location.pathname === '/demo-mooncafe-points'
  const isGym = location.pathname === '/demo-gym'
  const isBarber = location.pathname === '/demo-barber'
  const isGlow = location.pathname === '/demo-glow'
  const isGlowPoints = location.pathname === '/demo-glow-points'
  const activeFlow = isMoonCafePoints
    ? MOONCAFE_POINTS_FLOW
    : isMoonCafe
      ? MOONCAFE_FLOW
      : isGym
        ? GYM_FLOW
        : isBarber
          ? BARBER_FLOW
          : isGlow
            ? GLOW_FLOW
            : isGlowPoints
              ? GLOW_POINTS_FLOW
              : LEROMA_FLOW
  const isFlow = !url

  const showPhone = view === 'both' || view === 'phone'
  const showLaptop = view === 'both' || view === 'laptop'
  const both = view === 'both'

  const phoneScale = Math.min(1, (window.innerHeight - 120) / 852)
  const laptopScale = Math.min(1, (window.innerHeight - 120) / 620)
  const totalWidth = both ? 393 * phoneScale + 1100 * laptopScale + 80 : showPhone ? 393 : 1100
  const globalScale = totalWidth > window.innerWidth - 40 ? (window.innerWidth - 40) / totalWidth : 1
  const frameScale = both
    ? globalScale * Math.min(phoneScale, laptopScale)
    : showPhone
      ? globalScale * phoneScale
      : globalScale * laptopScale

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)' }}
    >
      {/* Top bar — solo en modo single URL */}
      {!isFlow && (
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <button
            onClick={() => navigate('/demo')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'phone' ? 'both' : 'phone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'phone' ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
            <button
              onClick={() => setView(view === 'laptop' ? 'both' : 'laptop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'laptop' ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
          </div>
          <button onClick={() => window.location.reload()} className="text-white/60 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Frames */}
      <div className="flex-1 flex items-start justify-center pt-6 pb-10 overflow-x-auto">
        {isFlow ? (
          <DemoFlow flow={activeFlow} />
        ) : !showPhone && !showLaptop ? (
          <p className="text-white/30 text-sm mt-20">Seleccioná al menos una pantalla</p>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 48,
              transform: `scale(${frameScale})`,
              transformOrigin: 'top center',
            }}
          >
            {showPhone && <IPhone url={url} />}
            {showLaptop && <Laptop url={url} />}
          </div>
        )}
      </div>
    </div>
  )
}
