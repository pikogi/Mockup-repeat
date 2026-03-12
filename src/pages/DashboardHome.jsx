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
  eachDayOfInterval
} from 'date-fns';
import { useLanguage } from "@/components/auth/LanguageContext";

export default function DashboardHome() {
  const { t } = useLanguage();
  const [dateFilter, setDateFilter] = React.useState('default');
  const [customDate] = React.useState({
    from: new Date(),
    to: new Date(),
  });
  const [selectedStore, setSelectedStore] = React.useState('all');
  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me();
      return res?.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  // Usar el brand_id seleccionado de localStorage
  const brandIdFromStorage = localStorage.getItem('brand_id');
  const effectiveBrandId = brandIdFromStorage || me?.brands?.[0]?.brand_id;  

  // ⚠️ brand / cards aún no existen en backend

  const { stores: storesFromStore, fetchStores } = useStoresStore();
  const { programs: storedPrograms } = useProgramsStore();

  React.useEffect(() => {
    if (effectiveBrandId) fetchStores(effectiveBrandId);
  }, [effectiveBrandId, fetchStores]);

  const stores = storesFromStore;
  const storeId = selectedStore !== 'all' ? selectedStore : null;

  // Programas activos (se usa también para contar miembros)
  const { data: programsData = [] } = useQuery({
    queryKey: ['loyaltyPrograms', effectiveBrandId],
    queryFn: async () => {
      if (!effectiveBrandId) return [];
      const res = await api.loyaltyPrograms.list(effectiveBrandId);
      return res?.data || res || [];
    },
    enabled: !!effectiveBrandId,
    staleTime: 5 * 60 * 1000,
  });

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
    queryKey: ['brandStats', effectiveBrandId, storeId, dateFilter, customDateKey],
    queryFn: async () => {
      if (!effectiveBrandId) return null;
      const range = getDateRange();
      const from = format(range.start, 'yyyy-MM-dd');
      const to = format(addDays(range.end, 1), 'yyyy-MM-dd');
      const res = await api.brands.getStats(effectiveBrandId, { storeId, from, to });
      return res?.data || res || null;
    },
    enabled: !!effectiveBrandId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  // Build chart intervals: daily for ≤7 days, weekly for larger ranges
  // Reduces API calls from 30 → ~5 for the default 30-day range
  const getChartIntervals = (range) => {
    const days = eachDayOfInterval({ start: range.start, end: range.end });
    if (days.length <= 8) {
      return days.map(day => ({
        from: format(day, 'yyyy-MM-dd'),
        to: format(addDays(day, 1), 'yyyy-MM-dd'),
        date: format(day, 'yyyy-MM-dd'),
        label: format(day, 'EEE'),
        fullDate: format(day, 'd MMM yyyy'),
      }));
    }
    // Weekly intervals
    const result = [];
    let current = new Date(range.start);
    const rangeEnd = new Date(range.end);
    while (current <= rangeEnd) {
      const weekEnd = new Date(Math.min(addDays(current, 7).getTime(), addDays(rangeEnd, 1).getTime()));
      const weekLast = addDays(weekEnd, -1);
      result.push({
        from: format(current, 'yyyy-MM-dd'),
        to: format(weekEnd, 'yyyy-MM-dd'),
        date: format(current, 'yyyy-MM-dd'),
        label: format(current, 'MMM d'),
        fullDate: `${format(current, 'd MMM')} – ${format(weekLast, 'd MMM yyyy')}`,
      });
      current = weekEnd;
    }
    return result;
  };

  // Brand stats per interval — daily for ≤7d, weekly for larger ranges
  const { data: statsTransactionsData } = useQuery({
    queryKey: ['brandStatsTransactions', effectiveBrandId, dateFilter, customDateKey, storeId],
    queryFn: async () => {
      if (!effectiveBrandId) return [];
      const range = getDateRange();
      const intervals = getChartIntervals(range);
      const results = await Promise.all(
        intervals.map(async ({ from, to, date }) => {
          try {
            const res = await api.brands.getStats(effectiveBrandId, { from, to, storeId });
            const data = res?.data || res || {};
            return {
              date,
              stamps: data.transactions_by_type?.stamp_added ?? 0,
              redemptions: (data.total_completed_redemptions ?? 0) + (data.total_pending_redemptions ?? 0),
            };
          } catch {
            return { date, stamps: 0 };
          }
        })
      );
      return results;
    },
    enabled: !!effectiveBrandId,
    staleTime: 5 * 60 * 1000,
  });

  // Brand stats/users — time-series new members per day
  const { data: statsUsersData } = useQuery({
    queryKey: ['brandStatsUsers', effectiveBrandId, dateFilter, storeId],
    queryFn: async () => {
      if (!effectiveBrandId) return null;
      const range = getDateRange();
      const from = format(range.start, 'yyyy-MM-dd');
      const to = format(range.end, 'yyyy-MM-dd');
      const res = await api.brands.getStatsUsers(effectiveBrandId, { from, to, storeId });
      return res?.data || res || null;
    },
    enabled: !!effectiveBrandId,
    staleTime: 5 * 60 * 1000,
  });

  // Miembros — siempre brand-level, no filtrado por sucursal
  const { data: membersData = [], isLoading: membersLoading } = useQuery({
    queryKey: ['brandUsers', effectiveBrandId],
    queryFn: async () => {
      if (!effectiveBrandId) return [];
      const now = new Date();
      const fromDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const from = fromDate.toISOString().slice(0, 10);
      const to = toDate.toISOString().slice(0, 10);
      const res = await api.brands.getUsers(effectiveBrandId, { from, to });
      let raw = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const seen = new Set();
      return raw
        .filter(entry => {
          const id = entry.user_id || entry.card_id || entry.customer_id || entry.id || entry.customer?.id || entry.customer?.email;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .sort((a, b) => new Date(b.created_at || b.created_date || 0) - new Date(a.created_at || a.created_date || 0));
    },
    enabled: !!effectiveBrandId,
    staleTime: 5 * 60 * 1000,
  });

  const membersClubsLoading = meLoading || membersLoading;
  const stampsRewardsLoading = brandStatsLoading;

  // Miembros y clubes: siempre brand-level, nunca filtrados por sucursal
  const membersCount = membersData.length > 0 ? membersData.length : 0;
  // Usar el store Zustand para reflejar toggles optimistas al instante
  const programsSource = storedPrograms.length > 0 ? storedPrograms : programsData;
  const activePrograms = programsSource.filter(p => p.is_active !== false).length;

  // Sellos y premios: desde brandStats (una sola llamada, sin problemas de suma acumulada)
  const stampsCount = brandStats?.transactions_by_type?.stamp_added ?? 0;
  const rewardsCount = (brandStats?.total_completed_redemptions ?? 0) + (brandStats?.total_pending_redemptions ?? 0);

  const chartData = React.useMemo(() => {
    const range = getDateRange();
    const intervals = getChartIntervals(range);

    const userHistory = Array.isArray(statsUsersData)
      ? statsUsersData
      : Array.isArray(statsUsersData?.data)
        ? statsUsersData.data
        : [];

    const txByDate = Object.fromEntries(
      (Array.isArray(statsTransactionsData) ? statsTransactionsData : []).map(e => [e.date, e.stamps])
    );
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const totalRedemptions = (brandStats?.total_completed_redemptions ?? 0) + (brandStats?.total_pending_redemptions ?? 0);

    return intervals.map(({ from, to, date, label, fullDate }) => {
      const fromMembers = membersData.filter(m => {
        const d = (m.created_at || m.created_date || '').slice(0, 10);
        return d >= from && d < to;
      }).length;

      const fromStats = userHistory
        .filter(e => { const d = e.date || e.day || ''; return d >= from && d < to; })
        .reduce((sum, e) => sum + (e.new_users ?? e.count ?? e.total ?? 0), 0);

      return {
        date: label,
        fullDate,
        adds: Math.max(fromMembers, fromStats),
        reach: 0,
        scans: txByDate[date] ?? 0,
        redemptions: (todayStr >= from && todayStr < to) ? totalRedemptions : 0,
      };
    });
  }, [dateFilter, customDate, statsUsersData, statsTransactionsData, membersData, brandStats]);

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
