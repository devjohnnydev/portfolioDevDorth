import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  onClick,
  href,
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  const ref = useRef(null);
  const [ripple, setRipple] = useState(null);

  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-glow)]',
    secondary: 'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]',
    ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]',
    danger: 'bg-[var(--color-error)] text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-[0.9375rem] gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    const rect = ref.current.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    });
    onClick?.(e);
  };

  const content = (
    <>
      {ripple && (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          onAnimationEnd={() => setRipple(null)}
        />
      )}
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      {children}
      {!loading && IconRight && <IconRight size={size === 'sm' ? 16 : 18} />}
    </>
  );

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={classes}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </motion.button>
  );
}
