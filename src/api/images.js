import { api } from './client';

// Exportar el objeto completo de images
export const Images = api.images;

// Exportar métodos individuales de images
export const createStampCard = api.images.createStampCard;
