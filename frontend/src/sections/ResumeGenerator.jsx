import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Sparkles, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { fadeInUp } from '../animations/variants';
import { profileApi } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function ResumeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState(null);
  const [texts, setTexts] = useState({
    titleHighlight: 'Currículo',
    titleNormal: 'Profissional',
    subtitle: 'Gere automaticamente um currículo completo com todos os meus dados, projetos, skills e experiências em formato PDF profissional.',
    buttonText: 'Gerar Currículo PDF'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then(data => {
      if (data?.resume_config) {
        setTexts(prev => ({ ...prev, ...data.resume_config }));
      }
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/resume/generate`);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        console.error('PDF generation failed:', res.status, errorText);
        setError('Erro ao gerar o PDF. Tente novamente.');
        return;
      }
      
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/pdf')) {
        console.error('Response is not PDF, content-type:', contentType);
        setError('Resposta inválida do servidor.');
        return;
      }

      const blob = await res.blob();
      
      if (blob.size < 100) {
        console.error('PDF too small, likely empty:', blob.size);
        setError('PDF gerado está vazio. Verifique os dados do perfil.');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Curriculo_Profissional.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsGenerated(true);
    } catch (err) {
      console.error('PDF fetch error:', err);
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setIsGenerating(false);
      if (!error) {
        setTimeout(() => {
          setIsGenerated(false);
          setError(null);
        }, 4000);
      }
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
            className={`card p-10 md:p-14 relative overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-4 text-sm text-red-500"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

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
