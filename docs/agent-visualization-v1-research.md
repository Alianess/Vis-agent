## Agent 架构可视化项目 V1 研究与信息架构

更新时间：2026-04-03

### 1. 项目目标

做一个面向初学者的中文 Web 可视化界面，让用户能一眼看懂：

- API 是什么，为什么 AI 应用要“调用接口”
- 大模型接口是什么，前端、后端、模型服务之间怎么通信
- Agent 是怎么“想、选工具、调用工具、读结果、继续行动”的
- Skill 是什么，为什么它不是普通 Prompt
- MCP 是怎么把工具、资源、提示模板接入 Agent 的
- ReAct 为什么是当前单 Agent 交互里最适合教学展示的主线
- 动态 Prompt 是怎么一层层拼出来的
- 记忆为什么要分层，为什么既会写 Markdown，又会配合 RAG / 向量库
- 为什么未来多 Agent / A2A 不应该推翻 V1，而应该建立在 V1 的同一套底层抽象上

这个项目不是做“最炫的 AI 展厅”，而是做“最容易学会 Agent 架构的交互教材”。

它还必须满足一个教学原则：
先让小白看懂“AI 应用最基础怎么工作”，再逐步进入 Agent、Tool、Skill、MCP、Memory 和 A2A。

---

### 2. 核心研究结论

#### 2.0 先讲 AI 应用基础，再讲 Agent

对小白来说，真正缺的往往不是 Agent 高级概念，而是更基础的认知：

- API 是什么
- 大模型接口是什么
- 聊天界面、后端服务、模型服务是什么关系
- “调用模型”到底在调什么

所以这个项目不能一上来就讲 ReAct、MCP、RAG，而要先讲最小闭环：

1. 用户在网页输入一句话
2. 前端把请求发给后端
3. 后端调用大模型 API
4. 大模型返回结果
5. 应用把结果展示给用户

然后再告诉用户：

- 普通 AI 聊天应用：大体就是这条链路
- Agent 应用：是在这条链路外面再加循环、工具、记忆和能力接入

#### 2.1 Agent 不等于“复杂框架”

Anthropic 在 2024 年 12 月 19 日发布的《Building effective agents》明确强调：成功的 Agent 系统通常不是靠复杂框架堆出来的，而是靠简单、可组合的模式构建出来的；并且应当先从最简单方案开始，只有在效果证明需要时才增加复杂度。

对这个项目的启发：

- 教学界面不要一上来就讲“多智能体编排平台”
- 先把单 Agent 的最小闭环讲透
- 所有高级模块都必须能回退到同一个基础闭环

这个基础闭环就是：

1. 用户输入任务
2. Agent 构建上下文
3. Agent 选择工具 / Skill / MCP 能力
4. Agent 执行动作
5. Agent 读取观察结果
6. Agent 更新计划并继续
7. Agent 写回记忆 / 产出结果

但在教学顺序上，最好先让用户看到这个对比：

普通 LLM 应用：

1. 用户提问
2. 应用调用模型
3. 模型返回答案

Agent 应用：

1. 用户提问
2. Agent 构建上下文
3. Agent 判断是否需要工具 / Skill / MCP
4. Agent 执行动作
5. Agent 读取反馈
6. Agent 继续下一轮
7. Agent 输出答案

也就是说，Agent 不是另一种神秘 AI，而是在“调用大模型”这件事外面包了一层运行时逻辑。

#### 2.1.1 API 与大模型接口必须单独讲

这个项目里必须有一个非常基础、非常清楚的模块，专门解释：

- API：程序和程序之间交流的接口
- 大模型 API：你的应用把消息发给模型服务，模型返回结果
- 模型接口常见输入：
  - system rules
  - developer / runtime rules
  - user message
  - history
  - tools
  - extra context
- 模型接口常见输出：
  - text
  - structured output
  - tool call request

建议把这件事画成最简单的三段：

`网页界面 -> 你的应用后端 -> 大模型服务`

再把 Agent 版本画成升级版：

`网页界面 -> Agent Runtime -> 大模型 + Tool + MCP + Memory`

#### 2.2 最适合教学展示的主线是 ReAct

Google Research 在 2022 年 11 月 8 日发布的 ReAct 文章，把 Agent 过程清晰拆成：

- Reason：当前怎么理解任务
- Act：当前准备做什么动作
- Observation：动作得到什么反馈

这个循环非常适合做可视化，因为它天然就是时间线，也天然能映射到 UI。

对 V1 的启发：

- 不要先教“框架名”
- 先教“循环”
- 所有页面都围绕 `思考 -> 行动 -> 观察 -> 再思考` 展开

#### 2.3 MCP 的本质不是“插件市场”，而是上下文交换协议

MCP 官方架构文档说明：

- MCP 是 Host / Client / Server 架构
- Host 是 AI 应用
- Host 会为每个 MCP Server 建一个 MCP Client
- MCP 的核心 primitive 是 `Tools`、`Resources`、`Prompts`

最重要的一点是：MCP 只规定“怎么交换上下文与能力”，不规定你的 Agent 内部怎么做规划。

对 V1 的启发：

- 要把 MCP 画成“能力接入层”，不是“Agent 大脑本身”
- 要让初学者一眼区分：
  - Agent：做决定
  - MCP：提供能力与上下文
  - Tool：被执行的动作
  - Resource：被读取的数据
  - Prompt：被复用的模板

#### 2.4 当前主流 harness 思路是“运行时 + 上下文装配 + 能力注册 + 反馈循环”

这里的 “harness” 我建议不要当成某个单一产品名，而是当成一类运行时思想来讲。

结合 Anthropic 的 Agent 文章、OpenAI 当前工具文档，以及 MCP 官方协议，可以把当前主流 Agent harness 抽象成 6 层：

1. Runtime 层
   负责会话、模型调用、沙箱、权限、任务状态
2. Prompt Assembly 层
   负责把系统规则、用户目标、记忆、Skill、工具说明拼成当前 Prompt
3. Capability Registry 层
   负责注册内置工具、函数工具、MCP 工具、延迟加载工具
4. Control Loop 层
   负责 ReAct / Plan-Act-Observe 循环
5. Memory 层
   负责短期上下文、摘要记忆、外部检索记忆
6. Trace / UI 层
   负责把 Agent 的内部过程变成可读、可追踪、可教学的可视化轨迹

这 6 层非常适合直接变成你前端里的 6 个核心可视化模块。

说明：
上面这 6 层是我基于公开资料做的架构归纳，不是某个官方单页规范的原文定义。

#### 2.5 工具层已经不只是 function calling，MCP 和 deferred loading 很关键

OpenAI 当前工具文档显示，模型能力扩展已经不仅有 function calling，还包括：

- built-in tools
- function calling
- remote MCP servers
- tool search
- skills

这对教学非常重要，因为初学者经常误以为“Agent 调工具 = function call”。实际上现在更合理的教学方式应该是：

- Tool 是执行动作的统一抽象
- Function calling 只是 Tool 的一种接法
- MCP 是更标准化的工具 / 资源 / 提示接入方式
- Skill 是可复用的任务知识包，不等于工具本身

对小白来说，这一节最好按“能力增长梯度”来展示：

1. 只有模型回答
2. 模型 + 上下文
3. 模型 + 工具
4. 模型 + 工具 + 循环
5. 模型 + 工具 + Skill + MCP + 记忆

这样用户会更容易理解为什么系统会越来越复杂。

#### 2.6 Skill 应该被讲成“可复用任务知识包”

Skill 最适合讲成：

- 一套可触发的任务知识
- 一套工作流程约束
- 一组额外参考资料 / 脚本 / 模板
- 一层“让 Agent 更像某种专家”的可复用封装

它不等于：

- 模型参数微调
- 工具本身
- 单条系统提示词

在 UI 里，Skill 应该展示成：

- 触发条件
- 注入内容
- 可带来的新能力边界
- 与 MCP / Tool 的关系

#### 2.7 记忆层应该明确区分“短期记忆、总结记忆、检索记忆”

RAG 论文说明了“参数记忆 + 非参数记忆”的价值，即把外部知识库作为可检索记忆引入生成过程。

MemGPT 进一步把这个思路推进成“分层记忆”，强调：

- 上下文窗口有限
- 需要像操作系统一样做记忆分层
- 需要在快记忆和慢记忆之间搬运信息

对你的项目很有帮助，因为你已经明确提到：

- AI 写 Markdown
- RAG / 向量库存储

我建议在教学里把记忆层拆成 3 个最容易懂的层级：

1. 短期记忆
   这是最贴近当前推理过程的一层，应该再拆成两部分：
   - 当前上下文窗口：此刻真正放进模型上下文里的消息、工具结果、状态、规则
   - 上下文压缩：当上下文太长时，系统把旧内容压缩成摘要、关键状态或结构化笔记，再继续放回短期上下文中

   也就是说，当前上下文窗口本身就是记忆的一部分，而“压缩后的上下文”仍然属于短期记忆，只是已经经过整理。

2. 总结记忆
   AI 定期写的结构化 Markdown，总结长期有价值信息
3. 检索记忆
   进入向量库或可检索知识库的长期片段

这样初学者会马上明白：

- 不是所有东西都能原样一直留在上下文窗口
- 上下文压缩本身也是记忆机制的一部分
- 不是所有东西都进向量库
- Markdown 总结、上下文压缩、向量检索分别解决不同问题

#### 2.8 未来多 Agent 扩展，A2A 应作为“Agent 间协议层”

A2A 官方规范当前已经有正式版本，A2A 官方文档也明确提出：

- MCP 适合 tools / resources
- A2A 适合 agent-to-agent collaboration

所以你这个项目从一开始就应该把两类关系分开：

- Agent <-> Tool / Resource / Prompt：走 MCP 思想
- Agent <-> Agent：走 A2A 思想

这会让你后面的 A2A、多 Agent 集群扩展非常顺。

---

### 3. V1 教学前端的信息架构建议

这里最关键的一点是：
V1 不应该直接从 Agent 架构切入，而应该做成“由浅入深的学习阶梯”。

#### 3.0 推荐的由浅入深学习路径

建议整站按这个顺序推进：

1. AI 应用最基础
   先讲 API、大模型接口、请求与响应

2. 普通 AI 聊天怎么工作
   让用户知道“不是网页里凭空生成答案”

3. 为什么普通聊天不够
   引出工具、外部信息、记忆、循环

4. 什么是 Agent
   把 Agent 讲成“增强版 LLM 应用”

5. ReAct 循环
   讲思考、行动、观察

6. Agent 如何获得能力
   讲 Tool、Skill、MCP、Memory

7. 未来怎么扩展到多 Agent
   只做轻量预告

#### 3.1 先讲两张总图

首页第一屏不要直接放 Agent 图，而应该先放一张“小白版 AI 应用总图”：

- 用户
- 网页界面
- 你的应用服务
- 大模型 API
- 返回结果

第二屏再升级成“单 Agent 执行总览图”：

- 用户任务
- 动态 Prompt 构建
- Skill 注入
- MCP 能力接入
- 工具调用
- Observation 回流
- 记忆读写
- 最终回答

目标是让初学者 10 秒内依次明白两件事：

1. 原来 AI 应用要通过 API 调模型
2. 原来 Agent 不是神秘黑盒，而是一个会循环调用能力的系统

#### 3.2 V1 的 8 个核心模块

建议首页以下按 8 个模块展开：

1. API 与大模型接口
   用最简单图说明：
   - 什么是 API
   - 什么是模型接口
   - 什么是请求和响应
   - 前端、后端、模型服务的关系

2. 从聊天到 Agent
   对比“普通对话”和“Agent 循环”

3. Agent 执行总览
   用时间线展示一次完整任务执行

4. 工具调用流程
   用 sequence diagram / step cards 展示
   `思考 -> 选工具 -> 参数 -> 执行 -> 结果 -> 回写上下文`

5. Skill 是什么
   展示 Skill 的触发、注入、限制、参考资料
   强调 Skill 不是 Tool

6. MCP 怎么起作用
   展示 Host / Client / Server 关系
   展示 `tools/list -> tools/call`
   顺带讲 resources / prompts

7. 动态 Prompt 构建器
   把 Prompt 拆成可见切片：
   - system
   - developer / runtime rules
   - user goal
   - memory
   - skill injection
   - tool schemas
   - recent observations

8. 记忆系统
   可视化“当前上下文 / Markdown 摘要 / 向量检索库”

#### 3.2.1 开篇内容建议从 Prompt 讲起

如果这个项目的目标用户是“小白”，那开篇不要先讲 Agent，而应该先讲这四个最基础、最容易建立直觉的概念：

1. Prompt
   告诉模型“你要做什么”

2. 大模型
   真正负责生成理解与输出的核心引擎

3. 角色扮演 / System Prompt
   告诉模型“你应该以什么身份、什么规则、什么边界来回答”

4. 结构化输出
   告诉模型“不要只返回自然语言，还要按指定格式输出”

这是非常适合做成首页开篇的，因为这四个概念是后面 Agent 一切复杂机制的前置基础。

推荐的开篇顺序：

1. 一句话 Prompt，模型输出一句话回答
2. 给模型加“角色”
3. 给模型加“输出格式”
4. 再告诉用户：Agent 是在这之上继续增加工具、记忆、循环和能力接入

这样学习曲线会非常顺。

#### 3.3 单 Agent V1 就要预留多 Agent 的壳

虽然 V1 只做单 Agent，但底层数据结构不要只为单 Agent 写死。

建议所有关键对象都带：

- `run_id`
- `agent_id`
- `step_id`
- `parent_step_id`
- `source_type`

这样未来可以平滑扩展到：

- 主 Agent / 子 Agent
- Orchestrator / Worker
- Agent 间消息
- A2A 任务状态

---

### 4. 推荐的底层可视化抽象

#### 4.1 统一事件模型

整个 UI 最好基于一套统一事件流，而不是每个页面自己拼数据。

建议定义这些事件：

- `user_task_received`
- `prompt_compiled`
- `skill_loaded`
- `mcp_server_connected`
- `tool_discovered`
- `tool_called`
- `tool_result_received`
- `memory_read`
- `memory_written`
- `context_compacted`
- `agent_response_generated`
- `handoff_requested`

未来多 Agent 再补：

- `agent_spawned`
- `agent_message_sent`
- `agent_message_received`
- `a2a_task_created`
- `a2a_task_completed`

#### 4.2 统一节点模型

建议前端里统一为几类节点：

- Agent
- Prompt Slice
- Skill
- MCP Server
- Tool
- Observation
- Memory Store
- Output

这样你做总览图、拓扑图、时间线、依赖图时都能复用。

#### 4.3 统一视角切换

每个概念都尽量提供三种视角：

1. 业务视角
   “它是干嘛的”
2. 系统视角
   “它在架构里的位置”
3. 运行视角
   “它在一次执行里怎么出现”

这对初学者特别重要，因为他们最怕只看到抽象名词。

---

### 5. 推荐的页面结构

#### 页面 0：AI 应用入门

作用：
先帮小白建立最基础认知。

应该包含：

- API 是什么
- 大模型接口是什么
- 前端 / 后端 / 模型服务关系图
- 一次最基本的请求-响应动画

一句话目标：
先让用户知道，AI 应用不是网页里凭空蹦出来答案。

建议这个页面再拆成 2 个连续视图：

- 视图 1：Prompt / 大模型 / 角色设定 / 结构化输出
- 视图 2：前端 / 后端 / 模型 API 的请求响应关系

这样用户会先理解“怎么跟模型说话”，再理解“应用怎么把这件事跑起来”。

#### 页面 0-1：项目首页 / 介绍页

作用：
让第一次进入的人先被吸引，再知道怎么学、怎么用。

应该包含：

- 一个非常清晰的中文标题
- 一句项目价值主张
- 一张主视觉大图或动态示意图
- “你将学会什么”
- “推荐学习路径”
- “这个项目怎么使用”
- 两个入口按钮：
  - 从零开始学习
  - 直接看 Agent 全景图

首页不要像文档目录页，更像一个“可视化课程入口页”。

#### 页面 A：Agent 总览

作用：
给初学者一个全局地图。

应该包含：

- 一张大图
- 一条简单时间线
- 每个模块一句中文解释

#### 页面 B：ReAct 执行回放

作用：
让用户看到 Agent 怎么一步步动起来。

应该包含：

- 思考卡片
- 动作卡片
- 观察卡片
- 终止条件

最重要：
每一步都只展示一小段中文解释，不要让初学者一上来读长日志。

#### 页面 C：Tool / MCP 实验台

作用：
让用户理解“工具调用”和“MCP 接入”不是一回事，但它们能衔接。

应该包含：

- MCP Host / Client / Server 图
- Tool list 展示
- Tool call 示例
- Resource / Prompt 示例

#### 页面 D：Skill 注入器

作用：
让用户直观看到 Skill 注入前后，Prompt 和能力边界发生了什么变化。

应该包含：

- 无 Skill 模式
- 注入 Skill 后模式
- 新增规则 / 新增资源 / 新增脚本说明

#### 页面 E：动态 Prompt 构建器

作用：
讲清楚 Agent 不是“吃一整段固定 prompt”。

应该包含：

- Prompt 分层
- 每层来源
- 每层作用
- 哪些层是静态，哪些是动态

#### 页面 F：记忆系统

作用：
讲清楚“为什么记忆不是一个东西”。

应该包含：

- 当前上下文窗口
- 上下文压缩 / 摘要
- Markdown 摘要记忆
- 向量检索记忆
- 记忆读写时机

#### 页面 G：V2 预留页

作用：
只做轻量预告，不抢 V1 主线。

应该包含：

- Orchestrator / Worker
- A2A
- 多 Agent 集群
- 为什么需要任务级协议

---

### 6. 对“简单易懂”的具体设计原则

这个项目的成败，不在技术深度本身，而在于“是否让初学者真的看懂”。

建议坚持这些原则：

- 全中文文案，避免中英混杂
- 一个页面只讲一个主问题
- 默认先给图，再给解释
- 默认先给例子，再给术语
- 默认先给 API 与模型接口，再给 Agent
- 默认先给单 Agent，再给多 Agent
- 默认先给流程，再给协议
- 默认先给“为什么”，再给“怎么做”

还要补一条最关键的：

- 默认每一屏只新增一个复杂度，不要连续引入多个新概念

例如更适合小白的顺序是：

1. 先讲 API
2. 再讲模型接口
3. 再讲普通聊天应用
4. 再讲 Agent
5. 再讲 Tool
6. 再讲 Skill / MCP / Memory

而不是一页同时塞进：
`API + Prompt + Tool + MCP + Skill + RAG + 多 Agent`

视觉上建议：

- 不要做赛博炫技风
- 不要把所有概念放进一张复杂图
- 用低门槛的卡片、时间线、流程箭头、拓扑图
- 所有高频术语都要有中文悬浮解释

---

### 7. 推荐的前端实现方向

为了保证轻量化、模块化、后续好扩展，建议前端采用：

- React + TypeScript
- Vite
- Zustand 或同类轻状态管理
- React Flow 或 SVG 自绘拓扑图
- Motion 做少量关键动画
- Markdown 驱动讲解内容

为什么这样配：

- React 生态足够成熟，后面扩多页和交互方便
- Vite 启动快，适合持续迭代
- 轻状态管理适合事件流和教学 demo
- React Flow 很适合节点图、关系图、执行流展示

但有一条比技术栈更重要：

界面必须“教材化”，不能只是“工具化”。

#### 7.1 想做到“别人拿到就能直接运行”，最稳的是静态优先

如果你的目标是：

- 别人拿到链接就能直接打开
- 不要求本地装环境
- 不要求用户配置 API Key

那最稳的方案不是先做一个强依赖后端的应用，而是先做一个“静态优先”的教学站。

推荐方案：

1. V1 做成纯前端静态站
   使用 React + Vite 打包成静态文件

2. 教学内容全部本地化
   包括：
   - 讲解文案
   - 示例 Prompt
   - 示例 Tool Call
   - 示例 MCP 流程
   - 示例 Memory 流程
   - 示例 ReAct 时间线

3. 所有演示先用“预置样例数据”驱动
   也就是前端读取本地 JSON / Markdown / 配置文件来展示流程，而不是真的在线调用模型

4. 部署到静态托管平台
   例如 GitHub Pages 或 Cloudflare Pages

这样别人只需要一个网址就能使用，不需要本地环境。

#### 7.2 最好分成“教学模式”和“实战模式”

这是我最推荐的产品分层：

1. 教学模式
   默认模式
   不调用真实模型
   全部用预置案例 + 可视化讲解
   优点：
   - 不需要环境
   - 不需要密钥
   - 不需要后端
   - 打开就能学

2. 实战模式
   可选进阶模式
   接入真实模型 API 或本地模型
   优点：
   - 可以现场演示真实 Prompt / Structured Output / Tool Call
   - 可以让进阶用户自己实验

这样可以同时满足：

- 小白无门槛打开就学
- 进阶用户真的能动手试

#### 7.3 如果要“发给别人就能跑”，有三种实现层级

##### 方案 A：公开网址

这是最推荐的方案。

做法：

- 打包成静态站
- 部署到 GitHub Pages / Cloudflare Pages
- 发一个 URL 给别人

优点：

- 真正零环境
- 最容易传播
- 最适合教学项目

##### 方案 B：离线静态包

做法：

- 构建出 `dist/`
- 把静态文件打包给别人
- 对方双击本地 HTML 或用任意静态文件服务打开

优点：

- 仍然不依赖后端
- 可离线分发

缺点：

- 浏览器本地打开有时会碰到资源路径或路由限制
- 体验通常不如直接给网址

##### 方案 C：桌面应用壳

做法：

- 用 Tauri / Electron 把静态站包成桌面应用

优点：

- 用户体验像本地 App
- 更适合内部培训分发

缺点：

- 构建复杂度更高
- V1 没必要先上

结论：
V1 最推荐的是“静态站 + 在线部署”，而不是一开始就做桌面壳或重后端系统。

#### 7.4 哪些功能会破坏“零环境直接运行”

下面这些功能一旦做成真实在线调用，就通常需要后端或密钥：

- 实时调用大模型 API
- 真实 MCP Server 连接
- 在线向量库存储与检索
- 用户级记忆持久化

所以 V1 最合理的做法是：

- 先把这些能力做成“可视化模拟 + 案例驱动”
- 需要真实运行时，再加一个可选的“实战模式”

#### 7.5 当前确认的 V1 技术路线

截至 2026-04-03，当前项目已经从“纯静态教学站优先”调整为“真实 API + 尽量简单环境”的路线。

最终采用：

- 前端：`React + Vite + TypeScript`
- 后端：`FastAPI`
- 大模型接口：OpenAI `Responses API`
- 向量模型：`text-embedding-3-small`
- 向量库：`Chroma`
- 内容源：本地 `Markdown`
- Python 环境：`venv + pip`

当前不采用：

- `FAISS`
- `conda`
- 多 Agent
- 重型 Agent 框架
- 复杂数据库

原因很简单：

- 要尽量真实
- 要尽量简单
- 要尽量容易本地配置
- 要让“懂一点代码的小白”也能比较轻松地跑起来

推荐的最小后端职责：

- 调用 OpenAI Responses API
- 处理 Prompt / System Prompt / 结构化输出演示
- 读取本地 Markdown
- 文档切块
- 调用 embedding
- 写入 / 查询 Chroma
- 返回给前端做可视化展示

推荐的最小前端职责：

- 首页介绍页
- 教学页面与可视化页面
- 展示 Prompt、系统提示词、结构化输出、检索结果、工具调用过程

推荐的最小本地启动方式：

后端：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev app/main.py
```

前端：

```bash
npm install
npm run dev
```

---

### 8. 我建议的 V1 底层框架

建议你把项目底层分成四层：

#### 8.1 Content Layer

存放中文讲解内容、案例、术语解释、图注。

#### 8.2 Agent Runtime Model Layer

不一定是真跑模型，但前端要有一套可视化运行模型：

- ApiRequest
- ModelResponse
- AgentRun
- Step
- ToolCall
- MCPServer
- SkillLoad
- ContextCompaction
- MemoryEvent

#### 8.3 Visualization Layer

负责：

- 总览图
- 时间线
- 调用链
- Prompt 组装视图
- 记忆流视图

#### 8.4 Future Multi-Agent Layer

当前先空着接口，但抽象先留好：

- AgentNode
- AgentMessage
- TaskGraph
- Handoff
- A2A Session

---

### 9. 推荐的叙事主线

如果按学习路径来设计，最顺的叙事顺序是：

1. API 是什么
2. 大模型接口是什么
3. 普通 AI 聊天应用怎么工作
4. 什么是 Agent
5. 单 Agent 是怎么工作的
6. ReAct 循环
7. 工具调用
8. MCP 接入
9. Skill 注入
10. 动态 Prompt 构建
11. 记忆系统
12. 为什么要多 Agent
13. A2A 和多 Agent 扩展

这个顺序的好处是：
用户每学一步，都会觉得是自然延伸，而不是突然跳到新世界。

---

### 10. 下一步建议

如果继续往下做，我建议下一步直接进入：

1. 先把这个项目的信息架构做成页面树
2. 再定 V1 的视觉语言
3. 再开始搭前端骨架
4. 第一版先做 4 个最重要页面：
   - AI 应用入门
   - Agent 总览
   - ReAct 回放
   - MCP / Skill / Memory 关系图

这样最容易最快看到成果。

补充一个很实际的落地建议：

当前 V1 已经决定走“真实 API + 尽量简单环境”的路线，因此接下来不再以纯静态教学站为主，而是直接做一个最小可运行的真实项目。

更合适的顺序是：

1. 先搭最小前后端骨架
2. 先打通 Prompt / System Prompt / 结构化输出
3. 再打通 Markdown -> Embedding -> Chroma 检索
4. 最后把这些能力做成可视化教学页面

---

### 11. 参考资料

截至 2026-04-03，我本轮优先参考了以下官方资料与原始论文：

- Anthropic，《Building effective agents》，2024-12-19
  [https://www.anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents)
- MCP 官方文档，《Architecture overview》
  [https://modelcontextprotocol.io/docs/learn/architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- MCP 官方规范，《Specification》
  [https://modelcontextprotocol.io/specification/2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)
- OpenAI Developers 文档入口（含 Tools、MCP and Connectors、Skills、Agents 等章节）
  [https://developers.openai.com/](https://developers.openai.com/)
- Google Research，《ReAct: Synergizing Reasoning and Acting in Language Models》，2022-11-08
  [https://research.google/blog/react-synergizing-reasoning-and-acting-in-language-models/](https://research.google/blog/react-synergizing-reasoning-and-acting-in-language-models/)
- Lewis et al.，《Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks》，arXiv:2005.11401
  [https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)
- Packer et al.，《MemGPT: Towards LLMs as Operating Systems》，arXiv:2310.08560
  [https://arxiv.org/abs/2310.08560](https://arxiv.org/abs/2310.08560)
- A2A 官方规范，《Agent2Agent Protocol Specification》
  [https://a2a-protocol.org/dev/specification/](https://a2a-protocol.org/dev/specification/)
- A2A 官方文档，《A2A and MCP》
  [https://a2a-protocol.org/v0.2.5/topics/a2a-and-mcp/](https://a2a-protocol.org/v0.2.5/topics/a2a-and-mcp/)
