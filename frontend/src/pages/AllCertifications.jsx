import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, ExternalLink, Calendar, Building2, Download, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { certificationsApi } from '../services/api';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../animations/variants';

function CertCard({ cert, index, onClick }) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      onClick={() => onClick(cert)}
      className="glass rounded-2xl p-6 group relative overflow-hidden flex flex-col h-full border border-white/10 hover:border-[var(--color-primary)]/30 transition-all duration-500 shadow-xl cursor-pointer"
      whileHover={{ y: -8 }}
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/10 transition-colors" />
      {cert.category && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[var(--color-primary-soft)] text-[var(--color-primary)] mb-4 w-fit border border-[var(--color-primary)]/10">
          {cert.category}
        </span>
      )}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500">
        <Award size={24} className="text-[var(--color-primary)]" />
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{cert.title}</h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
          <Building2 size={13} className="text-[var(--color-primary)]" /> {cert.institution}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
          <Calendar size={13} className="text-[var(--color-primary)]" /> {cert.date}
        </span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 line-clamp-3 italic">"{cert.description}"</p>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
        <button className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 group/btn hover:underline">
          Mais detalhes <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function AllCertifications() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    certificationsApi.getAll().then(data => setCerts(data)).catch(console.error);
  }, []);

  const categories = useMemo(() => {
    return ['Todas', ...new Set(certs.map(c => c.category?.trim()).filter(Boolean))];
  }, [certs]);

  const filtered = useMemo(() => {
    return certs.filter(c => {
      const matchCat = activeCategory === 'Todas' || c.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase();
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.institution.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [certs, activeCategory, searchQuery]);

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
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Todas as Certificações</h1>
            <p className="text-xs text-[var(--color-text-tertiary)]">{filtered.length} certificações encontradas</p>
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
              placeholder="Buscar certificado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs outline-none focus:border-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div
          key={`${activeCategory}-${searchQuery}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} onClick={setSelectedCert} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-[var(--color-bg-secondary)] rounded-3xl border border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-text-tertiary)]">Nenhuma certificação encontrada.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)} title="Detalhes da Certificação">
        {selectedCert && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 shadow-lg">
                <Award size={48} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{selectedCert.title}</h3>
                <p className="text-[var(--color-primary)] font-semibold mb-4">{selectedCert.institution}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-tertiary)]">{selectedCert.category || 'Geral'}</span>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]"><Calendar size={14} /> {selectedCert.date}</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">Sobre esta formação</h4>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed whitespace-pre-wrap">{selectedCert.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-border)]">
              {selectedCert.file_url && (
                <Button variant="primary" className="flex-1" icon={Download} onClick={() => {
                  const url = selectedCert.file_url.startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${selectedCert.file_url}` : selectedCert.file_url;
                  window.open(url, '_blank');
                }}>Baixar Certificado</Button>
              )}
              {selectedCert.credential_url && selectedCert.credential_url !== '#' && (
                <Button variant="secondary" className="flex-1" icon={ExternalLink} onClick={() => window.open(selectedCert.credential_url, '_blank')}>Ver Credencial Online</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
