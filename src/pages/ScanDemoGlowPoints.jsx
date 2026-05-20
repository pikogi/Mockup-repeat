import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ACCENT = '#eab308'

const STEPS = [
  {
    state: 'idle',
    title: 'Escaneá la tarjeta de la clienta',
    desc: 'El operador presiona el botón de escaneo para registrar la visita y sumar puntos.',
  },
  {
    state: 'success',
    title: '¡Puntos registrados!',
    desc: 'Los puntos se sumaron a la tarjeta. Al llegar a 150 puntos, el premio se otorga automáticamente.',
    btn: 'Siguiente paso →',
  },
]

export default function ScanDemoGlowPoints() {
  const [scanState, setScanState] = useState('idle')

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-close') setScanState('idle')
      if (e.data?.type === 'scan-success') setScanState('success')
      if (e.data?.type === 'demo-scan') setScanState('found')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const currentStep = STEPS.find((s) => s.state === scanState) ?? STEPS[0]
  const stepIndex = STEPS.findIndex((s) => s.state === scanState)

  const handleBtn = () => {
    if (scanState === 'success') {
      window.parent?.postMessage({ type: 'demo-next' }, '*')
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
          src="/dashboard/glow-points-demo?bg=1"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Dashboard"
        />

        <AnimatePresence>
          {(scanState === 'found' || scanState === 'success') && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <iframe
                src="/scanqr-demo?demo=points-threshold&scan=1"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Scan QR"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {scanState !== 'found' && (
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
                    background: i <= stepIndex ? ACCENT : '#e5e7eb',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{currentStep.title}</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>{currentStep.desc}</p>

            {scanState === 'idle' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 0 2px',
                  color: ACCENT,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <span>Presiona el botón de escaneo</span>
                <span style={{ fontSize: 22, lineHeight: 1 }}>↓</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                {stepIndex > 0 && (
                  <button
                    onClick={() => setScanState('idle')}
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
                    background: ACCENT,
                    color: '#000',
                    fontWeight: 700,
                    fontSize: 14,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                  }}
                >
                  {currentStep.btn}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
