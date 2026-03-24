import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import PastelBackground from './PastelBackground';

export default function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-pink-200 to-purple-200">
      <PastelBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="pb-8 pt-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
