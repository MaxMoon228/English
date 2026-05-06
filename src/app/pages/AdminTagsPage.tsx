import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');

  const load = () => api.tags().then(setTags);
  useEffect(() => {
    load();
  }, []);

  const createTag = async () => {
    if (!newTag.trim()) return;
    await api.createTag({ key: newTag.toLowerCase().replace(/\s+/g, '-'), title: newTag, active: true });
    setNewTag('');
    load();
  };

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '28px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1E2A44', marginBottom: 16 }}>Теги</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, maxWidth: 420 }}>
        <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Новый тег" style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(30,42,68,0.15)', fontFamily: 'Manrope, sans-serif' }} />
        <button onClick={createTag} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', backgroundColor: '#1E2A44', color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>Добавить</button>
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid rgba(30,42,68,0.1)' }}>
        {tags.map((tag) => (
          <div key={tag.id} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(30,42,68,0.06)', fontFamily: 'Manrope, sans-serif', color: '#1E2A44', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{tag.title}</span>
            <button onClick={() => api.deleteTag(tag.id).then(load)} style={{ border: '1px solid rgba(30,42,68,0.12)', backgroundColor: '#fff', borderRadius: 6, padding: '4px 8px', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#5A6275', cursor: 'pointer' }}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
