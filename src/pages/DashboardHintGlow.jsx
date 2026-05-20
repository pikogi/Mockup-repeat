import { useEffect, useState } from 'react'

const ACCENT = '#eab308'

const STEPS = [
  {
    iframe: '/dashboard/glow-demo',
    iframeKey: 0,
    title: 'Tu panel de control',
    desc: 'Desde acá vas a ver métricas de tu programa: miembros, sellos otorgados y premios canjeados.',
    btn: 'Ver miembros →',
  },
  {
    iframe: '/customers/glow-demo',
    iframeKey: 1,
    title: 'Tus miembros',
    desc: 'Acá aparecen todas las miembros que se unieron a tu programa. Tocá uno para ver su historial.',
    btn: null,
  },
  {
    iframe: '/customers/glow-demo',
    iframeKey: 1,
    title: 'Historial de la clienta',
    desc: 'Podés ver sus visitas, sellos acumulados, premios canjeados y agregar un sello manualmente.',
    btn: 'Ver notificaciones →',
    cardTop: true,
    compact: true,
  },
  {
    iframe: '/notifications/glow-demo',
    iframeKey: 3,
    title: 'Notificaciones push',
    desc: 'Escribí un título y un mensaje para enviarle una notificación a todas tus miembros.',
    btn: 'Escribí algo y enviá',
  },
  {
    iframe: '/notifications/glow-demo',
    iframeKey: 3,
    title: '¡Notificación enviada!',
    desc: 'Tus miembros la recibirán en Google Wallet y Apple Wallet. Ahora volvé al panel.',
    btn: 'Volver al dashboard →',
  },
  {
    iframe: '/dashboard/glow-demo',
    iframeKey: 5,
    title: '¡Tour completo!',
    desc: 'Ya conocés las funciones principales de Repeat. ¡Empezá a fidelizar a tus miembros!',
    btn: 'Cerrar',
  },
]

export default function DashboardHintGlow() {
  const [step, setStep] = useState(0)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'tour-customer-clicked' && step === 1) setStep(2)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [step])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const advance = () => {
    if (isLast) setClosed(true)
    else setStep((s) => s + 1)
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
                    color: '#000',
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
