import { http } from '../lib/http';
import type {
  ApiCollection,
  ApiHistoryRecord,
  ApiMaterial,
  ApiSection,
  ApiSkillConnection,
  ApiSkillNode,
  ApiSubsection,
  ApiTag,
  ApiTextbook,
} from '../types/api';

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };
type ListResponse<T> = T[] | Paginated<T>;

function unwrapList<T>(payload: ListResponse<T>): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

function toQuery(params: Record<string, string | number | undefined | null>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  const stringified = query.toString();
  return stringified ? `?${stringified}` : '';
}

export const api = {
  ensureCsrf: () => http.get('/auth/csrf/'),
  login: (payload: { login: string; password: string }) => http.post('/auth/login/', payload),
  logout: () => http.post('/auth/logout/'),
  session: () => http.get<{ authenticated: boolean; user: { username: string } | null }>('/auth/session/'),

  sections: async () => unwrapList(await http.get<ListResponse<ApiSection>>('/sections/')),
  subsections: async () => unwrapList(await http.get<ListResponse<ApiSubsection>>('/subsections/')),
  tags: async () => unwrapList(await http.get<ListResponse<ApiTag>>('/tags/')),
  createTag: (payload: any) => http.post('/tags/', payload),
  updateTag: (id: number, payload: any) => http.put(`/tags/${id}/`, payload),
  deleteTag: (id: number) => http.delete(`/tags/${id}/`),
  collections: async () => unwrapList(await http.get<ListResponse<ApiCollection>>('/collections/')),

  materials: (params: Record<string, string | number | undefined> = {}) =>
    http.get<Paginated<ApiMaterial>>(`/materials/${toQuery(params)}`),
  material: (id: string | number) => http.get<ApiMaterial>(`/materials/${id}/`),
  createMaterial: (payload: any) => http.post<ApiMaterial>('/materials/', payload),
  updateMaterial: (id: string | number, payload: any) => http.put<ApiMaterial>(`/materials/${id}/`, payload),
  deleteMaterial: (id: string | number) => http.delete(`/materials/${id}/`),
  publishMaterial: (id: string | number) => http.post(`/materials/${id}/publish/`),
  hideMaterial: (id: string | number) => http.post(`/materials/${id}/hide/`),
  setMaterialStatus: (id: string | number, status: 'published' | 'draft' | 'hidden') =>
    http.post(`/materials/${id}/set-status/`, { status }),
  duplicateMaterial: (id: string | number) => http.post<ApiMaterial>(`/materials/${id}/duplicate/`),
  uploadMaterialFile: (id: string | number, formData: FormData) => http.post(`/materials/${id}/upload-file/`, formData),
  deleteMaterialFile: (id: string | number, fileId: number) => http.delete(`/materials/${id}/files/${fileId}/`),

  uploads: () => http.get<Paginated<any>>('/uploads/'),
  uploadAsset: (formData: FormData) => http.post('/uploads/', formData),
  deleteUpload: (id: number) => http.delete(`/uploads/${id}/`),

  dashboardStats: () => http.get<any>('/dashboard/stats/'),
  textbooks: (params: Record<string, string | number | undefined> = {}) =>
    http.get<Paginated<ApiTextbook>>(`/textbooks/${toQuery(params)}`),
  createTextbook: (payload: any) => http.post('/textbooks/', payload),
  updateTextbook: (id: number, payload: any) => http.put(`/textbooks/${id}/`, payload),
  deleteTextbook: (id: number) => http.delete(`/textbooks/${id}/`),

  skillNodes: (goal: string = 'all') => http.get<Paginated<ApiSkillNode>>(`/skill-nodes/${toQuery({ goal })}`),
  skillConnections: () => http.get<Paginated<ApiSkillConnection>>('/skill-connections/'),

  history: () => http.get<Paginated<ApiHistoryRecord>>('/history/'),
};
