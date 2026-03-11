import { api } from './client';

// Exportar el objeto completo de health
export const Health = api.health;

// Exportar método individual de health check
export const healthCheck = api.health.check;




