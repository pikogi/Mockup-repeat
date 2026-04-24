import { lazy, Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Loader2 } from 'lucide-react'
import posthog from 'posthog-js'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './Layout'
import Login from './Login'
import { LanguageProvider } from '@/components/auth/LanguageContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (posthog.__loaded) {
      posthog.capture('$pageview')
    }
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
const PublicCatalog = lazy(() => import('./PublicCatalog'))
const PublicMembership = lazy(() => import('./PublicMembership'))
const PublicCashback = lazy(() => import('./PublicCashback'))
const Demo = lazy(() => import('./Demo'))
const VerifyEmail = lazy(() => import('./VerifyEmail'))
const ForgotPassword = lazy(() => import('./ForgotPassword'))
const ResetPassword = lazy(() => import('./ResetPassword'))
const Onboarding = lazy(() => import('./Onboarding'))
const Survey = lazy(() => import('./Survey'))
const Menu = lazy(() => import('./Menu'))
const ShortUrlRedirect = lazy(() => import('./ShortUrlRedirect'))

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
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
          }
        >
          <Routes>
            <Route path="/publicprogram" element={<PublicCard />} />
            <Route path="/store/:storeId" element={<PublicStore />} />
            <Route path="/catalog/:programId" element={<PublicCatalog />} />
            <Route path="/membership/:programId" element={<PublicMembership />} />
            <Route path="/cashback/:programId" element={<PublicCashback />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/s/:code" element={<ShortUrlRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/"
              element={
                <LayoutWrapper>
                  <Home />
                </LayoutWrapper>
              }
            />
            <Route
              path="/onboarding"
              element={
                <LayoutWrapper>
                  <Onboarding />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard"
              element={
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              }
            />
            <Route
              path="/myprograms"
              element={
                <LayoutWrapper>
                  <MyPrograms />
                </LayoutWrapper>
              }
            />
            <Route
              path="/createclub"
              element={
                <LayoutWrapper>
                  <CreateClub />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers"
              element={
                <LayoutWrapper>
                  <Customers />
                </LayoutWrapper>
              }
            />
            <Route
              path="/stores"
              element={
                <LayoutWrapper>
                  <Stores />
                </LayoutWrapper>
              }
            />
            <Route
              path="/team"
              element={
                <LayoutWrapper>
                  <Team />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications"
              element={
                <LayoutWrapper>
                  <Notifications />
                </LayoutWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <LayoutWrapper>
                  <Profile />
                </LayoutWrapper>
              }
            />
            <Route
              path="/scanqr"
              element={
                <LayoutWrapper>
                  <ScanQR />
                </LayoutWrapper>
              }
            />
            <Route
              path="/survey"
              element={
                <LayoutWrapper>
                  <Survey />
                </LayoutWrapper>
              }
            />
            <Route
              path="/menu"
              element={
                <LayoutWrapper>
                  <Menu />
                </LayoutWrapper>
              }
            />

            <Route
              path="*"
              element={
                <LayoutWrapper>
                  <Home />
                </LayoutWrapper>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  )
}
