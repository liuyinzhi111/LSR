'use client';

import { useCallback, useEffect, useState } from 'react';

export default function FullscreenToggle() {
  const [isFs, setIsFs] = useState(false);
  const [supported, setSupported] = useState(true);

  const toggle = useCallback(async () => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const docAny = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      webkitFullscreenElement?: Element;
    };
    try {
      if (!document.fullscreenElement && !docAny.webkitFullscreenElement) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (docAny.webkitExitFullscreen) await docAny.webkitExitFullscreen();
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const docAny = document as Document & {
      webkitFullscreenElement?: Element;
    };
    if (!document.documentElement.requestFullscreen && !(docAny as any).webkitRequestFullscreen) {
      setSupported(false);
      return;
    }
    const sync = () => {
      setIsFs(Boolean(document.fullscreenElement || docAny.webkitFullscreenElement));
    };
    sync();
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync as EventListener);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'f' && e.key !== 'F') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener('keydown', onKey);

    // 浏览器禁止无手势进全屏，监听首次交互即尝试进入全屏
    let armed = sessionStorage.getItem('fs-auto-attempted') !== '1';
    const enterOnce = () => {
      if (!armed) return;
      armed = false;
      sessionStorage.setItem('fs-auto-attempted', '1');
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      const req = el.requestFullscreen?.bind(el) || el.webkitRequestFullscreen?.bind(el);
      if (req) req().catch(() => {});
      cleanupAuto();
    };
    const cleanupAuto = () => {
      window.removeEventListener('pointerdown', enterOnce);
      window.removeEventListener('keydown', enterOnce);
      window.removeEventListener('wheel', enterOnce);
      window.removeEventListener('touchstart', enterOnce);
    };
    if (armed) {
      window.addEventListener('pointerdown', enterOnce, { once: false });
      window.addEventListener('keydown', enterOnce, { once: false });
      window.addEventListener('wheel', enterOnce, { passive: true });
      window.addEventListener('touchstart', enterOnce, { passive: true });
    }

    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync as EventListener);
      window.removeEventListener('keydown', onKey);
      cleanupAuto();
    };
  }, [toggle]);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFs ? '退出全屏' : '进入全屏'}
      title={isFs ? '退出全屏 (F)' : '进入全屏 (F)'}
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border)',
        borderRadius: '999px',
        color: 'var(--color-ink)',
        cursor: 'pointer',
        zIndex: 9000,
        transition: 'transform 0.2s ease, background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.06)';
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)';
      }}
    >
      {isFs ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4v4H5" />
          <path d="M15 4v4h4" />
          <path d="M9 20v-4H5" />
          <path d="M15 20v-4h4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9V4h5" />
          <path d="M20 9V4h-5" />
          <path d="M4 15v5h5" />
          <path d="M20 15v5h-5" />
        </svg>
      )}
    </button>
  );
}
