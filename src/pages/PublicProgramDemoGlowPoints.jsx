import { useEffect, useState } from 'react'

const TOUR = '#eab308'

function IntroScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px 28px',
        textAlign: 'center',
        paddingTop: '18vh',
      }}
    >
      <img
        src="/logo.png"
        alt="Repeat"
        style={{
          width: 80,
          height: 80,
          objectFit: 'contain',
          borderRadius: 20,
          marginBottom: 28,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 8px 32px rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.07)',
        }}
      />
      <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>
        Bienvenido al tour de Repeat
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '0 0 48px', lineHeight: 1.6 }}>
        Sigue el recorrido y conoce cómo funciona el sistema de fidelización.
      </p>
      <button
        onClick={onStart}
        style={{
          width: '100%',
          maxWidth: 300,
          padding: '16px 0',
          background: TOUR,
          color: '#000',
          fontWeight: 800,
          fontSize: 16,
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
          letterSpacing: 0.3,
        }}
      >
        Comenzar Tour →
      </button>
    </div>
  )
}

function StoreScene({ onNext }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img
          src="/glow-store.png"
          alt="Glow store"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

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
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: TOUR }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Escaneá el QR para unirte</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
          La clienta escanea el QR y accede al formulario de registro del programa de puntos.
        </p>
        <button
          onClick={onNext}
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
          Escanear →
        </button>
      </div>
    </div>
  )
}

function PublicCardScene({ scene }) {
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
        <iframe
          src="/publicprogram?demo=glow-points"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Registro"
        />

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
            <div style={{ height: 4, flex: 1, borderRadius: 2, background: TOUR }} />
            <div style={{ height: 4, flex: 1, borderRadius: 2, background: scene === 'form' ? TOUR : '#e5e7eb' }} />
          </div>

          {scene === 'publiccard' ? (
            <>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                Agrega la tarjeta al wallet
              </p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
                Toca el botón de Google Wallet o Apple Wallet para guardar tu tarjeta digital.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                Completá el formulario
              </p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
                Ingresá nombre y email para unirte y recibir tu tarjeta de puntos.
              </p>
            </>
          )}

          {scene === 'form' && (
            <button
              onClick={() => window.parent?.postMessage({ type: 'demo-next' }, '*')}
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
              Siguiente paso →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PublicProgramDemoGlowPoints() {
  const [scene, setScene] = useState('intro')

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-show-form') setScene('form')
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (scene === 'intro') return <IntroScreen onStart={() => setScene('store')} />
  if (scene === 'store') return <StoreScene onNext={() => setScene('publiccard')} />
  return <PublicCardScene scene={scene} />
}
