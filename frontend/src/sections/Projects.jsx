import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Eye, X, ChevronRight, Layers } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { fadeInUp, staggerContainer } from '../../animations/variants';

const categories = ['Todos', 'Fullstack', 'Frontend', 'Backend', 'Mobile'];

const projectsData = [
  {
    id: 1,
    title: 'Sistema de Gestão Clínica',
    description: 'Sistema completo para gestão de clínicas estéticas com agendamento, financeiro, estoque e relatórios.',
    longDescription: 'Plataforma SaaS robusta desenvolvida para clínicas estéticas, com módulos completos de agendamento inteligente, gestão financeira com dashboards analíticos, controle de estoque com alertas automáticos, sistema RBAC dinâmico e geração de relatórios PDF.',
    image: null,
    category: 'Fullstack',
    tech: ['React', 'FastAPI', 'PostgreSQL', 'TailwindCSS'],
    github: '#',
    demo: '#',
    featured: true,
    highlights: ['Dashboard analítico avançado', 'Sistema RBAC dinâmico', 'Integração Stripe', 'Deploy automatizado'],
  },
  {
    id: 2,
    title: 'E-commerce Premium',
    description: 'Loja virtual completa com carrinho, pagamentos online e painel administrativo.',
    longDescription: 'E-commerce moderno com experiência de compra premium, sistema de carrinho persistente, integração completa com Stripe para pagamentos, painel admin para gestão de produtos e pedidos, e sistema de notificações em tempo real.',
    image: null,
    category: 'Fullstack',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: '#',
    demo: '#',
    featured: true,
    highlights: ['Pagamentos com Stripe', 'Painel admin completo', 'Notificações em tempo real'],
  },
  {
    id: 3,
    title: 'Dashboard Analytics',
    description: 'Dashboard de análise de dados com gráficos interativos e relatórios em tempo real.',
    longDescription: 'Plataforma de business intelligence com dashboards customizáveis, gráficos interativos com D3.js, exportação de relatórios e integração com múltiplas fontes de dados.',
    image: null,
    category: 'Frontend',
    tech: ['React', 'D3.js', 'TailwindCSS', 'Chart.js'],
    github: '#',
    demo: '#',
    featured: false,
    highlights: ['Gráficos interativos', 'Exportação PDF/Excel', 'Dados em tempo real'],
  },
  {
    id: 4,
    title: 'API REST Escalável',
    description: 'API backend com autenticação JWT, RBAC e documentação automatizada.',
    longDescription: 'API REST de alta performance construída com FastAPI, sistema de autenticação JWT com refresh tokens, controle de acesso granular RBAC, documentação OpenAPI automática e pipeline CI/CD completo.',
    image: null,
    category: 'Backend',
    tech: ['FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    github: '#',
    demo: '#',
    featured: false,
    highlights: ['JWT + Refresh Tokens', 'Rate limiting', 'Documentação automática'],
  },
  {
    id: 5,
    title: 'Portfolio Premium',
    description: 'Este portfólio que você está vendo agora — feito com React, Three.js e FastAPI.',
    longDescription: 'Portfólio de nível SaaS com backgrounds 3D interativos via Three.js, animações cinematográficas com Framer Motion, sistema admin completo, gerador de currículo PDF e design premium com light/dark mode.',
    image: null,
    category: 'Fullstack',
    tech: ['React', 'Three.js', 'FastAPI', 'Framer Motion'],
    github: '#',
    demo: '#',
    featured: true,
    highlights: ['Three.js 3D backgrounds', 'Gerador de currículo', 'Painel admin', 'Cursor interativo'],
  },
  {
    id: 6,
    title: 'Chat Real-Time',
    description: 'Aplicação de chat em tempo real com salas, notificações e envio de arquivos.',
    longDescription: 'Sistema de mensagens instantâneas com WebSockets, suporte a múltiplas salas, indicador de digitação, envio de arquivos e imagens, notificações push e interface responsiva.',
    image: null,
    category: 'Fullstack',
    tech: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
    github: '#',
    demo: '#',
    featured: false,
    highlights: ['WebSockets em tempo real', 'Envio de mídia', 'Notificações push'],
  },
];

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
      <div className={`relative h-48 bg-gradient-to-br ${colors[project.category] || colors.Fullstack} overflow-hidden`}>
        {project.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
            <Layers size={12} />
            Destaque
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        
        {/* Floating tech icons */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="flex gap-3">
            <span className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white">
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

  return (
    <Modal isOpen={!!project} onClose={onClose} title={project.title} size="lg">
      {/* Category badge */}
      <span className="badge mb-4">{project.category}</span>

      {/* Description */}
      <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
        {project.longDescription}
      </p>

      {/* Highlights */}
      {project.highlights && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Destaques</h4>
          <div className="grid grid-cols-2 gap-2">
            {project.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Stack Tecnológica</h4>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
        {project.github && project.github !== '#' && (
          <Button variant="secondary" icon={Github} href={project.github} size="sm">
            Código Fonte
          </Button>
        )}
        {project.demo && project.demo !== '#' && (
          <Button variant="primary" icon={ExternalLink} href={project.demo} size="sm">
            Ver Demo
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = activeCategory === 'Todos'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 bg-[var(--color-bg-secondary)] relative">
      <div className="section-container">
        <SectionHeader
          badge="Projetos"
          title="Trabalhos em destaque"
          subtitle="Cada projeto representa um desafio superado e uma solução construída com excelência técnica."
        />

        {/* Filters */}
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

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--color-text-tertiary)] mt-12">
            Nenhum projeto nesta categoria ainda.
          </p>
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
