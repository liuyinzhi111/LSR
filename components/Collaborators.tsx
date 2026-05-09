'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionTitle from './SectionTitle';

type Tool = {
  type: string;
  name: string;
  role: string;
  desc: string;
  tags: readonly string[];
  icon: string; // simple-icons slug
  iconUrl?: string; // 优先使用的图标 URL（覆写 simple-icons）
};

const AI_PARTNERS: readonly Tool[] = [
  {
    type: 'AI',
    name: 'ChatGPT / Claude',
    role: '思维搭档',
    desc: '需求分析、文案打磨、逻辑梳理——复杂问题先和它对话，把模糊的想法变成清晰的结构。',
    tags: ['Strategy', 'Writing', 'Research'],
    icon: 'claude',
  },
  {
    type: 'AI',
    name: 'Cursor / Windsurf',
    role: '代码执行层',
    desc: '描述我要什么，它把代码写出来。我负责审方向、定逻辑、验收结果，不写每一行但能控制每一行。',
    tags: ['Web Coding', 'Frontend', 'Debugging'],
    icon: 'cursor',
  },
  {
    type: 'AI',
    name: 'N8N / Coze / Dify',
    role: '工作流引擎',
    desc: '把业务流程拆成 AI 节点，搭建可复用的 Agent 系统，让 AI 真正接进实际业务而不是停留在演示层。',
    tags: ['Workflow', 'RAG', 'Agent'],
    icon: 'n8n',
  },
  {
    type: 'AI',
    name: 'Midjourney / Runway',
    role: '视觉生成',
    desc: '概念草图、风格探索、内容素材——AI 生成 80%，人工精调 20%，比传统流程快 10 倍以上。',
    tags: ['Image', 'Video', 'Concept'],
    icon: 'midjourney',
    iconUrl: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=64',
  },
];

const CRAFT_INFRA: readonly Tool[] = [
  {
    type: 'Craft',
    name: 'Figma',
    role: '产品设计台',
    desc: '原型、流程图、交互稿——从想法到可点击的 Demo，这里是产品思维落地的地方。',
    tags: ['Prototype', 'Wireframe', 'Design'],
    icon: 'figma',
  },
  {
    type: 'Craft',
    name: 'Obsidian / 飞书',
    role: '知识管理',
    desc: 'PRD、评测报告、项目复盘——结构化记录让每一次工作都能被沉淀和复用。',
    tags: ['Docs', 'PM', 'Knowledge Base'],
    icon: 'obsidian',
  },
  {
    type: 'Infra',
    name: 'VS Code',
    role: '代码工作台',
    desc: '写 Prompt、搭页面、调 API——不只是编辑器，是我和 AI 协作的主要界面。',
    tags: ['IDE', 'HTML', 'API'],
    icon: 'visualstudiocode',
    iconUrl: 'https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=64',
  },
  {
    type: 'Infra',
    name: 'GitHub',
    role: '项目归档',
    desc: '代码、工作流配置、个人项目——这里是我能力的可见证明。',
    tags: ['Version Control', 'Portfolio', 'Open Source'],
    icon: 'github',
  },
];

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
        height: '200vh',
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
