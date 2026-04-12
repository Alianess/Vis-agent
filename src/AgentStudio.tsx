import { useEffect, useState } from "react";

type StudioConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  remoteMcpUrl: string;
  remoteMcpToken: string;
  enableBrowserTools: boolean;
};

type ChatToolCall = {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
};

type ChatCompletionMessage = {
  role: "assistant";
  content?: unknown;
  tool_calls?: ChatToolCall[];
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: ChatCompletionMessage;
  }>;
  error?: {
    message?: string;
  };
};

type StudioMessage =
  | {
      role: "system" | "user" | "assistant";
      content: string;
      tool_calls?: ChatToolCall[];
    }
  | {
      role: "tool";
      content: string;
      tool_call_id: string;
    };

type TraceStep = {
  kind: "request" | "tool" | "result" | "answer" | "error";
  title: string;
  body: string;
  code?: string;
};

const STORAGE_KEY = "vis-agent-studio-config";

const defaultConfig: StudioConfig = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4.1-mini",
  systemPrompt:
    "你是一位面向初学者的 Agent 教练。优先使用可用工具补资料，再用中文写清楚你的结论。回答要短句、具体、像带练老师，不要堆术语。",
  remoteMcpUrl: "",
  remoteMcpToken: "",
  enableBrowserTools: true,
};

const promptExamples = [
  "请先查一下 Model Context Protocol，再给我一个零基础用户的实战入门建议。",
  "请先查一本适合理解 Agent 的英文书，再帮我写一个 7 天练习计划。",
  "请结合当前本地时间，给我安排今晚 2 小时的 Agent 学习路线。",
] as const;

const capabilityCards = [
  {
    label: "教学 + 实战",
    title: "这不是另一个聊天框",
    body: "你在这里能真正看到模型请求、工具调用、工具返回和最终答案，而不是只看最后一句自然语言。",
  },
  {
    label: "纯前端",
    title: "密钥和配置只存浏览器本地",
    body: "这个实验台不会替你保管密钥。配置保存在当前浏览器的 localStorage，适合练手，不适合团队协作或正式生产。",
  },
  {
    label: "MCP 边界",
    title: "先把能直连的做起来",
    body: "当前版本先支持 OpenAI 兼容模型和浏览器工具。Remote MCP 先给你留配置位，并明确告诉用户哪些前提不满足就不要硬连。",
  },
] as const;

const browserReadiness = [
  {
    title: "可以直接试",
    body: "模型 API、公开知识 API、本地时间、表单状态和简单函数调用闭环。",
  },
  {
    title: "看服务条件",
    body: "Remote MCP 必须是浏览器可访问的 HTTP 形态，并允许 CORS，鉴权也不能要求服务端代签。",
  },
  {
    title: "不要硬做",
    body: "Stdio、本地文件权限、隐藏密钥、内网代理和高风险工具执行，不适合纯静态站。",
  },
] as const;

const browserTools = [
  {
    type: "function",
    function: {
      name: "search_wikipedia",
      description: "搜索 Wikipedia 词条并返回摘要，适合查概念、人物和背景知识。",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "要查询的概念或关键词" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_openlibrary",
      description: "查询 Open Library 图书信息，适合找入门书、作者和出版年份。",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "书名、作者名或主题词" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_local_time",
      description: "读取浏览器当前时间，用于安排计划或生成带时间上下文的回答。",
      parameters: {
        type: "object",
        properties: {
          timezone: { type: "string", description: "可选时区，如 Asia/Shanghai" },
        },
      },
    },
  },
] as const;

function readInitialConfig(): StudioConfig {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultConfig;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StudioConfig>;
    return {
      ...defaultConfig,
      ...parsed,
    };
  } catch {
    return defaultConfig;
  }
}

function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function normalizeMessageContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part) {
          const text = (part as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }

        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function parseToolArguments(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function searchWikipedia(query: string) {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    origin: "*",
    utf8: "1",
    srlimit: "1",
  });

  const searchResponse = await fetch(`https://zh.wikipedia.org/w/api.php?${params.toString()}`);
  if (!searchResponse.ok) {
    throw new Error(`Wikipedia 搜索失败：HTTP ${searchResponse.status}`);
  }

  const searchData = (await searchResponse.json()) as {
    query?: { search?: Array<{ title?: string }> };
  };
  const title = searchData.query?.search?.[0]?.title;

  if (!title) {
    return {
      query,
      title: "未命中词条",
      summary: "没有找到明显结果，可以换个词再试。",
      url: "",
    };
  }

  const pageParams = new URLSearchParams({
    action: "query",
    prop: "extracts|info",
    exintro: "1",
    explaintext: "1",
    inprop: "url",
    titles: title,
    format: "json",
    origin: "*",
  });

  const pageResponse = await fetch(`https://zh.wikipedia.org/w/api.php?${pageParams.toString()}`);
  if (!pageResponse.ok) {
    throw new Error(`Wikipedia 详情失败：HTTP ${pageResponse.status}`);
  }

  const pageData = (await pageResponse.json()) as {
    query?: {
      pages?: Record<string, { title?: string; extract?: string; fullurl?: string }>;
    };
  };
  const page = Object.values(pageData.query?.pages ?? {})[0];

  return {
    query,
    title: page?.title || title,
    summary: page?.extract || "词条存在，但没有拿到摘要。",
    url: page?.fullurl || "",
  };
}

async function lookupOpenLibrary(query: string) {
  const params = new URLSearchParams({
    q: query,
    limit: "3",
    fields: "title,author_name,first_publish_year,key",
  });

  const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open Library 查询失败：HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    docs?: Array<{
      title?: string;
      author_name?: string[];
      first_publish_year?: number;
      key?: string;
    }>;
  };

  return {
    query,
    books:
      data.docs?.map((item) => ({
        title: item.title || "未命名图书",
        author: item.author_name?.join(" / ") || "未知作者",
        year: item.first_publish_year || null,
        url: item.key ? `https://openlibrary.org${item.key}` : "",
      })) ?? [],
  };
}

function getLocalTime(timezone?: string) {
  try {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: timezone || undefined,
    });

    return {
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      now: formatter.format(new Date()),
    };
  } catch {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      now: formatter.format(new Date()),
    };
  }
}

async function executeBrowserTool(name: string, args: Record<string, unknown>) {
  if (name === "search_wikipedia") {
    return searchWikipedia(String(args.query || ""));
  }

  if (name === "lookup_openlibrary") {
    return lookupOpenLibrary(String(args.query || ""));
  }

  if (name === "get_local_time") {
    const timezone = typeof args.timezone === "string" ? args.timezone : undefined;
    return getLocalTime(timezone);
  }

  throw new Error(`浏览器实验台暂不支持工具 ${name}`);
}

async function requestChatCompletion(config: StudioConfig, messages: StudioMessage[]) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.apiKey.trim()) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(`${normalizeBaseUrl(config.baseUrl)}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      tools: config.enableBrowserTools ? browserTools : undefined,
      tool_choice: config.enableBrowserTools ? "auto" : undefined,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as ChatCompletionResponse;

  if (!response.ok) {
    const errorMessage = data.error?.message || `请求失败：HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

function AgentStudio() {
  const [config, setConfig] = useState<StudioConfig>(readInitialConfig);
  const [prompt, setPrompt] = useState<string>(promptExamples[0]);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [trace, setTrace] = useState<TraceStep[]>([]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (patch: Partial<StudioConfig>) => {
    setConfig((current) => ({
      ...current,
      ...patch,
    }));
  };

  const runPractice = async () => {
    if (!config.baseUrl.trim() || !config.model.trim()) {
      setStatus("error");
      setError("先把 Base URL 和 Model 填完整，再发起实验。");
      setTrace([]);
      setAnswer("");
      return;
    }

    if (!prompt.trim()) {
      setStatus("error");
      setError("先输入一个任务目标，再让 Agent 开始工作。");
      setTrace([]);
      setAnswer("");
      return;
    }

    setStatus("running");
    setError("");
    setAnswer("");
    setTrace([
      {
        kind: "request",
        title: "准备发起模型请求",
        body: "浏览器会直接调用你填写的 OpenAI 兼容接口；密钥只保存在当前浏览器本地。",
        code: JSON.stringify(
          {
            baseUrl: normalizeBaseUrl(config.baseUrl),
            model: config.model,
            browserTools: config.enableBrowserTools,
          },
          null,
          2,
        ),
      },
    ]);

    try {
      const messages: StudioMessage[] = [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: prompt.trim() },
      ];

      for (let round = 0; round < 3; round += 1) {
        const data = await requestChatCompletion(config, messages);
        const message = data.choices?.[0]?.message;

        if (!message) {
          throw new Error("模型没有返回可读取的 message。");
        }

        const toolCalls = message.tool_calls ?? [];
        const normalizedContent = normalizeMessageContent(message.content);

        if (toolCalls.length > 0 && config.enableBrowserTools) {
          setTrace((current) => [
            ...current,
            {
              kind: "tool",
              title: `第 ${round + 1} 轮：模型决定调用工具`,
              body: "这一步不是最终回答，而是模型先把“要查什么、传什么参数”表达成工具调用。",
              code: JSON.stringify(toolCalls, null, 2),
            },
          ]);

          messages.push({
            role: "assistant",
            content: normalizedContent,
            tool_calls: toolCalls,
          });

          for (const toolCall of toolCalls) {
            const args = parseToolArguments(toolCall.function.arguments);
            const result = await executeBrowserTool(toolCall.function.name, args);

            setTrace((current) => [
              ...current,
              {
                kind: "result",
                title: `工具返回：${toolCall.function.name}`,
                body: "浏览器执行了实际工具，再把结果回填给模型组织最终回答。",
                code: JSON.stringify(result, null, 2),
              },
            ]);

            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            });
          }

          continue;
        }

        const finalAnswer = normalizedContent || "模型没有返回自然语言内容，你可以先关掉浏览器工具再试一次。";

        setAnswer(finalAnswer);
        setTrace((current) => [
          ...current,
          {
            kind: "answer",
            title: "最终回答",
            body: "工具调用已经结束，模型现在把拿到的上下文整理成给用户看的自然语言答案。",
            code: finalAnswer,
          },
        ]);
        setStatus("done");
        return;
      }

      throw new Error("已经超过 3 轮工具循环。这个实验台故意把流程限制得很小，方便教学和排错。");
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : "实验失败";
      setStatus("error");
      setError(message);
      setTrace((current) => [
        ...current,
        {
          kind: "error",
          title: "本轮实验失败",
          body: "常见原因是 CORS、接口不兼容、Key 无效，或者当前模型不支持 tools。",
          code: message,
        },
      ]);
    }
  };

  return (
    <div className="studio-page">
      <header className="learn-topbar studio-topbar">
        <div className="learn-brand">
          <span className="brand-mark" />
          <div>
            <p className="brand-title">实战区</p>
            <p className="brand-subtitle">纯前端最小 Agent 实验台</p>
          </div>
        </div>

        <div className="studio-topbar-actions">
          <a className="back-link" href="#/learn">
            继续学习
          </a>
          <a className="back-link" href="#/">
            返回首页
          </a>
        </div>
      </header>

      <main className="studio-shell">
        <section className="studio-hero-card">
          <div className="section-heading">
            <p className="eyebrow">Teaching + Practice</p>
            <h1>让用户不只看懂，还能亲手跑一个最小 Agent。</h1>
            <p className="hero-text studio-hero-text">
              这个页面故意只做一件事：在浏览器里直接调模型，再让模型调用浏览器工具，最后把结果回填回来。
              这样用户第一次就能知道，Agent 不是“更聪明的聊天”，而是一条真实的执行链。
            </p>
          </div>

          <div className="studio-capability-grid">
            {capabilityCards.map((card) => (
              <article className="topic-card studio-mini-card" key={card.title}>
                <span className="panel-label">{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="studio-grid">
          <div className="studio-stack">
            <article className="studio-card">
              <div className="section-heading">
                <p className="eyebrow">Step 1</p>
                <h2>填写模型配置</h2>
              </div>

              <div className="studio-form">
                <label className="search-field">
                  <span>Base URL</span>
                  <input
                    onChange={(event) => updateConfig({ baseUrl: event.target.value })}
                    placeholder="https://api.openai.com/v1"
                    type="text"
                    value={config.baseUrl}
                  />
                </label>

                <label className="search-field">
                  <span>API Key</span>
                  <input
                    onChange={(event) => updateConfig({ apiKey: event.target.value })}
                    placeholder="sk-...（如果你的服务需要）"
                    type="password"
                    value={config.apiKey}
                  />
                </label>

                <label className="search-field">
                  <span>Model</span>
                  <input
                    onChange={(event) => updateConfig({ model: event.target.value })}
                    placeholder="gpt-4.1-mini / qwen-max / 其他 OpenAI 兼容模型"
                    type="text"
                    value={config.model}
                  />
                </label>

                <label className="search-field">
                  <span>System Prompt</span>
                  <textarea
                    className="studio-textarea"
                    onChange={(event) => updateConfig({ systemPrompt: event.target.value })}
                    value={config.systemPrompt}
                  />
                </label>
              </div>

              <div className="studio-local-note">
                <span className="signal-dot" />
                <p>配置只保存在当前浏览器本地，不会上传到你自己的仓库文件里。</p>
              </div>
            </article>

            <article className="studio-card">
              <div className="section-heading">
                <p className="eyebrow">Step 2</p>
                <h2>设置任务与浏览器工具</h2>
              </div>

              <label className="search-field">
                <span>用户任务</span>
                <textarea
                  className="studio-textarea studio-textarea-lg"
                  onChange={(event) => setPrompt(event.target.value)}
                  value={prompt}
                />
              </label>

              <div className="search-chip-row">
                {promptExamples.map((example) => (
                  <button
                    className="search-chip"
                    key={example}
                    onClick={() => setPrompt(example)}
                    type="button"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <button
                aria-pressed={config.enableBrowserTools}
                className={`think-switch ${config.enableBrowserTools ? "is-on" : ""}`}
                onClick={() => updateConfig({ enableBrowserTools: !config.enableBrowserTools })}
                type="button"
              >
                <span className="think-switch-copy">
                  <strong>浏览器工具</strong>
                  <small>
                    打开后会把 `Wikipedia`、`Open Library` 和本地时间暴露给模型，形成一个最小 Agent 闭环。
                  </small>
                </span>
                <span className="think-switch-track" aria-hidden="true">
                  <span className="think-switch-thumb" />
                </span>
              </button>

              <div className="studio-code-block">
                <span className="panel-label">当前可用工具</span>
                <pre className="compare-pre">{JSON.stringify(browserTools, null, 2)}</pre>
              </div>
            </article>

            <article className="studio-card">
              <div className="section-heading">
                <p className="eyebrow">MCP 预留位</p>
                <h2>先告诉用户边界，再逐步往前接。</h2>
              </div>

              <div className="studio-form">
                <label className="search-field">
                  <span>Remote MCP URL</span>
                  <input
                    onChange={(event) => updateConfig({ remoteMcpUrl: event.target.value })}
                    placeholder="https://your-mcp.example.com"
                    type="text"
                    value={config.remoteMcpUrl}
                  />
                </label>

                <label className="search-field">
                  <span>Remote MCP Token</span>
                  <input
                    onChange={(event) => updateConfig({ remoteMcpToken: event.target.value })}
                    placeholder="可选：只保存在本地浏览器"
                    type="password"
                    value={config.remoteMcpToken}
                  />
                </label>
              </div>

              <div className="studio-note-grid">
                {browserReadiness.map((item) => (
                  <article className="compare-card compare-card-muted" key={item.title}>
                    <h3 className="compare-title">{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>

              <p className="studio-footnote">
                当前版本先不直接对 Remote MCP 发起协议握手。原因不是“不能做”，而是要先确认服务是否支持浏览器访问、
                CORS、HTTP 形态和前端安全的鉴权方式。你截图里那类专属 URL 也应当按敏感信息看待，不适合公开写死到静态站里。
              </p>
            </article>
          </div>

          <div className="studio-stack">
            <article className="stream-card studio-stream-card" aria-live="polite">
              <div className="stream-head">
                <div>
                  <span className="panel-label">Step 3</span>
                  <p className="stream-status">
                    {status === "running"
                      ? "正在执行最小 Agent 循环"
                      : status === "done"
                        ? "本轮实验完成"
                        : status === "error"
                          ? "实验遇到错误"
                          : "准备开始实验"}
                  </p>
                </div>
                <button className="button button-primary studio-run-button" onClick={runPractice} type="button">
                  开始运行
                </button>
              </div>

              <div className="stream-console studio-console">
                <div className="stream-line">
                  <span className="stream-key">Mode</span>
                  <span className="stream-value">OpenAI-compatible chat completions + browser tools</span>
                </div>
                <div className="stream-line">
                  <span className="stream-key">Goal</span>
                  <span className="stream-value">{prompt}</span>
                </div>
                <div className="stream-line stream-line-live">
                  <span className="stream-key">Result</span>
                  <p className="stream-output">
                    {answer || "点击“开始运行”之后，这里会显示最终自然语言结果。"}
                  </p>
                </div>
              </div>

              {error ? (
                <div className="studio-error">
                  <strong>错误提示</strong>
                  <p>{error}</p>
                </div>
              ) : null}
            </article>

            <article className="studio-card">
              <div className="section-heading">
                <p className="eyebrow">Step 4</p>
                <h2>查看执行轨迹</h2>
                <p>真正的实战感，来自你能看到“模型为什么会这样回答”，而不是只能看到最后一句话。</p>
              </div>

              <div className="studio-trace">
                {trace.length > 0 ? (
                  trace.map((step, index) => (
                    <article className={`studio-trace-item is-${step.kind}`} key={`${step.title}-${index}`}>
                      <span className="panel-label">
                        {String(index + 1).padStart(2, "0")} · {step.title}
                      </span>
                      <p>{step.body}</p>
                      {step.code ? <pre className="compare-pre">{step.code}</pre> : null}
                    </article>
                  ))
                ) : (
                  <div className="search-empty">
                    <p>运行后这里会按顺序展示：模型请求、工具调用、工具返回和最终回答。</p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AgentStudio;
