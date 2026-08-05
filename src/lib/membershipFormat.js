const PERIOD_LABEL = { monthly: 'mes', annual: 'año', yearly: 'año' }

export function formatMoney(value) {
  if (value == null) return '—'
  return `$${Math.round(value).toLocaleString('es-AR')}`
}

export function periodLabel(period) {
  return PERIOD_LABEL[period] ?? period
}
