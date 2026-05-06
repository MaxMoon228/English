export interface ApiTag {
  id: number;
  key: string;
  title: string;
}

export interface ApiSection {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  active: boolean;
  subsections: ApiSubsection[];
}

export interface ApiSubsection {
  id: number;
  section: number;
  section_key: string;
  key: string;
  title: string;
  description: string;
  sort_order: number;
  active: boolean;
}

export interface ApiFile {
  id: number;
  material: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  extension: string;
  size: number;
  path: string;
  kind: string;
  uploaded_at: string;
}

export interface ApiMaterial {
  id: number;
  title: string;
  slug: string;
  section: number;
  section_key: string;
  section_title: string;
  subsection: number | null;
  subsection_key: string;
  subsection_title: string;
  type: string;
  level: string;
  grade: string;
  description_short: string;
  description_full: string;
  author: string;
  date_created: string;
  date_updated: string;
  tags: ApiTag[];
  files: ApiFile[];
  related_material_ids: number[];
  views: number;
  status: 'published' | 'draft' | 'hidden';
  cover_image: string | null;
  external_links: string[];
  featured: boolean;
  sort_order: number;
}

export interface ApiCollection {
  id: number;
  title: string;
  description: string;
  color: string;
  sort_order: number;
  tags: string[];
}

export interface ApiSkillNode {
  id: number;
  label: string;
  slug: string;
  x: number;
  y: number;
  category: 'grammar' | 'vocabulary' | 'writing' | 'culture' | 'speaking';
  goals: ('olympiad' | 'ege' | 'lesson' | 'general')[];
  progress: number;
  material_count: number;
  description: string;
  sort_order: number;
  material_ids: number[];
}

export interface ApiSkillConnection {
  id: number;
  from_node: number;
  to_node: number;
  from_node_slug: string;
  to_node_slug: string;
}

export interface ApiTextbook {
  id: number;
  title: string;
  series: string;
  author: string;
  publisher: string;
  grade: string;
  level: string;
  description: string;
  cover_color: string;
  cover_image: string | null;
  components: { id: number; title: string; kind: string; upload_path: string }[];
}

export interface ApiHistoryRecord {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  user_name: string;
  payload: Record<string, any>;
  created_at: string;
}
