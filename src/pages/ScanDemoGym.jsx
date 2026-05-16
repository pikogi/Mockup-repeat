import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ACCENT = '#f97316'

const LEVELS = [
  { name: 'Rookie', min: 0, max: 99, color: '#6b7280' },
  { name: 'Amateur', min: 100, max: 249, color: '#22c55e' },
  { name: 'Pro', min: 250, max: 499, color: '#3b82f6' },
  { name: 'Elite', min: 500, max: 999, color: '#a855f7' },
  { name: 'Beast', min: 1000, max: Infinity, color: '#f97316' },
]

function getLevel(xp) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0]
}

const MEMBER = { name: 'Carlos M.', xp: 340, streakWeeks: 5 }
const XP_GAINED = 10

export default function ScanDemoGym() {
  const [phase, setPhase] = useState('idle') // idle | checkin | success

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-close') setPhase('idle')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const handleScan = () => setPhase('checkin')

  const handleSuccess = () => {
    setPhase('success')
    window.parent?.postMessage({ type: 'scan-success' }, '*')
  }

  const handleNext = () => {
    window.parent?.postMessage({ type: 'demo-next' }, '*')
  }

  const newXp = MEMBER.xp + XP_GAINED
  const level = getLevel(MEMBER.xp)
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]

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
        {/* Dashboard background */}
        <iframe
          src="/dashboard/gym-demo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Dashboard"
        />

        {/* Check-in overlay */}
        <AnimatePresence>
          {phase === 'checkin' && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
              }}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  padding: '28px 24px 24px',
                  width: '100%',
                  maxWidth: 340,
                  textAlign: 'center',
                }}
              >
                {/* Success icon */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 36,
                  }}
                >
                  ✓
                </div>

                <p style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                  ¡Check-in registrado!
                </p>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>{MEMBER.name}</p>

                {/* XP gained */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 22 }}>⚡</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#92400e' }}>+{XP_GAINED} XP ganados</span>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <div
                    style={{
                      flex: 1,
                      background: '#fff7ed',
                      borderRadius: 12,
                      padding: '10px 8px',
                    }}
                  >
                    <p style={{ fontSize: 18, margin: '0 0 2px' }}>🔥</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#f97316', margin: '0 0 2px' }}>6 sem</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>racha activa</p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: '#f0f9ff',
                      borderRadius: 12,
                      padding: '10px 8px',
                    }}
                  >
                    <p style={{ fontSize: 18, margin: '0 0 2px' }}>⚡</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#3b82f6', margin: '0 0 2px' }}>{newXp} XP</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>nivel {level.name}</p>
                  </div>
                </div>

                {/* Level progress */}
                {nextLevel && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>Progreso a {nextLevel.name}</span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>
                        {newXp}/{nextLevel.min} XP
                      </span>
                    </div>
                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, ((newXp - level.min) / (nextLevel.min - level.min)) * 100)}%`,
                          background: `linear-gradient(90deg, ${level.color}, ${nextLevel.color})`,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSuccess}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: ACCENT,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  Listo
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tour card */}
        {phase !== 'checkin' && (
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
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    background: i === 0 || phase === 'success' ? ACCENT : '#e5e7eb',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            {phase === 'idle' ? (
              <>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                  Escaneá la tarjeta del alumno
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
                  El operador presiona el botón de escaneo cuando el alumno llega al gym para registrar el check-in.
                </p>
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
              </>
            ) : (
              <>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                  ¡Check-in registrado!
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
                  El alumno sumó XP, actualizó su racha y avanzó en su desafío mensual.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setPhase('idle')}
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
                  <button
                    onClick={handleNext}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      background: ACCENT,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    Siguiente paso →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Floating scan button — only in idle */}
        {phase === 'idle' && (
          <button
            onClick={handleScan}
            style={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${ACCENT}, #ef4444)`,
              border: '3px solid #fff',
              boxShadow: '0 4px 20px rgba(249,115,22,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 40,
              fontSize: 28,
            }}
          >
            📷
          </button>
        )}
      </div>
    </div>
  )
}
