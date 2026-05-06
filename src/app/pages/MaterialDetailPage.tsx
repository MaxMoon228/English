import { useParams, Link } from 'react-router';
import {
  ChevronRight, Download, Bookmark, Copy, ExternalLink,
  FileText, Eye, Calendar, User, Star, ArrowLeft,
  BookOpen, Mic, PenLine, BookMarked, CheckSquare
} from 'lucide-react';
import { materials, sections } from '../data/mockData';
import { useState } from 'react';
import { useEffect } from 'react';
import { api } from '../services/api';
import { mapMaterial, mapSections } from '../data/viewModels';

const typeLabel: Record<string, string> = {
  'worksheet': 'Worksheet',
  'lesson-plan': 'Lesson Plan',
  'speaking-card': 'Speaking Card',
  'grammar-task': 'Grammar',
  'writing-template': 'Writing Template',
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

function DifficultyBadge({ level }: { level?: 1 | 2 | 3 }) {
  if (!level) return null;
  const labels = { 1: 'Базовый', 2: 'Средний', 3: 'Продвинутый' };
  const colors = { 1: '#3D6B4F', 2: '#D8A020', 3: '#A9445B' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 6,
      backgroundColor: `${colors[level]}12`,
      border: `1px solid ${colors[level]}30`,
      fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700,
      color: colors[level], letterSpacing: '0.04em',
    }}>
      {[1, 2, 3].map((d) => (
        <span key={d} style={{
          width: 5, height: 5, borderRadius: '50%',
          backgroundColor: d <= level ? colors[level] : '#E5E7EB',
          display: 'inline-block',
        }} />
      ))}
      {labels[level]}
    </span>
  );
}

export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allMaterials, setAllMaterials] = useState(materials as any[]);
  const [allSections, setAllSections] = useState(sections as any[]);

  useEffect(() => {
    Promise.all([
      api.sections(),
      api.materials({ page_size: 200 }),
    ])
      .then(([sectionData, materialData]) => {
        setAllSections(mapSections(sectionData) as any[]);
        setAllMaterials(materialData.results.map((item) => mapMaterial(item as any)) as any[]);
      })
      .catch(() => {
        // fallback to existing mock data
      });
  }, []);

  const material = allMaterials.find((m) => m.id === id || (m as any).slug === id);

  if (!material) {
    return (
      <div style={{ maxWidth: 700, margin: '80px auto', padding: '0 32px', textAlign: 'center' }}>
        <FileText size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#1E2A44', marginBottom: 8 }}>
          Материал не найден
        </h2>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: '#8A9AB8', marginBottom: 24 }}>
          Возможно, материал был удалён или вы перешли по устаревшей ссылке.
        </p>
        <Link
          to="/catalog"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, backgroundColor: '#1E2A44',
            color: '#fff', textDecoration: 'none',
            fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} /> Вернуться в каталог
        </Link>
      </div>
    );
  }

  const section = allSections.find((s) => s.key === material.section);
  const subsection = section?.subsections.find((sub) => sub.key === material.subsection);
  const relatedByIds = allMaterials.filter((m: any) => (material as any).relatedNumericIds?.includes(Number(m.id)) || material.related?.includes(m.id));
  const related = (relatedByIds.length > 0 ? relatedByIds : allMaterials.filter((m) => m.id !== material.id && m.section === material.section)).slice(0, 3);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const downloadable = material.files.filter((f: any) => (f as any).path);
    if (downloadable.length === 0) {
      return;
    }
    downloadable.forEach((file: any, index: number) => {
      window.setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.path;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.download = file.name || '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 120);
    });
  };

  const whatInside: { icon: any; text: string }[] = [
    ...(material.files.some((f) => f.name.toLowerCase().includes('задани') || f.name.toLowerCase().includes('task'))
      ? [{ icon: CheckSquare, text: 'Практические задания' }] : []),
    ...(material.files.some((f) => f.name.toLowerCase().includes('ключ') || f.name.toLowerCase().includes('key') || f.name.toLowerCase().includes('ответ'))
      ? [{ icon: BookMarked, text: 'Ключи и ответы' }] : []),
    ...(material.type === 'speaking-card' ? [{ icon: Mic, text: 'Speaking prompts' }] : []),
    ...(material.type === 'writing-template' ? [{ icon: PenLine, text: 'Шаблоны и критерии' }] : []),
    ...(material.files.some((f) => f.name.toLowerCase().includes('audio') || f.type === 'zip')
      ? [{ icon: BookOpen, text: 'Аудиоматериалы' }] : []),
    ...(material.files.some((f) => f.name.toLowerCase().includes('checklist') || f.name.toLowerCase().includes('чек'))
      ? [{ icon: CheckSquare, text: 'Чек-лист' }] : []),
  ];

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

        {/* Breadcrumb */}
        <div style={{ padding: '20px 0 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Link to="/" style={{ textDecoration: 'none', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>Главная</Link>
          <ChevronRight size={12} color="#C4C9D4" />
          <Link to="/catalog" style={{ textDecoration: 'none', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>Каталог</Link>
          <ChevronRight size={12} color="#C4C9D4" />
          <Link to={`/catalog/${material.section}`} style={{ textDecoration: 'none', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>
            {section?.label}
          </Link>
          {subsection && (
            <>
              <ChevronRight size={12} color="#C4C9D4" />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#5A6275' }}>{subsection.label}</span>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, marginTop: 28 }}
          className="grid-cols-1 lg:grid-cols-[1fr_320px]">

          {/* MAIN CONTENT */}
          <div>
            {/* Type + Level badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontSize: 11,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                color: typeColor[material.type],
                backgroundColor: `${typeColor[material.type]}12`,
                padding: '4px 10px',
                borderRadius: 5,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {typeLabel[material.type]}
              </span>
              <span style={{
                fontSize: 11,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                color: '#5A6275',
                backgroundColor: '#DCE6F2',
                padding: '4px 10px',
                borderRadius: 5,
              }}>
                {material.level}
              </span>
              {material.grade && (
                <span style={{
                  fontSize: 11,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  color: '#5A6275',
                  backgroundColor: '#DCE6F2',
                  padding: '4px 10px',
                  borderRadius: 5,
                }}>
                  {material.grade} класс
                </span>
              )}
              <DifficultyBadge level={material.difficulty} />
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(22px, 3vw, 34px)',
              fontWeight: 700,
              color: '#1E2A44',
              lineHeight: 1.3,
              marginBottom: 16,
            }}>
              {material.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={13} color="#9CA3AF" />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8' }}>{material.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} color="#9CA3AF" />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8' }}>
                  {new Date(material.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={13} color="#9CA3AF" />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8' }}>{material.views} просмотров</span>
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(30,42,68,0.08)',
                borderRadius: 18,
                padding: '28px 28px',
                marginBottom: 24,
              }}
            >
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44', marginBottom: 12 }}>
                Описание
              </h2>
              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 15,
                color: '#2B2F36',
                lineHeight: 1.8,
              }}>
                {material.description}
              </p>
            </div>

            {/* What's inside */}
            {whatInside.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(30,42,68,0.08)',
                  borderRadius: 18,
                  padding: '24px 28px',
                  marginBottom: 24,
                }}
              >
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44', marginBottom: 16 }}>
                  Что внутри
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                  {whatInside.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      backgroundColor: '#F7F4EE',
                      borderRadius: 10,
                      border: '1px solid rgba(30,42,68,0.06)',
                    }}>
                      <item.icon size={14} color="#1E2A44" />
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#2B2F36', fontWeight: 500 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview area */}
            <div
              style={{
                backgroundColor: '#1E2A44',
                borderRadius: 18,
                padding: '32px',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0,
                width: '40%',
                background: 'linear-gradient(135deg, rgba(216,195,165,0.05), transparent)',
              }} />
              {/* Decorative quote mark */}
              <div style={{
                position: 'absolute', top: -10, left: 20,
                fontFamily: 'Playfair Display, serif',
                fontSize: 120, color: 'rgba(216,195,165,0.08)',
                lineHeight: 1, userSelect: 'none',
              }}>"</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#D8C3A5',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 12,
                }}>
                  Preview
                </span>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 18,
                  fontStyle: 'italic',
                  color: '#F7F4EE',
                  lineHeight: 1.6,
                  marginBottom: 16,
                  maxWidth: 480,
                }}>
                  {material.type === 'speaking-card'
                    ? '"Discuss the following topic. Give reasons and examples to support your point of view."'
                    : material.type === 'writing-template'
                      ? '"Structure your essay: Introduction → Arguments → Counter-argument → Conclusion."'
                      : '"Complete the following grammar exercise. Pay attention to the context."'}
                </p>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#6A7A8E' }}>
                  Полный материал доступен после открытия или скачивания
                </p>
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                Теги
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {material.tags.map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-block',
                    padding: '5px 12px',
                    borderRadius: 20,
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid rgba(30,42,68,0.1)',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 12,
                    color: '#5A6275',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Похожие материалы
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {related.map((rel) => (
                    <Link key={rel.id} to={`/material/${(rel as any).slug || rel.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid rgba(30,42,68,0.07)',
                        borderRadius: 12,
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#1E2A44';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,42,68,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(30,42,68,0.07)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                          backgroundColor: `${typeColor[rel.type]}12`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FileText size={16} color={typeColor[rel.type]} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600,
                            color: '#1E2A44', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {rel.title}
                          </p>
                          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#9CA3AF' }}>
                            {typeLabel[rel.type]} · {rel.level}
                          </p>
                        </div>
                        <ChevronRight size={14} color="#C4C9D4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside>
            <div
              style={{
                position: 'sticky',
                top: 88,
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(30,42,68,0.08)',
                borderRadius: 18,
                overflow: 'hidden',
              }}
            >
              {/* Files */}
              <div style={{ padding: '20px 20px 16px' }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 12 }}>
                  Файлы в материале
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {material.files.map((f) => (
                    <div
                      key={f.name}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#F7F4EE',
                        borderRadius: 10,
                        border: '1px solid rgba(30,42,68,0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 9, fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: f.type === 'pdf' ? '#A9445B' : f.type === 'zip' ? '#5B4B8A' : '#2B5E8A',
                          padding: '2px 5px', borderRadius: 3,
                          letterSpacing: '0.03em',
                        }}>
                          {f.type.toUpperCase()}
                        </span>
                        <div>
                          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: '#2B2F36' }}>{f.name}</p>
                          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, color: '#9CA3AF' }}>{f.size}</p>
                        </div>
                      </div>
                      {((f as any).path) ? (
                        <a href={(f as any).path} target="_blank" rel="noreferrer" download={f.name} style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                          <Download size={14} />
                        </a>
                      ) : (
                        <Download size={14} color="#9CA3AF" style={{ cursor: 'not-allowed', opacity: 0.5 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: 'rgba(30,42,68,0.07)' }} />

              {/* Actions */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={handleDownloadAll}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px', borderRadius: 10,
                    backgroundColor: '#1E2A44', color: '#FFFFFF', border: 'none',
                    fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', transition: 'background 0.15s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16213A')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2A44')}
                >
                  <Download size={15} />
                  Скачать всё
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    onClick={() => setSaved(!saved)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '9px', borderRadius: 8, width: '100%',
                      border: `1.5px solid ${saved ? '#D8C3A5' : 'rgba(30,42,68,0.12)'}`,
                      backgroundColor: saved ? '#FBF7EE' : '#FFFFFF',
                      color: saved ? '#9C7A3C' : '#5A6275',
                      fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Bookmark size={12} /> {saved ? 'Сохранено' : 'Сохранить'}
                  </button>
                  <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '9px', borderRadius: 8, width: '100%',
                      border: `1.5px solid ${copied ? '#A8B8A1' : 'rgba(30,42,68,0.12)'}`,
                      backgroundColor: copied ? 'rgba(168,184,161,0.1)' : '#FFFFFF',
                      color: copied ? '#3D6B4F' : '#5A6275',
                      fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Copy size={12} /> {copied ? 'Скопировано' : 'Ссылка'}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: 'rgba(30,42,68,0.07)' }} />

              {/* Metadata */}
              <div style={{ padding: '16px 20px' }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Информация
                </h3>
                {[
                  { label: 'Раздел', value: section?.label },
                  { label: 'Подраздел', value: subsection?.label },
                  { label: 'Тип', value: typeLabel[material.type] },
                  { label: 'Автор', value: material.author.split(',')[0] },
                  { label: 'Уровень', value: material.level },
                  { label: 'Обновлено', value: new Date(material.date).toLocaleDateString('ru-RU') },
                ].filter((m) => m.value).map((meta) => (
                  <div key={meta.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>{meta.label}</span>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#2B2F36', fontWeight: 500, textAlign: 'right' }}>{meta.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
