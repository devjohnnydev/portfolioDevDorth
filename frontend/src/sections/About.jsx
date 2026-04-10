import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Code2, TrendingUp, Calendar } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '../animations/variants';
import { useAnimatedCounter } from '../hooks';
import { experiencesApi, profileApi } from '../services/api';

const stats = [
  { icon: Calendar, value: 3, suffix: '+', label: 'Anos de Experiência' },
  { icon: Code2, value: 20, suffix: '+', label: 'Projetos Entregues' },
  { icon: TrendingUp, value: 10, suffix: '+', label: 'Tecnologias Dominadas' },
  { icon: Award, value: 5, suffix: '+', label: 'Certificações' },
];

const mockTimeline = [
  {
    year: '2024 — Presente',
    title: 'Fullstack Developer',
    company: 'Projetos Independentes',
    description: 'Desenvolvimento de sistemas completos com React, FastAPI, PostgreSQL. Foco em arquiteturas escaláveis e produtos SaaS.',
    icon: Briefcase,
    type: 'work',
  },
  {
    year: '2023',
    title: 'Estudos Avançados',
    company: 'Autodidata & Cursos',
    description: 'Aprofundamento em backend, bancos de dados, deploy, Docker e arquitetura de software.',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2022',
    title: 'Início na Programação',
    company: 'Primeiros Passos',
    description: 'Fundamentos de HTML, CSS, JavaScript e Python. Construção dos primeiros projetos pessoais.',
    icon: Code2,
    type: 'milestone',
  },
];

function StatCard({ icon: Icon, value, suffix, label }) {
  // If value is string (from db like '20+'), don't use animated counter
  const isString = typeof value === 'string';
  const displayValue = isString ? value.replace(/[^0-9]/g, '') : value;
  const displaySuffix = isString ? value.replace(/[0-9]/g, '') : (suffix || '');

  const [ref, count] = useAnimatedCounter(parseInt(displayValue) || 0, 2000);

  // Fallback to Award icon
  const SafeIcon = Icon || Award;

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="card p-6 text-center group"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-primary-soft)]
        flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
        <SafeIcon size={22} className="text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
      </div>
      <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
        {count}{displaySuffix}
      </p>
      <p className="text-sm text-[var(--color-text-tertiary)]">{label}</p>
    </motion.div>
  );
}

function TimelineItem({ item, index }) {
  const isLeft = index % 2 === 0;
  // Fallback to Briefcase if there is no icon defined
  const Icon = item.icon || Briefcase;

  return (
    <motion.div
      variants={isLeft ? slideInLeft : slideInRight}
      className={`flex items-center gap-6 mb-12 last:mb-0 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col md:flex-row`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
        <motion.div
          className="card p-6 group"
          whileHover={{ scale: 1.02 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] mb-2">
            <Calendar size={12} />
            {item.period || item.year}
          </span>
          <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
            {item.title}
          </h4>
          <p className="text-sm font-medium text-[var(--color-primary)] mb-2">
            {item.company}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
            {item.description}
          </p>
        </motion.div>
      </div>

      {/* Timeline node */}
      <div className="relative flex-shrink-0">
        <motion.div
          className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-lg z-10 relative"
          whileHover={{ scale: 1.2 }}
        >
          <Icon size={20} className="text-white" />
        </motion.div>
        {/* Line */}
        <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-[var(--color-border)]" />
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

export default function About() {
  const [experiences, setExperiences] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    experiencesApi.getAll().then(data => {
      if (data && data.length > 0) setExperiences(data);
      else setExperiences(mockTimeline);
    }).catch(err => {
      console.error(err);
      setExperiences(mockTimeline);
    });

    profileApi.get().then(data => {
      if (data) setProfile(data);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="about" className="py-24 relative">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="section-container">
        {/* Glassmorphism Container */}
        <motion.div 
          className="relative glass-card p-8 md:p-12 mb-20 rounded-[2.5rem] overflow-hidden border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative background glow inside the glass card */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Formatted Text */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 
                  text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-4">
                  Sobre Mim
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-6">
                  {profile?.about_title || 'Transformando ideias em código'}
                </h2>
                <div className="space-y-4 text-lg text-[var(--color-text-secondary)] leading-relaxed
                  [&>p]:mb-4 last:[&>p]:mb-0">
                  {profile?.about_subtitle ? (
                    profile.about_subtitle.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>Desenvolvedor apaixonado por criar soluções que fazem a diferença. Cada projeto é uma oportunidade de superar limites.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Image with 3D Hover */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                className="relative group perspective-1000"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Image Container with 3D Tilt Effect */}
                <motion.div
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out"
                  whileHover={{ 
                    rotateY: 15, 
                    rotateX: -10,
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(var(--color-primary-rgb), 0.5)"
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {profile?.about_image_url ? (
                    <img 
                      src={profile.about_image_url.startsWith('/api') ? `${import.meta.env.VITE_API_URL || ''}${profile.about_image_url}` : profile.about_image_url} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt="About Profile" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                      <Code2 size={64} className="text-white opacity-20" />
                    </div>
                  )}

                  {/* Dynamic Shine Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Inner Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-[var(--color-primary)]/50 transition-colors duration-500 pointer-events-none" />
                </motion.div>

                {/* Background Glow behind image */}
                <div className="absolute -inset-4 bg-[var(--color-primary)] opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-opacity duration-500 -z-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        >
          {((profile?.stats && profile.stats.length > 0) ? profile.stats : stats).map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <motion.h3
            className="text-2xl font-bold text-center mb-12 text-[var(--color-text-primary)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Minha <span className="gradient-text">Jornada</span>
          </motion.h3>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {experiences.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
