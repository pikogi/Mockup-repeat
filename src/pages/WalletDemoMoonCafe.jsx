import { useEffect } from 'react'

export default function WalletDemoMoonCafe() {
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-next') {
        window.parent?.postMessage({ type: 'demo-next' }, '*')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f2f2f7',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src="/wallet/mooncafe"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Wallet"
        />

        {/* Tour card — informational only, anchored at bottom */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: '16px 16px 0 0',
            padding: '14px 16px 28px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
            border: '2px solid #eab308',
            borderBottom: 'none',
            zIndex: 30,
          }}
        >
          {/* Progress bar — single filled segment */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#eab308' }} />
          </div>

          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Guardá tu tarjeta</p>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
            Tocá el botón para agregar la tarjeta a tu Apple Wallet o Google Wallet.
          </p>
        </div>
      </div>
    </div>
  )
}
