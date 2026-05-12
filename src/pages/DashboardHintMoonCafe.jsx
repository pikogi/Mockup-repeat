import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const STEPS = [
  { iframe: '/dashboard/mooncafe-demo', label: 'Ver miembros', hintLeft: '35%', hintBottom: 100 },
  { iframe: '/customers/mooncafe-demo', label: 'Tocá un miembro', hintLeft: '50%', hintBottom: 240 },
  { iframe: '/notifications/mooncafe-demo', label: 'Escribí un mensaje', hintLeft: '50%', hintBottom: 320 },
]

export default function DashboardHintMoonCafe() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'tour-customer-clicked' && step === 1) setStep(2)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [step])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

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
          src={current.iframe}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Demo"
        />

        {/* Hint balloon + arrow */}
        <div
          style={{
            position: 'fixed',
            bottom: current.hintBottom,
            left: current.hintLeft,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#1c1c1e',
                background: 'rgba(255,255,255,0.97)',
                padding: '10px 20px',
                borderRadius: 12,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                border: '2.5px solid #eab308',
              }}
            >
              {current.label}
            </span>
            {!isLast && <span style={{ fontSize: 42, lineHeight: 1, color: '#eab308' }}>↓</span>}
          </motion.div>
        </div>

        {/* Step 0: transparent click interceptor over Miembros button */}
        {step === 0 && (
          <div
            onClick={() => setStep(1)}
            style={{
              position: 'fixed',
              bottom: 10,
              left: '35%',
              transform: 'translateX(-50%)',
              width: 64,
              height: 64,
              borderRadius: 8,
              cursor: 'pointer',
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  )
}
