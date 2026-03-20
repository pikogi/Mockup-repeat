export const PROGRAM_TYPES = [
  {
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151',
    key: 'stamps',
    name: 'Sellos',
    description:
      'Programa clásico donde los clientes acumulan sellos por cada compra. Al completar todos los sellos, obtienen una recompensa. Ejemplo: Compra 5 cafés, el 6° es gratis.',
  },
  {
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc152',
    key: 'giftCard',
    name: 'Gift Card',
    description:
      'Tarjeta de regalo recargable que los clientes pueden usar como medio de pago. Ideal para promociones y regalos corporativos.',
  },
  {
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc153',
    key: 'discount',
    name: 'Descuentos',
    description:
      'Programa de descuentos progresivos o fijos para clientes frecuentes. Los miembros obtienen precios especiales en productos o servicios.',
  },
  {
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc154',
    key: 'cashback',
    name: 'Cashbacks',
    description:
      'Los clientes reciben un porcentaje de su compra de vuelta como crédito. Ejemplo: 5% de cashback en cada compra para usar en futuras visitas.',
  },
  {
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc155',
    key: 'membership',
    name: 'Membresías',
    description:
      'Programa de membresía con beneficios exclusivos y acceso a ventajas especiales. Puede incluir cuotas mensuales o anuales.',
  },
  {
    id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc156',
    key: 'coupon',
    name: 'Cupones',
    description:
      'Sistema de cupones digitales con ofertas especiales. Los clientes reciben y acumulan cupones para productos o servicios específicos.',
  },
]

export const getProgramTypeDescription = (programTypeId) => {
  const programType = PROGRAM_TYPES.find((type) => type.id === programTypeId)
  return programType?.description || ''
}

export const getProgramTypeName = (programTypeId) => {
  const programType = PROGRAM_TYPES.find((type) => type.id === programTypeId)
  return programType?.name || ''
}

export const getProgramTypeFromId = (programTypeId) => {
  const programType = PROGRAM_TYPES.find((type) => type.id === programTypeId)
  return programType?.key || 'stamps'
}
