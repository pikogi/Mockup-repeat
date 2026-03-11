import { useMemo } from 'react';

/**
 * Detecta el sistema operativo del usuario basándose en el User Agent
 * @returns {'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown'}
 */
function detectOS() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // iOS detection (iPhone, iPad, iPod)
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  // iPad on iOS 13+ detection (userAgent reports as Mac)
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return 'ios';
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // macOS detection
  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    return 'macos';
  }

  // Windows detection
  if (/Win32|Win64|Windows|WinCE/.test(userAgent)) {
    return 'windows';
  }

  // Linux detection
  if (/Linux/.test(userAgent)) {
    return 'linux';
  }

  return 'unknown';
}

/**
 * Determina qué wallet mostrar primero según el OS
 * @param {string} os - Sistema operativo detectado
 * @returns {'apple' | 'google' | 'both'}
 */
function getPreferredWallet(os) {
  switch (os) {
    case 'ios':
    case 'macos':
      return 'apple';
    case 'android':
      return 'google';
    default:
      return 'both';
  }
}

/**
 * Verifica si el dispositivo es móvil (iOS o Android)
 * @param {string} os - Sistema operativo detectado
 * @returns {boolean}
 */
function isMobileDevice(os) {
  return os === 'ios' || os === 'android';
}

/**
 * Verifica si el dispositivo es de escritorio
 * @param {string} os - Sistema operativo detectado
 * @returns {boolean}
 */
function isDesktopDevice(os) {
  return os === 'macos' || os === 'windows' || os === 'linux';
}

/**
 * Obtiene el nombre legible del sistema operativo
 * @param {string} os - Sistema operativo detectado
 * @returns {string}
 */
function getOSDisplayName(os) {
  const names = {
    ios: 'iOS',
    android: 'Android',
    macos: 'macOS',
    windows: 'Windows',
    linux: 'Linux',
    unknown: 'Desconocido'
  };
  return names[os] || 'Desconocido';
}

/**
 * Hook para detectar información del dispositivo del usuario
 *
 * @example
 * const { os, preferredWallet, isMobile, isDesktop, osName } = useDeviceDetection();
 *
 * // Mostrar botón de wallet según el dispositivo
 * {preferredWallet === 'apple' && <AppleWalletButton />}
 * {preferredWallet === 'google' && <GoogleWalletButton />}
 *
 * @returns {{
 *   os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown',
 *   preferredWallet: 'apple' | 'google' | 'both',
 *   isMobile: boolean,
 *   isDesktop: boolean,
 *   isIOS: boolean,
 *   isAndroid: boolean,
 *   isMacOS: boolean,
 *   isWindows: boolean,
 *   osName: string,
 *   userAgent: string
 * }}
 */
export function useDeviceDetection() {
  const os = useMemo(() => detectOS(), []);
  const preferredWallet = useMemo(() => getPreferredWallet(os), [os]);
  const isMobile = useMemo(() => isMobileDevice(os), [os]);
  const isDesktop = useMemo(() => isDesktopDevice(os), [os]);
  const osName = useMemo(() => getOSDisplayName(os), [os]);

  return {
    // Sistema operativo
    os,
    osName,

    // Tipo de dispositivo
    isMobile,
    isDesktop,

    // OS específicos
    isIOS: os === 'ios',
    isAndroid: os === 'android',
    isMacOS: os === 'macos',
    isWindows: os === 'windows',
    isLinux: os === 'linux',

    // Wallet preferido
    preferredWallet,

    // User Agent (para debugging)
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
  };
}

// Exportar funciones individuales por si se necesitan fuera de React
export { detectOS, getPreferredWallet, isMobileDevice, isDesktopDevice, getOSDisplayName };

export default useDeviceDetection;
