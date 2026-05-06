import { useEffect, useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export function AdminUploadsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = () => api.uploads().then((response) => setItems(response.results));

  useEffect(() => {
    load();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      form.append('original_name', file.name);
      await api.uploadAsset(form);
    }
    setUploading(false);
    load();
  };

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '28px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1E2A44', marginBottom: 16 }}>Загрузки</h1>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#1E2A44', color: '#fff', borderRadius: 8, padding: '8px 14px', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
        <Upload size={14} /> {uploading ? 'Загрузка...' : 'Загрузить файлы'}
        <input type="file" multiple style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
      </label>
      <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid rgba(30,42,68,0.1)' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 14px', borderBottom: '1px solid rgba(30,42,68,0.06)', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#1E2A44' }}>{item.original_name}</div>
            <button onClick={() => api.deleteUpload(item.id).then(load)} style={{ border: '1px solid rgba(30,42,68,0.12)', backgroundColor: '#fff', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5A6275' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
