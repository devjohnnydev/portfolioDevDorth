import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { fadeInUp } from '../animations/variants';
import { profileApi } from '../services/api';

export default function ResumeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [texts, setTexts] = useState({
    titleHighlight: 'Currículo',
    titleNormal: ' Profissional',
    subtitle: 'Gere automaticamente um currículo completo com todos os meus dados, projetos, skills e experiências em formato PDF profissional.',
    buttonText: 'Gerar Currículo PDF'
  });

  useEffect(() => {
    profileApi.get().then(data => {
      if (data?.resume_config) {
        setTexts(prev => ({ ...prev, ...data.resume_config }));
      }
    }).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Try API first
      const res = await fetch('/api/resume/generate');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Carlos_Eduardo_CV.pdf';
        a.click();
        URL.revokeObjectURL(url);
        setIsGenerated(true);
      } else {
        // Fallback — show message
        setIsGenerated(true);
      }
    } catch {
      // API not available — show message
      setIsGenerated(true);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setIsGenerated(false), 4000);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5" />
      
      <div className="section-container relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={fadeInUp}
            className="card p-10 md:p-14 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-primary)]/5 to-transparent shimmer" />

            <motion.div
              variants={fadeInUp}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]
                flex items-center justify-center shadow-lg"
            >
              <FileText size={28} className="text-white" />
            </motion.div>

            <motion.h3
              variants={fadeInUp}
              className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-3"
            >
              {texts.titleHighlight} <span className="gradient-text">{texts.titleNormal}</span>
            </motion.h3>

            <motion.p
              variants={fadeInUp}
              className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto"
            >
              {texts.subtitle}
            </motion.p>

            {/* Features */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {['Dados atualizados', 'Layout profissional', 'Download instantâneo'].map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)]
                    bg-[var(--color-bg-secondary)] px-3 py-1.5 rounded-full border border-[var(--color-border)]"
                >
                  <Sparkles size={12} className="text-[var(--color-primary)]" />
                  {feature}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                variant="primary"
                size="lg"
                icon={isGenerating ? Loader2 : isGenerated ? CheckCircle : Download}
                onClick={handleGenerate}
                disabled={isGenerating}
                className={isGenerating ? '[&_svg]:animate-spin' : ''}
              >
                {isGenerating
                  ? 'Gerando PDF...'
                  : isGenerated
                  ? 'Currículo gerado!'
                  : texts.buttonText}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
