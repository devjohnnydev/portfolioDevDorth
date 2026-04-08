import { useEffect, useState, useRef, useCallback } from 'react';

/* Intersection Observer hook for scroll reveals */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.once !== false) observer.unobserve(el);
        }
      },
      { threshold: options.threshold || 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.once]);

  return [ref, isInView];
}

/* Animated counter */
export function useAnimatedCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView({ once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView, startOnView]);

  return [ref, count];
}

/* Mouse position for interactive effects */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return position;
}

/* Window scroll position */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scrollY;
}

/* Magnetic hover effect */
export function useMagneticHover(strength = 0.3) {
  const ref = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

/* Typewriter effect */
export function useTypewriter(texts, typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}
