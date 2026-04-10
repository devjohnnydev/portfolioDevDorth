import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Code2, Briefcase, TrendingUp, Zap, Globe } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { useAnimatedCounter } from '../hooks';
import { profileApi } from '../services/api';

const iconMap = { Code2, Briefcase, TrendingUp, Zap };

function MetricCard({ icon, value, suffix, label, color }) {
  const IconComp = (typeof icon === 'string' ? iconMap[icon] : icon) || Code2;
  const [ref, count] = useAnimatedCounter(value, 2500);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      className="card p-5 group"
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}15` }}
        >
          <IconComp size={20} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {count.toLocaleString()}{suffix}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function LanguageBar({ name, percentage, color, delay }) {
  return (
    <motion.div
      className="flex items-center gap-3 group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1 }}
    >
      <span className="text-sm font-medium text-[var(--color-text-secondary)] w-24 text-right">
        {name}
      </span>
      <div className="flex-1 h-3 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <span className="text-xs font-mono text-[var(--color-text-tertiary)] w-10">
        {percentage}%
      </span>
    </motion.div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [sectionConfig, setSectionConfig] = useState({
    badge: 'Dashboard',
    title: 'Métricas & Analytics',
    subtitle: 'Uma visão em tempo real da minha atividade e crescimento como desenvolvedor.',
    languagesTitle: 'Distribuição por Linguagem',
    activityTitle: 'Atividade Recente',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then(data => {
      if (data) {
        if (data.dashboard_metrics && data.dashboard_metrics.length > 0) {
          setMetrics(data.dashboard_metrics);
        }
        if (data.dashboard_languages && data.dashboard_languages.length > 0) {
          setLanguageStats(data.dashboard_languages);
        }
        if (data.dashboard_activity && data.dashboard_activity.length > 0) {
          setRecentActivity(data.dashboard_activity);
        }
        if (data.dashboard_section_config) {
          setSectionConfig(prev => ({ ...prev, ...data.dashboard_section_config }));
        }
      }
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  // Don't render section if no data is configured
  const hasData = metrics.length > 0 || languageStats.length > 0 || recentActivity.length > 0;
  if (!isLoading && !hasData) return null;

  return (
    <section id="dashboard" className="py-24 relative">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-x-1/2" />

      <div className="section-container">
        <SectionHeader
          badge={isLoading ? '' : sectionConfig.badge}
          title={isLoading ? '' : sectionConfig.title}
          subtitle={isLoading ? '' : sectionConfig.subtitle}
        />

        {/* Metrics Grid */}
        {metrics.length > 0 && (
          <motion.div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {metrics.map((m, i) => (
              <MetricCard key={m.label || i} {...m} />
            ))}
          </motion.div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-${languageStats.length > 0 && recentActivity.length > 0 ? '2' : '1'} gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Language Distribution */}
          {languageStats.length > 0 && (
            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-[var(--color-primary)]" />
                <h3 className="text-lg font-bold">{sectionConfig.languagesTitle}</h3>
              </div>
              <div className="space-y-4">
                {languageStats.map((lang, i) => (
                  <LanguageBar key={lang.name || i} {...lang} delay={i} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Globe size={20} className="text-[var(--color-primary)]" />
                <h3 className="text-lg font-bold">{sectionConfig.activityTitle}</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {activity.action}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {activity.project} · {activity.date}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
