export const learningPath = [
  "Prompt",
  "System",
  "结构化输出",
  "工具调用",
  "检索与记忆",
  "Agent",
];

export const highlightCards = [
  {
    step: "01",
    title: "先看输入",
    description: "Prompt、System Prompt、输出格式",
  },
  {
    step: "02",
    title: "再看链路",
    description: "前端、后端、模型 API、工具返回",
  },
  {
    step: "03",
    title: "最后看 Agent",
    description: "循环、检索、记忆叠起来之后会发生什么",
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
    description: "先知道模型是怎么被引导的。",
    tag: "开篇",
  },
  {
    title: "API 与应用链路",
    description: "看见网页、后端和模型之间的真实关系。",
    tag: "基础",
  },
  {
    title: "工具调用",
    description: "看工具怎么被调用、结果怎么回流。",
    tag: "运行时",
  },
  {
    title: "记忆与检索",
    description: "看上下文、压缩、检索分别负责什么。",
    tag: "运行时",
  },
  {
    title: "Agent 全景",
    description: "最后把循环、工具、记忆和输出拼起来。",
    tag: "总览",
  },
];
