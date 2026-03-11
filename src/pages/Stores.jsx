import React, { useEffect, useMemo } from 'react';
import { getCurrentUser } from "@/utils/jwt";
import useStoresStore from "@/stores/useStoresStore";
import useProgramsStore from "@/stores/useProgramsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Store, Plus, MapPin, Trash2, Pencil, QrCode, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Stores() {
  // Obtener brandId directamente de jwt token
  const user = useMemo(() => getCurrentUser(), []);
  // Obtener brandId directamente de localStorage (patrón Onboarding)
  const brandId = localStorage.getItem('brand_id');

  // Usar el store de Zustand
  const { programs, fetchPrograms } = useProgramsStore();

  const {
    stores,
    isLoading,
    isDialogOpen,
    isQrOpen,
    editingStore,
    selectedQrStore,
    formData,
    isCreating,
    isUpdating,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    isDeletingStore,
    setDialogOpen,
    setQrOpen,
    setEditingStore,
    setSelectedQrStore,
    setFormData,
    resetForm,
  } = useStoresStore();

  // Cargar stores y programas al montar el componente
  useEffect(() => {
    if (brandId) {
      fetchStores(brandId);
      fetchPrograms(brandId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brandId && !editingStore) {
      toast.error('Error de autenticación. Por favor, recarga la página.');
      return;
    }
    if (editingStore) {
      updateStore(editingStore.id, formData);
    } else {
      createStore(brandId, formData);
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    // Convertir números a números para inputs (patrón Onboarding)
    setFormData({
      name: store.store_name || '',
      address: store.address || '',
      city: store.city || '',
      lat: store.latitude || 0,
      lng: store.longitude || 0
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleShowQr = (store) => {
    setSelectedQrStore(store);
    setQrOpen(true);
  };

  const getQrUrl = () => {
    if (!selectedQrStore) return '';
    const brandId = localStorage.getItem('brand_id');
    const storeId = selectedQrStore.store_id || selectedQrStore.id;
    const activeIds = programs
      .filter(p =>
        p.is_active !== false &&
        (p.store_ids?.length === 0 || p.store_ids?.includes(storeId))
      )
      .map(p => p.program_id || p.id)
      .filter(Boolean);
    const params = new URLSearchParams({ brand: brandId });
    if (activeIds.length > 0) params.set('p', activeIds.join(','));
    return `${window.location.origin}/store/${storeId}?${params}`;
  };

  // Guards
  if (!user || user.type_user !== 'brand_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Access Denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8 text-gray-700" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
                  Sucursales
                </h1>
              </div>
              <p className="text-gray-600">Gestiona las ubicaciones de tu negocio</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0">
                  <Plus className="w-5 h-5" />
                  Nueva Sucursal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStore ? 'Editar Sucursal' : 'Nueva Sucursal'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Ej. Centro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      placeholder="Av. Principal 123"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Ciudad de México"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitud</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        placeholder="Ej: -34.6037"
                        value={formData.lat || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, lat: val === '' ? 0 : Number(val) });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitud</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        placeholder="Ej: -58.3816"
                        value={formData.lng || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, lng: val === '' ? 0 : Number(val) });
                        }}
                      />
                    </div>
                  </div>
                  {/* Geolocalización - comentado temporalmente
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setFormData({
                            ...formData,
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                          });
                          toast.success('Ubicación actual obtenida');
                        },
                        (error) => {
                          toast.error('No se pudo obtener la ubicación. Por favor, ingrésala manualmente.');
                          console.error('Error de geolocalización:', error);
                        }
                      );
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Usar mi ubicación actual
                  </Button>
                  */}
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isCreating || isUpdating}>
                      {editingStore ? 'Guardar Cambios' : 'Crear Sucursal'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {isLoading ? (
          <Card className="p-12 text-center bg-gray-50 border-dashed">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando sucursales...</h3>
          </Card>
        ) : stores.length === 0 ? (
          <Card className="p-12 text-center bg-gray-50 border-dashed">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay sucursales</h3>
            <p className="text-gray-500 mb-6">Aún no has creado ninguna sucursal. Usa el botón "Crear Sucursal" para comenzar.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow group relative h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Store className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(store)}
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-red-600"
                            disabled={isDeletingStore(store.id)}
                          >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la sucursal "{store.store_name || store.name}" y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeletingStore(store.id)}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const storeIdToDelete = store.store_id || store.id;
                                if (!storeIdToDelete) {
                                  toast.error('No se pudo obtener el ID de la sucursal');
                                  return;
                                }
                                deleteStore(storeIdToDelete);
                              }}
                              disabled={isDeletingStore(store.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {isDeletingStore(store.id) ? 'Eliminando...' : 'Eliminar'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{store.store_name || store.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 flex-1">
                    {store.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{store.address}</span>
                      </div>
                    )}
                    {store.city && (
                      <div className="pl-6">
                        <span>{store.city}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400">ID: {String(store.id || '').slice(0, 8) || 'N/A'}...</span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleShowQr(store)}
                    >
                        <QrCode className="w-4 h-4" />
                        Ver QR
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* QR Dialog */}
        <Dialog open={isQrOpen} onOpenChange={setQrOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">QR de Sucursal</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-4">
                    {selectedQrStore && (
                        <>
                            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getQrUrl())}`} 
                                    alt="Store QR Code" 
                                    className="w-48 h-48"
                                />
                            </div>
                            <div className="text-center text-sm text-gray-500">
                                <p className="font-medium text-gray-900">{selectedQrStore.store_name || selectedQrStore.name}</p>
                                {getQrUrl() ? (
                                <p className="text-xs mt-1 break-all">{getQrUrl()}</p>
                              ) : (
                                <p className="text-xs mt-1 text-gray-400 italic">URL no disponible</p>
                              )}
                                <p className="text-xs text-gray-400 mt-2">
                                    Escanea para ver los clubes disponibles
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button 
                        variant="secondary" 
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(getQrUrl())}`;
                            link.download = `qr-${selectedQrStore?.store_name || selectedQrStore?.name}.png`;
                            link.target = '_blank';
                            link.click();
                        }}
                        className="gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Descargar QR
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}