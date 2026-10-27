'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Download, Pause, Play, Plus } from 'lucide-react';
import { AI_PARTNERS, CONTACTS, CRAFT_INFRA, KEYWORDS, PROFILE, PROJECTS, RESUME_URL, SKILLS, type Tool } from './portfolio-content';
import { COMPACT_QUERY } from './responsive';
import styles from './MobilePortfolio.module.css';

const mobileBody = Inter({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mobile-body', display: 'swap' });
const mobileDisplay = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mobile-display', display: 'swap' });
const mobileMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mobile-mono', display: 'swap' });

export default function MobilePortfolio() {
  const [headlineStart, headlineEnd] = PROFILE.tagline.split('，');

  return (
    <div id="mobile-home" className={`${styles.page} ${mobileBody.variable} ${mobileDisplay.variable} ${mobileMono.variable}`}>
      <header className={styles.topbar}>
        <a href="#mobile-home" className={styles.brand} aria-label="返回首页">JASON LIU<span aria-hidden="true">·</span></a>
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className={styles.resumeLink} aria-label="下载简历">
          简历 <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </header>

      <section className={styles.hero} aria-labelledby="mobile-headline">
        <div className={styles.heroIntro}>
          <h1 id="mobile-headline" className={styles.headline}>
            <span>{headlineStart}，</span>
            <span>{headlineEnd}<span className={styles.accent}>。</span></span>
          </h1>
          <p className={styles.byline}><span>{PROFILE.name}</span><span aria-hidden="true">·</span><span>AI 产品经理</span></p>
        </div>
        <MobileVideo />
        <div className={styles.heroActions}>
          <a className={styles.workLink} href="#mobile-projects">
            <span className={styles.roundArrow}><ArrowDown size={27} strokeWidth={1.75} aria-hidden="true" /></span>
            <span>查看作品</span>
          </a>
          <a className={styles.contactLink} href="#mobile-contact">联系我 <ArrowUpRight size={19} aria-hidden="true" /></a>
        </div>
      </section>

      <MobileProjects />
      <MobileAbout />

      <section id="mobile-tools" className={styles.section} aria-labelledby="mobile-tools-title">
        <SectionHeader number="03" label="COLLABORATORS" id="mobile-tools-title" title="协作工具" />
        <p className={styles.sectionIntro}>我和工具，各有分工。</p>
        <ToolGroup title="AI PARTNERS" tools={AI_PARTNERS} />
        <ToolGroup title="CRAFT + INFRASTRUCTURE" tools={CRAFT_INFRA} />
      </section>

      <MobileContact />
    </div>
  );
}

function SectionHeader({ number, label, id, title }: { number: string; label: string; id: string; title: string }) {
  return (
    <header className={styles.sectionHeader}>
      <p className={styles.eyebrow}><span>{number}</span><span aria-hidden="true">/</span>{label}</p>
      <h2 id={id}>{title}</h2>
    </header>
  );
}

function MobileVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const compactScreen = window.matchMedia(COMPACT_QUERY);
    let inView = false;
    const syncPlayback = () => {
      if (!compactScreen.matches || !inView || document.hidden || manuallyPaused.current) {
        video.pause();
        return;
      }
      // A blocked autoplay leaves the visible play control available.
      void video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      if (visible === inView) return;
      inView = visible;
      syncPlayback();
    }, { threshold: [0, 0.1] });
    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    compactScreen.addEventListener('change', syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      compactScreen.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      manuallyPaused.current = true;
      video.pause();
    } else {
      manuallyPaused.current = false;
      setError(false);
      void video.play().catch(() => setError(true));
    }
  };

  return (
    <div className={styles.videoFrame}>
      <video
        ref={videoRef}
        src="/videos/intro-web.mp4"
        poster="/videos/intro-poster.jpg"
        preload="none"
        playsInline
        muted
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError(true)}
        aria-label="个人介绍短片"
      />
      <button type="button" className={styles.videoToggle} onClick={togglePlayback} aria-label={playing ? '暂停介绍视频' : '播放介绍视频'}>
        {playing ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
      </button>
      {error && <p className={styles.videoError} role="status">视频暂时无法播放，可以继续向下浏览。</p>}
    </div>
  );
}

function MobileProjects() {
  return (
    <section id="mobile-projects" className={styles.projectsSection} aria-labelledby="mobile-projects-title">
      <SectionHeader number="01" label="SELECTED WORK" id="mobile-projects-title" title="作品与实验" />
      <div className={styles.projectList}>
        {PROJECTS.map((project) => {
          const firstStop = project.desc.indexOf('。') + 1;
          const summary = firstStop > 0 ? project.desc.slice(0, firstStop) : project.desc;
          const rest = project.desc.slice(summary.length);
          return (
            <article key={project.index} className={styles.project}>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectImageLink} aria-label={'打开项目：' + project.title}>
                <img src={project.image} alt={project.title} loading="lazy" decoding="async" width={project.imageWidth} height={project.imageHeight} />
              </a>
              <h3 className={styles.projectTitle}>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <span>{project.title}</span><ArrowRight size={24} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </h3>
              <p className={styles.projectDescription}>{summary}</p>
              <details className={styles.projectDetails}>
                <summary aria-label={'展开项目介绍：' + project.title}>
                  <span className={styles.projectMeta}>{project.index} · {project.category}</span>
                  <span className={styles.detailsLabel}>详情 <Plus size={15} className={styles.expandIcon} aria-hidden="true" /></span>
                </summary>
                <div className={styles.projectMore}>
                  {rest && <p>{rest}</p>}
                  <Tags tags={project.tags} />
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MobileAbout() {
  const [active, setActive] = useState(0);
  const keyword = KEYWORDS[active];
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % KEYWORDS.length
      : event.key === 'ArrowLeft' ? (index + KEYWORDS.length - 1) % KEYWORDS.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? KEYWORDS.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    document.getElementById('mobile-keyword-' + next)?.focus();
  };

  return (
    <section id="mobile-about" className={styles.section} aria-labelledby="mobile-about-title">
      <SectionHeader number="02" label="ABOUT" id="mobile-about-title" title="关于我" />
      <div className={styles.keywordTabs} role="tablist" aria-label="关于我的六个关键词">
        {KEYWORDS.map((item, index) => (
          <button key={item.letter} type="button" role="tab" id={'mobile-keyword-' + index} aria-selected={active === index} aria-controls="mobile-keyword-panel" aria-label={item.letter + ' · ' + item.title} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onTabKey(event, index)}>
            {item.letter}
          </button>
        ))}
      </div>
      <div className={styles.keywordPanel} role="tabpanel" id="mobile-keyword-panel" aria-labelledby={'mobile-keyword-' + active} tabIndex={0}>
        <span className={styles.keywordLetter} aria-hidden="true">{keyword.letter}</span>
        <div className={styles.keywordCopy}>
          <p className={styles.keywordCaption}><span>{keyword.index}</span> / {keyword.title}</p>
          <h3>{keyword.heading.split('，').map((part, index, parts) => <span className={styles.keywordHeadingLine} key={index}>{part}{index < parts.length - 1 ? '，' : ''}</span>)}</h3>
          <p className={styles.keywordDescription}>{keyword.desc}</p>
        </div>
      </div>

      <section id="mobile-skills" className={styles.skillsSection} aria-labelledby="mobile-skills-title">
        <h3 id="mobile-skills-title" className={styles.subheading}>我的能力</h3>
        <div className={styles.skillList}>
          {SKILLS.map((skill) => (
            <details key={skill.idx} className={styles.skill}>
              <summary aria-label={'查看能力介绍：' + skill.title}>
                <span className={styles.rowNumber}>{skill.idx}</span>
                <h4>{skill.title}</h4>
                <Plus size={20} strokeWidth={1.75} className={styles.expandIcon} aria-hidden="true" />
              </summary>
              <div className={styles.skillDescription}><p>{skill.desc}</p><Tags tags={skill.tags} /></div>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}

function Tags({ tags }: { tags: readonly string[] }) {
  return <ul className={styles.tags} aria-label="相关领域">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}

function ToolGroup({ title, tools }: { title: string; tools: readonly Tool[] }) {
  return (
    <div className={styles.toolGroup}>
      <h3>{title}</h3>
      <div className={styles.toolList}>
        {tools.map((tool) => (
          <details className={styles.tool} key={tool.name}>
            <summary aria-label={'查看工具分工：' + tool.name}>
              <span className={styles.toolHeading}><span className={styles.toolName}>{tool.name}</span><span className={styles.toolRole}>{tool.role}</span></span>
              <Plus size={20} strokeWidth={1.75} className={styles.expandIcon} aria-hidden="true" />
            </summary>
            <div className={styles.toolDescription}><p>{tool.desc}</p><Tags tags={tool.tags} /></div>
          </details>
        ))}
      </div>
    </div>
  );
}

function MobileContact() {
  const [copyStatus, setCopyStatus] = useState('');
  const email = CONTACTS.find((row) => row.label === 'EMAIL')!.value;
  const phone = CONTACTS.find((row) => row.label === 'PHONE')!.value;
  const wechat = CONTACTS.find((row) => row.label === 'WECHAT')!.value;
  const qr = CONTACTS.find((row) => row.label === 'WECHAT QR')!.value;
  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(wechat);
      setCopyStatus('微信号已复制');
    } catch {
      setCopyStatus('复制未完成，可长按微信号复制');
    }
  };

  return (
    <section id="mobile-contact" className={styles.section + ' ' + styles.contact} aria-labelledby="mobile-contact-title">
      <SectionHeader number="04" label="GET IN TOUCH" id="mobile-contact-title" title="联系我" />
      <div className={styles.contactRows}>
        <a href={'mailto:' + email}><span>邮箱 / EMAIL</span><strong>{email}</strong><ArrowUpRight size={23} aria-hidden="true" /></a>
        <a href={'tel:' + phone.replaceAll(' ', '')}><span>电话 / PHONE</span><strong>{phone}</strong><ArrowUpRight size={23} aria-hidden="true" /></a>
        <div className={styles.wechatRow}><span>微信 / WECHAT</span><strong>{wechat}</strong><button type="button" onClick={copyWechat} aria-label="复制微信号">复制</button></div>
        <details className={styles.qrDetails}>
          <summary><span>二维码 / WECHAT QR</span><strong>查看微信二维码</strong><Plus size={23} className={styles.expandIcon} aria-hidden="true" /></summary>
          <img src={qr} alt="微信二维码" loading="lazy" width={280} height={280} />
        </details>
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer"><span>简历 / RÉSUMÉ</span><strong>下载 PDF 简历</strong><Download size={22} aria-hidden="true" /></a>
      </div>
      <p className={styles.copyStatus} role="status">{copyStatus}</p>
      <footer className={styles.footer}><span>© LIU SHENGRUI · JASON LIU</span><a href="#mobile-home">回到顶部 <ArrowUp size={16} aria-hidden="true" /></a></footer>
    </section>
  );
}
