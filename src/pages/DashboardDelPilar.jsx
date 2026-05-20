import { useState } from 'react'
import { CreditCard, Users, QrCode, Gift, Percent, Store, TrendingUp, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import DateFilterSelect from '@/components/shared/DateFilterSelect'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

// ─── Static mock data ──────────────────────────────────────────────────────────

const CHART_7D = [
  { date: '30 abr', fullDate: '30 de abril', adds: 8, scans: 112, redemptions: 9, nuevos: 8, recurrentes: 104 },
  { date: '1 may', fullDate: '1 de mayo', adds: 12, scans: 148, redemptions: 13, nuevos: 12, recurrentes: 136 },
  { date: '2 may', fullDate: '2 de mayo', adds: 10, scans: 135, redemptions: 11, nuevos: 10, recurrentes: 125 },
  { date: '3 may', fullDate: '3 de mayo', adds: 9, scans: 128, redemptions: 10, nuevos: 9, recurrentes: 119 },
  { date: '4 may', fullDate: '4 de mayo', adds: 6, scans: 88, redemptions: 7, nuevos: 6, recurrentes: 82 },
  { date: '5 may', fullDate: '5 de mayo', adds: 5, scans: 76, redemptions: 6, nuevos: 5, recurrentes: 71 },
  { date: '6 may', fullDate: '6 de mayo', adds: 11, scans: 142, redemptions: 12, nuevos: 11, recurrentes: 131 },
]

const CHART_MONTH = [
  { date: '7 abr', fullDate: '7 de abril', adds: 7, scans: 95, redemptions: 8, nuevos: 7, recurrentes: 88 },
  { date: '9 abr', fullDate: '9 de abril', adds: 10, scans: 122, redemptions: 11, nuevos: 10, recurrentes: 112 },
  { date: '11 abr', fullDate: '11 de abril', adds: 8, scans: 108, redemptions: 9, nuevos: 8, recurrentes: 100 },
  { date: '14 abr', fullDate: '14 de abril', adds: 15, scans: 178, redemptions: 16, nuevos: 15, recurrentes: 163 },
  { date: '16 abr', fullDate: '16 de abril', adds: 5, scans: 72, redemptions: 6, nuevos: 5, recurrentes: 67 },
  { date: '18 abr', fullDate: '18 de abril', adds: 11, scans: 138, redemptions: 12, nuevos: 11, recurrentes: 127 },
  { date: '21 abr', fullDate: '21 de abril', adds: 16, scans: 190, redemptions: 17, nuevos: 16, recurrentes: 174 },
  { date: '23 abr', fullDate: '23 de abril', adds: 9, scans: 115, redemptions: 10, nuevos: 9, recurrentes: 106 },
  { date: '25 abr', fullDate: '25 de abril', adds: 13, scans: 155, redemptions: 14, nuevos: 13, recurrentes: 142 },
  { date: '28 abr', fullDate: '28 de abril', adds: 14, scans: 168, redemptions: 15, nuevos: 14, recurrentes: 154 },
  { date: '30 abr', fullDate: '30 de abril', adds: 8, scans: 112, redemptions: 9, nuevos: 8, recurrentes: 104 },
  { date: '2 may', fullDate: '2 de mayo', adds: 10, scans: 135, redemptions: 11, nuevos: 10, recurrentes: 125 },
  { date: '4 may', fullDate: '4 de mayo', adds: 6, scans: 88, redemptions: 7, nuevos: 6, recurrentes: 82 },
  { date: '6 may', fullDate: '6 de mayo', adds: 11, scans: 142, redemptions: 12, nuevos: 11, recurrentes: 131 },
]

const METRICS = {
  '7d': { members: 418, programs: 1, scans: 829, rewards: 68, rate: 28 },
  month: { members: 418, programs: 1, scans: 3680, rewards: 289, rate: 31 },
}

const TIER_DIST = [
  { name: 'Bronce', value: 241, fill: '#cd7f32' },
  { name: 'Plata', value: 122, fill: '#9ca3af' },
  { name: 'Oro', value: 55, fill: '#f59e0b' },
]

const MEMBER_ORIGIN = [
  { name: 'QR en sucursal', value: 238, fill: '#3b1f0a' },
  { name: 'Referido', value: 105, fill: '#78350f' },
  { name: 'Link directo', value: 75, fill: '#9ca3af' },
]

const TOP_BENEFITS = [
  { name: 'Café del día gratis', canjes: 112, fill: '#f59e0b' },
  { name: 'Medialuna de regalo', canjes: 87, fill: '#f97316' },
  { name: '10% off productos', canjes: 64, fill: '#ef4444' },
  { name: 'Torta de encargo', canjes: 28, fill: '#8b5cf6' },
  { name: 'Kit bienvenida Oro', canjes: 18, fill: '#3b82f6' },
]

const SUCURSALES_RANKING = [
  { name: 'Sucursal 1', visitas: 487, fill: '#3b1f0a' },
  { name: 'Sucursal 2', visitas: 394, fill: '#78350f' },
  { name: 'Sucursal 3', visitas: 312, fill: '#92400e' },
  { name: 'Sucursal 4', visitas: 221, fill: '#9ca3af' },
]

const SUCURSALES_TIERS = [
  { name: 'Sucursal 1', bronce: 248, plata: 162, oro: 77 },
  { name: 'Sucursal 2', bronce: 198, plata: 130, oro: 66 },
  { name: 'Sucursal 3', bronce: 175, plata: 105, oro: 32 },
  { name: 'Sucursal 4', bronce: 128, plata: 74, oro: 19 },
]

const TIER_COLORS = { bronce: '#cd7f32', plata: '#9ca3af', oro: '#f59e0b' }

// ─── Tooltip components ────────────────────────────────────────────────────────

const CustomTooltipTiers = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: TIER_COLORS[p.name] }} className="capitalize">
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

const CustomTooltipEngagement = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.dataKey === 'nuevos' ? 'Nuevos' : 'Recurrentes'}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="mb-4">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        <h2 className="text-2xl font-black text-foreground">{title}</h2>
      </div>
    </motion.div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardDelPilar() {
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
                src="/del-pilar-logo.jpg"
                alt="Del Pilar"
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-contain flex-shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Del Pilar
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

        {/* ── Tendencias ── */}
        <SectionHeader icon={TrendingUp} title="Tendencias" delay={0.1} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StatsChart title="Miembros nuevos" data={chartData} dataKey="adds" color="#3B82F6" />
          <StatsChart title="Puntos otorgados" data={chartData} dataKey="scans" color="#F59E0B" />
          <StatsChart title="Premios canjeados" data={chartData} dataKey="redemptions" color="#8B5CF6" />
        </div>

        {/* ── Engagement y retención ── */}
        <SectionHeader icon={Users} title="Engagement y retención" delay={0.15} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Nuevos vs Recurrentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="h-full"
          >
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nuevos vs Recurrentes</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barSize={10}
                    barGap={3}
                  >
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--tooltip-bg))',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ color: 'hsl(var(--tooltip-label))', fontWeight: 600, marginBottom: 4 }}
                      content={<CustomTooltipEngagement />}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="nuevos" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="recurrentes" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">Nuevos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500">Recurrentes</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Distribución de niveles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="h-full"
          >
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Distribución de niveles</h3>
              </div>
              <div className="h-64 flex items-center">
                <div className="flex-1 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={TIER_DIST}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {TIER_DIST.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--tooltip-bg))',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                          padding: '12px 16px',
                        }}
                        formatter={(v, n) => [v, n]}
                        cursor={false}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-4 pl-2 min-w-[120px]">
                  {TIER_DIST.map((t) => (
                    <div key={t.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.fill }} />
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{t.name}</p>
                        <p className="text-xs text-gray-400">
                          {t.value} · {Math.round((t.value / TIER_DIST.reduce((s, x) => s + x.value, 0)) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ── Adquisición y beneficios ── */}
        <SectionHeader icon={Target} title="Adquisición y beneficios" delay={0.25} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Origen de nuevos miembros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="h-full"
          >
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-amber-800" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Origen de nuevos miembros</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MEMBER_ORIGIN}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                    barSize={20}
                  >
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--tooltip-bg))',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ color: 'hsl(var(--tooltip-label))', fontWeight: 600, marginBottom: 4 }}
                      formatter={(v) => [v, 'Miembros']}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {MEMBER_ORIGIN.map((s, i) => (
                        <Cell key={i} fill={s.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Top beneficios canjeados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="h-full"
          >
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top beneficios canjeados</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={TOP_BENEFITS}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                    barSize={16}
                  >
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      width={130}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--tooltip-bg))',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ color: 'hsl(var(--tooltip-label))', fontWeight: 600, marginBottom: 4 }}
                      formatter={(v) => [v, 'Canjes']}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="canjes" radius={[0, 6, 6, 0]}>
                      {TOP_BENEFITS.map((b, i) => (
                        <Cell key={i} fill={b.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ── Comparativa de sucursales ── */}
        <SectionHeader icon={Store} title="Comparativa de sucursales" delay={0.3} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Ranking de visitas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="h-full"
          >
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ranking de visitas</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SUCURSALES_RANKING}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                    barSize={20}
                  >
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--tooltip-bg))',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ color: 'hsl(var(--tooltip-label))', fontWeight: 600, marginBottom: 4 }}
                      formatter={(v) => [v, 'Visitas']}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="visitas" radius={[0, 6, 6, 0]}>
                      {SUCURSALES_RANKING.map((s, i) => (
                        <Cell key={i} fill={s.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Niveles por sucursal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="h-full"
          >
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Niveles por sucursal</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SUCURSALES_TIERS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={22}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--tooltip-bg))',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ color: 'hsl(var(--tooltip-label))', fontWeight: 600, marginBottom: 4 }}
                      content={<CustomTooltipTiers />}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="bronce" stackId="a" fill={TIER_COLORS.bronce} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="plata" stackId="a" fill={TIER_COLORS.plata} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="oro" stackId="a" fill={TIER_COLORS.oro} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                {Object.entries(TIER_COLORS).map(([k, c]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    <span className="text-xs text-gray-500 capitalize">{k}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
