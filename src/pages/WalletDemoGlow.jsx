const ACCENT = '#e879f9'

const STEPS = [
  {
    title: 'Guardá tu tarjeta',
    desc: 'La clienta agrega la tarjeta de sellos a su Google Wallet o Apple Wallet.',
    btn: 'Siguiente paso →',
  },
]

const STAMPS_TOTAL = 8
const STAMPS_DONE = 3

export default function WalletDemoGlow() {
  const handleBtn = () => {
    window.parent?.postMessage({ type: 'demo-next' }, '*')
  }

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
      {/* Simulated Apple Wallet card */}
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
        {/* Glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,121,249,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
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
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Club de fidelidad</div>
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
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 }}>Valentina Gómez</div>

          {/* Stamps grid */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 10 }}>
              Progreso — {STAMPS_DONE}/{STAMPS_TOTAL} visitas
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Array.from({ length: STAMPS_TOTAL }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background:
                      i < STAMPS_DONE ? 'linear-gradient(135deg, #e879f9, #a855f7)' : 'rgba(255,255,255,0.08)',
                    border: i < STAMPS_DONE ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    boxShadow: i < STAMPS_DONE ? '0 2px 8px rgba(232,121,249,0.4)' : 'none',
                  }}
                >
                  {i < STAMPS_DONE ? '✨' : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Reward */}
          <div
            style={{
              background: 'rgba(232,121,249,0.1)',
              borderRadius: 12,
              padding: '10px 14px',
              borderLeft: `3px solid ${ACCENT}`,
            }}
          >
            <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Premio</div>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Sesión de lifting facial gratis</div>
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
              gap: 8,
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
              gap: 8,
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
          border: `2px solid ${ACCENT}`,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: ACCENT }} />
          ))}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{STEPS[0].title}</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>{STEPS[0].desc}</p>
        <button
          onClick={handleBtn}
          style={{
            width: '100%',
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
          {STEPS[0].btn}
        </button>
      </div>
    </div>
  )
}
