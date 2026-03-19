import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const TRANSACTION_ERROR_MESSAGES = {
  R0001: 'Tarjeta de fidelidad no encontrada.',
  R0002: 'La tarjeta de fidelidad ha expirado.',
  R0003: 'Programa de fidelidad no encontrado.',
  R0004: 'El programa de fidelidad aún no está activo.',
  R0005: 'El programa de fidelidad ha finalizado.',
  R0006: 'Sucursal no encontrada.',
  R0007: 'La sucursal no pertenece a este programa.',
  R0008: 'Debes esperar más tiempo antes de agregar otro sello.',
};

export function getTransactionErrorMessage(err, fallback) {
  const code = err?.response?.data?.error_code;
  return TRANSACTION_ERROR_MESSAGES[code] || err?.message || fallback;
}