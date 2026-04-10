import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Eye, ChevronRight, Layers, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/api';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../animations/variants';

const Github = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.12-.34 6.4-1.51 6.4-6.9a5.4 5.4 0 0 0-1.5-3.89C18.8 3.5 18 2 18 2s-1.3-.4-3.5 1.1a12.3 12.3 0 0 0-6 0C6.3 1.6 5 2 5 2s-.8 1.5-.1 2.1A5.4 5.4 0 0 0 3.4 8c0 5.39 3.28 6.56 6.4 6.9a4.8 4.8 0 0 0-1 3.02V22"/><path d="M9 20c-4.3 1.4-5.3-2-8-2"/></svg>
);

function ProjectCard({ project, onClick }) {
  const colors = {
    Fullstack: 'from-blue-500 to-purple-600',
    Frontend: 'from-emerald-500 to-teal-600',
    Backend: 'from-orange-500 to-red-600',
    Mobile: 'from-pink-500 to-rose-600',
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="card overflow-hidden group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -6 }}
    >
      <div className={`relative h-48 bg-gradient-to-br ${colors[project.category] || colors.Fullstack} overflow-hidden`}>
        {project.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
            <Layers size={12} /> Destaque
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {project.tech?.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-medium">{t}</span>
          ))}
        </div>
        <motion.div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white"><Eye size={20} /></span>
        </motion.div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{project.title}</h3>
          <ChevronRight size={18} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0 mt-1" />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">{project.description}</p>
      </div>
    </motion.div>
  );
}

export default function AllProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    projectsApi.getAll().then(data => {
      setProjects(data.map(p => ({
        ...p,
        longDescription: p.long_description || p.description,
        tech: p.tech ? p.tech.split(',').map(t => t.trim()) : [],
        github: p.github_url || '#',
        demo: p.demo_url || '#',
        highlights: p.highlights || [],
      })));
    }).catch(console.error);
  }, []);

  const categories = useMemo(() => {
    return ['Todos', ...new Set(projects.map(p => p.category).filter(Boolean))];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-strong border-b border-[var(--color-border)]">
        <div className="section-container flex items-center gap-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Todos os Projetos</h1>
            <p className="text-xs text-[var(--color-text-tertiary)]">{filtered.length} projetos encontrados</p>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
              <div className="flex items-center gap-2 p-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 min-w-fit cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Buscar projeto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs outline-none focus:border-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div
          key={`${activeCategory}-${searchQuery}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-[var(--color-bg-secondary)] rounded-3xl border border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-text-tertiary)]">Nenhum projeto encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title} size="lg">
        {selectedProject && (
          <>
            <span className="badge mb-4">{selectedProject.category}</span>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6 whitespace-pre-wrap">{selectedProject.longDescription}</p>
            {selectedProject.highlights?.length > 0 && typeof selectedProject.highlights[0] === 'string' && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Destaques</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProject.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedProject.tech?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Stack Tecnológica</h4>
                <div className="flex flex-wrap gap-2">{selectedProject.tech.map((t) => (<span key={t} className="badge">{t}</span>))}</div>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
              {selectedProject.github && selectedProject.github !== '#' && (
                <Button variant="secondary" icon={Github} href={selectedProject.github} size="sm">Código Fonte</Button>
              )}
              {selectedProject.demo && selectedProject.demo !== '#' && (
                <Button variant="primary" icon={ExternalLink} href={selectedProject.demo} size="sm">Ver Demo</Button>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
