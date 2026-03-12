import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Edit, Share2, TrendingUp, Trash2, QrCode, Download, FileImage, Loader2 } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import PricingModal from '@/components/subscription/PricingModal';
import FlyerPreview from '@/components/programs/FlyerPreview';
import FlyerPDF from '@/components/programs/FlyerPDF';
import { pdf } from '@react-pdf/renderer';
import { toast } from "sonner";

export default function ProgramListItem({ card, onEdit, onToggleActive, onDelete, brand, currentUser, memberCount }) {
  const [showPricing, setShowPricing] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Flyer states
  const [flyerTemplate, setFlyerTemplate] = useState('classic');
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customReward, setCustomReward] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Obtener brand_id desde localStorage
  const brandId = localStorage.getItem('brand_id');

  const shareUrl = (() => {
    try {
      const url = new URL('/publicprogram', window.location.origin);
      url.searchParams.set('id', card.id);
      if (brandId) {
        url.searchParams.set('brand_id', brandId);
      }
      return url.toString();
    } catch {
      return window.location.href;
    }
  })();

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Enlace copiado al portapapeles');
    } catch {
      toast.error('Error al copiar el enlace');
    }
  };

  const checkProAccess = () => {
    const isAdmin = currentUser?.type_user === 'brand_admin';
    
    // Only block admins on free plan - employees can always share/preview
    if (isAdmin && brand?.subscription_plan === 'free') {
      setShowPricing(true);
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (!checkProAccess()) return;
    window.open(shareUrl, '_blank');
  };

  const handleShowQr = () => {
    if (!checkProAccess()) return;
    setShowQr(true);
  };

  const handleShare = async () => {
    if (!checkProAccess()) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: card.club_name,
          text: `Únete a mi programa ${card.club_name}!`,
          url: shareUrl,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      copyShareLink();
    }
  };

  const downloadFlyer = async () => {
    setIsDownloading(true);

    try {
      const title = customTitle || card.club_name || 'Programa de Fidelidad';
      const subtitle = customSubtitle || 'Escanea y únete gratis';
      const reward = customReward || card.reward_text || 'Recompensa especial';
      const accentColor = card.card_color || '#8B5CF6';

      // QR URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}`;

      // Generate PDF using @react-pdf/renderer
      const blob = await pdf(
        <FlyerPDF
          template={flyerTemplate}
          title={title}
          subtitle={subtitle}
          reward={reward}
          accentColor={accentColor}
          qrUrl={qrUrl}
        />
      ).toBlob();

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flyer-${card.club_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Flyer descargado exitosamente');
    } catch (error) {
      console.error('Error downloading flyer:', error);
      toast.error('Error al descargar el flyer');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadQrOnly = async () => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${card.club_name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('QR descargado exitosamente');
    } catch (error) {
      console.error('Error downloading QR:', error);
      toast.error('Error al descargar el QR');
    }
  };

  const resetFlyerForm = () => {
    setCustomTitle('');
    setCustomSubtitle('');
    setCustomReward('');
    setFlyerTemplate('classic');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Program Preview */}
          <div
            className="w-full md:w-48 h-48 md:h-auto relative"
            style={{
              background: card.card_color || '#000000'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h4 className="font-bold text-lg mb-1">{card.club_name}</h4>
              </div>
            </div>
          </div>

          {/* Program Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{card.club_name}</h3>
                <p className="text-gray-600 text-sm mb-2">{card.reward_text}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                        checked={card.is_active} 
                        onCheckedChange={(checked) => onToggleActive && onToggleActive(card, checked)}
                    />
                    <span className={`text-sm font-medium ${card.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {card.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {memberCount !== undefined ? memberCount : (card.total_scans || 0)} miembros
                  </Badge>
                </div>
              </div>
            </div>

            {card.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{card.description}</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                onClick={handlePreview}
              >
                  <Eye className="w-4 h-4" />
                  Preview
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => onEdit(card)}>
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShowQr}>
                <QrCode className="w-4 h-4" />
                Ver QR
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Compartir Link
              </Button>

              {currentUser?.type_user === 'brand_admin' && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el programa de lealtad "{card.club_name}" y todos sus datos asociados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(card.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </Card>
      <PricingModal open={showPricing} onOpenChange={setShowPricing} brand={brand} />

      {/* QR Dialog */}
      <Dialog open={showQr} onOpenChange={(open) => {
        setShowQr(open);
        if (!open) resetFlyerForm();
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">QR del Programa</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="gap-2">
                <QrCode className="w-4 h-4" />
                Solo QR
              </TabsTrigger>
              <TabsTrigger value="flyer" className="gap-2">
                <FileImage className="w-4 h-4" />
                Flyer para Imprimir
              </TabsTrigger>
            </TabsList>

            {/* Solo QR Tab */}
            <TabsContent value="qr" className="mt-4">
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                    alt="Program QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <div className="text-center text-sm text-gray-500">
                  <p className="font-medium text-gray-900">{card.club_name}</p>
                  <p className="text-xs mt-1 break-all max-w-xs">{shareUrl}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Escanea para unirte al programa de fidelidad
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Enlace copiado al portapapeles');
                  }}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Copiar Link
                </Button>
                <Button
                  variant="secondary"
                  onClick={downloadQrOnly}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar QR
                </Button>
              </div>
            </TabsContent>

            {/* Flyer Tab */}
            <TabsContent value="flyer" className="mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Side: Controls */}
                <div className="space-y-4">
                  {/* Template Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Plantilla</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'classic', name: 'Clásico' },
                        { id: 'minimal', name: 'Minimal' },
                        { id: 'promo', name: 'Promo' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setFlyerTemplate(t.id)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            flyerTemplate === t.id
                              ? 'border-violet-500 bg-violet-50 text-violet-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Title */}
                  <div>
                    <Label htmlFor="customTitle" className="text-sm font-medium">
                      Título
                    </Label>
                    <Input
                      id="customTitle"
                      placeholder={card.club_name}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Custom Subtitle */}
                  <div>
                    <Label htmlFor="customSubtitle" className="text-sm font-medium">
                      Subtítulo
                    </Label>
                    <Input
                      id="customSubtitle"
                      placeholder="Escanea y únete gratis"
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Custom Reward */}
                  <div>
                    <Label htmlFor="customReward" className="text-sm font-medium">
                      Recompensa
                    </Label>
                    <Input
                      id="customReward"
                      placeholder={card.reward_text || 'Recompensa especial'}
                      value={customReward}
                      onChange={(e) => setCustomReward(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadFlyer}
                    disabled={isDownloading}
                    className="w-full gap-2 mt-4"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Descargar Flyer
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Side: Preview */}
                <div className="flex flex-col items-center">
                  <Label className="text-sm font-medium mb-2 block w-full">Vista Previa</Label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50 p-2">
                    <div style={{
                      transform: 'scale(0.45)',
                      transformOrigin: 'top left',
                      width: '180px',
                      height: '255px'
                    }}>
                      <FlyerPreview
                        card={card}
                        template={flyerTemplate}
                        customTitle={customTitle || null}
                        customSubtitle={customSubtitle || null}
                        customReward={customReward || null}
                        shareUrl={shareUrl}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    El flyer se descargará en PDF
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}