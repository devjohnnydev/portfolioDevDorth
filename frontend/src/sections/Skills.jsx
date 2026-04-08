import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { fadeInUp, staggerContainer } from '../../animations/variants';

const skillCategories = [
  {
    name: 'Frontend',
    color: '#3B82F6',
    skills: [
      { name: 'React', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'TypeScript', level: 75 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'TailwindCSS', level: 92 },
      { name: 'Next.js', level: 70 },
    ],
  },
  {
    name: 'Backend',
    color: '#8B5CF6',
    skills: [
      { name: 'Python', level: 88 },
      { name: 'FastAPI', level: 90 },
      { name: 'Node.js', level: 78 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'REST APIs', level: 92 },
      { name: 'Docker', level: 70 },
    ],
  },
  {
    name: 'DevOps & Tools',
    color: '#10B981',
    skills: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'Linux', level: 75 },
      { name: 'Railway', level: 80 },
      { name: 'Vercel', level: 85 },
      { name: 'CI/CD', level: 70 },
      { name: 'Nginx', level: 65 },
    ],
  },
];

function SkillBar({ skill, color, delay = 0 }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
          {skill.name}
        </span>
        <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}dd)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </motion.div>
  );
}

function SkillOrb({ skill, index, total, color }) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 130;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px - 28px)`,
        top: `calc(50% + ${y}px - 28px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-default relative group"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      >
        {skill.level}
        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-lg text-[var(--color-text-primary)] text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {skill.name}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('bars'); // 'bars' | 'orbital'

  const activeCategory = skillCategories[activeTab];

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="section-container">
        <SectionHeader
          badge="Skills"
          title="Arsenal tecnológico"
          subtitle="Tecnologias que domino e utilizo para construir soluções de impacto."
        />

        {/* Category Tabs + View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex gap-2">
            {skillCategories.map((cat, i) => (
              <motion.button
                key={cat.name}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === i
                    ? 'text-white shadow-lg'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
                style={activeTab === i ? { background: cat.color, boxShadow: `0 4px 15px ${cat.color}40` } : {}}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <button
              onClick={() => setViewMode('bars')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'bars' ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              Barras
            </button>
            <button
              onClick={() => setViewMode('orbital')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'orbital' ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm' : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              Orbital
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'bars' ? (
          <motion.div
            key={activeTab}
            className="max-w-2xl mx-auto grid gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {activeCategory.skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} color={activeCategory.color} delay={i} />
            ))}
          </motion.div>
        ) : (
          <div className="relative w-[320px] h-[320px] mx-auto">
            {/* Center */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl z-10"
              style={{ background: `linear-gradient(135deg, ${activeCategory.color}, ${activeCategory.color}bb)` }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {activeCategory.name}
            </motion.div>

            {/* Orbit ring */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-dashed border-[var(--color-border)]" />

            {/* Skill orbs */}
            {activeCategory.skills.map((skill, i) => (
              <SkillOrb
                key={skill.name}
                skill={skill}
                index={i}
                total={activeCategory.skills.length}
                color={activeCategory.color}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
