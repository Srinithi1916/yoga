import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import AboutPage from './pages/AboutPage';
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
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
