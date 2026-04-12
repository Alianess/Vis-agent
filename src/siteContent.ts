export const siteTracks = [
  {
    index: "01",
    title: "学习地图",
    body: "先看到整条知识路线，再决定从哪一章开始学，避免内容一多就失去方向感。",
    href: "#/map",
    cta: "查看地图",
  },
  {
    index: "02",
    title: "独立章节",
    body: "每章都是单独路由，并且都按“概念、为什么需要、最小示例、误区、和上一层关系”来展开。",
    href: "#/learn/io",
    cta: "进入第一章",
  },
  {
    index: "03",
    title: "架构总览",
    body: "用一张连续的系统图，把 Prompt、工具、MCP、ReAct、记忆、评测和 Harness 串起来。",
    href: "#/architecture",
    cta: "打开总览",
  },
  {
    index: "04",
    title: "术语表",
    body: "后面名词会越来越多，所以要有一个持续扩写的词典页，让用户随时回来看。",
    href: "#/glossary",
    cta: "查看术语",
  },
  {
    index: "05",
    title: "实战区",
    body: "允许用户自己填模型接口和密钥，在浏览器里跑一个最小 Agent，逐步从纯教学走向教学加练习。",
    href: "#/studio",
    cta: "打开实验台",
  },
] as const;

export const roadmapPhases = [
  {
    label: "现在",
    title: "会回答",
    body: "先讲清楚输入、角色、输出格式和函数调用，让用户知道模型本体到底在做什么。",
  },
  {
    label: "下一段",
    title: "会查东西",
    body: "加入搜索、外部 API、知识检索，让用户看到模型为什么不能只靠记忆硬答。",
  },
  {
    label: "再往后",
    title: "会做任务",
    body: "开始讲多步执行、状态、工具选择、失败重试和任务拆解，用户会第一次真正感受到 Agent 不是聊天框。",
  },
  {
    label: "最终阶段",
    title: "会自我检查",
    body: "再引到日志、回放、评测、版本对比、安全边界和 harness，让用户理解为什么现代 Agent 系统一定会长出一层“观察和检验”的外部工作台。",
  },
] as const;

export const browserBoundaryCards = [
  {
    title: "浏览器里能直接做",
    body: "OpenAI 兼容模型调用、公开 HTTP API、部分支持 CORS 的远程服务，以及本地浏览器能提供的时间、表单和轻量状态。",
  },
  {
    title: "有条件才能做",
    body: "Remote MCP 只有在服务支持浏览器访问、CORS 放行、鉴权方式适合前端、并且协议是 HTTP 方向时，纯静态站才有机会直连。",
  },
  {
    title: "浏览器里不能做",
    body: "Stdio 型 MCP、本地文件系统、隐藏服务器密钥、内网代理和需要你替用户保密的执行链路，纯前端都不该硬做。",
  },
] as const;

export const chapterScaffolds = {
  io: {
    concept: "这一章讲最基础的一层：用户给一句输入，模型怎样在内部读它、理解它，再一步步变成输出。",
    why: "如果用户连“输入怎么影响输出”都还没抓住，后面看到 system prompt、tool calling 和 Agent 会更容易觉得像魔法。",
    minimumExample: "同一个问题，写得宽泛时答案会空，写得具体时答案会收束。这是所有后续章节的起点。",
    misconception: "误区不是“模型会不会思考”，而是以为输出质量只取决于模型大小，不取决于输入写法。",
    previousLayer: "这是第一层，没有上一层。后面所有章节都默认建立在“输入会改变输出”这个基础上。",
  },
  system: {
    concept: "这一章讲 system prompt：它像隐藏在用户问题前面的角色卡，先规定身份、目标、边界和语气。",
    why: "很多人以为“模型时好时坏”只是随机性，其实经常是因为上层约束没有先写清楚。",
    minimumExample: "同一句用户问题，换成老师、编辑、客服三种 system prompt，回答风格会明显变化。",
    misconception: "system prompt 不是神秘开关。它本质上还是文本约束，不是给模型外挂一个新脑子。",
    previousLayer: "上一层是“输入影响输出”；这一层是在用户输入之前，再加一段更高优先级的说明。",
  },
  structured: {
    concept: "这一章讲为什么回答不能只停留在“人能看懂”，还要进一步变成“程序也能稳定读取”。",
    why: "一旦你要渲染页面、存数据库、传给下一个函数，就不能每次都让模型自由发挥段落格式。",
    minimumExample: "把一本书先写成自然语言简介，再写成 JSON 字段，马上就能看出“能读”和“能编程”的差别。",
    misconception: "结构化输出不是为了好看，而是为了稳定、可检查、可继续处理。",
    previousLayer: "上一层讲角色和风格；这一层开始把输出从“像人说话”推进到“像程序接口”。",
  },
  function: {
    concept: "这一章讲 function calling：模型先决定要不要调工具，再把工具名和参数写成结构化调用。",
    why: "遇到时间、天气、检索这类实时信息，模型不能靠记忆瞎答，必须知道什么时候该停下来调函数。",
    minimumExample: "“现在几点”这种问题，不应该让模型硬编答案，而应该让它请求一个 `get_current_time` 之类的工具。",
    misconception: "function calling 不等于真的执行了函数。模型只是在表达调用意图。",
    previousLayer: "上一层把输出变成稳定 JSON；这一层让 JSON 不再只是结果，还能变成“下一步动作”。",
  },
  mcp: {
    concept: "这一章讲 MCP：不是模型怎么说“我要用工具”，而是工具怎样被统一接进系统。",
    why: "当工具变多以后，你需要一个稳定的接线层，不然客户端、模型、工具实现会越来越乱。",
    minimumExample: "模型先输出 `web_search` 的 function call，客户端再把它转给 Search MCP Server 去真正执行。",
    misconception: "看到函数 JSON 不等于已经进入 MCP；那往往还只是 function calling。",
    previousLayer: "上一层解决“怎么调”；这一层解决“怎么接、怎么路由、谁来执行”。",
  },
  search: {
    concept: "这一章讲搜索为什么重要，以及搜索请求怎样从模型出发，再回到模型变成更可靠的回答。",
    why: "只靠模型记忆会过时，也会瞎猜。搜索是让 Agent 接上现实世界信息的第一步。",
    minimumExample: "同样查一个主题，百科、代码仓库、论文和图书会返回完全不同的世界。",
    misconception: "搜索不是“再问一遍互联网”，而是拿到外部证据后再组织回答。",
    previousLayer: "上一层讲工具接线；这一层把接进来的外部信息能力，变成真正会用的查询流程。",
  },
  react: {
    concept: "这一章讲 ReAct：模型不是一次想完，而是想一点、做一点、看结果，再继续下一轮。",
    why: "现实任务信息通常不够全，所以系统必须允许模型边查边改计划，而不是一步到位。",
    minimumExample: "先搜候选项目，再补项目定位，最后才压缩成给初学者的推荐答案。",
    misconception: "ReAct 不是神秘推理术，它只是把“思考、行动、观察”放进一个可循环的工作流。",
    previousLayer: "上一层讲单次工具调用；这一层开始讲多轮循环，也就是 Agent 最像“会做事”的地方。",
  },
} as const;

export const glossaryTerms = [
  {
    term: "Prompt",
    plain: "你直接写给模型看的那段话。",
    detail: "它决定模型这次要回答什么，但还没有规定身份和长期边界。",
  },
  {
    term: "System Prompt",
    plain: "写在用户问题前面的隐藏说明。",
    detail: "常用来规定角色、语气、目标、限制和安全边界。",
  },
  {
    term: "Structured Output",
    plain: "让模型按固定字段输出，而不是自由发挥段落。",
    detail: "这样程序更容易检查、渲染、存储和继续传递结果。",
  },
  {
    term: "Function Calling",
    plain: "模型先说“我要调这个工具，并且传这些参数”。",
    detail: "它表达的是调用意图，不代表函数已经真的执行了。",
  },
  {
    term: "Tool",
    plain: "给模型外接的一项真实能力。",
    detail: "比如搜索、查时间、读数据库、发请求、执行浏览器动作。",
  },
  {
    term: "MCP",
    plain: "一种把工具统一接进系统的协议和接线方式。",
    detail: "它更关心工具如何暴露、发现、路由和执行，而不是模型怎样措辞。",
  },
  {
    term: "Search",
    plain: "把模型记忆之外的信息拿回来。",
    detail: "搜索让系统能接触最新网页、仓库、论文或图书，而不是只靠训练数据。",
  },
  {
    term: "ReAct",
    plain: "让模型在思考、行动、观察之间循环。",
    detail: "它通常是很多 Agent 工作流的最小起点。",
  },
  {
    term: "Memory",
    plain: "让系统在多轮任务里保留必要上下文。",
    detail: "可以是会话历史，也可以是更长期的用户偏好和项目状态。",
  },
  {
    term: "RAG",
    plain: "先检索，再生成。",
    detail: "重点不是让模型记住更多，而是先把相关资料找出来再回答。",
  },
  {
    term: "Trace",
    plain: "一次执行过程留下的轨迹。",
    detail: "它能告诉你模型当时调用了什么、拿到了什么、为什么这样答。",
  },
  {
    term: "Eval",
    plain: "用一组规则或样本去检查系统是否做对了。",
    detail: "评测让你不只靠主观感觉，而是能比较版本、发现退化。",
  },
  {
    term: "Harness",
    plain: "围绕 Agent 的测试、回放、观察和对比工作台。",
    detail: "它不是模型本体，而是帮你持续验证 Agent 是否可靠的一层外部系统。",
  },
] as const;

export const architectureOverview = [
  {
    label: "01",
    title: "Prompt",
    body: "用户先把任务说出来，系统从这里接住真实需求。",
  },
  {
    label: "02",
    title: "System Prompt",
    body: "再用角色、目标、边界把回答方式先收住。",
  },
  {
    label: "03",
    title: "Structured Output / Tool Call",
    body: "输出不只是给人看，还会开始长成机器可读的字段和动作请求。",
  },
  {
    label: "04",
    title: "Tools / MCP",
    body: "系统把搜索、时间、文件、仓库等真实能力接进来，让模型不只会说，还能请求外部动作。",
  },
  {
    label: "05",
    title: "ReAct / Runtime",
    body: "模型开始多轮循环：想一点、查一点、读结果、再决定下一步。",
  },
  {
    label: "06",
    title: "Memory / RAG / State",
    body: "当任务更长时，系统需要保留上下文、知识和中间状态。",
  },
  {
    label: "07",
    title: "Trace / Eval / Harness",
    body: "最后你还要能回放、比较、打分和排错，不然 Agent 一复杂就会失控。",
  },
] as const;
