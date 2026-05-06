import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { BookOpen, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export function AdminLoginPage() {
  const [email, setEmail] = useState('EnglishPlatform');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authenticated } = useAuth();

  const redirectPath = (location.state as any)?.from || '/admin';

  useEffect(() => {
    if (authenticated) {
      navigate('/admin');
    }
  }, [authenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setLoading(true);
    login(email, password)
      .then(() => navigate(redirectPath))
      .catch(() => setError('Неверные данные для входа. Проверьте логин и пароль.'))
      .finally(() => setLoading(false));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F4EE',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div style={{
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            textDecoration: 'none',
          }}
        >
          <div style={{
            width: 30, height: 30, backgroundColor: '#1E2A44', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={15} color="#F7F4EE" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 16, color: '#1E2A44' }}>
            English<span style={{ color: '#A9445B' }}>Platform</span>
          </span>
        </Link>

        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            textDecoration: 'none',
            fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1E2A44')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8A9AB8')}
        >
          <ArrowLeft size={14} /> На сайт
        </Link>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(30,42,68,0.1)',
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '0 8px 48px rgba(30,42,68,0.08)',
          }}>

            {/* Header */}
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: '#1E2A44',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <LogIn size={22} color="#DCE6F2" />
              </div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 26,
                fontWeight: 700,
                color: '#1E2A44',
                marginBottom: 6,
              }}>
                Admin Panel
              </h1>
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 13,
                color: '#8A9AB8',
                lineHeight: 1.5,
              }}>
                Вход для редакторов и администраторов<br />образовательной платформы
              </p>
            </div>

            {/* Decorative separator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
            }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(30,42,68,0.08)' }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, color: '#C4C9D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Авторизация
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(30,42,68,0.08)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#5A6275',
                  marginBottom: 6,
                  letterSpacing: '0.04em',
                }}>
                  Email / Логин
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EnglishPlatform"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1.5px solid ${error ? 'rgba(169,68,91,0.4)' : 'rgba(30,42,68,0.12)'}`,
                    backgroundColor: '#F7F4EE',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 14,
                    color: '#2B2F36',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1E2A44')}
                  onBlur={(e) => (e.target.style.borderColor = error ? 'rgba(169,68,91,0.4)' : 'rgba(30,42,68,0.12)')}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#5A6275',
                  marginBottom: 6,
                  letterSpacing: '0.04em',
                }}>
                  Пароль
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 14px',
                      borderRadius: 12,
                      border: `1.5px solid ${error ? 'rgba(169,68,91,0.4)' : 'rgba(30,42,68,0.12)'}`,
                      backgroundColor: '#F7F4EE',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 14,
                      color: '#2B2F36',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#1E2A44')}
                    onBlur={(e) => (e.target.style.borderColor = error ? 'rgba(169,68,91,0.4)' : 'rgba(30,42,68,0.12)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', padding: 4, display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(169,68,91,0.06)',
                  border: '1px solid rgba(169,68,91,0.2)',
                  marginBottom: 16,
                }}>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#A9445B', lineHeight: 1.5 }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: loading ? '#8A9AB8' : '#1E2A44',
                  color: '#FFFFFF',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.2s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#16213A'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#1E2A44'; }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#FFFFFF', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Вход...
                  </>
                ) : (
                  <>
                    <LogIn size={15} />
                    Войти в Admin Panel
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Hint */}
          <p style={{
            textAlign: 'center',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            color: '#9CA3AF',
            marginTop: 20,
          }}>
            Для демо: EnglishPlatform / 12345
          </p>

          {/* Language tags decoration */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
            {['Grammar', 'Writing', 'Speaking', 'Use of English'].map((tag) => (
              <span key={tag} style={{
                fontSize: 10,
                fontFamily: 'Manrope, sans-serif',
                color: '#C4C9D4',
                border: '1px solid rgba(30,42,68,0.08)',
                padding: '2px 8px', borderRadius: 4,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
