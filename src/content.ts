export const stagePills = [
  "Prompt",
  "System",
  "JSON",
  "Tool",
  "Retrieval",
  "Agent",
];

export const comparison = {
  request: "给一个 AI 架构教学网站写一句首页副标题。",
  prompt: "写一句首页副标题，介绍这个网站帮助人理解 AI 和 Agent 架构。",
  system:
    "你是一个中文技术教育产品的内容策划。目标用户：会一点代码，但还没有真正理解 AI 架构。文风要求：清楚、克制、不要夸张。",
  output: `{
  "headline": "把 AI 架构看明白",
  "subheadline": "从 Prompt 到 Agent，逐步建立一张清晰地图。"
}`,
};

export const steps = [
  {
    index: "01",
    title: "先看输入",
    body: "Prompt、System Prompt、结构化输出怎么改变模型行为。",
  },
  {
    index: "02",
    title: "再看链路",
    body: "网页、后端、模型 API、工具返回怎样连成一次完整调用。",
  },
  {
    index: "03",
    title: "最后看 Agent",
    body: "当工具、检索、记忆和循环叠起来之后，Agent 才真正出现。",
  },
];

export const apiCards = [
  {
    title: "前端",
    body: "GitHub Pages 托管静态页面，负责可视化、讲解和交互体验。",
  },
  {
    title: "后端",
    body: "Python / FastAPI 单独部署，用来接 OpenAI、Embedding、Chroma 与工具能力。",
  },
];
