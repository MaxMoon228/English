import type { ApiCollection, ApiMaterial, ApiSection, ApiSkillNode, ApiTextbook } from '../types/api';
import { API_BASE_URL } from '../lib/config';

export type UiMaterial = {
  id: string;
  numericId: number;
  title: string;
  slug: string;
  section: string;
  subsection: string;
  type: string;
  level: string;
  grade?: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  difficulty?: 1 | 2 | 3;
  files: { id?: number; name: string; type: string; size: string; path?: string }[];
  related?: string[];
  relatedNumericIds?: number[];
  views?: number;
  status?: 'published' | 'draft' | 'hidden';
};

export function mapMaterial(item: ApiMaterial): UiMaterial {
  const backendOrigin = getBackendOrigin();
  return {
    id: String(item.id),
    numericId: item.id,
    title: item.title,
    slug: item.slug,
    section: item.section_key,
    subsection: item.subsection_key,
    type: item.type,
    level: item.level,
    grade: item.grade || undefined,
    description: item.description_full || item.description_short || '',
    author: item.author,
    date: item.date_updated || item.date_created,
    tags: item.tags.map((tag) => tag.title),
    difficulty: (item.difficulty as 1 | 2 | 3 | null) || undefined,
    files: item.files.map((file) => ({
      id: file.id,
      name: file.original_name,
      type: file.extension || 'file',
      size: formatSize(file.size),
      path: toAbsolutePath(file.path, backendOrigin),
    })),
    related: item.related_material_ids.map(String),
    relatedNumericIds: item.related_material_ids,
    views: item.views,
    status: item.status,
  };
}

export function mapSections(sections: ApiSection[]) {
  return sections.map((section) => ({
    id: section.id,
    key: section.key,
    label: section.title,
    icon: section.icon,
    color: section.color || '#1E2A44',
    subsections: section.subsections.map((sub) => ({ id: sub.id, key: sub.key, label: sub.title })),
  }));
}

export function mapCollections(collections: ApiCollection[]) {
  return collections.map((item) => ({
    id: String(item.id),
    title: item.title,
    description: item.description,
    count: 0,
    tags: item.tags,
    color: item.color || '#1E2A44',
  }));
}

export function mapPopularTopics(materials: UiMaterial[]) {
  const map = new Map<string, number>();
  materials.forEach((material) => {
    material.tags.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1));
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic]) => topic);
}

export function mapTextbooks(textbooks: ApiTextbook[]) {
  return textbooks.map((book) => ({
    id: String(book.id),
    title: book.title,
    series: book.series,
    author: book.author,
    publisher: book.publisher,
    grade: book.grade,
    level: book.level,
    description: book.description,
    coverColor: book.cover_color,
    components: book.components.map((c) => c.title),
    tags: [book.series, book.publisher, `${book.grade} класс`, book.level].filter(Boolean),
    isGrif: true,
  }));
}

export function mapSkillNodes(nodes: ApiSkillNode[]) {
  return nodes.map((n) => ({
    id: n.slug,
    label: n.label,
    x: n.x,
    y: n.y,
    category: n.category,
    goals: n.goals,
    progress: n.progress,
    materialCount: n.material_count,
    description: n.description,
    materialIds: n.material_ids,
  }));
}

function formatSize(size: number) {
  if (!size) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getBackendOrigin() {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
}

function toAbsolutePath(path: string, origin: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (!origin) return path;
  if (path.startsWith('/')) return `${origin}${path}`;
  return `${origin}/${path}`;
}
