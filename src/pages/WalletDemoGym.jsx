export default function WalletDemoGym() {
  const handleBtn = () => {
    window.parent?.postMessage({ type: 'demo-next' }, '*')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflowY: 'auto',
        paddingBottom: 160,
      }}
    >
      <div style={{ padding: '28px 20px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🏋️
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>Iron Club</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>Programa de fidelización</p>
          </div>
        </div>

        {/* Level badge */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              boxShadow: '0 0 48px rgba(99,102,241,0.45)',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 44 }}>⚡</span>
          </div>
          <p
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 11,
              margin: '0 0 4px',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            Nivel actual
          </p>
          <p style={{ color: '#fff', fontSize: 36, fontWeight: 900, margin: '0 0 4px' }}>PRO</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>Carlos Martínez</p>
        </div>

        {/* XP progress */}
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ color: '#a5b4fc', fontSize: 14, fontWeight: 700, margin: 0 }}>⚡ 340 XP</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Elite: 500 XP</p>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: '68%',
                background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                borderRadius: 4,
              }}
            />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '6px 0 0' }}>
            160 XP más para subir a Elite
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {[
            { emoji: '🔥', value: '5', label: 'semanas racha' },
            { emoji: '🏋️', value: '34', label: 'visitas totales' },
            { emoji: '🏆', value: '2', label: 'premios ganados' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '14px 8px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 22, margin: '0 0 4px' }}>{s.emoji}</p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 2px' }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly challenge */}
        <div
          style={{
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ color: '#fb923c', fontSize: 13, fontWeight: 700, margin: 0 }}>🎯 Desafío Mayo</p>
            <p style={{ color: '#fb923c', fontSize: 13, fontWeight: 600, margin: 0 }}>8 / 12 visitas</p>
          </div>
          <div style={{ height: 7, background: 'rgba(249,115,22,0.15)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '67%', background: '#f97316', borderRadius: 4 }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '6px 0 0' }}>
            ¡4 visitas más y ganás una remera Iron Club!
          </p>
        </div>

        {/* Next reward */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 30 }}>🎁</span>
          <div>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 3px' }}>Próximo premio</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
              Shake de proteína gratis · 50 visitas (16 más)
            </p>
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
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          border: '2px solid #f97316',
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#f97316' }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Tu tarjeta de atleta</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
          El alumno guarda su tarjeta en el wallet y ve su nivel, XP acumulado y racha de asistencia.
        </p>
        <button
          onClick={handleBtn}
          style={{
            width: '100%',
            padding: '10px 0',
            background: '#f97316',
            color: '#fff',
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
    </div>
  )
}
