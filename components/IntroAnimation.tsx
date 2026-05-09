'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * 品牌开场动画（5 阶段，GSAP 3 timeline 串联）
 *
 *   Stage 1 — JASON 5 字母 stagger 淡入（0.4s × 0.08s stagger）
 *   Stage 2 — 整体 scale 脉冲呼吸（1 → 1.08，yoyo 共 2 个完整脉冲）
 *   Stage 3 — JASON 整体向中心收缩、缩小并淡出
 *   Stage 4 —「刘盛瑞」三字从中心缩小状态放大展开
 *   Stage 5 — hold 0.4s → 白色全屏闪光 → intro 整层放大淡出 → #site (Hero) 淡入
 */
export default function IntroAnimation() {
  const introRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!introRef.current || !flashRef.current || !lettersRef.current || !nameRef.current || !welcomeRef.current || !loadingRef.current) {
      return;
    }

    const intro = introRef.current;
    const flash = flashRef.current;
    const lettersWrap = lettersRef.current;
    const nameWrap = nameRef.current;
    const welcome = welcomeRef.current;
    const loading = loadingRef.current;

    const letters = Array.from(lettersWrap.querySelectorAll<HTMLSpanElement>('.intro-letter'));
    const nameLetters = Array.from(nameWrap.querySelectorAll<HTMLSpanElement>('.intro-cn'));
    const liu = nameLetters[0];
    const sheng = nameLetters[1];
    const rui = nameLetters[2];

    // 锁滚动
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 取 #site 节点用于结尾淡入
    const siteEl = document.getElementById('site');

    // ===== 初始状态 =====
    gsap.set(letters, { opacity: 1, y: 0, scale: 1 });
    gsap.set(lettersWrap, { letterSpacing: '0.70em', paddingLeft: '0.70em' });
    gsap.set(nameLetters, { opacity: 0, scaleX: 0.2 });
    gsap.set(welcome, { opacity: 0, xPercent: -50, yPercent: -50, y: 18 });
    gsap.set(loading, { opacity: 1, y: 0 });
    gsap.set(flash, { opacity: 0 });
    if (siteEl) gsap.set(siteEl, { opacity: 0 });

    // 「刘」「瑞」初始 x 偏移到屏幕中心，使其与「盛」叠在一起
    const screenCenterX = window.innerWidth / 2;
    const liuRect = liu.getBoundingClientRect();
    const ruiRect = rui.getBoundingClientRect();
    const liuCenter = liuRect.left + liuRect.width / 2;
    const ruiCenter = ruiRect.left + ruiRect.width / 2;
    gsap.set(liu, { x: screenCenterX - liuCenter });
    gsap.set(rui, { x: screenCenterX - ruiCenter });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        if (intro) intro.style.display = 'none';
        document.body.style.overflow = prevOverflow;
        window.dispatchEvent(new Event('intro-animation-complete'));
        setDone(true);
      },
    });

    tl.to({}, { duration: 0.25 });

    tl.to(letters, {
      scale: 1.10,
      duration: 0.75,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    });

    tl.to(
      loading,
      {
        opacity: 0,
        y: 10,
        duration: 0.28,
        ease: 'power2.out',
      },
      '<+=0.5'
    );

    tl.to(lettersWrap, {
      letterSpacing: '6.0em',
      paddingLeft: '6.0em',
      duration: 0.85,
      ease: 'power2.inOut',
    });

    // ===== Stage 3：字距拉回并压缩成一个点 =====
    const stage3Label = 'stage3';
    tl.addLabel(stage3Label);

    // 先把字距从 6.0em 拉回 0
    tl.to(
      lettersWrap,
      {
        letterSpacing: '0em',
        paddingLeft: '0em',
        duration: 0.7,
        ease: 'power2.inOut',
      },
      stage3Label
    );

    // 字母向中心收缩、缩小并淡出
    letters.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dx = screenCenterX - centerX;

      tl.to(
        el,
        {
          x: dx,
          scale: 0,
          opacity: 0,
          duration: 0.85,
          ease: 'expo.inOut',
        },
        stage3Label
      );
    });

    // ===== Stage 4：欢迎文案直接出现 =====
    const stage4Label = 'stage4';
    tl.addLabel(stage4Label, '+=0.05');

    tl.to(
      welcome,
      {
        opacity: 1,
        xPercent: -50,
        y: -50,
        duration: 0.85,
        ease: 'power2.out',
      },
      stage4Label
    );

    // ===== Stage 5：hold → 白色闪光 → 转场 =====
    tl.to({}, { duration: 0.75 }); // hold 0.4s 让用户看清姓名

    tl.to(flash, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.in',
    });

    tl.to(flash, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.out',
    });

    // intro 整层从橙色过渡到米白 + 放大 + 淡出；同时 hero (#site) 淡入
    tl.to(
      intro,
      {
        backgroundColor: '#F5F0EB',
        scale: 1.05,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        transformOrigin: '50% 50%',
      },
      '<-=0.05'
    );

    if (siteEl) {
      tl.to(
        siteEl,
        {
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
        },
        '<+=0.1'
      );
    }

    return () => {
      tl.kill();
      document.body.style.overflow = prevOverflow;
      // 兜底：万一卸载时 #site 仍是隐藏的，恢复可见
      if (siteEl) siteEl.style.opacity = '1';
    };
  }, []);

  if (done) return null;

  return (
    <>
      <div id="intro" ref={introRef}>
        <div id="letters" ref={lettersRef}>
          <span className="intro-letter">J</span>
          <span className="intro-letter">A</span>
          <span className="intro-letter">S</span>
          <span className="intro-letter">O</span>
          <span className="intro-letter">N</span>
        </div>
        <div id="intro-loading" ref={loadingRef}>LOADING, PLEASE WAIT....</div>
        <div id="name" ref={nameRef}>
          <span className="intro-cn">刘</span>
          <span className="intro-cn">盛</span>
          <span className="intro-cn">瑞</span>
        </div>
        <div id="intro-welcome" ref={welcomeRef}>
          <span>欢迎来到</span>
          <strong>刘盛瑞</strong>
          <span>的个人网站</span>
        </div>
      </div>
      <div id="flash" ref={flashRef} aria-hidden="true" />
    </>
  );
}
