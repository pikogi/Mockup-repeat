import { useState } from 'react'
import { Users, QrCode, Gift, CreditCard, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import DateFilterSelect from '@/components/shared/DateFilterSelect'

const CHART_7D = [
  {
    date: '16 jul',
    adds: 0,
    scans: 1,
    points: 0,
    redemptions: 0,
    prevAdds: 1,
    prevScans: 2,
    prevPoints: 1,
    prevRedemptions: 0,
  },
  {
    date: '17 jul',
    adds: 1,
    scans: 0,
    points: 1,
    redemptions: 0,
    prevAdds: 0,
    prevScans: 1,
    prevPoints: 2,
    prevRedemptions: 0,
  },
  {
    date: '18 jul',
    adds: 0,
    scans: 2,
    points: 0,
    redemptions: 1,
    prevAdds: 2,
    prevScans: 3,
    prevPoints: 0,
    prevRedemptions: 1,
  },
  {
    date: '19 jul',
    adds: 0,
    scans: 1,
    points: 1,
    redemptions: 0,
    prevAdds: 1,
    prevScans: 4,
    prevPoints: 1,
    prevRedemptions: 0,
  },
  {
    date: '20 jul',
    adds: 1,
    scans: 0,
    points: 0,
    redemptions: 0,
    prevAdds: 0,
    prevScans: 2,
    prevPoints: 3,
    prevRedemptions: 1,
  },
  {
    date: '21 jul',
    adds: 0,
    scans: 1,
    points: 2,
    redemptions: 0,
    prevAdds: 1,
    prevScans: 1,
    prevPoints: 1,
    prevRedemptions: 0,
  },
  {
    date: '22 jul',
    adds: 0,
    scans: 0,
    points: 0,
    redemptions: 0,
    prevAdds: 0,
    prevScans: 3,
    prevPoints: 2,
    prevRedemptions: 0,
  },
  {
    date: '23 jul',
    adds: 0,
    scans: 0,
    points: 1,
    redemptions: 0,
    prevAdds: 2,
    prevScans: 2,
    prevPoints: 0,
    prevRedemptions: 1,
  },
]

const CHART_MONTH = [
  {
    date: '7 abr',
    adds: 3,
    scans: 31,
    points: 12,
    redemptions: 2,
    prevAdds: 2,
    prevScans: 24,
    prevPoints: 8,
    prevRedemptions: 1,
  },
  {
    date: '10 abr',
    adds: 5,
    scans: 44,
    points: 18,
    redemptions: 4,
    prevAdds: 4,
    prevScans: 38,
    prevPoints: 14,
    prevRedemptions: 3,
  },
  {
    date: '13 abr',
    adds: 4,
    scans: 38,
    points: 15,
    redemptions: 3,
    prevAdds: 3,
    prevScans: 29,
    prevPoints: 10,
    prevRedemptions: 2,
  },
  {
    date: '16 abr',
    adds: 8,
    scans: 63,
    points: 27,
    redemptions: 6,
    prevAdds: 5,
    prevScans: 51,
    prevPoints: 20,
    prevRedemptions: 4,
  },
  {
    date: '19 abr',
    adds: 3,
    scans: 27,
    points: 11,
    redemptions: 2,
    prevAdds: 2,
    prevScans: 22,
    prevPoints: 9,
    prevRedemptions: 1,
  },
  {
    date: '22 abr',
    adds: 6,
    scans: 51,
    points: 21,
    redemptions: 5,
    prevAdds: 4,
    prevScans: 43,
    prevPoints: 17,
    prevRedemptions: 3,
  },
  {
    date: '25 abr',
    adds: 9,
    scans: 72,
    points: 31,
    redemptions: 7,
    prevAdds: 6,
    prevScans: 58,
    prevPoints: 24,
    prevRedemptions: 5,
  },
  {
    date: '28 abr',
    adds: 5,
    scans: 42,
    points: 17,
    redemptions: 4,
    prevAdds: 3,
    prevScans: 35,
    prevPoints: 13,
    prevRedemptions: 2,
  },
  {
    date: '1 may',
    adds: 6,
    scans: 52,
    points: 22,
    redemptions: 4,
    prevAdds: 4,
    prevScans: 44,
    prevPoints: 18,
    prevRedemptions: 3,
  },
  {
    date: '4 may',
    adds: 3,
    scans: 29,
    points: 12,
    redemptions: 2,
    prevAdds: 2,
    prevScans: 23,
    prevPoints: 9,
    prevRedemptions: 1,
  },
  {
    date: '6 may',
    adds: 5,
    scans: 43,
    points: 18,
    redemptions: 3,
    prevAdds: 3,
    prevScans: 36,
    prevPoints: 14,
    prevRedemptions: 2,
  },
]

const METRICS = {
  '7d': { members: 148, scans: 294, rewards: 24 },
  month: { members: 148, scans: 1120, rewards: 89 },
}

const TRANSACTION_TABS = [
  { key: 'scans', label: 'Sellos', color: '#F59E0B', prevKey: 'prevScans' },
  { key: 'points', label: 'Puntos', color: '#8B5CF6', prevKey: 'prevPoints' },
  { key: 'redemptions', label: 'Premios', color: '#10B981', prevKey: 'prevRedemptions' },
]

const TOP_CLIENTS = [
  { name: 'Cande', email: 'cande@repeat.la', visits: 20 },
  { name: 'Cande', email: 'cande@repeat.com', visits: 10 },
  { name: 'Gianni Claudio', email: 'giaoliva1@gmail.com', visits: 9 },
  { name: 'Che', email: 'gh@gmaol.com', visits: 9 },
  { name: 'Cande', email: 'candelariascarafia@gmail.com', visits: 7 },
]

const RANK_BADGES = ['🥇', '🥈', '🥉']

function TopClientes({ clients, onVerMas }) {
  const max = clients[0]?.visits ?? 1
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Top clientes</h3>
        <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
          {clients.length}
        </span>
      </div>

      <div className="space-y-5">
        {clients.map((client, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Rank */}
            <div className="w-6 text-center flex-shrink-0">
              {i < 3 ? (
                <span className="text-base leading-none">{RANK_BADGES[i]}</span>
              ) : (
                <span className="text-sm font-semibold text-gray-400">{i + 1}</span>
              )}
            </div>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                {client.name[0].toUpperCase()}
              </span>
            </div>
            {/* Info + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{client.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-3 flex-shrink-0">{client.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${(client.visits / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                  {client.visits} visitas
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onVerMas}
        className="mt-6 w-full text-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
      >
        Ver más →
      </button>
    </motion.div>
  )
}

export default function DashboardMoonCafe() {
  const navigate = useNavigate()
  const [dateFilter, setDateFilter] = useState('7d')
  const [customDate, setCustomDate] = useState({
    from: new Date('2026-04-01T00:00:00Z'),
    to: new Date('2026-05-06T00:00:00Z'),
  })
  const [txTab, setTxTab] = useState('scans')

  const chartData = dateFilter === '7d' ? CHART_7D : CHART_MONTH
  const metrics = METRICS[dateFilter] ?? METRICS['7d']

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img
                src="/moon-cafe-logo.png"
                alt="café moon"
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-contain flex-shrink-0 bg-[#f5f0e8]"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Café Moon
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Resumen de tu programa de fidelización</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <DateFilterSelect
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customDate={customDate}
            setCustomDate={setCustomDate}
          />
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Miembros"
            value={metrics.members}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Club activo"
            value={1}
            icon={CreditCard}
            gradient="bg-gradient-to-br from-teal-500 to-emerald-600"
          />
          <MetricCard
            title="Sellos"
            value={metrics.scans}
            icon={QrCode}
            gradient="bg-gradient-to-br from-amber-400 to-amber-500"
          />
          <MetricCard
            title="Premios"
            value={metrics.rewards}
            icon={Gift}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StatsChart
            title="Transacciones en el tiempo"
            data={chartData}
            tabs={TRANSACTION_TABS}
            activeTab={txTab}
            onTabChange={setTxTab}
          />
          <StatsChart
            title="Miembros en el tiempo"
            data={chartData}
            dataKey="adds"
            prevDataKey="prevAdds"
            color="#3B82F6"
          />
        </div>

        {/* Top clientes */}
        <TopClientes clients={TOP_CLIENTS} onVerMas={() => navigate('/customers/mooncafe-demo')} />
      </div>
    </div>
  )
}
