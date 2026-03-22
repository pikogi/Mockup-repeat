export function createLoyaltyCardsNamespace(client) {
  return {
    create: (programId, customerEmail, customerFullName, phone, birthDate) => {
      return client.publicRequest('/loyalty-cards', {
        method: 'POST',
        body: JSON.stringify({
          program_id: programId,
          customer_email: customerEmail,
          customer_full_name: customerFullName,
          ...(phone && { customer_phone: phone }),
          ...(birthDate && { customer_birth_date: birthDate }),
        }),
      })
    },

    get: (cardId) => client.get(`/loyalty-cards/${cardId}`),

    getPublic: (cardId) => client.publicRequest(`/loyalty-cards/${cardId}`),

    list: (brandId) => {
      if (!brandId) return client.get('/loyalty-cards')
      return client.get(`/loyalty-cards?brand_id=${brandId}`)
    },

    listByProgram: (programId) => client.get(`/loyalty-cards?program_id=${programId}`),
  }
}
