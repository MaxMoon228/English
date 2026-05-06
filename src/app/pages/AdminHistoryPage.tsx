import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function AdminHistoryPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    api.history().then((response) => setRecords(response.results)).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '28px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1E2A44', marginBottom: 16 }}>История изменений</h1>
      <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid rgba(30,42,68,0.1)' }}>
        {records.length === 0 ? (
          <div style={{ padding: 16, fontFamily: 'Manrope, sans-serif', color: '#8A9AB8' }}>Нет записей</div>
        ) : (
          records.map((record) => (
            <div key={record.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,42,68,0.06)' }}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44' }}>{record.action}</div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8' }}>
                {record.user_name} · {new Date(record.created_at).toLocaleString('ru-RU')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
