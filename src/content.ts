export const learningPath = [
  "Prompt 是什么",
  "大模型与 API 接口",
  "System Prompt 与角色设定",
  "结构化输出",
  "工具调用",
  "Skill / MCP / Memory / RAG",
  "单 Agent 执行全景",
];

export const modules = [
  {
    title: "Prompt 基础",
    description: "先看懂怎么和模型说话，再进入更复杂的运行时。",
    tag: "开篇",
  },
  {
    title: "大模型与 API",
    description: "看清前端、后端、模型服务之间的关系，不再把 AI 当黑盒。",
    tag: "核心",
  },
  {
    title: "System Prompt",
    description: "理解角色设定、边界控制、系统规则是怎么改变输出的。",
    tag: "基础",
  },
  {
    title: "结构化输出",
    description: "从自然语言过渡到 JSON、Schema 与可编程结果。",
    tag: "进阶",
  },
  {
    title: "工具调用",
    description: "看清模型何时决定调用工具、参数怎么传、结果怎么回流。",
    tag: "运行时",
  },
  {
    title: "记忆与 RAG",
    description: "当前上下文、压缩摘要、Markdown 记忆、向量检索各自负责什么。",
    tag: "运行时",
  },
];

export const quickFacts = [
  {
    label: "站点形态",
    value: "静态站",
    note: "GitHub Pages 可直接部署",
  },
  {
    label: "交互能力",
    value: "可接 API",
    note: "前端通过 VITE_API_BASE_URL 调后端",
  },
  {
    label: "后端路线",
    value: "Python / FastAPI",
    note: "后续接 OpenAI 与 Chroma",
  },
];

export const sections = [
  {
    id: "what-you-learn",
    eyebrow: "你将学会什么",
    title: "先理解 AI 怎么工作，再理解 Agent 为什么复杂。",
    body:
      "这不是给你塞一堆术语的站点，而是一条从 Prompt 到 Agent 的可视化路径。你会先建立最基础的 API 与模型认知，再逐步看到 System Prompt、结构化输出、工具调用、记忆与 RAG 怎么一层层叠上去。",
  },
  {
    id: "how-to-use",
    eyebrow: "这个项目怎么使用",
    title: "两种进入方式，适合两种学习节奏。",
    body:
      "如果你完全刚开始，先按推荐学习路径看；如果你已经懂一点代码，直接从 Agent 全景图切进去也没问题。整站会保持中文、模块化、逐层增加复杂度。",
  },
  {
    id: "api-ready",
    eyebrow: "静态站也能接 API",
    title: "页面本身是静态的，但内容完全可以向后端请求真实数据。",
    body:
      "静态站负责页面和交互，后端负责密钥、模型调用、Embedding、检索与工具执行。也就是说，GitHub Pages 只承载前端，而你的 Python 服务负责真实能力。",
  },
];

export const audiences = [
  {
    title: "普通学习者",
    description: "只需要打开网站链接，不需要安装 npm、Python 或数据库。",
    items: ["打开网页", "按学习路径阅读", "点击交互模块体验"],
  },
  {
    title: "前端开发者",
    description: "只在你本地调试和修改静态站时，才需要 npm。",
    items: ["npm install", "npm run dev", "npm run build"],
  },
  {
    title: "后端开发者",
    description: "只在你接真实模型 API、Embedding 与 Chroma 时，才需要 Python 环境。",
    items: ["python venv", "FastAPI", "OpenAI API", "Chroma"],
  },
];

export const openingDemo = {
  request: "帮我给一个 AI 架构教学网站写一句首页副标题。",
  promptOnly:
    "这是最原始的模式：你只给模型一个任务，它会尽量回答，但没有额外角色、风格边界或格式约束。",
  systemPrompt:
    "你是一个中文技术教育网站的内容策划，目标用户是懂一点代码但还没有建立整体 AI 认知的小白。文风要求：清晰、克制、不要故作玄虚。",
  plainResponse:
    "用清晰可视化的方式，带你一步步看懂 AI 与 Agent 架构。",
  structuredResponse: `{
  "headline": "一步步看懂 AI 与 Agent 架构",
  "subheadline": "从 Prompt、大模型到工具调用、记忆与 RAG，建立一张真正清晰的认知地图。",
  "tone": "清晰、克制、面向初学者"
}`,
};
