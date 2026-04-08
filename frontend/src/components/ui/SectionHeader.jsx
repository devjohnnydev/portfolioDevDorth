import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';

export default function SectionHeader({ title, subtitle, badge, align = 'center', className = '' }) {
  return (
    <motion.div
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {badge && (
        <motion.span
          variants={fadeInUp}
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4
            bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          {badge}
        </motion.span>
      )}
      <motion.h2
        variants={fadeInUp}
        custom={1}
        className="section-title"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeInUp}
          custom={2}
          className={`section-subtitle mt-4 ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
