import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, CheckCircle, AlertCircle, MapPin, ArrowUpRight } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '../animations/variants';
import { profileApi } from '../services/api';

const Github = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.12-.34 6.4-1.51 6.4-6.9a5.4 5.4 0 0 0-1.5-3.89C18.8 3.5 18 2 18 2s-1.3-.4-3.5 1.1a12.3 12.3 0 0 0-6 0C6.3 1.6 5 2 5 2s-.8 1.5-.1 2.1A5.4 5.4 0 0 0 3.4 8c0 5.39 3.28 6.56 6.4 6.9a4.8 4.8 0 0 0-1 3.02V22"/><path d="M9 20c-4.3 1.4-5.3-2-8-2"/></svg>
);

const Linkedin = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Instagram = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const defaultSocialLinks = [
  { icon: Github, label: 'GitHub', href: '#', color: '#333', key: 'github' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', color: '#0A66C2', key: 'linkedin' },
  { icon: Mail, label: 'Email', href: '#', color: '#EA4335', key: 'email' },
  { icon: Instagram, label: 'Instagram', href: '#', color: '#E4405F', key: 'instagram' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#', color: '#25D366', key: 'whatsapp' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [sending, setSending] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactLocation, setContactLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then(data => {
      if (data) {
        if (data.location) setContactLocation(data.location);
        if (data.social_links) {
          const links = defaultSocialLinks.map(link => {
            const url = data.social_links[link.key];
            if (!url) return link;
            let href = url;
            if (link.key === 'email' && !url.startsWith('mailto:')) {
              href = `mailto:${url}`;
            }
            return { ...link, href };
          });
          setSocialLinks(links);
        } else {
          setSocialLinks(defaultSocialLinks);
        }
      } else {
        setContactLocation('Brasil — Remoto');
        setSocialLinks(defaultSocialLinks);
      }
    }).catch(err => {
      console.error(err);
      setContactLocation('Brasil — Remoto');
      setSocialLinks(defaultSocialLinks);
    }).finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate send — replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl -translate-x-1/2" />

      <div className="section-container">
        <SectionHeader
          badge="Contato"
          title="Vamos conversar?"
          subtitle="Estou sempre aberto a novas oportunidades, projetos e parcerias. Entre em contato!"
        />

        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Info side */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={slideInLeft}>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                Tem um projeto em mente?
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                Seja para um projeto, oportunidade de trabalho ou apenas para trocar uma ideia sobre tecnologia — estou disponível!
              </p>
            </motion.div>

            <motion.div variants={slideInLeft} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <MapPin size={16} className="text-[var(--color-primary)]" />
              {contactLocation}
            </motion.div>

            {/* Social Links */}
            <motion.div variants={slideInLeft}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-4">
                Redes sociais
              </p>
              <div className="space-y-2">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl text-[var(--color-text-secondary)]
                      hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]
                      transition-all duration-300 group"
                    whileHover={{ x: 6 }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                      style={{ backgroundColor: `${link.color}15` }}
                    >
                      <link.icon size={16} style={{ color: link.color }} />
                    </div>
                    <span className="text-sm font-medium flex-1">{link.label}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Nome
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                      text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
                      focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                      outline-none transition-all text-sm"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                      text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
                      focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                      outline-none transition-all text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Assunto
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
                    focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                    outline-none transition-all text-sm"
                  placeholder="Assunto da mensagem"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
                    focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                    outline-none transition-all text-sm resize-none"
                  placeholder="Descreva seu projeto ou ideia..."
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={Send}
                className="w-full"
                loading={sending}
              >
                {sending ? 'Enviando...' : 'Enviar mensagem'}
              </Button>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-[var(--color-success)] bg-[var(--color-success)]/10 p-3 rounded-xl"
                >
                  <CheckCircle size={16} />
                  Mensagem enviada com sucesso!
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-[var(--color-error)]/10 p-3 rounded-xl"
                >
                  <AlertCircle size={16} />
                  Erro ao enviar. Tente novamente.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
