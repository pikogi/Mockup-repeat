import React, { useState } from 'react';
import { api } from "@/api/client";
import { getCurrentUser } from "@/utils/jwt";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Users, Calendar, CreditCard, Mail, Smartphone, Stamp, TrendingUp, Gift, ArrowUpDown } from 'lucide-react';
import { motion } from "framer-motion";
import { format } from 'date-fns';
import CustomerDetailModal from '../components/customers/CustomerDetailModal';
import { useLanguage } from "@/components/auth/LanguageContext";

function CustomerCard({ member, brandId, userData, onClick }) {
  const { t } = useLanguage();

  const displayName = member.full_name || member.email || '?';
  const displayEmail = member.email || '';
  const displayPhone = member.phone;
  const displayDate = member.created_at;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      {/* Info row existente */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <span className="font-bold text-indigo-600 text-lg">
              {displayName[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{displayName}</p>
            {displayEmail && displayEmail !== displayName && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />{displayEmail}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-0.5">
              {member.programs?.length > 0 && (
                <span>{member.programs.map(p => p.program_name).join(', ')}</span>
              )}
              {displayPhone && (
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />{displayPhone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {displayDate ? format(new Date(displayDate), 'MMM d, yyyy') : '—'}
          </p>
          <p className="text-xs text-gray-400">Miembro desde</p>
        </div>
      </div>

      {/* Stats section */}
      {userData ? (
        userData.loyalty_cards?.map((lc) => {
          const stampsRequired = lc.program?.program_rules?.stamps_required ?? 10;
          const currentStamps = lc.current_balance ?? 0;
          const totalVisits = lc.total_visits ?? 0;
          const rewardsRedeemed = lc.redemptions?.length || 0;
          const progressPct = Math.min(100, (currentStamps / stampsRequired) * 100);
          return (
            <div key={lc.card_id} className="mt-3 pt-3 border-t border-gray-100">
              {userData.loyalty_cards.length > 1 && (
                <p className="text-xs font-semibold text-indigo-600 mb-1">{lc.program?.program_name}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Stamp className="w-3.5 h-3.5 text-amber-500" />
                  <strong>{currentStamps}</strong> sellos
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  <strong>{totalVisits}</strong> visitas
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-green-500" />
                  <strong>{rewardsRedeemed}</strong> premios
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {currentStamps}/{stampsRequired} sellos al próximo premio
              </p>
            </div>
          );
        })
      ) : (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-1.5 bg-gray-100 rounded-full animate-pulse" />
        </div>
      )}
    </Card>
  );
}

export default function Customers() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const initialStamps = urlParams.get('stamps');

  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCard, setSelectedCard] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedStampRange, setSelectedStampRange] = useState(initialStamps || 'all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortBy, setSortBy] = useState('date');

  const user = getCurrentUser();

  // Obtener brand_id desde /auth/me
  const { data: meData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me();
      return res?.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Usar el brand_id seleccionado de localStorage
  const brandIdFromStorage = localStorage.getItem('brand_id');
  const brandId = brandIdFromStorage || meData?.brands?.[0]?.brand_id;

  // Consultar programas de lealtad
  const { data: programs = [], isFetched: programsFetched } = useQuery({
    queryKey: ['loyaltyPrograms', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const res = await api.loyaltyPrograms.list(brandId);
      return res?.data || res || [];
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });

  // Mapear programas al formato esperado por el componente
  const cards = programs.map(program => ({
    id: program.program_id || program.id,
    club_name: program.program_name,
    card_title: program.program_name,
  }));

  const programIds = programs.map(p => p.program_id || p.id).filter(Boolean);

  const { data: members = [], isLoading: membersLoading, isError: membersError } = useQuery({
    queryKey: ['brandUsers', brandId, programIds.join(',')],
    queryFn: async () => {
      if (!brandId) return [];

      // El backend requiere from/to y limita el rango a 4 meses máximo.
      // Generamos ventanas de 3 meses para cubrir el último año.
      const now = new Date();
      const windows = Array.from({ length: 4 }, (_, i) => {
        const end = new Date(now.getFullYear(), now.getMonth() - i * 3, now.getDate() + 1);
        const start = new Date(now.getFullYear(), now.getMonth() - i * 3 - 3, now.getDate());
        return {
          from: start.toISOString().slice(0, 10),
          to: end.toISOString().slice(0, 10),
        };
      });

      let allEntries = [];

      if (programIds.length > 0) {
        // Llamar por programa (solo ventana más reciente para limitar requests)
        const { from, to } = windows[0];
        const perProgramResults = await Promise.all(
          programIds.map(pid =>
            api.brands.getUsers(brandId, { programId: pid, from, to })
              .then(r => {
                const items = Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : [];
                const program = programs.find(p => (p.program_id || p.id) === pid);
                return items.map(entry => ({
                  ...entry,
                  _programId: pid,
                  _programName: program?.program_name,
                  _programRules: program?.program_rules,
                }));
              })
              .catch(() => [])
          )
        );
        allEntries = perProgramResults.flat();

        // Siempre incluir call general para no perder usuarios que no matcheen
        // ningún program_id específico (los per-program tienen prioridad en el dedup)
        const generalRes = await api.brands.getUsers(brandId, { from, to }).catch(() => ({ data: [] }));
        const generalEntries = Array.isArray(generalRes?.data) ? generalRes.data : Array.isArray(generalRes) ? generalRes : [];
        allEntries = [...allEntries, ...generalEntries];
      }

      // Fallback: ventanas sin filtro de programa para cubrir todo el historial
      if (allEntries.length === 0) {
        const windowResults = await Promise.all(
          windows.map(({ from, to }) =>
            api.brands.getUsers(brandId, { from, to })
              .then(r => Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : [])
              .catch(() => [])
          )
        );
        allEntries = windowResults.flat();
      }

      const userMap = new Map();
      allEntries.forEach(entry => {
        const id = entry.email || entry.user_id || entry.id;
        if (!id) return;
        if (!userMap.has(id)) {
          userMap.set(id, {
            user_id: entry.user_id || entry.id,
            full_name: entry.full_name || entry.customer_full_name || null,
            email: entry.email || null,
            phone: entry.phone_number || entry.phone || null,
            created_at: entry.created_at || entry.created_date,
            programs: [],
          });
        }
        if (entry._programId) {
          const user = userMap.get(id);
          if (!user.programs.some(p => p.program_id === entry._programId)) {
            user.programs.push({
              program_id: entry._programId,
              program_name: entry._programName,
              program_rules: entry._programRules,
            });
          }
        }
      });
      return Array.from(userMap.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
    enabled: !!brandId && programsFetched,
    staleTime: 5 * 60 * 1000,
  });

  // Get unique months from members
  const months = [...new Set(members.map(m => {
    const date = new Date(m.created_at);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))].sort().reverse();

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery ||
      (member.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone || '').includes(searchQuery);

    const memberDate = new Date(member.created_at);
    const memberMonth = `${memberDate.getFullYear()}-${String(memberDate.getMonth() + 1).padStart(2, '0')}`;
    const matchesMonth = selectedMonth === 'all' || memberMonth === selectedMonth;

    const matchesCard = selectedCard === 'all' || member.programs?.some(p => p.program_id === selectedCard);

    return matchesSearch && matchesMonth && matchesCard;
  });

  // Prefetch user stats for all filtered members when sorting by stamps or visits
  const userStatsQueries = useQueries({
    queries: filteredMembers.map(member => ({
      queryKey: ['userStats', brandId, member.user_id],
      queryFn: async () => {
        const res = await api.brands.getStatsUser(brandId, member.user_id);
        return res?.data || res;
      },
      enabled: !!brandId && !!member.user_id,
      staleTime: 2 * 60 * 1000,
    })),
  });

  const userStatsMap = React.useMemo(() => {
    const map = {};
    filteredMembers.forEach((member, idx) => {
      if (userStatsQueries[idx]?.data) {
        map[member.user_id] = userStatsQueries[idx].data;
      }
    });
    return map;
  }, [filteredMembers, userStatsQueries]);

  const sortedMembers = React.useMemo(() => {
    if (sortBy === 'date') {
      return [...filteredMembers].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
    return [...filteredMembers].sort((a, b) => {
      const aData = userStatsMap[a.user_id];
      const bData = userStatsMap[b.user_id];
      if (sortBy === 'stamps') {
        return (bData?.loyalty_cards?.[0]?.current_balance ?? 0) - (aData?.loyalty_cards?.[0]?.current_balance ?? 0);
      }
      if (sortBy === 'visits') {
        return (bData?.loyalty_cards?.[0]?.total_visits ?? 0) - (aData?.loyalty_cards?.[0]?.total_visits ?? 0);
      }
      return 0;
    });
  }, [filteredMembers, sortBy, userStatsMap]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
              {t('customers')}
            </h1>
          </div>
          <p className="text-gray-600">{t('customersSubtitle')}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('searchEmail')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200"
            />
          </div>

          {/* Month Filter */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="h-10 rounded-xl w-40">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder={t('filterMonth')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allMonths')}</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month}>
                  {format(new Date(month + '-01'), 'MMMM yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Card Filter */}
          <Select value={selectedCard} onValueChange={setSelectedCard}>
            <SelectTrigger className="h-10 rounded-xl w-40">
              <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder={t('filterProgram')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allPrograms')}</SelectItem>
              {cards.map(card => (
                <SelectItem key={card.id} value={card.id}>
                  {card.club_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 rounded-xl w-44">
              <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">Ordenar por</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha registro</SelectItem>
              <SelectItem value="stamps">Sellos actuales</SelectItem>
              <SelectItem value="visits">Visitas totales</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            {t('showingCustomers')} <span className="font-semibold text-gray-900">{sortedMembers.length}</span> {t('customersCount')}
          </p>
        </motion.div>

        {/* Customers List */}
        {(!programsFetched || membersLoading) ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                    <div className="space-y-2">
                      <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-48 h-3 bg-gray-100 rounded animate-pulse" />
                      <div className="w-28 h-3 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-14 h-3 bg-gray-100 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : membersError ? (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error cargando miembros</h3>
            <p className="text-gray-500 text-sm">Revisa la consola del navegador (F12) para más detalles.</p>
          </Card>
        ) : sortedMembers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noCustomersTitle')}</h3>
            <p className="text-gray-500">{t('noCustomersDesc')}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedMembers.map((member, index) => (
              <motion.div
                key={member.user_id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CustomerCard
                  member={member}
                  brandId={brandId}
                  userData={userStatsMap[member.user_id]}
                  onClick={() => setSelectedCustomer(member)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Customer Detail Modal */}
        <CustomerDetailModal
          customer={selectedCustomer}
          brandId={brandId}
          onClose={() => setSelectedCustomer(null)}
        />
      </div>
    </div>
  );
}