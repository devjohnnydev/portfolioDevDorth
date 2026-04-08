import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Instagram, MessageCircle, Heart, ArrowUpRight } from 'lucide-react';

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:contato@carloseduardo.dev' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-xs">CE</span>
              </div>
              <span className="text-lg font-bold">
                Carlos<span className="text-[var(--color-primary)]">Eduardo</span>
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Construindo sistemas que escalam ideias.
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-[var(--color-text-tertiary)]
                    hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]
                    transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  <link.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end">
            <motion.a
              href="#contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]
                hover:text-[var(--color-primary)] transition-colors"
              whileHover={{ x: 3 }}
            >
              Vamos trabalhar juntos
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            © {new Date().getFullYear()} Carlos Eduardo. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
            Feito com <Heart size={12} className="text-[var(--color-error)] fill-[var(--color-error)]" /> e muito código
          </p>
        </div>
      </div>
    </footer>
  );
}
