import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download, FileText, Briefcase, GraduationCap, Award,
  Code2, Globe, Mail, MapPin, Loader2
} from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { fadeInUp } from '../animations/variants';
import {
  profileApi, projectsApi, skillsApi,
  certificationsApi, experiencesApi
} from '../services/api';

/* ══════════════════════════════════════════
   SEPARATOR & SUBTITLE COMPONENTS
   ══════════════════════════════════════════ */
function Divider() {
  return <div className="w-full h-px bg-[var(--color-border)] my-6" />;
}

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

function TimelineItem({ title, subtitle, description }) {
  return (
    <div className="relative pl-6 pb-5 last:pb-0 border-l-2 border-[var(--color-border)]">
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

  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileApi.get().catch(() => null),
      experiencesApi.getAll().catch(() => []),
      projectsApi.getAll().catch(() => []),
      certificationsApi.getAll().catch(() => []),
      skillsApi.getAll().catch(() => []),
    ]).then(([p, e, proj, c, s]) => {
      setProfile(p);
      setExperiences(e);
      setProjects(proj);
      setCertifications(c);
      setSkills(s);
      // Education and languages come from the profile
      if (p?.resume_education && p.resume_education.length > 0) {
        setEducation(p.resume_education);
      }
      if (p?.resume_languages && p.resume_languages.length > 0) {
        setLanguages(p.resume_languages);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  /* ── PDF Export ── */
  const handleExportPDF = async () => {
    if (isExporting || !resumeRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

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
      const totalPdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Curriculo_${(profile?.name || 'Profissional').replace(/\s/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Don't render if no profile data at all
  if (!isLoading && !profile) return null;

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--color-accent)]/[0.03] rounded-full blur-[100px]" />

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Currículo"
          title={profile?.resume_config?.titleHighlight
            ? `${profile.resume_config.titleHighlight} ${profile.resume_config.titleNormal || ''}`
            : 'Currículo Profissional'}
          subtitle={profile?.resume_config?.subtitle || 'Visualize e exporte meu currículo completo em PDF com um clique.'}
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
              <><Loader2 size={18} className="animate-spin" /> Exportando...</>
            ) : (
              <><Download size={18} /> {profile?.resume_config?.buttonText || 'Exportar como PDF'}</>
            )}
          </button>
        </motion.div>

        {/* RESUME CARD */}
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
            {/* 1. HEADER */}
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">{profile.name}</h2>
              <p className="text-lg font-medium text-[var(--color-primary)] mt-1">{profile.title}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                {profile.email && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <Mail size={13} className="text-[var(--color-primary)]" /> {profile.email}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <MapPin size={13} className="text-[var(--color-primary)]" /> {profile.location}
                  </span>
                )}
                {profile.resume_website && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <Globe size={13} className="text-[var(--color-primary)]" /> {profile.resume_website}
                  </span>
                )}
              </div>
            </div>

            {/* 2. RESUMO PROFISSIONAL */}
            {profile.bio && (
              <>
                <Divider />
                <div>
                  <ResumeSubtitle icon={FileText}>Resumo Profissional</ResumeSubtitle>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{profile.bio}</p>
                </div>
              </>
            )}

            {/* 3. EXPERIÊNCIA PROFISSIONAL */}
            {experiences.length > 0 && (
              <>
                <Divider />
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
              </>
            )}

            {/* 4. EDUCAÇÃO */}
            {education.length > 0 && (
              <>
                <Divider />
                <div>
                  <ResumeSubtitle icon={GraduationCap}>Educação</ResumeSubtitle>
                  <div className="ml-1">
                    {education.map((edu, i) => (
                      <TimelineItem
                        key={i}
                        title={edu.title}
                        subtitle={`${edu.institution} • ${edu.period}`}
                        description={edu.description}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 5. PROJETOS RELEVANTES */}
            {projects.length > 0 && (
              <>
                <Divider />
                <div>
                  <ResumeSubtitle icon={Code2}>Projetos Relevantes</ResumeSubtitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projects.slice(0, 4).map((proj) => (
                      <div key={proj.id} className="rounded-xl p-4 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                        <h5 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{proj.title}</h5>
                        <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed mb-2 line-clamp-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(proj.tech || '').split(',').slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/10">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 6. CERTIFICAÇÕES */}
            {certifications.length > 0 && (
              <>
                <Divider />
                <div>
                  <ResumeSubtitle icon={Award}>Certificações</ResumeSubtitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{cert.title}</p>
                          <p className="text-xs text-[var(--color-text-tertiary)]">{cert.institution} • {cert.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 7. TECNOLOGIAS & HABILIDADES */}
            {skills.length > 0 && (
              <>
                <Divider />
                <div>
                  <ResumeSubtitle icon={Code2}>Tecnologias & Habilidades</ResumeSubtitle>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 8. IDIOMAS */}
            {languages.length > 0 && (
              <>
                <Divider />
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
