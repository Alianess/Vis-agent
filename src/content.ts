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

export const ioDemo = {
  input:
    "我刚开始学 AI，为什么同样是问问题，有时候回答特别空，有时候又很具体？请用中文解释，别太学术。",
  think:
    "先抓住用户真正困惑的点：不是要模型原理，而是想知道为什么同样在“问 AI”，结果会有时泛、有时具体。回答里先给一句直观结论，再用日常类比解释“问题越具体，答案越具体”。语气要像老师，不要上来堆术语。",
  output:
    "因为 AI 会尽量沿着你给出的信息范围来回答。你问得越宽，它就越容易先给一段通用答案；你把对象、场景和要求说清楚，它才更容易给出贴近你需求的内容。就像你只说“给我推荐点东西”，别人很难推荐准；但你说“给刚学 AI 的人推荐三篇入门文章”，结果就会具体很多。",
  note: "这一页先让你看到：即使还没上系统提示词和工具，单是输入本身的写法，就已经在强烈影响输出。",
};

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
