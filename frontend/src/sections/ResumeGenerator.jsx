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
  return <div className="w-full h-px bg-zinc-800 my-6" />;
}

function ResumeSubtitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Icon size={18} className="text-emerald-400 flex-shrink-0" />
      <h4 className="text-base font-bold text-white uppercase tracking-wider">
        {children}
      </h4>
    </div>
  );
}

function TimelineItem({ title, subtitle, description }) {
  return (
    <div className="relative pl-6 pb-5 last:pb-0 border-l-2 border-zinc-800">
      <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 -translate-x-[7px] ring-4 ring-zinc-950" />
      <h5 className="text-sm font-bold text-white">{title}</h5>
      <p className="text-xs text-emerald-400 font-medium mb-1">{subtitle}</p>
      {description && (
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
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
        backgroundColor: '#18181b',
        useCORS: true,
        logging: false,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
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

  // Use a safe fallback so the section NEVER disappears
  const displayProfile = profile || { name: '', title: '', bio: '', email: '', location: '' };

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
    <section id="resume" className="py-28 relative overflow-hidden bg-zinc-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-400/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-800/[0.3] rounded-full blur-[100px]" />

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Currículo"
          title={displayProfile?.resume_config?.titleHighlight
            ? `${displayProfile.resume_config.titleHighlight} ${displayProfile.resume_config.titleNormal || ''}`
            : 'Currículo Profissional'}
          subtitle={displayProfile?.resume_config?.subtitle || 'Visualize e exporte meu currículo completo em PDF com um clique.'}
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
              bg-gradient-to-r from-emerald-400 to-cyan-400 text-black
              shadow-lg hover:-translate-y-0.5
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExporting ? (
              <><Loader2 size={18} className="animate-spin" /> Exportando...</>
            ) : (
              <><Download size={18} /> {displayProfile?.resume_config?.buttonText || 'Exportar como PDF'}</>
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
            className="max-w-4xl mx-auto rounded-2xl border border-zinc-800/50 bg-zinc-900/50 shadow-xl overflow-hidden"
            style={{ padding: '2.5rem' }}
          >
            {/* 1. HEADER */}
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-white">{displayProfile.name}</h2>
              <p className="text-lg font-medium text-emerald-400 mt-1">{displayProfile.title}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                {displayProfile.email && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Mail size={13} className="text-emerald-400" /> {displayProfile.email}
                  </span>
                )}
                {displayProfile.location && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MapPin size={13} className="text-emerald-400" /> {displayProfile.location}
                  </span>
                )}
                {displayProfile.resume_website && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Globe size={13} className="text-emerald-400" /> {displayProfile.resume_website}
                  </span>
                )}
              </div>
            </div>

            {/* 2. RESUMO PROFISSIONAL */}
            {displayProfile.bio && (
              <>
                <Divider />
                <div>
                  <ResumeSubtitle icon={FileText}>Resumo Profissional</ResumeSubtitle>
                  <p className="text-sm text-zinc-400 leading-relaxed">{displayProfile.bio}</p>
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
                      <div key={proj.id} className="rounded-xl p-4 border border-zinc-700/30 bg-zinc-800/30">
                        <h5 className="text-sm font-bold text-white mb-1">{proj.title}</h5>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-2 line-clamp-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(proj.tech || '').split(',').slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
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
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-white">{cert.title}</p>
                          <p className="text-xs text-zinc-400">{cert.institution} • {cert.date}</p>
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
                      <span key={skill.id} className="px-3 py-1 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
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
                        <span className="text-sm font-medium text-white">{lang.name}</span>
                        <span className="text-xs text-zinc-500">— {lang.level}</span>
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
