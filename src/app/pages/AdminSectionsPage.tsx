import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function AdminSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    api.sections().then(setSections);
  }, []);

  return (
    <div style={{ backgroundColor: '#F7F4EE', minHeight: '100vh', padding: '28px 32px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1E2A44', marginBottom: 16 }}>Разделы и подразделы</h1>
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(30,42,68,0.1)', borderRadius: 14 }}>
        {sections.map((section) => (
          <div key={section.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,42,68,0.06)' }}>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#1E2A44', marginBottom: 8 }}>{section.title}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {section.subsections.map((sub: any) => (
                <span key={sub.id} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(30,42,68,0.12)', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#5A6275' }}>
                  {sub.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
