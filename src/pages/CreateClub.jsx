import React, { useState, useEffect, useRef } from 'react';
import { api } from "@/api/client";
import { getCurrentUser } from "@/utils/jwt";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useProgramsStore from "@/stores/useProgramsStore";
import useStoresStore from "@/stores/useStoresStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload, RotateCw } from 'lucide-react';
import { motion } from "framer-motion";
import { useLanguage } from "@/components/auth/LanguageContext";
import { toast } from "sonner";
import ProgramPreviewComponent from "@/components/programs/ProgramPreviewComponent";

function resizeImage(base64, width, height) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = base64;
  });
}

// Escala la imagen proporcionalmente si supera las dimensiones máximas.
// Usa PNG para preservar transparencia.
function resizeImageToMax(base64, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const ratio = Math.min(maxWidth / w, maxHeight / h, 1); // nunca upscale
      const newW = Math.round(w * ratio);
      const newH = Math.round(h * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = newW;
      canvas.height = newH;
      canvas.getContext('2d').drawImage(img, 0, 0, newW, newH);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = base64;
  });
}

// Recorta la imagen al cuadrado central y aplica máscara circular.
// El resultado es un PNG transparente fuera del círculo, con cover dentro.
// Esto garantiza que el backend (que usa "contain") muestre el ícono
// llenando el slot circular sin barras negras ni espacios vacíos.
function cropToCircle(base64, size) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      // Clip circular
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      // Escalar para cubrir el círculo (equivalente a objectFit: cover)
      const scale = size / Math.min(w, h);
      const drawW = w * scale;
      const drawH = h * scale;
      const offsetX = (size - drawW) / 2;
      const offsetY = (size - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = base64;
  });
}

// Muestrea el color del borde del círculo de la imagen (4 puntos cardinales, justo dentro del borde).
// Sirve para usar ese color como fondo del slot del sello, haciéndolo invisible.
function sampleCircleEdgeColor(base64, size = 300) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const r = size / 2;
      const inset = 4;
      const points = [
        [Math.round(r), inset],
        [Math.round(r), size - inset],
        [inset, Math.round(r)],
        [size - inset, Math.round(r)],
      ];
      let rSum = 0, gSum = 0, bSum = 0;
      for (const [x, y] of points) {
        const d = ctx.getImageData(x, y, 1, 1).data;
        rSum += d[0]; gSum += d[1]; bSum += d[2];
      }
      const n = points.length;
      const toHex = (v) => Math.round(v / n).toString(16).padStart(2, '0');
      resolve(`#${toHex(rSum)}${toHex(gSum)}${toHex(bSum)}`);
    };
    img.src = base64;
  });
}

function applyRoundedCorners(base64, radius = 0.15) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      const r = Math.min(w, h) * radius;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = base64;
  });
}

const PROGRAM_TYPES = [
  { 
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151', 
    name: 'Sellos',
    description: 'Programa clásico donde los clientes acumulan sellos por cada compra. Al completar todos los sellos, obtienen una recompensa. Ejemplo: Compra 5 cafés, el 6° es gratis.'
  },
  { 
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc152', 
    name: 'Gift Card',
    description: 'Tarjeta de regalo recargable que los clientes pueden usar como medio de pago. Ideal para promociones y regalos corporativos.'
  },
  { 
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc153', 
    name: 'Descuentos',
    description: 'Programa de descuentos progresivos o fijos para clientes frecuentes. Los miembros obtienen precios especiales en productos o servicios.'
  },
  { 
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc154', 
    name: 'Cashbacks',
    description: 'Los clientes reciben un porcentaje de su compra de vuelta como crédito. Ejemplo: 5% de cashback en cada compra para usar en futuras visitas.'
  },
  { 
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc155', 
    name: 'Membresías',
    description: 'Programa de membresía con beneficios exclusivos y acceso a ventajas especiales. Puede incluir cuotas mensuales o anuales.'
  },
  { 
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc156', 
    name: 'Cupones',
    description: 'Sistema de cupones digitales con ofertas especiales. Los clientes reciben y acumulan cupones para productos o servicios específicos.'
  },
];

const getProgramTypeDescription = (programTypeId) => {
  const programType = PROGRAM_TYPES.find(type => type.id === programTypeId);
  return programType?.description || '';
};

const getProgramTypeName = (programTypeId) => {
  const programType = PROGRAM_TYPES.find(type => type.id === programTypeId);
  return programType?.name || '';
};

export default function CreateClub() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');

  const user = getCurrentUser();

  // Usar el store de Zustand
  const { createProgram, updateProgram, isCreating, isUpdating, programs: storePrograms } = useProgramsStore();
  const { stores, fetchStores } = useStoresStore();

  /* =========================
     AUTH / BRAND
  ========================= */
  const { data: meData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me();
      return res?.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Usar el brand_id seleccionado de localStorage (igual que en Dashboard)
  const brandIdFromStorage = localStorage.getItem('brand_id');
  const brandId = brandIdFromStorage || meData?.brands?.[0]?.brand_id;

  // Cargar stores (siempre — usa cache + background refresh)
  useEffect(() => {
    if (brandId) fetchStores(brandId);
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Inicializar selected_store_ids con todos los stores cuando se cargan (solo en creación)
  useEffect(() => {
    if (stores.length > 0 && !editId) {
      setFormData(prev => ({
        ...prev,
        selected_store_ids: stores.map(s => s.store_id || s.id).filter(Boolean),
      }));
    }
  }, [stores.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Obtener datos de la marca para el logo
  const { data: brandData } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      if (!brandId) return null;
      const res = await api.brands.get(brandId);
      return res?.data || res;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });

  /* =========================
     STATE
  ========================= */
  const [programId, setProgramId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);
  // Tracks which images were actually uploaded by the user in this session
  // (prevents false positives from existing base64 data loaded from backend)
  const [newUpload, setNewUpload] = useState({ logo: false, background: false, stamp: false });
  // Snapshot of formData when entering edit mode — used to diff dirty fields
  const initialFormData = useRef(null);
  const [previewPlatform, setPreviewPlatform] = useState('ios');
  const [isFlipped, setIsFlipped] = useState(false);
  // Construir URL de imagen S3 para el preview en modo edición
  const stampCardImageUrl = editId && programId ? api.images.getStampCardUrl(programId, 0) : null;

  const [formData, setFormData] = useState({
    club_name: '',
    program_type_id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151', // Default: Sellos
    description: '',
    reward_text: '',
    reward_tiers: [],
    stamps_required: 10,
    logo_url: '',
    background_image_url: '',
    stamp_image_url: '',
    stamp_icon_bg_color: '#000000',
    card_color: '#000000',
    foreground_color: '#FFFFFF',
    label_color: '#FFFFFF',
    terms: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    security_ticket_required: false,
    security_geofence_required: false,
    security_cooldown_hours: 0,
    validity_stamps_days: 0,
    validity_reward_days: 0,
    validity_duration_days: 0,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    selected_store_ids: [],
  });

  /* =========================
     LOAD EXISTING PROGRAM
  ========================= */
  const { data: existingProgram } = useQuery({
    queryKey: ['loyaltyProgram', editId],
    queryFn: async () => {
      if (!editId) return null;
      const res = await api.loyaltyPrograms.get(editId);
      return res?.data || res || null;
    },
    enabled: !!editId,
    gcTime: 0,
  });

  useEffect(() => {
    setDataLoaded(false);
  }, [editId]);

  useEffect(() => {
    if (existingProgram && !dataLoaded) {
      setProgramId(existingProgram.program_id);
      setNewUpload({ logo: false, background: false, stamp: false });

      // GET /loyalty-programs/:id no devuelve `images` ni `wallet_design`; usamos el store como fallback
      const programFromStore = storePrograms.find(
        p => (p.program_id || p.id) === existingProgram.program_id
      );
      const images = existingProgram.images || programFromStore?.images || {};
      const walletDesign = existingProgram.wallet_design || programFromStore?.wallet_design || {};

      const savedImages = (() => {
        try { return JSON.parse(localStorage.getItem(`program_images_${existingProgram.program_id}`) || '{}'); }
        catch { return {}; }
      })();

      setFormData({
        club_name: existingProgram.program_name || '',
        program_type_id: existingProgram.program_type_id || '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151',
        description: existingProgram.description || '',
        reward_text: existingProgram.reward_description || '',
        reward_tiers: existingProgram.reward_rules?.reward_tiers || [],
        stamps_required: existingProgram.program_rules?.stamps_required ?? 10,
        logo_url: walletDesign.logo_url || images.logo || savedImages.logo || existingProgram.program_rules?.logo_url || localStorage.getItem(`brand_logo_url_${brandId}`) || '',
        background_image_url: images.stamp_background || savedImages.background || '',
        stamp_image_url: images.stamp_icon || savedImages.stamp || '',
        card_color: walletDesign.hex_background_color || existingProgram.program_rules?.card_color || '#000000',
        foreground_color: walletDesign.hex_foreground_color || '#FFFFFF',
        label_color: walletDesign.hex_label_color || '#FFFFFF',
        terms: existingProgram.program_rules?.terms_and_conditions || existingProgram.program_rules?.terms || '',
        contact_email: existingProgram.program_rules?.contact_email || '',
        contact_phone: existingProgram.program_rules?.contact_phone || '',
        website: existingProgram.program_rules?.website || '',
        security_ticket_required: existingProgram.program_rules?.security_ticket_required ?? false,
        security_geofence_required: existingProgram.program_rules?.security_geofence_required ?? false,
        security_cooldown_hours: existingProgram.program_rules?.security_cooldown_hours ?? 0,
        validity_stamps_days: existingProgram.program_rules?.validity_stamps_days ?? 0,
        validity_reward_days: existingProgram.program_rules?.validity_reward_days ?? 0,
        validity_duration_days: existingProgram.program_rules?.validity_duration_days ?? 0,
        collect_name: existingProgram.program_rules?.required_customer_fields?.name ?? true,
        collect_email: existingProgram.program_rules?.required_customer_fields?.email ?? true,
        collect_phone: existingProgram.program_rules?.required_customer_fields?.phone ?? false,
        collect_birthday: existingProgram.program_rules?.required_customer_fields?.birth_date ?? false,
        selected_store_ids: existingProgram.store_ids || stores.map(s => s.store_id || s.id).filter(Boolean),
        stamp_icon_bg_color: savedImages.color || '#000000',
      });

      initialFormData.current = {
        club_name: existingProgram.program_name || '',
        program_type_id: existingProgram.program_type_id || '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151',
        description: existingProgram.description || '',
        reward_text: existingProgram.reward_description || '',
        reward_tiers: existingProgram.reward_rules?.reward_tiers || [],
        stamps_required: existingProgram.program_rules?.stamps_required ?? 10,
        logo_url: walletDesign.logo_url || images.logo || savedImages.logo || existingProgram.program_rules?.logo_url || localStorage.getItem(`brand_logo_url_${brandId}`) || '',
        background_image_url: images.stamp_background || savedImages.background || '',
        stamp_image_url: images.stamp_icon || savedImages.stamp || '',
        card_color: walletDesign.hex_background_color || existingProgram.program_rules?.card_color || '#000000',
        foreground_color: walletDesign.hex_foreground_color || '#FFFFFF',
        label_color: walletDesign.hex_label_color || '#FFFFFF',
        terms: existingProgram.program_rules?.terms_and_conditions || existingProgram.program_rules?.terms || '',
        contact_email: existingProgram.program_rules?.contact_email || '',
        contact_phone: existingProgram.program_rules?.contact_phone || '',
        website: existingProgram.program_rules?.website || '',
        security_ticket_required: existingProgram.program_rules?.security_ticket_required ?? false,
        security_geofence_required: existingProgram.program_rules?.security_geofence_required ?? false,
        security_cooldown_hours: existingProgram.program_rules?.security_cooldown_hours ?? 0,
        validity_stamps_days: existingProgram.program_rules?.validity_stamps_days ?? 0,
        validity_reward_days: existingProgram.program_rules?.validity_reward_days ?? 0,
        validity_duration_days: existingProgram.program_rules?.validity_duration_days ?? 0,
        collect_name: existingProgram.program_rules?.required_customer_fields?.name ?? true,
        collect_email: existingProgram.program_rules?.required_customer_fields?.email ?? true,
        collect_phone: existingProgram.program_rules?.required_customer_fields?.phone ?? false,
        collect_birthday: existingProgram.program_rules?.required_customer_fields?.birth_date ?? false,
        selected_store_ids: existingProgram.store_ids || stores.map(s => s.store_id || s.id).filter(Boolean),
      };
      setDataLoaded(true);
    }
  }, [existingProgram, dataLoaded]);

  useEffect(() => {
    if (!existingProgram) return;
    const programFromStore = storePrograms.find(
      p => (p.program_id || p.id) === existingProgram.program_id
    );
    const images = existingProgram.images || programFromStore?.images || {};
    const walletDesign = existingProgram.wallet_design || programFromStore?.wallet_design || {};
    const savedImages = (() => {
      try { return JSON.parse(localStorage.getItem(`program_images_${existingProgram.program_id}`) || '{}'); }
      catch { return {}; }
    })();
    setFormData(prev => ({
      ...prev,
      logo_url: newUpload.logo ? prev.logo_url : (walletDesign.logo_url || images.logo || savedImages.logo || existingProgram.program_rules?.logo_url || localStorage.getItem(`brand_logo_url_${existingProgram.program_id ? brandId : ''}`) || prev.logo_url),
      background_image_url: newUpload.background ? prev.background_image_url : (images.stamp_background || savedImages.background || prev.background_image_url),
      stamp_image_url: newUpload.stamp ? prev.stamp_image_url : (images.stamp_icon || savedImages.stamp || prev.stamp_image_url),
    }));
  }, [existingProgram]); // eslint-disable-line react-hooks/exhaustive-deps

  /* =========================
     HELPERS
  ========================= */
  const buildProgramRules = (data) => {
    const rules = {};

    if (data.stamps_required) rules.stamps_required = data.stamps_required;
    if (data.terms) rules.terms_and_conditions = data.terms;

    // Contact info
    if (data.contact_email) rules.contact_email = data.contact_email;
    if (data.contact_phone) rules.contact_phone = data.contact_phone;
    if (data.website) rules.website = data.website;

    // Security
    if (data.security_cooldown_hours) rules.security_cooldown_hours = data.security_cooldown_hours;

    // Validity
    if (data.validity_stamps_days) rules.validity_stamps_days = data.validity_stamps_days;
    if (data.validity_reward_days) rules.validity_reward_days = data.validity_reward_days;
    if (data.validity_duration_days) rules.validity_duration_days = data.validity_duration_days;

    return rules;
  };

  // Construir el objeto required_customer_fields que el backend espera
  const buildRequiredCustomerFields = (data) => {
    return {
      name: data.collect_name !== false,
      email: data.collect_email !== false,
      phone: data.collect_phone || false,
      birth_date: data.collect_birthday || false,
    };
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandId) {
      return;
    }

    const getMimeType = (b64) => b64?.match(/^data:([^;]+);/)?.[1] || 'unknown';
    console.log('[CreateClub] handleSubmit images', {
      background: formData.background_image_url
        ? {
            mimeType: getMimeType(formData.background_image_url),
            hasPrefix: formData.background_image_url.startsWith('data:'),
            length: formData.background_image_url.length,
            preview: typeof formData.background_image_url === 'string'
              ? formData.background_image_url.substring(0, 50)
              : null,
          }
        : null,
      stamp: formData.stamp_image_url
        ? {
            mimeType: getMimeType(formData.stamp_image_url),
            hasPrefix: formData.stamp_image_url.startsWith('data:'),
            length: formData.stamp_image_url.length,
            preview: typeof formData.stamp_image_url === 'string'
              ? formData.stamp_image_url.substring(0, 50)
              : null,
          }
        : null,
    });

    const program_rules = buildProgramRules(formData);
    const required_customer_fields = buildRequiredCustomerFields(formData);
    const reward_rules = formData.reward_tiers?.length
      ? { reward_tiers: formData.reward_tiers }
      : undefined;

    if (editId) {
      // Actualizar programa existente
      const idToUpdate = programId || editId;
      if (!idToUpdate) return;

      const hasChanged = (field) =>
        JSON.stringify(formData[field]) !== JSON.stringify(initialFormData.current?.[field]);

      const updateData = {};

      if (hasChanged('club_name')) updateData.program_name = formData.club_name;
      if (hasChanged('description')) updateData.description = formData.description;
      if (hasChanged('reward_text')) updateData.reward_description = formData.reward_text;
      if (reward_rules && hasChanged('reward_tiers')) updateData.reward_rules = reward_rules;

      const programRulesFields = [
        'stamps_required', 'terms', 'contact_email', 'contact_phone', 'website',
        'security_ticket_required', 'security_geofence_required', 'security_cooldown_hours',
        'validity_stamps_days', 'validity_reward_days', 'validity_duration_days',
        'collect_name', 'collect_email', 'collect_phone', 'collect_birthday', 'logo_url',
      ];
      const programRulesChanged = programRulesFields.some(hasChanged);
      if (programRulesChanged) {
        updateData.program_rules = {
          ...program_rules,
          required_customer_fields,
        };
      }

      const walletDesignChanged =
        hasChanged('card_color') || hasChanged('foreground_color') || hasChanged('label_color') || newUpload.logo;
      if (walletDesignChanged) {
        updateData.wallet_design = {
          hex_background_color: formData.card_color || null,
          hex_foreground_color: formData.foreground_color || null,
          hex_label_color: formData.label_color || null,
          show_logo_text: false,
        };
        const baseRules = updateData.program_rules || program_rules || {};
        updateData.program_rules = {
          ...baseRules,
          required_customer_fields,
        };
      }

      if (hasChanged('selected_store_ids') && formData.selected_store_ids.length > 0) {
        updateData.store_ids = formData.selected_store_ids;
      }

      console.log('[CreateClub] updateData (dirty fields only):', updateData);

      const result = await updateProgram(idToUpdate, updateData);
      if (result.success) {
        const hasStampsRequiredChanged = hasChanged('stamps_required');
        initialFormData.current = { ...formData };
        const { logo: hasNewLogo, background: hasNewBackground, stamp: hasNewStamp } = newUpload;

        // Persistir imágenes en localStorage para que aparezcan en el próximo edit
        const prevImages = (() => {
          try { return JSON.parse(localStorage.getItem(`program_images_${idToUpdate}`) || '{}'); }
          catch { return {}; }
        })();
        try {
          localStorage.setItem(`program_images_${idToUpdate}`, JSON.stringify({
            background: hasNewBackground ? formData.background_image_url : prevImages.background,
            stamp: hasNewStamp ? formData.stamp_image_url : prevImages.stamp,
            logo: hasNewLogo ? formData.logo_url : prevImages.logo,
            color: formData.stamp_icon_bg_color,
          }));
        } catch (e) { /* localStorage lleno, ignorar */ }

        if (hasNewLogo && formData.logo_url) {
          try { localStorage.setItem(`brand_logo_version_${brandId}`, Date.now()); } catch (_) {}
          api.brands.update(brandId, { logo_url: formData.logo_url })
            .catch(err => console.warn('[CreateClub edit] Error actualizando logo en brand:', err));
        }

        const shouldRegenerateImage =
          hasNewBackground || hasNewStamp || hasNewLogo || hasStampsRequiredChanged;

        const hasLocalImages = (hasNewBackground ? formData.background_image_url : prevImages.background)
                            || (hasNewStamp     ? formData.stamp_image_url       : prevImages.stamp)
                            || (hasNewLogo      ? formData.logo_url              : prevImages.logo);

        if (shouldRegenerateImage && hasLocalImages) {
          api.images.createStampCard(
            idToUpdate,
            hasNewBackground ? formData.background_image_url : (prevImages.background || formData.background_image_url || null),
            hasNewStamp     ? formData.stamp_image_url       : (prevImages.stamp     || null),
            hasNewLogo      ? formData.logo_url              : (prevImages.logo      || null),
            hasNewStamp ? formData.stamp_icon_bg_color : (prevImages.color || formData.stamp_icon_bg_color),
          )
            .then(res => console.log('[CreateClub edit] stamp card image response:', res))
            .catch(err => console.warn('[CreateClub edit] Error:', err));
        }
        navigate(createPageUrl('MyPrograms'));
      }
    } else {
      // Validar imágenes obligatorias solo en creación
      if (!formData.background_image_url) {
        toast.error('Debes subir una imagen de fondo para la tarjeta');
        return;
      }
      if (!formData.stamp_image_url) {
        toast.error('Debes subir una imagen para el sello');
        return;
      }

      // Crear nuevo programa
      const storeIds = formData.selected_store_ids.length > 0
        ? formData.selected_store_ids
        : stores.map(s => s.store_id || s.id).filter(Boolean);
      const programData = {
        program_type_id: formData.program_type_id,
        program_name: formData.club_name,
        description: formData.description,
        reward_description: formData.reward_text,
        program_rules: {
          ...program_rules,
          required_customer_fields,
        },
        reward_rules: reward_rules || {},
        wallet_design: {
          hex_background_color: formData.card_color || null,
          hex_foreground_color: formData.foreground_color || null,
          hex_label_color: formData.label_color || null,
          show_logo_text: false,
        },
        store_ids: storeIds,
      };

      const result = await createProgram(brandId, programData);
      if (result.success) {
        // Generar imagen de stamp card en background (no bloquea navegación)
        const newProgramId = result.program?.program_id || result.program?.id;
        if (newProgramId) {
          // Persistir imágenes en localStorage para que aparezcan en el próximo edit
          try {
            localStorage.setItem(`program_images_${newProgramId}`, JSON.stringify({
              background: formData.background_image_url,
              stamp: formData.stamp_image_url,
              logo: formData.logo_url,
              color: formData.stamp_icon_bg_color,
            }));
          } catch (e) { /* localStorage lleno, ignorar */ }

          try {
            const { logo: hasNewLogo, background: hasNewBackground, stamp: hasNewStamp } = newUpload;

            if (hasNewLogo && formData.logo_url) {
              const s3LogoUrl = api.images.getLogoUrl(brandId);
              if (s3LogoUrl) { try { localStorage.setItem(`brand_logo_url_${brandId}`, `${s3LogoUrl}?v=${Date.now()}`); } catch (_) {} }
              api.brands.update(brandId, { logo_url: formData.logo_url })
                .catch(err => console.warn('[CreateClub] Error actualizando logo en brand:', err));
            }

            const imgRes = await api.images.createStampCard(
              newProgramId,
              hasNewBackground ? formData.background_image_url : null,
              hasNewStamp ? formData.stamp_image_url : null,
              hasNewLogo ? formData.logo_url : null,
              formData.stamp_icon_bg_color,
            );
            console.log('[CreateClub] stamp card image response:', imgRes);
          } catch (err) {
            console.warn('[CreateClub] Error generando stamp card image:', err);
            toast.warning('El programa se creó, pero hubo un problema al procesar las imágenes.');
          }
        }
        navigate(createPageUrl('MyPrograms'));
      }
    }
  };

  /* =========================
     LOGO UPLOAD
  ========================= */
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 1MB)
    const maxSize = 1 * 1024 * 1024; // 1MB en bytes
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 1MB');
      return;
    }

    setUploadingLogo(true);

    try {
      // Convertir a base64 usando FileReader
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const raw = reader.result;
        // 600×600 para nitidez en pantallas Retina 3x (backend escala para Apple Wallet).
        const base64String = await resizeImageToMax(raw, 600, 600);
        console.log('[CreateClub] logo upload', {
          type: file.type,
          size: file.size,
          originalLength: raw.length,
          resizedLength: base64String.length,
        });
        // Guardar extensión en localStorage para poder construir la URL de S3 al editar
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        if (brandId) localStorage.setItem(`logo_ext_${brandId}`, ext);
        setFormData(prev => ({ ...prev, logo_url: base64String }));
        setNewUpload(prev => ({ ...prev, logo: true }));
        setUploadingLogo(false);
        toast.success('Logo cargado correctamente');
      };

      reader.onerror = () => {
        setUploadingLogo(false);
        toast.error('Error al leer el archivo');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadingLogo(false);
      toast.error('Error al cargar el logo');
    }
  };

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setUploadingBackground(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result;
      // Apple Wallet strip: 1125×432 @3x. Escalar si es más grande.
      const base64String = await resizeImageToMax(raw, 1125, 432);
      console.log('[CreateClub] background upload', {
        type: file.type,
        size: file.size,
        originalLength: raw.length,
        resizedLength: base64String.length,
      });
      setFormData(prev => ({ ...prev, background_image_url: base64String }));
      setNewUpload(prev => ({ ...prev, background: true }));
      setUploadingBackground(false);
      toast.success('Imagen de fondo cargada correctamente');
    };
    reader.onerror = () => {
      setUploadingBackground(false);
      toast.error('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  const handleStampImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setUploadingStamp(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result;
      // Recortar a círculo 300×300 para que el backend lo muestre llenando el slot.
      const base64String = await cropToCircle(raw, 300);
      // Detectar el color del borde del sello para usarlo como fondo del slot (elimina el anillo blanco).
      const bgColor = await sampleCircleEdgeColor(base64String, 300);
      console.log('[CreateClub] stamp upload', {
        type: file.type,
        size: file.size,
        originalLength: raw.length,
        resizedLength: base64String.length,
        detectedBgColor: bgColor,
      });
      setFormData(prev => ({ ...prev, stamp_image_url: base64String, stamp_icon_bg_color: bgColor }));
      setNewUpload(prev => ({ ...prev, stamp: true }));
      setUploadingStamp(false);
      toast.success('Imagen de sello cargada correctamente');
    };
    reader.onerror = () => {
      setUploadingStamp(false);
      toast.error('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={createPageUrl('MyPrograms')}>
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('backToPrograms')}
            </Button>
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-black bg-clip-text text-transparent mb-8">
            {editId ? t('editProgram') : t('createNewProgram')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tipo de Programa - Mobile Only (shown first on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:hidden"
          >
            <Card className="p-6 shadow-lg border-0">
              <div className="space-y-2">
                <Label htmlFor="program_type_id_mobile">Tipo de Club *</Label>
                <Select
                  value={formData.program_type_id}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, program_type_id: value }))
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecciona el tipo de Club" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151">Sellos</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-xs text-yellow-900 leading-relaxed">
                    {getProgramTypeDescription(formData.program_type_id)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Preview - Mobile (shown second on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:hidden"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{t('livePreview')}</h2>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                    {getProgramTypeName(formData.program_type_id)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="gap-2 h-7 w-7 p-0"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewPlatform === 'ios' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewPlatform('ios')}
                    className="gap-2"
                  >
                    iOS
                  </Button>
                  <Button
                    variant={previewPlatform === 'android' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewPlatform('android')}
                    className="gap-2"
                  >
                    Android
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t('livePreviewDesc')}</p>
            </div>
            <div className="scale-[0.9] origin-top -mb-12">
              <ProgramPreviewComponent card={{ ...formData, logo_url: formData.logo_url || brandData?.logo_url || '', brand_name: brandData?.brand_name || localStorage.getItem('brand_name') || '' }} showDetails platform={previewPlatform} isFlipped={isFlipped} stampCardImageUrl={stampCardImageUrl} />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 shadow-xl border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de sucursal - solo cuando hay más de 1 */}
                {stores.length > 1 && (
                  <div className="space-y-2">
                    <Label>Sucursales *</Label>
                    <p className="text-xs text-gray-500">Seleccioná las sucursales donde aplica este programa</p>
                    <div className="space-y-2 pt-1">
                      {stores.map(store => {
                        const storeId = store.store_id || store.id;
                        const isChecked = formData.selected_store_ids.includes(storeId);
                        return (
                          <label key={storeId} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  selected_store_ids: isChecked
                                    ? prev.selected_store_ids.filter(id => id !== storeId)
                                    : [...prev.selected_store_ids, storeId],
                                }));
                              }}
                              className="w-4 h-4 accent-black"
                            />
                            <span className="text-sm font-medium text-gray-800">{store.store_name || store.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tipo de Programa - Desktop Only */}
                <div className="space-y-2 hidden lg:block">
                  <Label htmlFor="program_type_id">Tipo de Club *</Label>
                  <Select
                    value={formData.program_type_id}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, program_type_id: value }))
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona el tipo de programa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151">Sellos</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <p className="text-xs text-yellow-900 leading-relaxed">
                      {getProgramTypeDescription(formData.program_type_id)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club_name">{t('clubName')} *</Label>
                  <Input
                    id="club_name"
                    value={formData.club_name}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, club_name: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(false)}
                    placeholder={t('clubNamePlaceholder')}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2 ">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="description">{t('description')}</Label>
                    <span className="text-xs text-gray-400">Solo para control interno</span>
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, description: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(false)}
                    placeholder={t('descriptionPlaceholder')}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward_text">{t('rewardOffer')} *</Label>
                  <Input
                    id="reward_text"
                    value={formData.reward_text}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, reward_text: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(false)}
                    placeholder={t('rewardOfferPlaceholder')}
                    required
                    maxLength={35}
                    className="h-12"
                  />
                  <p className="text-xs text-gray-500">
                    {formData.reward_text?.length || 0}/35 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stamps_required">{t('stampsRequired')}</Label>
                  <Input
                    id="stamps_required"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.stamps_required || ''}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Permitir campo vacío temporalmente
                      if (inputValue === '') {
                        setFormData(prev => ({ ...prev, stamps_required: '' }));
                      } else {
                        const numValue = parseInt(inputValue);
                        // Solo actualizar si es un número válido, >= 1 y <= 10
                        if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
                          setFormData(prev => ({ ...prev, stamps_required: numValue }));
                        }
                      }
                    }}
                    onFocus={() => setIsFlipped(false)}
                    onBlur={(e) => {
                      // Si el campo está vacío al perder el foco, establecer valor por defecto
                      const currentValue = e.target.value;
                      if (currentValue === '' || isNaN(parseInt(currentValue)) || parseInt(currentValue) < 1) {
                        setFormData(prev => ({ ...prev, stamps_required: 10 }));
                      } else if (parseInt(currentValue) > 10) {
                        // Si el valor es mayor a 10, establecerlo a 10
                        setFormData(prev => ({ ...prev, stamps_required: 10 }));
                      }
                    }}
                    className="h-12"
                  />
                  <p className="text-xs text-gray-500">Máximo 10 sellos</p>
                </div>

                <div className="space-y-2">
                  <Label>{t('logo')}</Label>
                  <div className="flex gap-3 items-center">
                    {formData.logo_url && (
                      <img src={formData.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-contain border" />
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                      <div 
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => setIsFlipped(false)}
                      >
                        {uploadingLogo ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{t('uploadLogo')}</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagen de Fondo</Label>
                  <div className="flex gap-3 items-center">
                    {formData.background_image_url && (
                      <img
                        src={formData.background_image_url}
                        alt="Imagen de fondo"
                        className="w-16 h-16 rounded-xl object-cover border"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                        className="hidden"
                        disabled={uploadingBackground}
                      />
                      <div
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => setIsFlipped(false)}
                      >
                        {uploadingBackground ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Subir Imagen de Fondo</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagen de Sello</Label>
                  <div className="flex gap-3 items-center">
                    {formData.stamp_image_url && (
                      <img src={formData.stamp_image_url} alt="Imagen de sello" className="w-16 h-16 rounded-xl object-cover border" />
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStampImageUpload}
                        className="hidden"
                        disabled={uploadingStamp}
                      />
                      <div
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => setIsFlipped(false)}
                      >
                        {uploadingStamp ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Subir Imagen de Sello</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card_color">{t('primaryColor')}</Label>
                    <Input
                      id="card_color"
                      type="color"
                      value={formData.card_color}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, card_color: e.target.value }))
                      }
                      className="h-12 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foreground_color">Color de texto</Label>
                    <Input
                      id="foreground_color"
                      type="color"
                      value={formData.foreground_color}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, foreground_color: e.target.value }))
                      }
                      className="h-12 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="label_color">Color de etiqueta</Label>
                    <Input
                      id="label_color"
                      type="color"
                      value={formData.label_color}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, label_color: e.target.value }))
                      }
                      className="h-12 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Niveles de Recompensa - Comentado temporalmente */}
                {/* <div className="space-y-4 border p-4 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center">
                        <Label>Niveles de Recompensa (Opcional)</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                reward_tiers: [...(prev.reward_tiers || []), { stamps: 5, name: '' }]
                            }))}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" /> Agregar Nivel
                        </Button>
                    </div>
                    
                    {(formData.reward_tiers || []).length === 0 && (
                        <p className="text-sm text-gray-500 italic">Sin niveles configurados. Se usará la recompensa principal.</p>
                    )}

                    {(formData.reward_tiers || []).map((tier, index) => (
                        <div key={index} className="flex gap-3 items-end">
                            <div className="w-24 space-y-1">
                                <Label className="text-xs">Sellos</Label>
                                <Input
                                    type="number"
                                    value={tier.stamps}
                                    onChange={(e) => {
                                        const newTiers = [...formData.reward_tiers];
                                        newTiers[index].stamps = parseInt(e.target.value);
                                        setFormData({...formData, reward_tiers: newTiers});
                                    }}
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">Recompensa</Label>
                                <Input
                                    type="text"
                                    placeholder="Ej. Café Gratis"
                                    value={tier.name}
                                    onChange={(e) => {
                                        const newTiers = [...formData.reward_tiers];
                                        newTiers[index].name = e.target.value;
                                        setFormData({...formData, reward_tiers: newTiers});
                                    }}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                    const newTiers = formData.reward_tiers.filter((_, i) => i !== index);
                                    setFormData({...formData, reward_tiers: newTiers});
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div> */}

                <div className="border-t pt-6 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('validityAndTerms')}</h3>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validity_stamps">{t('stampsValidity')}</Label>
                      <div className="relative">
                  <Input
                    id="validity_stamps"
                    type="number"
                    min="0"
                    value={formData.validity_stamps_days || ''}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        validity_stamps_days: parseInt(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className="h-12 pr-16"
                  />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{t('days')}</span>
                      </div>
                      <p className="text-xs text-gray-500">{t('noTimeLimit')}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="validity_duration">{t('programValidity')}</Label>
                      <div className="relative">
                    <Input
                      id="validity_duration"
                      type="number"
                      min="0"
                      value={formData.validity_duration_days || ''}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          validity_duration_days: parseInt(e.target.value),
                        }))
                      }
                      placeholder="0"
                      className="h-12 pr-16"
                    />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{t('days')}</span>
                      </div>
                      <p className="text-xs text-gray-500">{t('alwaysActive')}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos a Solicitar al Cliente</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-75">
                      <div className="space-y-0.5">
                        <Label className="text-base">Nombre <span className="text-xs text-gray-400">(requerido)</span></Label>
                        <p className="text-sm text-gray-500">Solicitar nombre al cliente</p>
                      </div>
                      <Input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-6 h-6 accent-yellow-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-75">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email <span className="text-xs text-gray-400">(requerido)</span></Label>
                        <p className="text-sm text-gray-500">Solicitar email al cliente</p>
                      </div>
                      <Input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-6 h-6 accent-yellow-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">Teléfono</Label>
                        <p className="text-sm text-gray-500">Solicitar número de celular</p>
                      </div>
                      <Input
                        type="checkbox"
                        checked={formData.collect_phone}
                        onChange={(e) =>
                          setFormData(prev => ({ ...prev, collect_phone: e.target.checked }))
                        }
                        className="w-6 h-6 accent-yellow-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">Cumpleaños</Label>
                        <p className="text-sm text-gray-500">Solicitar fecha de nacimiento</p>
                      </div>
                      <Input
                        type="checkbox"
                        checked={formData.collect_birthday}
                        onChange={(e) =>
                          setFormData(prev => ({ ...prev, collect_birthday: e.target.checked }))
                        }
                        className="w-6 h-6 accent-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Seguridad y Fraude - Comentado temporalmente */}
                {/* <div className="border-t pt-6 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('securityAndFraud')}</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">{t('requireTicket')}</Label>
                        <p className="text-sm text-gray-500">{t('requireTicketDesc')}</p>
                      </div>
                      <Input
                        type="checkbox"
                        checked={formData.security_ticket_required}
                        onChange={(e) => setFormData({ ...formData, security_ticket_required: e.target.checked })}
                        className="w-6 h-6 accent-yellow-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">{t('locationValidation')}</Label>
                        <p className="text-sm text-gray-500">{t('locationValidationDesc')}</p>
                      </div>
                      <Input
                        type="checkbox"
                        checked={formData.security_geofence_required}
                        onChange={(e) => setFormData({ ...formData, security_geofence_required: e.target.checked })}
                        className="w-6 h-6 accent-yellow-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cooldown">{t('cooldownTime')}</Label>
                      <Input
                        id="cooldown"
                        type="number"
                        min="0"
                        value={formData.security_cooldown_hours || 0}
                        onChange={(e) => setFormData({ ...formData, security_cooldown_hours: parseInt(e.target.value) })}
                        placeholder={t('noTimeLimit')}
                        className="h-12"
                      />
                      <p className="text-sm text-gray-500">{t('cooldownTimeDesc')}</p>
                    </div>
                  </div>
                </div> */}

<div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de tu Negocio</h3>

                  <Label htmlFor="contact_email">{t('contactEmail')}</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, contact_email: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(true)}
                    placeholder="contact@business.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">{t('contactPhone')}</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, contact_phone: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(true)}
                    placeholder="+1 (555) 123-4567"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('website')}</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, website: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(true)}
                    placeholder="https://business.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">{t('termsAndConditions')}</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, terms: e.target.value }))
                    }
                    onFocus={() => setIsFlipped(true)}
                    placeholder={t('termsPlaceholder')}
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.terms?.length || 0}/300 caracteres
                  </p>
                </div>



                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2"
                  disabled={
                    isCreating ||
                    isUpdating ||
                    uploadingLogo ||
                    uploadingBackground ||
                    uploadingStamp
                  }
                >
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {editId ? t('Guardar') : t('createProgramBtn')}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Preview - Desktop (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block lg:sticky lg:top-8 h-fit"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{t('livePreview')}</h2>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                    {getProgramTypeName(formData.program_type_id)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="gap-2 h-7 w-7 p-0"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewPlatform === 'ios' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewPlatform('ios')}
                    className="gap-2"
                  >
                    iOS
                  </Button>
                  <Button
                    variant={previewPlatform === 'android' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewPlatform('android')}
                    className="gap-2"
                  >
                    Android
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t('livePreviewDesc')}</p>
            </div>
            <ProgramPreviewComponent card={{ ...formData, logo_url: formData.logo_url || brandData?.logo_url || '', brand_name: brandData?.brand_name || localStorage.getItem('brand_name') || '' }} showDetails platform={previewPlatform} isFlipped={isFlipped} stampCardImageUrl={stampCardImageUrl} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}