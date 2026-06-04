import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DemoGuideCard({ steps, currentStep, onPrev, onNext, brandName, brandLogo, done, onRestart }) {
  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  if (done) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 288,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid #f0f0f0',
          padding: 20,
          zIndex: 50,
        }}
        className="max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:bottom-4"
      >
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
          <p style={{ fontWeight: 800, fontSize: 15, color: '#111827', margin: '0 0 6px' }}>¡Demo completada!</p>
          <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, margin: '0 0 16px' }}>
            Así de simple es Repeat. ¿Querés probarlo en tu negocio?
          </p>
          <button
            onClick={onRestart}
            style={{
              width: '100%',
              padding: '10px 0',
              background: '#f3f4f6',
              color: '#374151',
              fontWeight: 600,
              fontSize: 13,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Ver demo otra vez
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 288,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid #f0f0f0',
        padding: 16,
        zIndex: 50,
      }}
      className="max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:bottom-4"
    >
      {/* Brand header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
          paddingBottom: 12,
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        {brandLogo && (
          <img
            src={brandLogo}
            alt={brandName}
            style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'contain' }}
          />
        )}
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>{brandName}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#d1d5db', fontWeight: 500 }}>
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 2,
              background: i <= currentStep ? '#eab308' : '#f3f4f6',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Step info */}
      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{step.title}</p>
      <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.55, margin: '0 0 14px' }}>{step.desc}</p>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 6 }}>
        {!isFirst && (
          <button
            onClick={onPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '8px 12px',
              borderRadius: 10,
              background: '#f3f4f6',
              color: '#374151',
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={13} />
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
            padding: '8px 12px',
            borderRadius: 10,
            background: '#eab308',
            color: '#000',
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isLast ? 'Finalizar' : 'Siguiente'}
          {!isLast && <ChevronRight size={13} />}
        </button>
      </div>
    </div>
  )
}
