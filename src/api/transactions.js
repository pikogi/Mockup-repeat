import { api } from './client';

// Exportar el objeto completo de transactions
export const Transactions = api.transactions;

// Exportar métodos individuales de transactions
export const createTransaction = api.transactions.create;
