// One source of content for the desktop and compact layouts.


export type Keyword = {
  letter: string;
  index: string;
  title: string;
  heading: string;
  desc: string;
};

export const KEYWORDS: readonly Keyword[] = [
  {
    letter: 'J',
    index: '01',
    title: 'Judgment',
    heading: '用真实问题，判断 AI 的价值。',
    desc: '从用户需求和现有流程出发，结合具体任务比较效果、成本与可控性，判断一项新的 AI 能力适合解决什么问题。',
  },
  {
    letter: 'A',
    index: '02',
    title: 'Augmented',
    heading: '让 AI 成为日常工作的协作者。',
    desc: '我把 AI 用在信息研究、原型搭建和内容创作中，持续调整人与工具的分工，让目标、上下文和验收标准更清楚。',
  },
  {
    letter: 'S',
    index: '03',
    title: 'Shipping',
    heading: '把想法推进成可用的结果。',
    desc: '我有用户研究、方案设计、研发协同和上线迭代的实践，也会借助 AI 将关键设想做成可体验的原型，尽早发现问题、验证方向。',
  },
  {
    letter: 'O',
    index: '04',
    title: 'Orchestrate',
    heading: '把模型、工具和知识组织成工作流。',
    desc: '围绕具体任务，连接模型、知识库与工具，把反复使用的方法沉淀成流程和 Skill，减少每次从头摸索。',
  },
  {
    letter: 'N',
    index: '05',
    title: 'Native',
    heading: '持续跟进前沿，持续更新判断。',
    desc: '研究新模型、Agent 和开源项目，关注它们的能力边界与适用条件，再判断哪些变化值得带入自己的工作。',
  },
  {
    letter: 'D',
    index: '06',
    title: 'Documenting',
    heading: '把实践变成可复用的经验。',
    desc: '记录学习与实践中的问题、过程和判断，整理成可检索的知识和通俗的 AI 内容，让经验能够被自己复用，也能被别人理解。',
  },
];

export type Skill = {
  idx: string;
  title: string;
  desc: string;
  tags: readonly string[];
};

export const SKILLS: readonly Skill[] = [
  {
    idx: '01',
    title: 'AI 产品设计',
    desc: '从用户需求出发，定义 AI 功能的交互逻辑与体验边界，让模型能力真正服务于业务场景，而不是技术展示。',
    tags: ['PRD', 'User Story', 'AI UX'],
  },
  {
    idx: '02',
    title: '工作流搭建',
    desc: '基于 Coze 与 Dify 搭建多节点 Agent 工作流，把 LLM、RAG、工具调用串成稳定可复用的业务链路，让非技术团队也能跑通 AI 流程。',
    tags: ['Coze', 'Dify', 'RAG', 'Agent'],
  },
  {
    idx: '03',
    title: 'Prompt Engineering',
    desc: '不只是写提示词，而是设计完整的 Prompt 结构——角色定义、上下文注入、输出约束、边界处理，让模型稳定输出可用结果。',
    tags: ['Prompt Design', 'Few-shot', 'CoT'],
  },
  {
    idx: '04',
    title: '模型评测与应用判断',
    desc: '结合模型评测经验，围绕真实任务制定验收标准、分析 Bad Case，比较效果、成本与可控性，用评测结果推动方案迭代。',
    tags: ['Evaluation', 'Bad Case', 'Iteration'],
  },
];

export type Project = {
  index: string;
  category: string;
  title: string;
  desc: string;
  tags: readonly string[];
  image: string;
  url: string;
};

export const PROJECTS: readonly Project[] = [
  {
    index: '01',
    category: 'AI · INTERACTIVE NARRATIVE',
    title: '失色纪·修钟人',
    desc: '一款纯前端实现的网页互动文字冒险游戏。用 HTML/CSS/JS 从零构建完整游戏引擎——剧情分支、状态管理、关卡系统、攻略演示，全部自己跑通。它不是模板套壳，是一个能玩的东西。',
    tags: ['HTML', 'CSS', 'JS', 'Game Design', 'Narrative'],
    image: '/images/project1.jpg',
    url: '/XM/Harrygame-main/index.html',
  },
  {
    index: '02',
    category: 'AI · WEB ENGINEERING · FPS',
    title: '网页第一人称射击',
    desc: '用纯前端 + Three.js 在浏览器里造了一个 3D 世界。准星系统、HUD 界面、第一人称视角控制——这件事的意义不在于游戏本身，在于证明 Web 能做到多少人以为它做不到的事。',
    tags: ['Three.js', 'WebGL', 'HUD', '3D', 'Frontend'],
    image: '/images/project2.jpg',
    url: '/XM/CFyouxi.html',
  },
  {
    index: '03',
    category: 'PRODUCT · BRD',
    title: '灵频 · 玄学社交产品商业规划',
    desc: '面向 18~28 岁 Z 世代，用玄学语言匹配同频陌生人的社交产品。从市场洞察、用户模型到商业路径，完整输出一份 BRD——不是为了好看，是为了验证一个反常识的产品逻辑能不能成立。',
    tags: ['BRD', 'Market Research', 'Z-Gen', 'Social Product'],
    image: '/images/project3.jpg',
    url: '/XM/lingpin_BRD.html',
  },
  {
    index: '04',
    category: 'PRODUCT · KNOWLEDGE SYSTEM',
    title: '产品经理全流程作战地图',
    desc: '把产品经理从需求到上线的完整方法论，做成一个可交互的可视化知识库页面。不是文档，是一张能点击、能导航、能被真正用起来的工作地图。',
    tags: ['Interactive', 'PM Methodology', 'Visualization', 'HTML'],
    image: '/images/project4.jpg',
    url: '/XM/ai-pm-qieman-academy/index.html',
  },
];

export type Tool = {
  type: string;
  name: string;
  role: string;
  desc: string;
  tags: readonly string[];
  icon: string; // simple-icons slug
  iconUrl?: string; // 优先使用的图标 URL（覆写 simple-icons）
};

export const AI_PARTNERS: readonly Tool[] = [
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
    name: 'Codex / Claude Code',
    role: '原型开发协作',
    desc: '把需求拆成可执行任务，借助 AI 搭建原型、排查问题；我负责明确目标、检查结果并推动修正。',
    tags: ['Web Coding', 'Frontend', 'Debugging'],
    icon: 'claude',
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
    desc: '用 AI 辅助概念草图、视觉探索和内容素材制作，结合具体用途筛选结果，再调整细节与表达。',
    tags: ['Image', 'Video', 'Concept'],
    icon: 'midjourney',
    iconUrl: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=64',
  },
];

export const CRAFT_INFRA: readonly Tool[] = [
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

export type ContactRow = {
  label: string;
  value: string;
};

export const CONTACTS: readonly ContactRow[] = [
  { label: 'EMAIL', value: '2499694881@qq.com' },
  { label: 'PHONE', value: '157 0012 9377' },
  { label: 'WECHAT', value: 'Rnlfd-7' },
  { label: 'WECHAT QR', value: '/images/wechat-qr.jpg' },
];

export const RESUME_URL = '/resume/AI%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86.pdf';

export const PROFILE = {
  name: '刘盛瑞',
  englishName: 'JASON',
  role: 'AI PRODUCT MANAGER',
  tagline: '从前沿 AI，到真实应用',
} as const;
