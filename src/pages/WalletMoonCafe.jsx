export default function WalletMoonCafe() {
  const STAMPS_TOTAL = 5
  const STAMPS_FILLED = 2

  const CoffeeCup = ({ filled }) => (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: filled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.22)',
        border: '2px solid rgba(255,255,255,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        flexShrink: 0,
      }}
    >
      {filled ? '☕' : <span style={{ opacity: 0.5 }}>☕</span>}
    </div>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f2f2f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px 40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* iOS status bar simulation */}
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 8px 10px',
          fontSize: 15,
          fontWeight: 600,
          color: '#1c1c1e',
        }}
      >
        <span>12:58</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
          <span>●●●</span>
          <span>WiFi</span>
          <span
            style={{
              background: '#1c1c1e',
              color: '#f2f2f7',
              borderRadius: 4,
              padding: '1px 5px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            60
          </span>
        </div>
      </div>

      {/* Wallet card */}
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          background: '#1a4a2e',
        }}
      >
        {/* Card header */}
        <div
          style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <img
            src="/moon-cafe-logo.png"
            alt="café moon"
            style={{ height: 42, width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain' }}
          />
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>The Club</span>
        </div>

        {/* Stamp area with cafe-style background */}
        <div
          style={{
            margin: '0 16px',
            borderRadius: 14,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #7c5c32 0%, #a07840 25%, #8b6e30 50%, #4a7c3f 80%, #2d5a25 100%)',
            padding: '16px 12px',
          }}
        >
          {/* Warm overlay */}
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: '10px 8px' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {Array.from({ length: STAMPS_TOTAL }).map((_, i) => (
                <CoffeeCup key={i} filled={i < STAMPS_FILLED} />
              ))}
            </div>
          </div>
        </div>

        {/* Reward info */}
        <div
          style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <div>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              Oferta de recompensa
            </p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>Cada 5 cafés, 1 GRATIS 💛</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              Sellos · Premios
            </p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>
              {STAMPS_FILLED}/{STAMPS_TOTAL} · 0
            </p>
          </div>
        </div>

        {/* QR section */}
        <div style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://repeat.la/mooncafe&bgcolor=ffffff&color=1a4a2e`}
              alt="QR"
              style={{ width: 180, height: 180, borderRadius: 6 }}
            />
            <p style={{ color: '#9ca3af', fontSize: 13, fontWeight: 500 }}>by Repeat.la</p>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', gap: 6, marginTop: 16, alignItems: 'center' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 6 ? 16 : 8,
              height: 8,
              borderRadius: 4,
              background: i === 6 ? '#3a3a3c' : 'rgba(60,60,67,0.18)',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      {/* Santander card peeking */}
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          marginTop: 14,
          height: 60,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '10px 16px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #e8303a, #ec0000)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(236,0,0,0.6)' }} />
          <div
            style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,130,0,0.8)', marginLeft: -10 }}
          />
          <span style={{ color: '#1c1c1e', fontSize: 13, fontWeight: 600, marginLeft: 4 }}>Santander</span>
        </div>
      </div>
    </div>
  )
}
