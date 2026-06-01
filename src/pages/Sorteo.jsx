import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  ChevronDown,
  Clock,
  CreditCard,
  Crown,
  RefreshCw,
  Store,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const ACCENT = '#facc15'

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: 1, name: 'Valentina Ríos', email: 'vale@email.com', visits: 24, last_visit: '2026-05-28' },
  { id: 2, name: 'Martín Gómez', email: 'martin@email.com', visits: 18, last_visit: '2026-05-27' },
  { id: 3, name: 'Lucía Fernández', email: 'lucia@email.com', visits: 31, last_visit: '2026-05-29' },
  { id: 4, name: 'Diego Martínez', email: 'diego@email.com', visits: 9, last_visit: '2026-05-10' },
  { id: 5, name: 'Camila Torres', email: 'cami@email.com', visits: 27, last_visit: '2026-05-28' },
  { id: 6, name: 'Sebastián López', email: 'seba@email.com', visits: 15, last_visit: '2026-05-22' },
  { id: 7, name: 'Ana García', email: 'ana@email.com', visits: 22, last_visit: '2026-05-29' },
  { id: 8, name: 'Carlos Ruiz', email: 'carlos@email.com', visits: 11, last_visit: '2026-05-15' },
  { id: 9, name: 'Sofía Martínez', email: 'sofi@email.com', visits: 29, last_visit: '2026-05-28' },
  { id: 10, name: 'Lucas Fernández', email: 'lucas@email.com', visits: 17, last_visit: '2026-05-24' },
  { id: 11, name: 'Florencia Pérez', email: 'flor@email.com', visits: 13, last_visit: '2026-05-20' },
  { id: 12, name: 'Tomás Herrera', email: 'tomas@email.com', visits: 6, last_visit: '2026-04-30' },
  { id: 13, name: 'Agustina Leal', email: 'agus@email.com', visits: 21, last_visit: '2026-05-29' },
  { id: 14, name: 'Ramiro Salas', email: 'rami@email.com', visits: 16, last_visit: '2026-05-23' },
  { id: 15, name: 'Paula Vega', email: 'pau@email.com', visits: 33, last_visit: '2026-05-29' },
  { id: 16, name: 'Ignacio Blanco', email: 'nacho@email.com', visits: 8, last_visit: '2026-05-05' },
  { id: 17, name: 'Julieta Morales', email: 'juli@email.com', visits: 19, last_visit: '2026-05-26' },
  { id: 18, name: 'Esteban Quiroga', email: 'este@email.com', visits: 12, last_visit: '2026-05-18' },
  { id: 19, name: 'Renata Sosa', email: 'rena@email.com', visits: 25, last_visit: '2026-05-27' },
  { id: 20, name: 'Nicolás Peralta', email: 'nico@email.com', visits: 20, last_visit: '2026-05-25' },
]

const MOCK_HISTORY = [
  {
    id: 1,
    date: '15 may 2026',
    prize: 'Cena para dos en el local',
    filter: 'Última visita · últimos 30 días',
    participants: 89,
    winners: [{ name: 'Camila Torres', email: 'cami@email.com' }],
  },
  {
    id: 2,
    date: '1 may 2026',
    prize: 'Gift card $10.000',
    filter: 'Todos los miembros · Club Café',
    participants: 214,
    winners: [
      { name: 'Martín Gómez', email: 'martin@email.com' },
      { name: 'Ana García', email: 'ana@email.com' },
    ],
  },
  {
    id: 3,
    date: '15 abr 2026',
    prize: 'Descuento 50% próxima visita',
    filter: 'Última visita · últimos 7 días',
    participants: 41,
    winners: [{ name: 'Valentina Ríos', email: 'vale@email.com' }],
  },
  {
    id: 4,
    date: '1 abr 2026',
    prize: 'Producto estrella gratis',
    filter: 'Miembro desde · enero 2026',
    participants: 132,
    winners: [{ name: 'Sofía Martínez', email: 'sofi@email.com' }],
  },
  {
    id: 5,
    date: '15 mar 2026',
    prize: 'Kit de bienvenida premium',
    filter: 'Todos los miembros',
    participants: 198,
    winners: [
      { name: 'Lucas Fernández', email: 'lucas@email.com' },
      { name: 'Agustina Leal', email: 'agus@email.com' },
      { name: 'Paula Vega', email: 'pau@email.com' },
    ],
  },
]

const AVATAR_COLORS = ['#2563EB', '#0f766e', '#7c3aed', '#db2777', '#d97706', '#059669']
function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ── Winner card ───────────────────────────────────────────────────────────────
function WinnerCard({ winner, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 250, delay: index * 0.12 }}
      className="flex items-center gap-4 p-4 rounded-2xl border-2 bg-white dark:bg-gray-900"
      style={{ borderColor: ACCENT }}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: avatarColor(winner.name) }}
        >
          {initials(winner.name)}
        </div>
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-black"
          style={{ backgroundColor: ACCENT }}
        >
          <Trophy className="w-2.5 h-2.5" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 dark:text-gray-100">{winner.name}</p>
        <p className="text-xs text-gray-400 truncate">{winner.email}</p>
      </div>
      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full text-black flex-shrink-0"
        style={{ backgroundColor: ACCENT }}
      >
        #{index + 1}
      </span>
    </motion.div>
  )
}

// ── History item ──────────────────────────────────────────────────────────────
function HistoryItem({ entry }) {
  return (
    <Card className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">{entry.prize}</p>
          <p className="text-sm text-gray-400 mt-1">{entry.filter}</p>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1 mt-0.5">
          <CalendarDays className="w-3.5 h-3.5" />
          {entry.date}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {entry.winners.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
              style={{ backgroundColor: ACCENT + '18', borderColor: ACCENT + '60' }}
            >
              <Trophy className="w-3.5 h-3.5" style={{ color: ACCENT }} />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{w.name}</span>
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-3">{entry.participants} participantes</span>
      </div>
    </Card>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Sorteo() {
  const [filterType, setFilterType] = useState('last_visit')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [winnerCount, setWinnerCount] = useState(1)
  const [prize, setPrize] = useState('Cena para dos en el local')
  const [status, setStatus] = useState('idle')
  const [winners, setWinners] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [spinLabel, setSpinLabel] = useState('')

  const eligible = MOCK_MEMBERS.filter((m) => {
    if (filterType === 'last_visit') {
      if (!dateFrom && !dateTo) return true
      const d = new Date(m.last_visit)
      if (dateFrom && d < new Date(dateFrom)) return false
      if (dateTo && d > new Date(dateTo)) return false
      return true
    }
    return true
  })
  const eligibleCount = eligible.length

  const handleSorteo = () => {
    if (eligibleCount < winnerCount) return
    setStatus('spinning')
    setWinners([])
    const labels = ['Mezclando participantes…', 'Eligiendo ganadores…', '¡Casi listo!']
    let i = 0
    setSpinLabel(labels[0])
    const lbl = setInterval(() => {
      i++
      if (i < labels.length) setSpinLabel(labels[i])
      else clearInterval(lbl)
    }, 700)
    setTimeout(() => {
      clearInterval(lbl)
      const pool = [...MOCK_MEMBERS].sort(() => Math.random() - 0.5)
      setWinners(pool.slice(0, Math.min(winnerCount, pool.length)))
      setStatus('done')
    }, 2200)
  }

  const handleReset = () => {
    setStatus('idle')
    setWinners([])
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Sorteos</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Realizá sorteos entre tus miembros y premiá su fidelidad</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          {[
            { key: false, label: 'Nuevo sorteo', icon: Ticket },
            { key: true, label: 'Historial', icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={String(key)}
              onClick={() => setHistoryOpen(key)}
              className={`flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all ${
                historyOpen === key
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Main content — toggles between sorteo config and historial */}
        <AnimatePresence mode="wait">
          {!historyOpen && (
            <motion.div
              key="sorteo"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              {/* LEFT — Config */}
              <Card className="p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                {/* Premio */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Premio
                  </label>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="Ej: Cena para dos, Gift card $5.000…"
                    className="w-full h-11 px-4 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 focus:outline-none transition-colors"
                    onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                    onBlur={(e) => (e.target.style.borderColor = '')}
                  />
                </div>

                {/* Participantes */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Participantes
                  </label>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Filtrar por</label>
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full h-10 pl-4 pr-8 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none transition-colors"
                      >
                        <option value="last_visit">Última visita</option>
                        <option value="member_since">Miembro desde</option>
                        <option value="all">Todos los miembros</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {filterType !== 'all' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Desde</label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Hasta</label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 flex items-center gap-1">
                        <Store className="w-3 h-3" /> Sucursal
                      </label>
                      <div className="relative">
                        <select className="w-full h-10 pl-3 pr-8 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none">
                          <option>Todas</option>
                          <option>Sucursal Centro</option>
                          <option>Sucursal Norte</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Programa
                      </label>
                      <div className="relative">
                        <select className="w-full h-10 pl-3 pr-8 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none">
                          <option>Todos</option>
                          <option>Club Café</option>
                          <option>Club Premium</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ganadores */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" /> Cantidad de ganadores
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setWinnerCount(n)}
                        className="w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all"
                        style={
                          winnerCount === n
                            ? { borderColor: ACCENT, backgroundColor: ACCENT, color: '#000' }
                            : { borderColor: '#e5e7eb', color: '#6b7280' }
                        }
                      >
                        {n}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={winnerCount}
                      onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-10 px-2 text-sm text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Elegibles */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Participantes elegibles</span>
                  </div>
                  <span className="text-2xl font-black tabular-nums" style={{ color: ACCENT }}>
                    {eligibleCount}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={handleSorteo}
                  disabled={eligibleCount < winnerCount || eligibleCount === 0 || status !== 'idle'}
                  className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:brightness-105 active:scale-[0.98]"
                  style={{ backgroundColor: ACCENT, color: '#000' }}
                >
                  <Ticket className="w-4 h-4" />
                  Realizar sorteo
                </button>
              </Card>

              {/* RIGHT — Result */}
              <div>
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20 px-6 text-center space-y-3"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: ACCENT + '20' }}
                      >
                        <Ticket className="w-8 h-8" style={{ color: ACCENT }} />
                      </div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400">El resultado aparecerá aquí</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Configurá el sorteo y hacé clic en <strong>Realizar sorteo</strong>
                      </p>
                    </motion.div>
                  )}

                  {status === 'spinning' && (
                    <motion.div
                      key="spinning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 space-y-6"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 rounded-full border-4"
                        style={{ borderColor: ACCENT + '44', borderTopColor: ACCENT }}
                      />
                      <div className="text-center">
                        <motion.p
                          key={spinLabel}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-lg font-semibold text-gray-800 dark:text-gray-200"
                        >
                          {spinLabel}
                        </motion.p>
                        <p className="text-sm text-gray-400 mt-1">{eligibleCount} participantes</p>
                      </div>
                    </motion.div>
                  )}

                  {status === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div className="text-center space-y-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                          style={{ backgroundColor: ACCENT }}
                        >
                          <Trophy className="w-8 h-8 text-black" />
                        </motion.div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white">
                          {winners.length === 1 ? '¡Ganador del sorteo!' : `¡${winners.length} ganadores!`}
                        </h2>
                        {prize && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Premio: <strong>{prize}</strong>
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {eligibleCount} participantes · {new Date().toLocaleDateString('es-AR')}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {winners.map((w, i) => (
                          <WinnerCard key={w.id || i} winner={w} index={i} />
                        ))}
                      </div>
                      <button
                        onClick={handleReset}
                        className="w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" /> Nuevo sorteo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {historyOpen && (
            <motion.div
              key="historial"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_HISTORY.map((entry) => (
                  <HistoryItem key={entry.id} entry={entry} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
