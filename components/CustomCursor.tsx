import React, { useEffect, useRef, useState } from 'react';

// Elements that should trigger the "hover" cursor state
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Custom cursor is desktop-only — leave touch devices with the native cursor
    if (isTouchDevice()) return;

    setEnabled(true);
    document.documentElement.classList.add('custom-cursor-active');

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest(INTERACTIVE_SELECTOR));
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);
    const handleLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    window.addEventListener('mouseleave', handleLeave);

    // The outer ring eases toward the mouse position each frame, creating a
    // smooth "trailing" animation instead of snapping instantly like the dot
    const animateRing = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(animateRing);
    };
    rafId.current = requestAnimationFrame(animateRing);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('mouseleave', handleLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // On touch devices we render nothing, so the native cursor/touch behavior is untouched
  if (!enabled) return null;

  return (
    <>
      {/* Small dot: follows the mouse instantly, no lag */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[100] w-2 h-2 rounded-full bg-primaryLight pointer-events-none"
      />

      {/* Outer ring: trails slightly behind, scales up on hover, shrinks on click */}
      <div ref={ringRef} className="fixed top-0 left-0 z-[100] pointer-events-none">
        <div
          className={`rounded-full border-2 border-primary transition-all duration-200 ease-out
            ${isHovering ? 'w-12 h-12 border-primaryLight bg-primary/10' : 'w-8 h-8'}
            ${isClicking ? 'scale-75' : 'scale-100'}`}
        />
      </div>
    </>
  );
};