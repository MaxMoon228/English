import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { mapTextbooks } from '../data/viewModels';

export function AdminTextbooksPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.textbooks({ page_size: 200 }).then((response) => setItems(mapTextbooks(response.results as any) as any[]));
  }, []);

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '28px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1E2A44', marginBottom: 16 }}>Учебники</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid rgba(30,42,68,0.1)', borderRadius: 14, padding: 14 }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44', marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8' }}>{item.author}</div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8' }}>{item.publisher}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
