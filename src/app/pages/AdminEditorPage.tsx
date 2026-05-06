import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import {
  BookOpen, ChevronLeft, Save, Eye, Upload, X,
  Plus, FileText, Image, Link2, Trash2, AlertCircle,
  CheckCircle, Clock, Tag, ChevronDown
} from 'lucide-react';
import { materials, sections } from '../data/mockData';
import { api } from '../services/api';
import { mapMaterial, mapSections } from '../data/viewModels';

const STATUS_OPTIONS = [
  { value: 'published', label: 'Опубликован', color: '#3D6B4F', bgColor: 'rgba(61,107,79,0.1)' },
  { value: 'draft', label: 'Черновик', color: '#D8A020', bgColor: 'rgba(216,160,32,0.1)' },
  { value: 'hidden', label: 'Скрыт', color: '#A9445B', bgColor: 'rgba(169,68,91,0.1)' },
];

const MATERIAL_TYPES = [
  'Worksheet', 'Lesson Plan', 'Speaking Card', 'Grammar Task',
  'Writing Template', 'Audio', 'Test', 'Checklist',
];

const LEVELS = ['A1', 'A2', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'];
const GRADES = ['5', '6', '7', '8', '9', '10', '11'];
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'webp', 'mp3', 'wav', 'zip']);

type UploadedFileEntry = {
  id?: number;
  name: string;
  path?: string;
};

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block',
      fontFamily: 'Manrope, sans-serif',
      fontSize: 12,
      fontWeight: 700,
      color: '#5A6275',
      marginBottom: 6,
      letterSpacing: '0.04em',
    }}>
      {children}
    </label>
  );
}

function FormInput({
  value, onChange, placeholder, type = 'text'
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1.5px solid rgba(30,42,68,0.12)',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 14,
        color: '#2B2F36',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#1E2A44')}
      onBlur={(e) => (e.target.style.borderColor = 'rgba(30,42,68,0.12)')}
    />
  );
}

function FormTextarea({
  value, onChange, placeholder, rows = 4
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1.5px solid rgba(30,42,68,0.12)',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 14,
        color: '#2B2F36',
        outline: 'none',
        boxSizing: 'border-box',
        resize: 'vertical',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#1E2A44')}
      onBlur={(e) => (e.target.style.borderColor = 'rgba(30,42,68,0.12)')}
    />
  );
}

function FormSelect({
  value, onChange, options
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 36px 10px 14px',
          borderRadius: 10,
          border: '1.5px solid rgba(30,42,68,0.12)',
          backgroundColor: '#FFFFFF',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 14,
          color: '#2B2F36',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <option value="">Выберите...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
    </div>
  );
}

export function AdminEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;

  const existing = !isNew ? materials.find((m) => m.id === id) : null;
  const [entityId, setEntityId] = useState<string | null>(isNew ? null : id || null);
  const [allSections, setAllSections] = useState<any[]>(sections as any[]);

  const [title, setTitle] = useState(existing?.title || '');
  const [shortDesc, setShortDesc] = useState(existing?.description?.substring(0, 100) || '');
  const [fullDesc, setFullDesc] = useState(existing?.description || '');
  const [section, setSection] = useState(existing?.section || '');
  const [subsection, setSubsection] = useState(existing?.subsection || '');
  const [author, setAuthor] = useState(existing?.author || '');
  const [level, setLevel] = useState(existing?.level || '');
  const [grade, setGrade] = useState(existing?.grade || '');
  const [materialType, setMaterialType] = useState('');
  const [status, setStatus] = useState(existing?.status || 'draft');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>(existing?.tags || []);
  const [externalLink, setExternalLink] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileEntry[]>(
    existing?.files.map((f) => ({ name: `${f.name}.${f.type}` })) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const parseApiError = (error: unknown) => {
    if (error instanceof Error && error.message) {
      try {
        const parsed = JSON.parse(error.message);
        if (typeof parsed === 'object' && parsed !== null) {
          const first = Object.values(parsed)[0] as any;
          if (Array.isArray(first) && first[0]) return String(first[0]);
          if (typeof first === 'string') return first;
        }
      } catch {
        return error.message;
      }
      return error.message;
    }
    return 'Неизвестная ошибка';
  };

  const resolveSectionIds = async () => {
    let sourceSections = allSections;
    let sectionId = sourceSections.find((s) => s.key === section)?.id;
    if (!sectionId) {
      try {
        const sectionData = await api.sections();
        sourceSections = mapSections(sectionData) as any[];
        setAllSections(sourceSections);
        sectionId = sourceSections.find((s) => s.key === section)?.id;
      } catch {
        // noop
      }
    }
    if (!sectionId && sourceSections[0]?.id) {
      sectionId = sourceSections[0].id;
    }
    const targetSection = sourceSections.find((s) => s.id === sectionId) || sourceSections.find((s) => s.key === section);
    const subsectionId = targetSection?.subsections?.find((s: any) => s.key === subsection)?.id || null;
    return { sectionId, subsectionId, sectionKey: targetSection?.key || section };
  };

  useEffect(() => {
    api.sections().then((sectionData) => setAllSections(mapSections(sectionData) as any[])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id || id === 'new') return;
    api.material(id)
      .then((response) => {
        const material = mapMaterial(response as any) as any;
        setEntityId(String(response.id));
        setTitle(material.title || '');
        setShortDesc(material.description || '');
        setFullDesc(material.description || '');
        setSection(material.section || '');
        setSubsection(material.subsection || '');
        setAuthor(material.author || '');
        setLevel(material.level || '');
        setGrade(material.grade || '');
        setMaterialType(material.type || '');
        setStatus((material.status as any) || 'draft');
        setTags(material.tags || []);
        setUploadedFiles((material.files || []).map((f: any) => ({ id: f.id, name: f.name, path: f.path })));
      })
      .catch(() => {});
  }, [id]);

  const currentSection = allSections.find((s) => s.key === section);

  const handleSave = async (mode: 'draft' | 'published' | 'hidden' | 'keep' = 'keep') => {
    if (!title.trim()) {
      setToast('Заполните заголовок');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    const nextStatus = mode === 'keep' ? status : mode;
    setSaved(true);
    setStatus(nextStatus);
    try {
      const { sectionId, subsectionId, sectionKey } = await resolveSectionIds();
      if (!sectionId) {
        throw new Error('Выберите раздел материала');
      }
      if (!section && sectionKey) {
        setSection(sectionKey);
      }
      const payload = {
        title,
        section: sectionId,
        subsection: subsectionId || null,
        type: materialType || 'worksheet',
        level: level || 'B1',
        grade,
        description_short: shortDesc,
        description_full: fullDesc,
        author,
        difficulty: 2,
        status: nextStatus,
        tag_titles: tags,
        external_links: externalLink ? [externalLink] : [],
      };
      let savedMaterial: any;
      if (entityId) {
        savedMaterial = await api.updateMaterial(entityId, payload);
      } else {
        savedMaterial = await api.createMaterial(payload);
        setEntityId(String(savedMaterial.id));
      }
      setToast(
        nextStatus === 'published'
          ? 'Материал опубликован'
          : nextStatus === 'hidden'
            ? 'Материал скрыт'
            : 'Черновик сохранён'
      );
      setTimeout(() => setToast(''), 3000);
      if (isNew && savedMaterial?.id) {
        navigate(`/admin/materials/${savedMaterial.id}/edit`);
      }
    } catch (error) {
      setToast(`Ошибка сохранения: ${parseApiError(error)}`);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!entityId) {
      setToast('Материал еще не создан');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    if (!window.confirm('Удалить материал полностью?')) return;
    try {
      await api.deleteMaterial(entityId);
      setToast('Материал удален');
      setTimeout(() => setToast(''), 1500);
      navigate('/admin/materials');
    } catch (error) {
      setToast(`Ошибка удаления: ${parseApiError(error)}`);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagsInput.trim()) {
      if (!tags.includes(tagsInput.trim())) {
        setTags([...tags, tagsInput.trim()]);
      }
      setTagsInput('');
    }
  };

  const ensureMaterialForUpload = async (): Promise<string | null> => {
    if (entityId) return entityId;
    try {
      const { sectionId, subsectionId, sectionKey } = await resolveSectionIds();
      if (!sectionId) {
        throw new Error('Выберите раздел перед загрузкой файла');
      }
      if (!section && sectionKey) {
        setSection(sectionKey);
      }
      const draft = await api.createMaterial({
        title: title.trim() || `Новый материал ${new Date().toLocaleString('ru-RU')}`,
        section: sectionId,
        subsection: subsectionId || null,
        type: materialType || 'worksheet',
        level: level || 'B1',
        grade,
        description_short: shortDesc,
        description_full: fullDesc,
        author,
        difficulty: 2,
        status: 'draft',
        tag_titles: tags,
        external_links: externalLink ? [externalLink] : [],
      });
      const newId = String(draft.id);
      setEntityId(newId);
      if (isNew) {
        navigate(`/admin/materials/${newId}/edit`);
      }
      return newId;
    } catch (error) {
      setToast(`Ошибка сохранения: ${parseApiError(error)}`);
      setTimeout(() => setToast(''), 3000);
      return null;
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    const invalid = files.find((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      return !ALLOWED_EXTENSIONS.has(ext) || file.size > MAX_FILE_SIZE_BYTES;
    });
    if (invalid) {
      setToast('Неподдерживаемый тип файла или превышен лимит 500MB');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const materialId = await ensureMaterialForUpload();
    if (!materialId) return;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('original_name', file.name);
        const uploaded = await api.uploadMaterialFile(materialId, formData) as any;
        setUploadedFiles((prev) => [...prev, { id: uploaded.id, name: uploaded.original_name || file.name, path: uploaded.path }]);
      }
      setToast('Файлы загружены');
      setTimeout(() => setToast(''), 3000);
    } catch (error) {
      setToast(`Ошибка загрузки: ${parseApiError(error)}`);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const currentStatusOpt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[1];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F4EE', fontFamily: 'Manrope, sans-serif' }}>

      {/* Mini sidebar */}
      <aside style={{
        width: 220,
        backgroundColor: '#1E2A44',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        padding: '20px 8px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 12px 16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, backgroundColor: 'rgba(247,244,238,0.1)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={14} color="#DCE6F2" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 14, color: '#F7F4EE' }}>
              English<span style={{ color: '#D8C3A5' }}>Platform</span>
            </span>
          </Link>
          <span style={{
            fontSize: 9, fontFamily: 'Manrope, sans-serif', fontWeight: 700,
            color: '#D8A0AF',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '1px 6px', borderRadius: 3,
            backgroundColor: 'rgba(169,68,91,0.2)',
            border: '1px solid rgba(169,68,91,0.3)',
          }}>
            Admin Panel
          </span>
        </div>
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', margin: '0 12px 12px' }} />
        <Link to="/admin" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 6,
          color: '#8A9AB8', textDecoration: 'none', fontSize: 12,
          transition: 'all 0.15s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#F7F4EE'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8A9AB8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <ChevronLeft size={13} /> Dashboard
        </Link>
        <div style={{ padding: '12px', marginTop: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#6A7A8E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Статус
          </p>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 6,
                border: `1px solid ${status === opt.value ? opt.color : 'transparent'}`,
                backgroundColor: status === opt.value ? opt.bgColor : 'transparent',
                color: status === opt.value ? opt.color : '#6A7A8E',
                cursor: 'pointer', marginBottom: 4, fontSize: 12, fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {status === opt.value ? <CheckCircle size={12} /> : <Clock size={12} />}
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 12px', marginTop: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#6A7A8E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Version History
          </p>
          {['v3 — текущая', 'v2 — 05.04.2025', 'v1 — 01.04.2025'].map((ver, i) => (
            <div key={ver} style={{
              fontSize: 11, color: i === 0 ? '#D8C3A5' : '#6A7A8E',
              padding: '5px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              fontWeight: i === 0 ? 600 : 400,
            }}>
              {ver}
            </div>
          ))}
        </div>
      </aside>

      {/* Main editor */}
      <div style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(30,42,68,0.08)',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link to="/admin" style={{ textDecoration: 'none', fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>Admin</Link>
              <span style={{ color: '#D1D5DB', fontSize: 12 }}>/</span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#5A6275' }}>
                {isNew ? 'Новый материал' : 'Редактирование'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 5,
              backgroundColor: currentStatusOpt.bgColor,
              color: currentStatusOpt.color,
              fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700,
            }}>
              {currentStatusOpt.label}
            </span>
          </div>
          <button
            onClick={() => handleSave('draft')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1.5px solid rgba(30,42,68,0.12)', backgroundColor: '#FFFFFF',
              color: '#5A6275',
              fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <Save size={13} /> Сохранить черновик
          </button>
          <button
            onClick={() => handleSave('hidden')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: '1.5px solid rgba(169,68,91,0.25)', backgroundColor: 'rgba(169,68,91,0.06)',
              color: '#A9445B',
              fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <Eye size={13} /> Скрыть
          </button>
          <button
            onClick={() => handleSave('published')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 8,
              border: 'none', backgroundColor: '#1E2A44',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16213A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2A44')}
          >
            <Eye size={13} /> Опубликовать
          </button>
          <button
            onClick={handleDeleteMaterial}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 8,
              border: '1.5px solid rgba(169,68,91,0.3)',
              backgroundColor: '#FFFFFF',
              color: '#A9445B',
              fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700,
              cursor: entityId ? 'pointer' : 'not-allowed',
              opacity: entityId ? 1 : 0.6,
              transition: 'all 0.15s',
            }}
            disabled={!entityId}
          >
            <Trash2 size={13} /> Удалить
          </button>
        </div>

        {/* Editor body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0, flex: 1, minHeight: 0 }}>

          {/* Left: main form */}
          <div style={{ padding: '28px 32px', overflowY: 'auto', borderRight: '1px solid rgba(30,42,68,0.07)' }}>

            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#1E2A44', marginBottom: 4 }}>
                {isNew ? 'Новый материал' : 'Редактирование материала'}
              </h1>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#8A9AB8' }}>
                Заполните форму и сохраните или опубликуйте материал
              </p>
            </div>

            {/* Section 1: Basic info */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(30,42,68,0.07)', borderRadius: 16, padding: '22px', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 18, letterSpacing: '0.04em' }}>
                Основная информация
              </h2>

              <div style={{ marginBottom: 14 }}>
                <FormLabel>Название *</FormLabel>
                <FormInput
                  value={title}
                  onChange={setTitle}
                  placeholder="Введите название материала"
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <FormLabel>Краткое описание</FormLabel>
                <FormTextarea
                  value={shortDesc}
                  onChange={setShortDesc}
                  placeholder="1–2 предложения для карточки материала"
                  rows={2}
                />
              </div>

              <div style={{ marginBottom: 0 }}>
                <FormLabel>Полное описание</FormLabel>
                <FormTextarea
                  value={fullDesc}
                  onChange={setFullDesc}
                  placeholder="Подробное описание: что содержит, для кого, как использовать"
                  rows={5}
                />
              </div>
            </div>

            {/* Section 2: Classification */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(30,42,68,0.07)', borderRadius: 16, padding: '22px', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 18 }}>
                Классификация
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <FormLabel>Раздел</FormLabel>
                  <FormSelect
                    value={section}
                    onChange={(v) => { setSection(v); setSubsection(''); }}
                    options={allSections.map((s) => ({ value: s.key, label: s.label }))}
                  />
                </div>
                <div>
                  <FormLabel>Подраздел</FormLabel>
                  <FormSelect
                    value={subsection}
                    onChange={setSubsection}
                    options={currentSection?.subsections.map((s) => ({ value: s.key, label: s.label })) || []}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <FormLabel>Тип материала</FormLabel>
                  <FormSelect
                    value={materialType}
                    onChange={setMaterialType}
                    options={MATERIAL_TYPES.map((t) => ({ value: t.toLowerCase().replace(' ', '-'), label: t }))}
                  />
                </div>
                <div>
                  <FormLabel>Уровень (CEFR)</FormLabel>
                  <FormSelect
                    value={level}
                    onChange={setLevel}
                    options={LEVELS.map((l) => ({ value: l, label: l }))}
                  />
                </div>
                <div>
                  <FormLabel>Класс</FormLabel>
                  <FormSelect
                    value={grade}
                    onChange={setGrade}
                    options={GRADES.map((g) => ({ value: g, label: `${g} класс` }))}
                  />
                </div>
              </div>

              <div>
                <FormLabel>Автор / Редактор</FormLabel>
                <FormInput
                  value={author}
                  onChange={setAuthor}
                  placeholder="Фамилия И.О."
                />
              </div>
            </div>

            {/* Section 3: Tags */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(30,42,68,0.07)', borderRadius: 16, padding: '22px', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 18 }}>
                Теги
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {tags.map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px',
                    borderRadius: 20,
                    backgroundColor: '#F0F4F9',
                    border: '1.5px solid rgba(30,42,68,0.1)',
                    fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#2B2F36', fontWeight: 500,
                  }}>
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <Tag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Введите тег и нажмите Enter"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: 10,
                    border: '1.5px solid rgba(30,42,68,0.12)',
                    backgroundColor: '#F7F4EE',
                    fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#2B2F36',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1E2A44')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(30,42,68,0.12)')}
                />
              </div>
            </div>

            {/* Section 4: Files */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(30,42,68,0.07)', borderRadius: 16, padding: '22px', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 18 }}>
                Прикреплённые файлы
              </h2>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragging ? '#1E2A44' : 'rgba(30,42,68,0.15)'}`,
                  borderRadius: 12,
                  padding: '28px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? 'rgba(30,42,68,0.04)' : '#F7F4EE',
                  marginBottom: 14,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <Upload size={24} color={isDragging ? '#1E2A44' : '#C4C9D4'} style={{ marginBottom: 8 }} />
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600, color: isDragging ? '#1E2A44' : '#5A6275', marginBottom: 4 }}>
                  Перетащите файлы сюда
                </p>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#9CA3AF' }}>
                  PDF, DOCX, ZIP, MP3 — до 500 MB на файл
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                  marginTop: 14, padding: '7px 16px', borderRadius: 8,
                  border: '1.5px solid rgba(30,42,68,0.15)', backgroundColor: '#FFFFFF',
                  fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: '#5A6275',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <Plus size={12} /> Выбрать файлы
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.mp3,.wav,.zip"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    uploadFiles(Array.from(e.target.files || []));
                    e.currentTarget.value = '';
                  }}
                />
              </div>

              {/* Uploaded files */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {uploadedFiles.map((fileItem, i) => {
                    const ext = fileItem.name.split('.').pop() || 'pdf';
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1.5px solid rgba(30,42,68,0.08)',
                        backgroundColor: '#F7F4EE',
                      }}>
                        <span style={{
                          fontSize: 9, fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: ext === 'pdf' ? '#A9445B' : ext === 'zip' ? '#5B4B8A' : '#2B5E8A',
                          padding: '2px 5px', borderRadius: 3, letterSpacing: '0.03em',
                        }}>
                          {ext.toUpperCase()}
                        </span>
                        <span style={{ flex: 1, fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#2B2F36', fontWeight: 500 }}>{fileItem.name}</span>
                        <button
                          onClick={() => {
                            if (entityId && fileItem.id) {
                              api.deleteMaterialFile(entityId, fileItem.id)
                                .then(() => setUploadedFiles((prev) => prev.filter((_, j) => j !== i)))
                                .catch(() => {
                                  setToast('Не удалось удалить файл');
                                  setTimeout(() => setToast(''), 3000);
                                });
                              return;
                            }
                            setUploadedFiles((prev) => prev.filter((_, j) => j !== i));
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 5: External links */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(30,42,68,0.07)', borderRadius: 16, padding: '22px' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 14 }}>
                Внешние ссылки
              </h2>
              <div style={{ position: 'relative' }}>
                <Link2 size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 34px',
                    borderRadius: 10,
                    border: '1.5px solid rgba(30,42,68,0.12)',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#2B2F36',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#1E2A44')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(30,42,68,0.12)')}
                />
              </div>
            </div>
          </div>

          {/* Right: preview / meta panel */}
          <div style={{ padding: '28px 24px', overflowY: 'auto', backgroundColor: '#FAFAFA' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700, color: '#1E2A44', marginBottom: 16 }}>
              Preview
            </h2>

            {/* Card preview */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(30,42,68,0.08)',
              borderRadius: 14,
              padding: '16px',
              marginBottom: 16,
            }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Предпросмотр карточки
              </p>
              <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                {materialType && (
                  <span style={{ fontSize: 10, fontFamily: 'Manrope, sans-serif', fontWeight: 700, color: '#5B4B8A', backgroundColor: 'rgba(91,75,138,0.1)', padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {materialType}
                  </span>
                )}
                {level && (
                  <span style={{ fontSize: 10, fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#8A9AB8', backgroundColor: '#F0F4F9', padding: '2px 7px', borderRadius: 4 }}>
                    {level}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: title ? '#1E2A44' : '#D1D5DB', marginBottom: 6, lineHeight: 1.4 }}>
                {title || 'Название материала'}
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#8A9AB8', lineHeight: 1.5, marginBottom: 10 }}>
                {shortDesc || 'Краткое описание будет отображаться здесь...'}
              </p>
              <div style={{ borderTop: '1px solid rgba(30,42,68,0.06)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#9CA3AF' }}>{author || 'Автор'}</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#9CA3AF' }}>{uploadedFiles.length} файлов</span>
              </div>
            </div>

            {/* Status */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(30,42,68,0.08)',
              borderRadius: 14,
              padding: '14px',
              marginBottom: 16,
            }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                Публикация
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: '#5A6275' }}>Статус</span>
                <span style={{
                  padding: '3px 8px', borderRadius: 4,
                  backgroundColor: currentStatusOpt.bgColor,
                  color: currentStatusOpt.color,
                  fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 700,
                }}>
                  {currentStatusOpt.label}
                </span>
              </div>
              <button
                onClick={() => handleSave('published')}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  border: 'none', backgroundColor: '#1E2A44', color: '#FFFFFF',
                  fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16213A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E2A44')}
              >
                <Eye size={13} /> Опубликовать
              </button>
            </div>

            {/* Tags preview */}
            {tags.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(30,42,68,0.08)',
                borderRadius: 14,
                padding: '14px',
              }}>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Теги ({tags.length})
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {tags.map((tag) => (
                    <span key={tag} style={{
                      padding: '3px 8px', borderRadius: 4,
                      backgroundColor: '#F0F4F9',
                      border: '1px solid rgba(30,42,68,0.08)',
                      fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#5A6275', fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          padding: '12px 20px',
          borderRadius: 10,
          backgroundColor: toast.includes('опубликован') ? '#3D6B4F' : '#1E2A44',
          color: '#FFFFFF',
          fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease',
        }}>
          <CheckCircle size={15} />
          {toast}
        </div>
      )}
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
