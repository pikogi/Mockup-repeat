import { useState } from 'react'

const ACCENT = '#f97316'

const TABS = [
  { id: 'progreso', label: 'Mi Progreso' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'premios', label: 'Premios' },
  { id: 'niveles', label: 'Niveles' },
]

const LEADERBOARD = [
  { pos: 1, name: 'Marcos Ríos', level: 'Beast', xp: 1240, color: '#ea580c', bg: '#fff7ed', isMe: false },
  { pos: 2, name: 'Fernanda López', level: 'Elite', xp: 980, color: '#9333ea', bg: '#faf5ff', isMe: false },
  { pos: 3, name: 'Sebastián M.', level: 'Elite', xp: 820, color: '#9333ea', bg: '#faf5ff', isMe: false },
  { pos: 4, name: 'Valentina Cruz', level: 'Elite', xp: 520, color: '#9333ea', bg: '#faf5ff', isMe: false },
  { pos: 5, name: 'Carlos Martínez', level: 'Pro', xp: 340, color: '#2563eb', bg: '#eff6ff', isMe: true },
  { pos: 6, name: 'Tomás Navarro', level: 'Pro', xp: 280, color: '#2563eb', bg: '#eff6ff', isMe: false },
  { pos: 7, name: 'Lucía Herrera', level: 'Amateur', xp: 180, color: '#16a34a', bg: '#f0fdf4', isMe: false },
  { pos: 8, name: 'Camila Ortiz', level: 'Amateur', xp: 110, color: '#16a34a', bg: '#f0fdf4', isMe: false },
]

const REWARDS = [
  {
    id: 1,
    icon: '🥤',
    name: 'Shake de proteína',
    desc: 'Un shake gratis en tu próxima visita',
    type: 'visitas',
    required: 50,
    current: 34,
    unlocked: false,
  },
  {
    id: 2,
    icon: '👕',
    name: 'Remera Iron Club',
    desc: 'Completá el desafío mensual de mayo',
    type: 'desafio',
    required: 12,
    current: 8,
    unlocked: false,
  },
  {
    id: 3,
    icon: '🏋️',
    name: 'Sesión de Personal Training',
    desc: '1 sesión gratuita con un entrenador',
    type: 'visitas',
    required: 75,
    current: 34,
    unlocked: false,
  },
  {
    id: 4,
    icon: '📦',
    name: 'Suplemento a elección',
    desc: 'Un suplemento del local (hasta $8.000)',
    type: 'visitas',
    required: 100,
    current: 34,
    unlocked: false,
  },
  {
    id: 5,
    icon: '🎁',
    name: 'Mes gratis',
    desc: '30 días de membresía sin costo',
    type: 'visitas',
    required: 150,
    current: 34,
    unlocked: false,
  },
  {
    id: 6,
    icon: '✅',
    name: 'Botella Iron Club',
    desc: 'Premio por tus primeras 10 visitas',
    type: 'visitas',
    required: 10,
    current: 34,
    unlocked: true,
    claimedAt: 'Feb 2026',
  },
]

const LEVELS_DATA = [
  {
    name: 'Rookie',
    emoji: '🌱',
    xpMin: 0,
    xpMax: 99,
    color: '#9ca3af',
    bg: 'rgba(156,163,175,0.12)',
    border: 'rgba(156,163,175,0.25)',
    done: true,
    current: false,
    perks: ['Acceso al programa de fidelización', 'Acumulás XP por cada visita'],
  },
  {
    name: 'Amateur',
    emoji: '💪',
    xpMin: 100,
    xpMax: 249,
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.1)',
    border: 'rgba(22,163,74,0.25)',
    done: true,
    current: false,
    perks: ['5% de descuento en suplementos', 'Acceso a clases grupales premium'],
  },
  {
    name: 'Pro',
    emoji: '⚡',
    xpMin: 250,
    xpMax: 499,
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.3)',
    done: false,
    current: true,
    perks: ['10% de descuento en suplementos', 'Acceso a clases especiales', 'Prioridad en reservas'],
  },
  {
    name: 'Elite',
    emoji: '🔥',
    xpMin: 500,
    xpMax: 999,
    color: '#9333ea',
    bg: 'rgba(147,51,234,0.08)',
    border: 'rgba(147,51,234,0.2)',
    done: false,
    current: false,
    perks: ['15% de descuento en suplementos', '1 sesión de PT por mes', 'Invitá un amigo gratis 1 vez/mes'],
  },
  {
    name: 'Beast',
    emoji: '👑',
    xpMin: 1000,
    xpMax: null,
    color: '#ea580c',
    bg: 'rgba(234,88,12,0.08)',
    border: 'rgba(234,88,12,0.2)',
    done: false,
    current: false,
    perks: [
      '20% de descuento en todo',
      'Acceso VIP ilimitado',
      'Merchandise exclusivo',
      'Nombre en el ranking de honor',
    ],
  },
]

function TabProgreso() {
  return (
    <div style={{ padding: '20px 16px 0' }}>
      {/* Level badge */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 40 }}>⚡</span>
        </div>
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 10,
            margin: '0 0 3px',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Nivel actual
        </p>
        <p style={{ color: '#fff', fontSize: 32, fontWeight: 900, margin: '0 0 3px' }}>PRO</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Carlos Martínez · Puesto #5</p>
      </div>

      {/* XP progress */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <p style={{ color: '#a5b4fc', fontSize: 14, fontWeight: 700, margin: 0 }}>⚡ 340 XP</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>Elite: 500 XP</p>
        </div>
        <div style={{ height: 7, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: '68%',
              background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
              borderRadius: 4,
            }}
          />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '5px 0 0' }}>160 XP más para subir a Elite</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[
          { emoji: '🔥', value: '5', label: 'sem racha' },
          { emoji: '🏋️', value: '34', label: 'visitas' },
          { emoji: '🏆', value: '2', label: 'premios' },
          { emoji: '📅', value: '#5', label: 'ranking' },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '12px 4px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 18, margin: '0 0 3px' }}>{s.emoji}</p>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 800, margin: '0 0 1px' }}>{s.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly challenge */}
      <div
        style={{
          background: 'rgba(249,115,22,0.1)',
          border: '1px solid rgba(249,115,22,0.3)',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <p style={{ color: '#fb923c', fontSize: 13, fontWeight: 700, margin: 0 }}>🎯 Desafío Mayo</p>
          <p style={{ color: '#fb923c', fontSize: 12, fontWeight: 600, margin: 0 }}>8/12 visitas</p>
        </div>
        <div style={{ height: 6, background: 'rgba(249,115,22,0.15)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '67%', background: '#f97316', borderRadius: 3 }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '5px 0 0' }}>
          ¡4 visitas más y ganás una Remera Iron Club!
        </p>
      </div>

      {/* Next reward */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26 }}>🥤</span>
        <div>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>
            Próximo premio: Shake de proteína
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>50 visitas · te faltan 16</p>
        </div>
      </div>
    </div>
  )
}

function TabRanking() {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <div style={{ padding: '20px 16px 0' }}>
      <p
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 11,
          margin: '0 0 16px',
          textAlign: 'center',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Top alumnos · Mayo 2026
      </p>

      {/* Podium top 3 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((m, i) => {
          const heights = [80, 100, 64]
          const sizes = [40, 48, 36]
          return (
            <div
              key={m.pos}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {m.name.split(' ')[0]}
              </p>
              <div
                style={{
                  width: sizes[i],
                  height: sizes[i],
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: sizes[i] * 0.45,
                  border: `2px solid ${m.color}`,
                }}
              >
                {m.name[0]}
              </div>
              <div
                style={{
                  width: '100%',
                  background: `${m.color}22`,
                  border: `1px solid ${m.color}44`,
                  borderRadius: '8px 8px 0 0',
                  height: heights[i],
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 8,
                }}
              >
                <span style={{ fontSize: 20 }}>{medals[i === 0 ? 1 : i === 1 ? 0 : 2]}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LEADERBOARD.map((m) => (
          <div
            key={m.pos}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 12,
              background: m.isMe ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
              border: m.isMe ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                color: m.pos <= 3 ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                fontWeight: 700,
                fontSize: 13,
                width: 20,
                textAlign: 'center',
              }}
            >
              {m.pos <= 3 ? medals[m.pos - 1] : `#${m.pos}`}
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {m.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  color: m.isMe ? '#fb923c' : '#fff',
                  fontSize: 13,
                  fontWeight: m.isMe ? 700 : 500,
                  margin: 0,
                  truncate: true,
                }}
              >
                {m.name} {m.isMe && '(vos)'}
              </p>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: m.color,
                  background: m.bg,
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                {m.level}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: 0, flexShrink: 0 }}>
              ⚡ {m.xp.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabPremios() {
  return (
    <div style={{ padding: '20px 16px 0' }}>
      <p
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 11,
          margin: '0 0 16px',
          textAlign: 'center',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Catálogo de premios
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {REWARDS.map((r) => {
          const pct =
            r.type === 'visitas' ? Math.min(100, (r.current / r.required) * 100) : Math.min(100, (8 / r.required) * 100)
          return (
            <div
              key={r.id}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: r.unlocked ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                border: r.unlocked ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: r.unlocked ? 0 : 10 }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{ color: r.unlocked ? '#4ade80' : '#fff', fontSize: 13, fontWeight: 700, margin: 0 }}>
                      {r.name}
                    </p>
                    {r.unlocked && (
                      <span
                        style={{
                          fontSize: 10,
                          color: '#4ade80',
                          background: 'rgba(34,197,94,0.15)',
                          padding: '1px 6px',
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        ✓ Canjeado
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>{r.desc}</p>
                  {r.unlocked && r.claimedAt && (
                    <p style={{ color: 'rgba(34,197,94,0.6)', fontSize: 10, margin: '3px 0 0' }}>{r.claimedAt}</p>
                  )}
                </div>
                {!r.unlocked && (
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.35)',
                      fontSize: 11,
                      margin: 0,
                      flexShrink: 0,
                      textAlign: 'right',
                    }}
                  >
                    {r.type === 'visitas' ? `${r.current}/${r.required}` : `8/${r.required}`}
                    <br />
                    <span style={{ fontSize: 9 }}>{r.type === 'visitas' ? 'visitas' : 'visitas/mes'}</span>
                  </p>
                )}
              </div>
              {!r.unlocked && (
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: pct >= 100 ? '#22c55e' : ACCENT,
                      borderRadius: 3,
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TabNiveles() {
  return (
    <div style={{ padding: '20px 16px 0' }}>
      <p
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 11,
          margin: '0 0 16px',
          textAlign: 'center',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Sistema de niveles
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEVELS_DATA.map((lvl) => (
          <div
            key={lvl.name}
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: lvl.current ? lvl.bg : lvl.done ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${lvl.current ? lvl.border : lvl.done ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: lvl.current ? lvl.bg : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${lvl.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {lvl.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p
                    style={{
                      color: lvl.current ? lvl.color : lvl.done ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontSize: 15,
                      fontWeight: 800,
                      margin: 0,
                    }}
                  >
                    {lvl.name}
                  </p>
                  {lvl.current && (
                    <span
                      style={{
                        fontSize: 10,
                        color: lvl.color,
                        background: lvl.bg,
                        border: `1px solid ${lvl.border}`,
                        padding: '1px 7px',
                        borderRadius: 4,
                        fontWeight: 700,
                      }}
                    >
                      Tu nivel
                    </span>
                  )}
                  {lvl.done && !lvl.current && (
                    <span
                      style={{
                        fontSize: 10,
                        color: '#4ade80',
                        background: 'rgba(34,197,94,0.1)',
                        padding: '1px 7px',
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Superado
                    </span>
                  )}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>
                  {lvl.xpMax ? `${lvl.xpMin} – ${lvl.xpMax} XP` : `${lvl.xpMin}+ XP`}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {lvl.perks.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span
                    style={{
                      color: lvl.current ? lvl.color : lvl.done ? '#4ade80' : 'rgba(255,255,255,0.2)',
                      fontSize: 11,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {lvl.done || lvl.current ? '✓' : '○'}
                  </span>
                  <p
                    style={{
                      color: lvl.current
                        ? 'rgba(255,255,255,0.8)'
                        : lvl.done
                          ? 'rgba(255,255,255,0.5)'
                          : 'rgba(255,255,255,0.2)',
                      fontSize: 11,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WalletDemoGym() {
  const [activeTab, setActiveTab] = useState('progreso')

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
        paddingBottom: 180,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 16px 0' }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          🏋️
        </div>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>Iron Club</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: 0 }}>Programa de fidelización</p>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '16px 16px 0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: activeTab === t.id ? ACCENT : 'rgba(255,255,255,0.08)',
              color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'progreso' && <TabProgreso />}
      {activeTab === 'ranking' && <TabRanking />}
      {activeTab === 'premios' && <TabPremios />}
      {activeTab === 'niveles' && <TabNiveles />}

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
          border: `2px solid ${ACCENT}`,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: ACCENT }} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Tarjeta del atleta</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
          El alumno ve su progreso, el ranking, sus premios y los beneficios por nivel. Explorá las pestañas.
        </p>
        <button
          onClick={handleBtn}
          style={{
            width: '100%',
            padding: '10px 0',
            background: ACCENT,
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
