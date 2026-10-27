'use client';

import { useEffect } from 'react';

/** Only update animation activity at visibility boundaries, never on every frame. */
export default function AnimationActivity() {
  useEffect(() => {
    const root = document.documentElement;
    const intro = document.querySelector<HTMLElement>('[data-intro-video]');
    if (!intro) return;
    let introComplete = !document.getElementById('intro');
    let start = 0;
    let end = 0;
    let previous = '';

    const sync = () => {
      const visible = introComplete && !document.hidden;
      const y = window.scrollY;
      const marquee = visible && y > start && y < end;
      const background = visible && y + window.innerHeight > end;
      const next = `${marquee}:${background}:${!document.hidden}`;
      if (next === previous) return;
      previous = next;
      root.style.setProperty('--marquee-play-state', marquee ? 'running' : 'paused');
      root.style.setProperty('--marquee-will-change', marquee ? 'transform' : 'auto');
      root.style.setProperty('--background-play-state', background ? 'running' : 'paused');
      root.style.setProperty('--background-visibility', background ? 'visible' : 'hidden');
      root.style.setProperty('--hint-play-state', document.hidden ? 'paused' : 'running');
    };
    const measure = () => {
      const rect = intro.getBoundingClientRect();
      start = rect.top + window.scrollY;
      end = start + rect.height;
      sync();
    };
    const reveal = () => { introComplete = true; sync(); };
    const observer = new ResizeObserver(measure);
    observer.observe(intro);
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('intro-animation-complete', reveal);
    document.addEventListener('visibilitychange', sync);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', measure);
      window.removeEventListener('intro-animation-complete', reveal);
      document.removeEventListener('visibilitychange', sync);
      for (const property of ['--marquee-play-state', '--marquee-will-change', '--background-play-state', '--background-visibility', '--hint-play-state']) root.style.removeProperty(property);
    };
  }, []);
  return null;
}
