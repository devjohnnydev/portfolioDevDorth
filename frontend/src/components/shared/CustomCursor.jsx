import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      >
        <div
          className={`w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
            isHovering ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--color-text-primary)]/30'
          }`}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          scale: isClicking ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
      </motion.div>

      {/* Hide default cursor */}
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
