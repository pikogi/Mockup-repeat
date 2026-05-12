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
        background: '#e8dfd0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      {/* Techo / moldura */}
      <div style={{ height: 14, background: '#c4b49a' }} />

      {/* Pared con textura */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(180deg, #e8dfd0 0%, #ddd0bc 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 28px 160px',
        }}
      >
        {/* Cartel / flyer en la pared */}
        <div
          style={{
            width: '100%',
            maxWidth: 300,
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          {/* Barra superior verde */}
          <div style={{ height: 8, background: '#1c4a2e' }} />

          <div
            style={{
              padding: '22px 24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <img
              src="/moon-cafe-logo.png"
              alt="Moon Cafe"
              style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 14, marginBottom: 12 }}
            />

            {/* Título */}
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#1c4a2e',
                margin: '0 0 4px',
                lineHeight: 1.2,
              }}
            >
              ¡Únete a nuestro
              <br />
              Club de Fidelidad!
            </h2>

            {/* Separador */}
            <div style={{ width: 40, height: 3, background: '#1c4a2e', borderRadius: 2, margin: '10px auto 14px' }} />

            {/* QR */}
            <div
              style={{
                padding: 14,
                background: '#f8f6f2',
                borderRadius: 14,
                border: '2px solid rgba(28,74,46,0.15)',
                marginBottom: 14,
              }}
            >
              <QRCodeSVG value={qrUrl} size={140} level="H" fgColor="#1a1a1a" bgColor="#f8f6f2" />
            </div>

            {/* Subtitle */}
            <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px', fontWeight: 500 }}>Escaneá y unite gratis</p>

            {/* Badge de recompensa */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: '#1c4a2e',
                borderRadius: 50,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🎁 Cada 5 cafés, 1 GRATIS
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '10px 0',
              textAlign: 'center',
              borderTop: '1px solid #f0ece5',
              background: '#fafaf8',
            }}
          >
            <span style={{ color: '#aaa', fontSize: 11 }}>Powered by </span>
            <span style={{ color: '#1c4a2e', fontSize: 11, fontWeight: 700 }}>Repeat.la</span>
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
          border: '2px solid #eab308',
          zIndex: 30,
        }}
      >
        {/* Progress bar — 1 de 2 */}
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
