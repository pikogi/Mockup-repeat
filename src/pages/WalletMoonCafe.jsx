export default function WalletMoonCafe() {
  const handleAddWallet = () => {
    window.parent?.postMessage({ type: 'demo-next' }, '*')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f2f2f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <img
        src="/moon-cafe-wallet.png"
        alt="Moon Cafe Wallet"
        style={{ width: '100%', maxWidth: 430, display: 'block' }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 430,
          padding: '16px 20px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Apple Wallet button */}
        <button
          onClick={handleAddWallet}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '14px 0',
            background: '#000',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: '-apple-system, system-ui, sans-serif',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Agregar a Apple Wallet
        </button>

        {/* Google Wallet button */}
        <button
          onClick={handleAddWallet}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '14px 0',
            background: '#fff',
            color: '#1f1f1f',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'system-ui, sans-serif',
            border: '1.5px solid #dadce0',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12 5c1.6 0 3.1.6 4.2 1.7l3.1-3.1C17.5 1.9 14.9.8 12 .8 7.4.8 3.4 3.5 1.4 7.4l3.6 2.8C6 7.4 8.8 5 12 5z"
              fill="#EA4335"
            />
            <path
              d="M23.2 12.3c0-.9-.1-1.7-.2-2.5H12v4.8h6.3c-.3 1.5-1.1 2.8-2.3 3.6l3.6 2.8c2.1-1.9 3.3-4.8 3.3-8.1l.3-.6z"
              fill="#4285F4"
            />
            <path
              d="M5 14.2c-.3-.8-.4-1.7-.4-2.6 0-.9.2-1.8.4-2.6L1.4 6.2C.5 7.9 0 9.9 0 12s.5 4.1 1.4 5.8l3.6-3.6z"
              fill="#FBBC05"
            />
            <path
              d="M12 23.2c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.2 1.1-3.6 1.1-3.2 0-5.9-2.2-6.9-5.1L1.4 16.6C3.4 20.5 7.4 23.2 12 23.2z"
              fill="#34A853"
            />
          </svg>
          Agregar a Google Wallet
        </button>
      </div>
    </div>
  )
}
