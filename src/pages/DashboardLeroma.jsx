import { useState } from 'react'
import { CreditCard, Users, QrCode, Gift, Percent } from 'lucide-react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import DateFilterSelect from '@/components/shared/DateFilterSelect'

// ─── Static mock data ─────────────────────────────────────────────────────────
const CHART_7D = [
  { date: '30 abr', fullDate: '30 de abril', adds: 6, scans: 95, redemptions: 8 },
  { date: '1 may', fullDate: '1 de mayo', adds: 9, scans: 125, redemptions: 10 },
  { date: '2 may', fullDate: '2 de mayo', adds: 11, scans: 140, redemptions: 12 },
  { date: '3 may', fullDate: '3 de mayo', adds: 8, scans: 130, redemptions: 11 },
  { date: '4 may', fullDate: '4 de mayo', adds: 5, scans: 80, redemptions: 7 },
  { date: '5 may', fullDate: '5 de mayo', adds: 4, scans: 72, redemptions: 6 },
  { date: '6 may', fullDate: '6 de mayo', adds: 7, scans: 105, redemptions: 7 },
]

const CHART_MONTH = [
  { date: '7 abr', fullDate: '7 de abril', adds: 5, scans: 78, redemptions: 6 },
  { date: '9 abr', fullDate: '9 de abril', adds: 8, scans: 102, redemptions: 9 },
  { date: '11 abr', fullDate: '11 de abril', adds: 6, scans: 91, redemptions: 7 },
  { date: '14 abr', fullDate: '14 de abril', adds: 12, scans: 145, redemptions: 13 },
  { date: '16 abr', fullDate: '16 de abril', adds: 4, scans: 67, redemptions: 5 },
  { date: '18 abr', fullDate: '18 de abril', adds: 9, scans: 118, redemptions: 10 },
  { date: '21 abr', fullDate: '21 de abril', adds: 14, scans: 162, redemptions: 14 },
  { date: '23 abr', fullDate: '23 de abril', adds: 7, scans: 99, redemptions: 8 },
  { date: '25 abr', fullDate: '25 de abril', adds: 10, scans: 133, redemptions: 11 },
  { date: '28 abr', fullDate: '28 de abril', adds: 11, scans: 141, redemptions: 12 },
  { date: '30 abr', fullDate: '30 de abril', adds: 6, scans: 95, redemptions: 8 },
  { date: '2 may', fullDate: '2 de mayo', adds: 11, scans: 140, redemptions: 12 },
  { date: '4 may', fullDate: '4 de mayo', adds: 5, scans: 80, redemptions: 7 },
  { date: '6 may', fullDate: '6 de mayo', adds: 7, scans: 105, redemptions: 7 },
]

const METRICS = {
  '7d': { members: 342, programs: 1, scans: 747, rewards: 61, rate: 26 },
  month: { members: 342, programs: 1, scans: 3140, rewards: 247, rate: 28 },
}

export default function DashboardLeroma() {
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
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img
                src="/leroma-logo.jpg"
                alt="Leroma Gelato"
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-contain flex-shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Leroma Gelato
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Resumen de tu programa de fidelización</p>
          </div>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <DateFilterSelect
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customDate={customDate}
            setCustomDate={setCustomDate}
          />
        </motion.div>

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <MetricCard
            title="Miembros"
            value={metrics.members}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Clubs Activos"
            value={metrics.programs}
            icon={CreditCard}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <MetricCard
            title="Puntos otorgados"
            value={metrics.scans}
            icon={QrCode}
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <MetricCard
            title="Premios canjeados"
            value={metrics.rewards}
            icon={Gift}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <MetricCard
            title="Tasa de canje"
            value={metrics.rate}
            icon={Percent}
            gradient="bg-gradient-to-br from-pink-500 to-rose-500"
            suffix="%"
          />
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StatsChart title="Miembros nuevos" data={chartData} dataKey="adds" color="#3B82F6" />
          <StatsChart title="Puntos otorgados" data={chartData} dataKey="scans" color="#F59E0B" />
          <StatsChart title="Premios canjeados" data={chartData} dataKey="redemptions" color="#8B5CF6" />
        </div>
      </div>
    </div>
  )
}
