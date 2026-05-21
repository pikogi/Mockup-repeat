import PropTypes from 'prop-types'
import { Activity, CreditCard, Users, QrCode, Gift, Percent } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'
import { createPageUrl } from '@/utils'
import MetricCard from '@/components/dashboard/MetricCard'
import StatsChart from '@/components/dashboard/StatsChart'
import Step3CTA from '@/components/dashboard/Step3CTA'
import { DashboardFilters } from '@/components/dashboard/DashboardSections'
import { useDashboardHome } from '@/hooks/useDashboardHome'

export default function DashboardHome({ brandId }) {
  const { t } = useLanguage()
  const {
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    selectedStore,
    setSelectedStore,
    stores,
    membersCount,
    activePrograms,
    stampsCount,
    rewardsCount,
    redemptionRate,
    visitasCount,
    membersTrend,
    stampsTrend,
    rewardsTrend,
    redemptionRateTrend,
    visitasTrend,
    chartData,
    statsLoading,
  } = useDashboardHome(brandId)

  // Show CTA only when no filters are applied and brand truly has no active programs
  if (!statsLoading && activePrograms === 0 && dateFilter === '7d' && selectedStore === 'all') {
    return <Step3CTA />
  }

  return (
    <div>
      <div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <MetricCard
            title={t('Miembros')}
            value={membersCount}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            href={createPageUrl('Customers')}
            loading={statsLoading}
            trend={membersTrend}
          />
          <MetricCard
            title={t('Visitas')}
            value={visitasCount}
            icon={Activity}
            gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
            loading={statsLoading}
            trend={visitasTrend}
          />
          <MetricCard
            title={t('Clubs Activos')}
            value={activePrograms}
            icon={CreditCard}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
            href={createPageUrl('MyPrograms')}
            loading={statsLoading}
          />
          <MetricCard
            title={t('stamps')}
            value={stampsCount}
            icon={QrCode}
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
            loading={statsLoading}
            trend={stampsTrend}
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
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StatsChart
            title={t('membersChartTitle')}
            data={chartData}
            dataKey="adds"
            prevDataKey="prevAdds"
            color="#3B82F6"
            loading={statsLoading}
          />
          <StatsChart
            title={t('stampsChartTitle')}
            data={chartData}
            dataKey="scans"
            prevDataKey="prevScans"
            color="#F59E0B"
            loading={statsLoading}
          />
          <StatsChart
            title={t('rewardsChartTitle')}
            data={chartData}
            dataKey="redemptions"
            prevDataKey="prevRedemptions"
            color="#8B5CF6"
            loading={statsLoading}
          />
        </div>
      </div>
    </div>
  )
}

DashboardHome.propTypes = {
  brandId: PropTypes.string,
}
