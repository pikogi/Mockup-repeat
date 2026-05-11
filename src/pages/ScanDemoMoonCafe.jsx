import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScanDemoMoonCafe() {
  const [state, setState] = useState('idle')

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
                  border: '2.5px solid #eab308',
                }}
              >
                Presionar para escanear
              </span>
              <span style={{ fontSize: 42, lineHeight: 1, color: '#eab308' }}>↓</span>
            </motion.div>

            {/* Transparent clickable circle over the yellow scan button */}
            <div
              onClick={() => setState('found')}
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

        {/* ScanQR overlay: scanning animation then result */}
        <AnimatePresence>
          {state === 'found' && (
            <motion.div
              key="found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <iframe
                src="/scanqr-demo?demo=stamps&scan=1"
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
