export const introTopics = [
  { index: "01", title: "提示词", body: "一句输入，怎样改变模型的第一步反应。" },
  { index: "02", title: "系统提示词", body: "角色、边界、语气，怎样稳定输出风格。" },
  { index: "03", title: "输出", body: "先看自然语言回答本身是怎么来的。" },
  { index: "04", title: "结构化输出", body: "把回答从“能看”变成“能用”。" },
  { index: "05", title: "Function Calling", body: "模型怎样决定调用函数、传什么参数。" },
  { index: "06", title: "DuckDuckGo", body: "为什么需要搜索，搜索能补什么信息。" },
  { index: "07", title: "搜索功能实现", body: "一次真实搜索请求是怎样发出和回流的。" },
  { index: "08", title: "ReAct 循环", body: "推理、行动、观察，Agent 从这里开始。 " },
];

export const stagePills = ["Prompt", "System", "Output", "JSON", "Function", "Search", "ReAct"];

export const examplePanels = [
  {
    label: "提示词",
    value: "给一个 AI 架构教学网站写一句首页副标题。",
  },
  {
    label: "系统提示词",
    value: "面向懂一点代码的小白。要求清楚、克制、不要卖弄术语。",
  },
  {
    label: "输出",
    value: "把 AI 的工作方式，一层一层看明白。",
  },
  {
    label: "结构化输出",
    value: `{
  "headline": "把 AI 的工作方式看明白",
  "subheadline": "从 Prompt 到 Agent，逐步建立一张清晰地图。"
}`,
  },
];

export const exampleCards = [
  {
    title: "Function Calling",
    body: "当模型判断自己需要外部能力时，它不会直接编结果，而是先发起一个结构化函数调用。",
    code: `{
  "name": "search_web",
  "arguments": {
    "query": "DuckDuckGo 是什么"
  }
}`,
  },
  {
    title: "DuckDuckGo",
    body: "搜索不是为了显得高级，而是为了补模型不知道、或需要最新验证的信息。",
    code: `query -> DuckDuckGo -> results -> 摘要 -> 回到上下文`,
  },
  {
    title: "ReAct 循环",
    body: "推理、行动、观察，才是 Agent 和普通聊天真正分开的地方。",
    code: `Thought -> Act -> Observation -> Thought`,
  },
];

export const apiCards = [
  {
    title: "前端",
    body: "GitHub Pages 托管静态页面，负责示例、讲解和可视化。",
  },
  {
    title: "后端",
    body: "Python / FastAPI 单独部署，用来接 OpenAI、搜索和后续工具。",
  },
];
