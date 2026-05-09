'use client';

import { useEffect, useRef } from 'react';

export default function CursorDepression() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      el.style.setProperty('--cursor-x', `${currentX}px`);
      el.style.setProperty('--cursor-y', `${currentY}px`);
      raf = window.requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const target = event.target;
      const inZone = target instanceof Element && Boolean(target.closest('[data-dot-depression-zone]'));
      targetX = event.clientX;
      targetY = event.clientY;
      document.documentElement.style.setProperty('--dot-press-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--dot-press-y', `${event.clientY}px`);
      el.style.opacity = inZone ? '1' : '0';
    };

    const handleLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    raf = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8500,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.35s ease',
        mixBlendMode: 'multiply',
        background:
          'radial-gradient(circle 72px at var(--cursor-x, 50vw) var(--cursor-y, 50vh), rgba(255,90,26,0.32), rgba(255,134,64,0.18) 42%, transparent 72%), radial-gradient(circle 150px at var(--cursor-x, 50vw) var(--cursor-y, 50vh), rgba(130,58,20,0.12), transparent 64%), radial-gradient(circle 220px at calc(var(--cursor-x, 50vw) - 28px) calc(var(--cursor-y, 50vh) - 34px), rgba(255,219,194,0.22), transparent 58%)',
        filter: 'blur(10px) saturate(1.2)',
        willChange: 'background, opacity',
      }}
    />
  );
}
