import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Percent, Users, Wallet, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import MetricCard from '@/components/dashboard/MetricCard'
import MembershipTabs from '@/components/memberships/MembershipTabs'
import { formatMoney } from '@/lib/membershipFormat'
import { loadMembershipData } from '@/constants/membershipDemoData'

function monthlyPrice(plan) {
  if (!plan) return 0
  return plan.billing_period === 'annual' ? plan.price / 12 : plan.price
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export default function MembershipAnalytics() {
  const [data] = useState(loadMembershipData)
  const { plans, members } = data
  const planById = new Map(plans.map((p) => [p.id, p]))
  const now = new Date()

  const cancelledOrExpired = members.filter((m) => m.status === 'cancelled' || m.status === 'expired')
  const totalRenewals = members.flatMap((m) => m.renewal_history).length
  const renewalRate =
    totalRenewals + cancelledOrExpired.length > 0
      ? Math.round((totalRenewals / (totalRenewals + cancelledOrExpired.length)) * 100)
      : 0

  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  const cohort = members.filter((m) => new Date(m.joined_at) <= threeMonthsAgo)
  const retained = cohort.filter((m) => m.status === 'active' || m.status === 'paused')
  const retentionPct = cohort.length ? Math.round((retained.length / cohort.length) * 100) : 0

  const avgLtv = members.length ? members.reduce((s, m) => s + m.lifetime_value, 0) / members.length : 0

  const avgTenureDays = members.length
    ? members.reduce((s, m) => s + daysBetween(new Date(m.joined_at), now), 0) / members.length
    : 0
  const avgTenureMonths = Math.round(avgTenureDays / 30)

  // Crecimiento de MRR: comparamos el MRR actual contra el que ya existía hace un mes,
  // usando el mismo criterio (activos) a ambos lados para que la comparación sea justa.
  const activeMembers = members.filter((m) => m.status === 'active')
  const currentMrr = activeMembers.reduce((sum, m) => sum + monthlyPrice(planById.get(m.plan_id)), 0)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const lastMonthMrr = activeMembers
    .filter((m) => new Date(m.joined_at) <= lastMonthEnd)
    .reduce((sum, m) => sum + monthlyPrice(planById.get(m.plan_id)), 0)
  const mrrGrowthPct = lastMonthMrr > 0 ? Math.round(((currentMrr - lastMonthMrr) / lastMonthMrr) * 100) : 0

  // Distribución de miembros activos por plan
  const distribution = plans
    .map((p) => ({
      name: p.name,
      color: p.color,
      value: activeMembers.filter((m) => m.plan_id === p.id).length,
    }))
    .filter((p) => p.value > 0)

  // Razones de cancelación — solo cancelaciones reales (no vencimientos, que son otro evento)
  const cancelledOnly = members.filter((m) => m.status === 'cancelled')
  const reasonCounts = new Map()
  cancelledOnly.forEach((m) => {
    const reason = m.cancellation_reason || 'Sin especificar'
    reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1)
  })
  const reasons = [...reasonCounts.entries()].sort((a, b) => b[1] - a[1])

  // Top clientes por lifetime value
  const topCustomers = [...members].sort((a, b) => b.lifetime_value - a.lifetime_value).slice(0, 6)
  const maxLtv = topCustomers[0]?.lifetime_value ?? 1
  const MEDALS = ['🥇', '🥈', '🥉']

  // Planes más rentables: LTV promedio por miembro activo de ese plan
  const profitablePlans = plans
    .map((p) => {
      const planMembers = activeMembers.filter((m) => m.plan_id === p.id)
      const avg = planMembers.length ? planMembers.reduce((s, m) => s + m.lifetime_value, 0) / planMembers.length : 0
      return { name: p.name, color: p.color, avgLtv: avg, members: planMembers.length }
    })
    .filter((p) => p.members > 0)
    .sort((a, b) => b.avgLtv - a.avgLtv)

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <MembershipTabs />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Retención, rentabilidad y comportamiento de tus miembros</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard
            title="Tasa de renovación"
            value={renewalRate}
            suffix="%"
            icon={Percent}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <MetricCard
            title="Retención (3 meses)"
            value={retentionPct}
            suffix="%"
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="LTV promedio"
            value={Math.round(avgLtv)}
            icon={Wallet}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <MetricCard
            title="Antigüedad promedio"
            value={avgTenureMonths}
            suffix=" meses"
            icon={Calendar}
            gradient="bg-gradient-to-br from-amber-400 to-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Distribución de membresías */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Distribución de miembros activos
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} miembros`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Razones de cancelación */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Razones de cancelación</h3>
            {reasons.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">Sin cancelaciones registradas.</p>
            ) : (
              <div className="space-y-3 mt-2">
                {reasons.map(([reason, count]) => (
                  <div key={reason}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-red-400 h-2 rounded-full"
                        style={{ width: `${(count / cancelledOnly.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              Crecimiento de MRR vs. mes anterior:{' '}
              <strong className={mrrGrowthPct >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                {mrrGrowthPct >= 0 ? '+' : ''}
                {mrrGrowthPct}%
              </strong>
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top clientes */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Top clientes por LTV</h3>
            <div className="space-y-1">
              {topCustomers.map((member, i) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span className="w-5 text-center flex-shrink-0">{MEDALS[i] ?? i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-gray-900 dark:bg-white h-1.5 rounded-full"
                        style={{ width: `${(member.lifetime_value / maxLtv) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex-shrink-0">
                    {formatMoney(member.lifetime_value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Planes más rentables */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Planes más rentables</h3>
            <p className="text-xs text-gray-400 mb-3">LTV promedio por miembro activo</p>
            <div className="space-y-2">
              {profitablePlans.map((plan, i) => (
                <div
                  key={plan.name}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: plan.color }} />
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{plan.name}</span>
                  <span className="text-xs text-gray-400">{plan.members} miembros</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-24 text-right">
                    {formatMoney(plan.avgLtv)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
