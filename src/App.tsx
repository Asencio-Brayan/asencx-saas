import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
<<<<<<< HEAD
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { TenantLayout } from './layouts/TenantLayout';
import { IndustryDetailsPage } from './pages/solutions/IndustryDetailsPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { CookiesPage } from './pages/legal/CookiesPage';
import { Checkout } from './pages/Checkout';
=======
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { CookiesPage } from './pages/legal/CookiesPage';
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
<<<<<<< HEAD
      <Route path="/soluciones/:slug" element={<IndustryDetailsPage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute allowedRoles={['TENANT_OWNER', 'TENANT_USER']}>
            <TenantLayout />
          </ProtectedRoute>
        }
      />
=======
      <Route path="/privacidad" element={<PrivacyPage />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
