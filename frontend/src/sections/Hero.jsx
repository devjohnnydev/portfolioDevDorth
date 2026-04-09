import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Send, Sparkles } from 'lucide-react';
import { useTypewriter } from '../hooks';
import Button from '../components/ui/Button';
import ParticleBackground from '../components/three/ParticleBackground';
import { heroTextVariants, staggerContainer } from '../animations/variants';
import { profileApi } from '../services/api';

const defaultHeadlines = [
  'Construindo sistemas que escalam ideias',
  'Transformando conceitos em soluções reais',
  'Engenharia full-stack de alta performance',
  'Código limpo, resultados extraordinários',
];

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const activeHeadlines = (profile?.hero_headlines && profile.hero_headlines.length > 0) ? profile.hero_headlines : defaultHeadlines;
  const typedText = useTypewriter(activeHeadlines, 70, 40, 2500);

  useEffect(() => {
    profileApi.get().then(data => {
      if (data) setProfile(data);
    }).catch(console.error);
  }, []);

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine display values
  const displayName = profile?.name || 'Carlos Eduardo';
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const displayTitle = profile?.title || 'Fullstack Developer | Systems & Scalable Solutions';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <ParticleBackground />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)]/30 via-transparent to-[var(--color-bg-primary)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Content */}
      <motion.div
        className="relative z-10 section-container text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Status Badge */}
        <motion.div variants={heroTextVariants} custom={0} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            bg-[var(--color-primary-soft)] text-[var(--color-primary)]
            border border-[var(--color-primary)]/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
            </span>
            Disponível para novos projetos
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={heroTextVariants}
          custom={1}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
        >
          <span className="text-[var(--color-text-primary)]">{firstName} </span>
          {lastName && <span className="gradient-text">{lastName}</span>}
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={heroTextVariants}
          custom={2}
          className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium mb-4 flex items-center justify-center gap-2 flex-wrap"
        >
          <Sparkles size={20} className="text-[var(--color-primary)] flex-shrink-0" />
          {displayTitle}
        </motion.p>

        {/* Typewriter */}
        <motion.div
          variants={heroTextVariants}
          custom={3}
          className="h-12 flex items-center justify-center mb-10"
        >
          <p className="text-base sm:text-lg text-[var(--color-text-tertiary)] font-mono">
            {'> '}{typedText}
            <span className="inline-block w-0.5 h-5 bg-[var(--color-primary)] ml-1 animate-pulse align-middle" />
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={heroTextVariants}
          custom={4}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            icon={Send}
            onClick={scrollToContact}
          >
            Entrar em contato
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={Download}
            onClick={scrollToProjects}
          >
            Ver projetos
          </Button>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          variants={heroTextVariants}
          custom={5}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {((profile?.stats && profile.stats.length > 0) ? profile.stats : [
            { value: '3+', label: 'Anos de exp.' },
            { value: '20+', label: 'Projetos' },
            { value: '10+', label: 'Tecnologias' },
          ]).map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-[var(--color-text-tertiary)] cursor-pointer"
          onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs font-medium">Scroll</span>
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
