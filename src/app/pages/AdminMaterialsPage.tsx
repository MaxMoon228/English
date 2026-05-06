import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { Edit2, Eye, EyeOff, Copy, Trash2, Search, Plus, Clock } from 'lucide-react';
import { api } from '../services/api';
import { mapMaterial } from '../data/viewModels';

export function AdminMaterialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.materials({ search: query || undefined, page_size: 200, status: '' as any })
      .then((response) => setItems(response.results.map((item) => mapMaterial(item as any))))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [query]);

  const remove = async (id: string) => {
    if (!window.confirm('Удалить материал?')) return;
    await api.deleteMaterial(id);
    load();
  };

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '28px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1E2A44' }}>Материалы</h1>
        <Link to="/admin/materials/new" style={{ textDecoration: 'none', backgroundColor: '#1E2A44', color: '#fff', padding: '8px 14px', borderRadius: 8, display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700 }}>
          <Plus size={14} /> Новый материал
        </Link>
      </div>
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 420 }}>
        <Search size={14} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 10, color: '#9CA3AF' }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск..." style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8, border: '1px solid rgba(30,42,68,0.15)', fontFamily: 'Manrope, sans-serif', fontSize: 13 }} />
      </div>
      <div style={{ backgroundColor: '#FFF', border: '1px solid rgba(30,42,68,0.1)', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 20, fontFamily: 'Manrope, sans-serif', color: '#8A9AB8' }}>Загрузка...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 20, fontFamily: 'Manrope, sans-serif', color: '#8A9AB8' }}>Нет материалов</div>
        ) : (
          items.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(30,42,68,0.06)' }}>
              <div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44' }}>{item.title}</div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8' }}>{item.section} · {item.level} · {item.author}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link to={`/admin/materials/${item.id}/edit`} style={iconButtonStyle}><Edit2 size={13} /></Link>
                <button onClick={() => api.duplicateMaterial(item.id).then(load)} style={iconButtonStyle}><Copy size={13} /></button>
                <button onClick={() => api.setMaterialStatus(item.id, 'published').then(load)} style={iconButtonStyle} title="Опубликовать"><Eye size={13} /></button>
                <button onClick={() => api.setMaterialStatus(item.id, 'draft').then(load)} style={iconButtonStyle} title="В черновик"><Clock size={13} /></button>
                <button onClick={() => api.setMaterialStatus(item.id, 'hidden').then(load)} style={iconButtonStyle} title="Скрыть"><EyeOff size={13} /></button>
                <button onClick={() => remove(item.id)} style={iconButtonStyle}><Trash2 size={13} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const iconButtonStyle: CSSProperties = {
  border: '1px solid rgba(30,42,68,0.12)',
  backgroundColor: '#fff',
  borderRadius: 6,
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#5A6275',
  textDecoration: 'none',
};
