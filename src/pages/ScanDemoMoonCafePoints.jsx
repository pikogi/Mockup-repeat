import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const STEPS = [
  {
    state: 'idle',
    title: 'Escanear la tarjeta del cliente',
    desc: 'Toca el botón amarillo para registrar la visita y sumar puntos al instante.',
  },
  {
    state: 'success',
    title: '¡Puntos registrados!',
    desc: 'Los puntos se sumaron a la tarjeta. Al llegar a 100 puntos, el premio se otorga automáticamente.',
    btn: 'Siguiente paso →',
  },
]

export default function ScanDemoMoonCafePoints() {
  const isShell = new URLSearchParams(window.location.search).has('shell')
  const [scanState, setScanState] = useState('idle')
  const [demoSubStep, setDemoSubStep] = useState(1)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  const innerIframeRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-close') {
        setScanState('idle')
        window.parent?.postMessage({ type: 'scan-closed' }, '*')
      }
      if (e.data?.type === 'scan-success') setScanState('success')
      if (e.data?.type === 'demo-scan') setScanState('found')
      if (e.data?.type === 'scan-opened') {
        setScanState('hidden')
        window.parent?.postMessage({ type: 'scan-opened' }, '*')
      }
      if (e.data?.type === 'demo-substep') setDemoSubStep(e.data.subStep)
      if (e.data?.type === 'demo-rescan') {
        innerIframeRef.current?.contentWindow?.location?.replace('/scanqr-demo?demo=selector&scan=1')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const currentStep = STEPS.find((s) => s.state === scanState) ?? STEPS[0]
  const stepIndex = STEPS.findIndex((s) => s.state === scanState)

  const handleBtn = () => {
    if (scanState === 'idle') {
      setScanState('found')
    } else {
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
        {/* Dashboard as background */}
        <iframe
          ref={innerIframeRef}
          src="/dashboard-demo/mooncafe-points"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Dashboard"
        />

        {/* ScanQR overlay */}
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

        {/* Cartelito + flecha — solo en shell mode, mientras no hay escaneo activo */}
        {isShell && scanState === 'idle' && isDesktop && (
          <div
            style={{
              position: 'fixed',
              top: 486,
              left: 140,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <motion.div
              animate={{ x: [0, -6, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: '#eab308', fontSize: 22, lineHeight: 1, pointerEvents: 'none' }}
            >
              ←
            </motion.div>
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: '7px 18px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                border: '2px solid #eab308',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>Registrar visita</span>
            </div>
          </div>
        )}

        {isShell && scanState === 'idle' && !isDesktop && (
          <div
            style={{
              position: 'fixed',
              bottom: demoSubStep === 2 ? 75 : 100,
              ...(demoSubStep === 2 ? { left: 82 } : { left: 'calc(50% + 2px)', transform: 'translateX(-50%)' }),
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: '7px 18px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                border: '2px solid #eab308',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                {demoSubStep === 2 ? 'Miembros' : 'Registrar visita'}
              </span>
            </div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: '#eab308', fontSize: 22, lineHeight: 1, pointerEvents: 'none' }}
            >
              ↓
            </motion.div>
          </div>
        )}

        {/* Tour card — hidden in shell mode y durante el escaneo */}
        {!isShell && scanState !== 'found' && (
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
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    background: i <= stepIndex ? '#eab308' : '#e5e7eb',
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
                  color: '#eab308',
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
                    background: '#eab308',
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
