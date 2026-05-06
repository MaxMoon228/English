import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search, BookOpen, Trophy, FileCheck, GraduationCap,
  ArrowRight, Sparkles, Star, TrendingUp, ChevronRight,
  FileText, Mic, PenLine, BookMarked, Layers, Map
} from 'lucide-react';
import { materials as mockMaterials, collections as mockCollections, popularTopics as mockPopularTopics } from '../data/mockData';
import { api } from '../services/api';
import { mapCollections, mapMaterial, mapPopularTopics } from '../data/viewModels';

const HERO_IMG = 'https://images.unsplash.com/photo-1629992219172-09eefc9c4d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicml0aXNoJTIwb3hmb3JkJTIwYWNhZGVtaWMlMjBib29rcyUyMGxpYnJhcnl8ZW58MXx8fHwxNzc2MTYzMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080';
const NOTEBOOK_IMG = 'https://images.unsplash.com/photo-1700773428278-13f13630d18d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwc3R1ZHklMjBub3RlYm9vayUyMHBlbiUyMHdyaXRpbmclMjBhY2FkZW1pY3xlbnwxfHx8fDE3NzYxNjMyODB8MA&ixlib=rb-4.1.0&q=80&w=1080';

const goals = [
  {
    key: 'olympiads',
    icon: Trophy,
    title: 'Олимпиады',
    subtitle: 'Grammar · Writing · Culture · Speaking',
    color: '#A9445B',
    bgColor: 'rgba(169,68,91,0.06)',
    href: '/catalog/olympiads',
    badge: 'Advanced',
  },
  {
    key: 'ege',
    icon: FileCheck,
    title: 'ЕГЭ',
    subtitle: 'Grammar · Writing · Speaking',
    color: '#2B5E8A',
    bgColor: 'rgba(43,94,138,0.06)',
    href: '/catalog/ege',
    badge: 'B2',
  },
  {
    key: 'textbooks',
    icon: BookOpen,
    title: 'Учебники',
    subtitle: 'Грифованные · Полные комплекты',
    color: '#1E2A44',
    bgColor: 'rgba(30,42,68,0.06)',
    href: '/catalog/textbooks',
    badge: 'Library',
  },
  {
    key: 'lessons',
    icon: GraduationCap,
    title: 'Подготовка к урокам',
    subtitle: 'CLIL · SELTA · Worksheets',
    color: '#3D6B4F',
    bgColor: 'rgba(61,107,79,0.06)',
    href: '/catalog/lessons',
    badge: 'Teacher',
  },
];

const typeLabel: Record<string, string> = {
  'worksheet': 'Worksheet',
  'lesson-plan': 'Lesson Plan',
  'speaking-card': 'Speaking',
  'grammar-task': 'Grammar',
  'writing-template': 'Writing',
  'audio': 'Audio',
  'test': 'Test',
  'checklist': 'Checklist',
};

const typeColor: Record<string, string> = {
  'worksheet': '#3D6B4F',
  'lesson-plan': '#1E2A44',
  'speaking-card': '#A9445B',
  'grammar-task': '#5B4B8A',
  'writing-template': '#2B5E8A',
  'audio': '#7C5C3A',
  'test': '#A9445B',
  'checklist': '#3D6B4F',
};

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{
        width: 24, height: 2,
        backgroundColor: '#D8C3A5',
        display: 'inline-block',
        borderRadius: 2,
      }} />
      <span style={{
        fontFamily: 'Manrope, sans-serif',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#9CA3AF',
      }}>{text}</span>
    </div>
  );
}

export function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [allMaterials, setAllMaterials] = useState(mockMaterials);
  const [allCollections, setAllCollections] = useState(mockCollections);
  const [topics, setTopics] = useState(mockPopularTopics);

  useEffect(() => {
    Promise.all([
      api.materials({ ordering: '-date_updated', page_size: 100 }),
      api.collections(),
    ])
      .then(([materialsResponse, collectionsResponse]) => {
        const mappedMaterials = materialsResponse.results.map(mapMaterial);
        setAllMaterials(mappedMaterials as any);
        setAllCollections(mapCollections(collectionsResponse) as any);
        setTopics(mapPopularTopics(mappedMaterials));
      })
      .catch(() => {
        // Keep mock data fallback for local resilience
      });
  }, []);

  const newMaterials = allMaterials.slice(0, 6);

  return (
    <div style={{ backgroundColor: '#F7F4EE' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#1E2A44',
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 0 96px',
        }}
      >
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Decorative quote marks */}
        <div style={{
          position: 'absolute', top: 24, right: '8%',
          fontFamily: 'Playfair Display, serif',
          fontSize: 220, color: 'rgba(216,195,165,0.07)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>"</div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid rgba(216,195,165,0.3)',
              backgroundColor: 'rgba(216,195,165,0.1)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: '#D8C3A5',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Academic English Workspace
            </span>
            <Sparkles size={14} color="#D8C3A5" />
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: 'clamp(36px, 5vw, 64px)',
            color: '#F7F4EE',
            lineHeight: 1.15,
            maxWidth: 680,
            marginBottom: 20,
          }}>
            Умная платформа<br />
            <span style={{ color: '#D8C3A5', fontStyle: 'italic' }}>по английскому языку</span>
          </h1>

          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 17,
            color: '#A8B8CE',
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 40,
          }}>
            Учебники, олимпиадные задания, ЕГЭ-материалы и методические разработки — всё в одном пространстве для учёбы и преподавания.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 580, marginBottom: 32 }}>
            <Search size={20} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', zIndex: 2 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/catalog?query=${encodeURIComponent(query)}`)}
              placeholder="Найти материалы, темы, задания..."
              style={{
                width: '100%',
                padding: '16px 120px 16px 52px',
                borderRadius: 16,
                border: '1.5px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 15,
                color: '#F7F4EE',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(216,195,165,0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <button
              onClick={() => navigate(`/catalog?query=${encodeURIComponent(query)}`)}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 20px',
                backgroundColor: '#A9445B',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontFamily: 'Manrope, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8E3249')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#A9445B')}
            >
              Найти
            </button>
          </div>

          {/* Quick access chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#6A7A8E' }}>Быстрый переход:</span>
            {goals.map((g) => (
              <Link
                key={g.key}
                to={g.href}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#DCE6F2',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(216,195,165,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <g.icon size={13} />
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOALS ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 0' }}>
        <SectionLabel text="Выберите цель" />
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(24px, 3vw, 36px)',
          color: '#1E2A44',
          marginBottom: 32,
          fontWeight: 600,
        }}>
          Что вы готовите?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {goals.map((goal) => (
            <Link
              key={goal.key}
              to={goal.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(30,42,68,0.08)',
                  borderRadius: 20,
                  padding: '28px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(30,42,68,0.1)';
                  e.currentTarget.style.borderColor = goal.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(30,42,68,0.08)';
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 80, height: 80,
                  backgroundColor: goal.bgColor,
                  borderRadius: '0 20px 0 80px',
                }} />
                <div
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: goal.bgColor,
                    border: `1.5px solid ${goal.color}30`,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <goal.icon size={20} color={goal.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1E2A44',
                  }}>
                    {goal.title}
                  </h3>
                  <span style={{
                    fontSize: 10,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    color: goal.color,
                    backgroundColor: goal.bgColor,
                    padding: '2px 8px',
                    borderRadius: 4,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    {goal.badge}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  color: '#8A9AB8',
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}>
                  {goal.subtitle}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: goal.color }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600 }}>Перейти</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── POPULAR TOPICS ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <SectionLabel text="Популярные темы" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(22px, 2.5vw, 32px)',
            color: '#1E2A44',
            fontWeight: 600,
          }}>
            Популярные темы
          </h2>
          <Link
            to="/catalog"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              textDecoration: 'none', color: '#A9445B',
              fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600,
            }}
          >
            Все темы <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {topics.map((topic, i) => (
            <Link
              key={topic}
              to={`/catalog?query=${encodeURIComponent(topic)}`}
              style={{ textDecoration: 'none' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 20,
                  backgroundColor: i % 4 === 0 ? 'rgba(30,42,68,0.06)' :
                    i % 4 === 1 ? 'rgba(169,68,91,0.06)' :
                      i % 4 === 2 ? 'rgba(43,94,138,0.06)' : 'rgba(61,107,79,0.06)',
                  border: `1px solid ${i % 4 === 0 ? 'rgba(30,42,68,0.12)' :
                    i % 4 === 1 ? 'rgba(169,68,91,0.15)' :
                      i % 4 === 2 ? 'rgba(43,94,138,0.12)' : 'rgba(61,107,79,0.12)'}`,
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  color: i % 4 === 0 ? '#1E2A44' :
                    i % 4 === 1 ? '#A9445B' :
                      i % 4 === 2 ? '#2B5E8A' : '#3D6B4F',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {topic}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW MATERIALS ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <SectionLabel text="Новые материалы" />
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(22px, 2.5vw, 32px)',
              color: '#1E2A44',
              fontWeight: 600,
            }}>
              Последние добавления
            </h2>
          </div>
          <Link
            to="/catalog"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              textDecoration: 'none', color: '#A9445B',
              fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600,
            }}
          >
            Все материалы <ArrowRight size={14} />
          </Link>
        </div>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#8A9AB8', marginBottom: 28 }}>
          Свежие материалы, добавленные редакторами платформы
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {newMaterials.map((mat) => (
            <Link key={mat.id} to={`/material/${(mat as any).slug || mat.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(30,42,68,0.07)',
                  borderRadius: 18,
                  padding: '20px 20px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,42,68,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    color: typeColor[mat.type] || '#5A6275',
                    backgroundColor: `${typeColor[mat.type]}15` || 'rgba(90,98,117,0.08)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {typeLabel[mat.type]}
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    color: '#8A9AB8',
                    backgroundColor: '#F0F4F9',
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}>
                    {mat.level}
                  </span>
                  {mat.difficulty && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {[1, 2, 3].map((d) => (
                        <span key={d} style={{
                          width: 5, height: 5, borderRadius: '50%',
                          backgroundColor: d <= mat.difficulty! ? '#A9445B' : '#E5E7EB',
                          display: 'inline-block',
                        }} />
                      ))}
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#1E2A44',
                  marginBottom: 8,
                  lineHeight: 1.4,
                  flex: 1,
                }}>
                  {mat.title}
                </h3>
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  color: '#8A9AB8',
                  lineHeight: 1.5,
                  marginBottom: 14,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {mat.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(30,42,68,0.06)', paddingTop: 12 }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>{mat.author.split(',')[0]}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>
                    <FileText size={12} />
                    {mat.files.length} {mat.files.length === 1 ? 'файл' : 'файла'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <SectionLabel text="Подборки" />
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(22px, 2.5vw, 32px)',
          color: '#1E2A44',
          fontWeight: 600,
          marginBottom: 28,
        }}>
          Кураторские подборки
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {allCollections.map((col) => (
            <Link key={col.id} to={`/catalog?query=${encodeURIComponent(col.title)}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: col.color,
                  borderRadius: 20,
                  padding: '32px 28px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${col.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute', bottom: -20, right: -20,
                  width: 100, height: 100,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '50%',
                }} />
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {col.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: 10,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.7)',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}>
                  {col.title}
                </h3>
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}>
                  {col.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)',
                  }}>
                    {col.count} материалов
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    color: '#fff', fontFamily: 'Manrope, sans-serif',
                    fontSize: 13, fontWeight: 600,
                  }}>
                    Открыть <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SKILL MAP FEATURE ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '64px auto 0', padding: '0 32px' }}>
        <div
          style={{
            backgroundColor: '#1E2A44',
            borderRadius: 24,
            padding: '56px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Decorative pattern */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%',
            backgroundImage: `url(${NOTEBOOK_IMG})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.08,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Map size={18} color="#D8C3A5" />
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                color: '#D8C3A5',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Killer Feature
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(26px, 3vw, 40px)',
              fontWeight: 700,
              color: '#F7F4EE',
              lineHeight: 1.2,
              marginBottom: 16,
            }}>
              Skill Map<br />
              <span style={{ color: '#D8C3A5', fontStyle: 'italic' }}>Navigator</span>
            </h2>
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 16,
              color: '#8A9AB8',
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 380,
            }}>
              Интерактивная карта навыков, связывающая материалы с конкретными language skills. Видьте прогресс, находите пробелы, получайте рекомендации.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {['Tenses', 'Conditionals', 'Essay Structure', 'Speaking Fluency', 'Cultural Context'].map((skill) => (
                <span key={skill} style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: '1px solid rgba(216,195,165,0.25)',
                  backgroundColor: 'rgba(216,195,165,0.08)',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#D8C3A5',
                }}>
                  {skill}
                </span>
              ))}
            </div>
            <Link
              to="/skill-map"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                backgroundColor: '#A9445B',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 14,
                fontWeight: 700,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8E3249')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#A9445B')}
            >
              Открыть Skill Map <ArrowRight size={16} />
            </Link>
          </div>

          {/* Visual preview */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 24,
            }}>
              {/* Mini skill map preview */}
              <svg viewBox="0 0 320 200" style={{ width: '100%', height: 'auto' }}>
                {/* Connections */}
                {[
                  [60, 50, 160, 40], [60, 50, 60, 100], [60, 100, 60, 160],
                  [160, 40, 260, 70], [60, 100, 160, 110], [160, 110, 260, 140],
                  [160, 40, 160, 110], [260, 70, 260, 140],
                ].map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(216,195,165,0.2)" strokeWidth="1.5"
                    strokeDasharray="4 3" />
                ))}
                {/* Nodes */}
                {[
                  { cx: 60, cy: 50, color: '#1E3A5F', label: 'Tenses', prog: 75 },
                  { cx: 60, cy: 100, color: '#1E3A5F', label: 'Passive', prog: 60 },
                  { cx: 60, cy: 160, color: '#1E3A5F', label: 'Cond.', prog: 45 },
                  { cx: 160, cy: 40, color: '#5B4B8A', label: 'WordForm', prog: 80 },
                  { cx: 160, cy: 110, color: '#2B5E8A', label: 'Linking', prog: 55 },
                  { cx: 260, cy: 70, color: '#A9445B', label: 'Argument', prog: 40 },
                  { cx: 260, cy: 140, color: '#3D6B4F', label: 'Speaking', prog: 50 },
                ].map((node) => (
                  <g key={node.label}>
                    <circle cx={node.cx} cy={node.cy} r={20} fill={node.color} fillOpacity="0.8" stroke="rgba(216,195,165,0.4)" strokeWidth="1.5" />
                    <circle cx={node.cx} cy={node.cy} r={20} fill="none" stroke="rgba(216,195,165,0.6)"
                      strokeWidth="1.5" strokeDasharray={`${node.prog * 1.26} 126`}
                      strokeLinecap="round" transform={`rotate(-90 ${node.cx} ${node.cy})`} />
                    <text x={node.cx} y={node.cy + 4} textAnchor="middle" fill="rgba(247,244,238,0.9)" fontSize="7" fontFamily="Manrope, sans-serif" fontWeight="600">
                      {node.label.substring(0, 6)}
                    </text>
                  </g>
                ))}
              </svg>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
                {[
                  { color: '#1E3A5F', label: 'Grammar' },
                  { color: '#A9445B', label: 'Writing' },
                  { color: '#3D6B4F', label: 'Speaking' },
                ].map((leg) => (
                  <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: leg.color }} />
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#8A9AB8' }}>{leg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />
    </div>
  );
}
