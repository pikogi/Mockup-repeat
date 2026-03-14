import React from 'react';
import { useQuery } from "@tanstack/react-query";
import useStoresStore from "@/stores/useStoresStore";
import useProgramsStore from "@/stores/useProgramsStore";
import { api } from "@/api/client";
import { createPageUrl } from '@/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard,
  Users,
  QrCode,
  Gift,
  Calendar as CalendarIcon,
  Store
} from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import StatsChart from '../components/dashboard/StatsChart';
import { motion } from "framer-motion";
import {
  format,
  subDays,
  addDays,
  startOfMonth,
} from 'date-fns';
import { useLanguage } from "@/components/auth/LanguageContext";

export default function DashboardHome({ brandId }) {
  const { t } = useLanguage();
  const [dateFilter, setDateFilter] = React.useState('default');
  const [customDate] = React.useState({
    from: new Date(),
    to: new Date(),
  });
  const [selectedStore, setSelectedStore] = React.useState('all');

  // ⚠️ brand / cards aún no existen en backend

  const { stores: storesFromStore, fetchStores } = useStoresStore();
  const { programs: storedPrograms, isLoading: programsStoreLoading } = useProgramsStore();

  React.useEffect(() => {
    if (brandId) fetchStores(brandId);
  }, [brandId, fetchStores]);

  const stores = storesFromStore;
  const storeId = selectedStore !== 'all' ? selectedStore : null;

  // Stable key for customDate to avoid query refetches on unrelated state changes
  const customDateKey = dateFilter === 'custom' ? `${customDate.from?.getTime()}-${customDate.to?.getTime()}` : '';

  // ======================
  // DATE FILTER
  // ======================
  const getDateRange = () => {
    const now = new Date();
    if (dateFilter === '7d') return { start: subDays(now, 7), end: now };
    if (dateFilter === 'month') return { start: startOfMonth(now), end: now };
    if (dateFilter === 'custom' && customDate?.from) {
      return { start: customDate.from, end: customDate.to || customDate.from };
    }
    return { start: subDays(now, 30), end: now };
  };

  // Brand stats — solo se usa para chartData (totalRedemptions)
  const { data: brandStats, isLoading: brandStatsLoading } = useQuery({
    queryKey: ['brandStats', brandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!brandId) return null;
      const range = getDateRange();
      const from = format(range.start, 'yyyy-MM-dd');
      const to = format(addDays(range.end, 1), 'yyyy-MM-dd');
      const res = await api.brands.getStats(brandId, { storeId, from, to });
      return res?.data || res || null;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  // Brand stats/users — time-series new members per day
  const { data: statsUsersData } = useQuery({
    queryKey: ['brandStatsUsers', brandId, dateFilter, storeId],
    queryFn: async () => {
      if (!brandId) return null;
      const range = getDateRange();
      const from = format(range.start, 'yyyy-MM-dd');
      const to = format(range.end, 'yyyy-MM-dd');
      const res = await api.brands.getStatsUsers(brandId, { from, to, storeId });
      return res?.data || res || null;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });

  const membersClubsLoading = brandStatsLoading || programsStoreLoading;
  const stampsRewardsLoading = brandStatsLoading;

  const membersCount = brandStats?.total_users ?? 0;
  // Usar el store Zustand para reflejar toggles optimistas al instante
  const programsSource = storedPrograms;
  const activePrograms = programsSource.filter(p => p.is_active !== false).length;

  // Sellos y premios: desde brandStats (una sola llamada, sin problemas de suma acumulada)
  const stampsCount = brandStats?.transactions_by_type?.stamp_added ?? 0;
  const rewardsCount = brandStats?.total_completed_redemptions ?? 0;

  const chartData = React.useMemo(() => {
    const userHistory = Array.isArray(statsUsersData)
      ? statsUsersData
      : Array.isArray(statsUsersData?.data)
        ? statsUsersData.data
        : [];

    if (userHistory.length === 0) return [];

    const totalStamps = brandStats?.transactions_by_type?.stamp_added ?? 0;
    const totalRedemptions = (brandStats?.total_completed_redemptions ?? 0) + (brandStats?.total_pending_redemptions ?? 0);

    return userHistory.map((entry, i) => ({
      date: format(new Date(entry.date), 'MMM d'),
      fullDate: format(new Date(entry.date), 'd MMM yyyy'),
      adds: entry.new_users ?? 0,
      scans: i === userHistory.length - 1 ? totalStamps : 0,
      redemptions: i === userHistory.length - 1 ? totalRedemptions : 0,
    }));
  }, [statsUsersData, brandStats]);

  // ======================
  // UI (NO SE TOCA)
  // ======================
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-2">
              {stores.length > 1 && (
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-full md:w-[200px] bg-white">
                    <Store className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder={t('filterStore')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allStores')}</SelectItem>
                    {stores.map(store => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.store_name || store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[200px] bg-white">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder={t('filterPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t('periodDefault')}</SelectItem>
                  <SelectItem value="7d">{t('period7d')}</SelectItem>
                  <SelectItem value="month">{t('periodMonth')}</SelectItem>
                  <SelectItem value="custom">{t('periodCustom')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title={t('Miembros')}
            value={membersCount}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            href={createPageUrl('Customers')}
            loading={membersClubsLoading}
          />
          <MetricCard
            title={t('Clubs Activos')}
            value={activePrograms}
            icon={CreditCard}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
            loading={membersClubsLoading}
          />
          <MetricCard
            title={t('stamps')}
            value={stampsCount}
            icon={QrCode}
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
            loading={stampsRewardsLoading}
          />
          <MetricCard
            title={t('rewards')}
            value={rewardsCount}
            icon={Gift}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            loading={stampsRewardsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StatsChart title={t('membersChartTitle')} data={chartData} dataKey="adds" color="#3B82F6" loading={stampsRewardsLoading} />
          <StatsChart title={t('stampsChartTitle')} data={chartData} dataKey="scans" color="#F59E0B" loading={stampsRewardsLoading} />
          <StatsChart title={t('rewardsChartTitle')} data={chartData} dataKey="redemptions" color="#8B5CF6" loading={stampsRewardsLoading} />
          {/* <StampsDistribution data={stampsDistribution} maxStamps={10} loading={stampsRewardsLoading} /> */}
        </div>
      </div>
    </div>
  );
}
