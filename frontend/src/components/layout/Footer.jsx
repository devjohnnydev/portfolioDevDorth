import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Heart, ArrowUpRight } from 'lucide-react';
import { profileApi } from '../../services/api';

const Github = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.12-.34 6.4-1.51 6.4-6.9a5.4 5.4 0 0 0-1.5-3.89C18.8 3.5 18 2 18 2s-1.3-.4-3.5 1.1a12.3 12.3 0 0 0-6 0C6.3 1.6 5 2 5 2s-.8 1.5-.1 2.1A5.4 5.4 0 0 0 3.4 8c0 5.39 3.28 6.56 6.4 6.9a4.8 4.8 0 0 0-1 3.02V22"/><path d="M9 20c-4.3 1.4-5.3-2-8-2"/></svg>
);

const Linkedin = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const socialLinks = [
  { icon: Github, label: 'GitHub', key: 'github' },
  { icon: Linkedin, label: 'LinkedIn', key: 'linkedin' },
  { icon: Mail, label: 'Email', key: 'email' },
  { icon: Instagram, label: 'Instagram', key: 'instagram' },
  { icon: MessageCircle, label: 'WhatsApp', key: 'whatsapp' },
];

export default function Footer() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then(data => {
      if (data) setProfile(data);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {(profile?.name || 'CD').substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">
                {!isLoading ? (
                  <>
                    {(profile?.name || 'Carlos Dorth').trim().split(' ')[0]}
                    <span className="text-[var(--color-primary)]">
                      {' ' + (profile?.name || 'Carlos Dorth').trim().split(' ').slice(1).join(' ')}
                    </span>
                  </>
                ) : null}
              </span>
              {(profile?.title || !isLoading) && (
                <span className="text-[var(--color-text-tertiary)] text-xs font-medium">
                  {profile?.title || 'Fullstack Developer'}
                </span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-center">
            <div className={`flex items-center gap-3 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              {socialLinks.map((link) => {
                const href = profile?.social_links?.[link.key];
                if (!href || href === '#') return null;

                return (
                  <motion.a
                    key={link.label}
                    href={href}
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
                );
              })}
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
        <div className={`mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} {profile?.name ? profile.name : ''}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
            Feito com <Heart size={12} className="text-[var(--color-error)] fill-[var(--color-error)]" /> e muito codigo
          </p>
        </div>
      </div>
    </footer>
  );
}
