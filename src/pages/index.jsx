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
const DemoShell = lazy(() => import('./DemoShell'))
const VerifyEmail = lazy(() => import('./VerifyEmail'))
const ForgotPassword = lazy(() => import('./ForgotPassword'))
const ResetPassword = lazy(() => import('./ResetPassword'))
const Onboarding = lazy(() => import('./Onboarding'))
const Survey = lazy(() => import('./Survey'))
const Sorteo = lazy(() => import('./Sorteo'))
const Menu = lazy(() => import('./Menu'))
const ShortUrlRedirect = lazy(() => import('./ShortUrlRedirect'))
const Preview = lazy(() => import('./Preview'))
const PublicNetwork = lazy(() => import('./PublicNetwork'))
const DashboardHome = lazy(() => import('./DashboardHome'))
const DashboardLeroma = lazy(() => import('./DashboardLeroma'))
const CustomersLeroma = lazy(() => import('./CustomersLeroma'))
const MyProgramsLeroma = lazy(() => import('./MyProgramsLeroma'))
const NotificationsLeroma = lazy(() => import('./NotificationsLeroma'))
const PublicMembershipLeroma = lazy(() => import('./PublicMembershipLeroma'))
// const DashboardDelPilar = lazy(() => import('./DashboardDelPilar'))
const CustomersDelPilar = lazy(() => import('./CustomersDelPilar'))
const MyProgramsDelPilar = lazy(() => import('./MyProgramsDelPilar'))
const NotificationsDelPilar = lazy(() => import('./NotificationsDelPilar'))
const PublicMembershipDelPilar = lazy(() => import('./PublicMembershipDelPilar'))
const WalletMoonCafe = lazy(() => import('./WalletMoonCafe'))
const PublicProgramDemoMoonCafe = lazy(() => import('./PublicProgramDemoMoonCafe'))
const PublicProgramDemoMoonCafePoints = lazy(() => import('./PublicProgramDemoMoonCafePoints'))
const WalletDemoMoonCafe = lazy(() => import('./WalletDemoMoonCafe'))
const ScanDemoMoonCafe = lazy(() => import('./ScanDemoMoonCafe'))
const ScanDemoMoonCafeSelector = lazy(() => import('./ScanDemoMoonCafeSelector'))
const DashboardMoonCafe = lazy(() => import('./DashboardMoonCafe'))
const NotificationsMoonCafe = lazy(() => import('./NotificationsMoonCafe'))
const NotificationsRoadmap = lazy(() => import('./NotificationsRoadmap'))
const ComunicacionRoadmap = lazy(() => import('./ComunicacionRoadmap'))
const EncuestaRoadmap = lazy(() => import('./EncuestaRoadmap'))
const PublicEncuesta = lazy(() => import('./PublicEncuesta'))
const CustomersMoonCafe = lazy(() => import('./CustomersMoonCafe'))
const DashboardHintMoonCafe = lazy(() => import('./DashboardHintMoonCafe'))
const DashboardMoonCafePoints = lazy(() => import('./DashboardMoonCafePoints'))
const MyProgramsMoonCafe = lazy(() => import('./MyProgramsMoonCafe'))
const EditClubMoonCafe = lazy(() => import('./EditClubMoonCafe'))
const PublicMembershipMoonCafe = lazy(() => import('./PublicMembershipMoonCafe'))
const PublicMembershipPanPlano = lazy(() => import('./PublicMembershipPanPlano'))
const TeamMoonCafe = lazy(() => import('./TeamMoonCafe'))
const StoresMoonCafe = lazy(() => import('./StoresMoonCafe'))
const CustomersMoonCafePoints = lazy(() => import('./CustomersMoonCafePoints'))
const NotificationsMoonCafePoints = lazy(() => import('./NotificationsMoonCafePoints'))
const ScanDemoMoonCafePoints = lazy(() => import('./ScanDemoMoonCafePoints'))
const WalletDemoMoonCafePoints = lazy(() => import('./WalletDemoMoonCafePoints'))
const DashboardHintMoonCafePoints = lazy(() => import('./DashboardHintMoonCafePoints'))
const WalletDemoGym = lazy(() => import('./WalletDemoGym'))
const ScanDemoGym = lazy(() => import('./ScanDemoGym'))
// const DashboardGym = lazy(() => import('./DashboardGym'))
const DashboardHintGym = lazy(() => import('./DashboardHintGym'))
const CustomersGym = lazy(() => import('./CustomersGym'))
const NotificationsGym = lazy(() => import('./NotificationsGym'))
const ComercioAmigoBarber = lazy(() => import('./ComercioAmigoBarber'))
// const DashboardBarber = lazy(() => import('./DashboardBarber'))
const DashboardHintBarber = lazy(() => import('./DashboardHintBarber'))
const PublicProgramDemoGlow = lazy(() => import('./PublicProgramDemoGlow'))
const PublicProgramDemoGlowPoints = lazy(() => import('./PublicProgramDemoGlowPoints'))
const WalletDemoGlow = lazy(() => import('./WalletDemoGlow'))
const WalletDemoGlowPoints = lazy(() => import('./WalletDemoGlowPoints'))
const ScanDemoGlow = lazy(() => import('./ScanDemoGlow'))
const ScanDemoGlowPoints = lazy(() => import('./ScanDemoGlowPoints'))
// const DashboardGlow = lazy(() => import('./DashboardGlow'))
// const DashboardGlowPoints = lazy(() => import('./DashboardGlowPoints'))
const DashboardHintGlow = lazy(() => import('./DashboardHintGlow'))
const DashboardHintGlowPoints = lazy(() => import('./DashboardHintGlowPoints'))
const CustomersGlow = lazy(() => import('./CustomersGlow'))
const CustomersGlowPoints = lazy(() => import('./CustomersGlowPoints'))
const NotificationsGlow = lazy(() => import('./NotificationsGlow'))
const NotificationsGlowPoints = lazy(() => import('./NotificationsGlowPoints'))
const PublicProgramDemoDelPilar = lazy(() => import('./PublicProgramDemoDelPilar'))
const PublicProgramDemoDelPilarPoints = lazy(() => import('./PublicProgramDemoDelPilarPoints'))
const WalletDemoDelPilar = lazy(() => import('./WalletDemoDelPilar'))
const WalletDemoDelPilarPoints = lazy(() => import('./WalletDemoDelPilarPoints'))
const ScanDemoDelPilar = lazy(() => import('./ScanDemoDelPilar'))
const ScanDemoDelPilarPoints = lazy(() => import('./ScanDemoDelPilarPoints'))
const DashboardHintDelPilar = lazy(() => import('./DashboardHintDelPilar'))
const DashboardHintDelPilarPoints = lazy(() => import('./DashboardHintDelPilarPoints'))

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
            <Route path="/membership/del-pilar-membership-demo" element={<PublicMembershipDelPilar />} />
            <Route path="/membership/moon-cafe-demo" element={<PublicMembershipMoonCafe />} />
            <Route path="/membership/pan-plano-demo" element={<PublicMembershipPanPlano />} />
            <Route path="/membership/:programId" element={<PublicMembership />} />
            <Route path="/cashback/:programId" element={<PublicCashback />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/demo-leroma" element={<Preview />} />
            <Route path="/demo-del-pilar" element={<Preview />} />
            <Route path="/demo-del-pilar-points" element={<Preview />} />
            <Route path="/demo-mooncafe" element={<DemoShell flow="mooncafe" />} />
            <Route path="/roadmap" element={<DemoShell flow="mooncafe" isRoadmap />} />
            <Route path="/demo-mooncafe-points" element={<DemoShell flow="mooncafe-points" />} />
            <Route path="/demo-gym" element={<Preview />} />
            <Route path="/wallet/mooncafe" element={<WalletMoonCafe />} />
            <Route path="/publicprogram-demo/mooncafe" element={<PublicProgramDemoMoonCafe />} />
            <Route path="/publicprogram-demo/mooncafe-points" element={<PublicProgramDemoMoonCafePoints />} />
            <Route path="/wallet-demo/mooncafe" element={<WalletDemoMoonCafe />} />
            <Route path="/scan-demo/mooncafe" element={<ScanDemoMoonCafe />} />
            <Route path="/scan-demo/mooncafe-select" element={<ScanDemoMoonCafeSelector />} />
            <Route
              path="/dashboard-demo/mooncafe"
              element={
                <LayoutWrapper>
                  <DashboardMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard-demo/mooncafe-points"
              element={
                <LayoutWrapper>
                  <DashboardMoonCafePoints />
                </LayoutWrapper>
              }
            />
            <Route
              path="/myprograms-demo/mooncafe"
              element={
                <LayoutWrapper>
                  <MyProgramsMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/myprograms-demo/mooncafe-points"
              element={
                <LayoutWrapper>
                  <MyProgramsMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/editclub-demo/mooncafe"
              element={
                <LayoutWrapper>
                  <EditClubMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/editclub-demo/mooncafe-points"
              element={
                <LayoutWrapper>
                  <EditClubMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/team-demo/mooncafe"
              element={
                <LayoutWrapper>
                  <TeamMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/team-demo/mooncafe-points"
              element={
                <LayoutWrapper>
                  <TeamMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/stores-demo/mooncafe"
              element={
                <LayoutWrapper>
                  <StoresMoonCafe />
                </LayoutWrapper>
              }
            />
            <Route
              path="/stores-demo/mooncafe-points"
              element={
                <LayoutWrapper>
                  <StoresMoonCafe />
                </LayoutWrapper>
              }
            />
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
            <Route path="/demo-glow" element={<Preview />} />
            <Route path="/demo-glow-points" element={<Preview />} />
            <Route path="/publicprogram-demo/glow" element={<PublicProgramDemoGlow />} />
            <Route path="/publicprogram-demo/glow-points" element={<PublicProgramDemoGlowPoints />} />
            <Route path="/wallet-demo/glow" element={<WalletDemoGlow />} />
            <Route path="/wallet-demo/glow-points" element={<WalletDemoGlowPoints />} />
            <Route path="/scan-demo/glow" element={<ScanDemoGlow />} />
            <Route path="/scan-demo/glow-points" element={<ScanDemoGlowPoints />} />
            <Route path="/dashboard-hint/glow" element={<DashboardHintGlow />} />
            <Route path="/dashboard-hint/glow-points" element={<DashboardHintGlowPoints />} />
            <Route path="/publicprogram-demo/del-pilar" element={<PublicProgramDemoDelPilar />} />
            <Route path="/publicprogram-demo/del-pilar-points" element={<PublicProgramDemoDelPilarPoints />} />
            <Route path="/wallet-demo/del-pilar" element={<WalletDemoDelPilar />} />
            <Route path="/wallet-demo/del-pilar-points" element={<WalletDemoDelPilarPoints />} />
            <Route path="/scan-demo/del-pilar" element={<ScanDemoDelPilar />} />
            <Route path="/scan-demo/del-pilar-points" element={<ScanDemoDelPilarPoints />} />
            <Route path="/dashboard-hint/del-pilar" element={<DashboardHintDelPilar />} />
            <Route path="/dashboard-hint/del-pilar-points" element={<DashboardHintDelPilarPoints />} />
            <Route
              path="/dashboard/mooncafe-points-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="Moon Café" demoLogo="/moon-cafe-logo.png" />
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
              path="/notifications/roadmap"
              element={
                <LayoutWrapper>
                  <NotificationsRoadmap />
                </LayoutWrapper>
              }
            />
            <Route
              path="/comunicacion/roadmap"
              element={
                <LayoutWrapper>
                  <ComunicacionRoadmap />
                </LayoutWrapper>
              }
            />
            <Route
              path="/encuesta/roadmap"
              element={
                <LayoutWrapper>
                  <EncuestaRoadmap />
                </LayoutWrapper>
              }
            />
            <Route path="/encuesta/demo" element={<PublicEncuesta />} />
            <Route
              path="/dashboard/mooncafe-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="Moon Café" demoLogo="/moon-cafe-logo.png" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/mooncafe-roadmap"
              element={
                <LayoutWrapper>
                  <DashboardHome demo isRoadmap demoTitle="Moon Café" demoLogo="/moon-cafe-logo.png" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/gym-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="FitClub Gym" demoLogo="/gym-logo.png" />
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
                  <DashboardHome demo demoTitle="Barber Club" demoLogo="/barber-logo.png" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/glow-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="Glow Estética" demoLogo="/glow-logo.png" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/glow-points-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="Glow Estética" demoLogo="/glow-logo.png" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/glow-demo"
              element={
                <LayoutWrapper>
                  <CustomersGlow />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/glow-points-demo"
              element={
                <LayoutWrapper>
                  <CustomersGlowPoints />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/glow-demo"
              element={
                <LayoutWrapper>
                  <NotificationsGlow />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/glow-points-demo"
              element={
                <LayoutWrapper>
                  <NotificationsGlowPoints />
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
            <Route
              path="/dashboard/del-pilar-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="Del Pilar" demoLogo="/del-pilar-logo.jpg" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/del-pilar-demo"
              element={
                <LayoutWrapper>
                  <CustomersDelPilar />
                </LayoutWrapper>
              }
            />
            <Route
              path="/myprograms/del-pilar-demo"
              element={
                <LayoutWrapper>
                  <MyProgramsDelPilar />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/del-pilar-demo"
              element={
                <LayoutWrapper>
                  <NotificationsDelPilar />
                </LayoutWrapper>
              }
            />
            <Route
              path="/dashboard/del-pilar-points-demo"
              element={
                <LayoutWrapper>
                  <DashboardHome demo demoTitle="Del Pilar" demoLogo="/del-pilar-logo.jpg" />
                </LayoutWrapper>
              }
            />
            <Route
              path="/customers/del-pilar-points-demo"
              element={
                <LayoutWrapper>
                  <CustomersDelPilar />
                </LayoutWrapper>
              }
            />
            <Route
              path="/notifications/del-pilar-points-demo"
              element={
                <LayoutWrapper>
                  <NotificationsDelPilar />
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
              path="/sorteo"
              element={
                <LayoutWrapper>
                  <Sorteo />
                </LayoutWrapper>
              }
            />
            <Route
              path="/sorteo/mooncafe-demo"
              element={
                <LayoutWrapper>
                  <Sorteo />
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
