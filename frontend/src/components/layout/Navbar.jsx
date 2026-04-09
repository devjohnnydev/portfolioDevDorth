import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ArrowUp } from 'lucide-react';
import { useThemeStore } from '../../stores';
import { useScrollPosition } from '../../hooks';
import { profileApi } from '../../services/api';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certificações', href: '#certifications' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Contato', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [profile, setProfile] = useState(null);
  const { isDark, toggleTheme } = useThemeStore();
  const scrollY = useScrollPosition();

  const isScrolled = scrollY > 50;
  const showBackToTop = scrollY > 500;

  useEffect(() => {
    profileApi.get().then(data => {
      if (data) setProfile(data);
    }).catch(console.error);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        <div className="section-container">
          <div
            className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
              isScrolled
                ? 'glass-strong shadow-lg'
                : 'bg-transparent'
            }`}
          >
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {profile?.name ? profile.name.substring(0, 2).toUpperCase() : ''}
                </span>
              </div>
              <span className="text-lg font-bold text-[var(--color-text-primary)] hidden sm:block">
                {profile?.name ? (
                  <>
                    {profile.name.trim().split(' ')[0]}
                    {profile.name.trim().split(' ').length > 1 && (
                      <span className="text-[var(--color-primary)]">
                        {profile.name.trim().split(' ').slice(1).join(' ')}
                      </span>
                    )}
                  </>
                ) : null}
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeSection === link.href.slice(1)
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-[var(--color-primary-soft)] rounded-lg -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]
                  transition-colors cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun size={18} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]
                  transition-colors cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="section-container mt-2">
                <div className="glass-strong rounded-2xl p-4 shadow-xl">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => scrollToSection(link.href)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        activeSection === link.href.slice(1)
                          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full
              bg-[var(--color-primary)] text-white shadow-lg
              hover:shadow-[var(--shadow-glow-lg)] transition-shadow cursor-pointer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] z-50 origin-left"
        style={{
          scaleX: Math.min(scrollY / (document.documentElement?.scrollHeight - window.innerHeight || 1), 1),
        }}
      />
    </>
  );
}
