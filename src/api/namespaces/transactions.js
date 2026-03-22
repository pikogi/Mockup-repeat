export function createTransactionsNamespace(client) {
  return {
    create: (cardId, storeId, transactionType, unitType, amount = null) => {
      const body = {
        card_id: cardId,
        store_id: storeId,
        transaction_type: transactionType,
        unit_type: unitType,
      }
      if (amount !== null) body.amount = amount
      return client.post('/transactions', body)
    },
  }
}
