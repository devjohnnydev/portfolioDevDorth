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
   HELPER: Format YYYY-MM date strings
   ══════════════════════════════════════════ */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  const parts = String(dateStr).split('-');
  if (parts.length === 2) {
    const monthIdx = parseInt(parts[1], 10) - 1;
    return `${months[monthIdx] || parts[1]}/${parts[0]}`;
  }
  return dateStr;
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
      if (p?.resume_education && p.resume_education.length > 0) {
        setEducation(p.resume_education);
      }
      if (p?.resume_languages && p.resume_languages.length > 0) {
        setLanguages(p.resume_languages);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  /* ══════════════════════════════════════════
     PROGRAMMATIC PDF EXPORT — jsPDF ONLY
     ══════════════════════════════════════════ */
  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // Dynamic import to avoid SSR/CJS issues
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();   // 210
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const style = window.getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');
      
      function getRGB(varName, fallbackHex) {
        const val = style.getPropertyValue(varName).trim();
        const hex = /^#[0-9A-Fa-f]{3,6}$/.test(val) ? val : fallbackHex;
        let c = hex.substring(1).split('');
        if(c.length === 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255];
      }

      // ── Dynamic Color palette from System ──
      const C = {
        bg:        getRGB('--color-surface', isDark ? '#0F172A' : '#FFFFFF'),
        white:     getRGB('--color-text-primary', isDark ? '#F1F5F9' : '#0F172A'),
        green:     getRGB('--color-primary', isDark ? '#3B82F6' : '#2563EB'),
        gray:      getRGB('--color-text-secondary', isDark ? '#94A3B8' : '#475569'),
        grayDark:  getRGB('--color-text-tertiary', isDark ? '#64748B' : '#94A3B8'),
        line:      getRGB('--color-border', isDark ? '#1E293B' : '#E2E8F0'),
      };

      // ── Draw dark background on current page ──
      function drawPageBg() {
        pdf.setFillColor(...C.bg);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }

      // ── Check if we need a new page ──
      function checkPage(neededSpace) {
        if (y + neededSpace > pageHeight - margin) {
          pdf.addPage();
          drawPageBg();
          y = margin;
        }
      }

      // ── Write multiline text with automatic page breaks ──
      function writeMultiline(text, x, fontSize, color, fontStyle = 'normal', maxW = contentWidth) {
        if (!text) return;
        pdf.setFont('helvetica', fontStyle);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...color);
        // Replace excessive newlines with a single newline to prevent giant gaps
        const cleanText = text.replace(/\n{2,}/g, '\n\n');
        const lines = pdf.splitTextToSize(cleanText, maxW);
        const lineHeight = fontSize * 0.45;
        
        for (let i = 0; i < lines.length; i++) {
          checkPage(lineHeight);
          if (lines[i].trim() === '') {
            // Give only a small gap for paragraph separation
            y += lineHeight * 0.5;
          } else {
            pdf.text(lines[i], x, y);
            y += lineHeight;
          }
        }
      }

      // ── Draw a horizontal divider line ──
      function drawDivider() {
        y += 4;
        checkPage(2);
        pdf.setDrawColor(...C.line);
        pdf.setLineWidth(0.3);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 7;
      }

      // ── Draw a section title with green bullet ──
      function drawSectionTitle(title) {
        drawDivider();
        checkPage(12);
        // Green bullet circle aligned with text
        pdf.setFillColor(...C.green);
        pdf.circle(margin + 1.5, y - 1.5, 1.8, 'F');
        // Title text (Title Case, Larger)
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(...C.white);
        pdf.text(title, margin + 6, y);
        y += 8;
      }

      // ══════════════════════════════════════
      //  START BUILDING THE PDF
      // ══════════════════════════════════════

      drawPageBg();

      const p = profile || {};
      const name = p.name || 'Profissional';

      // ─── HEADER ───
      // Name (centered, large, bold)
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(26);
      pdf.setTextColor(...C.white);
      const nameWidth = pdf.getTextWidth(name);
      pdf.text(name, (pageWidth - nameWidth) / 2, y);
      y += 9;

      // Title / Cargo (centered, green, slightly larger)
      const jobTitle = (p.title || 'Desenvolvedor Fullstack').toUpperCase();
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(...C.green);
      const titleW = pdf.getTextWidth(jobTitle);
      pdf.text(jobTitle, (pageWidth - titleW) / 2, y);
      y += 10; // Better spacing before contacts

      // Contact line (centered, gray)
      const contactParts = [];
      if (p.email) contactParts.push(p.email);
      if (p.location) contactParts.push(p.location);
      if (p.phone) contactParts.push(p.phone);
      if (contactParts.length > 0) {
        const contactLine = contactParts.join('  •  ');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(...C.gray);
        const cw = pdf.getTextWidth(contactLine);
        pdf.text(contactLine, (pageWidth - cw) / 2, y);
        y += 5;
      }

      // Links line (centered, green to match image)
      const linkParts = [];
      if (p.linkedin) linkParts.push(p.linkedin);
      if (p.github) linkParts.push(p.github);
      if (p.resume_website) linkParts.push(p.resume_website);
      if (linkParts.length > 0) {
        const linksLine = linkParts.join('  |  ');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(...C.green);
        const lw = pdf.getTextWidth(linksLine);
        pdf.text(linksLine, (pageWidth - lw) / 2, y);
        y += 8; // Extra space after header
      }

      // ─── RESUMO PROFISSIONAL ───
      if (p.bio) {
        drawSectionTitle('Resumo Profissional');
        writeMultiline(p.bio, margin, 10, C.gray, 'normal', contentWidth); // Font size 10
        y += 3;
      }

      // ─── EXPERIÊNCIA PROFISSIONAL ───
      if (experiences.length > 0) {
        drawSectionTitle('Experiência Profissional');
        experiences.forEach((exp) => {
          checkPage(24);
          // Role (white, bold)
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11.5); // Fixed: Job title needs to be larger!
          pdf.setTextColor(...C.white);
          pdf.text(exp.title || '', margin, y);
          y += 5;
          // Company • Period (green)
          const subLine = [exp.company, exp.period].filter(Boolean).join(' • ');
          if (subLine) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(...C.green);
            pdf.text(subLine, margin, y);
            y += 5;
          }
          // Description (gray, multiline)
          if (exp.description) {
            writeMultiline(exp.description, margin, 9.5, C.gray, 'normal', contentWidth);
          }
          y += 5; // Spacing between jobs
        });
      }

      // ─── EDUCAÇÃO ───
      if (education.length > 0) {
        drawSectionTitle('Educação');
        education.forEach((edu) => {
          checkPage(16);
          // Degree (white, bold)
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11.5);
          pdf.setTextColor(...C.white);
          pdf.text(edu.title || edu.degree || '', margin, y);
          y += 5;
          // Institution • Period (green)
          const subLine = [edu.institution, edu.period].filter(Boolean).join(' • ');
          if (subLine) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(...C.green);
            pdf.text(subLine, margin, y);
            y += 5;
          }
          if (edu.description) {
            writeMultiline(edu.description, margin, 9.5, C.gray, 'normal', contentWidth);
          }
          y += 4;
        });
      }

      // ─── PROJETOS RELEVANTES ───
      if (projects.length > 0) {
        drawSectionTitle('Projetos Relevantes');
        projects.slice(0, 6).forEach((proj) => {
          checkPage(20);
          // Project name (white, bold)
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(...C.white);
          pdf.text(proj.title || proj.name || '', margin, y);
          y += 5;
          // Description (gray, multiline)
          if (proj.description) {
            writeMultiline(proj.description, margin, 9.5, C.gray, 'normal', contentWidth);
          }
          // Technologies (green, small)
          const techStr = proj.tech || (proj.technologies ? proj.technologies.join(' • ') : '');
          if (techStr) {
            y += 0.5;
            checkPage(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(...C.green);
            pdf.text(techStr.split(',').join(' • ').trim(), margin, y);
            y += 4;
          }
          y += 4; // Spacing between projects
        });
      }

      // ─── CERTIFICAÇÕES ───
      if (certifications.length > 0) {
        drawSectionTitle('Certificações');
        certifications.forEach((cert) => {
          checkPage(12);
          // Green bullet
          pdf.setFillColor(...C.green);
          pdf.circle(margin + 1.5, y - 1.2, 1, 'F');
          // Name (white)
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9.5);
          pdf.setTextColor(...C.white);
          pdf.text(cert.title || cert.name || '', margin + 5, y);
          y += 4.5;
          // Institution • Date (gray)
          const certSub = [cert.institution, formatDate(cert.date)].filter(Boolean).join(' • ');
          if (certSub) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(...C.grayDark);
            pdf.text(certSub, margin + 5, y);
            y += 5;
          }
        });
      }

      // ─── TECNOLOGIAS & HABILIDADES ───
      if (skills.length > 0) {
        drawSectionTitle('Tecnologias & Habilidades');
        const skillNames = skills.map((s) => s.name || s).filter(Boolean);
        const skillLine = skillNames.join('  •  ');
        writeMultiline(skillLine, margin, 9, C.gray, 'normal', contentWidth);
        y += 2;
      }

      // ─── IDIOMAS ───
      if (languages.length > 0) {
        drawSectionTitle('Idiomas');
        checkPage(8);
        const langParts = languages.map((l) => `${l.name} — ${l.level}`);
        const langLine = langParts.join('   |   ');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(...C.white);
        pdf.text(langLine, margin, y);
        y += 5;
      }

      // ═══════════════════════════════════
      //  FOOTER ON EVERY PAGE
      // ═══════════════════════════════════
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(...C.grayDark);
        // Left: Name — Currículo Profissional
        pdf.text(`${name} — Currículo Profissional`, margin, pageHeight - 8);
        // Right: Página X de Y
        const pageText = `Página ${i} de ${totalPages}`;
        const ptw = pdf.getTextWidth(pageText);
        pdf.text(pageText, pageWidth - margin - ptw, pageHeight - 8);
      }

      // ── Save ──
      const safeName = name.replace(/\s+/g, '-').toLowerCase();
      pdf.save(`curriculo-${safeName}.pdf`);

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
    <section id="resume" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--color-accent)]/[0.03] rounded-full blur-[100px]" />

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
              bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white
              shadow-lg hover:shadow-[var(--shadow-glow-lg)] hover:-translate-y-0.5
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
            className="max-w-4xl mx-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden"
            style={{ padding: '2.5rem' }}
          >
            {/* 1. HEADER */}
            <div className="mb-10 text-center">
              <h1 className="text-5xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight">
                {displayProfile.name || 'Carlos Dorth'}
              </h1>
              <p className="text-xl font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] mb-6">
                {displayProfile.title || 'Desenvolvedor Fullstack'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {displayProfile.email && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <Mail size={13} className="text-[var(--color-primary)]" /> {displayProfile.email}
                  </span>
                )}
                {displayProfile.location && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <MapPin size={13} className="text-[var(--color-primary)]" /> {displayProfile.location}
                  </span>
                )}
                {displayProfile.resume_website && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
                    <Globe size={13} className="text-[var(--color-primary)]" /> {displayProfile.resume_website}
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
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{displayProfile.bio}</p>
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
