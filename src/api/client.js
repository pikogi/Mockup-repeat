// src/api/client.js

import { decodeJWT } from "@/utils/jwt";

const STAMP_CARD_IMAGES_BASE_URL = 'https://repeat-program-images.s3.us-east-1.amazonaws.com';
const envApiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

// En desarrollo: usa /api (Vite proxy redirige a AWS)
// En producción: usa VITE_API_URL directamente (S3+CloudFront no tiene proxy)
if (!isDev && !envApiUrl) {
  console.error('VITE_API_URL is not configured. API calls will fail.');
}
const API_BASE_URL = isDev ? '/api' : envApiUrl;

// Claves de localStorage relacionadas con la sesión del usuario
const AUTH_STORAGE_KEYS = [
  'auth_token',
  'user_brand_id',
  'user_type_user',
  'user_email',
  'user_full_name',
  'user_onboarding_completed',
  'brand_id',
  'brand_name',
  'operating_branch_id',
  'programs-storage',
  'stores-storage',
];

function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

// Cache the auth token in memory to avoid reading localStorage on every request
let _cachedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

function getCachedToken() {
  // Defensive check: if external code (e.g. jwt.js) cleared localStorage directly,
  // sync the cache to avoid sending a stale/expired token.
  if (_cachedToken && !localStorage.getItem('auth_token')) {
    _cachedToken = null;
  }
  return _cachedToken;
}

function setCachedToken(token) {
  _cachedToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para hacer peticiones públicas sin autenticación
  async publicRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const fullUrl = `${this.baseURL}${endpoint}`;
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      const error = new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      error.response = { status: response.status, data: errorData };
      throw error;
    }

    return response.json();
  }

  async request(endpoint, options = {}) {
    const token = getCachedToken();

    // Endpoints públicos que NO requieren token
    const publicEndpoints = [
      '/auth/verify-email',
      '/auth/login',
      '/auth/reset-password',
      '/auth/update-password',
      '/health',
    ];

    // Extraer el path sin query params para la comparación
    const endpointPath = endpoint.split('?')[0];
    const isPublicEndpoint = publicEndpoints.some(publicPath =>
      endpointPath === publicPath || endpointPath.startsWith(publicPath + '/')
    );

    const headers = {
      'Content-Type': 'application/json',
      // Solo incluir token si NO es un endpoint público
      ...(token && !isPublicEndpoint && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const fullUrl = `${this.baseURL}${endpoint}`;
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));

      // Manejar errores de autenticación:
      // Solo redirigir al login en 401 (token inválido/expirado).
      // 403 puede ser un error de permisos de recurso (no de sesión) — no cerrar sesión.
      if (response.status === 401) {
        if (!isPublicEndpoint) {
          setCachedToken(null);
          localStorage.removeItem('user_brand_id');
          localStorage.removeItem('user_onboarding_completed');
          localStorage.removeItem('user_type_user');
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 200);
          }
        }
      }

      // Crear un error con estructura similar a axios para compatibilidad
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.response = {
        status: response.status,
        data: errorData
      };
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  get(endpoint) {
    // Protección: evitar peticiones GET a /brands que no existe
    if (endpoint === '/brands' || endpoint.startsWith('/brands?')) {
      throw new Error('GET /brands no está disponible. Este endpoint no existe en el backend.');
    }
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ---------- AUTH ----------
  auth = {
    login: async (email, password) => {
      const res = await this.post('/auth/login', { email, password });
      const token = res.token || res.data?.token;
      if (token) {
        clearAuthStorage();
        setCachedToken(token);
        const decodedToken = decodeJWT(token);
        if (decodedToken && decodedToken.brand_id) {
          localStorage.removeItem('user_brand_id');
        }
        // Guardar user_type en localStorage si está en el token
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
        } else {
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
          }
        }
        // Guardar email y full_name del JWT en localStorage
        if (decodedToken?.email) {
          localStorage.setItem('user_email', decodedToken.email);
        }
        if (decodedToken?.full_name) {
          localStorage.setItem('user_full_name', decodedToken.full_name);
        }

        // El JWT ya viene actualizado con onboarding_completed del backend
        if (decodedToken?.onboarding_completed !== undefined && decodedToken?.onboarding_completed !== null) {
          localStorage.setItem('user_onboarding_completed', String(decodedToken.onboarding_completed));
        } else {
          const existingOnboarding = localStorage.getItem('user_onboarding_completed');
          if (existingOnboarding === null) {
            localStorage.setItem('user_onboarding_completed', 'false');
          }
        }
      }
      return res;
    },

    register: async (email, password, name) => {
      const res = await this.post('/auth/brand-admin', {
        email,
        password,
        full_name: name,
      });
      const jwtToken = res.token || res.data?.token;
      if (jwtToken) {
        setCachedToken(jwtToken);
        const decodedToken = decodeJWT(jwtToken);
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
        } else {
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
          }
        }

        // El token del registro NO trae onboarding_completed, obtenerlo desde brand-admin
        try {
          const brandAdminResponse = await this.updateBrandAdmin({});
          const onboardingCompleted = brandAdminResponse?.data?.onboarding_completed || brandAdminResponse?.onboarding_completed;
          if (onboardingCompleted !== undefined && onboardingCompleted !== null) {
            localStorage.setItem('user_onboarding_completed', String(onboardingCompleted));
          } else {
            localStorage.setItem('user_onboarding_completed', 'false');
          }
        } catch {
          localStorage.setItem('user_onboarding_completed', 'false');
        }
      }
      return res;
    },

    registerAdmin: async (email, password, fullName) => {
      const res = await this.post('/auth/brand-admin', {
        email,
        password,
        full_name: fullName,
      });
      const jwtToken = res.token || res.data?.token;
      if (jwtToken) {
        const decodedToken = decodeJWT(jwtToken);
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
        } else {
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
          }
        }
      }
      return res;
    },

    verifyEmail: async (email, token) => {
      const res = await this.post('/auth/verify-email', { email, token });
      const jwtToken = res.token || res.data?.token;
      if (jwtToken) {
        setCachedToken(jwtToken);
        const decodedToken = decodeJWT(jwtToken);
        if (decodedToken && decodedToken.brand_id) {
          localStorage.removeItem('user_brand_id');
        }
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
        } else {
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
          }
        }
      }
      return res;
    },

    resetPassword: async (email) => {
      return this.post('/auth/reset-password', { email });
    },

    updatePassword: async (email, token, password) => {
      return this.post('/auth/update-password', { email, token, password });
    },

    // GET /auth/me - Obtener perfil del usuario con brands asociadas
    me: async () => {
      const response = await this.get('/auth/me');
      return response;
    },

    // PATCH /auth/brand-admin - Actualizar campos del brand admin (onboarding_completed, etc.)
    updateBrandAdmin: async (data) => {
      const res = await this.patch('/auth/brand-admin', data);
      const token = res?.data?.token || res?.token;
      if (token) {
        setCachedToken(token);
        if (data.onboarding_completed !== undefined) {
          localStorage.setItem('user_onboarding_completed', String(data.onboarding_completed));
        }
      }
      return res;
    },

    logout: () => {
      _cachedToken = null;
      clearAuthStorage();
    },
  };

  // ---------- HEALTH ----------
  health = {
    check: () => this.get('/health'),
  };

  // ---------- BRANDS ----------
  brands = {
    create: (brandName, description, ownerId) => {
      return this.post('/brands', {
        brand_name: brandName,
        description,
        owner_id: ownerId,
      });
    },

    get: (brandId) => this.get(`/brands/${brandId}`),

    getPublic: (brandId) => this.publicRequest(`/brands/${brandId}`),

    getUsers: (brandId, { programId, storeId, from, to, cursor, limit } = {}) => {
      const params = new URLSearchParams();
      if (programId) params.append('program_id', programId);
      if (storeId) params.append('store_id', storeId);
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (cursor) params.append('cursor', cursor);
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return this.get(`/brands/${brandId}/users${query ? `?${query}` : ''}`);
    },

    getStats: (brandId, { from, to, storeId } = {}) => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (storeId) params.append('store_id', storeId);
      const query = params.toString();
      return this.get(`/brands/${brandId}/stats${query ? `?${query}` : ''}`);
    },

    getStatsUser: (brandId, userId) =>
      this.get(`/brands/${brandId}/stats/users/${userId}`),

    getStatsUsers: (brandId, { from, to, storeId } = {}) => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (storeId) params.append('store_id', storeId);
      const query = params.toString();
      return this.get(`/brands/${brandId}/stats/users${query ? `?${query}` : ''}`);
    },

    getStatsTransactions: (brandId, { from, to } = {}) => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      const query = params.toString();
      return this.get(`/brands/${brandId}/stats/transactions${query ? `?${query}` : ''}`);
    },

    update: (brandId, data) =>
      this.patch(`/brands/${brandId}`, data),

    delete: (brandId) =>
      this.delete(`/brands/${brandId}`),
  };

  // ---------- STORES ----------
  stores = {
    list: (brandId, { cursor, limit } = {}) => {
      const params = new URLSearchParams();
      if (brandId) params.set('brand_id', brandId);
      if (cursor) params.set('cursor', cursor);
      if (limit) params.set('limit', limit);
      return this.get(`/stores?${params}`);
    },

    create: (brandId, storeName, address, city, latitude, longitude) => {
      const body = {
        brand_id: brandId,
        store_name: storeName,
      }

      if (address) body.address = address
      if (city) body.city = city
      if (latitude && longitude) {
        body.latitude = parseFloat(latitude)
        body.longitude = parseFloat(longitude)
      }

      return this.post('/stores', body);
    },

    update: (storeId, data) =>
      this.patch(`/stores/${storeId}`, data),

    delete: (storeId) =>
      this.delete(`/stores/${storeId}`),
  };

  // ---------- LOYALTY PROGRAMS ----------
  loyaltyPrograms = {
    list: (brandId, { cursor, limit } = {}) => {
      const params = new URLSearchParams();
      if (brandId) params.set('brand_id', brandId);
      if (cursor) params.set('cursor', cursor);
      if (limit) params.set('limit', limit);
      return this.get(`/loyalty-programs?${params}`);
    },

    listPublic: (brandId) => {
      if (!brandId) {
        return this.publicRequest('/loyalty-programs');
      }
      return this.publicRequest(`/loyalty-programs?brand_id=${brandId}`);
    },

    get: (programId) => {
      return this.get(`/loyalty-programs/${programId}`);
    },

    getPublic: (programId) => {
      return this.publicRequest(`/loyalty-programs/${programId}`);
    },

    create: (data) => {
      return this.post('/loyalty-programs', data);
    },

    update: (programId, data) =>
      this.patch(`/loyalty-programs/${programId}`, data),

    delete: (programId) => {
      return this.delete(`/loyalty-programs/${programId}`);
    },
  };

  // ---------- LOYALTY CARDS ----------
  loyaltyCards = {
    create: (programId, customerEmail, customerFullName) => {
      return this.publicRequest('/loyalty-cards', {
        method: 'POST',
        body: JSON.stringify({
          program_id: programId,
          customer_email: customerEmail,
          customer_full_name: customerFullName,
        }),
      });
    },

    get: (cardId) => {
      return this.get(`/loyalty-cards/${cardId}`);
    },

    getPublic: (cardId) => {
      return this.publicRequest(`/loyalty-cards/${cardId}`);
    },

    list: (brandId) => {
      if (!brandId) {
        return this.get('/loyalty-cards');
      }
      return this.get(`/loyalty-cards?brand_id=${brandId}`);
    },

    listByProgram: (programId) => {
      return this.get(`/loyalty-cards?program_id=${programId}`);
    },
  };

  // ---------- TRANSACTIONS ----------
  transactions = {
    create: (cardId, storeId, transactionType, unitType, amount = null) => {
      const body = {
        card_id: cardId,
        store_id: storeId,
        transaction_type: transactionType,
        unit_type: unitType,
      };
      if (amount !== null) body.amount = amount;
      return this.post('/transactions', body);
    },
  };

  // ---------- IMAGES ----------
  images = {
    createStampCard: (programId, stampBackgroundImage = null, stampIconImage = null, logoImage = null, stampIconBg = '#000000') => {
      const body = {
        program_id: programId,
        stamp_icon_background_checked: stampIconBg,
        stamp_icon_background_unchecked: stampIconBg,
      };
      if (stampBackgroundImage) body.stamp_background_image = stampBackgroundImage;
      if (stampIconImage) body.stamp_icon_image = stampIconImage;
      if (logoImage) body.logo_image = logoImage;
      return this.post('/images/stamp-card', body);
    },
    getStampCardUrl: (programId, stampCount = 0) => {
      const padded = String(stampCount).padStart(2, '0');
      return `${STAMP_CARD_IMAGES_BASE_URL}/${programId}-${padded}.png`;
    },
    getLogoUrl: (brandId) => brandId ? `${STAMP_CARD_IMAGES_BASE_URL}/logo-${brandId}.png` : null,
  };

  // ---------- EMAILS ----------
  emails = {
    sendWelcome: (cardId) => this.post('/emails/welcome', { card_id: cardId }),
  };

  // ---------- REDEMPTIONS ----------
  redemptions = {
    update: (redemptionId, status) =>
      this.patch(`/redemptions/${redemptionId}`, { status }),
  };

  // ---------- ENTITIES (not yet in backend) ----------
  entities = {};

  // ---------- FUNCTIONS (not yet in backend) ----------
  functions = {};

  // ---------- INTEGRATIONS (not yet in backend) ----------
  integrations = {};
}

const apiClient = new ApiClient();

export const api = apiClient;
