import { useEffect, useState } from 'react'

const ACCENT = '#d97706'

const STEPS = [
  {
    iframe: '/dashboard/barber-demo',
    iframeKey: 0,
    title: 'Tu panel de control',
    desc: 'Métricas de tu barbería: miembros, visitas, usos en comercios aliados y distribución de niveles.',
    btn: 'Ver comercios aliados →',
  },
  {
    iframe: '/dashboard/barber-demo',
    iframeKey: 0,
    title: 'Red de comercios aliados',
    desc: 'Agregá negocios amigos que ofrezcan descuentos a tus miembros. Ves cuánto usan el beneficio mes a mes.',
    btn: 'Ver miembros →',
  },
  {
    iframe: '/customers/mooncafe-demo',
    iframeKey: 2,
    title: 'Tus miembros',
    desc: 'Cada miembro tiene su nivel (Regular, VIP, Black), historial de visitas y beneficios activos.',
    btn: null,
  },
  {
    iframe: '/customers/mooncafe-demo',
    iframeKey: 2,
    title: 'Detalle del miembro',
    desc: 'Nivel, visitas, última visita y qué descuentos usó en los comercios aliados.',
    btn: 'Ver notificaciones →',
    cardTop: true,
    compact: true,
  },
  {
    iframe: '/notifications/mooncafe-demo',
    iframeKey: 4,
    title: 'Notificaciones push',
    desc: 'Enviá mensajes a todos tus miembros o segmentá por nivel. Los reciben en Google Wallet y Apple Wallet.',
    btn: 'Escribí algo y enviá',
  },
  {
    iframe: '/notifications/mooncafe-demo',
    iframeKey: 4,
    title: '¡Notificación enviada!',
    desc: 'Tus miembros la recibieron al instante. Usalo para avisar promociones o nuevos comercios aliados.',
    btn: 'Volver al dashboard →',
  },
  {
    iframe: '/dashboard/barber-demo',
    iframeKey: 6,
    title: '¡Tour completo!',
    desc: 'Con Barber Club, tus clientes vuelven más seguido y aprovechan toda la red de comercios aliados.',
    btn: 'Cerrar',
  },
]

export default function DashboardHintBarber() {
  const [step, setStep] = useState(0)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'tour-customer-clicked' && step === 2) setStep(3)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [step])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const advance = () => {
    if (isLast) {
      setClosed(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          key={current.iframeKey}
          src={current.iframe}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Demo"
        />

        {!closed && (
          <div
            style={{
              position: 'fixed',
              ...(current.cardTop ? { top: 52 } : { bottom: 80 }),
              left: 16,
              right: 16,
              background: '#fff',
              borderRadius: 16,
              padding: '16px 16px 14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              border: `2px solid ${ACCENT}`,
              zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    background: i <= step ? ACCENT : '#e5e7eb',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#111827',
                margin: current.compact ? '0 0 10px' : '0 0 4px',
              }}
            >
              {current.title}
            </p>
            {!current.compact && (
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>{current.desc}</p>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    padding: '10px 16px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: 14,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  ← Atrás
                </button>
              )}
              {current.btn && (
                <button
                  onClick={advance}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    background: ACCENT,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                  }}
                >
                  {current.btn}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
