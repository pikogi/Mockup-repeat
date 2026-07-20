import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { createPageUrl } from '@/utils'
import { getCurrentUser } from '@/utils/jwt'
import {
  LayoutDashboard,
  CreditCard,
  Plus,
  User,
  Users,
  QrCode,
  Store,
  Menu,
  Bell,
  LogOut,
  ClipboardList,
  BookOpen,
  HelpCircle,
  X,
  Ticket,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/auth/LanguageContext'
import { api } from '@/api/client'
import useProgramsStore from '@/stores/useProgramsStore'
import useStoresStore from '@/stores/useStoresStore'
import { toast } from 'sonner'

export default function Sidebar() {
  const location = useLocation()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const user = getCurrentUser()

  const whatsappUrl = `https://wa.me/5493517881653?text=${encodeURIComponent('Hola, necesito soporte con Repeat.')}`

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleLogout = async () => {
    try {
      // Eliminar token y claves de sesión del localStorage
      api.auth.logout()

      // Resetear stores de Zustand en memoria
      useProgramsStore.setState({ programs: [], lastModified: null })
      useStoresStore.setState({ stores: [] })

      // Limpiar todo el cache de React Query
      queryClient.clear()

      // Cerrar el menú móvil
      setIsMobileMenuOpen(false)

      // Redirigir a la página de login
      navigate('/login', { replace: true })

      toast.success(t('logoutSuccess'))
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error(t('logoutError'))
    }
  }

  const DEMO_URLS = {
    Dashboard: '/dashboard/leroma-demo',
    Customers: '/customers/leroma-demo',
    Notifications: '/notifications/leroma-demo',
    MyPrograms: '/myprograms/leroma-demo',
    ScanQR: '/scanqr?demo=points',
  }

  const MOONCAFE_DEMO_URLS = {
    Dashboard: '/dashboard-demo/mooncafe',
    Customers: '/customers/mooncafe-demo',
    Notifications: '/notifications/mooncafe-demo',
    MyPrograms: '/myprograms-demo/mooncafe',
    CreateClub: '/dashboard-demo/mooncafe',
    Stores: '/stores-demo/mooncafe',
    Profile: '/dashboard-demo/mooncafe',
    Team: '/team-demo/mooncafe',
    ScanQR: '/scanqr-demo?demo=selector&scan=1',
    Sorteo: '/sorteo/mooncafe-demo',
  }

  const MOONCAFE_ROADMAP_PATHS = [
    '/dashboard/mooncafe-roadmap',
    '/encuesta/roadmap',
    '/comunicacion/roadmap',
    '/referidos/roadmap',
    '/menu',
  ]

  const MOONCAFE_ROADMAP_URLS = {
    Dashboard: '/dashboard/mooncafe-roadmap',
    Customers: '/customers/mooncafe-demo',
    Notifications: '/comunicacion/roadmap',
    Comunicacion: '/comunicacion/roadmap',
    Encuesta: '/encuesta/roadmap',
    MyPrograms: '/myprograms-demo/mooncafe',
    CreateClub: '/dashboard/mooncafe-roadmap',
    Stores: '/stores-demo/mooncafe',
    Profile: '/dashboard/mooncafe-roadmap',
    Team: '/team-demo/mooncafe',
    ScanQR: '/scanqr-demo?demo=selector&scan=1',
    Sorteo: '/sorteo/mooncafe-demo',
    Menu: '/menu',
  }

  const MOONCAFE_PATHS = [
    '/dashboard/mooncafe-demo',
    '/dashboard-demo/mooncafe',
    '/customers/mooncafe-demo',
    '/notifications/mooncafe-demo',
    '/scan-demo/mooncafe',
    '/scan-demo/mooncafe-select',
    '/myprograms-demo/mooncafe',
    '/editclub-demo/mooncafe',
    '/team-demo/mooncafe',
    '/stores-demo/mooncafe',
    '/dashboard/mooncafe-points-demo',
    '/dashboard-demo/mooncafe-points',
    '/customers/mooncafe-points-demo',
    '/notifications/mooncafe-points-demo',
    '/scan-demo/mooncafe-points',
    '/myprograms-demo/mooncafe-points',
    '/editclub-demo/mooncafe-points',
    '/team-demo/mooncafe-points',
    '/stores-demo/mooncafe-points',
    '/sorteo/mooncafe-demo',
  ]

  const MOONCAFE_POINTS_DEMO_URLS = {
    Dashboard: '/dashboard-demo/mooncafe-points',
    Customers: '/customers/mooncafe-points-demo',
    Notifications: '/notifications/mooncafe-points-demo',
    MyPrograms: '/myprograms-demo/mooncafe-points',
    CreateClub: '/dashboard-demo/mooncafe-points',
    Stores: '/stores-demo/mooncafe-points',
    Profile: '/dashboard-demo/mooncafe-points',
    Team: '/team-demo/mooncafe-points',
    ScanQR: '/scanqr-demo?demo=selector&scan=1',
    Sorteo: '/sorteo/mooncafe-demo',
  }

  const GLOW_PATHS = [
    '/dashboard/glow-demo',
    '/customers/glow-demo',
    '/notifications/glow-demo',
    '/dashboard/glow-points-demo',
    '/customers/glow-points-demo',
    '/notifications/glow-points-demo',
  ]

  const DEL_PILAR_PATHS = [
    '/dashboard/del-pilar-demo',
    '/customers/del-pilar-demo',
    '/notifications/del-pilar-demo',
    '/dashboard/del-pilar-points-demo',
    '/customers/del-pilar-points-demo',
    '/notifications/del-pilar-points-demo',
  ]

  const DEL_PILAR_DEMO_URLS = {
    Dashboard: '/dashboard/del-pilar-demo',
    Customers: '/customers/del-pilar-demo',
    Notifications: '/notifications/del-pilar-demo',
    MyPrograms: null,
    CreateClub: null,
    Stores: null,
    Profile: null,
    Team: null,
    ScanQR: null,
  }

  const DEL_PILAR_POINTS_DEMO_URLS = {
    Dashboard: '/dashboard/del-pilar-points-demo',
    Customers: '/customers/del-pilar-points-demo',
    Notifications: '/notifications/del-pilar-points-demo',
    MyPrograms: null,
    CreateClub: null,
    Stores: null,
    Profile: null,
    Team: null,
    ScanQR: null,
  }

  const GLOW_DEMO_URLS = {
    Dashboard: '/dashboard/glow-demo',
    Customers: '/customers/glow-demo',
    Notifications: '/notifications/glow-demo',
    MyPrograms: null,
    CreateClub: null,
    Stores: null,
    Profile: null,
    Team: null,
    ScanQR: null,
  }

  const GLOW_POINTS_DEMO_URLS = {
    Dashboard: '/dashboard/glow-points-demo',
    Customers: '/customers/glow-points-demo',
    Notifications: '/notifications/glow-points-demo',
    MyPrograms: null,
    CreateClub: null,
    Stores: null,
    Profile: null,
    Team: null,
    ScanQR: null,
  }

  const currentPath = location.pathname
  const isBgMode = new URLSearchParams(location.search).get('bg') === '1'
  const isMoonCafeDemo = MOONCAFE_PATHS.some((p) => currentPath.startsWith(p))

  // Persist roadmap mode through shared pages (customers, stores, team, etc.)
  const isOnExclusiveRoadmapPath = MOONCAFE_ROADMAP_PATHS.some((p) => currentPath.startsWith(p))
  const isOnExclusiveRegularPath = [
    '/dashboard-demo/mooncafe',
    '/dashboard/mooncafe-demo',
    '/notifications/mooncafe-demo',
  ].some((p) => currentPath.startsWith(p))
  if (isOnExclusiveRoadmapPath) sessionStorage.setItem('mcMode', 'roadmap')
  else if (isOnExclusiveRegularPath) sessionStorage.setItem('mcMode', 'demo')
  const isMoonCafeRoadmap =
    isOnExclusiveRoadmapPath ||
    (!isOnExclusiveRegularPath && isMoonCafeDemo && sessionStorage.getItem('mcMode') === 'roadmap')
  const isGlowDemo = GLOW_PATHS.some((p) => currentPath.startsWith(p))
  const isDelPilarDemo = DEL_PILAR_PATHS.some((p) => currentPath.startsWith(p))
  const DEMO_PATH_PREFIXES = Object.values(DEMO_URLS).map((u) => u.split('?')[0])
  const isDemo =
    !user ||
    isMoonCafeDemo ||
    isMoonCafeRoadmap ||
    isGlowDemo ||
    isDelPilarDemo ||
    DEMO_PATH_PREFIXES.some((p) => currentPath.startsWith(p))

  const isMoonCafePoints = MOONCAFE_PATHS.some((p) => currentPath.startsWith(p) && p.includes('points'))
  const isGlowPoints = GLOW_PATHS.some((p) => currentPath.startsWith(p) && p.includes('points'))
  const isDelPilarPoints = DEL_PILAR_PATHS.some((p) => currentPath.startsWith(p) && p.includes('points'))

  const resolveUrl = (page) => {
    if (!isDemo) return createPageUrl(page)
    if (isMoonCafeRoadmap) return MOONCAFE_ROADMAP_URLS[page] ?? '/dashboard/mooncafe-roadmap'
    if (isMoonCafePoints) return MOONCAFE_POINTS_DEMO_URLS[page] ?? '/dashboard/mooncafe-points-demo'
    if (isMoonCafeDemo) return MOONCAFE_DEMO_URLS[page] ?? '/dashboard/mooncafe-demo'
    if (isGlowPoints) return GLOW_POINTS_DEMO_URLS[page] ?? '/dashboard/glow-points-demo'
    if (isGlowDemo) return GLOW_DEMO_URLS[page] ?? '/dashboard/glow-demo'
    if (isDelPilarPoints) return DEL_PILAR_POINTS_DEMO_URLS[page] ?? '/dashboard/del-pilar-points-demo'
    if (isDelPilarDemo) return DEL_PILAR_DEMO_URLS[page] ?? '/dashboard/del-pilar-demo'
    return DEMO_URLS[page] ?? createPageUrl(page)
  }

  const navItems = [
    { name: t('dashboard'), icon: LayoutDashboard, page: 'Dashboard' },
    { name: t('customers'), icon: User, page: 'Customers' },
    ...(isMoonCafeRoadmap
      ? [{ name: 'Comunicación', icon: Megaphone, page: 'Comunicacion' }]
      : [{ name: t('notifications'), icon: Bell, page: 'Notifications' }]),
    { name: t('myPrograms'), icon: CreditCard, page: 'MyPrograms' },
    ...(isMoonCafeRoadmap ? [{ name: 'Encuestas', icon: ClipboardList, page: 'Encuesta' }] : []),
    ...(!isDemo || isMoonCafeRoadmap ? [{ name: t('menu'), icon: BookOpen, page: 'Menu' }] : []),
    ...(isGlowDemo || isMoonCafeDemo || isMoonCafeRoadmap || isDelPilarDemo
      ? [
          { name: 'Sorteo', icon: Ticket, page: 'Sorteo' },
          { name: t('stores'), icon: Store, page: 'Stores' },
          { name: t('team'), icon: Users, page: 'Team' },
        ]
      : []),
    ...(user?.type_user === 'brand_admin' && !isDemo ? [{ name: t('stores'), icon: Store, page: 'Stores' }] : []),
  ]

  const primaryAction = { name: t('createProgram'), icon: Plus, page: 'CreateClub' }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Repeat" className="w-7 h-7 object-contain rounded-lg" loading="lazy" />
            <h1 className="text-xl font-bold text-foreground">repeat</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath.includes(item.page)
            if (item.noNav) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 select-none"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              )
            }
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 dark:text-gray-600 cursor-not-allowed select-none"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-auto text-xs font-medium text-gray-300 dark:text-gray-600">
                    {t('comingSoon')}
                  </span>
                </div>
              )
            }
            const url = resolveUrl(item.page)
            if (url === null) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 dark:text-gray-600 cursor-default select-none"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              )
            }
            return (
              <Link
                key={item.name}
                to={url}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
          {(isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo) && resolveUrl('ScanQR') && (
            <Link
              to={resolveUrl('ScanQR')}
              className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600"
            >
              <QrCode className="w-5 h-5" />
              <span className="font-medium">Escanear QR</span>
            </Link>
          )}
          {resolveUrl(primaryAction.page) === null ? (
            <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black opacity-40 cursor-default select-none">
              <primaryAction.icon className="w-5 h-5" />
              <span className="font-medium">{primaryAction.name}</span>
            </div>
          ) : (
            <Link
              to={resolveUrl(primaryAction.page)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo
                  ? 'mt-2 border-2 border-yellow-400 text-black dark:text-white bg-white dark:bg-gray-900 hover:bg-yellow-50 dark:hover:bg-gray-800'
                  : 'mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600',
              )}
            >
              <primaryAction.icon className="w-5 h-5" />
              <span className="font-medium">{primaryAction.name}</span>
            </Link>
          )}
        </nav>

        {/* Profile + Soporte */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          {isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo ? (
            <button className="flex flex-1 items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 cursor-default">
              <User className="w-5 h-5" />
              <span className="font-medium">{t('profile')}</span>
            </button>
          ) : (
            <Link
              to={resolveUrl('Profile')}
              className={cn(
                'flex flex-1 items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                currentPath.includes('Profile')
                  ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
              )}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">{t('profile')}</span>
            </Link>
          )}
          {isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo ? (
            <button className="p-3 rounded-xl text-gray-500 dark:text-gray-400 flex-shrink-0 cursor-default">
              <HelpCircle className="w-5 h-5" />
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
              aria-label={t('support')}
            >
              <HelpCircle className="w-5 h-5" />
            </a>
          )}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-black z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">repeat</h1>
        <div className="flex items-center gap-1">
          {(user?.type_user === 'brand_admin' || isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo) &&
            !isBgMode && (
              <>
                <button className="text-white p-4 -mr-4 -my-3" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
                {isMobileMenuOpen && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
                    <div
                      style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div
                      style={{
                        width: '75%',
                        maxWidth: 320,
                        background: 'white',
                        height: '100%',
                        padding: '24px 16px',
                        position: 'relative',
                        overflowY: 'auto',
                      }}
                    >
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          opacity: 0.7,
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: 12,
                          minWidth: 44,
                          minHeight: 44,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <nav className="flex flex-col gap-4 mt-8">
                        <Link
                          to={resolveUrl('Notifications')}
                          className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Bell className="w-5 h-5" />
                          {t('notifications')}
                        </Link>
                        <Link
                          to={resolveUrl('MyPrograms')}
                          className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <CreditCard className="w-5 h-5" />
                          {t('myPrograms')}
                        </Link>
                        <Link
                          to={resolveUrl('Survey')}
                          className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ClipboardList className="w-5 h-5" />
                          {t('survey')}
                        </Link>
                        <Link
                          to={resolveUrl('Menu')}
                          className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BookOpen className="w-5 h-5" />
                          {t('menu')}
                        </Link>

                        <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col gap-2">
                          {isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo ? (
                            <button className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg text-gray-500 cursor-default w-full text-left">
                              <HelpCircle className="w-5 h-5" />
                              {t('support')}
                            </button>
                          ) : (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <HelpCircle className="w-5 h-5" />
                              {t('support')}
                            </a>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-red-50 text-red-600 w-full text-left"
                          >
                            <LogOut className="w-5 h-5" />
                            {t('logout')}
                          </button>
                        </div>
                      </nav>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-between px-2">
          {/* Left side: Dashboard & Miembros */}
          <div className="flex items-center gap-4 flex-1 justify-start">
            <Link
              to={resolveUrl('Dashboard')}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 min-w-[52px] rounded-xl transition-all',
                currentPath.includes('Dashboard')
                  ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-medium">{t('dashboard')}</span>
            </Link>

            <Link
              to={resolveUrl('Customers')}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 min-w-[52px] rounded-xl transition-all',
                currentPath.includes('Customers')
                  ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium">{t('customers')}</span>
            </Link>
          </div>

          {/* Center: Scan QR (Primary) */}
          {isBgMode ? (
            <button
              onClick={() => window.parent?.postMessage({ type: 'demo-scan' }, '*')}
              className="flex items-center justify-center w-14 h-14 -mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg border-0 cursor-pointer"
            >
              <QrCode className="w-7 h-7 text-white" />
            </button>
          ) : resolveUrl('ScanQR') ? (
            <Link
              to={resolveUrl('ScanQR')}
              className="flex items-center justify-center w-14 h-14 -mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg"
            >
              <QrCode className="w-7 h-7 text-white" />
            </Link>
          ) : (
            <button className="flex items-center justify-center w-14 h-14 -mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg opacity-40 cursor-default border-0">
              <QrCode className="w-7 h-7 text-white" />
            </button>
          )}

          {/* Right side: Profile & Stores */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {isMoonCafeDemo || isMoonCafeRoadmap || isGlowDemo || isDelPilarDemo ? (
              <>
                <button className="flex flex-col items-center justify-center gap-0.5 py-2 min-w-[52px] rounded-xl text-gray-500 dark:text-gray-400 cursor-default">
                  <User className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('profile')}</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-0.5 py-2 min-w-[52px] rounded-xl text-gray-500 dark:text-gray-400 cursor-default">
                  <Store className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('store')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={resolveUrl('Profile')}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 py-2 min-w-[52px] rounded-xl transition-all',
                    currentPath.includes('Profile')
                      ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-500 dark:text-gray-400',
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('profile')}</span>
                </Link>

                <Link
                  to={resolveUrl('Stores')}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 py-2 min-w-[52px] rounded-xl transition-all',
                    currentPath.includes('Stores')
                      ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-500 dark:text-gray-400',
                  )}
                >
                  <Store className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('store')}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
