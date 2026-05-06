import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Search, BookOpen, Menu, X, ChevronDown } from 'lucide-react';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Учебники', href: '/catalog/textbooks' },
    { label: 'Олимпиады', href: '/catalog/olympiads' },
    { label: 'ЕГЭ', href: '/catalog/ege' },
    { label: 'Уроки', href: '/catalog/lessons' },
    { label: 'Skill Map', href: '/skill-map' },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href);

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(30,42,68,0.09)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 0 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 40 }}>
            <div
              style={{
                width: 32,
                height: 32,
                backgroundColor: '#1E2A44',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={16} color="#F7F4EE" strokeWidth={2} />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 17, color: '#1E2A44', letterSpacing: '-0.01em' }}>
              English<span style={{ color: '#A9445B' }}>Platform</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="hidden md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'Manrope, sans-serif',
                  color: isActive(link.href) ? '#1E2A44' : '#5A6275',
                  backgroundColor: isActive(link.href) ? '#DCE6F2' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    (e.target as HTMLAnchorElement).style.backgroundColor = '#F0F4F9';
                    (e.target as HTMLAnchorElement).style.color = '#1E2A44';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    (e.target as HTMLAnchorElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLAnchorElement).style.color = '#5A6275';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                color: '#5A6275',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F4F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Search size={18} />
            </button>

            <Link
              to="/admin/login"
              style={{
                textDecoration: 'none',
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Manrope, sans-serif',
                color: '#1E2A44',
                border: '1.5px solid rgba(30,42,68,0.2)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1E2A44';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1E2A44';
              }}
            >
              Войти в Admin
            </Link>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                color: '#5A6275',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div style={{ padding: '0 0 16px', borderTop: '1px solid rgba(30,42,68,0.07)' }}>
            <div style={{ position: 'relative', paddingTop: 16 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                autoFocus
                placeholder="Найти материалы, темы, задания..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 44px',
                  borderRadius: 12,
                  border: '1.5px solid rgba(30,42,68,0.15)',
                  backgroundColor: '#F7F4EE',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  color: '#2B2F36',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/catalog?query=${encodeURIComponent(searchQuery)}`);
                    setSearchOpen(false);
                  }
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid rgba(30,42,68,0.07)', paddingBottom: 16 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  padding: '10px 4px',
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: 'Manrope, sans-serif',
                  color: isActive(link.href) ? '#1E2A44' : '#5A6275',
                  borderBottom: '1px solid rgba(30,42,68,0.05)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
