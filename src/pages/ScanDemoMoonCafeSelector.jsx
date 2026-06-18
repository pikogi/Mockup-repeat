import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const CUSTOMER = { name: 'María García', program: 'Moon Café' }

/* ─── Scanner view ───────────────────────────────────────────────────────── */
function ScannerView({ onFound }) {
  useEffect(() => {
    const t = setTimeout(onFound, 2200)
    return () => clearTimeout(t)
  }, [onFound])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '48px 24px 48px',
      }}
    >
      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="Repeat" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>repeat</span>
        </div>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} color="#fff" />
        </button>
      </div>

      {/* Viewfinder */}
      <div style={{ position: 'relative', width: 260, height: 260 }}>
        {/* Corner decorations */}
        {[
          {
            top: 0,
            left: 0,
            borderTop: '3px solid #eab308',
            borderLeft: '3px solid #eab308',
            borderRadius: '4px 0 0 0',
          },
          {
            top: 0,
            right: 0,
            borderTop: '3px solid #eab308',
            borderRight: '3px solid #eab308',
            borderRadius: '0 4px 0 0',
          },
          {
            bottom: 0,
            left: 0,
            borderBottom: '3px solid #eab308',
            borderLeft: '3px solid #eab308',
            borderRadius: '0 0 0 4px',
          },
          {
            bottom: 0,
            right: 0,
            borderBottom: '3px solid #eab308',
            borderRight: '3px solid #eab308',
            borderRadius: '0 0 4px 0',
          },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 32, height: 32, ...s }} />
        ))}

        {/* Mock QR grid */}
        <div
          style={{
            position: 'absolute',
            inset: 20,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 3,
            opacity: 0.15,
          }}
        >
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} style={{ background: Math.random() > 0.4 ? '#fff' : 'transparent', borderRadius: 2 }} />
          ))}
        </div>

        {/* Scan line */}
        <motion.div
          animate={{ top: ['15%', '85%', '15%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #eab308, transparent)',
            boxShadow: '0 0 8px #eab308',
          }}
        />
      </div>

      {/* Bottom */}
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 320 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.5 }}>
          Apunta la cámara al código QR de la tarjeta del cliente
        </p>
        <button
          onClick={onFound}
          style={{
            width: '100%',
            padding: '14px 0',
            background: '#eab308',
            color: '#000',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
          }}
        >
          Demo: detectar tarjeta →
        </button>
      </div>
    </div>
  )
}

/* ─── Selector view ──────────────────────────────────────────────────────── */
function SelectorView({ onSelectStamps, onSelectPoints }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '48px 24px',
      }}
    >
      {/* Customer card */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>Tarjeta detectada</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>
            {CUSTOMER.name} · {CUSTOMER.program}
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}
      >
        ¿Qué deseas registrar?
      </motion.p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Stamps option */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onSelectStamps}
          style={{
            background: '#fff',
            border: '2px solid #1a4a2e',
            borderRadius: 16,
            padding: '20px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: '#1a4a2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 22,
            }}
          >
            🟢
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>Sumar sello</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '3px 0 0' }}>Programa de sellos · +1 sello</p>
          </div>
        </motion.button>

        {/* Points option */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onSelectPoints}
          style={{
            background: '#fff',
            border: '2px solid #eab308',
            borderRadius: 16,
            padding: '20px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: '#eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 22,
            }}
          >
            🟡
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>Sumar puntos</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '3px 0 0' }}>Programa de puntos · +50 puntos</p>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

/* ─── Success view ───────────────────────────────────────────────────────── */
function SuccessView({ type, onReset }) {
  const isStamps = type === 'stamps'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: isStamps ? '#1a4a2e' : '#eab308',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontWeight: 800, fontSize: 22, color: '#111827', margin: '0 0 8px' }}
      >
        {isStamps ? '¡Sello registrado!' : '¡Puntos registrados!'}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: 15, color: '#6b7280', margin: '0 0 32px' }}
      >
        {CUSTOMER.name} · {CUSTOMER.program}
      </motion.p>

      {/* Result card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: 320,
          marginBottom: 32,
        }}
      >
        {isStamps ? (
          <>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 12px', fontWeight: 500 }}>Sellos acumulados</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: i < 4 ? '#1a4a2e' : '#f3f4f6',
                    border: i < 4 ? 'none' : '2px dashed #d1d5db',
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>4 / 5 · Próximo: premio gratuito</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 8px', fontWeight: 500 }}>Puntos sumados</p>
            <p style={{ fontWeight: 800, fontSize: 32, color: '#eab308', margin: '0 0 4px' }}>+50</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Total: 180 puntos · Meta: 200 pts</p>
          </>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        onClick={onReset}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '14px 0',
          background: '#111827',
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
          marginBottom: 12,
        }}
      >
        Escanear otra tarjeta
      </motion.button>

      <button
        onClick={() => window.history.back()}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          fontSize: 14,
          cursor: 'pointer',
          padding: '8px 0',
        }}
      >
        Volver al panel
      </button>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function ScanDemoMoonCafeSelector() {
  const [state, setState] = useState('scanning')

  return (
    <AnimatePresence mode="wait">
      {state === 'scanning' && (
        <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ScannerView onFound={() => setState('found')} />
        </motion.div>
      )}
      {state === 'found' && (
        <motion.div key="found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <SelectorView
            onSelectStamps={() => setState('success-stamps')}
            onSelectPoints={() => setState('success-points')}
          />
        </motion.div>
      )}
      {state === 'success-stamps' && (
        <motion.div
          key="success-stamps"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <SuccessView type="stamps" onReset={() => setState('scanning')} />
        </motion.div>
      )}
      {state === 'success-points' && (
        <motion.div
          key="success-points"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <SuccessView type="points" onReset={() => setState('scanning')} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
