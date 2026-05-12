import { useState } from 'react'

const STEPS = [
  {
    iframeSrc: '/publicprogram?demo=mooncafe',
    title: 'Escaneá para unirte',
    desc: 'El cliente escanea el QR del negocio y accede al formulario de registro.',
    btn: 'Ver formulario →',
  },
  {
    iframeSrc: '/publicprogram?demo=mooncafe&showform=1',
    title: 'Completá el formulario',
    desc: 'Ingresá nombre y email para unirte al programa y recibir tu tarjeta digital.',
    btn: 'Siguiente paso →',
  },
]

export default function PublicProgramDemoMoonCafe() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const handleBtn = () => {
    if (isLast) {
      window.parent?.postMessage({ type: 'demo-next' }, '*')
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
          key={step}
          src={current.iframeSrc}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Registro"
        />

        {/* Tour card */}
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: 16,
            right: 16,
            background: '#fff',
            borderRadius: 16,
            padding: '16px 16px 14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            border: '2px solid #eab308',
            zIndex: 30,
          }}
        >
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 2,
                  background: i <= step ? '#eab308' : '#e5e7eb',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{current.title}</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>{current.desc}</p>

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
            <button
              onClick={handleBtn}
              style={{
                flex: 1,
                padding: '10px 0',
                background: '#eab308',
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
          </div>
        </div>
      </div>
    </div>
  )
}
