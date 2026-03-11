import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import Layout from './Layout';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';
import MyPrograms from './MyPrograms';
import CreateClub from './CreateClub';
import Customers from './Customers';
import Stores from './Stores';
import Team from './Team';
import Notifications from './Notifications';
import Profile from './Profile';
import ScanQR from './ScanQR';
import PublicCard from './PublicCard';
import PublicStore from './PublicStore';
import VerifyEmail from './VerifyEmail';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Onboarding from './Onboarding';
import Survey from './Survey';
import Menu from './Menu';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Componente wrapper para obtener el nombre de la página actual
function LayoutWrapper({ children }) {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop() || 'home';
  return <Layout currentPageName={pageName}>{children}</Layout>;
}

export default function Pages() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rutas públicas - sin protección */}
        <Route path="/publicprogram" element={<PublicCard />} />
        <Route path="/store/:storeId" element={<PublicStore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Todas las demás rutas requieren autenticación */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Rutas protegidas (con layout) */}
        <Route path="/onboarding" element={<ProtectedRoute><LayoutWrapper><Onboarding /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><LayoutWrapper><Dashboard /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/myprograms" element={<ProtectedRoute><LayoutWrapper><MyPrograms /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/createclub" element={<ProtectedRoute><LayoutWrapper><CreateClub /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><LayoutWrapper><Customers /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/stores" element={<ProtectedRoute><LayoutWrapper><Stores /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><LayoutWrapper><Team /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><LayoutWrapper><Notifications /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><LayoutWrapper><Profile /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/scanqr" element={<ProtectedRoute><LayoutWrapper><ScanQR /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute><LayoutWrapper><Survey /></LayoutWrapper></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><LayoutWrapper><Menu /></LayoutWrapper></ProtectedRoute>} />
        
        {/* Ruta catch-all para redirigir a login si no está autenticado */}
        <Route path="*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
