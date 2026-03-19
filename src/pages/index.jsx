import { lazy, Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Loader2 } from 'lucide-react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './Layout'
import Login from './Login'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const Home = lazy(() => import('./Home'))
const Dashboard = lazy(() => import('./Dashboard'))
const MyPrograms = lazy(() => import('./MyPrograms'))
const CreateClub = lazy(() => import('./CreateClub'))
const Customers = lazy(() => import('./Customers'))
const Stores = lazy(() => import('./Stores'))
const Team = lazy(() => import('./Team'))
const Notifications = lazy(() => import('./Notifications'))
const Profile = lazy(() => import('./Profile'))
const ScanQR = lazy(() => import('./ScanQR'))
const PublicCard = lazy(() => import('./PublicCard'))
const PublicStore = lazy(() => import('./PublicStore'))
const VerifyEmail = lazy(() => import('./VerifyEmail'))
const ForgotPassword = lazy(() => import('./ForgotPassword'))
const ResetPassword = lazy(() => import('./ResetPassword'))
const Onboarding = lazy(() => import('./Onboarding'))
const Survey = lazy(() => import('./Survey'))
const Menu = lazy(() => import('./Menu'))
const ShortUrlRedirect = lazy(() => import('./ShortUrlRedirect'))

// Componente wrapper para obtener el nombre de la página actual
function LayoutWrapper({ children }) {
  const location = useLocation()
  const pageName = location.pathname.split('/').pop() || 'home'
  return <Layout currentPageName={pageName}>{children}</Layout>
}

LayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function Pages() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        }
      >
        <Routes>
          {/* Rutas públicas - sin protección */}
          <Route path="/publicprogram" element={<PublicCard />} />
          <Route path="/store/:storeId" element={<PublicStore />} />
          <Route path="/s/:code" element={<ShortUrlRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Todas las demás rutas requieren autenticación */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas (con layout) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Onboarding />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/myprograms"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <MyPrograms />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createclub"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <CreateClub />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Customers />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Stores />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Team />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Notifications />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Profile />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanqr"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <ScanQR />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Survey />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Menu />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          {/* Ruta catch-all para redirigir a login si no está autenticado */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
