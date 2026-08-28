import { useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  UserPlus,
  RefreshCw,
  TrendingDown,
  AlertTriangle,
  Clock3,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import MetricCard from '@/components/dashboard/MetricCard'
import MembershipAnalyticsSection from '@/components/memberships/MembershipAnalyticsSection'
import DashboardHome from '@/pages/DashboardHome'
import { formatMoney, monthlyEquivalent } from '@/lib/membershipFormat'
import { loadMembershipData } from '@/constants/membershipDemoData'
import { addDaysUTC } from '@/utils/date'
import { cn } from '@/lib/utils'

function monthlyPrice(plan) {
  if (!plan) return 0
  return monthlyEquivalent(plan.price, plan.billing_period_days)
}

export default function MembershipsDashboard() {
  const [tab, setTab] = useState('resumen')
  const [data] = useState(loadMembershipData)
  const { plans, members } = data
  const planById = new Map(plans.map((p) => [p.id, p]))

  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeMembers = members.filter((m) => m.status === 'active')
  const mrr = activeMembers.reduce((sum, m) => sum + monthlyPrice(planById.get(m.plan_id)), 0)
  const arr = mrr * 12
  const newMembersCount = members.filter((m) => new Date(m.joined_at) >= startOfThisMonth).length
  const renewalsThisMonth = members
    .flatMap((m) => m.renewal_history)
    .filter((r) => new Date(r.date) >= startOfThisMonth).length
  const cancelledCount = members.filter((m) => m.status === 'cancelled').length
  const churnPct = members.length ? Math.round((cancelledCount / members.length) * 100) : 0
  const failedPayments = members.flatMap((m) => m.payment_history).filter((p) => p.status === 'failed').length
  const expiringSoon = members.filter(
    (m) =>
      m.status === 'active' &&
      m.renewal_date &&
      new Date(m.renewal_date) >= now &&
      new Date(m.renewal_date) <= addDaysUTC(now, 7),
  ).length

  // MRR de los últimos 6 meses, derivado de las fechas reales de alta del seed
  const mrrSeries = Array.from({ length: 6 }).map((_, i) => {
    const monthsBack = 5 - i
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0)
    const mrrAtMonth = members
      .filter((m) => new Date(m.joined_at) <= monthEnd && m.status !== 'cancelled')
      .reduce((sum, m) => sum + monthlyPrice(planById.get(m.plan_id)), 0)
    return { month: format(monthEnd, 'MMM'), mrr: Math.round(mrrAtMonth) }
  })

  const revenueByPlan = plans
    .map((p) => ({
      name: p.name,
      color: p.color,
      revenue: activeMembers.filter((m) => m.plan_id === p.id).reduce((s) => s + monthlyPrice(p), 0),
      members: activeMembers.filter((m) => m.plan_id === p.id).length,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Panorama general del programa de membresías</p>
        </motion.div>

        <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-4">
          <button
            onClick={() => setTab('roadmap')}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors',
              tab === 'roadmap'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab('resumen')}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors',
              tab === 'resumen'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            Membresías
          </button>
          <button
            onClick={() => setTab('analytics')}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors',
              tab === 'analytics'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            Analytics
          </button>
        </div>

        {tab === 'analytics' ? (
          <MembershipAnalyticsSection data={data} />
        ) : tab === 'roadmap' ? (
          <div className="-mt-8 md:-mt-12">
            <DashboardHome demo />
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <MetricCard
                title="Miembros activos"
                value={activeMembers.length}
                icon={Users}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <MetricCard
                title="MRR"
                value={Math.round(mrr)}
                icon={DollarSign}
                gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
                subtitle="Ingreso mensual recurrente"
              />
              <MetricCard
                title="ARR"
                value={Math.round(arr)}
                icon={TrendingUp}
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                subtitle="Ingreso anual recurrente"
              />
              <MetricCard
                title="Nuevos este mes"
                value={newMembersCount}
                icon={UserPlus}
                gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />
              <MetricCard
                title="Renovaciones este mes"
                value={renewalsThisMonth}
                icon={RefreshCw}
                gradient="bg-gradient-to-br from-amber-400 to-amber-500"
              />
              <MetricCard
                title="Churn"
                value={churnPct}
                suffix="%"
                icon={TrendingDown}
                gradient="bg-gradient-to-br from-red-500 to-rose-600"
              />
              <MetricCard
                title="Pagos fallidos"
                value={failedPayments}
                icon={AlertTriangle}
                gradient="bg-gradient-to-br from-orange-500 to-orange-600"
              />
              <MetricCard
                title="Por vencer (7 días)"
                value={expiringSoon}
                icon={Clock3}
                gradient="bg-gradient-to-br from-pink-500 to-rose-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">MRR — últimos 6 meses</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={mrrSeries}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111827" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip formatter={(v) => formatMoney(v)} />
                    <Area type="monotone" dataKey="mrr" stroke="#111827" strokeWidth={2} fill="url(#mrrGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Ingresos por plan</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueByPlan}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip formatter={(v) => formatMoney(v)} />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {revenueByPlan.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Top planes */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Top planes</h3>
              <div className="space-y-2">
                {revenueByPlan.map((plan, i) => (
                  <div
                    key={plan.name}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: plan.color }} />
                    <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{plan.name}</span>
                    <span className="text-xs text-gray-400">{plan.members} miembros</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-24 text-right">
                      {formatMoney(plan.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
