export const introTopics = [
  { index: "01", title: "输入与输出", body: "先看一条输入，怎样变成一条输出。" },
  { index: "02", title: "系统提示词", body: "再看角色、目标和边界怎样影响回答。" },
  { index: "03", title: "结构化输出", body: "再把回答从“能看”变成“能编程”。" },
  { index: "04", title: "Function Calling", body: "模型怎样决定调用外部函数。" },
  { index: "05", title: "搜索与 DuckDuckGo", body: "为什么需要搜索，以及搜索请求怎样发出、返回、回填。" },
  { index: "06", title: "ReAct 循环", body: "推理、行动、观察，Agent 从这里开始。" },
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
  { id: "search", title: "搜索与 DuckDuckGo", subtitle: "搜索为什么重要，以及请求怎样流转" },
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

export const systemPromptDemos = [
  {
    id: "roleplay",
    label: "角色扮演",
    title: "把模型先变成老师",
    subtitle: "同一句用户输入，先规定身份、语气和目标，回答就会立刻收束。",
    systemPrompt:
      "你是一位面向零基础学习者的 AI 入门老师。你的任务是把抽象概念讲得具体、温和、短句化。回答时必须先给一句结论，再给一个生活化类比，不要使用过多术语。",
    userInput: "请解释一下，为什么 system prompt 会让同一个问题得到不同风格的回答？",
    think:
      "用户想理解 system prompt 的作用，不需要底层实现。按照老师角色，先给一句结论，再用生活类比。控制语气温和、句子短，不要把注意力带到模型内部机制。",
    output:
      "结论：因为 system prompt 会先替你规定 AI 应该以什么身份、什么方式来回答。它就像导演先给演员一张角色卡，同样一句台词，老师、律师和客服说出来的感觉会完全不一样。",
    note: "这一类 prompt 最适合做角色设定、语气控制和回答风格统一。",
  },
  {
    id: "fortune",
    label: "八字分析",
    title: "把模型变成一位有边界感的命理解读助手",
    subtitle: "这类 prompt 不只是“会算”，还要规定输出结构、口吻和风险边界。",
    systemPrompt:
      "你是一位中文命理解读助手，擅长把八字分析写得清楚、像真人老师在讲。用户提供年柱、月柱、日柱、时柱后，你需要按“整体气质、性格倾向、关系模式、未来一两年重心、建议”五段输出。语气平和，不制造恐惧，不做绝对判断，明确说明这是一种传统文化视角的解读，不替代现实决策。",
    userInput: "我的八字是：甲子年、丙寅月、辛巳日、己亥时。请帮我看一下性格特点和这两年的重心。",
    think:
      "需要体现 system prompt 的约束力：先按五段结构来，再保持命理老师口吻，同时加上边界说明，避免绝对化。内容上给出较像样的概括，让用户能直观看到 prompt 如何塑造输出格式。",
    output:
      "先说明一下，下面这段更像是从传统命理视角做的一种性格与节奏解读，适合参考，不替代现实判断。整体气质上，你给人的感觉往往是外柔内硬，表面克制，但内里有自己的判断和坚持。性格倾向上，既有细致、观察力强的一面，也容易在压力大时把情绪收得太紧。关系模式上，你通常更在意长期稳定和彼此可靠，不太喜欢过度消耗型的人际关系。未来一两年的重心，会更偏向重新整理自己的节奏、选择更适合长期投入的方向，而不是一味求快。建议是：少做被外界推着走的决定，多把精力放在真正能积累下来的关系、技能和项目上。",
    note: "精心设计的 system prompt，能同时控制身份、结构、语气、边界和风险表达。",
  },
  {
    id: "critic",
    label: "严格编辑",
    title: "把模型变成一个有标准的重写编辑",
    subtitle: "不是单纯让它“帮我改”，而是规定它按什么标准改。",
    systemPrompt:
      "你是一位严格但不刻薄的中文编辑。你的任务是把用户给出的句子改得更短、更清楚、更像产品文案。必须保留原意，删除空话，避免套话。输出时先给“修改版”，再给“为什么这样改”的一句解释。",
    userInput: "请帮我改这句话：我们希望通过这个网站帮助用户更加深入和全面地理解 AI 的整体工作方式。",
    think:
      "重点是让输出体现编辑角色的标准，不只是润色。先压缩句子，再突出“更短、更清楚、更像产品文案”，最后给一句修改理由，形成 prompt 规定的输出格式。",
    output:
      "修改版：这个网站帮你更清楚地看懂 AI 是怎么工作的。为什么这样改：它去掉了空泛词，句子更短，读者一眼就能抓住重点。",
    note: "这类 prompt 很适合做重写、校对、审稿、品牌语气统一。",
  },
];

export const structuredOutputDemo = {
  userInput: "请把这本书整理给我：书名《人类简史》，作者尤瓦尔·赫拉利，主题是文明演化、认知革命和人类社会。",
  naturalThink:
    "普通回答只需要把信息讲清楚即可，不必强约束字段。用自然语言总结这本书讲什么、为什么值得看，保持像推荐书单里的介绍语气。",
  naturalOutput:
    "《人类简史》是尤瓦尔·赫拉利写的一本讲人类文明如何一路演化到今天的通识作品，重点会讲认知革命、农业革命和现代社会是怎么一步步塑造人的。它适合想快速建立“人类社会是怎么走到今天”的整体视角的人。",
  schema: `{
  "title": "string",
  "author": "string",
  "topics": ["string"],
  "summary": "string",
  "recommended_for": "string"
}`,
  structuredThink:
    "这次不是自由发挥，而是严格按字段填值。先识别书名和作者，再把主题拆成 topics 数组，summary 保持一句概括，recommended_for 用一句人群描述。不要输出字段外内容。",
  structuredOutput: `{
  "title": "人类简史",
  "author": "尤瓦尔·赫拉利",
  "topics": ["文明演化", "认知革命", "人类社会"],
  "summary": "一本用宏观视角解释人类文明如何形成与变化的通识作品。",
  "recommended_for": "想快速建立历史与社会整体理解的入门读者"
}`,
  note: "自然语言输出更适合人读，结构化输出更适合程序继续处理、筛选、存储和展示。",
};

export const functionCallDemos = [
  {
    id: "time",
    label: "当前时间",
    title: "什么时候该调用函数，而不是直接瞎猜",
    subtitle: "像“现在几点”这种问题，模型自己编一个很危险，最合适的做法就是调函数拿实时结果。",
    userInput: "现在几点了？请用中文告诉我当前系统时间。",
    withoutToolsOutput:
      "如果没有可调用的工具，一个更稳妥的模型通常只能告诉你：它无法直接读取你设备上的当前系统时间，因此没法保证给出的时间是真实最新的。",
    think:
      "用户要的是当前系统时间，这属于实时信息，不能靠记忆回答。应该调用 get_current_time，而不是直接生成一个可能过时的时间。",
    functionName: "get_current_time",
    toolSpec: `[
  {
    "type": "function",
    "name": "get_current_time",
    "description": "读取当前系统时间",
    "parameters": {
      "type": "object",
      "properties": {
        "timezone": { "type": "string" },
        "format": { "type": "string" }
      },
      "required": ["timezone"]
    }
  }
]`,
    argumentsJson: `{
  "timezone": "Asia/Shanghai",
  "format": "yyyy-MM-dd HH:mm:ss"
}`,
    resultLabel: "函数返回",
    note: "Function calling 最核心的一点，就是把“该查的”交给函数，把“该说的”交给模型。",
  },
  {
    id: "weather",
    label: "天气查询",
    title: "模型先决定调用哪个工具，再根据结果组织回答",
    subtitle: "天气这类问题不只要调用函数，还要补出参数，比如城市和日期。",
    userInput: "帮我看一下明天上海天气，顺便告诉我要不要带伞。",
    withoutToolsOutput:
      "如果没有工具，模型最多只能给你一个泛泛建议，比如提醒你出门前查天气 App，但它没法真的知道“明天上海”的最新预报。",
    think:
      "用户需要最新天气，而且还带了一个生活建议。先调用 weather_lookup 拿到上海明天的天气数据，再根据降雨概率组织成中文回答。",
    functionName: "weather_lookup",
    toolSpec: `[
  {
    "type": "function",
    "name": "weather_lookup",
    "description": "查询指定地点与日期的天气",
    "parameters": {
      "type": "object",
      "properties": {
        "location": { "type": "string" },
        "date": { "type": "string" }
      },
      "required": ["location", "date"]
    }
  }
]`,
    argumentsJson: `{
  "location": "上海",
  "date": "明天"
}`,
    resultLabel: "函数返回",
    toolResult: `{
  "location": "上海",
  "forecast": "小雨转阴",
  "temperature": "16-22°C",
  "rain_probability": "72%"
}`,
    output:
      "明天上海大概率会有一阵小雨，气温大概在 16 到 22 度之间。最好带一把伞，尤其如果你白天要出门久一点，会更稳妥。",
    note: "这里模型不是自己查天气，而是先把地点和日期变成函数参数，再用返回值生成自然语言回答。",
  },
  {
    id: "docs",
    label: "文档检索",
    title: "让模型去函数里拿资料，再回来回答用户",
    subtitle: "这类场景常见于产品助手、客服助手和知识库问答。",
    userInput: "这个教学网站里，结构化输出这一节主要想讲什么？",
    withoutToolsOutput:
      "如果没有检索工具，模型很可能只能按自己印象猜一个大概方向，但它并不能确认这是不是站内课程里真实写过的内容。",
    think:
      "这是站内知识，不该凭空回答。先调用 search_lessons，从课程文档里检索“结构化输出”相关内容，再基于命中的资料给一个简洁总结。",
    functionName: "search_lessons",
    toolSpec: `[
  {
    "type": "function",
    "name": "search_lessons",
    "description": "检索站内课程文档",
    "parameters": {
      "type": "object",
      "properties": {
        "query": { "type": "string" },
        "top_k": { "type": "integer" }
      },
      "required": ["query"]
    }
  }
]`,
    argumentsJson: `{
  "query": "结构化输出 这一节 主要讲什么",
  "top_k": 2
}`,
    resultLabel: "函数返回",
    toolResult: `{
  "hits": [
    "结构化输出这一页会对比自然语言结果和 JSON 结果。",
    "核心目的是让学习者理解“能看”和“能编程”之间的区别。"
  ]
}`,
    output:
      "这一节主要想讲两件事：第一，同一个问题既可以输出成一段给人看的自然语言，也可以输出成固定字段的 JSON；第二，只有字段稳定了，程序才更容易继续渲染、存储或传给下一个函数。",
    note: "这就是很多产品里的“AI 助手查知识库”原型：模型负责决定查什么，函数负责真的去拿资料。",
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
