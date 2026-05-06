import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Trophy, FileCheck, GraduationCap, BookOpen, ArrowRight, Info, X } from 'lucide-react';
import { skillNodes as mockSkillNodes, skillConnections as mockSkillConnections, materials as mockMaterials, SkillNode } from '../data/mockData';
import { api } from '../services/api';
import { mapMaterial, mapSkillNodes } from '../data/viewModels';

type GoalFilter = 'all' | 'olympiad' | 'ege' | 'lesson' | 'general';

const categoryColors: Record<string, string> = {
  grammar: '#1E3A5F',
  vocabulary: '#5B4B8A',
  writing: '#2B5E8A',
  culture: '#7C5C3A',
  speaking: '#3D6B4F',
};

const categoryLabels: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  writing: 'Writing',
  culture: 'Culture',
  speaking: 'Speaking',
};

const goalFilters: { key: GoalFilter; label: string; icon: any; color: string }[] = [
  { key: 'all', label: 'Все навыки', icon: BookOpen, color: '#1E2A44' },
  { key: 'olympiad', label: 'Олимпиада', icon: Trophy, color: '#A9445B' },
  { key: 'ege', label: 'ЕГЭ', icon: FileCheck, color: '#2B5E8A' },
  { key: 'lesson', label: 'Урок', icon: GraduationCap, color: '#3D6B4F' },
];

function ProgressRing({ cx, cy, r, progress, color }: { cx: number; cy: number; r: number; progress: number; color: string }) {
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  return (
    <circle
      cx={cx} cy={cy} r={r}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeDasharray={`${dash} ${circ}`}
      strokeLinecap="round"
      transform={`rotate(-90 ${cx} ${cy})`}
      opacity="0.8"
    />
  );
}

export function SkillMapPage() {
  const [skillNodes, setSkillNodes] = useState<any[]>(mockSkillNodes as any[]);
  const [skillConnections, setSkillConnections] = useState<[string, string][]>(mockSkillConnections as any);
  const [materials, setMaterials] = useState<any[]>(mockMaterials as any[]);
  const [activeGoal, setActiveGoal] = useState<GoalFilter>('all');
  useEffect(() => {
    Promise.all([api.skillNodes('all'), api.skillConnections(), api.materials({ page_size: 200 })])
      .then(([nodesResponse, connectionsResponse, materialsResponse]) => {
        const nodes = mapSkillNodes(nodesResponse.results as any) as any[];
        setSkillNodes(nodes);
        setSkillConnections(connectionsResponse.results.map((connection: any) => [connection.from_node_slug, connection.to_node_slug]));
        setMaterials(materialsResponse.results.map((material) => mapMaterial(material as any)) as any[]);
      })
      .catch(() => {
        // fallback to mock remains
      });
  }, []);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const isNodeActive = (node: SkillNode) => {
    if (activeGoal === 'all') return true;
    return node.goals.includes(activeGoal);
  };

  const isConnectionActive = (a: string, b: string) => {
    const nodeA = skillNodes.find((n) => n.id === a);
    const nodeB = skillNodes.find((n) => n.id === b);
    return nodeA && nodeB && isNodeActive(nodeA) && isNodeActive(nodeB);
  };

  const relatedMaterials = selectedNode
    ? materials.filter((m: any) => {
      const tags = m.tags.map((t: string) => t.toLowerCase());
      const label = selectedNode.label.toLowerCase();
      const linkedByNode = (selectedNode as any).materialIds?.includes(Number(m.id));
      return linkedByNode || tags.some((t: string) => t.includes(label) || label.includes(t));
    }).slice(0, 4)
    : [];

  const svgWidth = 920;
  const svgHeight = 520;

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: 'calc(100vh - 64px)', paddingBottom: 80 }}>

      {/* Page header */}
      <div style={{
        backgroundColor: '#1E2A44',
        padding: '40px 0 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative quote */}
        <div style={{
          position: 'absolute', top: -20, right: '5%',
          fontFamily: 'Playfair Display, serif',
          fontSize: 160, color: 'rgba(216,195,165,0.06)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>"</div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 10,
              fontWeight: 700,
              color: '#D8C3A5',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Killer Feature
            </span>
            <span style={{ color: '#D8C3A5', opacity: 0.5 }}>·</span>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 10,
              fontWeight: 600,
              color: '#6A7A8E',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Interactive Learning Map
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            color: '#F7F4EE',
            lineHeight: 1.2,
            marginBottom: 12,
          }}>
            Skill Map Navigator
          </h1>
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 16,
            color: '#8A9AB8',
            maxWidth: 560,
            lineHeight: 1.7,
          }}>
            Интерактивная карта языковых навыков. Нажмите на узел, чтобы увидеть связанные материалы, прогресс и путь изучения.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* Goal filters */}
        <div style={{
          display: 'flex', gap: 8, padding: '24px 0 32px', flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8', marginRight: 4 }}>
            Фильтр по цели:
          </span>
          {goalFilters.map((gf) => {
            const isActive = activeGoal === gf.key;
            return (
              <button
                key={gf.key}
                onClick={() => setActiveGoal(gf.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 18px',
                  borderRadius: 20,
                  border: `1.5px solid ${isActive ? gf.color : 'rgba(30,42,68,0.12)'}`,
                  backgroundColor: isActive ? gf.color : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#5A6275',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? `0 4px 12px ${gf.color}30` : 'none',
                }}
              >
                <gf.icon size={13} />
                {gf.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* SVG SKILL MAP */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(30,42,68,0.08)',
              borderRadius: 22,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Legend */}
            <div style={{
              display: 'flex', gap: 16, padding: '16px 24px',
              borderBottom: '1px solid rgba(30,42,68,0.06)',
              flexWrap: 'wrap',
            }}>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: categoryColors[key] }} />
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#8A9AB8', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 2, borderTop: '2px dashed rgba(30,42,68,0.2)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#8A9AB8' }}>Связи</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                style={{ width: '100%', minWidth: 600, display: 'block' }}
              >
                {/* Background subtle pattern */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30,42,68,0.03)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

                {/* Connections */}
                {skillConnections.map(([a, b]) => {
                  const nodeA = skillNodes.find((n) => n.id === a);
                  const nodeB = skillNodes.find((n) => n.id === b);
                  if (!nodeA || !nodeB) return null;
                  const active = isConnectionActive(a, b);
                  const isHighlighted = (hoveredNode === a || hoveredNode === b) && active;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={nodeA.x} y1={nodeA.y}
                      x2={nodeB.x} y2={nodeB.y}
                      stroke={isHighlighted ? '#D8C3A5' : active ? 'rgba(30,42,68,0.18)' : 'rgba(30,42,68,0.05)'}
                      strokeWidth={isHighlighted ? 2 : 1.5}
                      strokeDasharray={active ? 'none' : '4 4'}
                      style={{ transition: 'all 0.3s' }}
                    />
                  );
                })}

                {/* Nodes */}
                {skillNodes.map((node) => {
                  const active = isNodeActive(node);
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode?.id === node.id;
                  const color = categoryColors[node.category];
                  const nodeR = 26;

                  return (
                    <g
                      key={node.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                    >
                      {/* Glow effect when hovered */}
                      {(isHovered || isSelected) && active && (
                        <circle
                          cx={node.x} cy={node.y}
                          r={nodeR + 8}
                          fill={`${color}15`}
                          style={{ transition: 'all 0.2s' }}
                        />
                      )}

                      {/* Node background */}
                      <circle
                        cx={node.x} cy={node.y}
                        r={nodeR}
                        fill={active ? color : '#E5E7EB'}
                        stroke={isSelected ? '#D8C3A5' : active ? `${color}40` : '#D1D5DB'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        style={{ transition: 'all 0.2s', filter: active ? undefined : 'grayscale(100%)' }}
                      />

                      {/* Progress ring */}
                      {active && (
                        <ProgressRing
                          cx={node.x} cy={node.y}
                          r={nodeR + 5}
                          progress={node.progress}
                          color={color}
                        />
                      )}

                      {/* Node label (short) */}
                      <text
                        x={node.x} y={node.y - 4}
                        textAnchor="middle"
                        fill={active ? 'rgba(247,244,238,0.95)' : '#9CA3AF'}
                        fontSize="8.5"
                        fontFamily="Manrope, sans-serif"
                        fontWeight="700"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {node.label.split(' ')[0]}
                      </text>
                      {node.label.split(' ')[1] && (
                        <text
                          x={node.x} y={node.y + 7}
                          textAnchor="middle"
                          fill={active ? 'rgba(247,244,238,0.9)' : '#9CA3AF'}
                          fontSize="7"
                          fontFamily="Manrope, sans-serif"
                          fontWeight="600"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {node.label.split(' ').slice(1).join(' ')}
                        </text>
                      )}

                      {/* Progress % */}
                      {active && (
                        <text
                          x={node.x} y={node.y + 20}
                          textAnchor="middle"
                          fill="rgba(216,195,165,0.9)"
                          fontSize="7"
                          fontFamily="Manrope, sans-serif"
                          fontWeight="700"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {node.progress}%
                        </text>
                      )}

                      {/* Tooltip on hover */}
                      {isHovered && active && (
                        <g>
                          <rect
                            x={node.x - 55} y={node.y - nodeR - 36}
                            width={110} height={28}
                            rx={6}
                            fill="#1E2A44"
                          />
                          <text
                            x={node.x} y={node.y - nodeR - 16}
                            textAnchor="middle"
                            fill="#F7F4EE"
                            fontSize="9"
                            fontFamily="Manrope, sans-serif"
                            fontWeight="600"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >
                            {node.materialCount} материалов
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Progress summary */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid rgba(30,42,68,0.06)',
              display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>
                Средний прогресс по навыкам:
              </span>
              {Object.entries(categoryLabels).map(([cat, label]) => {
                const nodes = skillNodes.filter((n) => n.category === cat && (activeGoal === 'all' || n.goals.includes(activeGoal)));
                if (nodes.length === 0) return null;
                const avg = Math.round(nodes.reduce((s, n) => s + n.progress, 0) / nodes.length);
                return (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: categoryColors[cat] }} />
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#5A6275', fontWeight: 600 }}>{label}:</span>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: categoryColors[cat], fontWeight: 700 }}>{avg}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDE PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Selected node info */}
            {selectedNode ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(30,42,68,0.08)',
                  borderRadius: 18,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '18px 20px',
                    backgroundColor: categoryColors[selectedNode.category],
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() => setSelectedNode(null)}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(255,255,255,0.15)', border: 'none',
                      borderRadius: 6, padding: 5, cursor: 'pointer',
                      color: '#FFFFFF', display: 'flex', alignItems: 'center',
                    }}
                  >
                    <X size={12} />
                  </button>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      {categoryLabels[selectedNode.category]}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600,
                    color: '#FFFFFF', marginBottom: 4,
                  }}>
                    {selectedNode.label}
                  </h3>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {selectedNode.description}
                  </p>
                </div>

                <div style={{ padding: '16px 20px' }}>
                  {/* Progress */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8' }}>Прогресс</span>
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: categoryColors[selectedNode.category] }}>
                        {selectedNode.progress}%
                      </span>
                    </div>
                    <div style={{ height: 6, backgroundColor: '#F0F4F9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${selectedNode.progress}%`,
                        backgroundColor: categoryColors[selectedNode.category],
                        borderRadius: 3,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>

                  {/* Goals */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Подходит для
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {selectedNode.goals.map((g) => {
                        const gf = goalFilters.find((f) => f.key === g);
                        return gf ? (
                          <span key={g} style={{
                            padding: '3px 8px', borderRadius: 4,
                            backgroundColor: `${gf.color}10`,
                            border: `1px solid ${gf.color}25`,
                            fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 600,
                            color: gf.color,
                          }}>
                            {gf.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Materials count */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px', backgroundColor: '#F7F4EE', borderRadius: 10, marginBottom: 16,
                  }}>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#5A6275' }}>Материалов</span>
                    <span style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 800,
                      color: categoryColors[selectedNode.category],
                    }}>
                      {selectedNode.materialCount}
                    </span>
                  </div>

                  {/* Related materials */}
                  {relatedMaterials.length > 0 && (
                    <div>
                      <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Материалы
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {relatedMaterials.map((m) => (
                          <Link key={m.id} to={`/material/${(m as any).slug || m.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                              padding: '9px 12px',
                              backgroundColor: '#F7F4EE',
                              borderRadius: 8,
                              border: '1px solid rgba(30,42,68,0.06)',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              transition: 'all 0.15s',
                            }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#EDF2F8';
                                e.currentTarget.style.borderColor = 'rgba(30,42,68,0.12)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#F7F4EE';
                                e.currentTarget.style.borderColor = 'rgba(30,42,68,0.06)';
                              }}
                            >
                              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#2B2F36', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                {m.title}
                              </span>
                              <ArrowRight size={12} color="#C4C9D4" style={{ flexShrink: 0, marginLeft: 6 }} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to="/catalog"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      marginTop: 14, padding: '9px', borderRadius: 8,
                      border: `1.5px solid ${categoryColors[selectedNode.category]}30`,
                      backgroundColor: `${categoryColors[selectedNode.category]}08`,
                      color: categoryColors[selectedNode.category],
                      textDecoration: 'none',
                      fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700,
                      transition: 'all 0.15s',
                    }}
                  >
                    Все материалы по теме <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(30,42,68,0.08)',
                borderRadius: 18,
                padding: '28px 20px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  backgroundColor: '#F7F4EE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  <Info size={22} color="#C4C9D4" />
                </div>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600, color: '#5A6275', marginBottom: 6 }}>
                  Выберите навык
                </p>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>
                  Нажмите на любой узел карты, чтобы увидеть детали, прогресс и связанные материалы
                </p>
              </div>
            )}

            {/* Quick stats */}
            <div style={{
              backgroundColor: '#1E2A44',
              borderRadius: 18,
              padding: '20px',
            }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#D8C3A5', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                Общий прогресс
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {skillNodes
                  .filter((n) => activeGoal === 'all' || n.goals.includes(activeGoal))
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 5)
                  .map((node) => (
                    <div key={node.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#A8B8CE' }}>{node.label}</span>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#D8C3A5' }}>{node.progress}%</span>
                      </div>
                      <div style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${node.progress}%`,
                          backgroundColor: categoryColors[node.category],
                          borderRadius: 2,
                          opacity: 0.9,
                        }} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Learning path hint */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(30,42,68,0.08)',
              borderRadius: 18,
              padding: '20px',
            }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                Рекомендованный путь
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Tenses', 'Passive Voice', 'Word Formation', 'Linking Devices', 'Essay Structure'].map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: i < 2 ? '#A8B8A1' : '#F0F4F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800, fontFamily: 'Manrope, sans-serif',
                      color: i < 2 ? '#3D6B4F' : '#9CA3AF',
                    }}>
                      {i < 2 ? '✓' : i + 1}
                    </div>
                    <span style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: 12,
                      color: i < 2 ? '#3D6B4F' : '#2B2F36',
                      fontWeight: i < 2 ? 600 : 500,
                      textDecoration: i < 2 ? 'none' : 'none',
                    }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
