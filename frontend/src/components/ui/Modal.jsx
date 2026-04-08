import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { modalOverlay, modalContent } from '../../animations/variants';

export default function Modal({ isOpen, onClose, children, title, size = 'lg' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[90vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Content */}
          <motion.div
            className={`relative w-full ${sizes[size]} max-h-[85vh] overflow-y-auto
              bg-[var(--color-surface)] border border-[var(--color-border)]
              rounded-2xl shadow-2xl`}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4
                bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-border)]">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[var(--color-text-tertiary)]
                    hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]
                    transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            )}

            {/* Body */}
            <div className={title ? 'p-6 pt-4' : 'p-6'}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
