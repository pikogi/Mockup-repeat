export const STAMPS_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151'
export const POINTS_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157'

// ProgramPreviewComponent treats any URL not starting with http(s)/data: as a backend-relative
// path and prefixes it with the API origin. These are static frontend assets, so we need
// absolute same-origin URLs instead.
const asset = (path) => `${window.location.origin}${path}`

const BASE_CLUB = {
  reward_tiers: [],
  stamp_image_url: asset('/mooncafe-stamp.jpg'),
  stamp_icon_bg_color: '#1a4a2e',
  card_color: '#1a4a2e',
  foreground_color: '#ffffff',
  label_color: '#ffffff',
  contact_email: '',
  contact_phone: '',
  website: 'cafemoon.com.ar',
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
  selected_store_ids: ['store-1'],
  coupon_trigger: 'purchase',
  coupon_benefit_type: 'percent',
  coupon_benefit_value: 10,
  coupon_description: '',
  coupon_validity_days: 30,
  membership_activation: 'free',
  membership_tiers: [],
  membership_catalog: [],
  referral_reward_cashback: 500,
  referral_reward_membership_type: 'days',
  referral_reward_membership_days: 30,
  referral_reward_membership_benefit: '',
  cashback_percentage: 5,
  cashback_min_purchase: 0,
  cashback_min_redeem: 500,
  cashback_validity_days: 365,
}

export const MOONCAFE_STORES = [
  {
    store_id: 'store-1',
    store_name: 'Café Moon · Sucursal Centro',
    address: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
  },
]

export const MOONCAFE_BRAND = { brand_name: 'Café Moon', logo_url: asset('/moon-cafe-logo.png') }

export const MOONCAFE_CLUBS = [
  {
    ...BASE_CLUB,
    id: 'mooncafe-sellos',
    club_name: 'Club Moon Cafe',
    card_title: 'Programa de Sellos',
    short_url: asset('/publicprogram-demo/mooncafe'),
    program_type_id: STAMPS_TYPE_ID,
    description: 'Programa de sellos de Café Moon',
    reward_text: 'Cada 5 cafés, 1 GRATIS ☕',
    stamps_required: 5,
    logo_url: asset('/moon-cafe-logo.png'),
    background_image_url: asset('/mooncafe-bg.jpg'),
    terms: `Club Moon Cafe es el programa de fidelidad de Café Moon. Al registrarse, el usuario acepta los siguientes términos:\n\n• Por cada café comprado se acumula 1 sello.\n• Al completar 5 sellos se obtiene 1 café gratis.\n• Los sellos no son transferibles ni canjeables por dinero.\n• Café Moon se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.`,
    is_active: true,
    members: 148,
    total_scans: 294,
    rewards_redeemed: 24,
  },
  {
    ...BASE_CLUB,
    id: 'mooncafe-puntos',
    club_name: 'Club Moon Cafe',
    card_title: 'Programa de Puntos',
    short_url: asset('/publicprogram-demo/mooncafe-points'),
    program_type_id: POINTS_TYPE_ID,
    description: 'Programa de puntos de Café Moon',
    reward_text: '100 puntos = desayuno gratis 💚',
    stamps_required: 20,
    money_per_point: 1000,
    money_per_point_redeem: 100,
    redeem_mode: 'direct',
    logo_url: asset('/moon-cafe-logo.png'),
    background_image_url: asset('/mooncafe-bg.jpg'),
    terms: `Club Moon Cafe es el programa de fidelidad de Café Moon. Al registrarse, el usuario acepta los siguientes términos:\n\n• Por cada compra se acumulan puntos según el monto gastado.\n• Al llegar a 100 puntos se obtiene un desayuno gratis.\n• Los puntos no son transferibles ni canjeables por dinero.\n• Café Moon se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.`,
    is_active: true,
    members: 148,
    total_scans: 2940,
    rewards_redeemed: 24,
  },
]

export const getValidityTermsText = (days) =>
  days > 0 ? `Plazo para juntar sellos: ${days} días, de lo contrario tu tarjeta vuelve a 0.` : ''
