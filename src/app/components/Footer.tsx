import { Link } from 'react-router';
import { BookOpen, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1E2A44',
        color: '#DCE6F2',
        padding: '56px 0 32px',
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}
          className="grid-cols-1 md:grid-cols-4">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'rgba(247,244,238,0.15)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={16} color="#DCE6F2" strokeWidth={2} />
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 17, color: '#F7F4EE' }}>
                English<span style={{ color: '#D8C3A5' }}>Platform</span>
              </span>
            </div>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#8A9AB8', lineHeight: 1.7, maxWidth: 260 }}>
              Умная образовательная платформа для подготовки к олимпиадам, ЕГЭ и проведения уроков английского языка.
            </p>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(169,68,91,0.2)',
                  border: '1px solid rgba(169,68,91,0.35)',
                  fontSize: 11,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  color: '#D8A0AF',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Academic English
              </span>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: '#8A9AB8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Разделы
            </h4>
            {[
              { label: 'Учебники', href: '/catalog/textbooks' },
              { label: 'Олимпиады', href: '/catalog/olympiads' },
              { label: 'ЕГЭ', href: '/catalog/ege' },
              { label: 'Уроки', href: '/catalog/lessons' },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                style={{
                  display: 'block',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  color: '#A8B8CE',
                  textDecoration: 'none',
                  marginBottom: 10,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F7F4EE')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A8B8CE')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: '#8A9AB8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Возможности
            </h4>
            {[
              { label: 'Skill Map Navigator', href: '/skill-map' },
              { label: 'Поиск материалов', href: '/catalog' },
              { label: 'Подборки', href: '/catalog' },
              { label: 'Рекомендации', href: '/catalog' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                style={{
                  display: 'block',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  color: '#A8B8CE',
                  textDecoration: 'none',
                  marginBottom: 10,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F7F4EE')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A8B8CE')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: '#8A9AB8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Контакты
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Mail size={14} color="#8A9AB8" />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#A8B8CE' }}>info@englishplatform.ru</span>
            </div>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 8,
                fontFamily: 'Manrope, sans-serif',
                fontSize: 13,
                color: '#D8C3A5',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F7F4EE')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#D8C3A5')}
            >
              <ExternalLink size={13} />
              Вход для редакторов
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#6A7A8E' }}>
            © 2025 EnglishPlatform — Образовательные материалы по английскому языку
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Grammar', 'Writing', 'Speaking', 'Reading'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  fontFamily: 'Manrope, sans-serif',
                  color: '#6A7A8E',
                  padding: '2px 8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
