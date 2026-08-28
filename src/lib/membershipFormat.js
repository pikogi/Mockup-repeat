// Etiquetas de facturación por días, además de las presets (semanal, quincenal,
// mensual, anual) admite cualquier cantidad custom de días.
const DAYS_LABEL = { 7: 'semana', 14: 'quincena', 30: 'mes', 365: 'año' }
const LEGACY_PERIOD_LABEL = { monthly: 'mes', annual: 'año', yearly: 'año' }

export function formatMoney(value) {
  if (value == null) return '—'
  return `$${Math.round(value).toLocaleString('es-AR')}`
}

export function periodLabel(period) {
  if (typeof period === 'number') return DAYS_LABEL[period] ?? `${period} días`
  return LEGACY_PERIOD_LABEL[period] ?? period
}

// Normaliza el precio de un plan a un equivalente mensual (30 días) para poder
// sumar MRR entre planes con distinta frecuencia de facturación.
export function monthlyEquivalent(price, billingPeriodDays) {
  if (!billingPeriodDays) return price
  return (price * 30) / billingPeriodDays
}
