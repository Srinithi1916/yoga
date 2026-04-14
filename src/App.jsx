import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminMemberTrackingPage from './pages/AdminMemberTrackingPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import GuidesPage from './pages/GuidesPage';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import ProgramsPage from './pages/ProgramsPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin/payments"
              element={(
                <AdminRoute>
                  <AdminPaymentsPage />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/bookings"
              element={(
                <AdminRoute>
                  <AdminBookingsPage />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/users"
              element={(
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/member-tracking"
              element={(
                <AdminRoute>
                  <AdminMemberTrackingPage />
                </AdminRoute>
              )}
            />
            <Route
              path="/contact"
              element={(
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
