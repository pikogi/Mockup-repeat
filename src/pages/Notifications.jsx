import { useState } from 'react';
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getCurrentUser } from "@/utils/jwt";
import { Bell, Send, Clock, CheckCircle, AlertCircle, Loader2, History, Mail, Users, Search, CheckSquare, Square, Store, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/auth/LanguageContext";
import { format } from "date-fns";

export default function Notifications() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [campaignType, setCampaignType] = useState('push');
  const [newCampaign, setNewCampaign] = useState({ 
    title: '', 
    body: '',
    subject: '',
    htmlContent: ''
  });
  const [recipientSelection, setRecipientSelection] = useState({
    mode: 'category', // 'category' o 'individual'
    category: 'all',
    selectedMemberIds: []
  });
  const [historyFilter, setHistoryFilter] = useState('all'); // all, push, email
  const [rightPanelTab, setRightPanelTab] = useState('history'); // 'history' o 'preview'
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipientModalMode, setRecipientModalMode] = useState('category'); // Para el modal interno
  const [recipientModalCategory, setRecipientModalCategory] = useState('all');
  const [tempSelectedMemberIds, setTempSelectedMemberIds] = useState([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('all');
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
  useQuery({
    queryKey: ['loyaltyPrograms', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const res = await api.loyaltyPrograms.list(brandId);
      return res?.data || res || [];
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });

  // Consultar stores
  const { data: storesData = [] } = useQuery({
    queryKey: ['stores', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const res = await api.stores.list(brandId);
      return res?.data || res || [];
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });

  const stores = storesData.map(store => ({
    id: store.store_id || store.id,
    name: store.store_name || store.name,
    ...store
  }));

  // NOTA: api.entities.MemberCard.* no existe en el YAML - comentado
  // const { data: members = [], isLoading: membersLoading } = useQuery({
  //   queryKey: ['allMembers', cards.map(c => c.id).join(',')],
  //   queryFn: async () => {
  //     if (cards.length === 0) return [];
  //     const promises = cards.map(card => api.entities.MemberCard.filter({ card_id: card.id }));
  //     const results = await Promise.all(promises);
  //     return results.flat().sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  //   },
  //   enabled: cards.length > 0
  // });
  const members = [];
  const membersLoading = false;

  // NOTA: api.entities.Campaign.* y api.functions.invoke('sendCampaign') no existen en el YAML - comentado
  // const { data: campaigns = [], isLoading } = useQuery({
  //   queryKey: ['campaigns'],
  //   queryFn: () => api.entities.Campaign.list('-created_date', 20),
  // });
  const campaigns = [];
  const isLoading = false;

  // Funciones auxiliares para filtrar miembros
  const filterMembersByCategory = (category) => {
    if (!members || members.length === 0) return [];
    
    let filtered = members;
    
    // Aplicar filtro de categoría
    if (category !== 'all') {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);

      switch (category) {
        case 'frequent':
          // Requiere lógica del backend - por ahora retornar todos
          filtered = members;
          break;
        case 'this_month':
          filtered = members.filter(m => {
            const memberDate = new Date(m.created_date || m.last_visit || m.created_date);
            return memberDate >= startOfMonth;
          });
          break;
        case 'this_week':
          filtered = members.filter(m => {
            const memberDate = new Date(m.created_date || m.last_visit || m.created_date);
            return memberDate >= startOfWeek;
          });
          break;
        case 'inactive':
          filtered = members.filter(m => {
            const lastVisit = m.last_visit ? new Date(m.last_visit) : new Date(m.created_date);
            return lastVisit < thirtyDaysAgo;
          });
          break;
        case 'nearby':
          // Requiere geolocalización del backend - por ahora retornar todos
          filtered = members;
          break;
        default:
          filtered = members;
      }
    }
    
    // Aplicar filtro por sucursal
    if (selectedStoreFilter !== 'all') {
      filtered = filtered.filter(m => {
        // Intentar diferentes campos posibles para la relación con sucursal
        const memberStoreId = m.store_id || m.branch_id || m.assigned_store_id;
        return memberStoreId === selectedStoreFilter || memberStoreId?.toString() === selectedStoreFilter?.toString();
      });
    }
    
    return filtered;
  };

  const filteredMembers = recipientModalMode === 'category' 
    ? filterMembersByCategory(recipientModalCategory)
    : members.filter(member => {
        // Filtro de búsqueda
        let matchesSearch = true;
        if (memberSearchQuery) {
          const query = memberSearchQuery.toLowerCase();
          matchesSearch = (
            member.customer_email?.toLowerCase().includes(query) ||
            member.customer_name?.toLowerCase().includes(query) ||
            member.phone_number?.includes(query)
          );
        }
        
        // Filtro por sucursal
        let matchesStore = true;
        if (selectedStoreFilter !== 'all') {
          const memberStoreId = member.store_id || member.branch_id || member.assigned_store_id;
          matchesStore = memberStoreId === selectedStoreFilter || memberStoreId?.toString() === selectedStoreFilter?.toString();
        }
        
        return matchesSearch && matchesStore;
      });

  // Inicializar selección cuando cambia la categoría o el filtro de sucursal
  React.useEffect(() => {
    if (recipientModalMode === 'category' && recipientModalCategory) {
      const filtered = filterMembersByCategory(recipientModalCategory);
      setTempSelectedMemberIds(filtered.map(m => m.id));
    }
  }, [recipientModalCategory, recipientModalMode, selectedStoreFilter]);

  const handleSelectAll = () => {
    setTempSelectedMemberIds(filteredMembers.map(m => m.id));
  };

  const handleDeselectAll = () => {
    setTempSelectedMemberIds([]);
  };

  const handleMemberToggle = (memberId) => {
    setTempSelectedMemberIds(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleOpenRecipientModal = () => {
    // Inicializar estados del modal basados en la selección actual
    setRecipientModalMode(recipientSelection.mode);
    setRecipientModalCategory(recipientSelection.category);
    if (recipientSelection.mode === 'category') {
      const filtered = filterMembersByCategory(recipientSelection.category);
      setTempSelectedMemberIds(filtered.map(m => m.id));
    } else {
      setTempSelectedMemberIds(recipientSelection.selectedMemberIds || []);
    }
    setShowRecipientModal(true);
  };

  const handleConfirmRecipientSelection = () => {
    if (recipientModalMode === 'category') {
      setRecipientSelection({
        mode: 'category',
        category: recipientModalCategory,
        selectedMemberIds: []
      });
    } else {
      setRecipientSelection({
        mode: 'individual',
        category: 'all',
        selectedMemberIds: tempSelectedMemberIds
      });
    }
    setShowRecipientModal(false);
  };

  const getRecipientButtonText = () => {
    if (recipientSelection.mode === 'category') {
      const categoryNames = {
        'all': 'Todos los clientes',
        'frequent': 'Clientes frecuentes',
        'this_month': 'Clientes de este mes',
        'this_week': 'Clientes de esta semana',
        'inactive': 'Clientes que hace mucho no vuelven',
        'nearby': 'Clientes cerca del negocio'
      };
      return categoryNames[recipientSelection.category] || 'Seleccionar destinatarios';
    } else {
      const count = recipientSelection.selectedMemberIds?.length || 0;
      return count > 0 ? `${count} miembros seleccionados` : 'Seleccionar destinatarios';
    }
  };

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignData) => {
      const { type } = campaignData;
      
      if (type === 'push') {
        // NOTA: api.entities.Campaign.create() y api.functions.invoke('sendCampaign') no existen en el YAML - comentado
        // // 1. Create Campaign Record
        // const campaign = await api.entities.Campaign.create({
        //     ...data,
        //     type: 'push',
        //     status: 'sending',
        //     sent_at: new Date().toISOString()
        // });
        // 
        // // 2. Trigger Backend Function
        // const response = await api.functions.invoke('sendCampaign', { 
        //     campaignId: campaign.id 
        // });
        // 
        // if (response.data.error) throw new Error(response.data.error);
        // return response.data;
        throw new Error('Funcionalidad no disponible. Los endpoints /entities/Campaign y /functions/sendCampaign no están documentados en el YAML de Insomnia.');
      } else if (type === 'email') {
        // NOTA: api.integrations.Core.SendEmail no existe en el YAML - comentado
        // const response = await api.integrations.Core.SendEmail({
        //     subject: data.subject,
        //     htmlContent: data.htmlContent,
        //     type: 'email'
        // });
        // return response;
        throw new Error('Funcionalidad no disponible. El endpoint /integrations/core/send-email no está documentado en el YAML de Insomnia.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setNewCampaign({ title: '', body: '', subject: '', htmlContent: '' });
      setRecipientSelection({ mode: 'category', category: 'all', selectedMemberIds: [] });
      const successMessage = campaignType === 'push' 
        ? "Notificación push enviada correctamente"
        : "Email enviado correctamente";
      toast.success(successMessage);
    },
    onError: (err) => {
      const errorMessage = campaignType === 'push'
        ? "Error al enviar notificación push: " + err.message
        : "Error al enviar email: " + err.message;
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (campaignType === 'push') {
      if (!newCampaign.title || !newCampaign.body) {
        toast.error("Por favor completa todos los campos requeridos");
        return;
      }
      sendCampaignMutation.mutate({
        title: newCampaign.title,
        body: newCampaign.body,
        type: 'push',
        recipientSelection: recipientSelection
      });
    } else if (campaignType === 'email') {
      if (!newCampaign.subject || !newCampaign.htmlContent) {
        toast.error("Por favor completa todos los campos requeridos");
        return;
      }
      sendCampaignMutation.mutate({
        subject: newCampaign.subject,
        htmlContent: newCampaign.htmlContent,
        type: 'email',
        recipientSelection: recipientSelection
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-gray-700" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent">
            {t('notifications')}
          </h1>
        </div>
        <p className="text-gray-600">Envía notificaciones push y emails a tus clientes para mantenerlos informados de tus ofertas y promociones.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Create Campaign Form */}
        <Card className="md:col-span-1 p-6 h-fit shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" />
                Nueva Campaña
            </h2>
            <Tabs value={campaignType} onValueChange={setCampaignType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="push" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Push
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              {/* Push Tab */}
              <TabsContent value="push">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título (Corto)</Label>
                    <Input 
                      placeholder="Ej. ¡Oferta Flash!" 
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                      maxLength={50}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mensaje</Label>
                    <Textarea 
                      placeholder="Ej. Muestra tu programa hoy para un 2x1..." 
                      value={newCampaign.body}
                      onChange={(e) => setNewCampaign({...newCampaign, body: e.target.value})}
                      rows={4}
                      required
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-400 text-right">{newCampaign.body.length}/150</p>
                  </div>
                  <div className="space-y-2 border-t pt-4">
                    <Label>Enviar a</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between text-left font-normal hover:bg-gray-50 h-12"
                      onClick={handleOpenRecipientModal}
                    >
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{getRecipientButtonText()}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
                    disabled={sendCampaignMutation.isPending}
                  >
                    {sendCampaignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar Notificación Push
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <strong>Nota:</strong> Las notificaciones llegarán a todos los usuarios que tengan tu programa en su Wallet. 
                    En Apple Wallet aparecerá como una actualización en la pantalla de bloqueo.
                  </p>
                </form>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Asunto</Label>
                    <Input 
                      placeholder="Ej. ¡Oferta Especial para Ti!" 
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                      maxLength={100}
                      required
                    />
                    <p className="text-xs text-gray-400 text-right">{newCampaign.subject.length}/100</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Contenido HTML</Label>
                    <Textarea 
                      placeholder="Escribe tu mensaje en HTML. Ej: &lt;p&gt;¡Hola! Esta es una oferta especial...&lt;/p&gt;" 
                      value={newCampaign.htmlContent}
                      onChange={(e) => setNewCampaign({...newCampaign, htmlContent: e.target.value})}
                      rows={8}
                      required
                    />
                    <p className="text-xs text-gray-400 text-right">{newCampaign.htmlContent.length} caracteres</p>
                  </div>
                  <div className="space-y-2 border-t pt-4">
                    <Label>Enviar a</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between text-left font-normal hover:bg-gray-50 h-12"
                      onClick={handleOpenRecipientModal}
                    >
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{getRecipientButtonText()}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 gap-2"
                    disabled={sendCampaignMutation.isPending}
                  >
                    {sendCampaignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Enviar Email
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
                    <strong>Nota:</strong> Los emails se enviarán a todos los clientes registrados en tu marca. 
                    Puedes usar HTML básico para formatear tu mensaje.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
        </Card>

        {/* Preview e Historial Combinados */}
        <div className="md:col-span-1 space-y-4 h-full">
          <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Historial
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Vista Previa
              </TabsTrigger>
            </TabsList>

            {/* Historial Tab */}
            <TabsContent value="history" className="space-y-4 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-600" />
                  Historial
                </h2>
                <Tabs value={historyFilter} onValueChange={setHistoryFilter} className="w-auto">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      Todos
                    </TabsTrigger>
                    <TabsTrigger value="push" className="flex items-center gap-2">
                      <Bell className="w-3 h-3" />
                      Push
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Email
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
              ) : (() => {
                const filteredCampaigns = campaigns.filter(campaign => {
                  if (historyFilter === 'all') return true;
                  return campaign.type === historyFilter;
                });
                
                if (filteredCampaigns.length === 0) {
                  return (
                    <Card className="p-8 text-center text-gray-500 bg-slate-50 border-dashed">
                      {historyFilter === 'all' 
                        ? "No has enviado ninguna campaña aún."
                        : historyFilter === 'push'
                        ? "No has enviado ninguna notificación push aún."
                        : "No has enviado ningún email aún."
                      }
                    </Card>
                  );
                }
                
                return filteredCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${
                      campaign.type === 'email' ? 'border-l-green-500' : 'border-l-indigo-500'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">
                            {campaign.type === 'email' ? campaign.subject : campaign.title}
                          </h3>
                          <Badge variant={campaign.type === 'email' ? 'default' : 'secondary'} className={
                            campaign.type === 'email' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                          }>
                            {campaign.type === 'email' ? 'Email' : 'Push'}
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {campaign.type === 'email' ? (
                            <div dangerouslySetInnerHTML={{ __html: campaign.htmlContent?.substring(0, 100) + '...' }} />
                          ) : (
                            campaign.body
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {format(new Date(campaign.created_date), "PP p")}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 min-w-fit">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{campaign.sent_count || 0}</div>
                          <div className="text-xs text-gray-500">Enviados</div>
                        </div>
                        {campaign.status === 'sent' ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : campaign.status === 'failed' ? (
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        ) : (
                          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ));
              })()}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1">
              {campaignType === 'push' ? (
                <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm h-fit">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    Vista Previa Push
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {newCampaign.title || 'Título de ejemplo'}
                          </p>
                          <span className="text-xs text-gray-400">Ahora</span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">
                          {newCampaign.body || 'Mensaje de ejemplo para la notificación push...'}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {getRecipientButtonText()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full flex flex-col">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    Vista Previa Email
                  </h2>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0">
                    <div className="border-b border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-700 min-w-[60px]">De:</span>
                          <span className="text-gray-900">{meData?.brands?.[0]?.brand_name || 'Tu Marca'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-700 min-w-[60px]">Para:</span>
                          <span className="text-gray-900">{getRecipientButtonText()}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-700 min-w-[60px]">Asunto:</span>
                          <span className="text-gray-900">{newCampaign.subject || 'Asunto de ejemplo'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col min-h-0">
                      {newCampaign.htmlContent ? (
                        <div className="border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                          <iframe
                            srcDoc={`
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <meta charset="UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <style>
                                    body {
                                      margin: 0;
                                      padding: 16px;
                                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                                      line-height: 1.6;
                                      color: #333;
                                    }
                                    img { max-width: 100%; height: auto; }
                                    a { color: #2563eb; text-decoration: underline; }
                                    p { margin: 0 0 1em 0; }
                                    p:last-child { margin-bottom: 0; }
                                  </style>
                                </head>
                                <body>
                                  ${newCampaign.htmlContent}
                                </body>
                              </html>
                            `}
                            className="w-full border-0 flex-1"
                            style={{ 
                              minHeight: '250px',
                              display: 'block'
                            }}
                            title="Email Preview"
                            sandbox="allow-same-origin"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic py-12 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 flex-1 flex items-center justify-center">
                          El contenido HTML aparecerá aquí cuando escribas en el campo de arriba...
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de Selección de Destinatarios */}
      <Dialog open={showRecipientModal} onOpenChange={setShowRecipientModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Seleccionar Destinatarios</DialogTitle>
            <DialogDescription>
              Elige a quiénes enviarás la campaña seleccionando por categoría o miembros individuales.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={recipientModalMode} onValueChange={setRecipientModalMode} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="category">Por Categoría</TabsTrigger>
              <TabsTrigger value="individual">Selección Individual</TabsTrigger>
            </TabsList>

            {/* Modo Categoría */}
            <TabsContent value="category" className="flex-1 flex flex-col min-h-0">
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select 
                    value={selectedStoreFilter} 
                    onValueChange={setSelectedStoreFilter}
                    disabled={stores.length === 0}
                  >
                    <SelectTrigger>
                      <Store className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Selecciona sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las sucursales</SelectItem>
                      {stores.map(store => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name || store.store_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select 
                    value={recipientModalCategory} 
                    onValueChange={setRecipientModalCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los clientes</SelectItem>
                      <SelectItem value="frequent">Clientes frecuentes</SelectItem>
                      <SelectItem value="this_month">Clientes de este mes</SelectItem>
                      <SelectItem value="this_week">Clientes de esta semana</SelectItem>
                      <SelectItem value="inactive">Clientes que hace mucho no vuelven</SelectItem>
                      <SelectItem value="nearby">Clientes cerca del negocio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 overflow-y-auto border rounded-lg p-4 min-h-0">
                  {membersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                    </div>
                  ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No se encontraron miembros para esta categoría.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredMembers.map((member) => (
                        <Card 
                          key={member.id}
                          className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleMemberToggle(member.id)}
                        >
                          <Checkbox
                            checked={tempSelectedMemberIds.includes(member.id)}
                            onCheckedChange={() => handleMemberToggle(member.id)}
                          />
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-indigo-600 text-lg">
                              {(member.customer_name || member.customer_email || '?')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {member.customer_name || member.customer_email || 'Cliente'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {member.customer_email && <span className="truncate">{member.customer_email}</span>}
                              {member.phone_number && (
                                <>
                                  {member.customer_email && <span>•</span>}
                                  <span>{member.phone_number}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 pt-2 border-t">
                  {tempSelectedMemberIds.length} miembros seleccionados
                </div>
              </div>
            </TabsContent>

            {/* Modo Selección Individual */}
            <TabsContent value="individual" className="flex-1 flex flex-col min-h-0">
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select 
                    value={selectedStoreFilter} 
                    onValueChange={setSelectedStoreFilter}
                    disabled={stores.length === 0}
                  >
                    <SelectTrigger>
                      <Store className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Selecciona sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las sucursales</SelectItem>
                      {stores.map(store => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name || store.store_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Buscar miembros</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Seleccionar todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    className="flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Deseleccionar todos
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto border rounded-lg p-4 min-h-0">
                  {membersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                    </div>
                  ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      {memberSearchQuery ? 'No se encontraron miembros que coincidan con la búsqueda.' : 'No hay miembros disponibles.'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredMembers.map((member) => (
                        <Card 
                          key={member.id}
                          className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleMemberToggle(member.id)}
                        >
                          <Checkbox
                            checked={tempSelectedMemberIds.includes(member.id)}
                            onCheckedChange={() => handleMemberToggle(member.id)}
                          />
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-indigo-600 text-lg">
                              {(member.customer_name || member.customer_email || '?')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {member.customer_name || member.customer_email || 'Cliente'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {member.customer_email && <span className="truncate">{member.customer_email}</span>}
                              {member.phone_number && (
                                <>
                                  {member.customer_email && <span>•</span>}
                                  <span>{member.phone_number}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 pt-2 border-t">
                  {tempSelectedMemberIds.length} miembros seleccionados
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRecipientModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRecipientSelection}
              disabled={tempSelectedMemberIds.length === 0}
            >
              Confirmar ({tempSelectedMemberIds.length} {tempSelectedMemberIds.length === 1 ? 'miembro' : 'miembros'})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}