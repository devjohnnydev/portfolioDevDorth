import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download, FileText, Briefcase, GraduationCap, Award,
  Code2, Globe, Mail, MapPin, Loader2
} from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../animations/variants';
import {
  profileApi, projectsApi, skillsApi,
  certificationsApi, experiencesApi
} from '../services/api';

/* ══════════════════════════════════════════
   MOCK DATA — used when DB is empty
   ══════════════════════════════════════════ */
const mockProfile = {
  name: 'Carlos Dorth',
  title: 'Fullstack Developer',
  email: 'contato@carlosdorth.dev',
  location: 'Brasil — Remoto',
  bio: 'Desenvolvedor apaixonado por criar soluções escaláveis e interfaces modernas. Com experiência em React, Node.js, Python e bancos de dados relacionais, busco transformar ideias em produtos digitais de alto impacto que resolvam problemas reais.',
};

const mockExperiences = [
  { id: 1, title: 'Desenvolvedor Fullstack', company: 'Freelancer', period: '2022 – Presente', description: 'Desenvolvimento de sistemas web completos utilizando React, FastAPI e PostgreSQL. Implementação de painéis administrativos, APIs REST e automações.' },
  { id: 2, title: 'Desenvolvedor Frontend', company: 'Startup Tech', period: '2021 – 2022', description: 'Criação de interfaces responsivas e performáticas com React e TypeScript. Integração com APIs e otimização de performance.' },
];

const mockProjects = [
  { id: 1, title: 'Sistema de Gestão Clínica', description: 'Plataforma completa para gestão de procedimentos estéticos com agenda, financeiro e RBAC.', tech: 'React, FastAPI, PostgreSQL' },
  { id: 2, title: 'Portfolio Profissional', description: 'Portfólio dinâmico com painel admin, geração de currículo e métricas em tempo real.', tech: 'React, Vite, Framer Motion' },
  { id: 3, title: 'E-commerce Dashboard', description: 'Painel de controle para monitoramento de vendas, estoque e relatórios analíticos.', tech: 'Next.js, Tailwind, Chart.js' },
  { id: 4, title: 'API de Automação', description: 'API REST para automação de processos empresariais com filas assíncronas.', tech: 'Python, FastAPI, Redis' },
];

const mockCertifications = [
  { id: 1, title: 'Python Full Stack', institution: 'Plataforma Online', date: '2024' },
  { id: 2, title: 'React Avançado', institution: 'Curso Especializado', date: '2024' },
  { id: 3, title: 'Banco de Dados SQL', institution: 'Curso Online', date: '2023' },
];

const mockSkills = [
  { id: 1, name: 'React' }, { id: 2, name: 'TypeScript' }, { id: 3, name: 'JavaScript' },
  { id: 4, name: 'Python' }, { id: 5, name: 'FastAPI' }, { id: 6, name: 'Node.js' },
  { id: 7, name: 'PostgreSQL' }, { id: 8, name: 'Tailwind CSS' }, { id: 9, name: 'Docker' },
  { id: 10, name: 'Git' }, { id: 11, name: 'Next.js' }, { id: 12, name: 'Framer Motion' },
];

const languages = [
  { name: 'Português', level: 'Nativo' },
  { name: 'Inglês', level: 'Intermediário' },
  { name: 'Espanhol', level: 'Básico' },
];

/* ══════════════════════════════════════════
   SEPARATOR COMPONENT
   ══════════════════════════════════════════ */
function Divider() {
  return <div className="w-full h-px bg-[var(--color-border)] my-6" />;
}

/* ══════════════════════════════════════════
   SECTION TITLE (inside resume card)
   ══════════════════════════════════════════ */
function ResumeSubtitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Icon size={18} className="text-[var(--color-primary)] flex-shrink-0" />
      <h4 className="text-base font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
        {children}
      </h4>
    </div>
  );
}

/* ══════════════════════════════════════════
   TIMELINE ITEM
   ══════════════════════════════════════════ */
function TimelineItem({ title, subtitle, description }) {
  return (
    <div className="relative pl-6 pb-5 last:pb-0 border-l-2 border-[var(--color-border)]">
      {/* Bullet */}
      <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] -translate-x-[7px] ring-4 ring-[var(--color-bg-primary)]" />
      <h5 className="text-sm font-bold text-[var(--color-text-primary)]">{title}</h5>
      <p className="text-xs text-[var(--color-primary)] font-medium mb-1">{subtitle}</p>
      {description && (
        <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">{description}</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function ResumeGenerator() {
  const resumeRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Data states
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileApi.get().catch(() => null),
      experiencesApi.getAll().catch(() => []),
      projectsApi.getAll().catch(() => []),
      certificationsApi.getAll().catch(() => []),
      skillsApi.getAll().catch(() => []),
    ]).then(([p, e, proj, c, s]) => {
      setProfile(p || mockProfile);
      setExperiences(e.length > 0 ? e : mockExperiences);
      setProjects(proj.length > 0 ? proj : mockProjects);
      setCertifications(c.length > 0 ? c : mockCertifications);
      setSkills(s.length > 0 ? s : mockSkills);
    }).finally(() => setIsLoading(false));
  }, []);

  /* ── PDF Export ── */
  const handleExportPDF = async () => {
    if (isExporting || !resumeRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Temporarily force dark background for consistent PDF
      const el = resumeRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#0B0F19',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const totalPdfHeight = (imgHeight * pdfWidth) / imgWidth;

      let heightLeft = totalPdfHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      // Additional pages if content is long
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Curriculo_${(profile?.name || 'Carlos_Dorth').replace(/\s/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const displayProfile = profile || mockProfile;

  if (isLoading) {
    return (
      <section className="py-24 relative">
        <div className="section-container text-center">
          <Loader2 size={32} className="animate-spin text-[var(--color-primary)] mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="resume" className="py-28 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--color-accent)]/[0.03] rounded-full blur-[100px]" />

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Currículo"
          title="Currículo Profissional"
          subtitle="Visualize e exporte meu currículo completo em PDF com um clique."
        />

        {/* Export Button */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm
              bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white
              shadow-lg hover:shadow-[var(--shadow-glow-lg)] hover:-translate-y-0.5
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download size={18} />
                Exportar como PDF
              </>
            )}
          </button>
        </motion.div>

        {/* ═══════════════════════════════════════
           RESUME CARD
           ═══════════════════════════════════════ */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            ref={resumeRef}
            className="max-w-4xl mx-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden"
            style={{ padding: '2.5rem' }}
          >
            {/* ── 1. HEADER ── */}
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {displayProfile.name}
              </h2>
              <p className="text-lg font-medium text-[var(--color-primary)] mt-1">
                {displayProfile.title}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                {displayProfile.email && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <Mail size={13} className="text-[var(--color-primary)]" />
                    {displayProfile.email}
                  </span>
                )}
                {displayProfile.location && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <MapPin size={13} className="text-[var(--color-primary)]" />
                    {displayProfile.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                  <Globe size={13} className="text-[var(--color-primary)]" />
                  carlosdorth.dev
                </span>
              </div>
            </div>

            <Divider />

            {/* ── 2. RESUMO PROFISSIONAL ── */}
            <div>
              <ResumeSubtitle icon={FileText}>Resumo Profissional</ResumeSubtitle>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {displayProfile.bio || mockProfile.bio}
              </p>
            </div>

            <Divider />

            {/* ── 3. EXPERIÊNCIA PROFISSIONAL ── */}
            <div>
              <ResumeSubtitle icon={Briefcase}>Experiência Profissional</ResumeSubtitle>
              <div className="ml-1">
                {experiences.map((exp) => (
                  <TimelineItem
                    key={exp.id}
                    title={exp.title}
                    subtitle={`${exp.company} • ${exp.period}`}
                    description={exp.description}
                  />
                ))}
              </div>
            </div>

            <Divider />

            {/* ── 4. EDUCAÇÃO ── */}
            <div>
              <ResumeSubtitle icon={GraduationCap}>Educação</ResumeSubtitle>
              <div className="ml-1">
                <TimelineItem
                  title="Análise e Desenvolvimento de Sistemas"
                  subtitle="Instituição de Ensino • 2021 – 2024"
                />
                <TimelineItem
                  title="Curso Técnico em Informática"
                  subtitle="Escola Técnica • 2019 – 2021"
                />
              </div>
            </div>

            <Divider />

            {/* ── 5. PROJETOS RELEVANTES ── */}
            <div>
              <ResumeSubtitle icon={Code2}>Projetos Relevantes</ResumeSubtitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.slice(0, 4).map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-xl p-4 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
                  >
                    <h5 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
                      {proj.title}
                    </h5>
                    <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed mb-2 line-clamp-2">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.tech || '').split(',').slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/10"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* ── 6. CERTIFICAÇÕES ── */}
            <div>
              <ResumeSubtitle icon={Award}>Certificações</ResumeSubtitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{cert.title}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {cert.institution} • {cert.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* ── 7. TECNOLOGIAS & HABILIDADES ── */}
            <div>
              <ResumeSubtitle icon={Code2}>Tecnologias & Habilidades</ResumeSubtitle>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 text-xs font-medium rounded-lg
                      bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]
                      border border-[var(--color-border)]"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <Divider />

            {/* ── 8. IDIOMAS ── */}
            <div>
              <ResumeSubtitle icon={Globe}>Idiomas</ResumeSubtitle>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{lang.name}</span>
                    <span className="text-xs text-[var(--color-text-tertiary)]">— {lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
