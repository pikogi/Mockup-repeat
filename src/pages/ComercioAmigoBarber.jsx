import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Store, XCircle } from 'lucide-react'

const ACCENT = '#d97706'
const BRAND = '#1c1917'
const VALID_CODE = '1234'

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

function ScannerView({ onScanned }) {
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => onScanned(), 1400)
  }

  return (
    <motion.div
      key="scanner"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 4 }}>Escaneá el QR del cliente</div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>El cliente muestra el QR desde su app de Barber Club</div>
      </div>

      {/* Fake camera viewfinder */}
      <div
        style={{
          width: '100%',
          maxWidth: 300,
          aspectRatio: '1',
          background: '#111',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}
      >
        {/* Simulated camera feed */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)',
          }}
        />

        {/* Corner brackets */}
        {[
          { top: 16, left: 16, borderTop: `3px solid ${ACCENT}`, borderLeft: `3px solid ${ACCENT}` },
          { top: 16, right: 16, borderTop: `3px solid ${ACCENT}`, borderRight: `3px solid ${ACCENT}` },
          { bottom: 16, left: 16, borderBottom: `3px solid ${ACCENT}`, borderLeft: `3px solid ${ACCENT}` },
          { bottom: 16, right: 16, borderBottom: `3px solid ${ACCENT}`, borderRight: `3px solid ${ACCENT}` },
        ].map((style, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 28,
              height: 28,
              borderRadius: 3,
              ...style,
            }}
          />
        ))}

        {/* QR shown in center (the customer's phone) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 10,
              borderRadius: 10,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
            }}
          >
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=barber-member-MF-VIP&color=1c1917"
              alt="QR"
              style={{ width: 100, height: 100, display: 'block' }}
            />
          </div>
        </div>

        {/* Scanning line animation */}
        {scanning && (
          <motion.div
            initial={{ top: '15%' }}
            animate={{ top: '85%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              height: 2,
              background: ACCENT,
              boxShadow: `0 0 8px ${ACCENT}`,
            }}
          />
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={scanning}
        style={{
          width: '100%',
          maxWidth: 300,
          padding: '14px 0',
          background: scanning ? '#9ca3af' : ACCENT,
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          border: 'none',
          borderRadius: 12,
          cursor: scanning ? 'default' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {scanning ? 'Escaneando…' : 'Escanear QR →'}
      </button>
    </motion.div>
  )
}

function ResultView({ onConfirm, onCancel }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleConfirm = () => {
    if (code === VALID_CODE) {
      onConfirm()
    } else {
      setError(true)
      setTimeout(() => setError(false), 1800)
    }
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Member card */}
      <div
        style={{
          background: BRAND,
          borderRadius: 20,
          padding: '18px 20px',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: ACCENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {MEMBER.initials}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{MEMBER.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
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
              padding: '3px 10px',
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
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>
              Descuento en {BUSINESS}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: ACCENT }}>{DISCOUNTS[MEMBER.tier]} off</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Estado</div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#4ade80' }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
              Activo
            </div>
          </div>
        </div>
      </div>

      {/* Code entry */}
      <div
        style={{
          background: '#fff',
          border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
          borderRadius: 16,
          padding: '16px',
          transition: 'border-color 0.2s',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Código de autorización</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          Ingresá el código que te dio la barbería para validar el descuento.
        </div>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          placeholder="- - - -"
          value={code}
          onChange={(e) => setCode(e.target.value.slice(0, 4))}
          style={{
            width: '100%',
            padding: '12px 14px',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 8,
            textAlign: 'center',
            border: `1.5px solid ${error ? '#ef4444' : '#d1d5db'}`,
            borderRadius: 10,
            outline: 'none',
            color: '#111',
            background: error ? '#fef2f2' : '#fafafa',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        />
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 8,
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <XCircle size={14} />
            Código incorrecto. Intentá de nuevo.
          </motion.div>
        )}
        <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 8, textAlign: 'center' }}>Código de demo: 1234</div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={code.length < 4}
        style={{
          width: '100%',
          padding: '14px 0',
          background: code.length < 4 ? '#e5e7eb' : ACCENT,
          color: code.length < 4 ? '#9ca3af' : '#fff',
          fontWeight: 700,
          fontSize: 15,
          border: 'none',
          borderRadius: 12,
          cursor: code.length < 4 ? 'default' : 'pointer',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        Confirmar descuento →
      </button>

      <button
        onClick={onCancel}
        style={{
          width: '100%',
          padding: '11px 0',
          background: 'transparent',
          color: '#9ca3af',
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
  )
}

export default function ComercioAmigoBarber() {
  const [phase, setPhase] = useState('scan') // scan | result | success

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-close') setPhase('scan')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const handleConfirm = () => {
    setPhase('success')
    setTimeout(() => window.parent?.postMessage({ type: 'demo-next' }, '*'), 900)
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
          padding: '16px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Store size={16} color="#fff" />
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Barber Club</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>Portal de comercio aliado</div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 7,
            padding: '3px 9px',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {BUSINESS}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px',
          overflowY: 'auto',
        }}
      >
        <AnimatePresence mode="wait">
          {phase === 'scan' && <ScannerView key="scan" onScanned={() => setPhase('result')} />}

          {phase === 'result' && (
            <ResultView key="result" onConfirm={handleConfirm} onCancel={() => setPhase('scan')} />
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
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
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
