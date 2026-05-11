import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GREEN = '#1a4a2e'

export default function ScanDemoMoonCafe() {
  const [state, setState] = useState('idle')

  useEffect(() => {
    if (state === 'scanning') {
      const t = setTimeout(() => setState('found'), 2200)
      return () => clearTimeout(t)
    }
  }, [state])

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-close') setState('idle')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

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
      {/* Real dashboard in iframe as background */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src="/dashboard/mooncafe-demo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Dashboard"
        />

        {/* Arrow + clickable area over the bottom nav scan button — idle only */}
        {state === 'idle' && (
          <>
            {/* Animated arrow pointing down to the yellow button */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                bottom: 100,
                left: 0,
                right: 0,
                margin: '0 auto',
                width: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                pointerEvents: 'none',
              }}
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
                  border: '2.5px solid #f59e0b',
                }}
              >
                Presionar para escanear
              </span>
              <span style={{ fontSize: 42, lineHeight: 1, color: '#f59e0b' }}>↓</span>
            </motion.div>

            {/* Transparent clickable circle over the yellow scan button */}
            <div
              onClick={() => setState('scanning')}
              style={{
                position: 'fixed',
                bottom: 18,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 60,
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
              }}
            />
          </>
        )}

        {/* Overlay states */}
        <AnimatePresence mode="wait">
          {state === 'idle' && null}

          {/* SCANNING */}
          {state === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(248,249,250,0.92)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 220,
                  height: 220,
                  background: 'rgba(26,74,46,0.04)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {[
                  { top: 0, left: 0, borderTop: `4px solid ${GREEN}`, borderLeft: `4px solid ${GREEN}` },
                  { top: 0, right: 0, borderTop: `4px solid ${GREEN}`, borderRight: `4px solid ${GREEN}` },
                  { bottom: 0, left: 0, borderBottom: `4px solid ${GREEN}`, borderLeft: `4px solid ${GREEN}` },
                  { bottom: 0, right: 0, borderBottom: `4px solid ${GREEN}`, borderRight: `4px solid ${GREEN}` },
                ].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', width: 26, height: 26, borderRadius: 2, ...s }} />
                ))}
                <motion.div
                  animate={{ top: ['10%', '85%', '10%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
                    borderRadius: 2,
                    boxShadow: `0 0 12px ${GREEN}`,
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=maria.gonzalez&bgcolor=ffffff&color=1a4a2e"
                    alt="QR"
                    style={{ width: 140, height: 140, opacity: 0.55 }}
                  />
                </div>
              </div>
              <p style={{ color: GREEN, fontWeight: 700, fontSize: 16 }}>Escaneando...</p>
            </motion.div>
          )}

          {/* FOUND: real ScanQR UI */}
          {state === 'found' && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <iframe
                src="/scanqr-demo?demo=stamps"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Scan QR"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
