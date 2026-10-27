'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionTitle from './SectionTitle';

import { AI_PARTNERS, CRAFT_INFRA, type Tool } from './portfolio-content';

export default function Collaborators() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // 第二组卡片在滚动进度 [0.15, 0.7] 区间内淡入上滑
  const row2Opacity = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);
  const row2Y = useTransform(scrollYProgress, [0.15, 0.7], [40, 0]);

  return (
    <section
      ref={wrapperRef}
      style={{
        position: 'relative',
        height: '160vh',
        backgroundColor: 'transparent',
        color: 'var(--color-ink)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 装饰圆 */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-180px',
              left: '-180px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-180px',
              bottom: '-180px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)',
            }}
          />
        </div>

        {/* 标题区 */}
        <header
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            paddingTop: '60px',
          }}
        >
          <SectionTitle>
            COLLABORATORS
          </SectionTitle>
          <p
            style={{
              padding: '14px 8vw 0',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--color-muted)',
              margin: 0,
            }}
          >
            我不是一个人在工作——这是我和它们之间的分工。
          </p>
        </header>

        {/* 两组卡片 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '28px',
            padding: '32px 0',
          }}
        >
          <Group title="[ AI PARTNERS ]" tools={AI_PARTNERS} />
          <motion.div style={{ opacity: row2Opacity, y: row2Y }}>
            <Group title="[ CRAFT + INFRASTRUCTURE ]" tools={CRAFT_INFRA} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Group({ title, tools }: { title: string; tools: readonly Tool[] }) {
  return (
    <div>
      <h3
        style={{
          padding: '0 8vw 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.2em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 500,
        }}
      >
        {title}
      </h3>

      <ul
        className="collab-grid"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '0 8vw',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </ul>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <li
      className="collab-card"
      style={{
        position: 'relative',
        backgroundColor: 'transparent',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '20px',
        transition: 'border-color 0.25s ease, background-color 0.25s ease',
      }}
    >
      {/* 左上角品牌 logo：优先用 iconUrl（Google favicon），其次 simple-icons，两者均加载失败隐藏 */}
      <img
        src={tool.iconUrl ?? `https://cdn.simpleicons.org/${tool.icon}/0a0a0a`}
        alt=""
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        width={22}
        height={22}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
        style={{ width: 22, height: 22, display: 'block', marginBottom: '12px' }}
      />

      <span
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--color-accent)',
          opacity: 0.7,
          textTransform: 'uppercase',
        }}
      >
        [{tool.type}]
      </span>

      <h4
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
          color: 'var(--color-ink)',
          margin: '0 0 4px',
        }}
      >
        {tool.name}
      </h4>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--color-accent)',
          margin: 0,
        }}
      >
        {tool.role}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          lineHeight: 1.65,
          color: 'var(--color-muted)',
          margin: '6px 0',
        }}
      >
        {tool.desc}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--color-muted)',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        {tool.tags.join(' · ')}
      </p>
    </li>
  );
}
