import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, X, ChevronRight, ChevronLeft, Layers, ArrowRight } from 'lucide-react';
import { projectsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Github = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.12-.34 6.4-1.51 6.4-6.9a5.4 5.4 0 0 0-1.5-3.89C18.8 3.5 18 2 18 2s-1.3-.4-3.5 1.1a12.3 12.3 0 0 0-6 0C6.3 1.6 5 2 5 2s-.8 1.5-.1 2.1A5.4 5.4 0 0 0 3.4 8c0 5.39 3.28 6.56 6.4 6.9a4.8 4.8 0 0 0-1 3.02V22"/><path d="M9 20c-4.3 1.4-5.3-2-8-2"/></svg>
);
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { fadeInUp, staggerContainer } from '../animations/variants';

const PROJECTS_LIMIT = 6;

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
      layout
      className="card overflow-hidden group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -6 }}
    >
      {/* Image/Gradient Header */}
      <div className={`relative h-48 ${!project.images?.[0] && !project.image_url ? `bg-gradient-to-br ${colors[project.category] || colors.Fullstack}` : 'bg-zinc-800'} overflow-hidden`}>
        {/* Cover Image */}
        {(project.images?.[0] || project.image_url) && (
          <img 
            src={(project.images?.[0] || project.image_url).startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${project.images?.[0] || project.image_url}` : (project.images?.[0] || project.image_url)} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            alt={project.title}
          />
        )}

        {project.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
            <Layers size={12} />
            Destaque
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        
        {/* Floating tech icons */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {project.tech?.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider font-bold">
              {t}
            </span>
          ))}
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-[var(--color-primary)]/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="flex gap-3">
            <span className="p-3 rounded-full bg-white text-[var(--color-primary)] shadow-xl">
              <Eye size={20} />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
            {project.title}
          </h3>
          <ChevronRight size={18} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0 mt-1" />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = useMemo(() => {
    const list = [...(project.images || [])];
    if (project.image_url && !list.includes(project.image_url)) {
      list.unshift(project.image_url);
    }
    return list;
  }, [project]);

  const next = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Modal isOpen={!!project} onClose={onClose} title={project.title} size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery / Carousel */}
        <div className="lg:col-span-12">
          {images.length > 0 ? (
            <div className="relative group aspect-video rounded-2xl overflow-hidden bg-black/20 border border-[var(--color-border)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIdx}
                  src={images[currentIdx].startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${images[currentIdx]}` : images[currentIdx]}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all ${i === currentIdx ? 'w-6 bg-[var(--color-primary)]' : 'w-2 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <span className="text-zinc-500 font-medium">Sem prévia disponível</span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge">{project.category}</span>
            <div className="h-4 w-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-tertiary)] font-medium uppercase tracking-widest">Detalhes do Projeto</span>
          </div>
          
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8 whitespace-pre-wrap text-base">
            {project.longDescription}
          </p>

          {project.highlights?.length > 0 && (
            <div className="mb-0">
              <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Layers size={16} className="text-[var(--color-primary)]" />
                Destaques e Funcionalidades
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                    <span className="text-sm text-[var(--color-text-secondary)]">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Links */}
        <div className="lg:col-span-4 lg:border-l lg:border-[var(--color-border)] lg:pl-8">
          <div className="mb-8">
            <h4 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">Tecnologias</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary)]/20 uppercase tracking-tight">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">Acessar</h4>
            {project.github && project.github !== '#' && (
              <Button variant="secondary" icon={ChevronRight} href={project.github} target="_blank" className="w-full justify-start">
                Repositório
              </Button>
            )}
            {project.demo && project.demo !== '#' && (
              <Button variant="primary" icon={ExternalLink} href={project.demo} target="_blank" className="w-full justify-start">
                Site ao Vivo
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState(null);
  const [dbProjects, setDbProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    projectsApi.getAll().then(data => {
      const formatted = data.map(p => ({
        ...p,
        longDescription: p.long_description || p.description,
        tech: p.tech ? p.tech.split(',').map(t => t.trim()) : [],
        github: p.github_url || '#',
        demo: p.demo_url || '#',
        highlights: p.highlights || [],
      }));
      setDbProjects(formatted);
    }).catch(console.error);
  }, []);

  const displayList = dbProjects;
  const categories = useMemo(() => {
    const cats = ['Todos', ...new Set(displayList.map(p => p.category).filter(Boolean))];
    return cats;
  }, [displayList]);

  const filtered = useMemo(() => {
    if (activeCategory === 'Todos') return displayList;
    return displayList.filter(p => p.category === activeCategory);
  }, [displayList, activeCategory]);

  const showAll = filtered.length > PROJECTS_LIMIT;
  const visibleProjects = showAll ? filtered.slice(0, PROJECTS_LIMIT) : filtered;

  return (
    <section id="projects" className="py-24 bg-[var(--color-bg-secondary)] relative">
      <div className="section-container">
        <SectionHeader
          badge="Projetos"
          title="Trabalhos em destaque"
          subtitle="Cada projeto representa um desafio superado e uma solução construída com excelência técnica."
        />

        {/* Filters */}
        {categories.length > 1 && (
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Grid - key forces remount on filter change */}
        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          layout
        >
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>

        {filtered.length === 0 && displayList.length === 0 && (
          <p className="text-center text-[var(--color-text-tertiary)] mt-12">
            Nenhum projeto cadastrado ainda.
          </p>
        )}

        {/* Ver Todos button */}
        {showAll && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => navigate('/projects')}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm
                bg-[var(--color-bg-card)] text-[var(--color-text-primary)] border border-[var(--color-border)]
                hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-lg
                transition-all duration-300 cursor-pointer"
            >
              Ver todos os projetos ({filtered.length})
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
