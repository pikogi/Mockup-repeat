const TOUR = '#eab308'

const STEPS = [
  {
    title: 'Guardá tu tarjeta',
    desc: 'La clienta agrega la tarjeta de sellos a su Google Wallet o Apple Wallet.',
    btn: 'Siguiente paso →',
  },
]

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
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img
          src="/glow-wallet-card.png"
          alt="Glow Beauty Club wallet card"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
          }}
        />
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
