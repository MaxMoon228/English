import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export function Root() {
  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
