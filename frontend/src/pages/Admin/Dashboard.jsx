import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Zap, Award, Briefcase, User, LogOut,
  Plus, Pencil, Trash2, Save, X, ChevronRight, Menu, Globe, Mail,
  MessageCircle, Hash, Palette, Type, FileText
} from 'lucide-react';
import { useAdminStore } from '../../stores';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { projectsApi, skillsApi, certificationsApi, experiencesApi, profileApi, uploadApi } from '../../services/api';

const Github = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.12-.34 6.4-1.51 6.4-6.9a5.4 5.4 0 0 0-1.5-3.89C18.8 3.5 18 2 18 2s-1.3-.4-3.5 1.1a12.3 12.3 0 0 0-6 0C6.3 1.6 5 2 5 2s-.8 1.5-.1 2.1A5.4 5.4 0 0 0 3.4 8c0 5.39 3.28 6.56 6.4 6.9a4.8 4.8 0 0 0-1 3.02V22"/><path d="M9 20c-4.3 1.4-5.3-2-8-2"/></svg>
);

const Linkedin = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Instagram = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const socialNetworks = [
  { key: 'github', label: 'GitHub', icon: Github, color: '#333', placeholder: 'https://github.com/seu-usuario' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', placeholder: 'https://linkedin.com/in/seu-perfil' },
  { key: 'email', label: 'Email', icon: Mail, color: '#EA4335', placeholder: 'seu@email.com' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F', placeholder: 'https://instagram.com/seu-perfil' },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366', placeholder: 'https://wa.me/5511999999999' },
];

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'projects', label: 'Projetos', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'certifications', label: 'Certificações', icon: Award },
  { id: 'experiences', label: 'Experiências', icon: Briefcase },
  { id: 'profile', label: 'Perfil', icon: User },
];

/* ========================================
   CRUD Panel Component
   ======================================== */
function CrudPanel({ title, items, fields, onSave, onDelete, loading }) {
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const openNew = () => {
    const empty = {};
    fields.forEach((f) => { empty[f.key] = f.default || ''; });
    setFormData(empty);
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setFormData({ ...item });
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await onSave(formData, editItem?.id);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button variant="primary" size="sm" icon={Plus} onClick={openNew}>
          Adicionar
        </Button>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-center text-[var(--color-text-tertiary)] py-8">
            Nenhum item cadastrado
          </p>
        )}
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="card p-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--color-text-primary)] truncate">
                {item[fields[0]?.key] || item.title || item.name}
              </p>
              {fields[1] && (
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                  {item[fields[1].key]}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <motion.button
                onClick={() => openEdit(item)}
                className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-colors cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                <Pencil size={16} />
              </motion.button>
              <motion.button
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Editar' : 'Novo'}>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] text-sm outline-none focus:border-[var(--color-primary)] resize-none transition-colors"
                />
              ) : field.type === 'file' ? (
                <div>
                  {formData[field.key] && typeof formData[field.key] === 'string' && (
                    formData[field.key].match(/\.(mp4|webm|ogg)$/i) || formData[field.key].includes('video') ? (
                      <video src={formData[field.key].startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${formData[field.key]}` : formData[field.key]} className="h-32 w-auto rounded mb-2 object-cover" controls muted />
                    ) : (
                      <img src={formData[field.key].startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${formData[field.key]}` : formData[field.key]} className="h-20 w-20 object-cover rounded mb-2" alt="Preview"/>
                    )
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const res = await uploadApi.file(e.target.files[0]);
                          setFormData((prev) => ({ ...prev, [field.key]: res.url }));
                        } catch (err) {
                           alert('Erro ao subir arquivo');
                        }
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} icon={X} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} icon={Save} className="flex-1">
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ========================================
   Overview Panel
   ======================================== */
function OverviewPanel({ counts }) {
  const cards = [
    { icon: FolderKanban, label: 'Projetos', count: counts.projects, color: '#3B82F6' },
    { icon: Zap, label: 'Skills', count: counts.skills, color: '#8B5CF6' },
    { icon: Award, label: 'Certificações', count: counts.certifications, color: '#10B981' },
    { icon: Briefcase, label: 'Experiências', count: counts.experiences, color: '#F59E0B' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Visão Geral</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 text-center">
            <div
              className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${c.color}15` }}
            >
              <c.icon size={20} style={{ color: c.color }} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{c.count}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================
   Collapsible Section helper
   ======================================== */
function AdminSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]/80 transition-colors cursor-pointer"
      >
        {Icon && <Icon size={18} className="text-[var(--color-primary)]" />}
        <span className="text-sm font-bold text-[var(--color-text-primary)] flex-1 text-left">{title}</span>
        <ChevronRight size={16} className={`text-[var(--color-text-tertiary)] transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================
   Input helper
   ======================================== */
const inputCls = "w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)] transition-colors";

/* ========================================
   Profile Editor Panel — FULL
   ======================================== */
function ProfileEditor() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.get();
      setProfile(data || { name: '', title: '', bio: '', email: '', location: '', social_links: {}, stats: [], dashboard_metrics: [], dashboard_languages: [], dashboard_activity: [], hero_headlines: [], about_title: '', about_subtitle: '', about_image_url: '', resume_config: {}, dashboard_section_config: {} });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.update({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || '',
        location: profile.location || '',
        social_links: profile.social_links || {},
        stats: profile.stats || [],
        dashboard_metrics: profile.dashboard_metrics || [],
        dashboard_languages: profile.dashboard_languages || [],
        dashboard_activity: profile.dashboard_activity || [],
        hero_headlines: profile.hero_headlines || [],
        about_title: profile.about_title || '',
        about_subtitle: profile.about_subtitle || '',
        about_image_url: profile.about_image_url || '',
        resume_config: profile.resume_config || {},
        dashboard_section_config: profile.dashboard_section_config || {},
      });
      alert('Perfil salvo com sucesso!');
    } catch (e) {
      alert('Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[var(--color-text-tertiary)]">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Editar Perfil</h2>
        <Button variant="primary" onClick={handleSave} icon={Save} loading={saving}>Salvar Tudo</Button>
      </div>

      {/* === PERFIL BÁSICO === */}
      <AdminSection title="Informações Básicas" icon={User} defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Nome Completo</label>
            <input type="text" value={profile.name || ''} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Carlos Eduardo" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título / Cargo</label>
            <input type="text" value={profile.title || ''} onChange={(e) => setProfile(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="Fullstack Developer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Email</label>
            <input type="email" value={profile.email || ''} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Localização</label>
            <input type="text" value={profile.location || ''} onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))} className={inputCls} placeholder="Brasil — Remoto" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Bio / Sobre Mim</label>
          <textarea value={profile.bio || ''} onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Desenvolver apaixonado por criar soluções..." />
        </div>
      </AdminSection>

      {/* === REDES SOCIAIS === */}
      <AdminSection title="Redes Sociais" icon={Globe}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Configure os links que aparecerão na seção de contato do portfolio.
        </p>
        <div className="space-y-3">
          {socialNetworks.map((net) => (
            <div key={net.key} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${net.color}15` }}>
                <net.icon size={14} style={{ color: net.color }} />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={profile.social_links?.[net.key] || ''}
                  onChange={(e) => setProfile(p => ({ ...p, social_links: { ...p.social_links, [net.key]: e.target.value } }))}
                  className={inputCls}
                  placeholder={net.placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminSection>

      {/* === STATS HERO/ABOUT === */}
      <AdminSection title="Stats (Hero & Sobre Mim)" icon={Hash}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Métricas exibidas no Hero e na seção Sobre Mim (ex: "3+ Anos de exp.", "20+ Projetos").
        </p>
        <div className="space-y-3">
          {(profile.stats || []).map((stat, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Valor</label>
                <input type="text" value={stat.value || ''} onChange={(e) => {
                  const newStats = [...(profile.stats || [])];
                  newStats[index] = { ...newStats[index], value: e.target.value };
                  setProfile(p => ({ ...p, stats: newStats }));
                }} className={inputCls} placeholder="20+" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Rótulo</label>
                <input type="text" value={stat.label || ''} onChange={(e) => {
                  const newStats = [...(profile.stats || [])];
                  newStats[index] = { ...newStats[index], label: e.target.value };
                  setProfile(p => ({ ...p, stats: newStats }));
                }} className={inputCls} placeholder="Projetos" />
              </div>
              <button type="button" onClick={() => {
                setProfile(p => ({ ...p, stats: p.stats.filter((_, i) => i !== index) }));
              }} className="mt-5 p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
            </div>
          ))}
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => {
            setProfile(p => ({ ...p, stats: [...(p.stats || []), { label: '', value: '' }] }));
          }}>Adicionar Stat</Button>
        </div>
      </AdminSection>

      {/* === HERO HEADLINES (TYPEWRITER) === */}
      <AdminSection title="Frases do Hero (Typewriter)" icon={Type}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Frases animadas que aparecem digitando no topo do portfolio.
        </p>
        <div className="space-y-3">
          {(profile.hero_headlines || []).map((headline, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <input type="text" value={headline || ''} onChange={(e) => {
                  const newHeadlines = [...(profile.hero_headlines || [])];
                  newHeadlines[index] = e.target.value;
                  setProfile(p => ({ ...p, hero_headlines: newHeadlines }));
                }} className={inputCls} placeholder="Construindo sistemas que escalam ideias" />
              </div>
              <button type="button" onClick={() => {
                setProfile(p => ({ ...p, hero_headlines: p.hero_headlines.filter((_, i) => i !== index) }));
              }} className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
            </div>
          ))}
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => {
            setProfile(p => ({ ...p, hero_headlines: [...(p.hero_headlines || []), ''] }));
          }}>Adicionar Frase</Button>
        </div>
      </AdminSection>

      {/* === ABOUT SECTION === */}
      <AdminSection title="Seção Sobre Mim" icon={Type}>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título da seção</label>
          <input type="text" value={profile.about_title || ''} onChange={(e) => setProfile(p => ({ ...p, about_title: e.target.value }))} className={inputCls} placeholder="Transformando ideias em código" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Subtítulo da seção</label>
          <textarea value={profile.about_subtitle || ''} onChange={(e) => setProfile(p => ({ ...p, about_subtitle: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Desenvolvedor apaixonado por criar soluções..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Imagem (Foto)</label>
          {profile.about_image_url && (
            <img 
              src={profile.about_image_url.startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${profile.about_image_url}` : profile.about_image_url} 
              className="h-32 w-32 object-cover rounded-xl mb-3 border border-[var(--color-border)]" 
              alt="About Preview" 
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                try {
                  const res = await uploadApi.file(e.target.files[0]);
                  setProfile(p => ({ ...p, about_image_url: res.url }));
                } catch (err) {
                  alert('Erro ao subir imagem');
                }
              }
            }}
            className={inputCls}
          />
        </div>
      </AdminSection>

      {/* === PDF GENERATOR TEXTS === */}
      <AdminSection title="Seção Gerador de PDF" icon={FileText}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Configure os textos da área do seu gerador de currículo (PDF).
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título (Destaque)</label>
              <input type="text" value={profile.resume_config?.titleHighlight || ''} onChange={(e) => setProfile(p => ({ ...p, resume_config: { ...p.resume_config, titleHighlight: e.target.value } }))} className={inputCls} placeholder="Currículo" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título (Colorido)</label>
              <input type="text" value={profile.resume_config?.titleNormal || ''} onChange={(e) => setProfile(p => ({ ...p, resume_config: { ...p.resume_config, titleNormal: e.target.value } }))} className={inputCls} placeholder="Profissional" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Subtítulo</label>
            <textarea value={profile.resume_config?.subtitle || ''} onChange={(e) => setProfile(p => ({ ...p, resume_config: { ...p.resume_config, subtitle: e.target.value } }))} rows={2} className={`${inputCls} resize-none`} placeholder="Gere automaticamente um currículo completo..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Texto do Botão</label>
            <input type="text" value={profile.resume_config?.buttonText || ''} onChange={(e) => setProfile(p => ({ ...p, resume_config: { ...p.resume_config, buttonText: e.target.value } }))} className={inputCls} placeholder="Gerar Currículo PDF" />
          </div>
        </div>
      </AdminSection>

      {/* === DASHBOARD SECTION HEADER === */}
      <AdminSection title="Dashboard — Cabeçalho da Seção" icon={LayoutDashboard}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Configure os textos do cabeçalho e dos cards da seção <strong>Métricas &amp; Analytics</strong> do portfolio.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Badge (etiqueta)</label>
              <input type="text" value={profile.dashboard_section_config?.badge || ''} onChange={(e) => setProfile(p => ({ ...p, dashboard_section_config: { ...p.dashboard_section_config, badge: e.target.value } }))} className={inputCls} placeholder="Dashboard" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título da Seção</label>
              <input type="text" value={profile.dashboard_section_config?.title || ''} onChange={(e) => setProfile(p => ({ ...p, dashboard_section_config: { ...p.dashboard_section_config, title: e.target.value } }))} className={inputCls} placeholder="Métricas & Analytics" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Subtítulo da Seção</label>
            <textarea value={profile.dashboard_section_config?.subtitle || ''} onChange={(e) => setProfile(p => ({ ...p, dashboard_section_config: { ...p.dashboard_section_config, subtitle: e.target.value } }))} rows={2} className={`${inputCls} resize-none`} placeholder="Uma visão em tempo real da minha atividade e crescimento como desenvolvedor." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título do card de Linguagens</label>
              <input type="text" value={profile.dashboard_section_config?.languagesTitle || ''} onChange={(e) => setProfile(p => ({ ...p, dashboard_section_config: { ...p.dashboard_section_config, languagesTitle: e.target.value } }))} className={inputCls} placeholder="Distribuição por Linguagem" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Título do card de Atividade</label>
              <input type="text" value={profile.dashboard_section_config?.activityTitle || ''} onChange={(e) => setProfile(p => ({ ...p, dashboard_section_config: { ...p.dashboard_section_config, activityTitle: e.target.value } }))} className={inputCls} placeholder="Atividade Recente" />
            </div>
          </div>
        </div>
      </AdminSection>

      {/* === DASHBOARD MÉTRICAS === */}
      <AdminSection title="Dashboard — Métricas Públicas" icon={LayoutDashboard}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Os 4 cards de métricas exibidos na seção Dashboard do portfolio (Linhas de Código, Projetos Concluídos, etc.).
        </p>
        <div className="space-y-3">
          {(profile.dashboard_metrics || []).map((metric, index) => (
            <div key={index} className="card p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Rótulo</label>
                  <input type="text" value={metric.label || ''} onChange={(e) => {
                    const newMetrics = [...(profile.dashboard_metrics || [])];
                    newMetrics[index] = { ...newMetrics[index], label: e.target.value };
                    setProfile(p => ({ ...p, dashboard_metrics: newMetrics }));
                  }} className={inputCls} placeholder="Linhas de Código" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Valor (número)</label>
                  <input type="number" value={metric.value || ''} onChange={(e) => {
                    const newMetrics = [...(profile.dashboard_metrics || [])];
                    newMetrics[index] = { ...newMetrics[index], value: parseInt(e.target.value) || 0 };
                    setProfile(p => ({ ...p, dashboard_metrics: newMetrics }));
                  }} className={inputCls} placeholder="15000" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Sufixo</label>
                  <input type="text" value={metric.suffix || ''} onChange={(e) => {
                    const newMetrics = [...(profile.dashboard_metrics || [])];
                    newMetrics[index] = { ...newMetrics[index], suffix: e.target.value };
                    setProfile(p => ({ ...p, dashboard_metrics: newMetrics }));
                  }} className={inputCls} placeholder="+" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Cor (hex)</label>
                  <div className="flex gap-2">
                    <input type="color" value={metric.color || '#3B82F6'} onChange={(e) => {
                      const newMetrics = [...(profile.dashboard_metrics || [])];
                      newMetrics[index] = { ...newMetrics[index], color: e.target.value };
                      setProfile(p => ({ ...p, dashboard_metrics: newMetrics }));
                    }} className="w-10 h-9 rounded-lg border border-[var(--color-border)] cursor-pointer" />
                    <input type="text" value={metric.color || '#3B82F6'} onChange={(e) => {
                      const newMetrics = [...(profile.dashboard_metrics || [])];
                      newMetrics[index] = { ...newMetrics[index], color: e.target.value };
                      setProfile(p => ({ ...p, dashboard_metrics: newMetrics }));
                    }} className={`${inputCls} flex-1`} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => {
                  setProfile(p => ({ ...p, dashboard_metrics: p.dashboard_metrics.filter((_, i) => i !== index) }));
                }} className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg cursor-pointer text-xs flex items-center gap-1"><Trash2 size={12} /> Remover</button>
              </div>
            </div>
          ))}
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => {
            setProfile(p => ({ ...p, dashboard_metrics: [...(p.dashboard_metrics || []), { label: '', value: 0, suffix: '+', color: '#3B82F6' }] }));
          }}>Adicionar Métrica</Button>
        </div>
      </AdminSection>

      {/* === DASHBOARD LINGUAGENS === */}
      <AdminSection title="Dashboard — Distribuição de Linguagens" icon={Palette}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Barras de progresso das linguagens na seção Dashboard.
        </p>
        <div className="space-y-3">
          {(profile.dashboard_languages || []).map((lang, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Linguagem</label>
                <input type="text" value={lang.name || ''} onChange={(e) => {
                  const newLangs = [...(profile.dashboard_languages || [])];
                  newLangs[index] = { ...newLangs[index], name: e.target.value };
                  setProfile(p => ({ ...p, dashboard_languages: newLangs }));
                }} className={inputCls} placeholder="JavaScript" />
              </div>
              <div className="w-20">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">%</label>
                <input type="number" min="0" max="100" value={lang.percentage || ''} onChange={(e) => {
                  const newLangs = [...(profile.dashboard_languages || [])];
                  newLangs[index] = { ...newLangs[index], percentage: parseInt(e.target.value) || 0 };
                  setProfile(p => ({ ...p, dashboard_languages: newLangs }));
                }} className={inputCls} placeholder="35" />
              </div>
              <div className="w-20">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Cor</label>
                <input type="color" value={lang.color || '#3B82F6'} onChange={(e) => {
                  const newLangs = [...(profile.dashboard_languages || [])];
                  newLangs[index] = { ...newLangs[index], color: e.target.value };
                  setProfile(p => ({ ...p, dashboard_languages: newLangs }));
                }} className="w-full h-9 rounded-lg border border-[var(--color-border)] cursor-pointer" />
              </div>
              <button type="button" onClick={() => {
                setProfile(p => ({ ...p, dashboard_languages: p.dashboard_languages.filter((_, i) => i !== index) }));
              }} className="mt-5 p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
            </div>
          ))}
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => {
            setProfile(p => ({ ...p, dashboard_languages: [...(p.dashboard_languages || []), { name: '', percentage: 0, color: '#3B82F6' }] }));
          }}>Adicionar Linguagem</Button>
        </div>
      </AdminSection>

      {/* === DASHBOARD ATIVIDADE === */}
      <AdminSection title="Dashboard — Atividade Recente" icon={Zap}>
        <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
          Feed de atividade recente exibido no Dashboard público.
        </p>
        <div className="space-y-3">
          {(profile.dashboard_activity || []).map((act, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="w-24">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Data</label>
                <input type="text" value={act.date || ''} onChange={(e) => {
                  const newAct = [...(profile.dashboard_activity || [])];
                  newAct[index] = { ...newAct[index], date: e.target.value };
                  setProfile(p => ({ ...p, dashboard_activity: newAct }));
                }} className={inputCls} placeholder="Hoje" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Ação</label>
                <input type="text" value={act.action || ''} onChange={(e) => {
                  const newAct = [...(profile.dashboard_activity || [])];
                  newAct[index] = { ...newAct[index], action: e.target.value };
                  setProfile(p => ({ ...p, dashboard_activity: newAct }));
                }} className={inputCls} placeholder="Deploy de nova feature" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Projeto</label>
                <input type="text" value={act.project || ''} onChange={(e) => {
                  const newAct = [...(profile.dashboard_activity || [])];
                  newAct[index] = { ...newAct[index], project: e.target.value };
                  setProfile(p => ({ ...p, dashboard_activity: newAct }));
                }} className={inputCls} placeholder="Sistema Clínica" />
              </div>
              <button type="button" onClick={() => {
                setProfile(p => ({ ...p, dashboard_activity: p.dashboard_activity.filter((_, i) => i !== index) }));
              }} className="mt-5 p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
            </div>
          ))}
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => {
            setProfile(p => ({ ...p, dashboard_activity: [...(p.dashboard_activity || []), { date: '', action: '', project: '' }] }));
          }}>Adicionar Atividade</Button>
        </div>
      </AdminSection>

      {/* SAVE BUTTON at the bottom too */}
      <div className="flex justify-end pt-4">
        <Button variant="primary" onClick={handleSave} icon={Save} loading={saving}>Salvar Tudo</Button>
      </div>
    </div>
  );
}

/* ========================================
   Main Admin Dashboard
   ======================================== */
export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      const [p, s, c, e] = await Promise.all([
        projectsApi.getAll().catch(() => []),
        skillsApi.getAll().catch(() => []),
        certificationsApi.getAll().catch(() => []),
        experiencesApi.getAll().catch(() => []),
      ]);
      setProjects(p);
      setSkills(s);
      setCertifications(c);
      setExperiences(e);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // CRUD handlers
  const handleSaveProject = async (data, id) => {
    if (id) await projectsApi.update(id, data);
    else await projectsApi.create(data);
    loadData();
  };
  const handleDeleteProject = async (id) => {
    if (confirm('Excluir este projeto?')) {
      await projectsApi.delete(id);
      loadData();
    }
  };

  const handleSaveSkill = async (data, id) => {
    if (id) await skillsApi.update(id, data);
    else await skillsApi.create(data);
    loadData();
  };
  const handleDeleteSkill = async (id) => {
    if (confirm('Excluir esta skill?')) {
      await skillsApi.delete(id);
      loadData();
    }
  };

  const handleSaveCert = async (data, id) => {
    if (id) await certificationsApi.update(id, data);
    else await certificationsApi.create(data);
    loadData();
  };
  const handleDeleteCert = async (id) => {
    if (confirm('Excluir esta certificação?')) {
      await certificationsApi.delete(id);
      loadData();
    }
  };

  const handleSaveExp = async (data, id) => {
    if (id) await experiencesApi.update(id, data);
    else await experiencesApi.create(data);
    loadData();
  };
  const handleDeleteExp = async (id) => {
    if (confirm('Excluir esta experiência?')) {
      await experiencesApi.delete(id);
      loadData();
    }
  };

  // Field definitions
  const projectFields = [
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'description', label: 'Descrição curta', type: 'text' },
    { key: 'long_description', label: 'Descrição completa', type: 'textarea' },
    { key: 'category', label: 'Categoria', type: 'text' },
    { key: 'image_url', label: 'Imagem de Destaque', type: 'file' },
    { key: 'tech', label: 'Tecnologias (separadas por vírgula)', type: 'text' },
    { key: 'github_url', label: 'GitHub URL', type: 'text' },
    { key: 'demo_url', label: 'Demo URL', type: 'text' },
  ];

  const skillFields = [
    { key: 'name', label: 'Nome', type: 'text' },
    { key: 'category', label: 'Categoria', type: 'text' },
    { key: 'proficiency', label: 'Nível (%)', type: 'number', default: 50 },
  ];

  const certFields = [
    { key: 'title', label: 'Título', type: 'text' },
    { key: 'institution', label: 'Instituição', type: 'text' },
    { key: 'date', label: 'Data', type: 'text' },
    { key: 'description', label: 'Descrição', type: 'textarea' },
    { key: 'credential_url', label: 'URL da credencial', type: 'text' },
  ];

  const expFields = [
    { key: 'title', label: 'Cargo', type: 'text' },
    { key: 'company', label: 'Empresa', type: 'text' },
    { key: 'period', label: 'Período', type: 'text' },
    { key: 'description', label: 'Descrição', type: 'textarea' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPanel
            counts={{
              projects: projects.length,
              skills: skills.length,
              certifications: certifications.length,
              experiences: experiences.length,
            }}
          />
        );
      case 'projects':
        return <CrudPanel title="Projetos" items={projects} fields={projectFields} onSave={handleSaveProject} onDelete={handleDeleteProject} />;
      case 'skills':
        return <CrudPanel title="Skills" items={skills} fields={skillFields} onSave={handleSaveSkill} onDelete={handleDeleteSkill} />;
      case 'certifications':
        return <CrudPanel title="Certificações" items={certifications} fields={certFields} onSave={handleSaveCert} onDelete={handleDeleteCert} />;
      case 'experiences':
        return <CrudPanel title="Experiências" items={experiences} fields={expFields} onSave={handleSaveExp} onDelete={handleDeleteExp} />;
      case 'profile':
        return (
          <ProfileEditor />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)]
          transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">CE</span>
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">Admin</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Sair
          </button>
          <a
            href="/"
            className="block mt-2 text-center text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ← Ver portfolio
          </a>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-border)] px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
        </header>

        <div className="p-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
