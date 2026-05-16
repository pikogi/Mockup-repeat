import { useState } from 'react'
import { Users, TrendingUp, Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import DateFilterSelect from '@/components/shared/DateFilterSelect'

const CHART_7D = [
  { date: '10 may', fullDate: '10 de mayo', adds: 8, scans: 112, redemptions: 2 },
  { date: '11 may', fullDate: '11 de mayo', adds: 5, scans: 98, redemptions: 1 },
  { date: '12 may', fullDate: '12 de mayo', adds: 12, scans: 187, redemptions: 3 },
  { date: '13 may', fullDate: '13 de mayo', adds: 7, scans: 143, redemptions: 2 },
  { date: '14 may', fullDate: '14 de mayo', adds: 6, scans: 165, redemptions: 4 },
  { date: '15 may', fullDate: '15 de mayo', adds: 9, scans: 201, redemptions: 3 },
  { date: '16 may', fullDate: '16 de mayo', adds: 11, scans: 234, redemptions: 5 },
]

const CHART_MONTH = [
  { date: '16 abr', fullDate: '16 de abril', adds: 14, scans: 198, redemptions: 4 },
  { date: '19 abr', fullDate: '19 de abril', adds: 9, scans: 154, redemptions: 2 },
  { date: '22 abr', fullDate: '22 de abril', adds: 11, scans: 176, redemptions: 3 },
  { date: '25 abr', fullDate: '25 de abril', adds: 18, scans: 241, redemptions: 6 },
  { date: '28 abr', fullDate: '28 de abril', adds: 7, scans: 132, redemptions: 2 },
  { date: '1 may', fullDate: '1 de mayo', adds: 13, scans: 209, redemptions: 4 },
  { date: '4 may', fullDate: '4 de mayo', adds: 8, scans: 167, redemptions: 3 },
  { date: '7 may', fullDate: '7 de mayo', adds: 10, scans: 188, redemptions: 3 },
  { date: '10 may', fullDate: '10 de mayo', adds: 8, scans: 112, redemptions: 2 },
  { date: '13 may', fullDate: '13 de mayo', adds: 7, scans: 143, redemptions: 2 },
  { date: '16 may', fullDate: '16 de mayo', adds: 11, scans: 234, redemptions: 5 },
]

const METRICS = {
  '7d': { members: 700, checkins: 1140, rewards: 20 },
  month: { members: 700, checkins: 4320, rewards: 78 },
}

const LEVELS = [
  { name: 'Beast', color: '#f97316', count: 18, pct: 3 },
  { name: 'Elite', color: '#a855f7', count: 67, pct: 10 },
  { name: 'Pro', color: '#3b82f6', count: 168, pct: 24 },
  { name: 'Amateur', color: '#22c55e', count: 245, pct: 35 },
  { name: 'Rookie', color: '#9ca3af', count: 202, pct: 29 },
]

export default function DashboardGym() {
  const [dateFilter, setDateFilter] = useState('7d')
  const [customDate, setCustomDate] = useState({
    from: new Date('2026-04-01T00:00:00Z'),
    to: new Date('2026-05-16T00:00:00Z'),
  })

  const chartData = dateFilter === '7d' ? CHART_7D : CHART_MONTH
  const metrics = METRICS[dateFilter] ?? METRICS['7d']

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl flex-shrink-0">
                🏋️
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Iron Club
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Resumen de tu programa de fidelización gamificado
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard
            title="Miembros"
            value={metrics.members}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Check-ins"
            value={metrics.checkins}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
          />
          <MetricCard
            title="Premios canjeados"
            value={metrics.rewards}
            icon={Gift}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts + Level distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsChart title="Miembros nuevos" data={chartData} dataKey="adds" color="#3B82F6" />
          <StatsChart title="Check-ins por día" data={chartData} dataKey="scans" color="#F97316" />
          <StatsChart title="Premios canjeados" data={chartData} dataKey="redemptions" color="#A855F7" />

          {/* Level distribution card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Distribución de niveles</h3>
            <div className="space-y-3">
              {LEVELS.map((lvl) => (
                <div key={lvl.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: lvl.color }} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{lvl.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {lvl.count} ({lvl.pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${lvl.pct}%`, background: lvl.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
