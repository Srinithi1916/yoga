import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
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
