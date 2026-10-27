'use client';

import { useEffect, useRef } from 'react';

const LIGHT_HALF_SIZE = 256;
const DOT_HALF_SIZE = 128;

export default function CursorDepression() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = elRef.current;
    if (!light || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let lastFrame = 0;
    let hasPointer = false;
    let needsHitTest = false;
    let dotDirty = false;
    let zone: HTMLElement | null = null;
    let field: HTMLElement | null = null;
    let hotspot: HTMLElement | null = null;

    const render = (now: number) => {
      raf = 0;
      if (document.hidden || !hasPointer) return;
      // Read geometry before changing styles; scrolling can move another section under the pointer.
      const nextZone = needsHitTest
        ? document.elementFromPoint(targetX, targetY)?.closest<HTMLElement>('[data-dot-depression-zone]') ?? null
        : zone;
      needsHitTest = false;
      const nextField = nextZone === zone ? field : nextZone?.querySelector<HTMLElement>('[data-dot-field]') ?? null;
      const rect = dotDirty ? nextField?.getBoundingClientRect() : null;

      if (nextZone !== zone) {
        if (hotspot) hotspot.style.opacity = '0';
        if (nextZone && !zone) { currentX = targetX; currentY = targetY; }
        zone = nextZone;
        field = nextField;
        hotspot = field?.querySelector<HTMLElement>('[data-dot-hotspot]') ?? null;
        light.style.opacity = zone ? '1' : '0';
      }
      if (!zone) { lastFrame = 0; return; }

      if (dotDirty && rect && hotspot) {
        const x = targetX - rect.left - DOT_HALF_SIZE;
        const y = targetY - rect.top - DOT_HALF_SIZE;
        hotspot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        // Preserve the stationary 24px grid phase; only this 256px patch repaints.
        hotspot.style.backgroundPosition = `${-x % 24}px ${-y % 24}px`;
        hotspot.style.opacity = '1';
        dotDirty = false;
      }

      // Short, refresh-rate-independent follow instead of a long 0.16-per-frame chase.
      const dt = lastFrame ? Math.min(now - lastFrame, 40) : 16;
      const follow = 1 - Math.exp(-dt / 38);
      lastFrame = now;
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
      light.style.transform = `translate3d(${currentX - LIGHT_HALF_SIZE}px, ${currentY - LIGHT_HALF_SIZE}px, 0)`;
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) raf = requestAnimationFrame(render);
      else lastFrame = 0;
    };

    const schedule = () => {
      if (!hasPointer || document.hidden) return;
      needsHitTest = true;
      dotDirty = true;
      if (!raf) raf = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      targetX = event.clientX;
      targetY = event.clientY;
      hasPointer = true;
      schedule();
    };
    const hide = () => {
      light.style.opacity = '0';
      if (hotspot) hotspot.style.opacity = '0';
      zone = field = hotspot = null;
      lastFrame = 0;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const leave = () => { hasPointer = false; hide(); };
    const visibility = () => { if (document.hidden) hide(); else schedule(); };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.documentElement.addEventListener('mouseleave', leave);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      data-cursor-light
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: LIGHT_HALF_SIZE * 2,
        height: LIGHT_HALF_SIZE * 2,
        transform: 'translate3d(-1024px, -1024px, 0)',
        zIndex: 8500,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.16s ease',
        mixBlendMode: 'multiply',
        background:
          'radial-gradient(circle 72px at 256px 256px, rgba(255,90,26,0.32), rgba(255,134,64,0.18) 42%, transparent 72%), radial-gradient(circle 150px at 256px 256px, rgba(130,58,20,0.12), transparent 64%), radial-gradient(circle 220px at 228px 222px, rgba(255,219,194,0.22), transparent 58%)',
        filter: 'blur(10px) saturate(1.2)',
        willChange: 'transform, opacity',
      }}
    />
  );
}
