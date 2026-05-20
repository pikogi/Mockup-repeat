import { useState } from 'react'
import { Gift, Store, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import DateFilterSelect from '@/components/shared/DateFilterSelect'

const CHART_7D = [
  { date: '10 may', fullDate: '10 de mayo', adds: 3, scans: 14, redemptions: 5 },
  { date: '11 may', fullDate: '11 de mayo', adds: 2, scans: 11, redemptions: 3 },
  { date: '12 may', fullDate: '12 de mayo', adds: 4, scans: 18, redemptions: 7 },
  { date: '13 may', fullDate: '13 de mayo', adds: 1, scans: 9, redemptions: 4 },
  { date: '14 may', fullDate: '14 de mayo', adds: 5, scans: 16, redemptions: 6 },
  { date: '15 may', fullDate: '15 de mayo', adds: 3, scans: 13, redemptions: 8 },
  { date: '16 may', fullDate: '16 de mayo', adds: 6, scans: 21, redemptions: 9 },
]

const CHART_MONTH = [
  { date: '16 abr', fullDate: '16 de abril', adds: 5, scans: 22, redemptions: 8 },
  { date: '19 abr', fullDate: '19 de abril', adds: 3, scans: 17, redemptions: 6 },
  { date: '22 abr', fullDate: '22 de abril', adds: 4, scans: 19, redemptions: 7 },
  { date: '25 abr', fullDate: '25 de abril', adds: 7, scans: 28, redemptions: 11 },
  { date: '28 abr', fullDate: '28 de abril', adds: 2, scans: 14, redemptions: 5 },
  { date: '1 may', fullDate: '1 de mayo', adds: 5, scans: 23, redemptions: 9 },
  { date: '4 may', fullDate: '4 de mayo', adds: 3, scans: 18, redemptions: 7 },
  { date: '7 may', fullDate: '7 de mayo', adds: 4, scans: 21, redemptions: 8 },
  { date: '10 may', fullDate: '10 de mayo', adds: 3, scans: 14, redemptions: 5 },
  { date: '13 may', fullDate: '13 de mayo', adds: 1, scans: 9, redemptions: 4 },
  { date: '16 may', fullDate: '16 de mayo', adds: 6, scans: 21, redemptions: 9 },
]

const METRICS = {
  '7d': { members: 342, visits: 102, redemptions: 42 },
  month: { members: 342, visits: 391, redemptions: 89 },
}

const TIERS = [
  { name: 'Black', color: '#111827', count: 24, pct: 7 },
  { name: 'VIP', color: '#f59e0b', count: 98, pct: 29 },
  { name: 'Regular', color: '#78716c', count: 220, pct: 64 },
]

const PARTNERS = [
  {
    id: 1,
    name: 'Restaurante La Rueda',
    category: 'Gastronomía',
    discount: '20% off',
    uses: 34,
    color: '#ef4444',
    emoji: '🍽️',
  },
  {
    id: 2,
    name: 'Indumentaria Urbana',
    category: 'Moda',
    discount: '15% off',
    uses: 28,
    color: '#8b5cf6',
    emoji: '👕',
  },
  {
    id: 3,
    name: 'El Grano Café',
    category: 'Café & Desayunos',
    discount: 'Café gratis',
    uses: 19,
    color: '#d97706',
    emoji: '☕',
  },
  {
    id: 4,
    name: 'Centro de Masajes Relax',
    category: 'Bienestar',
    discount: '30% off',
    uses: 8,
    color: '#10b981',
    emoji: '💆',
  },
]

export default function DashboardBarber() {
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
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center text-2xl flex-shrink-0">
                ✂️
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Barber Club
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Resumen de tu programa de membresía y red de comercios aliados
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
            title="Miembros activos"
            value={metrics.members}
            icon={Users}
            gradient="bg-gradient-to-br from-stone-700 to-stone-900"
          />
          <MetricCard
            title="Visitas a la barbería"
            value={metrics.visits}
            icon={Store}
            gradient="bg-gradient-to-br from-amber-500 to-yellow-600"
          />
          <MetricCard
            title="Usos en comercios aliados"
            value={metrics.redemptions}
            icon={Gift}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts + Tier distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StatsChart title="Miembros nuevos" data={chartData} dataKey="adds" color="#78716c" />
          <StatsChart title="Visitas a la barbería" data={chartData} dataKey="scans" color="#d97706" />
          <StatsChart title="Usos en comercios aliados" data={chartData} dataKey="redemptions" color="#a855f7" />

          {/* Tier distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Distribución de niveles</h3>
            <div className="space-y-3">
              {TIERS.map((tier) => (
                <div key={tier.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: tier.color }} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tier.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tier.count} ({tier.pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${tier.pct}%`, background: tier.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partner network section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Red de comercios aliados</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Negocios que aceptan los beneficios de tus miembros
              </p>
            </div>
            <button className="text-sm font-semibold text-amber-600 hover:text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors">
              + Agregar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${partner.color}18` }}
                >
                  {partner.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{partner.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{partner.category}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold mb-0.5" style={{ color: partner.color }}>
                    {partner.discount}
                  </div>
                  <div className="text-xs text-gray-400">{partner.uses} usos este mes</div>
                </div>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} title="Activo" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
