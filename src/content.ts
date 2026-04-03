export const introTopics = [
  { index: "01", title: "输入与输出", body: "先看一条输入，怎样变成一条输出。" },
  { index: "02", title: "系统提示词", body: "再看角色、目标和边界怎样影响回答。" },
  { index: "03", title: "结构化输出", body: "再把回答从“能看”变成“能编程”。" },
  { index: "04", title: "Function Calling", body: "模型怎样决定调用外部函数。" },
  { index: "05", title: "DuckDuckGo", body: "为什么需要搜索，搜索补了什么信息。" },
  { index: "06", title: "搜索功能实现", body: "真实搜索请求怎样发出、返回、回填。" },
  { index: "07", title: "ReAct 循环", body: "推理、行动、观察，Agent 从这里开始。" },
];

export const stagePills = ["提示词", "系统提示词", "输出", "结构化输出", "Function Calling", "搜索", "ReAct"];

export const examplePanels = [
  {
    label: "提示词",
    value: "请用一句话解释什么是系统提示词。",
  },
  {
    label: "系统提示词",
    value: "你是一个面向初学者的 AI 入门老师。用中文回答，必须清楚、简短、不要堆术语。",
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

export const learningModules = [
  { id: "io", title: "输入与输出", subtitle: "一条输入怎样变成一条输出" },
  { id: "system", title: "系统提示词", subtitle: "角色、目标、边界" },
  { id: "structured", title: "结构化输出", subtitle: "JSON 与可编程结果" },
  { id: "function", title: "Function Calling", subtitle: "函数调用与参数" },
  { id: "duckduckgo", title: "DuckDuckGo", subtitle: "搜索为什么重要" },
  { id: "search-flow", title: "搜索功能实现", subtitle: "请求、结果、回填" },
  { id: "react", title: "ReAct 循环", subtitle: "Thought / Act / Observation" },
];

export const ioScenarios = [
  {
    id: "plain",
    label: "普通问法",
    input: "请解释什么是系统提示词。",
    output: "系统提示词是在回答前先给模型设定角色、目标和边界的一段隐藏说明。",
    note: "这是最基本的输入输出关系：你给模型一句话，它返回一句话。",
  },
  {
    id: "beginner",
    label: "面向小白",
    input: "请用一句话，向初学者解释什么是系统提示词。",
    output: "系统提示词就像在正式回答前，先悄悄告诉 AI 它应该以什么身份、什么规则来回答。",
    note: "当输入里加入受众限制后，输出会明显更贴近目标读者。",
  },
  {
    id: "example",
    label: "加入例子",
    input: "请用一句话解释什么是系统提示词，并顺带举个小例子。",
    output: "系统提示词就是先告诉 AI 应该怎样回答，例如先规定“你要像老师一样清楚地讲”。",
    note: "输入里提出附加要求，输出就会带上新的结构和内容。",
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
