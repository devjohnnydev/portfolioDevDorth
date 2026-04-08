import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { certificationsApi } from '../services/api';

const mockCertifications = [
  {
    id: 1,
    title: 'Python Full Stack',
    institution: 'Plataforma Online',
    date: '2024',
    credentialUrl: '#',
    description: 'Desenvolvimento completo com Python, incluindo FastAPI, Django e automação.',
  },
  {
    id: 2,
    title: 'React Avançado',
    institution: 'Curso Especializado',
    date: '2024',
    credentialUrl: '#',
    description: 'Hooks avançados, performance, state management e arquitetura de componentes.',
  },
  {
    id: 3,
    title: 'Banco de Dados SQL',
    institution: 'Curso Online',
    date: '2023',
    credentialUrl: '#',
    description: 'PostgreSQL, modelagem, queries avançadas, otimização e administração.',
  },
];

function CertCard({ cert, index }) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="card p-6 group relative overflow-hidden"
      whileHover={{ y: -4 }}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      {/* Badge icon */}
      <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-soft)] flex items-center justify-center mb-4
        group-hover:bg-[var(--color-primary)] transition-colors duration-300">
        <Award size={22} className="text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
        {cert.title}
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
          <Building2 size={12} />
          {cert.institution}
        </span>
        <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
          <Calendar size={12} />
          {cert.date}
        </span>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 whitespace-pre-wrap">
        {cert.description}
      </p>

      {cert.credential_url && cert.credential_url !== '#' && (
        <motion.a
          href={cert.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
          whileHover={{ x: 3 }}
        >
          Ver credencial <ExternalLink size={12} />
        </motion.a>
      )}
      {cert.credentialUrl && cert.credentialUrl !== '#' && (
        <motion.a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
          whileHover={{ x: 3 }}
        >
          Ver credencial <ExternalLink size={12} />
        </motion.a>
      )}
    </motion.div>
  );
}

export default function Certifications() {
  const [dbCerts, setDbCerts] = useState([]);

  useEffect(() => {
    certificationsApi.getAll().then(data => setDbCerts(data)).catch(console.error);
  }, []);

  const displayList = dbCerts.length > 0 ? dbCerts : mockCertifications;

  return (
    <section id="certifications" className="py-24 bg-[var(--color-bg-secondary)]">
      <div className="section-container">
        <SectionHeader
          badge="Certificações"
          title="Aprendizado contínuo"
          subtitle="Investimento constante em formação e atualização profissional."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {displayList.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
