import { api } from "@/api/client";
import useProgramsStore from "@/stores/useProgramsStore";
import useStoresStore from "@/stores/useStoresStore";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/jwt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, LogOut, Crown, Mail, Globe, Lock, Store, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useLanguage } from "@/components/auth/LanguageContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import PricingModal from "@/components/subscription/PricingModal";
import { useEffect, useState } from "react";

export default function Profile() {
  const { t, language, changeLanguage } = useLanguage();
  const [showPricing, setShowPricing] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = getCurrentUser();
  const isLoading = false; // Ya no es asíncrono

  const brandId = localStorage.getItem('brand_id');
  const { stores, fetchStores } = useStoresStore();

  // Cargar stores para mostrar el nombre de sucursal
  useEffect(() => {
    if (brandId) fetchStores(brandId);
  }, [brandId]);

  // NOTA: api.brands.get() no existe en el YAML de Insomnia
  // const { data: brand } = useQuery({
  //   queryKey: ['brand', user?.brand_id],
  //   queryFn: () => api.brands.get(user.brand_id),
  //   enabled: !!user?.brand_id
  // });
  const brand = null; // No disponible - endpoint no existe en YAML

  // NOTA: api.entities.* no existe en el YAML - comentado
  // const { data: cards = [] } = useQuery({
  //   queryKey: ['loyaltyCards', user?.email],
  //   queryFn: () => api.entities.LoyaltyCard.filter({ created_by: user.email }, '-created_date'),
  //   enabled: !!user?.email,
  // });
  // const cards = []; // TODO: integrate when API endpoint exists

  // Buscar la sucursal asignada al usuario; si no tiene, mostrar la primera disponible
  const assignedBranchId = user?.assigned_branch_id || user?.branch_id;
  const userBranch = assignedBranchId
    ? stores.find(s => (s.store_id || s.id) === assignedBranchId)
    : stores[0];

  const resetPasswordMutation = useMutation({
    mutationFn: async (email) => {
      return await api.auth.resetPassword(email);
    },
    onSuccess: () => {
      toast.success('Se ha enviado un correo con las instrucciones para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el correo de restablecimiento';
      toast.error(errorMessage);
    }
  });

  const handleChangePassword = () => {
    if (!user?.email) {
      toast.error('No se pudo obtener tu correo electrónico. Por favor, intenta más tarde.');
      return;
    }
    resetPasswordMutation.mutate(user.email);
  };

  const handleLogout = async () => {
    try {
      // Eliminar token y claves de sesión del localStorage
      api.auth.logout();

      // Resetear stores de Zustand en memoria
      useProgramsStore.setState({ programs: [], lastModified: null });
      useStoresStore.setState({ stores: [] });

      // Limpiar todo el cache de React Query
      queryClient.clear();
      
      // Redirigir a la página de login
      navigate('/login', { replace: true });
      
      toast.success(t('logout') + ' exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="w-7 h-7 text-gray-700" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
              {t('profile')}
            </h1>
          </div>
          <p className="text-gray-600">{t('manageAccount')}</p>
        </motion.div>

        <div className="space-y-6">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.full_name || 'User'}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">{t('role')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                      {user?.type_user === 'brand_admin' ? t('admin') : t('employee')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Store className="w-4 h-4" />
                    <span className="text-sm">{t('store')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{userBranch?.store_name || userBranch?.name || t('unassigned')}</p>
                </div>
              </div>

              {/* DEBUG: Mostrar información del JWT */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 bg-gray-900 text-white rounded-xl p-4 text-xs font-mono overflow-auto max-h-96">
                  <div className="text-yellow-400 font-bold mb-2">🔍 DEBUG: Información del JWT</div>
                  <div className="space-y-1">
                    <div><span className="text-gray-400">type_user:</span> <span className="text-green-400">{user?.type_user || 'null'}</span></div>
                    <div><span className="text-gray-400">user_type:</span> <span className="text-green-400">{user?.user_type || 'null'}</span></div>
                    <div><span className="text-gray-400">user_id:</span> <span className="text-blue-400">{user?.user_id || 'null'}</span></div>
                    <div><span className="text-gray-400">email:</span> <span className="text-blue-400">{user?.email || 'null'}</span></div>
                    <div><span className="text-gray-400">full_name:</span> <span className="text-blue-400">{user?.full_name || 'null'}</span></div>
                    <div><span className="text-gray-400">brand_id:</span> <span className="text-purple-400">{user?.brand_id || 'null'}</span></div>
                    <div><span className="text-gray-400">branch_id:</span> <span className="text-purple-400">{user?.branch_id || 'null'}</span></div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-yellow-400 font-bold mb-2">JWT completo (desde localStorage):</div>
                      <div className="space-y-1 mb-2">
                        <div><span className="text-gray-400">user_type (del JWT):</span> <span className="text-green-400">{user?.user_type || 'null'}</span></div>
                      </div>
                      <details>
                        <summary className="cursor-pointer text-blue-400 hover:text-blue-300">Ver contenido completo del token</summary>
                        <pre className="mt-2 p-2 bg-black rounded overflow-auto">
                          {JSON.stringify(user, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border-0 shadow-lg space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">{t('settings')}</h3>

                {/* Language Selector */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('language')}</label>
                    <Select value={language} onValueChange={changeLanguage}>
                        <SelectTrigger>
                            <Globe className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue placeholder={t('selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Password Change */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('password')}</label>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleChangePassword}
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 text-gray-500 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2 text-gray-500" />
                          {t('changePassword')}
                        </>
                      )}
                    </Button>
                </div>
            </Card>
          </motion.div>

          {/* Subscription */}
          {user?.type_user === 'brand_admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('subscription')}</h3>
                  <Badge className="bg-emerald-100 text-emerald-700">{t('active')}</Badge>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-900 uppercase">
                        {brand?.subscription_plan || 'free'} PLAN
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 ml-8">
                    <li>• {t('planFeature1')}</li>
                    <li>• {t('planFeature2')}</li>
                    <li>• {t('planFeature3')}</li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setShowPricing(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {t('upgradePlan')}
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant="outline"
              className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              {t('logout')}
            </Button>
          </motion.div>
        </div>
      </div>
      <PricingModal open={showPricing} onOpenChange={setShowPricing} brand={brand} />
    </div>
  );
}