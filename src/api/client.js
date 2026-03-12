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

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    // #region agent log
    console.log('[DEBUG API_BASE_URL]', {
      API_BASE_URL,
      isDev,
      envApiUrl,
    });
    // #endregion
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
    // #region agent log
    const logData1 = {location:'client.js:28',message:'request() entrada',data:{endpoint,method:options.method||'GET',hasOptionsHeaders:!!options.headers},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG]', logData1);
    // #endregion
    const token = localStorage.getItem('auth_token');
    // #region agent log
    const logData2 = {location:'client.js:30',message:'Token obtenido de localStorage',data:{tokenExists:!!token,tokenLength:token?.length||0,tokenPreview:token?.substring(0,20)||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.log('[DEBUG]', logData2);
    // #endregion

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
    // #region agent log
    const logData3 = {location:'client.js:36',message:'Headers construidos',data:{hasAuthorization:!!headers.Authorization,authorizationPreview:headers.Authorization?.substring(0,30)||'null',hasOptionsHeaders:!!options.headers,optionsHeadersKeys:options.headers?Object.keys(options.headers):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
    console.log('[DEBUG]', logData3);
    // #endregion

    const fullUrl = `${this.baseURL}${endpoint}`;
    // #region agent log
    console.log('[DEBUG FETCH URL]', {
      endpoint,
      baseURL: this.baseURL,
      fullUrl,
      isProxy: fullUrl.startsWith('/api'),
      isDirectAWS: fullUrl.includes('execute-api.us-east-1.amazonaws.com')
    });
    // #endregion
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // #region agent log
      const logData4 = {location:'client.js:92',message:'Response no OK',data:{status:response.status,statusText:response.statusText,endpoint,fullUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
      console.error('[DEBUG ERROR]', logData4);
      // #endregion
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      // #region agent log
      const logData5 = {location:'client.js:97',message:'Error data recibido',data:{errorMessage:errorData.message,errorData,status:response.status,endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
      console.error('[DEBUG ERROR]', logData5);
      console.error('[BACKEND ERROR DETAIL]', JSON.stringify(errorData, null, 2));
      // #endregion
      
      // Manejar errores de autenticación:
      // Solo redirigir al login en 401 (token inválido/expirado).
      // 403 puede ser un error de permisos de recurso (no de sesión) — no cerrar sesión.
      if (response.status === 401) {
        if (!isPublicEndpoint) {
          console.warn('[DEBUG] 401 recibido, limpiando token y redirigiendo al login');
          localStorage.removeItem('auth_token');
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
    // #region agent log
    const logDataPost = {location:'client.js:162',message:'post() entrada',data:{endpoint,dataKeys:data?Object.keys(data):[],dataSample:endpoint.includes('brand-admin')?{email:data?.email,hasPassword:!!data?.password,hasFullName:!!data?.full_name}:{}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'L'};
    console.log('[DEBUG POST]', logDataPost);
    // #endregion
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
    // #region agent log
    console.log('[DEBUG PATCH]', {
      endpoint,
      data,
      dataStringified: JSON.stringify(data)
    });
    // #endregion
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
      // #region agent log
      const logDataLogin = {location:'client.js:121',message:'login() entrada',data:{email,passwordLength:password?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      console.log('[DEBUG LOGIN]', logDataLogin);
      // #endregion
      try {
        const res = await this.post('/auth/login', { email, password });
        // #region agent log
        const logDataLoginRes = {location:'client.js:125',message:'login() respuesta recibida',data:{hasToken:!!(res.token||res.data?.token),tokenPreview:(res.token||res.data?.token)?.substring(0,30)||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
        console.log('[DEBUG LOGIN RES]', logDataLoginRes);
        // #endregion
        const token = res.token || res.data?.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          // Solo limpiar user_brand_id si el nuevo token tiene brand_id
          // Si el token no tiene brand_id, mantener user_brand_id en localStorage
          // para que getCurrentUser() lo pueda usar como fallback
          const decodedToken = decodeJWT(token);
          if (decodedToken && decodedToken.brand_id) {
            // El token tiene brand_id, es la fuente de verdad, limpiar localStorage
            localStorage.removeItem('user_brand_id');
            console.log('[DEBUG LOGIN] Token tiene brand_id, limpiado user_brand_id de localStorage');
          } else {
            // El token no tiene brand_id, mantener user_brand_id en localStorage
            console.log('[DEBUG LOGIN] Token no tiene brand_id, manteniendo user_brand_id en localStorage');
          }
        // Guardar user_type en localStorage si está en el token
        console.log('[DEBUG LOGIN] Token decodificado:', decodedToken);
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
          console.log('[DEBUG LOGIN] user_type guardado en localStorage:', userType);
        } else {
          console.warn('[DEBUG LOGIN] Token no contiene user_type. Token completo:', decodedToken);
          // Fallback: si es un usuario nuevo (sin brand_id), asumir brand_admin
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
            console.log('[DEBUG LOGIN] user_type establecido como brand_admin por defecto (usuario nuevo)');
          }
        }
        // Guardar email y full_name del JWT en localStorage
        if (decodedToken?.email) {
          localStorage.setItem('user_email', decodedToken.email);
          console.log('[DEBUG LOGIN] user_email guardado en localStorage:', decodedToken.email);
        } else {
          console.warn('[DEBUG LOGIN] Token no contiene email. Token completo:', decodedToken);
        }
        if (decodedToken?.full_name) {
          localStorage.setItem('user_full_name', decodedToken.full_name);
          console.log('[DEBUG LOGIN] user_full_name guardado en localStorage:', decodedToken.full_name);
        } else {
          console.warn('[DEBUG LOGIN] Token no contiene full_name. Token completo:', decodedToken);
        }
          // #region agent log
          const logDataTokenSaved = {location:'client.js:130',message:'Token guardado en localStorage',data:{tokenLength:token.length,tokenPreview:token.substring(0,30),hasBrandId:!!decodedToken?.brand_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
          console.log('[DEBUG TOKEN SAVED]', logDataTokenSaved);
          // #endregion
          
          // El JWT ya viene actualizado con onboarding_completed del backend
          // Usar directamente el valor del JWT, no hacer llamada adicional a /auth/me
          if (decodedToken?.onboarding_completed !== undefined && decodedToken?.onboarding_completed !== null) {
            localStorage.setItem('user_onboarding_completed', String(decodedToken.onboarding_completed));
            console.log('[DEBUG LOGIN] onboarding_completed obtenido desde JWT y guardado:', decodedToken.onboarding_completed);
          } else {
            // Si el JWT no tiene onboarding_completed, mantener el valor de localStorage o establecer false
            const existingOnboarding = localStorage.getItem('user_onboarding_completed');
            if (existingOnboarding === null) {
              localStorage.setItem('user_onboarding_completed', 'false');
              console.log('[DEBUG LOGIN] onboarding_completed no encontrado en JWT, establecido como false por defecto');
            }
          }
        } else {
          // #region agent log
          const logDataNoToken = {location:'client.js:135',message:'Login exitoso pero sin token en respuesta',data:{responseKeys:Object.keys(res)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
          console.warn('[DEBUG NO TOKEN]', logDataNoToken);
          // #endregion
        }
        return res;
      } catch (error) {
        // #region agent log
        const logDataLoginError = {location:'client.js:141',message:'login() error',data:{errorMessage:error.message,hasResponse:!!error.response,errorStatus:error.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
        console.error('[DEBUG LOGIN ERROR]', logDataLoginError);
        // #endregion
        throw error;
      }
    },

    register: async (email, password, name) => {
      const res = await this.post('/auth/brand-admin', {
        email,
        password,
        full_name: name,
        // app_role removido - el backend no acepta este campo
      });
      // Si el registro devuelve un token, guardar type_user en localStorage
      const jwtToken = res.token || res.data?.token;
      if (jwtToken) {
        localStorage.setItem('auth_token', jwtToken);
        const decodedToken = decodeJWT(jwtToken);
        console.log('[DEBUG REGISTER] Token decodificado:', decodedToken);
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
          console.log('[DEBUG REGISTER] user_type guardado en localStorage:', userType);
        } else {
          console.warn('[DEBUG REGISTER] Token no contiene user_type. Token completo:', decodedToken);
          // Fallback: si es un usuario nuevo (sin brand_id), asumir brand_admin
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
            console.log('[DEBUG REGISTER] user_type establecido como brand_admin por defecto (usuario nuevo)');
          }
        }

        // El token del registro NO trae onboarding_completed, obtenerlo desde brand-admin
        try {
          const brandAdminResponse = await this.updateBrandAdmin({});
          const onboardingCompleted = brandAdminResponse?.data?.onboarding_completed || brandAdminResponse?.onboarding_completed;
          if (onboardingCompleted !== undefined && onboardingCompleted !== null) {
            localStorage.setItem('user_onboarding_completed', String(onboardingCompleted));
            console.log('[DEBUG REGISTER] onboarding_completed obtenido desde PATCH /auth/brand-admin y guardado:', onboardingCompleted);
          } else {
            // Si no viene en la respuesta, asumir false para usuarios nuevos
            localStorage.setItem('user_onboarding_completed', 'false');
            console.log('[DEBUG REGISTER] onboarding_completed no encontrado en respuesta, establecido como false por defecto');
          }
        } catch (brandAdminError) {
          console.warn('[DEBUG REGISTER] Error obteniendo onboarding_completed desde brand-admin:', brandAdminError);
          // Si falla, establecer false por defecto para usuarios nuevos
          localStorage.setItem('user_onboarding_completed', 'false');
          console.log('[DEBUG REGISTER] onboarding_completed establecido como false por defecto (error al obtener)');
        }
      } else {
        console.log('[DEBUG REGISTER] No hay token en la respuesta del registro');
      }
      return res;
    },

    registerAdmin: async (email, password, fullName) => {
      const res = await this.post('/auth/brand-admin', {
        email,
        password,
        full_name: fullName,
        // app_role removido - el backend no acepta este campo
      });
      // Si el registro devuelve un token, guardar user_type en localStorage
      const jwtToken = res.token || res.data?.token;
      if (jwtToken) {
        const decodedToken = decodeJWT(jwtToken);
        console.log('[DEBUG REGISTER ADMIN] Token decodificado:', decodedToken);
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
          console.log('[DEBUG REGISTER ADMIN] user_type guardado en localStorage:', userType);
        } else {
          console.warn('[DEBUG REGISTER ADMIN] Token no contiene user_type. Token completo:', decodedToken);
          // Fallback: si es un usuario nuevo (sin brand_id), asumir brand_admin
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
            console.log('[DEBUG REGISTER ADMIN] user_type establecido como brand_admin por defecto (usuario nuevo)');
          }
        }
      } else {
        console.log('[DEBUG REGISTER ADMIN] No hay token en la respuesta del registro');
      }
      return res;
    },

    verifyEmail: async (email, token) => {
      const res = await this.post('/auth/verify-email', { email, token });
      // Guardar el token JWT de la respuesta para usar en peticiones posteriores
      const jwtToken = res.token || res.data?.token;
      if (jwtToken) {
        localStorage.setItem('auth_token', jwtToken);
        // Solo limpiar user_brand_id si el nuevo token tiene brand_id
        // Si el token no tiene brand_id (que es el caso normal porque verify-email
        // se ejecuta ANTES de crear la marca), mantener user_brand_id en localStorage
        // para que getCurrentUser() lo pueda usar como fallback
        const decodedToken = decodeJWT(jwtToken);
        if (decodedToken && decodedToken.brand_id) {
          // El token tiene brand_id, es la fuente de verdad, limpiar localStorage
          localStorage.removeItem('user_brand_id');
          console.log('[DEBUG VERIFY EMAIL] Token tiene brand_id, limpiado user_brand_id de localStorage');
        } else {
          // El token no tiene brand_id, mantener user_brand_id en localStorage
          console.log('[DEBUG VERIFY EMAIL] Token no tiene brand_id, manteniendo user_brand_id en localStorage');
        }
        // Guardar user_type en localStorage si está en el token
        console.log('[DEBUG VERIFY EMAIL] Token decodificado:', decodedToken);
        const userType = decodedToken?.user_type || decodedToken?.userType || decodedToken?.type_user || decodedToken?.typeUser;
        if (decodedToken && userType) {
          localStorage.setItem('user_type_user', userType);
          console.log('[DEBUG VERIFY EMAIL] user_type guardado en localStorage:', userType);
        } else {
          console.warn('[DEBUG VERIFY EMAIL] Token no contiene user_type. Token completo:', decodedToken);
          // Fallback: si es un usuario nuevo (sin brand_id), asumir brand_admin
          if (!decodedToken?.brand_id) {
            localStorage.setItem('user_type_user', 'brand_admin');
            console.log('[DEBUG VERIFY EMAIL] user_type establecido como brand_admin por defecto (usuario nuevo)');
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
      // Guardar el token actualizado si viene en la respuesta
      const token = res?.data?.token || res?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        // Sincronizar onboarding_completed en localStorage
        if (data.onboarding_completed !== undefined) {
          localStorage.setItem('user_onboarding_completed', String(data.onboarding_completed));
        }
      }
      return res;
    },

    logout: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('brand_id');
      localStorage.removeItem('brand_name');
      localStorage.removeItem('operating_branch_id');
      localStorage.removeItem('programs-storage');
      localStorage.removeItem('stores-storage');
    },
  };

  // ---------- HEALTH ----------
  health = {
    check: () => this.get('/health'),
  };

  // ---------- BRANDS ----------
  // Nota: Según el YAML de Insomnia, solo están disponibles:
  // - POST /brands (create)
  // - PATCH /brands/{id} (update)
  // - DELETE /brands/{id} (delete)
  // NO existen: GET /brands (list) ni GET /brands/{id} (get)
  brands = {
    // list: () => this.get('/brands'), // NO EXISTE en el YAML - comentado para referencia futura

    create: (brandName, description, ownerId) => {
      // #region agent log
      const logDataCreate = {location:'client.js:148',message:'brands.create() entrada',data:{brandName,description,ownerId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      console.log('[DEBUG BRANDS.CREATE]', logDataCreate);
      // #endregion
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
      this.patch(`/brands/${brandId}`, data), // Cambiado de PUT a PATCH según YAML

    delete: (brandId) =>
      this.delete(`/brands/${brandId}`),
  };

  // ---------- STORES ----------
  // Nota: Según el YAML de Insomnia actualizado, los endpoints están en rutas directas:
  // - POST /stores (create) - con brand_id en el body
  // - PATCH /stores/{id} (update) - sin brand_id en la URL
  // - DELETE /stores/{id} (delete)
  // - GET /stores?brand_id=xxx (list) - con brand_id como query param
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
  // Según el YAML de Insomnia, los endpoints de loyalty-program están disponibles:
  // - POST /loyalty-programs (create)
  // - GET /loyalty-programs?brand_id=xxx (list)
  // - PATCH /loyalty-programs/{id} (update)
  // - DELETE /loyalty-programs/{id} (delete)
  loyaltyPrograms = {
    list: (brandId, { cursor, limit } = {}) => {
      const params = new URLSearchParams();
      if (brandId) params.set('brand_id', brandId);
      if (cursor) params.set('cursor', cursor);
      if (limit) params.set('limit', limit);
      return this.get(`/loyalty-programs?${params}`);
    },

    // Método público para obtener programas sin autenticación
    listPublic: (brandId) => {
      if (!brandId) {
        return this.publicRequest('/loyalty-programs');
      }
      return this.publicRequest(`/loyalty-programs?brand_id=${brandId}`);
    },

    get: (programId) => {
      return this.get(`/loyalty-programs/${programId}`);
    },

    // Método público para obtener un programa sin autenticación
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
  // Según el YAML de Insomnia:
  // - POST /loyalty-cards (create) - sin autenticación, con User-Agent de dispositivo móvil
  // - GET /loyalty-cards/:id (get)
  // - PATCH /loyalty-cards/:id (update) - TBD
  // - DELETE /loyalty-cards/:id (delete) - TBD
  // - GET /loyalty-cards?brand_id=xxx (list) - TBD
  loyaltyCards = {
    // Crear tarjeta de lealtad (endpoint público - sin autenticación)
    // NOTA: El backend requiere User-Agent de dispositivo móvil.
    // Si se llama desde desktop, retornará error "Unsupported device"
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

    // Obtener tarjeta por ID
    get: (cardId) => {
      return this.get(`/loyalty-cards/${cardId}`);
    },

    // Método público para obtener tarjeta sin autenticación
    getPublic: (cardId) => {
      return this.publicRequest(`/loyalty-cards/${cardId}`);
    },

    // Listar tarjetas por brand_id (requiere endpoint con JWT en backend)
    list: (brandId) => {
      if (!brandId) {
        return this.get('/loyalty-cards');
      }
      return this.get(`/loyalty-cards?brand_id=${brandId}`);
    },

    // Listar tarjetas por program_id
    listByProgram: (programId) => {
      return this.get(`/loyalty-cards?program_id=${programId}`);
    },

    // Actualizar tarjeta (TBD en el backend)
    // update: (cardId, data) =>
    //   this.patch(`/loyalty-cards/${cardId}`, data),

    // Eliminar tarjeta (TBD en el backend)
    // delete: (cardId) =>
    //   this.delete(`/loyalty-cards/${cardId}`),
  };

  // ---------- TRANSACTIONS ----------
  // Según el YAML de Insomnia:
  // - POST /transactions (create) - requiere autenticación
  // Body: { card_id, store_id, amount, transaction_type, unit_type }
  // transaction_type: "stamp_added", etc.
  // unit_type: "stamp", etc.
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
  // Según el YAML de Insomnia:
  // - POST /images/stamp-card (create) - requiere autenticación
  // Body: { program_id, stamp_background_image, stamp_icon_image, logo_image }
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

  // ---------- ENTITIES ----------
  // NOTA: El sistema de /entities/* NO está documentado en el YAML de Insomnia
  // Todos los endpoints de entities están comentados para referencia futura
  // Si estos endpoints se implementan en el backend, descomentar este código
  entities = {
    // _createEntityMethods: (entityName) => ({
    //   list: async (sort = '', limit = null) => {
    //     const params = new URLSearchParams();
    //     if (sort) params.append('sort', sort);
    //     if (limit) params.append('limit', limit);
    //     const query = params.toString();
    //     return this.get(`/entities/${entityName}${query ? `?${query}` : ''}`);
    //   },

    //   filter: async (filters = {}, sort = '', limit = null) => {
    //     const params = new URLSearchParams();
    //     if (sort) params.append('sort', sort);
    //     if (limit) params.append('limit', limit);
    //     const query = params.toString();
    //     return this.post(`/entities/${entityName}/filter${query ? `?${query}` : ''}`, filters);
    //   },

    //   get: async (id) => {
    //     return this.get(`/entities/${entityName}/${id}`);
    //   },

    //   create: async (data) => {
    //     return this.post(`/entities/${entityName}`, data);
    //   },

    //   update: async (id, data) => {
    //     return this.put(`/entities/${entityName}/${id}`, data);
    //   },

    //   delete: async (id) => {
    //     return this.delete(`/entities/${entityName}/${id}`);
    //   },
    // }),

    // LoyaltyCard: null,
    // CardInteraction: null,
    // Branch: null,
    // Business: null,
    // MemberCard: null,
    // PassRegistration: null,
    // Campaign: null,
    // User: null,
  };

  // ---------- FUNCTIONS ----------
  // NOTA: El sistema de /functions/* NO está documentado en el YAML de Insomnia
  // Todos los endpoints de functions están comentados para referencia futura
  // Si estos endpoints se implementan en el backend, descomentar este código
  functions = {
    // invoke: async (functionName, data = {}) => {
    //   return this.post(`/functions/${functionName}`, data);
    // },
    // scanQrCode: (data) => this.functions.invoke('scanQrCode', data),
    // sendInvitation: (data) => this.functions.invoke('sendInvitation', data),
    // generateApplePass: (data) => this.functions.invoke('generateApplePass', data),
    // generateGooglePass: (data) => this.functions.invoke('generateGooglePass', data),
    // updateGooglePass: (data) => this.functions.invoke('updateGooglePass', data),
    // appleWalletAPI: (data) => this.functions.invoke('appleWalletAPI', data),
    // sendCampaign: (data) => this.functions.invoke('sendCampaign', data),
  };

  // ---------- INTEGRATIONS ----------
  // NOTA: El sistema de /integrations/core/* NO está documentado en el YAML de Insomnia
  // Todos los endpoints de integrations están comentados para referencia futura
  // Si estos endpoints se implementan en el backend, descomentar este código
  integrations = {
    // Core: {
    //   InvokeLLM: async (data) => {
    //     return this.post('/integrations/core/invoke-llm', data);
    //   },
    //   SendEmail: async (data) => {
    //     return this.post('/integrations/core/send-email', data);
    //   },
    //   UploadFile: async (data) => {
    //     const formData = new FormData();
    //     if (data.file) {
    //       formData.append('file', data.file);
    //     }
    //     
    //     const token = localStorage.getItem('auth_token');
    //     const response = await fetch(`${this.baseURL}/integrations/core/upload-file`, {
    //       method: 'POST',
    //       headers: {
    //         ...(token && { Authorization: `Bearer ${token}` }),
    //       },
    //       body: formData,
    //     });
    //     
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     
    //     return await response.json();
    //   },
    //   GenerateImage: async (data) => {
    //     return this.post('/integrations/core/generate-image', data);
    //   },
    //   ExtractDataFromUploadedFile: async (data) => {
    //     return this.post('/integrations/core/extract-data', data);
    //   },
    //   CreateFileSignedUrl: async (data) => {
    //     return this.post('/integrations/core/create-signed-url', data);
    //   },
    //   UploadPrivateFile: async (data) => {
    //     const formData = new FormData();
    //     if (data.file) {
    //       formData.append('file', data.file);
    //     }
    //     
    //     const token = localStorage.getItem('auth_token');
    //     const response = await fetch(`${this.baseURL}/integrations/core/upload-private-file`, {
    //       method: 'POST',
    //       headers: {
    //         ...(token && { Authorization: `Bearer ${token}` }),
    //       },
    //       body: formData,
    //     });
    //     
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     
    //     return await response.json();
    //   },
    // },
  };
}

// Inicializar métodos de entidades
// NOTA: Comentado porque el sistema de /entities/* no está documentado en el YAML de Insomnia
const apiClient = new ApiClient();
// const entityNames = ['LoyaltyCard', 'CardInteraction', 'Branch', 'Business', 'MemberCard', 'PassRegistration', 'Campaign', 'User'];

// entityNames.forEach((entityName) => {
//   apiClient.entities[entityName] = apiClient.entities._createEntityMethods(entityName);
// });

export const api = apiClient;
