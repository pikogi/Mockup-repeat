const BRAND = '#e879f9'
const TOUR = '#eab308'

const STEPS = [
  {
    title: 'Guardá tu tarjeta de puntos',
    desc: 'La clienta agrega la tarjeta de puntos a su Google Wallet o Apple Wallet.',
    btn: 'Siguiente paso →',
  },
]

const POINTS = 68
const POINTS_GOAL = 150

export default function WalletDemoGlowPoints() {
  const handleBtn = () => {
    window.parent?.postMessage({ type: 'demo-next' }, '*')
  }

  const pct = Math.round((POINTS / POINTS_GOAL) * 100)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Simulated wallet card screen */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(160deg, #1a0027 0%, #2d0a3e 60%, #1a0027 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '48px 24px 160px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,121,249,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Wallet card */}
        <div
          style={{
            width: '100%',
            maxWidth: 340,
            background: 'linear-gradient(135deg, rgba(232,121,249,0.15) 0%, rgba(168,85,247,0.1) 100%)',
            border: '1px solid rgba(232,121,249,0.3)',
            borderRadius: 24,
            padding: '24px 22px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>Glow</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Club de puntos</div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #e879f9, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 4px 16px rgba(232,121,249,0.4)',
              }}
            >
              ✨
            </div>
          </div>

          {/* Member name */}
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>Valentina Gómez</div>

          {/* Points display */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
              <span style={{ color: '#fff', fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{POINTS}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>/ {POINTS_GOAL} pts</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${BRAND}, #a855f7)`,
                  borderRadius: 3,
                  boxShadow: `0 0 8px ${BRAND}`,
                }}
              />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 6 }}>
              Te faltan {POINTS_GOAL - POINTS} puntos para tu premio
            </div>
          </div>

          {/* Reward */}
          <div
            style={{
              background: 'rgba(232,121,249,0.1)',
              borderRadius: 12,
              padding: '10px 14px',
              borderLeft: `3px solid ${BRAND}`,
            }}
          >
            <div style={{ color: BRAND, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Premio</div>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Tratamiento de hidratación profunda</div>
          </div>
        </div>

        {/* Wallet buttons */}
        <div style={{ width: '100%', maxWidth: 340, marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              background: '#000',
              borderRadius: 14,
              padding: '13px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
            }}
          >
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>🍎 Agregar a Apple Wallet</span>
          </div>
          <div
            style={{
              background: '#1a73e8',
              borderRadius: 14,
              padding: '13px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
            }}
          >
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>G Agregar a Google Wallet</span>
          </div>
        </div>
      </div>

      {/* Tour card */}
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
          border: `2px solid ${TOUR}`,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: TOUR }} />
          ))}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{STEPS[0].title}</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>{STEPS[0].desc}</p>
        <button
          onClick={handleBtn}
          style={{
            width: '100%',
            padding: '10px 0',
            background: TOUR,
            color: '#000',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          {STEPS[0].btn}
        </button>
      </div>
    </div>
  )
}
