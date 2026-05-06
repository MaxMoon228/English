import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router';
import {
  Search, BookOpen, Trophy, FileCheck, GraduationCap,
  ChevronRight, ChevronDown, Filter, Grid3X3, List,
  FileText, Download, Copy, Bookmark, ExternalLink,
  Star, Eye, SortAsc, X, Mic, PenLine
} from 'lucide-react';
import { materials as mockMaterials, sections as mockSections, Material, SectionKey, SubsectionKey } from '../data/mockData';
import { api } from '../services/api';
import { mapMaterial, mapSections } from '../data/viewModels';

const typeLabel: Record<string, string> = {
  'worksheet': 'Worksheet',
  'lesson-plan': 'Lesson Plan',
  'speaking-card': 'Speaking Card',
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

const sectionIcons: Record<string, any> = {
  textbooks: BookOpen,
  olympiads: Trophy,
  ege: FileCheck,
  lessons: GraduationCap,
};

function DifficultyDots({ level }: { level?: 1 | 2 | 3 }) {
  if (!level) return null;
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3].map((d) => (
        <span key={d} style={{
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: d <= level ? '#A9445B' : '#E5E7EB',
          display: 'inline-block',
          transition: 'background 0.15s',
        }} />
      ))}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  return (
    <span style={{
      fontSize: 10,
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      color: '#FFFFFF',
      backgroundColor: type === 'pdf' ? '#A9445B' : type === 'zip' ? '#5B4B8A' : '#2B5E8A',
      padding: '2px 5px',
      borderRadius: 3,
      letterSpacing: '0.03em',
    }}>
      {type.toUpperCase()}
    </span>
  );
}

export function CatalogPage() {
  const { section, subsection } = useParams<{ section?: SectionKey; subsection?: SubsectionKey }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sections, setSections] = useState<any[]>(mockSections);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials as any);
  const [activeSection, setActiveSection] = useState<SectionKey>(section || 'olympiads');
  const [activeSubsection, setActiveSubsection] = useState<SubsectionKey | null>(subsection || null);
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set([section || 'olympiads']));
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
  const requestIdRef = useRef(0);

  useEffect(() => {
    api.sections()
      .then((list) => setSections(mapSections(list) as any))
      .catch(() => setSections(mockSections as any));
  }, []);

  useEffect(() => {
    setActiveSection((section as SectionKey) || 'olympiads');
    setActiveSubsection((subsection as SubsectionKey) || null);
    setExpandedSections(new Set([(section as SectionKey) || 'olympiads']));
  }, [section, subsection]);

  useEffect(() => {
    const filters = activeFilters.reduce<Record<string, string>>((acc, key) => {
      if (key === 'difficulty-3') acc.difficulty = '3';
      if (key === 'speaking') acc.type = 'speaking-card';
      if (key === 'writing') acc.type = 'writing-template';
      return acc;
    }, {});

    const requestId = ++requestIdRef.current;
    api.materials({
      section: activeSection,
      subsection: activeSubsection || undefined,
      search: searchQuery || undefined,
      ordering: sort === 'newest' ? '-date_updated' : sort === 'oldest' ? 'date_updated' : sort === 'alphabetical' ? 'title' : sort === 'most-viewed' ? '-views' : undefined,
      ...filters,
      page_size: 100,
    })
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        const mapped = response.results.map((item) => mapMaterial(item as any)) as any;
        setMaterials(mapped);
        if (mapped.length > 0 && (!selectedMaterial || !mapped.find((m: any) => m.id === selectedMaterial.id))) {
          setSelectedMaterial(mapped[0]);
        } else if (mapped.length === 0) {
          setSelectedMaterial(null);
        }
      })
      .catch(() => {
        // fallback to current filtered local state
      });
  }, [activeSection, activeSubsection, searchQuery, activeFilters, sort]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (searchQuery) next.set('query', searchQuery);
    else next.delete('query');
    if (sort && sort !== 'relevance') next.set('sort', sort);
    else next.delete('sort');
    setSearchParams(next, { replace: true });
  }, [searchQuery, sort]);

  const resetFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setSort('relevance');
    setActiveSubsection(null);
    setSelectedMaterial(null);
    setSearchParams(new URLSearchParams(), { replace: true });
    navigate(`/catalog/${activeSection}`);
  };

  const currentSection = sections.find((s) => s.key === activeSection);

  const filtered = useMemo(() => {
    let result = materials.filter((m) => {
      if (m.section !== activeSection) return false;
      if (activeSubsection && m.subsection !== activeSubsection) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
    if (activeFilters.includes('difficulty-3')) result = result.filter((m) => m.difficulty === 3);
    if (activeFilters.includes('speaking')) result = result.filter((m) => m.type === 'speaking-card');
    if (activeFilters.includes('writing')) result = result.filter((m) => m.type === 'writing-template');
    return result;
  }, [materials, activeSection, activeSubsection, searchQuery, activeFilters]);

  const toggleSection = (key: SectionKey) => {
    const next = new Set(expandedSections);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedSections(next);
  };

  const handleSectionClick = (key: SectionKey) => {
    setActiveSection(key);
    setActiveSubsection(null);
    if (!expandedSections.has(key)) toggleSection(key);
    setSelectedMaterial(null);
    navigate(`/catalog/${key}`);
  };

  const filterChips = [
    { key: 'difficulty-3', label: 'Высокая сложность' },
    { key: 'speaking', label: 'Speaking' },
    { key: 'writing', label: 'Writing' },
  ];

  const downloadSelectedMaterial = () => {
    if (!selectedMaterial) return;
    const firstFile = (selectedMaterial.files || []).find((file: any) => !!file.path);
    if (!firstFile || !(firstFile as any).path) return;
    const link = document.createElement('a');
    link.href = (firstFile as any).path;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.download = firstFile.name || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: 0, minHeight: 'calc(100vh - 64px)' }}>

          {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
          <aside
            style={{
              borderRight: '1px solid rgba(30,42,68,0.08)',
              padding: '28px 0 28px',
              position: 'sticky',
              top: 64,
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '0 16px 16px' }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
              }}>
                Разделы платформы
              </span>
            </div>

            {sections.map((sec) => {
              const Icon = sectionIcons[sec.key];
              const isExpanded = expandedSections.has(sec.key);
              const isActiveSection = activeSection === sec.key;

              return (
                <div key={sec.key}>
                  <button
                    onClick={() => {
                      handleSectionClick(sec.key);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      background: isActiveSection ? `${sec.color}0D` : 'transparent',
                      border: 'none',
                      borderLeft: isActiveSection ? `2.5px solid ${sec.color}` : '2.5px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={15} color={isActiveSection ? sec.color : '#9CA3AF'} />
                    <span style={{
                      flex: 1,
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 13,
                      fontWeight: isActiveSection ? 700 : 500,
                      color: isActiveSection ? sec.color : '#5A6275',
                    }}>
                      {sec.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSection(sec.key); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#9CA3AF' }}
                    >
                      {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                  </button>

                  {isExpanded && (
                    <div style={{ paddingLeft: 8 }}>
                      {sec.subsections.map((sub) => {
                        const isActiveSub = activeSubsection === sub.key;
                        return (
                          <button
                            key={sub.key}
                            onClick={() => {
                              setActiveSection(sec.key);
                              setActiveSubsection(isActiveSub ? null : sub.key);
                              setSelectedMaterial(null);
                              navigate(isActiveSub ? `/catalog/${sec.key}` : `/catalog/${sec.key}/${sub.key}`);
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '7px 16px 7px 24px',
                              background: isActiveSub ? `${sec.color}08` : 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s',
                            }}
                          >
                            <span style={{
                              width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                              backgroundColor: isActiveSub ? sec.color : '#D1D5DB',
                            }} />
                            <span style={{
                              fontFamily: 'Manrope, sans-serif',
                              fontSize: 12,
                              fontWeight: isActiveSub ? 600 : 400,
                              color: isActiveSub ? sec.color : '#8A9AB8',
                              lineHeight: 1.4,
                            }}>
                              {sub.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Divider */}
            <div style={{ margin: '20px 16px', height: 1, backgroundColor: 'rgba(30,42,68,0.08)' }} />

            {/* Language tags */}
            <div style={{ padding: '0 16px' }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
                display: 'block',
                marginBottom: 10,
              }}>
                Skill tags
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Grammar', 'Writing', 'Speaking', 'Reading', 'Listening', 'Culture'].map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: 4,
                    backgroundColor: '#F0F4F9',
                    border: '1px solid rgba(30,42,68,0.08)',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#5A6275',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* ── CENTER COLUMN ────────────────────────────────────────── */}
          <main style={{ padding: '28px 24px', borderRight: '1px solid rgba(30,42,68,0.08)', minWidth: 0 }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Link to="/" style={{ textDecoration: 'none', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>Главная</Link>
                <ChevronRight size={12} color="#C4C9D4" />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#5A6275' }}>{currentSection?.label}</span>
                {activeSubsection && (
                  <>
                    <ChevronRight size={12} color="#C4C9D4" />
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#1E2A44', fontWeight: 600 }}>
                      {currentSection?.subsections.find((s) => s.key === activeSubsection)?.label}
                    </span>
                  </>
                )}
              </div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 26,
                fontWeight: 600,
                color: '#1E2A44',
                marginBottom: 4,
              }}>
                {activeSubsection
                  ? currentSection?.subsections.find((s) => s.key === activeSubsection)?.label
                  : currentSection?.label}
              </h1>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8' }}>
                {filtered.length} материалов
                {activeSection === 'olympiads' && ' · Олимпиадные задания и подготовительные материалы'}
                {activeSection === 'ege' && ' · Практические материалы формата ЕГЭ'}
                {activeSection === 'lessons' && ' · Методические материалы для учителей'}
                {activeSection === 'textbooks' && ' · Грифованные учебники для общеобразовательных организаций'}
              </p>
            </div>

            {/* Search + controls */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск в разделе..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: 10,
                    border: '1.5px solid rgba(30,42,68,0.12)',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 13,
                    color: '#2B2F36',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1.5px solid rgba(30,42,68,0.12)',
                    backgroundColor: '#FFFFFF',
                    color: '#5A6275',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 12,
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-viewed">Most viewed</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <button
                  onClick={() => setViewMode('cards')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: `1.5px solid ${viewMode === 'cards' ? '#1E2A44' : 'rgba(30,42,68,0.12)'}`,
                    backgroundColor: viewMode === 'cards' ? '#1E2A44' : '#FFFFFF',
                    color: viewMode === 'cards' ? '#FFFFFF' : '#9CA3AF',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <Grid3X3 size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: `1.5px solid ${viewMode === 'list' ? '#1E2A44' : 'rgba(30,42,68,0.12)'}`,
                    backgroundColor: viewMode === 'list' ? '#1E2A44' : '#FFFFFF',
                    color: viewMode === 'list' ? '#FFFFFF' : '#9CA3AF',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              {filterChips.map((chip) => {
                const isActive = activeFilters.includes(chip.key);
                return (
                  <button
                    key={chip.key}
                    onClick={() => {
                      setActiveFilters(isActive
                        ? activeFilters.filter((f) => f !== chip.key)
                        : [...activeFilters, chip.key]
                      );
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '5px 12px',
                      borderRadius: 20,
                      border: `1.5px solid ${isActive ? '#1E2A44' : 'rgba(30,42,68,0.12)'}`,
                      backgroundColor: isActive ? '#1E2A44' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#5A6275',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Filter size={10} />
                    {chip.label}
                    {isActive && <X size={10} />}
                  </button>
                );
              })}
              {(activeFilters.length > 0 || !!searchQuery || sort !== 'relevance' || !!activeSubsection) && (
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: '1.5px solid rgba(169,68,91,0.25)',
                    backgroundColor: 'rgba(169,68,91,0.06)',
                    color: '#A9445B',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Сбросить
                </button>
              )}
            </div>

            {/* Materials */}
            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                border: '1.5px dashed rgba(30,42,68,0.12)',
              }}>
                <FileText size={40} color="#D1D5DB" style={{ marginBottom: 12 }} />
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 16, color: '#5A6275', marginBottom: 6 }}>
                  Материалы не найдены
                </h3>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#9CA3AF' }}>
                  Попробуйте изменить запрос или сбросить фильтры
                </p>
              </div>
            ) : viewMode === 'cards' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {filtered.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: `1.5px solid ${selectedMaterial?.id === mat.id ? '#1E2A44' : 'rgba(30,42,68,0.07)'}`,
                      borderRadius: 16,
                      padding: '18px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,42,68,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 10,
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 700,
                        color: typeColor[mat.type] || '#5A6275',
                        backgroundColor: `${typeColor[mat.type]}12`,
                        padding: '2px 7px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {typeLabel[mat.type]}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        color: '#8A9AB8',
                        backgroundColor: '#F0F4F9',
                        padding: '2px 7px',
                        borderRadius: 4,
                      }}>
                        {mat.level}
                      </span>
                      <DifficultyDots level={mat.difficulty} />
                    </div>
                    <h3 style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#1E2A44',
                      marginBottom: 6,
                      lineHeight: 1.4,
                    }}>
                      {mat.title}
                    </h3>
                    <p style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 12,
                      color: '#8A9AB8',
                      lineHeight: 1.5,
                      marginBottom: 12,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {mat.description}
                    </p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                      {mat.files.map((f) => (
                        <FileIcon key={f.name} type={f.type} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#9CA3AF', fontFamily: 'Manrope, sans-serif' }}>
                      <span>{mat.author.split(',')[0]}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Eye size={11} /> {mat.views}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: `1.5px solid ${selectedMaterial?.id === mat.id ? '#1E2A44' : 'rgba(30,42,68,0.07)'}`,
                      borderRadius: 12,
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        backgroundColor: `${typeColor[mat.type]}12`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <FileText size={18} color={typeColor[mat.type]} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                        <span style={{
                          fontSize: 10,
                          fontFamily: 'Manrope, sans-serif',
                          fontWeight: 700,
                          color: typeColor[mat.type],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {typeLabel[mat.type]}
                        </span>
                        <span style={{ fontSize: 10, fontFamily: 'Manrope, sans-serif', color: '#9CA3AF' }}>{mat.level}</span>
                        <DifficultyDots level={mat.difficulty} />
                      </div>
                      <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600, color: '#1E2A44', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {mat.title}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {mat.files.slice(0, 2).map((f) => <FileIcon key={f.name} type={f.type} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
          <aside
            style={{
              padding: '28px 20px',
              position: 'sticky',
              top: 64,
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
            }}
          >
            {selectedMaterial ? (
              <div>
                {/* Header */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 10,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      color: typeColor[selectedMaterial.type],
                      backgroundColor: `${typeColor[selectedMaterial.type]}12`,
                      padding: '2px 7px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {typeLabel[selectedMaterial.type]}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      color: '#8A9AB8',
                      backgroundColor: '#F0F4F9',
                      padding: '2px 7px',
                      borderRadius: 4,
                    }}>
                      {selectedMaterial.level}
                    </span>
                    <DifficultyDots level={selectedMaterial.difficulty} />
                  </div>
                  <h2 style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#1E2A44',
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}>
                    {selectedMaterial.title}
                  </h2>
                  <p style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 12,
                    color: '#8A9AB8',
                    lineHeight: 1.6,
                  }}>
                    {selectedMaterial.description}
                  </p>
                </div>

                {/* Metadata */}
                <div style={{
                  backgroundColor: '#F7F4EE',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 16,
                }}>
                  {[
                    { label: 'Автор', value: selectedMaterial.author },
                    { label: 'Дата', value: new Date(selectedMaterial.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'Уровень', value: selectedMaterial.level },
                    ...(selectedMaterial.grade ? [{ label: 'Класс', value: `${selectedMaterial.grade} класс` }] : []),
                  ].map((meta) => (
                    <div key={meta.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{meta.label}</span>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#2B2F36', fontWeight: 500, textAlign: 'right' }}>{meta.value}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Теги
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {selectedMaterial.tags.map((tag) => (
                      <span key={tag} style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        backgroundColor: '#F0F4F9',
                        border: '1px solid rgba(30,42,68,0.08)',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: 11,
                        color: '#5A6275',
                        fontWeight: 500,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Files */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Файлы
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedMaterial.files.map((f) => (
                      <div key={f.name} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        border: '1.5px solid rgba(30,42,68,0.08)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FileIcon type={f.type} />
                          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#2B2F36', fontWeight: 500 }}>{f.name}</span>
                        </div>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#9CA3AF' }}>{f.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link
                    to={`/material/${(selectedMaterial as any).slug || selectedMaterial.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px',
                      borderRadius: 10,
                      backgroundColor: '#1E2A44',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 13,
                      fontWeight: 700,
                      transition: 'background 0.15s',
                    }}
                  >
                    <ExternalLink size={14} />
                    Открыть материал
                  </Link>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <button
                      onClick={downloadSelectedMaterial}
                      disabled={!selectedMaterial?.files?.some((file: any) => !!file.path)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '8px', borderRadius: 8,
                        border: '1.5px solid rgba(30,42,68,0.12)',
                        backgroundColor: '#FFFFFF', color: '#5A6275',
                        fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600,
                        cursor: selectedMaterial?.files?.some((file: any) => !!file.path) ? 'pointer' : 'not-allowed',
                        opacity: selectedMaterial?.files?.some((file: any) => !!file.path) ? 1 : 0.6,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Download size={12} /> Скачать
                    </button>
                    <button
                      onClick={() => setSaved((prev) => {
                        const next = new Set(prev);
                        if (next.has(selectedMaterial.id)) next.delete(selectedMaterial.id);
                        else next.add(selectedMaterial.id);
                        return next;
                      })}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '8px', borderRadius: 8,
                        border: `1.5px solid ${saved.has(selectedMaterial.id) ? '#D8C3A5' : 'rgba(30,42,68,0.12)'}`,
                        backgroundColor: saved.has(selectedMaterial.id) ? '#FBF7EE' : '#FFFFFF',
                        color: saved.has(selectedMaterial.id) ? '#9C7A3C' : '#5A6275',
                        fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <Bookmark size={12} /> {saved.has(selectedMaterial.id) ? 'Сохранено' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 16px',
                color: '#9CA3AF',
              }}>
                <div style={{
                  width: 48, height: 48,
                  backgroundColor: '#F0F4F9',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <FileText size={22} color="#C4C9D4" />
                </div>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600, color: '#5A6275', marginBottom: 6 }}>
                  Выберите материал
                </p>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                  Нажмите на карточку слева, чтобы увидеть детали и действия
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
