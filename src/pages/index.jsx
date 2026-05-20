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
const Preview = lazy(() => import('./Preview'))
const PublicNetwork = lazy(() => import('./PublicNetwork'))
const DashboardLeroma = lazy(() => import('./DashboardLeroma'))
const CustomersLeroma = lazy(() => import('./CustomersLeroma'))
const MyProgramsLeroma = lazy(() => import('./MyProgramsLeroma'))
const NotificationsLeroma = lazy(() => import('./NotificationsLeroma'))
const PublicMembershipLeroma = lazy(() => import('./PublicMembershipLeroma'))
const WalletMoonCafe = lazy(() => import('./WalletMoonCafe'))
const PublicProgramDemoMoonCafe = lazy(() => import('./PublicProgramDemoMoonCafe'))
const PublicProgramDemoMoonCafePoints = lazy(() => import('./PublicProgramDemoMoonCafePoints'))
const WalletDemoMoonCafe = lazy(() => import('./WalletDemoMoonCafe'))
const ScanDemoMoonCafe = lazy(() => import('./ScanDemoMoonCafe'))
const DashboardMoonCafe = lazy(() => import('./DashboardMoonCafe'))
const NotificationsMoonCafe = lazy(() => import('./NotificationsMoonCafe'))
const CustomersMoonCafe = lazy(() => import('./CustomersMoonCafe'))
const DashboardHintMoonCafe = lazy(() => import('./DashboardHintMoonCafe'))
const DashboardMoonCafePoints = lazy(() => import('./DashboardMoonCafePoints'))
const CustomersMoonCafePoints = lazy(() => import('./CustomersMoonCafePoints'))
const NotificationsMoonCafePoints = lazy(() => import('./NotificationsMoonCafePoints'))
const ScanDemoMoonCafePoints = lazy(() => import('./ScanDemoMoonCafePoints'))
const WalletDemoMoonCafePoints = lazy(() => import('./WalletDemoMoonCafePoints'))
const DashboardHintMoonCafePoints = lazy(() => import('./DashboardHintMoonCafePoints'))
const WalletDemoGym = lazy(() => import('./WalletDemoGym'))
const ScanDemoGym = lazy(() => import('./ScanDemoGym'))
const DashboardGym = lazy(() => import('./DashboardGym'))
const DashboardHintGym = lazy(() => import('./DashboardHintGym'))
const CustomersGym = lazy(() => import('./CustomersGym'))
const NotificationsGym = lazy(() => import('./NotificationsGym'))
const ComercioAmigoBarber = lazy(() => import('./ComercioAmigoBarber'))
const DashboardBarber = lazy(() => import('./DashboardBarber'))
const DashboardHintBarber = lazy(() => import('./DashboardHintBarber'))

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
            <Route path="/membership/leroma-membership-demo" element={<PublicMembershipLeroma />} />
            <Route path="/membership/:programId" element={<PublicMembership />} />
            <Route path="/cashback/:programId" element={<PublicCashback />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/demo-leroma" element={<Preview />} />
            <Route path="/demo-mooncafe" element={<Preview />} />
            <Route path="/demo-mooncafe-points" element={<Preview />} />
            <Route path="/demo-gym" element={<Preview />} />
            <Route path="/wallet/mooncafe" element={<WalletMoonCafe />} />
            <Route path="/publicprogram-demo/mooncafe" element={<PublicProgramDemoMoonCafe />} />
            <Route path="/publicprogram-demo/mooncafe-points" element={<PublicProgramDemoMoonCafePoints />} />
            <Route path="/wallet-demo/mooncafe" element={<WalletDemoMoonCafe />} />
            <Route path="/scan-demo/mooncafe" element={<ScanDemoMoonCafe />} />
            <Route path="/dashboard-hint/mooncafe" element={<DashboardHintMoonCafe />} />
            <Route path="/scan-demo/mooncafe-points" element={<ScanDemoMoonCafePoints />} />
            <Route path="/wallet-demo/mooncafe-points" element={<WalletDemoMoonCafePoints />} />
            <Route path="/dashboard-hint/mooncafe-points" element={<DashboardHintMoonCafePoints />} />
            <Route path="/wallet-demo/gym" element={<WalletDemoGym />} />
            <Route path="/scan-demo/gym" element={<ScanDemoGym />} />
            <Route path="/dashboard-hint/gym" element={<DashboardHintGym />} />
            <Route path="/demo-barber" element={<Preview />} />
            <Route path="/comercio-amigo/barber-demo" element={<ComercioAmigoBarber />} />
            <Route path="/dashboard-hint/barber" element={<DashboardHintBarber />} />
            <Route
              path="/dashboard/mooncafe-points-demo"
              element={
                <LayoutWrapper>
                  <DashboardMoonCafePoints />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/mooncafe-points-demo"
              element={
                <LayoutWrapper>
                  <CustomersMoonCafePoints />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/mooncafe-points-demo"
              element={
                <LayoutWrapper>
                  <NotificationsMoonCafePoints />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/mooncafe-demo"
              element={
                <LayoutWrapper>
                  <CustomersMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/mooncafe-demo"
              element={
                <LayoutWrapper>
                  <NotificationsMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/mooncafe-demo"
              element={
                <LayoutWrapper>
                  <DashboardMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/gym-demo"
              element={
                <LayoutWrapper>
                  <DashboardGym />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/gym-demo"
              element={
                <LayoutWrapper>
                  <CustomersGym />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/gym-demo"
              element={
                <LayoutWrapper>
                  <NotificationsGym />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/barber-demo"
              element={
                <LayoutWrapper>
                  <DashboardBarber />
                </LayoutWrapper>
              }
            />
            <Route path="/network" element={<PublicNetwork />} />
            <Route
              path="/dashboard/leroma-demo"
              element={
                <LayoutWrapper>
                  <DashboardLeroma />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/leroma-demo"
              element={
                <LayoutWrapper>
                  <CustomersLeroma />
                </LayoutWrapper>
              }
            />
            <Route
              path="/myprograms/leroma-demo"
              element={
                <LayoutWrapper>
                  <MyProgramsLeroma />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/leroma-demo"
              element={
                <LayoutWrapper>
                  <NotificationsLeroma />
                </LayoutWrapper>
              }
            />
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
            <Route path="/scanqr-demo" element={<ScanQR />} />
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
