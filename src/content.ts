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

export const stagePills = ["提示词", "系统提示词", "输出", "结构化输出", "Function Calling", "搜索", "ReAct"];

export const examplePanels = [
  {
    label: "提示词",
    value: "请用一句话解释什么是系统提示词。",
  },
  {
    label: "系统提示词",
    value: "你是一个面向初学者的 AI 入门老师。用中文回答，必须清楚、简短、不要使用术语堆砌。",
  },
  {
    label: "输出",
    value: "系统提示词是在回答前先给模型设定角色、目标和边界的一段隐藏说明。",
  },
  {
    label: "结构化输出",
    value: `{
  "concept": "系统提示词",
  "summary": "在回答前给模型设定角色、目标和边界",
  "difficulty": "入门"
}`,
  },
];

export const exampleCards = [
  {
    title: "Function Calling",
    body: "当模型判断自己需要外部能力时，它不会直接编结果，而是先发起一个结构化函数调用。",
    code: `{
  "name": "search_duckduckgo",
  "arguments": {
    "query": "系统提示词 和 提示词 有什么区别"
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
