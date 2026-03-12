import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Gift, Loader2, ChevronRight, Store } from 'lucide-react';


export default function PublicStore() {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brand');
  const programIdsParam = searchParams.get('p');
  const programIds = programIdsParam ? programIdsParam.split(',').filter(Boolean) : [];

  const { data: brandData } = useQuery({
    queryKey: ['publicBrand', brandId],
    queryFn: async () => {
      if (!brandId) return null;
      try {
        const res = await api.brands.getPublic(brandId);
        return res?.data || res;
      } catch {
        return null;
      }
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: programs = [], isLoading, error } = useQuery({
    queryKey: ['publicStorePrograms', storeId, programIdsParam],
    queryFn: async () => {
      if (programIds.length === 0) return [];
      const results = await Promise.all(
        programIds.map(id =>
          api.loyaltyPrograms.getPublic(id).then(res => res?.data || res).catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
    enabled: programIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const brandName = brandData?.brand_name || brandData?.name || '';
  const logoUrl = brandId ? api.images.getLogoUrl(brandId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !brandId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md shadow-xl border-0">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sucursal no encontrada</h2>
          <p className="text-gray-600">No pudimos cargar los programas de esta sucursal.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="w-full bg-black py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt={brandName}
              className="w-20 h-20 object-contain rounded-2xl mx-auto mb-4 bg-white p-1"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          {brandName && (
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">{brandName}</p>
          )}
          <h1 className="text-2xl font-bold text-white">Nuestros Clubes de Fidelidad</h1>
          <p className="text-white/60 text-sm mt-2">Elegí el programa al que querés unirte</p>
        </motion.div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {programs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-10 text-center border-0 shadow-lg">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Sin programas activos</h2>
              <p className="text-gray-500 text-sm">Esta sucursal no tiene clubes de fidelidad activos en este momento.</p>
            </Card>
          </motion.div>
        ) : (
          programs.map((program, i) => {
            const programId = program.program_id || program.id;
            const color = program.wallet_design?.hex_background_color || program.program_rules?.card_color || '#000000';
            const stampsRequired = program.stamps_required || program.program_rules?.stamps_required || 10;
            const href = `/publicprogram?id=${programId}&brand_id=${brandId}`;

            return (
              <motion.a
                key={programId}
                href={href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="block"
              >
                <Card className="p-5 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate">{program.program_name}</h3>
                      {program.reward_description && (
                        <p className="text-sm text-gray-500 truncate">{program.reward_description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">{stampsRequired} sellos para tu recompensa</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" />
                  </div>
                </Card>
              </motion.a>
            );
          })
        )}

        <div className="text-center py-6 text-gray-400 text-sm">
          Powered by Repeat.la
        </div>
      </div>
    </div>
  );
}
