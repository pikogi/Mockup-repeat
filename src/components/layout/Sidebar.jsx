import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/auth/LanguageContext'
import posthog from 'posthog-js'
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
  const [flagsLoaded, setFlagsLoaded] = useState(false)

  useEffect(() => {
    if (posthog.__loaded) {
      posthog.onFeatureFlags(() => setFlagsLoaded(true))
    }
  }, [])

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

  const navItems = [
    { name: t('dashboard'), icon: LayoutDashboard, page: 'Dashboard' },
    { name: t('customers'), icon: User, page: 'Customers' },
    {
      name: t('notifications'),
      icon: Bell,
      page: 'Notifications',
      comingSoon: !flagsLoaded || !posthog.isFeatureEnabled('notifications'),
    },
    { name: t('myPrograms'), icon: CreditCard, page: 'MyPrograms' },
    { name: t('survey'), icon: ClipboardList, page: 'Survey' },
    { name: t('menu'), icon: BookOpen, page: 'Menu' },
    ...(user?.type_user === 'brand_admin' ? [{ name: t('stores'), icon: Store, page: 'Stores' }] : []),
  ]

  const primaryAction = { name: t('createProgram'), icon: Plus, page: 'CreateClub' }
  const currentPath = location.pathname

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
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
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
          <Link
            to={createPageUrl(primaryAction.page)}
            className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-yellow-600"
          >
            <primaryAction.icon className="w-5 h-5" />
            <span className="font-medium">{primaryAction.name}</span>
          </Link>
        </nav>

        {/* Profile + Soporte */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <Link
            to={createPageUrl('Profile')}
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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
            aria-label={t('support')}
          >
            <HelpCircle className="w-5 h-5" />
          </a>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-black z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">repeat</h1>
        <div className="flex items-center gap-1">
          {user?.type_user === 'brand_admin' && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="text-white p-4 -mr-4 -my-3">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {posthog.isFeatureEnabled('notifications') ? (
                    <Link
                      to={createPageUrl('Notifications')}
                      className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bell className="w-5 h-5" />
                      {t('notifications')}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg text-gray-300 cursor-not-allowed select-none">
                      <Bell className="w-5 h-5" />
                      {t('notifications')}
                      <span className="ml-auto text-xs font-medium">{t('comingSoon')}</span>
                    </div>
                  )}
                  <Link
                    to={createPageUrl('MyPrograms')}
                    className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CreditCard className="w-5 h-5" />
                    {t('myPrograms')}
                  </Link>
                  <Link
                    to={createPageUrl('Survey')}
                    className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ClipboardList className="w-5 h-5" />
                    {t('survey')}
                  </Link>
                  <Link
                    to={createPageUrl('Menu')}
                    className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="w-5 h-5" />
                    {t('menu')}
                  </Link>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex flex-col gap-2">
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
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('logout')}
                    </button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-between px-2">
          {/* Left side: Dashboard & Miembros */}
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('Dashboard')}
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
              to={createPageUrl('Customers')}
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
          <Link
            to={createPageUrl('ScanQR')}
            className="flex items-center justify-center w-14 h-14 -mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg"
          >
            <QrCode className="w-7 h-7 text-white" />
          </Link>

          {/* Right side: Profile & Stores */}
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('Profile')}
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
              to={createPageUrl('Stores')}
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
          </div>
        </div>
      </nav>
    </>
  )
}
