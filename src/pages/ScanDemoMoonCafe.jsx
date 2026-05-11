import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Plus } from 'lucide-react'

const GREEN = '#1a4a2e'
const STAMPS_TOTAL = 5

function StampRow({ filled }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '8px 0' }}>
      {Array.from({ length: STAMPS_TOTAL }).map((_, i) => (
        <motion.div
          key={i}
          initial={i === filled - 1 ? { scale: 0.5, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: i < filled ? GREEN : 'transparent',
            border: `2px solid ${i < filled ? GREEN : '#d1d5db'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {i < filled ? '☕' : ''}
        </motion.div>
      ))}
    </div>
  )
}

export default function ScanDemoMoonCafe() {
  const [state, setState] = useState('idle')
  const [stamps, setStamps] = useState(2)

  useEffect(() => {
    if (state === 'scanning') {
      const t = setTimeout(() => setState('found'), 2200)
      return () => clearTimeout(t)
    }
  }, [state])

  const handleStamp = () => {
    setStamps((s) => s + 1)
    setState('stamped')
  }

  const handleReset = () => {
    setState('idle')
    setStamps(2)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          background: GREEN,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <img src="/moon-cafe-logo.png" alt="café moon" style={{ height: 36, filter: 'brightness(0) invert(1)' }} />
        <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Escanear tarjeta</span>
      </div>

      <div
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 420,
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <AnimatePresence mode="wait">
          {/* IDLE: scan button */}
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
            >
              {/* QR frame */}
              <div style={{ position: 'relative', width: 240, height: 240 }}>
                {/* Corner brackets */}
                {[
                  { top: 0, left: 0, borderTop: `4px solid ${GREEN}`, borderLeft: `4px solid ${GREEN}` },
                  { top: 0, right: 0, borderTop: `4px solid ${GREEN}`, borderRight: `4px solid ${GREEN}` },
                  { bottom: 0, left: 0, borderBottom: `4px solid ${GREEN}`, borderLeft: `4px solid ${GREEN}` },
                  { bottom: 0, right: 0, borderBottom: `4px solid ${GREEN}`, borderRight: `4px solid ${GREEN}` },
                ].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 2, ...s }} />
                ))}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '0 24px', lineHeight: 1.5 }}
                  >
                    Apuntá la cámara al QR del cliente
                  </p>
                </div>
              </div>

              <button
                onClick={() => setState('scanning')}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: GREEN,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(26,74,46,0.35)',
                  letterSpacing: 0.3,
                }}
              >
                Presionar para escanear tarjeta cliente
              </button>
            </motion.div>
          )}

          {/* SCANNING: animated scan line */}
          {state === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 240,
                  height: 240,
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
                  <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 2, ...s }} />
                ))}
                {/* Scan line */}
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
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=maria.gonzalez&bgcolor=ffffff&color=1a4a2e`}
                    alt="QR"
                    style={{ width: 160, height: 160, opacity: 0.6 }}
                  />
                </div>
              </div>
              <p style={{ color: GREEN, fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>Escaneando...</p>
            </motion.div>
          )}

          {/* FOUND: customer card */}
          {state === 'found' && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>Tarjeta encontrada</p>

              {/* Customer card */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '20px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: GREEN,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    M
                  </div>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: '#1c1c1e', marginBottom: 2 }}>María González</p>
                    <p style={{ fontSize: 13, color: '#9ca3af' }}>maria.gonzalez@gmail.com</p>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      marginBottom: 8,
                    }}
                  >
                    Sellos acumulados
                  </p>
                  <StampRow filled={stamps} />
                  <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
                    {stamps}/{STAMPS_TOTAL} — {STAMPS_TOTAL - stamps} para su próximo café gratis
                  </p>
                </div>

                <button
                  onClick={handleStamp}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: GREEN,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(26,74,46,0.3)',
                  }}
                >
                  <Plus style={{ width: 20, height: 20 }} />
                  Agregar sello
                </button>
              </div>
            </motion.div>
          )}

          {/* STAMPED: success */}
          {state === 'stamped' && (
            <motion.div
              key="stamped"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              >
                <CheckCircle style={{ width: 72, height: 72, color: GREEN }} />
              </motion.div>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#1c1c1e' }}>¡Sello agregado!</p>

              <div
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '20px',
                  width: '100%',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: GREEN,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    M
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#1c1c1e' }}>María González</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                  <StampRow filled={stamps} />
                  <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
                    {stamps}/{STAMPS_TOTAL} — Quedan {STAMPS_TOTAL - stamps} sellos para su próximo café gratis
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'transparent',
                  color: GREEN,
                  border: `2px solid ${GREEN}`,
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Listo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
