import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  BookOpen, LayoutDashboard, FileText, Tag, Upload,
  Eye, EyeOff, Clock, Settings, Search, Bell, User,
  ChevronRight, TrendingUp, Plus, Edit2, Trash2,
  CheckCircle, AlertCircle, FileCheck, Trophy, GraduationCap,
  BarChart2, Activity, ArrowUpRight, MoreHorizontal, LogOut
} from 'lucide-react';
import { materials as mockMaterials } from '../data/mockData';
import { api } from '../services/api';
import { mapMaterial } from '../data/viewModels';
import { useAuth } from '../features/auth/AuthContext';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { key: 'materials', label: 'Все материалы', icon: FileText, href: '/admin/materials' },
  { key: 'sections', label: 'Разделы', icon: BookOpen, href: '/admin/sections' },
  { key: 'upload', label: 'Загрузка файлов', icon: Upload, href: '/admin/uploads' },
  { key: 'tags', label: 'Теги', icon: Tag, href: '/admin/tags' },
  { key: 'drafts', label: 'Черновики', icon: FileText, href: '/admin/materials', badge: 3 },
  { key: 'published', label: 'Опубликованные', icon: Eye, href: '/admin/materials' },
  { key: 'hidden', label: 'Скрытые', icon: EyeOff, href: '/admin/materials' },
  { key: 'history', label: 'История изменений', icon: Clock, href: '/admin/history' },
];

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

export function AdminDashboardPage() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { logout, username } = useAuth();
  const [materials, setMaterials] = useState<any[]>(mockMaterials as any[]);
  const [statsPayload, setStatsPayload] = useState<any | null>(null);

  useEffect(() => {
    api.dashboardStats()
      .then((payload) => {
        setStatsPayload(payload);
        setMaterials(payload.recent_materials.map((item: any) => mapMaterial(item)));
      })
      .catch(() => setMaterials(mockMaterials as any[]));
  }, []);

  const stats = useMemo(() => [
    { label: 'Всего материалов', value: String(statsPayload?.materials_total ?? materials.length), change: 'live', up: true, icon: FileText, color: '#1E2A44' },
    { label: 'Опубликовано', value: String(statsPayload?.materials_published ?? materials.filter((m: any) => m.status === 'published').length), change: 'live', up: true, icon: CheckCircle, color: '#3D6B4F' },
    { label: 'Черновики', value: String(statsPayload?.materials_draft ?? materials.filter((m: any) => m.status === 'draft').length), change: 'live', up: false, icon: AlertCircle, color: '#D8A020' },
    { label: 'Просмотров', value: String(statsPayload?.views_total ?? materials.reduce((sum: number, m: any) => sum + (m.views || 0), 0)), change: 'live', up: true, icon: TrendingUp, color: '#A9445B' },
  ], [statsPayload, materials]);

  const recentMaterials = materials.slice(0, 8);
  const filtered = searchQuery
    ? recentMaterials.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : recentMaterials;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F4EE', fontFamily: 'Manrope, sans-serif' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        backgroundColor: '#1E2A44',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, backgroundColor: 'rgba(247,244,238,0.1)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={14} color="#DCE6F2" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 14, color: '#F7F4EE' }}>
              English<span style={{ color: '#D8C3A5' }}>Platform</span>
            </span>
          </Link>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: 'rgba(169,68,91,0.2)',
            border: '1px solid rgba(169,68,91,0.3)',
            fontSize: 9,
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            color: '#D8A0AF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Admin Panel
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', margin: '0 16px 12px' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 8px' }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  navigate(item.href);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(247,244,238,0.1)' : 'transparent',
                  color: isActive ? '#F7F4EE' : '#8A9AB8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: 2,
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '2px solid #D8C3A5' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#DCE6F2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#8A9AB8';
                  }
                }}
              >
                <item.icon size={14} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    backgroundColor: '#A9445B',
                    fontSize: 9, fontWeight: 700, color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', margin: '12px 16px 12px' }} />

        {/* Bottom */}
        <div style={{ padding: '0 8px 20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.05)',
            marginBottom: 4,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              backgroundColor: '#A9445B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#FFFFFF',
              flexShrink: 0,
            }}>
              А
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#F7F4EE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username || 'Admin'}</p>
              <p style={{ fontSize: 10, color: '#6A7A8E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>editor session</p>
            </div>
          </div>
          <button
            onClick={() => logout().then(() => navigate('/admin/login'))}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 12px', borderRadius: 6,
              border: 'none', backgroundColor: 'transparent',
              color: '#6A7A8E', cursor: 'pointer', fontSize: 12,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F7F4EE'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6A7A8E'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={12} /> Выйти
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: 220, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(30,42,68,0.08)',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ position: 'relative', maxWidth: 320 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск материалов..."
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 32px',
                  borderRadius: 8,
                  border: '1.5px solid rgba(30,42,68,0.1)',
                  backgroundColor: '#F7F4EE',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  color: '#2B2F36',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <button style={{ padding: 8, borderRadius: 8, border: '1.5px solid rgba(30,42,68,0.1)', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#5A6275', display: 'flex', alignItems: 'center' }}>
            <Bell size={15} />
          </button>
          <Link
            to="/admin/materials/new"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 8,
              backgroundColor: '#1E2A44', color: '#FFFFFF',
              textDecoration: 'none',
              fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700,
            }}
          >
            <Plus size={14} /> Новый материал
          </Link>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px', flex: 1 }}>

          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1E2A44', marginBottom: 4 }}>
              Dashboard
            </h1>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8' }}>
              Обзор платформы · Апрель 2025
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(30,42,68,0.07)',
                  borderRadius: 16,
                  padding: '20px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,42,68,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: `${stat.color}10`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <stat.icon size={16} color={stat.color} />
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                    color: stat.up ? '#3D6B4F' : '#D8A020',
                    backgroundColor: stat.up ? 'rgba(61,107,79,0.08)' : 'rgba(216,160,32,0.08)',
                    padding: '2px 7px', borderRadius: 4,
                    display: 'flex', alignItems: 'center', gap: 2,
                  }}>
                    <ArrowUpRight size={10} style={{ transform: stat.up ? 'none' : 'rotate(90deg)' }} />
                    {stat.change}
                  </span>
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 28, fontWeight: 800, color: '#1E2A44', marginBottom: 2 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 28 }}>

            {/* Materials table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(30,42,68,0.07)',
              borderRadius: 18,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '18px 20px',
                borderBottom: '1px solid rgba(30,42,68,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 15, fontWeight: 700, color: '#1E2A44' }}>
                  Последние изменения
                </h2>
                <Link
                  to="/admin/materials/new"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    textDecoration: 'none',
                    fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700,
                    color: '#1E2A44',
                    padding: '5px 10px', borderRadius: 6,
                    border: '1.5px solid rgba(30,42,68,0.12)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Plus size={12} /> Добавить
                </Link>
              </div>
              <div>
                {filtered.map((mat, i) => (
                  <div
                    key={mat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(30,42,68,0.05)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      backgroundColor: `${typeColor[mat.type]}10`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={15} color={typeColor[mat.type]} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600,
                        color: '#1E2A44', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginBottom: 2,
                      }}>
                        {mat.title}
                      </p>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 10, fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                          color: typeColor[mat.type], textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {typeLabel[mat.type]}
                        </span>
                        <span style={{ fontSize: 10, color: '#D1D5DB' }}>·</span>
                        <span style={{ fontSize: 10, fontFamily: 'Manrope, sans-serif', color: '#9CA3AF' }}>
                          {mat.author.split(',')[0]}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{
                        fontSize: 10, fontFamily: 'Manrope, sans-serif', fontWeight: 600,
                        padding: '2px 7px', borderRadius: 4,
                        backgroundColor: mat.status === 'published' ? 'rgba(61,107,79,0.1)' : 'rgba(216,160,32,0.1)',
                        color: mat.status === 'published' ? '#3D6B4F' : '#D8A020',
                      }}>
                        {mat.status === 'published' ? 'Опубликовано' : 'Черновик'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Link
                        to={`/admin/materials/${mat.id}/edit`}
                        style={{
                          padding: 6, borderRadius: 6,
                          border: '1px solid rgba(30,42,68,0.1)',
                          backgroundColor: '#FFFFFF',
                          color: '#5A6275', textDecoration: 'none',
                          display: 'flex', alignItems: 'center',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E2A44'; (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; (e.currentTarget as HTMLAnchorElement).style.color = '#5A6275'; }}
                      >
                        <Edit2 size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions + section stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Quick actions */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(30,42,68,0.07)',
                borderRadius: 18,
                padding: '18px 18px',
              }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44', marginBottom: 14 }}>
                  Быстрые действия
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Добавить материал', icon: Plus, href: '/admin/materials/new', color: '#1E2A44' },
                    { label: 'Загрузить файл', icon: Upload, href: '/admin/uploads', color: '#2B5E8A' },
                    { label: 'Управление тегами', icon: Tag, href: '/admin/tags', color: '#5B4B8A' },
                    { label: 'История изменений', icon: Clock, href: '/admin/history', color: '#3D6B4F' },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 8,
                        border: '1.5px solid rgba(30,42,68,0.07)',
                        backgroundColor: '#F7F4EE',
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = action.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F7F4EE';
                        e.currentTarget.style.borderColor = 'rgba(30,42,68,0.07)';
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: `${action.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <action.icon size={13} color={action.color} />
                      </div>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: '#2B2F36' }}>
                        {action.label}
                      </span>
                      <ChevronRight size={12} color="#C4C9D4" style={{ marginLeft: 'auto' }} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sections overview */}
              <div style={{
                backgroundColor: '#1E2A44',
                borderRadius: 18,
                padding: '18px 18px',
              }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#F7F4EE', marginBottom: 14 }}>
                  Статистика разделов
                </h2>
                {[
                  { label: 'Учебники', count: materials.filter((m) => m.section === 'textbooks').length, icon: BookOpen, color: '#DCE6F2' },
                  { label: 'Олимпиады', count: materials.filter((m) => m.section === 'olympiads').length, icon: Trophy, color: '#D8A0AF' },
                  { label: 'ЕГЭ', count: materials.filter((m) => m.section === 'ege').length, icon: FileCheck, color: '#A8C4E0' },
                  { label: 'Уроки', count: materials.filter((m) => m.section === 'lessons').length, icon: GraduationCap, color: '#A8C4A8' },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <item.icon size={13} color={item.color} />
                    <span style={{ flex: 1, fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#A8B8CE' }}>{item.label}</span>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: item.color }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(30,42,68,0.07)',
            borderRadius: 18,
            padding: '20px',
          }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44', marginBottom: 16 }}>
              История изменений
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { action: 'Опубликован', title: 'ЕГЭ Speaking Cards (Tasks 1–4)', user: 'Новикова Р.М.', time: '2 часа назад', type: 'publish' },
                { action: 'Обновлён', title: 'Argumentative Essay: Structure & Criteria', user: 'Петрова М.С.', time: '5 часов назад', type: 'update' },
                { action: 'Добавлен', title: 'Word Formation Bank — Advanced', user: 'Смирнова Е.В.', time: 'вчера', type: 'add' },
                { action: 'Черновик', title: 'CLIL: Art & English — Impressionism', user: 'Зайцева Л.В.', time: '3 дня назад', type: 'draft' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: item.type === 'publish' ? 'rgba(61,107,79,0.12)' :
                      item.type === 'add' ? 'rgba(30,42,68,0.08)' :
                        item.type === 'update' ? 'rgba(43,94,138,0.1)' : 'rgba(216,160,32,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.type === 'publish' ? <Eye size={12} color="#3D6B4F" /> :
                      item.type === 'add' ? <Plus size={12} color="#1E2A44" /> :
                        item.type === 'update' ? <Edit2 size={12} color="#2B5E8A" /> :
                          <FileText size={12} color="#D8A020" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#2B2F36' }}>
                      <span style={{ fontWeight: 600 }}>{item.action}:</span>{' '}
                      <span style={{ color: '#1E2A44', fontWeight: 600 }}>{item.title}</span>
                    </p>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#9CA3AF' }}>
                      {item.user} · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
