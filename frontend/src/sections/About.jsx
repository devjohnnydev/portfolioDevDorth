import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Code2, TrendingUp, Calendar } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '../animations/variants';
import { useAnimatedCounter } from '../hooks';

const stats = [
  { icon: Calendar, value: 3, suffix: '+', label: 'Anos de Experiência' },
  { icon: Code2, value: 20, suffix: '+', label: 'Projetos Entregues' },
  { icon: TrendingUp, value: 10, suffix: '+', label: 'Tecnologias Dominadas' },
  { icon: Award, value: 5, suffix: '+', label: 'Certificações' },
];

const timeline = [
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
  const [ref, count] = useAnimatedCounter(value, 2000);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="card p-6 text-center group"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-primary-soft)]
        flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
        <Icon size={22} className="text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
      </div>
      <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
        {count}{suffix}
      </p>
      <p className="text-sm text-[var(--color-text-tertiary)]">{label}</p>
    </motion.div>
  );
}

function TimelineItem({ item, index }) {
  const isLeft = index % 2 === 0;
  const Icon = item.icon;

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
            {item.year}
          </span>
          <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
            {item.title}
          </h4>
          <p className="text-sm font-medium text-[var(--color-primary)] mb-2">
            {item.company}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
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
  return (
    <section id="about" className="py-24 relative">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="section-container">
        <SectionHeader
          badge="Sobre Mim"
          title="Transformando ideias em código"
          subtitle="Desenvolvedor apaixonado por criar soluções que fazem a diferença. Cada projeto é uma oportunidade de superar limites."
        />

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
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
            {timeline.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
