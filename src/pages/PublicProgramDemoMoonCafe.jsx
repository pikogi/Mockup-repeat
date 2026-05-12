import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

/* ─── Pantalla de bienvenida negra ─── */
function IntroScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px 28px',
        textAlign: 'center',
      }}
    >
      <img
        src="/moon-cafe-logo.png"
        alt="Moon Cafe"
        style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 20, marginBottom: 28 }}
      />
      <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>
        Bienvenido al tour de Moon Cafe
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '0 0 48px', lineHeight: 1.6 }}>
        Seguí el recorrido y conocé cómo funciona el sistema de fidelización.
      </p>
      <button
        onClick={onStart}
        style={{
          width: '100%',
          maxWidth: 300,
          padding: '16px 0',
          background: '#eab308',
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

/* ─── Escena de la tienda ─── */
function StoreScene({ onNext }) {
  const qrUrl = `${window.location.origin}/publicprogram?demo=mooncafe`

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Foto de cafetería con mostrador visible */}
      <img
        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 60%',
        }}
      />

      {/* Overlay sutil */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />

      {/* Flyer posicionado en el mostrador — parte baja de la foto */}
      <div
        style={{
          position: 'absolute',
          bottom: 220,
          left: '50%',
          transform: 'translateX(-50%) perspective(600px) rotateX(4deg)',
          transformOrigin: 'bottom center',
        }}
      >
        {/* Marco de madera */}
        <div
          style={{
            padding: 6,
            background: 'linear-gradient(145deg, #9a7040 0%, #6b4518 50%, #9a7040 100%)',
            borderRadius: 16,
            boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          {/* Flyer */}
          <div style={{ width: 230, background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 7, background: '#1c4a2e' }} />
            <div
              style={{
                padding: '16px 18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <img
                src="/moon-cafe-logo.png"
                alt="Moon Cafe"
                style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 11, marginBottom: 9 }}
              />
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1c4a2e', margin: '0 0 3px', lineHeight: 1.2 }}>
                ¡Únete a nuestro
                <br />
                Club de Fidelidad!
              </h2>
              <div style={{ width: 32, height: 3, background: '#1c4a2e', borderRadius: 2, margin: '7px auto 11px' }} />
              <div
                style={{
                  padding: 10,
                  background: '#f8f6f2',
                  borderRadius: 11,
                  border: '2px solid rgba(28,74,46,0.15)',
                  marginBottom: 10,
                }}
              >
                <QRCodeSVG value={qrUrl} size={110} level="H" fgColor="#1a1a1a" bgColor="#f8f6f2" />
              </div>
              <p style={{ fontSize: 11, color: '#555', margin: '0 0 9px', fontWeight: 500 }}>Escaneá y unite gratis</p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 13px',
                  background: '#1c4a2e',
                  borderRadius: 50,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                🎁 Cada 5 cafés, 1 GRATIS
              </div>
            </div>
            <div
              style={{ padding: '7px 0', textAlign: 'center', borderTop: '1px solid #f0ece5', background: '#fafaf8' }}
            >
              <span style={{ color: '#aaa', fontSize: 10 }}>Powered by </span>
              <span style={{ color: '#1c4a2e', fontSize: 10, fontWeight: 700 }}>Repeat.la</span>
            </div>
          </div>
        </div>

        {/* Sombra sobre el mostrador */}
        <div
          style={{
            height: 10,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.45) 0%, transparent 70%)',
            marginTop: 2,
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
          border: '2px solid #eab308',
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#eab308' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Escaneá el QR para unirte</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
          El cliente escanea el QR y accede al formulario de registro del programa.
        </p>
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '10px 0',
            background: '#eab308',
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

/* ─── Pantalla del programa público ─── */
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
          src="/publicprogram?demo=mooncafe"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Registro"
        />

        {/* Tour card */}
        {scene === 'form' && (
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
              border: '2px solid #eab308',
              zIndex: 30,
            }}
          >
            {/* Progress bar — 2 de 2 */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#eab308' }} />
              <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#eab308' }} />
            </div>

            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Completá el formulario</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
              Ingresá nombre y email para unirte y recibir tu tarjeta digital.
            </p>

            <button
              onClick={() => window.parent?.postMessage({ type: 'demo-next' }, '*')}
              style={{
                width: '100%',
                padding: '10px 0',
                background: '#eab308',
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
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Componente principal ─── */
export default function PublicProgramDemoMoonCafe() {
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
