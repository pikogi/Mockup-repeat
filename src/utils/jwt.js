/**
 * Utilidad para decodificar tokens JWT y obtener información del usuario
 * También se puede usar api.auth.me() para obtener información del usuario con brands asociadas
 */

/**
 * Decodifica un token JWT sin verificar la firma
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload decodificado o null si hay error
 */
export function decodeJWT(token) {
  if (!token) return null;
  
  try {
    // Los JWT tienen 3 partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT inválido: no tiene 3 partes');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    
    // Reemplazar caracteres URL-safe y agregar padding si es necesario
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }

    // Decodificar de base64 a JSON
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Obtiene la información del usuario desde el token JWT almacenado
 * @returns {object|null} - Información del usuario o null si no hay token o está expirado
 */
export function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Verificar si el token está expirado
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    console.warn('Token JWT expirado');
    localStorage.removeItem('auth_token');
    return null;
  }

  // DEBUG: Mostrar todo el contenido del JWT decodificado
  console.log('🔍 [JWT DEBUG] Contenido completo del JWT decodificado:', {
    'Token completo': decoded,
    'user_type': decoded.user_type || decoded.userType,
    'user_id': decoded.user_id,
    'email': decoded.email,
    'full_name': decoded.full_name,
    'brand_id': decoded.brand_id,
    'branch_id': decoded.branch_id,
    'onboarding_completed': decoded.onboarding_completed,
    'Todos los campos': Object.keys(decoded)
  });

  // Mapear los campos del JWT a la estructura esperada por la aplicación
  // Si el token no tiene brand_id pero hay uno guardado en localStorage (después de crear una marca),
  // usamos el de localStorage como fallback temporal hasta que el usuario haga login de nuevo
  const brandIdFromStorage = localStorage.getItem('user_brand_id');
  
  // user_type es el campo principal del JWT para el rol del usuario
  // brand_admin = Rol Administrador, brand_staff = Rol Empleado
  // Leer user_type de localStorage primero (más rápido), con fallback al JWT
  const typeUserFromStorage = localStorage.getItem('user_type_user');
  const typeUserFromJWT = decoded.user_type || decoded.userType || null;
  let typeUser = typeUserFromStorage || typeUserFromJWT || null;
  
  // Si encontramos user_type en el JWT pero no en localStorage, guardarlo para próximas veces
  if (typeUserFromJWT && !typeUserFromStorage) {
    localStorage.setItem('user_type_user', typeUserFromJWT);
    typeUser = typeUserFromJWT;
    console.log('[DEBUG getCurrentUser] user_type guardado en localStorage desde JWT:', typeUserFromJWT);
  }
  
  // Fallback final: si no hay user_type pero es un usuario nuevo (sin brand_id), asumir brand_admin
  if (!typeUser && !decoded.brand_id) {
    typeUser = 'brand_admin';
    localStorage.setItem('user_type_user', 'brand_admin');
    console.log('[DEBUG getCurrentUser] user_type establecido como brand_admin por defecto (usuario sin brand_id)');
  }
  
  // Verificar onboarding_completed desde localStorage como fallback
  // Esto es importante porque el JWT solo se actualiza en el próximo login
  const onboardingCompletedFromStorage = localStorage.getItem('user_onboarding_completed');
  const onboardingCompletedFromJWT = decoded.onboarding_completed;
  
  // Lógica de priorización:
  // 1. Si localStorage tiene 'true' pero el JWT tiene false, usar localStorage
  //    (el patch actualizó localStorage pero el JWT está desactualizado)
  // 2. Si el JWT tiene un valor definido (y no es false cuando localStorage es true), usar JWT
  // 3. Si el JWT no tiene valor, usar localStorage
  // Confiar en el valor del backend, sin validar brand_id
  let onboardingCompleted = false;
  if (onboardingCompletedFromStorage === 'true' && onboardingCompletedFromJWT === false) {
    // Caso especial: localStorage tiene 'true' pero JWT tiene false
    // Esto significa que el patch funcionó pero el JWT está desactualizado
    onboardingCompleted = true;
    console.log('[DEBUG getCurrentUser] Usando onboarding_completed de localStorage (JWT desactualizado)');
  } else if (onboardingCompletedFromJWT !== undefined && onboardingCompletedFromJWT !== null) {
    // JWT tiene un valor definido y no estamos en el caso especial anterior
    onboardingCompleted = Boolean(onboardingCompletedFromJWT);
    // Si el JWT tiene el valor, actualizar localStorage para sincronización
    if (onboardingCompletedFromStorage !== String(onboardingCompleted)) {
      localStorage.setItem('user_onboarding_completed', String(onboardingCompleted));
      console.log('[DEBUG getCurrentUser] onboarding_completed actualizado en localStorage desde JWT:', onboardingCompleted);
    }
  } else if (onboardingCompletedFromStorage !== null) {
    // Si el JWT no tiene el valor, usar el de localStorage
    onboardingCompleted = onboardingCompletedFromStorage === 'true';
    console.log('[DEBUG getCurrentUser] onboarding_completed obtenido desde localStorage:', onboardingCompleted);
  }
  
  console.log('[DEBUG getCurrentUser] user_type final:', typeUser, {
    fromStorage: typeUserFromStorage,
    fromJWT: typeUserFromJWT,
    hasBrandId: !!decoded.brand_id,
    JWT_user_type: decoded.user_type,
    JWT_userType: decoded.userType
  });
  
  console.log('[DEBUG getCurrentUser] onboarding_completed final:', onboardingCompleted, {
    fromStorage: onboardingCompletedFromStorage,
    fromJWT: onboardingCompletedFromJWT
  });
  
  return {
    user_id: decoded.user_id,
    email: decoded.email,
    full_name: decoded.full_name,
    brand_id: decoded.brand_id || brandIdFromStorage || null,
    branch_id: decoded.branch_id || null,
    // Mapear user_type del JWT como type_user para uso interno
    type_user: typeUser,
    // También incluir user_type directamente del JWT
    user_type: decoded.user_type || decoded.userType || typeUser,
    language: decoded.language || null,
    // Incluir onboarding_completed del JWT o localStorage
    onboarding_completed: onboardingCompleted,
    // Incluir otros campos que puedan estar en el token
    ...decoded
  };
}

/**
 * Verifica si hay un token válido almacenado
 * @returns {boolean} - true si hay un token válido, false en caso contrario
 */
export function hasValidToken() {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;

  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Verificar si el token está expirado
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('auth_token');
    return false;
  }

  return true;
}

