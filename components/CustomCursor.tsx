'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const SAFFRON = '#E8A317';
const VIOLET = '#6A3DE8';
const LERP_FACTOR = 0.15;

export default function CustomCursor() {
  const pathname = usePathname();
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [visible, setVisible] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const cursorState = useRef<'default' | 'pointer' | 'text'>('default');
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const match = window.matchMedia('(pointer: fine)');
    if (!match.matches) return;
    setIsPointerDevice(true);

    // Add global style to hide default cursor
    const style = document.createElement('style');
    style.id = 'custom-cursor-hide';
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById('custom-cursor-hide');
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (!isPointerDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, [data-cursor="pointer"]');
      const textTarget = target.closest('[data-cursor="text"]');

      if (textTarget) {
        cursorState.current = 'text';
      } else if (interactive) {
        cursorState.current = 'pointer';
      } else {
        cursorState.current = 'default';
      }
    };

    const animate = () => {
      const inner = innerRef.current;
      const outer = outerRef.current;
      if (!inner || !outer) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { x, y } = mousePos.current;

      // Inner dot: instant follow
      inner.style.transform = `translate(${x - 3}px, ${y - 3}px)`;

      // Outer ring: lerp for lag
      outerPos.current.x += (x - outerPos.current.x) * LERP_FACTOR;
      outerPos.current.y += (y - outerPos.current.y) * LERP_FACTOR;
      const ox = outerPos.current.x - 12;
      const oy = outerPos.current.y - 12;

      const state = cursorState.current;
      if (state === 'pointer') {
        outer.style.transform = `translate(${ox}px, ${oy}px) scale(1.5)`;
        outer.style.borderColor = VIOLET;
      } else if (state === 'text') {
        outer.style.transform = `translate(${ox}px, ${oy}px) scaleX(0.5)`;
        outer.style.borderColor = SAFFRON;
      } else {
        outer.style.transform = `translate(${ox}px, ${oy}px) scale(1)`;
        outer.style.borderColor = SAFFRON;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isPointerDevice, visible]);

  if (!isPointerDevice) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `1.5px solid ${SAFFRON}`,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease, border-color 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: SAFFRON,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
