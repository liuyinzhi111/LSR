'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AI_PARTNERS, CONTACTS, CRAFT_INFRA, KEYWORDS, PROFILE, PROJECTS, RESUME_URL, SKILLS, type Tool } from './portfolio-content';
import styles from './MobilePortfolio.module.css';
import { COMPACT_QUERY } from './responsive';

export default function MobilePortfolio() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <a href="#mobile-home" className={styles.brand} aria-label="返回首页">JASON<span>·</span></a>
        <a href="#mobile-contact" className={styles.contactLink}>联系我 <span aria-hidden="true">↗</span></a>
      </header>

      <section id="mobile-home" className={styles.hero} aria-labelledby="mobile-name">
        <p className={styles.eyebrow}>HUMAN × AI / PORTFOLIO</p>
        <h1 id="mobile-name" className={styles.name}>{PROFILE.englishName}<span>{PROFILE.name}</span></h1>
        <p className={styles.role}>{PROFILE.role}</p>
        <p className={styles.tagline}>{PROFILE.tagline}</p>
        <MobileVideo />
        <div className={styles.actions}>
          <a className={styles.primaryButton} href="#mobile-projects">查看作品 <span aria-hidden="true">↓</span></a>
          <a className={styles.secondaryButton} href={RESUME_URL} target="_blank" rel="noopener noreferrer">下载简历 <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.heroFoot}><span>AI 产品经理</span><a href="#mobile-about">向下了解我 ↓</a></div>
      </section>

      <MobileAbout />

      <section id="mobile-skills" className={styles.section} aria-labelledby="mobile-skills-title">
        <SectionHeader number="02" id="mobile-skills-title" title="WHAT I CAN DO" subtitle="把能力，用在具体问题上。" />
        <div className={styles.skillList}>
          {SKILLS.map((skill) => (
            <article key={skill.idx} className={styles.skillCard}>
              <span className={styles.cardNumber}>{skill.idx}</span>
              <h3>{skill.title}</h3>
              <p>{skill.desc}</p>
              <Tags tags={skill.tags} />
            </article>
          ))}
        </div>
      </section>

      <section id="mobile-projects" className={styles.section} aria-labelledby="mobile-projects-title">
        <SectionHeader number="03" id="mobile-projects-title" title="WHAT I HAVE DONE" subtitle="已经跑通、做完、交付过的产品与实验。" />
        <div className={styles.projectList}>
          {PROJECTS.map((project) => {
            const firstStop = project.desc.indexOf('。') + 1;
            const summary = firstStop > 0 ? project.desc.slice(0, firstStop) : project.desc;
            const rest = project.desc.slice(summary.length);
            return (
              <article key={project.index} className={styles.projectCard}>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectImageLink} aria-label={`查看项目：${project.title}`}>
                  <img src={project.image} alt={project.title} loading="lazy" decoding="async" width={640} height={400} />
                  <span className={styles.imageIndex} aria-hidden="true">{project.index} / 04</span>
                </a>
                <div className={styles.projectBody}>
                  <p className={styles.category}>{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className={styles.description}>{summary}</p>
                  {rest && <details className={styles.projectDetails}><summary>更多介绍</summary><p>{rest}</p></details>}
                  <Tags tags={project.tags} />
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectAction} aria-label={`查看与体验：${project.title}`}>查看 / 体验项目 <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="mobile-tools" className={styles.section} aria-labelledby="mobile-tools-title">
        <SectionHeader number="04" id="mobile-tools-title" title="COLLABORATORS" subtitle="我和工具，各有分工。" />
        <ToolGroup title="AI PARTNERS" tools={AI_PARTNERS} />
        <ToolGroup title="CRAFT + INFRASTRUCTURE" tools={CRAFT_INFRA} />
      </section>

      <MobileContact />
    </div>
  );
}

function SectionHeader({ number, id, title, subtitle }: { number: string; id: string; title: string; subtitle: string }) {
  return <header className={styles.sectionHeader}><span className={styles.sectionNumber}>{number} /</span><h2 id={id}>{title}</h2><p>{subtitle}</p></header>;
}

function MobileVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const compactScreen = window.matchMedia(COMPACT_QUERY);
    let inView = false;
    const syncPlayback = () => {
      if (!compactScreen.matches || !inView || document.hidden) {
        video.pause();
        return;
      }
      // Muted inline autoplay; if the browser blocks it, keep the play button available.
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

  const play = () => {
    setError(false);
    void videoRef.current?.play().catch(() => setError(true));
  };

  return (
    <div className={styles.videoFrame}>
      <video ref={videoRef} src="/videos/intro-web.mp4" poster="/videos/intro-poster.jpg" preload="none" playsInline muted loop controls={started} onPlay={() => setStarted(true)} aria-label="个人介绍短片" />
      {!started && <button type="button" className={styles.playButton} onClick={play} aria-label="播放介绍视频"><span className={styles.playIcon} aria-hidden="true">▶</span><span>播放短片</span></button>}
      {error && <p className={styles.videoError} role="status">视频暂时无法播放，可以继续向下浏览。</p>}
    </div>
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
    document.getElementById(`mobile-keyword-${next}`)?.focus();
  };

  return (
    <section id="mobile-about" className={styles.section} aria-labelledby="mobile-about-title">
      <SectionHeader number="01" id="mobile-about-title" title="ABOUT ME" subtitle="6 个字母，6 个关于我的关键词。" />
      <div className={styles.keywordTabs} role="tablist" aria-label="关于我的六个关键词">
        {KEYWORDS.map((item, index) => <button key={item.letter} type="button" role="tab" id={`mobile-keyword-${index}`} aria-selected={active === index} aria-controls="mobile-keyword-panel" aria-label={`${item.letter} · ${item.title}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onTabKey(event, index)}>{item.letter}</button>)}
      </div>
      <div className={styles.keywordPanel} role="tabpanel" id="mobile-keyword-panel" aria-labelledby={`mobile-keyword-${active}`} tabIndex={0}>
        <div className={styles.keywordCaption}><span>{keyword.title}</span><span>{keyword.index} / 06</span></div>
        <h3>{keyword.heading}</h3><p>{keyword.desc}</p>
      </div>
    </section>
  );
}

function Tags({ tags }: { tags: readonly string[] }) {
  return <ul className={styles.tags} aria-label="相关领域">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}

function ToolGroup({ title, tools }: { title: string; tools: readonly Tool[] }) {
  const [active, setActive] = useState<number | null>(null);
  const groupId = title.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <div className={styles.toolGroup}>
      <h3>{title}</h3>
      <div className={styles.toolGrid}>
        {Array.from({ length: Math.ceil(tools.length / 2) }, (_, row) => {
          const first = row * 2;
          const expanded = active !== null && active >= first && active < first + 2;
          return <div className={styles.toolPair} key={row}>
            {tools.slice(first, first + 2).map((tool, offset) => {
              const index = first + offset;
              return <button type="button" className={styles.toolCard} key={tool.name} id={`${groupId}-tool-${index}`} aria-expanded={active === index} aria-controls={`${groupId}-detail-${row}`} onClick={() => setActive(active === index ? null : index)}>
                <span className={styles.toolType}>{tool.type}</span><span className={styles.toolName}>{tool.name}</span><span className={styles.toolRole}>{tool.role}</span><span className={styles.toolToggle} aria-hidden="true" />
              </button>;
            })}
            {expanded && <div id={`${groupId}-detail-${row}`} className={styles.toolDescription} role="region" aria-labelledby={`${groupId}-tool-${active}`}><p>{tools[active].desc}</p><Tags tags={tools[active].tags} /></div>}
          </div>;
        })}
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
    <section id="mobile-contact" className={`${styles.section} ${styles.contact}`} aria-labelledby="mobile-contact-title">
      <p className={styles.eyebrow}>05 / GET IN TOUCH</p>
      <h2 id="mobile-contact-title" className={styles.slogan}>LET’S BUILD<br />SOMETHING<br /><span>SHARP.</span></h2>
      <div className={styles.contactRows}>
        <a href={`mailto:${email}`}><span>EMAIL</span><strong>{email}</strong><i aria-hidden="true">↗</i></a>
        <a href={`tel:${phone.replaceAll(' ', '')}`}><span>PHONE</span><strong>{phone}</strong><i aria-hidden="true">↗</i></a>
        <div className={styles.wechatRow}><span>WECHAT</span><strong>{wechat}</strong><button type="button" onClick={copyWechat} aria-label="复制微信号">复制</button></div>
        <details className={styles.qrDetails}><summary><span>WECHAT QR</span><strong>查看微信二维码</strong><i aria-hidden="true">＋</i></summary><img src={qr} alt="微信二维码" loading="lazy" width={280} height={280} /><p>再次点击上方可收起</p></details>
      </div>
      <p className={styles.copyStatus} role="status">{copyStatus}</p>
      <footer className={styles.footer}><span>© LIU SHENGRUI · JASON LIU</span><a href="#mobile-home">回到顶部 ↑</a></footer>
    </section>
  );
}
