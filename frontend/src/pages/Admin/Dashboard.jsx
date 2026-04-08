import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Zap, Award, Briefcase, User, LogOut,
  Plus, Pencil, Trash2, Save, X, ChevronRight, Menu
} from 'lucide-react';
import { useAdminStore } from '../../stores';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { projectsApi, skillsApi, certificationsApi, experiencesApi, profileApi, uploadApi } from '../../services/api';

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
                    <img src={formData[field.key].startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${formData[field.key]}` : formData[field.key]} className="h-20 w-20 object-cover rounded mb-2" alt="Preview"/>
                  )}
                  <input
                    type="file"
                    accept="image/*"
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
   Profile Editor Panel
   ======================================== */
function ProfileEditor() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.get();
      setProfile(data || { name: '', title: '', bio: '', email: '', location: '' });
    } catch (e) {
      console.error(e);
      setProfile({ name: '', title: '', bio: '', email: '', location: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await profileApi.update({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || '',
        location: profile.location || '',
        social_links: profile.social_links || { github: '', linkedin: '', twitter: '' },
        stats: profile.stats || [
           { label: 'Anos de exp.', value: '3+' },
           { label: 'Projetos', value: '20+' },
           { label: 'Tecnologias', value: '10+' }
        ]
      });
      alert('Perfil salvo com sucesso!');
    } catch (e) {
      alert('Erro ao salvar perfil.');
    }
  };

  if (loading) return <div className="p-8 text-center text-[var(--color-text-tertiary)]">Carregando...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Editar Perfil</h2>
      <div className="card p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Nome Completo</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)]"
            placeholder="Ex: Carlos Eduardo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Título / Cargo</label>
          <input
            type="text"
            value={profile.title || ''}
            onChange={(e) => setProfile(p => ({ ...p, title: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)]"
            placeholder="Ex: Fullstack Developer | Systems & Scalable Solutions"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Bio Curta (Sobre Mim)</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] resize-none"
            placeholder="Ex: Transformando ideias em código..."
          />
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-[var(--color-border)] mt-4">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Redes Sociais</h3>
          <div className="space-y-4">
             {['github', 'linkedin', 'twitter'].map((network) => (
               <div key={network}>
                 <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5 capitalize">{network}</label>
                 <input
                   type="text"
                   value={profile.social_links?.[network] || ''}
                   onChange={(e) => setProfile(p => ({ ...p, social_links: { ...p.social_links, [network]: e.target.value } }))}
                   className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)]"
                   placeholder={`URL do ${network}`}
                 />
               </div>
             ))}
          </div>
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-[var(--color-border)] mt-4">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Métricas & Analytics</h3>
          <div className="space-y-4">
             {(profile.stats || []).map((stat, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                     <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Valor (Ex: 20+)</label>
                     <input type="text" value={stat.value || ''}
                            onChange={(e) => {
                               const newStats = [...(profile.stats || [])];
                               newStats[index].value = e.target.value;
                               setProfile(p => ({ ...p, stats: newStats }));
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm" />
                  </div>
                  <div className="flex-1">
                     <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Rótulo (Ex: Projetos)</label>
                     <input type="text" value={stat.label || ''}
                            onChange={(e) => {
                               const newStats = [...(profile.stats || [])];
                               newStats[index].label = e.target.value;
                               setProfile(p => ({ ...p, stats: newStats }));
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm" />
                  </div>
                  <button type="button" onClick={() => {
                      const newStats = profile.stats.filter((_, i) => i !== index);
                      setProfile(p => ({ ...p, stats: newStats }));
                  }} className="mt-5 p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
                </div>
             ))}
             <Button variant="secondary" size="sm" icon={Plus} onClick={() => {
                 setProfile(p => ({ ...p, stats: [...(p.stats || []), { label: '', value: '' }] }));
             }}>Adicionar Métrica</Button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" onClick={handleSave} icon={Save}>Salvar Perfil</Button>
        </div>
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
