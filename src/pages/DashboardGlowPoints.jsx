import { useState } from 'react'
import { Users, Sparkles, Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import DateFilterSelect from '@/components/shared/DateFilterSelect'

const CHART_7D = [
  { date: '30 abr', fullDate: '30 de abril', adds: 5, scans: 420, redemptions: 4 },
  { date: '1 may', fullDate: '1 de mayo', adds: 7, scans: 580, redemptions: 5 },
  { date: '2 may', fullDate: '2 de mayo', adds: 9, scans: 670, redemptions: 7 },
  { date: '3 may', fullDate: '3 de mayo', adds: 6, scans: 510, redemptions: 5 },
  { date: '4 may', fullDate: '4 de mayo', adds: 4, scans: 330, redemptions: 3 },
  { date: '5 may', fullDate: '5 de mayo', adds: 3, scans: 280, redemptions: 2 },
  { date: '6 may', fullDate: '6 de mayo', adds: 6, scans: 480, redemptions: 5 },
]

const CHART_MONTH = [
  { date: '7 abr', fullDate: '7 de abril', adds: 4, scans: 350, redemptions: 3 },
  { date: '10 abr', fullDate: '10 de abril', adds: 6, scans: 490, redemptions: 5 },
  { date: '13 abr', fullDate: '13 de abril', adds: 5, scans: 420, redemptions: 4 },
  { date: '16 abr', fullDate: '16 de abril', adds: 9, scans: 700, redemptions: 7 },
  { date: '19 abr', fullDate: '19 de abril', adds: 4, scans: 310, redemptions: 3 },
  { date: '22 abr', fullDate: '22 de abril', adds: 7, scans: 570, redemptions: 6 },
  { date: '25 abr', fullDate: '25 de abril', adds: 11, scans: 790, redemptions: 9 },
  { date: '28 abr', fullDate: '28 de abril', adds: 6, scans: 460, redemptions: 5 },
  { date: '1 may', fullDate: '1 de mayo', adds: 7, scans: 580, redemptions: 5 },
  { date: '4 may', fullDate: '4 de mayo', adds: 4, scans: 330, redemptions: 3 },
  { date: '6 may', fullDate: '6 de mayo', adds: 6, scans: 480, redemptions: 5 },
]

const METRICS = {
  '7d': { members: 186, points: 3270, rewards: 31 },
  month: { members: 186, points: 12480, rewards: 116 },
}

export default function DashboardGlowPoints() {
  const [dateFilter, setDateFilter] = useState('7d')
  const [customDate, setCustomDate] = useState({
    from: new Date('2026-04-01T00:00:00Z'),
    to: new Date('2026-05-06T00:00:00Z'),
  })

  const chartData = dateFilter === '7d' ? CHART_7D : CHART_MONTH
  const metrics = METRICS[dateFilter] ?? METRICS['7d']

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0">
                ✨
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Glow Estética
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Resumen de tu programa de puntos</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <DateFilterSelect
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customDate={customDate}
            setCustomDate={setCustomDate}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard
            title="Miembros"
            value={metrics.members}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Puntos otorgados"
            value={metrics.points}
            icon={Sparkles}
            gradient="bg-gradient-to-br from-fuchsia-500 to-purple-600"
          />
          <MetricCard
            title="Premios canjeados"
            value={metrics.rewards}
            icon={Gift}
            gradient="bg-gradient-to-br from-pink-500 to-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsChart title="Miembros nuevas" data={chartData} dataKey="adds" color="#3B82F6" />
          <StatsChart title="Puntos otorgados" data={chartData} dataKey="scans" color="#e879f9" />
          <StatsChart title="Premios canjeados" data={chartData} dataKey="redemptions" color="#a855f7" />
        </div>
      </div>
    </div>
  )
}
