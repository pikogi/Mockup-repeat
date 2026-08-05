export function createTransactionsNamespace(client) {
  return {
    create: (cardId, storeId, transactionType, unitType, amount = null, notes = null) => {
      const body = {
        card_id: cardId,
        store_id: storeId,
        transaction_type: transactionType,
        unit_type: unitType,
      }
      if (amount !== null) body.amount = amount
      if (notes !== null) body.notes = notes
      return client.post('/transactions', body)
    },
  }
}
