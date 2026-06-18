import { ChevronLeft, ChevronRight } from 'lucide-react'

const WHATSAPP_URL =
  'https://wa.me/5493517881653?text=' +
  encodeURIComponent('Hola, acabo de ver la demo de Repeat y me interesa para mi negocio. ¿Me puedes contar más?')

const BENEFITS = [
  'Tarjeta digital en Google y Apple Wallet',
  'Sorteos entre tus miembros',
  'Notificaciones push a tu cartera de clientes',
  'Dashboard con métricas en tiempo real',
]

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.522 5.847L.057 23.882a.5.5 0 0 0 .61.61l6.035-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 0 1-5.003-1.373l-.36-.213-3.724.904.92-3.631-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  )
}

export default function DemoGuideCard({
  steps,
  currentStep,
  onPrev,
  onNext,
  brandName,
  brandLogo,
  done,
  onRestart,
  positionTop,
  isDesktop,
}) {
  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  if (done) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: isDesktop ? 32 : 24,
          right: isDesktop ? 32 : 24,
          width: isDesktop ? 380 : 320,
          background: '#fff',
          borderRadius: isDesktop ? 24 : 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          border: '1px solid #f0f0f0',
          padding: isDesktop ? 28 : 20,
          zIndex: 50,
        }}
        className="max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:bottom-4"
      >
        {/* Header */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 12 : 10, marginBottom: isDesktop ? 20 : 16 }}
        >
          <div
            style={{
              width: isDesktop ? 42 : 36,
              height: isDesktop ? 42 : 36,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              width={isDesktop ? 21 : 18}
              height={isDesktop ? 21 : 18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p
              style={{
                fontWeight: 800,
                fontSize: isDesktop ? 17 : 14,
                color: '#111827',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              ¿Quieres Repeat en tu negocio?
            </p>
            <p style={{ fontSize: isDesktop ? 13 : 11, color: '#6b7280', margin: 0, marginTop: 2 }}>
              Así de simple es fidelizar clientes.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div
          style={{
            background: '#f9fafb',
            borderRadius: 12,
            padding: isDesktop ? '14px 16px' : '10px 12px',
            marginBottom: isDesktop ? 18 : 14,
            display: 'flex',
            flexDirection: 'column',
            gap: isDesktop ? 10 : 7,
          }}
        >
          {BENEFITS.map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span
                style={{
                  color: '#22c55e',
                  fontWeight: 700,
                  fontSize: isDesktop ? 15 : 13,
                  lineHeight: 1.4,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: isDesktop ? 14 : 12, color: '#374151', lineHeight: 1.4 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA — WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            width: '100%',
            padding: isDesktop ? '14px 0' : '11px 0',
            background: '#25d366',
            color: '#fff',
            fontWeight: 700,
            fontSize: isDesktop ? 15 : 13,
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            textDecoration: 'none',
            boxSizing: 'border-box',
            marginBottom: 8,
          }}
        >
          <WhatsAppIcon />
          Hablar por WhatsApp
        </a>

        {/* Secondary */}
        <button
          onClick={onRestart}
          style={{
            width: '100%',
            padding: isDesktop ? '11px 0' : '9px 0',
            background: 'none',
            color: '#9ca3af',
            fontWeight: 500,
            fontSize: isDesktop ? 13 : 12,
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          Ver demo otra vez
        </button>
      </div>
    )
  }

  const cardStyle = positionTop
    ? isDesktop
      ? { position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', width: 600 }
      : { position: 'fixed', top: 16, left: 16, right: 16, width: 'auto' }
    : { position: 'fixed', bottom: isDesktop ? 32 : 24, right: isDesktop ? 32 : 24, width: isDesktop ? 420 : 288 }

  const cardClass = positionTop ? '' : 'max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:bottom-4'

  return (
    <div
      style={{
        ...cardStyle,
        background: '#fff',
        borderRadius: isDesktop ? 24 : 20,
        boxShadow: isDesktop ? '0 20px 60px rgba(234,179,8,0.25)' : '0 20px 60px rgba(0,0,0,0.15)',
        border: isDesktop ? '2px solid #eab308' : '1px solid #f0f0f0',
        padding: isDesktop ? 24 : 16,
        zIndex: 50,
      }}
      className={cardClass}
    >
      {/* Brand header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isDesktop ? 10 : 8,
          marginBottom: isDesktop ? 16 : 12,
          paddingBottom: isDesktop ? 16 : 12,
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        {brandLogo && (
          <img
            src={brandLogo}
            alt={brandName}
            style={{
              width: isDesktop ? 28 : 22,
              height: isDesktop ? 28 : 22,
              borderRadius: 6,
              objectFit: 'contain',
            }}
          />
        )}
        <span style={{ fontSize: isDesktop ? 13 : 11, fontWeight: 600, color: '#9ca3af' }}>{brandName}</span>
        <span style={{ marginLeft: 'auto', fontSize: isDesktop ? 13 : 11, color: '#d1d5db', fontWeight: 500 }}>
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: isDesktop ? 6 : 4, marginBottom: isDesktop ? 18 : 12 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              height: isDesktop ? 4 : 3,
              flex: 1,
              borderRadius: 2,
              background: i <= currentStep ? '#eab308' : '#f3f4f6',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Step info */}
      <p
        style={{
          fontSize: isDesktop ? 18 : 13,
          fontWeight: 700,
          color: '#111827',
          margin: isDesktop ? '0 0 8px' : '0 0 4px',
        }}
      >
        {step.title}
      </p>
      <p
        style={{
          fontSize: isDesktop ? 14 : 11,
          color: '#6b7280',
          lineHeight: 1.55,
          margin: isDesktop ? '0 0 20px' : '0 0 14px',
        }}
      >
        {step.desc}
      </p>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: isDesktop ? 8 : 6 }}>
        {!isFirst && (
          <button
            onClick={onPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: isDesktop ? '13px 18px' : '8px 12px',
              borderRadius: isDesktop ? 12 : 10,
              background: '#f3f4f6',
              color: '#374151',
              fontSize: isDesktop ? 14 : 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={isDesktop ? 16 : 13} />
            Anterior
          </button>
        )}
        <button
          onClick={isLast ? onNext : onNext}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: isDesktop ? '13px 18px' : '8px 12px',
            borderRadius: isDesktop ? 12 : 10,
            background: '#eab308',
            color: '#000',
            fontSize: isDesktop ? 14 : 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isLast ? 'Finalizar' : 'Siguiente'}
          {!isLast && <ChevronRight size={isDesktop ? 16 : 13} />}
        </button>
      </div>
    </div>
  )
}
