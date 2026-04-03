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
    label: "一句直接问",
    input: "为什么 AI 有时候回答得像在说空话？",
    systemPrompt: "",
    output:
      "因为你的问题如果太宽泛，AI 不知道你要深、要浅、要例子还是要步骤，就容易给出一段听起来对、但不够具体的回答。",
    note: "同样是提问，只要输入太宽，输出就容易变得泛。",
  },
  {
    id: "beginner",
    label: "限定对象",
    input: "请用中文向刚接触 AI 的人解释，为什么 AI 有时候回答得像在说空话。",
    systemPrompt: "",
    output:
      "因为你只给了 AI 一个大方向，却没有说清楚你要它怎么讲，所以它会先给你一段最安全、最通用的回答。",
    note: "当输入里出现受众和语言要求，输出就会开始贴近具体读者。",
  },
  {
    id: "example",
    label: "要求结构",
    input:
      "请向刚接触 AI 的人解释，为什么 AI 有时候回答得像在说空话。先给一句结论，再给一个生活化例子。",
    systemPrompt: "",
    output:
      "结论：当你的问题不够具体时，AI 往往会先给出最稳妥的通用答案。例子：就像你问别人“帮我推荐点东西”，如果不说预算、用途和喜好，对方通常也只能先随便给你几个很泛的建议。",
    note: "一旦你把输出结构也写进输入，模型就会更像在按说明书交作业。",
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
