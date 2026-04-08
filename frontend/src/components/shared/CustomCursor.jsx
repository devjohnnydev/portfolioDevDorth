import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      // Direct DOM mutation prevents React re-render lag (teleports)
      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 14}px, ${e.clientY - 14}px, 0)`;
        dotRef.current.style.transform = `translate3d(${e.clientX - 2.5}px, ${e.clientY - 2.5}px, 0)`;
      }
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
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(-100px, -100px, 0)`,
        }}
      >
        <div
          style={{ transform: `scale(${isHovering ? 1.4 : isClicking ? 0.8 : 1})` }}
          className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
            isHovering ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--color-text-primary)]/30'
          }`}
        />
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate3d(-100px, -100px, 0)`,
        }}
      >
        <div 
          style={{ transform: `scale(${isClicking ? 2 : 1})` }}
          className="w-[5px] h-[5px] rounded-full bg-[var(--color-primary)] transition-transform duration-200" 
        />
      </div>

      {/* Hide default cursor */}
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
