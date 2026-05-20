import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, QrCode, Store } from 'lucide-react'

const ACCENT = '#d97706'
const BRAND = '#1c1917'

const MEMBER = {
  name: 'Matías Fernández',
  initials: 'MF',
  tier: 'VIP',
  tierColor: '#f59e0b',
  visits: 18,
  since: 'mar 2025',
}

const DISCOUNTS = {
  Regular: '10%',
  VIP: '20%',
  Black: '25%',
}

const BUSINESS = 'Restaurante La Rueda'

export default function ComercioAmigoBarber() {
  const [phase, setPhase] = useState('idle') // idle | scanning | result | success

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-close') setPhase('idle')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const handleScan = () => {
    setPhase('scanning')
    setTimeout(() => setPhase('result'), 1200)
  }

  const handleRegister = () => {
    setPhase('success')
    setTimeout(() => window.parent?.postMessage({ type: 'demo-next' }, '*'), 800)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafaf9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: BRAND,
          padding: '18px 20px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Store size={18} color="#fff" />
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Barber Club</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Portal de comercio aliado</div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '4px 10px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {BUSINESS}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px' }}>
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                width: '100%',
                maxWidth: 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: '#f5f5f4',
                    border: `2px solid ${ACCENT}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <QrCode size={36} color={ACCENT} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 6 }}>Validar miembro</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                  Pedile al cliente que muestre su QR de Barber Club para verificar su membresía y aplicar el descuento.
                </div>
              </div>

              {/* Fake QR area */}
              <div
                style={{
                  width: '100%',
                  background: '#fff',
                  border: '1.5px dashed #d1d5db',
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 140,
                    background: '#f5f5f4',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=barber-member-demo&color=1c1917"
                    alt="QR"
                    style={{ width: 120, height: 120, borderRadius: 4 }}
                  />
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>QR del cliente</div>
              </div>

              <button
                onClick={handleScan}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: ACCENT,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                Escanear QR →
              </button>
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 40 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 56,
                  height: 56,
                  border: `3px solid ${ACCENT}`,
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                }}
              />
              <div style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Verificando membresía…</div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Member card */}
              <div
                style={{
                  background: BRAND,
                  borderRadius: 20,
                  padding: '20px',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: ACCENT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {MEMBER.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{MEMBER.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                      Miembro desde {MEMBER.since} · {MEMBER.visits} visitas
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: 'auto',
                      background: MEMBER.tierColor,
                      color: '#000',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    {MEMBER.tier}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                      Descuento en {BUSINESS}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: ACCENT }}>{DISCOUNTS[MEMBER.tier]} off</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Estado</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#4ade80',
                      }}
                    >
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                      Membresía activa
                    </div>
                  </div>
                </div>
              </div>

              {/* Register button */}
              <button
                onClick={handleRegister}
                style={{
                  width: '100%',
                  padding: '15px 0',
                  background: ACCENT,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                Registrar descuento →
              </button>

              <button
                onClick={() => setPhase('idle')}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'transparent',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: 13,
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 40 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <CheckCircle2 size={72} color="#22c55e" strokeWidth={1.5} />
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 6 }}>
                  Descuento registrado
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  Se aplicó el {DISCOUNTS[MEMBER.tier]} de descuento a {MEMBER.name}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
