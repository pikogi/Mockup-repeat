import React from "react";
import { motion } from "framer-motion";
import { Gift, CreditCard, Percent, DollarSign, Crown, Ticket, ChevronUp, Pencil, Check, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Función helper para ajustar el brillo de un color hex
function adjustColor(hex, amount) {
  if (!hex) return '#000000';
  hex = hex.replace('#', '');
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Función helper para obtener el tipo basado en program_type_id
function getProgramTypeFromId(programTypeId) {
  const typeMap = {
    '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151': 'stamps',
    '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc152': 'giftCard',
    '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc153': 'discount',
    '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc154': 'cashback',
    '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc155': 'membership',
    '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc156': 'coupon'
  };
  return typeMap[programTypeId] || 'stamps';
}

// Función helper para obtener info del tipo de programa
function getCardTypeInfo(cardType) {
  const types = {
    'stamps': { name: 'Sellos', color: '#EAB308', icon: Gift },
    'cashback': { name: 'Cashback', color: '#10B981', icon: DollarSign },
    'giftCard': { name: 'Gift Card', color: '#EC4899', icon: CreditCard },
    'membership': { name: 'Membresía', color: '#8B5CF6', icon: Crown },
    'discount': { name: 'Descuento', color: '#3B82F6', icon: Percent },
    'coupon': { name: 'Cupones', color: '#F97316', icon: Ticket }
  };
  return types[cardType] || types['stamps'];
}

// Componente para el grid de sellos
function StampsGrid({ stampsRequired, currentStamps, stampImageUrl, backgroundColor }) {
  const getStampSize = (total) => {
    if (total <= 3) return 80;
    if (total === 4) return 72;
    if (total === 5) return 64;
    if (total <= 8) return 62;
    if (total <= 10) return 56;
    if (total <= 12) return 50;
    return 46;
  };

  const getLayout = (total) => {
    // Hasta 5 sellos: 1 línea
    if (total <= 5) return { rows: 1, cols: total, topCount: total, bottomCount: 0 };
    // 6+ sellos: dividir en 2 filas
    // Primera fila: ceil(total/2), Segunda fila: floor(total/2)
    // 6 -> 3,3 | 7 -> 4,3 | 8 -> 4,4 | 9 -> 5,4 | 10 -> 5,5
    const topCount = Math.ceil(total / 2);
    const bottomCount = Math.floor(total / 2);
    return { rows: 2, cols: topCount, topCount, bottomCount };
  };

  const layout = getLayout(stampsRequired);
  const stampSize = getStampSize(stampsRequired);
  const stamps = Array.from({ length: stampsRequired });
  const topStamps = stamps.slice(0, layout.topCount);
  const bottomStamps = stamps.slice(layout.topCount, layout.topCount + layout.bottomCount);

  const [imageErrors, setImageErrors] = React.useState({});

  const imageUrl = React.useMemo(() => {
    if (!stampImageUrl) return null;
    if (stampImageUrl.startsWith('http://') || stampImageUrl.startsWith('https://') || stampImageUrl.startsWith('data:')) return stampImageUrl;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${stampImageUrl}`;
  }, [stampImageUrl]);

  const renderStamp = (index, isCompleted) => {
    const isFirst = index === 0;
    const hasImageError = imageErrors[index];
    const showImageInPreview = stampImageUrl && imageUrl && !hasImageError;
    const showIcon = isCompleted && !showImageInPreview;
    const iconSize = Math.round(stampSize * 0.5);
    const placeholderSize = Math.round(stampSize * 0.43);

    return (
      <div
        key={index}
        className="flex-shrink-0"
        style={{
          width: `${stampSize}px`,
          height: `${stampSize}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: showImageInPreview ? 'transparent' : (isFirst ? 'white' : 'rgba(255, 255, 255, 0.35)'),
          boxShadow: isFirst ? '0 4px 8px rgba(0, 0, 0, 0.15)' : 'none',
          opacity: isFirst ? 1 : 0.55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {showImageInPreview && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                borderRadius: '50%',
              }}
            />
            <img
              src={imageUrl}
              alt=""
              style={{ display: 'none' }}
              onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
            />
          </>
        )}
        {showIcon && (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: backgroundColor, width: `${iconSize}px`, height: `${iconSize}px` }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {!isCompleted && !showImageInPreview && !isFirst && (
          <div className="rounded-full bg-white bg-opacity-50 border border-white border-opacity-50" style={{ width: `${placeholderSize}px`, height: `${placeholderSize}px` }} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full px-2">
      <div className="flex gap-2 justify-center flex-nowrap">
        {topStamps.map((_, index) => renderStamp(index, index < currentStamps))}
      </div>
      {layout.rows === 2 && (
        <div className="flex gap-2 justify-center">
          {bottomStamps.map((_, index) => renderStamp(layout.topCount + index, layout.topCount + index < currentStamps))}
        </div>
      )}
    </div>
  );
}

// Preview para Gift Card - Estilo Apple Wallet storeCard
function GiftCardPreview({ card, foregroundColor, backgroundColor }) {
  const balance = card.balance || 500;
  const cardNumber = card.card_number || '•••• •••• •••• 4532';

  return (
    <div className="relative h-44 overflow-hidden">
      {/* Strip background - área visual principal */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustColor(backgroundColor, -30)} 100%)`
        }}
      />

      {/* Decoración sutil */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
        style={{
          background: foregroundColor,
          transform: 'translate(30%, -30%)'
        }}
      />

      {/* Contenido */}
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        {/* Icono de tarjeta */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${foregroundColor}20` }}
        >
          <CreditCard className="w-7 h-7" style={{ color: foregroundColor }} />
        </div>

        {/* Balance - Primary Field */}
        <p className="text-xs uppercase tracking-wider opacity-70 mb-1" style={{ color: foregroundColor }}>
          Saldo disponible
        </p>
        <p className="text-4xl font-bold tracking-tight" style={{ color: foregroundColor }}>
          ${balance.toLocaleString()}
        </p>

        {/* Número de tarjeta - Secondary Field */}
        <p className="text-xs mt-3 font-mono opacity-60" style={{ color: foregroundColor }}>
          {cardNumber}
        </p>
      </div>
    </div>
  );
}

// Preview para Cashback - Estilo Apple Wallet generic
function CashbackPreview({ card, foregroundColor, backgroundColor }) {
  const cashbackPercent = card.cashback_percent || 5;
  const accumulatedCashback = card.accumulated_cashback || 150;
  const totalSpent = card.total_spent || 3000;

  return (
    <div className="relative h-44 overflow-hidden">
      {/* Background con gradiente */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundColor} 0%, ${adjustColor(backgroundColor, -20)} 100%)`
        }}
      />

      {/* Contenido estructurado estilo Apple Wallet */}
      <div className="relative h-full flex flex-col p-4">
        {/* Primary Field - Porcentaje de cashback */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70" style={{ color: foregroundColor }}>
              Tu cashback
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold" style={{ color: foregroundColor }}>
                {cashbackPercent}
              </span>
              <span className="text-2xl font-semibold opacity-80" style={{ color: foregroundColor }}>%</span>
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${foregroundColor}15` }}
          >
            <DollarSign className="w-7 h-7" style={{ color: foregroundColor }} />
          </div>
        </div>

        {/* Secondary Fields - Grid de 2 columnas */}
        <div className="mt-auto grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60" style={{ color: foregroundColor }}>
              Acumulado
            </p>
            <p className="text-xl font-bold" style={{ color: foregroundColor }}>
              ${accumulatedCashback}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider opacity-60" style={{ color: foregroundColor }}>
              Total gastado
            </p>
            <p className="text-xl font-bold" style={{ color: foregroundColor }}>
              ${totalSpent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview para Descuentos - Estilo Apple Wallet coupon
function DiscountPreview({ card, foregroundColor, backgroundColor }) {
  const discountPercent = card.discount_percent || 15;
  const discountType = card.discount_type || 'Descuento Miembro';
  const validUntil = card.valid_until || 'Sin vencimiento';

  return (
    <div className="relative h-44 overflow-hidden">
      {/* Fondo con patrón de cupón */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor }}
      />

      {/* Efecto de borde dentado típico de cupón */}
      <div className="absolute left-0 top-1/2 w-4 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: '#f8fafc' }} />
      <div className="absolute right-0 top-1/2 w-4 h-8 translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: '#f8fafc' }} />

      {/* Línea punteada decorativa */}
      <div className="absolute left-6 right-6 top-1/2 border-t-2 border-dashed opacity-20" style={{ borderColor: foregroundColor }} />

      {/* Contenido */}
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        {/* Primary Field - Descuento prominente */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-1">
            <span className="text-6xl font-black" style={{ color: foregroundColor }}>
              {discountPercent}
            </span>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold leading-none" style={{ color: foregroundColor }}>%</span>
              <span className="text-xs uppercase tracking-wider opacity-70" style={{ color: foregroundColor }}>OFF</span>
            </div>
          </div>
        </div>

        {/* Secondary Fields */}
        <div
          className="px-4 py-1.5 rounded-full mt-2"
          style={{ backgroundColor: `${foregroundColor}15` }}
        >
          <p className="text-sm font-semibold" style={{ color: foregroundColor }}>
            {discountType}
          </p>
        </div>

        <p className="text-xs mt-3 opacity-60" style={{ color: foregroundColor }}>
          Válido: {validUntil}
        </p>
      </div>
    </div>
  );
}

// Preview para Membresías - Estilo Apple Wallet generic (premium)
function MembershipPreview({ card, foregroundColor, backgroundColor }) {
  const membershipLevel = card.membership_level || 'Gold';
  const memberSince = card.member_since || '2024';
  const memberId = card.member_id || 'MBR-001234';
  const benefits = card.benefits || ['Envío gratis', 'Acceso VIP', 'Ofertas exclusivas'];

  // Colores según nivel de membresía
  const levelColors = {
    'Bronze': '#CD7F32',
    'Silver': '#C0C0C0',
    'Gold': '#FFD700',
    'Platinum': '#E5E4E2',
    'Diamond': '#B9F2FF'
  };
  const levelColor = levelColors[membershipLevel] || '#FFD700';

  return (
    <div className="relative h-44 overflow-hidden">
      {/* Background con efecto premium */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustColor(backgroundColor, -25)} 50%, ${backgroundColor} 100%)`
        }}
      />

      {/* Efecto de brillo sutil */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          background: `linear-gradient(45deg, transparent 40%, ${foregroundColor} 50%, transparent 60%)`
        }}
      />

      {/* Contenido */}
      <div className="relative h-full flex flex-col p-4">
        {/* Header Field - Nivel de membresía */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${levelColor} 0%, ${adjustColor(levelColor, -30)} 100%)`,
                boxShadow: `0 4px 12px ${levelColor}40`
              }}
            >
              <Crown className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-60" style={{ color: foregroundColor }}>
                Nivel
              </p>
              <p className="text-xl font-bold" style={{ color: foregroundColor }}>
                {membershipLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Fields */}
        <div className="mt-auto">
          {/* Beneficios como tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {benefits.slice(0, 3).map((benefit, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${foregroundColor}15`,
                  color: foregroundColor
                }}
              >
                {benefit}
              </span>
            ))}
          </div>

          {/* Info del miembro */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-50" style={{ color: foregroundColor }}>
                Miembro desde
              </p>
              <p className="text-sm font-semibold" style={{ color: foregroundColor }}>
                {memberSince}
              </p>
            </div>
            <p className="text-xs font-mono opacity-50" style={{ color: foregroundColor }}>
              {memberId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview para Cupones - Estilo Apple Wallet coupon (colección de cupones)
function CouponPreview({ card, foregroundColor, backgroundColor }) {
  const availableCoupons = card.available_coupons || 3;
  const totalCoupons = card.total_coupons || 5;
  const nextCoupon = card.next_coupon || 'Café gratis';
  const expiresIn = card.expires_in || '7 días';

  return (
    <div className="relative h-44 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor }}
      />

      {/* Patrón de fondo sutil */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${foregroundColor} 0, ${foregroundColor} 1px, transparent 0, transparent 50%)`,
          backgroundSize: '10px 10px'
        }}
      />

      {/* Efecto de cupón - bordes dentados */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around -translate-x-1/2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f8fafc' }} />
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around translate-x-1/2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f8fafc' }} />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative h-full flex flex-col p-4">
        {/* Header - Cupones disponibles */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${foregroundColor}15` }}
            >
              <Ticket className="w-5 h-5" style={{ color: foregroundColor }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-60" style={{ color: foregroundColor }}>
                Cupones
              </p>
              <p className="text-lg font-bold" style={{ color: foregroundColor }}>
                {availableCoupons} disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Visual de cupones - progress bar */}
        <div className="mb-3">
          <div className="flex gap-1.5">
            {Array.from({ length: totalCoupons }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: i < availableCoupons ? foregroundColor : `${foregroundColor}25`
                }}
              />
            ))}
          </div>
          <p className="text-xs mt-1 opacity-50 text-right" style={{ color: foregroundColor }}>
            {availableCoupons}/{totalCoupons}
          </p>
        </div>

        {/* Next reward */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-50" style={{ color: foregroundColor }}>
              Próximo cupón
            </p>
            <p className="text-sm font-semibold" style={{ color: foregroundColor }}>
              {nextCoupon}
            </p>
          </div>
          <div
            className="px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: `${foregroundColor}15`,
              color: foregroundColor
            }}
          >
            Vence en {expiresIn}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ANDROID / GOOGLE WALLET PREVIEW COMPONENTS
// ============================================

// Componente de Text Module estilo Google Wallet
function GoogleTextModule({ label, value, foregroundColor, align = 'left' }) {
  return (
    <div className={`${align === 'right' ? 'text-right' : ''}`}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium" style={{ color: foregroundColor }}>{value}</p>
    </div>
  );
}

// Preview Stamps para Android - mismo formato que iOS
function AndroidStampsPreview({ card, backgroundColor, currentStamps, stampsRequired }) {
  return (
    <div className="relative h-44 overflow-hidden">
      {card.background_image_url ? (
        <>
          <img
            src={card.background_image_url?.startsWith('http') || card.background_image_url?.startsWith('data:') ? card.background_image_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.background_image_url}`}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: '#D1D5DB' }} />
      )}
      <div className="relative h-full flex items-center justify-center p-2">
        <StampsGrid
          stampsRequired={stampsRequired}
          currentStamps={currentStamps}
          stampImageUrl={card.stamp_image_url}
          backgroundColor={backgroundColor}
        />
      </div>
    </div>
  );
}

// Preview Gift Card para Android
function AndroidGiftCardPreview({ card, backgroundColor }) {
  const balance = card.balance || 500;
  const cardNumber = card.card_number || '•••• 4532';

  return (
    <div className="relative h-48">
      {/* Hero gradient */}
      <div
        className="h-24 w-full"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustColor(backgroundColor, -40)} 100%)`
        }}
      />

      {/* Balance card flotante */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Saldo disponible</p>
              <p className="text-3xl font-bold text-gray-900">${balance.toLocaleString()}</p>
              <p className="text-xs text-gray-400 font-mono mt-1">{cardNumber}</p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor }}
            >
              <CreditCard className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Cashback para Android
function AndroidCashbackPreview({ card, backgroundColor }) {
  const cashbackPercent = card.cashback_percent || 5;
  const accumulatedCashback = card.accumulated_cashback || 150;
  const totalSpent = card.total_spent || 3000;

  return (
    <div className="relative h-48">
      {/* Hero con porcentaje */}
      <div
        className="h-24 w-full flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center">
          <p className="text-white/70 text-xs uppercase tracking-wider">Tu cashback</p>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-black text-white">{cashbackPercent}</span>
            <span className="text-2xl font-bold text-white/80">%</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${backgroundColor}10` }}>
              <p className="text-xs text-gray-500">Acumulado</p>
              <p className="text-xl font-bold" style={{ color: backgroundColor }}>${accumulatedCashback}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Total gastado</p>
              <p className="text-xl font-bold text-gray-700">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Discount para Android - Estilo Google Wallet Offer
function AndroidDiscountPreview({ card, backgroundColor }) {
  const discountPercent = card.discount_percent || 15;
  const discountType = card.discount_type || 'Descuento Miembro';
  const validUntil = card.valid_until || 'Sin vencimiento';

  return (
    <div className="relative h-48">
      {/* Hero con descuento */}
      <div
        className="h-28 w-full flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* Decoración circular */}
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}
        />
        <div
          className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}
        />

        <div className="text-center relative z-10">
          <div className="flex items-center justify-center gap-1">
            <span className="text-6xl font-black text-white">{discountPercent}</span>
            <div className="text-left">
              <span className="text-2xl font-bold text-white block leading-none">%</span>
              <span className="text-xs text-white/80 uppercase">OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info del descuento */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-1"
                style={{ backgroundColor }}
              >
                {discountType}
              </span>
              <p className="text-xs text-gray-500">Válido: {validUntil}</p>
            </div>
            <Percent className="w-8 h-8 opacity-20" style={{ color: backgroundColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Membership para Android - Estilo Google Wallet Generic
function AndroidMembershipPreview({ card, backgroundColor }) {
  const membershipLevel = card.membership_level || 'Gold';
  const memberSince = card.member_since || '2024';
  const memberId = card.member_id || 'MBR-001234';
  const benefits = card.benefits || ['Envío gratis', 'Acceso VIP', 'Ofertas exclusivas'];

  const levelColors = {
    'Bronze': '#CD7F32',
    'Silver': '#C0C0C0',
    'Gold': '#FFD700',
    'Platinum': '#E5E4E2',
    'Diamond': '#B9F2FF'
  };
  const levelColor = levelColors[membershipLevel] || '#FFD700';

  return (
    <div className="relative h-48">
      {/* Hero con nivel */}
      <div
        className="h-20 w-full flex items-center px-4"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustColor(backgroundColor, -30)} 100%)`
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${levelColor} 0%, ${adjustColor(levelColor, -40)} 100%)`
            }}
          >
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs">Nivel de Membresía</p>
            <p className="text-white text-xl font-bold">{membershipLevel}</p>
          </div>
        </div>
      </div>

      {/* Benefits y info */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {benefits.slice(0, 3).map((benefit, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700"
            >
              {benefit}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Miembro desde {memberSince}</span>
          <span className="font-mono">{memberId}</span>
        </div>
      </div>
    </div>
  );
}

// Preview Coupon para Android - Estilo Google Wallet Offer
function AndroidCouponPreview({ card, backgroundColor }) {
  const availableCoupons = card.available_coupons || 3;
  const totalCoupons = card.total_coupons || 5;
  const nextCoupon = card.next_coupon || 'Café gratis';
  const expiresIn = card.expires_in || '7 días';

  return (
    <div className="relative h-48">
      {/* Hero */}
      <div
        className="h-20 w-full flex items-center justify-between px-4"
        style={{ backgroundColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs">Cupones disponibles</p>
            <p className="text-white text-2xl font-bold">{availableCoupons}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/70 text-xs">de {totalCoupons}</p>
        </div>
      </div>

      {/* Cupones visual */}
      <div className="px-4 py-3">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-3">
          {Array.from({ length: totalCoupons }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                backgroundColor: i < availableCoupons ? backgroundColor : '#e5e7eb',
              }}
            >
              {i < availableCoupons && (
                <Ticket className="w-4 h-4 text-white" />
              )}
            </div>
          ))}
        </div>

        {/* Next reward info */}
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Próximo cupón</p>
            <p className="text-sm font-semibold text-gray-900">{nextCoupon}</p>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium text-white"
            style={{ backgroundColor }}
          >
            {expiresIn}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProgramPreviewComponent({
  card,
  demoStamps = 0,
  demoStampsRequired = null,
  platform = 'ios',
  isFlipped = false,
  customerCardId = null, // ID de la tarjeta del cliente (para QR de clientes registrados)
}) {
  // Determinar tipo de programa
  const programType = card.card_type || getProgramTypeFromId(card.program_type_id);
  const typeInfo = getCardTypeInfo(programType);

  const currentStamps = demoStamps !== undefined ? demoStamps : (card.stamps || 0);
  const stampsRequired = demoStampsRequired !== null ? demoStampsRequired : (card.stamps_required || 10);

  const cardBackgroundColor = card.wallet_design?.hex_background_color || card.card_color || '#000000';

  const getTextColor = (bgColor) => {
    if (!bgColor || bgColor === '#FFFFFF' || bgColor === 'white') return '#000000';
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const foregroundColor = card.wallet_design?.hex_foreground_color || card.foreground_color || getTextColor(cardBackgroundColor);
  const labelColor = card.wallet_design?.hex_label_color || card.label_color || foregroundColor;
  const isIOS = platform === 'ios';
  const cardBorderRadius = isIOS ? 'rounded-3xl' : 'rounded-xl';
  const fixedCardHeight = '580px';

  // Renderizar contenido central según tipo de programa - iOS
  const renderIOSProgramContent = () => {
    switch (programType) {
      case 'giftCard':
        return <GiftCardPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'cashback':
        return <CashbackPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'discount':
        return <DiscountPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'membership':
        return <MembershipPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'coupon':
        return <CouponPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'stamps':
      default: {
        // Rendering normal: background + StampsGrid
        return (
          <div className="relative h-44 overflow-hidden">
            {card.background_image_url ? (
              <>
                <img
                  key={card.background_image_url}
                  src={card.background_image_url?.startsWith('http') || card.background_image_url?.startsWith('data:') ? card.background_image_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.background_image_url}`}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ backgroundColor: '#D1D5DB' }} />
            )}
            <div className="relative h-full flex items-center justify-center p-2">
              <StampsGrid
                stampsRequired={stampsRequired}
                currentStamps={currentStamps}
                stampImageUrl={card.stamp_image_url}
                backgroundColor={cardBackgroundColor}
              />
            </div>
          </div>
        );
      }
    }
  };

  // Renderizar contenido central según tipo de programa - Android
  const renderAndroidProgramContent = () => {
    switch (programType) {
      case 'giftCard':
        return <AndroidGiftCardPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'cashback':
        return <AndroidCashbackPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'discount':
        return <AndroidDiscountPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'membership':
        return <AndroidMembershipPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'coupon':
        return <AndroidCouponPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} />;
      case 'stamps':
      default: {
        // Rendering normal
        return <AndroidStampsPreview card={card} foregroundColor={foregroundColor} backgroundColor={cardBackgroundColor} currentStamps={currentStamps} stampsRequired={stampsRequired} />;
      }
    }
  };

  const renderProgramContent = () => {
    return isIOS ? renderIOSProgramContent() : renderAndroidProgramContent();
  };

  // Dorso de la tarjeta
  const CardBack = () => (
    <div
      className={`absolute inset-0 ${cardBorderRadius} overflow-hidden shadow-lg backface-hidden flex flex-col`}
      style={{ backgroundColor: cardBackgroundColor, color: foregroundColor, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', height: fixedCardHeight }}
    >
      <div className="p-3 flex items-center justify-between gap-3 border-b flex-shrink-0" style={{ backgroundColor: cardBackgroundColor, borderColor: foregroundColor + '20' }}>
        <div className="flex items-center gap-3 min-w-0">
          {card.logo_url ? (
            <div className="h-9 max-w-[108px] rounded-lg overflow-hidden flex-shrink-0 flex items-center">
              <img
                key={card.logo_url}
                src={card.logo_url?.startsWith('http') || card.logo_url?.startsWith('data:') ? card.logo_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.logo_url}`}
                alt={card.brand_name || card.club_name}
                className="h-full w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
              <Gift className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
        <p className="text-base flex-shrink-0" style={{ color: labelColor }}>{card.club_name || ''}</p>
      </div>

      <div className="p-3 flex-1 overflow-y-auto" style={{ minHeight: 0, maxHeight: '100%' }}>
        <div className="space-y-3">
          {card.terms && (
            <div>
              <p className="text-xs uppercase mb-2 opacity-70 font-semibold" style={{ color: foregroundColor }}>Términos y Condiciones</p>
              <p className="text-xs leading-relaxed break-words" style={{ color: foregroundColor }}>{card.terms}</p>
            </div>
          )}
          {(card.contact_email || card.contact_phone || card.website) && (
            <div className="mt-1">
              {card.contact_email && (
                <>
                  <div style={{ borderTopColor: foregroundColor + '25', borderTopWidth: 1 }} className="flex items-center justify-between py-2.5">
                    <span className="text-xs font-medium" style={{ color: foregroundColor }}>Correo electrónico</span>
                    <span className="text-xs font-medium text-blue-400 truncate ml-2 max-w-[55%] text-right">{card.contact_email}</span>
                  </div>
                </>
              )}
              {card.contact_phone && (
                <>
                  <div style={{ borderTopColor: foregroundColor + '25', borderTopWidth: 1 }} className="flex items-center justify-between py-2.5">
                    <span className="text-xs font-medium" style={{ color: foregroundColor }}>Teléfono</span>
                    <span className="text-xs font-medium text-blue-400 truncate ml-2 max-w-[55%] text-right">{card.contact_phone}</span>
                  </div>
                </>
              )}
              {card.website && (
                <>
                  <div style={{ borderTopColor: foregroundColor + '25', borderTopWidth: 1 }} className="flex items-center justify-between py-2.5">
                    <span className="text-xs font-medium" style={{ color: foregroundColor }}>Sitio web</span>
                    <span className="text-xs font-medium text-blue-400 truncate ml-2 max-w-[55%] text-right">{card.website}</span>
                  </div>
                </>
              )}
            </div>
          )}
          {!card.terms && !card.contact_email && !card.contact_phone && !card.website && (
            <div className="text-center py-8">
              <p className="text-xs opacity-50" style={{ color: foregroundColor }}>No hay información adicional</p>
            </div>
          )}
        </div>
      </div>

      <div className="py-3 border-t text-center flex-shrink-0" style={{ backgroundColor: cardBackgroundColor, borderColor: foregroundColor + '20' }}>
        <p className="text-xs opacity-70" style={{ color: foregroundColor }}>by Repeat.la</p>
      </div>
    </div>
  );

  const TypeIcon = typeInfo.icon;

  // Renderizar tarjeta iOS (Apple Wallet style)
  const renderIOSCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: fixedCardHeight }}
      >
        {/* Frente de la tarjeta */}
        <div
          className={`absolute inset-0 ${cardBorderRadius} overflow-hidden shadow-lg backface-hidden flex flex-col`}
          style={{ backgroundColor: cardBackgroundColor, color: foregroundColor, backfaceVisibility: 'hidden', height: fixedCardHeight }}
        >
          {/* Header */}
          <div className="p-3 flex items-center justify-between gap-3 border-b flex-shrink-0" style={{ backgroundColor: cardBackgroundColor, borderColor: foregroundColor + '20' }}>
            <div className="flex items-center gap-3 min-w-0">
              {card.logo_url ? (
                <div className="h-9 max-w-[108px] rounded-lg overflow-hidden flex-shrink-0 flex items-center">
                  <img
                    src={card.logo_url?.startsWith('http') || card.logo_url?.startsWith('data:') ? card.logo_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.logo_url}`}
                    alt={card.brand_name || card.club_name}
                    className="h-full w-auto object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
                  <TypeIcon className="w-4 h-4 text-gray-400" />
                </div>
              )}
                </div>
            <p className="text-base flex-shrink-0" style={{ color: labelColor }}>{card.club_name || ''}</p>
          </div>

          {/* Contenido central según tipo */}
          <div className="flex-shrink-0">
            {renderProgramContent()}
          </div>

          {/* Info de recompensa - Adaptada según tipo */}
          <div className="p-2.5 border-t flex-shrink-0" style={{ backgroundColor: cardBackgroundColor, borderColor: foregroundColor + '20' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase mb-1" style={{ color: labelColor }}>
                  {programType === 'stamps' && 'Oferta de Recompensa'}
                  {programType === 'giftCard' && 'Beneficio'}
                  {programType === 'cashback' && 'Beneficio'}
                  {programType === 'discount' && 'Aplica en'}
                  {programType === 'membership' && 'Beneficio Principal'}
                  {programType === 'coupon' && 'Próxima Recompensa'}
                </p>
                <p className="font-semibold text-sm" style={{ color: foregroundColor }}>{card.reward_text || 'Sin definir'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase mb-1" style={{ color: labelColor }}>
                  {programType === 'stamps' && 'Sellos'}
                  {programType === 'giftCard' && 'Estado'}
                  {programType === 'cashback' && 'Estado'}
                  {programType === 'discount' && 'Validez'}
                  {programType === 'membership' && 'Status'}
                  {programType === 'coupon' && 'Cupones'}
                </p>
                <p className="font-semibold text-sm" style={{ color: foregroundColor }}>
                  {programType === 'stamps' && `${currentStamps}/${stampsRequired}`}
                  {programType === 'giftCard' && 'Activo'}
                  {programType === 'cashback' && 'Activo'}
                  {programType === 'discount' && 'Vigente'}
                  {programType === 'membership' && 'Activo'}
                  {programType === 'coupon' && `${card.available_coupons || 3} disp.`}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-3 flex flex-col items-center flex-shrink-0" style={{ backgroundColor: cardBackgroundColor }}>
            <div className="bg-white rounded-lg p-3 shadow-inner">
              <div className="w-40 h-40 bg-white rounded flex items-center justify-center">
                <QRCodeSVG
                  value={customerCardId
                    ? JSON.stringify({ card_id: customerCardId })
                    : (card.id ? `https://repeat.app/card/${card.id}` : 'https://repeat.app')}
                  size={160}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
            </div>
            <p className="text-xs mt-1.5 opacity-70" style={{ color: foregroundColor }}>by Repeat.la</p>
          </div>
        </div>

        {/* Dorso */}
        <CardBack />
      </motion.div>
    </motion.div>
  );

  // Renderizar tarjeta Android para programas de tipo stamps
  const renderAndroidStampsCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: fixedCardHeight }}
      >
        {/* Frente */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl backface-hidden flex flex-col"
          style={{ backfaceVisibility: 'hidden', height: fixedCardHeight }}
        >
          {/* Sección superior — todo sobre el color de fondo */}
          <div className="flex flex-col p-4 gap-3 flex-shrink-0" style={{ backgroundColor: cardBackgroundColor }}>

            {/* Fila 1: Logo + brand name */}
            <div className="flex items-center gap-2">
              {card.logo_url ? (
                <div className="w-9 h-9 bg-white rounded-full p-1.5 flex items-center justify-center shadow-sm flex-shrink-0">
                  <img
                    src={card.logo_url?.startsWith('http') || card.logo_url?.startsWith('data:') ? card.logo_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.logo_url}`}
                    alt={card.brand_name || card.club_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <TypeIcon className="w-4 h-4" style={{ color: cardBackgroundColor }} />
                </div>
              )}
            </div>

            {/* Fila 2: Club name */}
            <h2 className="text-white text-2xl font-bold leading-tight">
              {card.club_name || card.program_name || ''}
            </h2>

            {/* Fila 3: Text modules */}
            <div className="flex justify-between">
              <div>
                <p className="text-white/60 text-xs">Oferta de recompensa</p>
                <p className="text-white text-sm font-semibold">{card.reward_text || 'Sin definir'}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Sellos - Premios</p>
                <p className="text-white text-sm font-semibold">{currentStamps}/{stampsRequired} - 0</p>
              </div>
            </div>

            {/* Fila 4: QR */}
            <div className="flex justify-center">
              <div className="bg-white/95 rounded-xl p-3 shadow-inner">
                <QRCodeSVG
                  value={customerCardId
                    ? JSON.stringify({ card_id: customerCardId })
                    : (card.id ? `https://repeat.app/card/${card.id}` : 'https://repeat.app')}
                  size={150}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
            </div>

            {/* Fila 5: branding */}
            <p className="text-center text-white/60 text-xs">by Repeat.la</p>
          </div>

          {/* Sección inferior — imagen de fondo + sellos */}
          <div className="flex-1 relative overflow-hidden">
            {card.background_image_url ? (
              <>
                <img
                  src={card.background_image_url?.startsWith('http') || card.background_image_url?.startsWith('data:') ? card.background_image_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.background_image_url}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/10" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ backgroundColor: adjustColor(cardBackgroundColor, -30) }} />
            )}
            <div className="relative h-full flex items-center justify-center px-4">
              <StampsGrid
                stampsRequired={stampsRequired}
                currentStamps={currentStamps}
                stampImageUrl={card.stamp_image_url}
                backgroundColor={cardBackgroundColor}
              />
            </div>
          </div>
        </div>

        {/* Dorso - Android (Google Wallet style) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl backface-hidden flex flex-col"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', height: fixedCardHeight, backgroundColor: '#0f0f0f' }}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              {/* Logo */}
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow">
                {card.logo_url ? (
                  <img
                    src={card.logo_url?.startsWith('http') || card.logo_url?.startsWith('data:') ? card.logo_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.logo_url}`}
                    alt={card.brand_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <TypeIcon className="w-7 h-7" style={{ color: cardBackgroundColor }} />
                )}
              </div>
              {/* Program name — arriba de términos */}
              {card.club_name && (
                <p className="text-base font-bold text-white">{card.club_name}</p>
              )}
              {/* Términos y Condiciones */}
              {card.terms && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">Términos y Condiciones</p>
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.terms}</p>
                </div>
              )}
              {/* Teléfono */}
              {card.contact_phone && (
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Teléfono</p>
                  <p className="text-sm text-gray-400">{card.contact_phone}</p>
                </div>
              )}
              {/* Sitio web */}
              {card.website && (
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Sitio web</p>
                  <p className="text-sm text-gray-400">{card.website}</p>
                </div>
              )}
              {/* Email — botón */}
              {card.contact_email && (
                <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#1e1e1e' }}>
                  <Mail className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-200 truncate">{card.contact_email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Renderizar tarjeta Android (Google Wallet style)
  const renderAndroidCard = () => {
    if (programType === 'stamps') return renderAndroidStampsCard();
    return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: fixedCardHeight }}
      >
        {/* Frente de la tarjeta - Google Wallet Style */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl backface-hidden flex flex-col bg-white"
          style={{ backfaceVisibility: 'hidden', height: fixedCardHeight }}
        >
          {/* Header con logo - estilo Google Wallet */}
          <div
            className="p-3 flex items-center justify-between gap-3"
            style={{ backgroundColor: cardBackgroundColor }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {card.logo_url ? (
                <div className="w-10 h-10 bg-white rounded-full p-1.5 flex items-center justify-center shadow-sm flex-shrink-0">
                  <img
                    src={card.logo_url?.startsWith('http') || card.logo_url?.startsWith('data:') ? card.logo_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.logo_url}`}
                    alt={card.brand_name || card.club_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <TypeIcon className="w-5 h-5" style={{ color: cardBackgroundColor }} />
                </div>
              )}
            </div>
            <p className="text-base text-white/70 flex-shrink-0">{card.club_name || ''}</p>
          </div>

          {/* Contenido central según tipo - Android */}
          <div className="flex-shrink-0 bg-white">
            {renderProgramContent()}
          </div>

          {/* Text Modules - Info estructurada estilo Google */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="grid grid-cols-2 gap-4">
              <GoogleTextModule
                label={programType === 'stamps' ? 'Recompensa' : 'Beneficio'}
                value={card.reward_text || 'Sin definir'}
                foregroundColor="#1f2937"
              />
              <GoogleTextModule
                label={programType === 'stamps' ? 'Progreso' : 'Estado'}
                value={programType === 'stamps' ? `${currentStamps} de ${stampsRequired}` : 'Activo'}
                foregroundColor="#1f2937"
                align="right"
              />
            </div>
          </div>

          {/* Barcode section - estilo Google Wallet */}
          <div className="mt-auto p-4 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
              <div className="w-44 h-44 bg-white rounded-lg p-2 shadow-inner flex items-center justify-center">
                <QRCodeSVG
                  value={customerCardId
                    ? JSON.stringify({ card_id: customerCardId })
                    : (card.id ? `https://repeat.app/card/${card.id}` : 'https://repeat.app')}
                  size={160}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Escanea para acumular</p>
            </div>
          </div>

          {/* Footer */}
          <div className="py-2 text-center bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-400">Powered by Repeat.la</p>
          </div>
        </div>

        {/* Dorso - Android (Google Wallet style) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl backface-hidden flex flex-col"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', height: fixedCardHeight, backgroundColor: '#0f0f0f' }}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">

              {/* Logo */}
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow">
                {card.logo_url ? (
                  <img
                    src={card.logo_url?.startsWith('http') || card.logo_url?.startsWith('data:') ? card.logo_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${card.logo_url}`}
                    alt={card.brand_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <TypeIcon className="w-7 h-7" style={{ color: cardBackgroundColor }} />
                )}
              </div>

              {/* Member name */}
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Member name</p>
                <p className="text-sm text-gray-400">Tu nombre</p>
              </div>

              {/* Member ID */}
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Member ID</p>
                <p className="text-xs text-gray-400 font-mono break-all">
                  {customerCardId || '00000000-0000-0000-0000-000000000000'}
                </p>
              </div>

              {/* Program name — arriba de términos */}
              {card.club_name && (
                <p className="text-base font-bold text-white">{card.club_name}</p>
              )}

              {/* Términos y Condiciones */}
              {card.terms && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">Términos y Condiciones</p>
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.terms}</p>
                </div>
              )}

              {/* Teléfono */}
              {card.contact_phone && (
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Teléfono</p>
                  <p className="text-sm text-gray-400">{card.contact_phone}</p>
                </div>
              )}

              {/* Sitio web */}
              {card.website && (
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Sitio web</p>
                  <p className="text-sm text-gray-400">{card.website}</p>
                </div>
              )}

              {/* Email — botón */}
              {card.contact_email && (
                <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#1e1e1e' }}>
                  <Mail className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  <span className="text-sm text-gray-200 truncate">{card.contact_email}</span>
                </div>
              )}

              {/* Add a nickname (mock) */}
              <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#1e1e1e' }}>
                <Pencil className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-200">Add a nickname</span>
              </div>

              {/* Use loyalty card across Google (mock) */}
              <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#1e1e1e' }}>
                <span className="text-sm text-gray-200 flex-1 leading-snug">Use loyalty card across Google</span>
                <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center justify-end pr-0.5 flex-shrink-0">
                  <div className="w-5 h-5 bg-white rounded-full shadow flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
    );
  };

  return isIOS ? renderIOSCard() : renderAndroidCard();
}
