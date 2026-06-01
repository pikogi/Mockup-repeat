import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowRight, BarChart2, Gift, Percent, QrCode, Repeat2, Trophy, UserPlus, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/components/auth/LanguageContext'
import { createPageUrl } from '@/utils'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import Step3CTA from '@/components/dashboard/Step3CTA'
import { DashboardFilters } from '@/components/dashboard/DashboardSections'
import { useDashboardHome } from '@/hooks/useDashboardHome'

const CHART_TABS_TXN = [
  { key: 'scans', prevKey: 'prevScans', label: 'Sellos', color: '#F59E0B' },
  { key: 'points', prevKey: 'prevPoints', label: 'Puntos', color: '#10B981' },
  { key: 'redemptions', prevKey: 'prevRedemptions', label: 'Premios', color: '#8B5CF6' },
]
const CHART_TABS_MEMBERS = [
  { key: 'adds', prevKey: 'prevAdds', label: 'Nuevos', color: '#6366f1' },
  { key: 'returning', prevKey: 'prevReturning', label: 'Volvieron', color: '#0EA5E9' },
]

const DOW_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DOW_KEYS = [1, 2, 3, 4, 5, 6, 0]

const AVATAR_COLORS = ['#6366f1', '#4f46e5', '#7c3aed', '#8b5cf6', '#4338ca', '#6d28d9']
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

function InsightEngagement({ visitasCount, membersCount, loading }) {
  const rate = membersCount > 0 ? visitasCount / membersCount : 0
  const rateDisplay = membersCount > 0 ? rate.toFixed(1) : '—'
  const color = rate > 1 ? '#10b981' : rate >= 0.5 ? '#f59e0b' : '#ef4444'
  const label = rate > 1 ? 'Excelente retorno' : rate >= 0.5 ? 'Retorno moderado' : rate > 0 ? 'Retorno bajo' : '—'

  return (
    <Card className="border-0 shadow-lg p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
          <Repeat2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Retorno de clientes</p>
      </div>
      {loading ? (
        <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3" />
      ) : (
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-black tabular-nums" style={{ color }}>
            {rateDisplay}
          </span>
          <span className="text-sm font-medium text-gray-400">visitas / miembro</span>
        </div>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{loading ? '' : label}</p>
      {!loading && rate > 0 && (
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(rate, 1) * 100}%`, backgroundColor: color }}
          />
        </div>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Visitas del período ÷ miembros totales. Un coeficiente mayor a 1 indica que tus clientes vuelven más de una vez
        en el período seleccionado.
      </p>
    </Card>
  )
}

function InsightDayOfWeek({ chartData, loading }) {
  const dowData = useMemo(() => {
    const totals = {}
    DOW_KEYS.forEach((k) => (totals[k] = 0))
    chartData.forEach((d) => {
      if (d.dayOfWeek != null) totals[d.dayOfWeek] = (totals[d.dayOfWeek] ?? 0) + d.scans
    })
    const max = Math.max(...Object.values(totals), 1)
    return DOW_KEYS.map((key, i) => ({
      label: DOW_LABELS[i],
      value: totals[key] ?? 0,
      intensity: (totals[key] ?? 0) / max,
      isMax: totals[key] === Math.max(...Object.values(totals)) && totals[key] > 0,
    }))
  }, [chartData])

  const peakDay = dowData.find((d) => d.isMax)

  const tileColor = (intensity, isMax) => {
    if (intensity === 0) return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-300 dark:text-gray-600' }
    if (isMax) return { bg: 'bg-amber-500', text: 'text-white' }
    if (intensity >= 0.7) return { bg: 'bg-amber-400', text: 'text-white' }
    if (intensity >= 0.4) return { bg: 'bg-amber-300', text: 'text-amber-900' }
    return { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' }
  }

  return (
    <Card className="border-0 shadow-lg p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50">
          <BarChart2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Actividad por día</p>
      </div>

      {loading ? (
        <div className="flex gap-1.5 mb-4">
          {DOW_LABELS.map((_, i) => (
            <div key={i} className="flex-1 aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-1.5 mb-2">
          {dowData.map((d) => {
            const { bg, text } = tileColor(d.intensity, d.isMax)
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-500 relative ${bg} ${d.isMax ? 'ring-2 ring-amber-500 ring-offset-1' : ''}`}
                >
                  <span className={`text-[10px] font-bold tabular-nums leading-none ${text}`}>
                    {d.value > 0 ? d.value : ''}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium ${d.isMax ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}
                >
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        {loading || !peakDay || peakDay.value === 0
          ? 'Sin datos suficientes'
          : `${peakDay.label} es el día más activo · ${peakDay.value} sellos`}
      </p>
    </Card>
  )
}

function FunnelStep({ label, value, pct, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-bold tabular-nums text-gray-700 dark:text-gray-300">
          {value.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function InsightFunnel({ membersCount, activeMembers, rewardsCount, loading }) {
  const oneInX = rewardsCount > 0 && activeMembers > 0 ? Math.round(activeMembers / rewardsCount) : null

  return (
    <Card className="border-0 shadow-lg p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50">
          <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Embudo de fidelización</p>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              style={{ width: `${100 - i * 20}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          <FunnelStep label="Miembros totales" value={membersCount} pct={100} color="#6366f1" />
          <FunnelStep
            label="Miembros activos"
            value={activeMembers}
            pct={membersCount > 0 ? (activeMembers / membersCount) * 100 : 0}
            color="#f59e0b"
          />
          <FunnelStep
            label="Premios canjeados"
            value={rewardsCount}
            pct={membersCount > 0 ? (rewardsCount / membersCount) * 100 : 0}
            color="#8b5cf6"
          />
        </div>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        {loading
          ? ''
          : oneInX
            ? `1 de cada ${oneInX} miembros canjea un premio`
            : 'Sin premios canjeados en el período'}
      </p>
    </Card>
  )
}

function InsightProgress({ progressClubs, loading }) {
  const [selectedId, setSelectedId] = useState(progressClubs?.[0]?.id ?? '')
  const club = progressClubs?.find((c) => c.id === selectedId) ?? progressClubs?.[0]
  const distribution = club?.distribution ?? []
  const total = distribution.reduce((s, b) => s + b.count, 0)
  const ready = distribution.find((b) => b.ready)

  return (
    <Card className="border-0 shadow-lg p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex-shrink-0">
            <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">Progreso en el programa</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!loading && ready && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
              {ready.count} canjearon
            </span>
          )}
          {progressClubs?.length > 1 && (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="h-7 text-xs w-32 border-gray-200 dark:border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {progressClubs.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[100, 70, 50, 35, 20].map((w, i) => (
            <div
              key={i}
              className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {distribution.map((bucket, i) => {
            const pct = total > 0 ? (bucket.count / total) * 100 : 0
            return (
              <div key={bucket.label}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium ${bucket.ready ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {bucket.label}
                  </span>
                  <span
                    className={`text-xs font-bold tabular-nums ${bucket.ready ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {bucket.count.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(pct, pct > 0 ? 1 : 0)}%`,
                      backgroundColor: bucket.ready ? '#10b981' : '#6366f1',
                      opacity: bucket.ready ? 1 : 0.4 + (i / distribution.length) * 0.5,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        {loading
          ? ''
          : `${total.toLocaleString()} miembros · ${club?.type === 'stamps' ? 'programa de sellos' : 'programa de puntos'}`}
      </p>
    </Card>
  )
}

export default function DashboardHome({ brandId, demo = false, demoTitle, demoLogo }) {
  const { t } = useLanguage()
  const [activeChart, setActiveChart] = useState('scans')
  const [activeMembersChart, setActiveMembersChart] = useState('adds')

  const {
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    selectedStore,
    setSelectedStore,
    stores,
    membersCount,
    newMembersInPeriod,
    activePrograms,
    activeMembers,
    progressClubs,
    stampsCount,
    pointsCount,
    rewardsCount,
    redemptionRate,
    visitasCount,
    returningVisits,
    membersTrend,
    newMembersTrend,
    stampsTrend,
    rewardsTrend,
    redemptionRateTrend,
    visitasTrend,
    chartData,
    topCustomers,
    statsLoading,
  } = useDashboardHome(brandId, { demo })

  const periodLabel = useMemo(() => {
    if (dateFilter === '7d') return 'Últimos 7 días'
    if (dateFilter === 'month') {
      const now = new Date()
      return now.toLocaleDateString('es', { month: 'long', year: 'numeric' })
    }
    if (dateFilter === 'custom' && customDate.from && customDate.to) {
      const fmt = (d) => new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })
      return `${fmt(customDate.from)} – ${fmt(customDate.to)}`
    }
    return 'Período seleccionado'
  }, [dateFilter, customDate])

  if (!statsLoading && activePrograms === 0 && dateFilter === '7d' && selectedStore === 'all') {
    return <Step3CTA />
  }

  const statsView = (
    <div className="space-y-5 md:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <DashboardFilters
          stores={stores}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customDate={customDate}
          setCustomDate={setCustomDate}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      </motion.div>

      {/* Summary banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 md:p-6 text-white shadow-xl shadow-indigo-500/25">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-3">
            Resumen del período · <span className="normal-case tracking-normal capitalize">{periodLabel}</span>
          </p>

          {/* Mobile: hero number + 3-stat row */}
          <div className="md:hidden">
            {statsLoading ? (
              <div className="space-y-3">
                <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-10 bg-white/20 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                    <span className="text-4xl font-black tabular-nums leading-none">
                      {visitasCount.toLocaleString()}
                    </span>
                    <span className="text-base font-medium text-indigo-200">visitas totales</span>
                    {visitasTrend && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${visitasTrend.startsWith('+') ? 'bg-emerald-500/25 text-emerald-100' : 'bg-red-500/25 text-red-200'}`}
                      >
                        {visitasTrend}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-white/15 pt-3">
                  <div className="text-center border-r border-white/15">
                    <p className="text-lg font-black tabular-nums leading-none">{returningVisits.toLocaleString()}</p>
                    <p className="text-[10px] text-indigo-300 mt-0.5 leading-tight">miembros recurrentes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black tabular-nums leading-none">
                      {newMembersInPeriod.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-indigo-300 mt-0.5 leading-tight">miembros nuevos</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop: large numbers side by side */}
          <div className="hidden md:flex items-start gap-8 flex-wrap">
            {statsLoading ? (
              <div className="w-28 h-10 bg-white/20 rounded-xl animate-pulse" />
            ) : (
              <>
                <div>
                  <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap mb-1">
                    <span className="text-5xl font-black tabular-nums leading-none">
                      {visitasCount.toLocaleString()}
                    </span>
                    <span className="text-lg font-medium text-indigo-200">visitas totales</span>
                    {visitasTrend && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          visitasTrend.startsWith('+')
                            ? 'bg-emerald-500/25 text-emerald-100'
                            : 'bg-red-500/25 text-red-200'
                        }`}
                      >
                        {visitasTrend} vs período ant.
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-px h-10 bg-white/20 self-center" />
                <div>
                  <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap mb-1">
                    <span className="text-5xl font-black tabular-nums leading-none">
                      {returningVisits.toLocaleString()}
                    </span>
                    <span className="text-lg font-medium text-indigo-200">miembros recurrentes</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Secondary metrics */}
      {/* Mobile: 1-col horizontal */}
      <div className="lg:hidden space-y-3">
        <MetricCard
          title="Miembros totales"
          value={membersCount}
          icon={Users}
          gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
          href={createPageUrl('Customers')}
          loading={statsLoading}
          trend={membersTrend}
        />
        <MetricCard
          title="Transacciones"
          value={stampsCount + pointsCount}
          icon={QrCode}
          gradient="bg-gradient-to-br from-amber-400 to-amber-500"
          loading={statsLoading}
          trend={stampsTrend}
          subtitle={`${stampsCount.toLocaleString()} sellos · ${pointsCount.toLocaleString()} puntos`}
        />
        <MetricCard
          title={t('rewards')}
          value={rewardsCount}
          icon={Gift}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          loading={statsLoading}
          trend={rewardsTrend}
        />
        <MetricCard
          title={t('redemptionRate')}
          value={Math.round(redemptionRate)}
          icon={Percent}
          gradient="bg-gradient-to-br from-pink-500 to-rose-500"
          loading={statsLoading}
          suffix="%"
          trend={redemptionRateTrend}
          tooltip="Premios canjeados ÷ visitas del período × 100. Ej: 13 premios en 178 visitas = 7%."
        />
      </div>
      {/* Desktop: 5-col */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-stretch">
        <MetricCard
          title="Miembros nuevos"
          value={newMembersInPeriod}
          icon={UserPlus}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          href={createPageUrl('Customers')}
          loading={statsLoading}
          trend={newMembersTrend}
        />
        <MetricCard
          title="Miembros totales"
          value={membersCount}
          icon={Users}
          gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
          href={createPageUrl('Customers')}
          loading={statsLoading}
          trend={membersTrend}
        />
        <MetricCard
          title="Transacciones"
          value={stampsCount + pointsCount}
          icon={QrCode}
          gradient="bg-gradient-to-br from-amber-400 to-amber-500"
          loading={statsLoading}
          trend={stampsTrend}
          subtitle={`${stampsCount.toLocaleString()} sellos · ${pointsCount.toLocaleString()} puntos`}
        />
        <MetricCard
          title={t('rewards')}
          value={rewardsCount}
          icon={Gift}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          loading={statsLoading}
          trend={rewardsTrend}
        />
        <MetricCard
          title={t('redemptionRate')}
          value={Math.round(redemptionRate)}
          icon={Percent}
          gradient="bg-gradient-to-br from-pink-500 to-rose-500"
          loading={statsLoading}
          suffix="%"
          trend={redemptionRateTrend}
          tooltip="Premios canjeados ÷ visitas del período × 100. Ej: 13 premios en 178 visitas = 7%."
        />
      </div>

      {/* Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatsChart
          data={chartData}
          loading={statsLoading}
          tabs={CHART_TABS_TXN}
          activeTab={activeChart}
          onTabChange={setActiveChart}
          title="Transacciones en el tiempo"
          mobileTitle="Transacciones"
        />
        <StatsChart
          data={chartData}
          loading={statsLoading}
          tabs={CHART_TABS_MEMBERS}
          activeTab={activeMembersChart}
          onTabChange={setActiveMembersChart}
          title="Miembros en el tiempo"
          mobileTitle="Miembros"
        />
      </div>

      {/* Top Customers */}
      {topCustomers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Top clientes</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {Math.min(topCustomers.length, 5)}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {(() => {
                const top5 = topCustomers.slice(0, 5)
                const maxVisits = top5[0]?.visits || 1
                const MEDALS = ['🥇', '🥈', '🥉']
                return top5.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <div className="w-5 flex items-center justify-center flex-shrink-0">
                      {i < 3 ? (
                        <span className="text-base leading-none">{MEDALS[i]}</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                      )}
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: avatarColor(c.name) }}
                    >
                      {initials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 mb-1.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{c.name}</p>
                        <p className="text-xs text-gray-400 truncate hidden sm:block flex-shrink-0">{c.email}</p>
                      </div>
                      <div className="hidden sm:block h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${Math.round((c.visits / maxVisits) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex-shrink-0 tabular-nums">
                      {c.visits} <span className="text-xs font-normal text-gray-400">visitas</span>
                    </p>
                  </div>
                ))
              })()}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <Link
                to={createPageUrl('Customers')}
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Ver más
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <InsightEngagement visitasCount={visitasCount} membersCount={membersCount} loading={statsLoading} />
        <InsightDayOfWeek chartData={chartData} loading={statsLoading} />
        <InsightFunnel
          membersCount={membersCount}
          activeMembers={activeMembers}
          rewardsCount={rewardsCount}
          loading={statsLoading}
        />
      </motion.div>

      {/* Progress distribution */}
      <InsightProgress progressClubs={progressClubs} loading={statsLoading} />
    </div>
  )

  const inner = (
    <div className="space-y-5 md:space-y-6">
      {(demoTitle || demoLogo) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {demoLogo && (
                <img
                  src={demoLogo}
                  alt={demoTitle}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-contain flex-shrink-0"
                />
              )}
              {demoTitle && (
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                  {demoTitle}
                </h1>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Resumen de tu programa de fidelización</p>
          </div>
        </motion.div>
      )}
      {statsView}
    </div>
  )

  if (demo) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">{inner}</div>
      </div>
    )
  }

  return inner
}

DashboardHome.propTypes = {
  brandId: PropTypes.string,
  demo: PropTypes.bool,
  demoTitle: PropTypes.string,
  demoLogo: PropTypes.string,
}
