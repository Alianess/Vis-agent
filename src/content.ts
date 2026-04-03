export const learningPath = [
  "Prompt 是什么",
  "大模型与 API 接口",
  "System Prompt 与角色设定",
  "结构化输出",
  "工具调用与返回结果",
  "检索、记忆与 RAG",
  "单 Agent 运行全景",
];

export const quickFacts = [
  {
    label: "适合谁",
    value: "会一点代码的人",
    note: "不要求会做 Agent，但希望把 AI 架构看懂",
  },
  {
    label: "怎么用",
    value: "先看图，再看例子",
    note: "由浅入深，不一上来塞满术语",
  },
  {
    label: "形态",
    value: "静态站 + 可接 API",
    note: "页面可直接部署，真实能力后续接 Python 后端",
  },
];

export const highlightCards = [
  {
    step: "01",
    title: "先理解怎么和模型说话",
    description: "从 Prompt、System Prompt、结构化输出开始，先建立最基础的直觉。",
  },
  {
    step: "02",
    title: "再理解应用怎么把这件事跑起来",
    description: "前端、后端、模型 API、工具返回、检索上下文，一层一层串起来。",
  },
  {
    step: "03",
    title: "最后再进入 Agent",
    description: "当循环、工具、记忆和检索叠上去之后，Agent 才真正出现。",
  },
];

export const sections = [
  {
    id: "what-you-learn",
    eyebrow: "你会得到什么",
    title: "把零散的 AI 概念，拼成一张完整地图。",
    body:
      "很多人已经知道 Prompt、RAG、Tool Call、MCP 这些词，但它们在脑子里还是分散的。这个站点要做的，就是把这些词连成一条清楚的路径。",
  },
  {
    id: "how-to-use",
    eyebrow: "怎么开始",
    title: "先看最小闭环，再逐步加复杂度。",
    body:
      "你会先看到最基础的“用户输入 -> 应用调用模型 -> 模型返回结果”，然后再看到角色设定、格式约束、工具调用、记忆与检索是怎么一层层叠上去的。",
  },
  {
    id: "api-ready",
    eyebrow: "怎么运行",
    title: "页面是静态的，但站点可以连接真实 API。",
    body:
      "GitHub Pages 托管前端页面；后端可以单独部署，用来接 OpenAI、Embedding、Chroma 与后续工具能力。也就是说，界面轻，但能力可以是真实的。",
  },
];

export const audiences = [
  {
    title: "只想学习的人",
    description: "直接打开站点就行，不需要安装 npm、Python 或数据库。",
    items: ["打开链接", "按学习路径阅读", "看图、看例子、看流程"],
  },
  {
    title: "要改前端的人",
    description: "只有在你想本地修改页面时，才需要 npm。",
    items: ["npm install", "npm run dev", "npm run build"],
  },
  {
    title: "要接真实能力的人",
    description: "只有在你要接真实模型 API、Embedding、检索时，才需要 Python 后端。",
    items: ["FastAPI", "OpenAI Responses API", "text-embedding-3-small", "Chroma"],
  },
];

export const openingDemo = {
  request: "给一个 AI 架构教学网站写一句首页副标题。",
  plainPrompt:
    "写一句首页副标题，介绍这个网站是帮助人理解 AI 和 Agent 架构的。",
  systemPrompt:
    "你是一个中文技术教育产品的内容策划。目标用户：会一点代码，但还没有真正理解 AI 架构。文风要求：清楚、克制、不要夸张，不要使用营销话术。",
  plainResponse: "帮助你快速理解 AI 与 Agent 架构。",
  structuredResponse: `{
  "headline": "把 AI 架构看明白",
  "subheadline": "从 Prompt 到 RAG，再到 Agent 运行方式，逐步建立一张清晰地图。",
  "tone": "清楚、克制、面向初学者"
}`,
};

export const modules = [
  {
    title: "Prompt 与模型",
    description: "理解输入、角色设定和输出控制，是后面一切能力的起点。",
    tag: "开篇",
  },
  {
    title: "API 与应用链路",
    description: "把网页、后端和模型服务之间的关系看清楚，不再把 AI 当黑盒。",
    tag: "基础",
  },
  {
    title: "工具调用",
    description: "看模型怎么决定调用工具、怎么传参数、怎么读取结果。",
    tag: "运行时",
  },
  {
    title: "记忆与检索",
    description: "当前上下文、压缩摘要、Markdown 记忆、向量检索分别解决什么问题。",
    tag: "运行时",
  },
  {
    title: "Skill 与 MCP",
    description: "弄清什么是能力注入、什么是工具接入、什么是协议层。",
    tag: "架构",
  },
  {
    title: "Agent 全景",
    description: "最后再把循环、工具、记忆、检索和输出拼成一张完整图。",
    tag: "总览",
  },
];
