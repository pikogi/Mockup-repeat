import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getCurrentUser } from "@/utils/jwt";
import useProgramsStore from "@/stores/useProgramsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, CreditCard } from 'lucide-react';
import ProgramListItem from '../components/programs/ProgramListItem';
import { motion } from "framer-motion";
import { useLanguage } from "@/components/auth/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export default function MyPrograms() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const user = useMemo(() => getCurrentUser(), []);

  // Usar el brand_id seleccionado de localStorage
  const brandId = localStorage.getItem('brand_id');

  // Obtener datos de marca desde /auth/me
  const { data: meData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me();
      return res?.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const brand = meData?.brands?.find(b => b.brand_id === brandId) || meData?.brands?.[0] || null;

  // Usar el store de Zustand
  const {
    programs,
    isLoading,
    fetchPrograms,
    toggleProgramActive,
    deleteProgram,
    isDeletingProgram,
  } = useProgramsStore();

  // Cargar programas al montar el componente
  useEffect(() => {
    if (brandId) {
      fetchPrograms(brandId);
    }
  }, [brandId, fetchPrograms]);

  // Mapear programas al formato esperado por los componentes
  const cards = programs.map(program => ({
    id: program.program_id || program.id,
    club_name: program.program_name,
    card_title: program.program_name,
    description: program.description,
    logo_url: program.program_rules?.logo_url || '',
    card_color: program.wallet_design?.hex_background_color || program.program_rules?.card_color || '#000000',
    gradient_color: program.program_rules?.gradient_color || '#F59E0B',
    reward_text: program.reward_description,
    reward_tiers: program.reward_rules?.reward_tiers || [],
    terms: program.program_rules?.terms || '',
    stamps_required: program.program_rules?.stamps_required || 10,
    is_active: program.is_active !== false,
    contact_email: program.program_rules?.contact_email || '',
    contact_phone: program.program_rules?.contact_phone || '',
    website: program.program_rules?.website || '',
    security_ticket_required: program.program_rules?.security_ticket_required || false,
    security_geofence_required: program.program_rules?.security_geofence_required || false,
    security_cooldown_hours: program.program_rules?.security_cooldown_hours || 0,
    validity_stamps_days: program.program_rules?.validity_stamps_days || 0,
    validity_reward_days: program.program_rules?.validity_reward_days || 0,
    validity_duration_days: program.program_rules?.validity_duration_days || 0,
    collect_name: program.program_rules?.collect_name !== false,
    collect_email: program.program_rules?.collect_email !== false,
    collect_phone: program.program_rules?.collect_phone || false,
    collect_birthday: program.program_rules?.collect_birthday || false,
    created_date: program.created_date || program.start_date,
  }));

  // Memoize program IDs for stable query keys
  const programIds = useMemo(() => programs.map(p => p.program_id || p.id).filter(Boolean), [programs]);
  const programIdsKey = useMemo(() => programIds.join(','), [programIds]);

  // Contar miembros por programa usando ventanas de 3 meses (backend limita a 4 meses max)
  const { data: memberCounts = {} } = useQuery({
    queryKey: ['programMemberCounts', brandId, programIdsKey],
    queryFn: async () => {
      if (!brandId || programs.length === 0) return {};

      const now = new Date();
      const windows = Array.from({ length: 4 }, (_, i) => {
        const end = new Date(now.getFullYear(), now.getMonth() - i * 3, now.getDate() + 1);
        const start = new Date(now.getFullYear(), now.getMonth() - i * 3 - 3, now.getDate());
        return {
          from: start.toISOString().slice(0, 10),
          to: end.toISOString().slice(0, 10),
        };
      });

      const counts = {};
      await Promise.all(
        programs.map(async (program) => {
          const pid = program.program_id || program.id;
          if (!pid) return;
          const userIds = new Set();
          await Promise.all(
            windows.map(({ from, to }) =>
              api.brands.getUsers(brandId, { programId: pid, from, to })
                .then(r => {
                  const items = Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : [];
                  items.forEach(u => { if (u.user_id || u.id) userIds.add(u.user_id || u.id); });
                })
                .catch(() => {})
            )
          );
          counts[pid] = userIds.size;
        })
      );
      return counts;
    },
    enabled: !!brandId && programs.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const filteredCards = cards.filter(card =>
    card.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.card_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (card) => {
    navigate(createPageUrl('CreateClub') + `?edit=${card.id}`);
  };

  const handleToggleActive = (card, newValue) => {
    const programId = card.id;
    if (!programId) return;
    toggleProgramActive(programId, newValue);
  };

  const handleDelete = (cardId) => {
    if (!cardId) return;
    deleteProgram(cardId);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-gray-700" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
                  {t('myPrograms')}
                </h1>
              </div>
              <p className="text-gray-600">{t('myProgramsSubtitle')}</p>
            </div>
          </div>

          {/* Search */}
          {(cards.length > 0 || isLoading) && (
            <div className="flex flex-col gap-4 max-w-md">
              <Link to={createPageUrl('CreateClub')} className="w-full md:w-fit md:hidden">
                <Button size="lg" className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0">
                  <Plus className="w-5 h-5" />
                  {t('Crear Club')}
                </Button>
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={t('Buscar Clubes')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-yellow-500"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Cards List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Bloque de color izquierdo */}
                  <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200 animate-pulse flex-shrink-0" />
                  {/* Info derecha */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="w-64 h-4 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                      <div className="w-24 h-6 bg-gray-100 rounded-full animate-pulse" />
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="w-3/4 h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('noProgramsTitle')}</h3>
              <p className="text-gray-600 mb-6">{t('noProgramsDesc')}</p>
              <Link to={createPageUrl('CreateClub')}>
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black gap-2">
                  <Plus className="w-5 h-5" />
                  {t('createFirstProgram')}
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <ProgramListItem
                key={card.id}
                card={card}
                brand={brand}
                currentUser={user}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
                memberCount={memberCounts[card.id] || 0}
                isDeleting={isDeletingProgram(card.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
