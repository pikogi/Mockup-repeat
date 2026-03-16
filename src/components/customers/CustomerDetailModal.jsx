import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, CreditCard, Stamp, Gift, Calendar, TrendingUp, Smartphone, Cake, Loader2, Plus, CheckCircle2, Store } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useStoresStore from "@/stores/useStoresStore";

const CONFETTI_PIECES = [
  { left: '8%',  color: '#22c55e', w: 8,  h: 10, rotate: 120,  dur: 1.2, delay: 0    },
  { left: '18%', color: '#86efac', w: 6,  h: 8,  rotate: -80,  dur: 1.5, delay: 0.1  },
  { left: '28%', color: '#4ade80', w: 10, h: 6,  rotate: 200,  dur: 1.3, delay: 0.2  },
  { left: '38%', color: '#16a34a', w: 7,  h: 9,  rotate: -150, dur: 1.6, delay: 0.05 },
  { left: '48%', color: '#bbf7d0', w: 9,  h: 7,  rotate: 90,   dur: 1.4, delay: 0.15 },
  { left: '58%', color: '#22c55e', w: 6,  h: 10, rotate: -200, dur: 1.2, delay: 0.3  },
  { left: '68%', color: '#4ade80', w: 8,  h: 6,  rotate: 160,  dur: 1.7, delay: 0    },
  { left: '78%', color: '#86efac', w: 10, h: 8,  rotate: -90,  dur: 1.3, delay: 0.2  },
  { left: '88%', color: '#16a34a', w: 7,  h: 7,  rotate: 240,  dur: 1.5, delay: 0.1  },
  { left: '13%', color: '#22c55e', w: 9,  h: 5,  rotate: -180, dur: 1.6, delay: 0.25 },
  { left: '23%', color: '#4ade80', w: 5,  h: 9,  rotate: 100,  dur: 1.4, delay: 0.35 },
  { left: '43%', color: '#bbf7d0', w: 8,  h: 7,  rotate: -120, dur: 1.2, delay: 0.4  },
  { left: '63%', color: '#22c55e', w: 7,  h: 10, rotate: 180,  dur: 1.8, delay: 0.05 },
  { left: '73%', color: '#86efac', w: 10, h: 6,  rotate: -60,  dur: 1.3, delay: 0.3  },
  { left: '83%', color: '#4ade80', w: 6,  h: 8,  rotate: 300,  dur: 1.5, delay: 0.15 },
  { left: '33%', color: '#dcfce7', w: 8,  h: 8,  rotate: -240, dur: 1.4, delay: 0.45 },
  { left: '53%', color: '#15803d', w: 7,  h: 5,  rotate: 80,   dur: 1.6, delay: 0.35 },
  { left: '93%', color: '#4ade80', w: 5,  h: 9,  rotate: -300, dur: 1.3, delay: 0.2  },
  { left: '3%',  color: '#86efac', w: 9,  h: 7,  rotate: 220,  dur: 1.7, delay: 0.1  },
  { left: '73%', color: '#22c55e', w: 6,  h: 6,  rotate: -140, dur: 1.5, delay: 0.5  },
];

export default function CustomerDetailModal({ customer, brandId, onClose }) {
  const queryClient = useQueryClient();
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const userId = customer?.user_id;

  const { stores, fetchStores } = useStoresStore();

  useEffect(() => {
    if (brandId) fetchStores(brandId);
  }, [brandId]);

  // Auto-seleccionar tienda: valida localStorage contra las tiendas cargadas
  useEffect(() => {
    if (stores.length === 0) return;
    const stored = localStorage.getItem('operating_branch_id');
    const isValid = stored && stores.some(s => (s.store_id || s.id) === stored);
    if (isValid) {
      setSelectedStore(stored);
    } else if (stores.length === 1) {
      const storeId = stores[0].store_id || stores[0].id;
      setSelectedStore(storeId);
      localStorage.setItem('operating_branch_id', storeId);
    }
  }, [stores]);

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId);
    localStorage.setItem('operating_branch_id', storeId);
  };

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userStats', brandId, userId],
    queryFn: async () => {
      const res = await api.brands.getStatsUser(brandId, userId);
      return res?.data || res;
    },
    enabled: !!brandId && !!userId,
  });

  // Auto-seleccionar card: si solo hay una, usarla directamente
  const autoSelectedCardId = userData?.loyalty_cards?.length === 1
    ? userData.loyalty_cards[0].card_id
    : selectedCardId;

  useEffect(() => {
    if (!showRedeemSuccess) return;
    const timer = setTimeout(() => setShowRedeemSuccess(false), 2500);
    return () => clearTimeout(timer);
  }, [showRedeemSuccess]);

  const multipleCards = (userData?.loyalty_cards?.length ?? 0) > 1;
  // Si hay múltiples cards, solo mostrar la elegida. Si hay una sola, usarla directamente.
  const activeCard = userData?.loyalty_cards?.find(lc => lc.card_id === autoSelectedCardId) ?? (multipleCards ? null : userData?.loyalty_cards?.[0]);

  const customerName = userData?.full_name || customer?.full_name || 'Cliente';
  const customerEmail = userData?.email || customer?.email || 'Sin correo registrado';
  const customerPhone = userData?.phone || customer?.phone;
  const customerCreatedAt = userData?.registered_at || customer?.created_at;
  const customerBirthDate = userData?.birth_date;

  // Mismo flujo que ScanQR: transactions.create + regenerar imagen
  const addStampMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStore) throw new Error('Seleccioná una sucursal antes de agregar el sello.');
      if (!autoSelectedCardId) throw new Error('No se encontró la tarjeta del cliente.');

      await api.transactions.create(autoSelectedCardId, selectedStore, 'stamp_added', 'stamp', 1);

      const programId = activeCard?.program?.program_id;
      if (programId) {
        const prevImages = (() => {
          try { return JSON.parse(localStorage.getItem(`program_images_${programId}`) || '{}'); }
          catch { return {}; }
        })();
        if (prevImages.background || prevImages.stamp || prevImages.logo) {
          api.images.createStampCard(
            programId,
            prevImages.background || null,
            prevImages.stamp      || null,
            prevImages.logo       || null,
            prevImages.color      || '#ffffff',
          ).catch(() => {});
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats', brandId, userId] });
      queryClient.invalidateQueries({ queryKey: ['brandUsers'] });
      setIsConfirming(false);
      setShowSuccess(true);
    },
    onError: (err) => {
      setIsConfirming(false);
      toast.error(err.message || 'Error al agregar sello');
    },
  });

  const redeemMutation = useMutation({
    mutationFn: async (redemptionId) => {
      await api.redemptions.update(redemptionId, 'completed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats', brandId, userId] });
      setShowRedeemSuccess(true);
    },
    onError: (err) => {
      toast.error(err.message || 'Error al canjear el premio');
    },
  });

  if (!customer) return null;

  return (
    <Dialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <div className="relative">
        <AnimatePresence>
          {showRedeemSuccess && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Confetti */}
              {CONFETTI_PIECES.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-sm"
                  style={{ width: p.w, height: p.h, backgroundColor: p.color, left: p.left, top: -12 }}
                  animate={{ y: 520, rotate: p.rotate, opacity: [1, 1, 0] }}
                  transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
                />
              ))}

              {/* Message */}
              <motion.div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-gray-900 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ¡Premio Canjeado!
              </motion.h3>
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {customerName}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detalle del Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{customerName}</p>
                <p className="text-sm text-gray-500">{customerEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {customerCreatedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Se unió: <strong>{format(new Date(customerCreatedAt), 'dd MMM yyyy')}</strong></span>
                </div>
              )}

              {customerPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Smartphone className="w-4 h-4" />
                  <span>Cel: <strong>{customerPhone}</strong></span>
                </div>
              )}

              {customerBirthDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Cake className="w-4 h-4" />
                  <span>Cumple: <strong>{format(new Date(customerBirthDate), 'dd MMM')}</strong></span>
                </div>
              )}

            </div>
          </div>

          {/* Program selector (arriba, solo si hay múltiples) */}
          {multipleCards && (
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Select value={selectedCardId || ''} onValueChange={setSelectedCardId}>
                <SelectTrigger className="h-10 flex-1">
                  <SelectValue placeholder="Seleccioná un programa" />
                </SelectTrigger>
                <SelectContent>
                  {userData?.loyalty_cards?.map(lc => (
                    <SelectItem key={lc.card_id} value={lc.card_id}>
                      {lc.program?.program_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Stats del programa seleccionado */}
          {userLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : multipleCards && !activeCard ? (
            <p className="text-sm text-gray-400 text-center py-2">Seleccioná un programa para ver las métricas</p>
          ) : activeCard ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                    <Stamp className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{activeCard.current_balance ?? 0}</p>
                  <p className="text-xs text-gray-500">Sellos Actuales</p>
                </Card>
                <Card className="p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{activeCard.total_visits ?? 0}</p>
                  <p className="text-xs text-gray-500">Visitas Totales</p>
                </Card>
                <Card className="p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{activeCard.redemptions?.filter(r => r.status === 'completed').length || 0}</p>
                  <p className="text-xs text-gray-500">Premios Canjeados</p>
                </Card>
              </div>
              <Card className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Progreso al próximo premio</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((activeCard.current_balance ?? 0) / (activeCard.program?.program_rules?.stamps_required ?? 10)) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {activeCard.current_balance ?? 0} de {activeCard.program?.program_rules?.stamps_required ?? 10} sellos
                </p>
              </Card>
            </div>
          ) : null}

          {/* Pending redemption banner */}
          {(() => {
            const pending = activeCard?.redemptions?.find(r => r.status === 'pending');
            if (!pending) return null;
            return (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Premio pendiente de canje</span>
                </div>
                <p className="text-xs text-green-700 mb-2">{activeCard.program?.reward_description}</p>
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => redeemMutation.mutate(pending.redemption_id)}
                  disabled={redeemMutation.isPending}
                >
                  {redeemMutation.isPending
                    ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    : null}
                  Canjear Premio
                </Button>
              </div>
            );
          })()}

          {/* Store indicator / selector */}
          {stores.length > 0 && (
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {stores.length === 1 ? (
                <span className="text-sm text-gray-700">
                  {stores[0].store_name || stores[0].name}
                </span>
              ) : (
                <Select value={selectedStore || ''} onValueChange={handleStoreSelect}>
                  <SelectTrigger className="h-10 flex-1">
                    <SelectValue placeholder="Seleccioná una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.store_id || store.id} value={store.store_id || store.id}>
                        {store.store_name || store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Add Stamp Button with Confirmation */}
          <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                disabled={addStampMutation.isPending || userLoading || !selectedStore || !autoSelectedCardId}
              >
                {addStampMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {addStampMutation.isPending ? 'Agregando...' : 'Agregar Sello Manualmente'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Estás a punto de agregar un sello manualmente a {customerName}.
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => addStampMutation.mutate()}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Success Dialog */}
          <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
            <AlertDialogContent className="sm:max-w-xs">
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center text-xl">¡Sello Entregado!</AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Se agregó un sello a {customerName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter className="sm:justify-center">
                <AlertDialogAction onClick={() => setShowSuccess(false)} className="w-full">
                  Aceptar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
