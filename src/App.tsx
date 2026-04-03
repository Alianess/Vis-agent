import { useEffect, useState } from "react";
import {
  apiCards,
  examplePanels,
  functionCallDemos,
  introTopics,
  ioDemo,
  learningModules,
  stagePills,
  structuredOutputDemo,
  systemPromptDemos,
} from "./content";

type Route = "home" | "learn";

function getRouteFromHash(hash: string): Route {
  return hash === "#/learn" ? "learn" : "home";
}

function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "未配置";
  const [route, setRoute] = useState<Route>(getRouteFromHash(window.location.hash));
  const [activeModule, setActiveModule] = useState("io");
  const [thinkEnabled, setThinkEnabled] = useState(true);
  const [runSeed, setRunSeed] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const [streamedThink, setStreamedThink] = useState("");
  const [streamedOutput, setStreamedOutput] = useState("");
  const [streamPhase, setStreamPhase] = useState<
    "typing" | "reading" | "thinking" | "answering" | "done"
  >("typing");
  const [isThinkCollapsed, setIsThinkCollapsed] = useState(false);
  const [activeSystemPreset, setActiveSystemPreset] = useState(systemPromptDemos[0].id);
  const [systemThinkEnabled, setSystemThinkEnabled] = useState(true);
  const [systemRunSeed, setSystemRunSeed] = useState(0);
  const [typedSystemPrompt, setTypedSystemPrompt] = useState("");
  const [typedSystemInput, setTypedSystemInput] = useState("");
  const [streamedSystemThink, setStreamedSystemThink] = useState("");
  const [streamedSystemOutput, setStreamedSystemOutput] = useState("");
  const [systemPhase, setSystemPhase] = useState<
    "prompting" | "typing" | "reading" | "thinking" | "answering" | "done"
  >("prompting");
  const [isSystemThinkCollapsed, setIsSystemThinkCollapsed] = useState(false);
  const [structuredThinkEnabled, setStructuredThinkEnabled] = useState(true);
  const [structuredRunSeed, setStructuredRunSeed] = useState(0);
  const [typedStructuredInput, setTypedStructuredInput] = useState("");
  const [streamedNaturalThink, setStreamedNaturalThink] = useState("");
  const [streamedNaturalOutput, setStreamedNaturalOutput] = useState("");
  const [streamedStructuredThink, setStreamedStructuredThink] = useState("");
  const [streamedStructuredOutput, setStreamedStructuredOutput] = useState("");
  const [structuredPhase, setStructuredPhase] = useState<
    "typing" | "reading" | "natural-thinking" | "natural-output" | "json-thinking" | "json-output" | "done"
  >("typing");
  const [isNaturalThinkCollapsed, setIsNaturalThinkCollapsed] = useState(false);
  const [isJsonThinkCollapsed, setIsJsonThinkCollapsed] = useState(false);
  const [activeFunctionPreset, setActiveFunctionPreset] = useState(functionCallDemos[0].id);
  const [functionThinkEnabled, setFunctionThinkEnabled] = useState(true);
  const [functionRunSeed, setFunctionRunSeed] = useState(0);
  const [typedFunctionInput, setTypedFunctionInput] = useState("");
  const [streamedFunctionThink, setStreamedFunctionThink] = useState("");
  const [streamedFunctionArgs, setStreamedFunctionArgs] = useState("");
  const [streamedFunctionResult, setStreamedFunctionResult] = useState("");
  const [streamedFunctionOutput, setStreamedFunctionOutput] = useState("");
  const [functionPhase, setFunctionPhase] = useState<
    "typing" | "thinking" | "calling" | "result" | "answering" | "done"
  >("typing");
  const [isFunctionThinkCollapsed, setIsFunctionThinkCollapsed] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const currentSystemPreset =
    systemPromptDemos.find((preset) => preset.id === activeSystemPreset) ?? systemPromptDemos[0];
  const currentFunctionPreset =
    functionCallDemos.find((preset) => preset.id === activeFunctionPreset) ?? functionCallDemos[0];

  useEffect(() => {
    if (route !== "learn" || activeModule !== "io") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedInput("");
      setStreamedThink("");
      setStreamedOutput("");
      setIsThinkCollapsed(false);
      setStreamPhase("typing");

      await typeText(ioDemo.input, setTypedInput, 1, 22);
      if (cancelled) {
        return;
      }

      setStreamPhase("reading");
      await sleep(380);
      if (cancelled) {
        return;
      }

      if (thinkEnabled) {
        setStreamPhase("thinking");
        await typeText(`<think>\n${ioDemo.think}\n</think>`, setStreamedThink, 2, 18);
        if (cancelled) {
          return;
        }

        await sleep(520);
        if (cancelled) {
          return;
        }

        setIsThinkCollapsed(true);
        await sleep(260);
        if (cancelled) {
          return;
        }
      }

      setStreamPhase("answering");
      await typeText(ioDemo.output, setStreamedOutput, 2, 20);
      if (cancelled) {
        return;
      }

      setStreamPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, thinkEnabled, runSeed]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "system") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedSystemPrompt("");
      setTypedSystemInput("");
      setStreamedSystemThink("");
      setStreamedSystemOutput("");
      setIsSystemThinkCollapsed(false);
      setSystemPhase("prompting");

      await typeText(currentSystemPreset.systemPrompt, setTypedSystemPrompt, 3, 10);
      if (cancelled) {
        return;
      }

      await sleep(180);
      if (cancelled) {
        return;
      }

      setSystemPhase("typing");
      await typeText(currentSystemPreset.userInput, setTypedSystemInput, 1, 22);
      if (cancelled) {
        return;
      }

      setSystemPhase("reading");
      await sleep(380);
      if (cancelled) {
        return;
      }

      if (systemThinkEnabled) {
        setSystemPhase("thinking");
        await typeText(
          `<think>\n${currentSystemPreset.think}\n</think>`,
          setStreamedSystemThink,
          2,
          16,
        );
        if (cancelled) {
          return;
        }

        await sleep(520);
        if (cancelled) {
          return;
        }

        setIsSystemThinkCollapsed(true);
        await sleep(260);
        if (cancelled) {
          return;
        }
      }

      setSystemPhase("answering");
      await typeText(currentSystemPreset.output, setStreamedSystemOutput, 2, 18);
      if (cancelled) {
        return;
      }

      setSystemPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, activeSystemPreset, systemThinkEnabled, systemRunSeed, currentSystemPreset]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "structured") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const runDemo = async () => {
      setTypedStructuredInput("");
      setStreamedNaturalThink("");
      setStreamedNaturalOutput("");
      setStreamedStructuredThink("");
      setStreamedStructuredOutput("");
      setIsNaturalThinkCollapsed(false);
      setIsJsonThinkCollapsed(false);
      setStructuredPhase("typing");

      await typeText(structuredOutputDemo.userInput, setTypedStructuredInput, 1, 18);
      if (cancelled) {
        return;
      }

      setStructuredPhase("reading");
      await sleep(320);
      if (cancelled) {
        return;
      }

      if (structuredThinkEnabled) {
        setStructuredPhase("natural-thinking");
        await typeText(
          `<think>\n${structuredOutputDemo.naturalThink}\n</think>`,
          setStreamedNaturalThink,
          2,
          15,
        );
        if (cancelled) {
          return;
        }

        await sleep(360);
        if (cancelled) {
          return;
        }

        setIsNaturalThinkCollapsed(true);
      }

      setStructuredPhase("natural-output");
      await typeText(structuredOutputDemo.naturalOutput, setStreamedNaturalOutput, 2, 18);
      if (cancelled) {
        return;
      }

      await sleep(180);
      if (cancelled) {
        return;
      }

      if (structuredThinkEnabled) {
        setStructuredPhase("json-thinking");
        await typeText(
          `<think>\n${structuredOutputDemo.structuredThink}\n</think>`,
          setStreamedStructuredThink,
          2,
          14,
        );
        if (cancelled) {
          return;
        }

        await sleep(360);
        if (cancelled) {
          return;
        }

        setIsJsonThinkCollapsed(true);
      }

      setStructuredPhase("json-output");
      await typeText(structuredOutputDemo.structuredOutput, setStreamedStructuredOutput, 2, 16);
      if (cancelled) {
        return;
      }

      setStructuredPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [route, activeModule, structuredThinkEnabled, structuredRunSeed]);

  useEffect(() => {
    if (route !== "learn" || activeModule !== "function") {
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeText = async (
      text: string,
      setter: (value: string) => void,
      step = 1,
      delay = 24,
    ) => {
      let current = "";

      for (let index = 0; index < text.length; index += step) {
        if (cancelled) {
          return;
        }

        current = text.slice(0, index + step);
        setter(current);
        await sleep(delay);
      }
    };

    const getDynamicToolResult = () => {
      if (currentFunctionPreset.id !== "time") {
        return currentFunctionPreset.toolResult ?? "";
      }

      const now = new Date();
      const parts = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
        .formatToParts(now)
        .reduce<Record<string, string>>((acc, part) => {
          if (part.type !== "literal") {
            acc[part.type] = part.value;
          }
          return acc;
        }, {});

      return `{
  "timezone": "Asia/Shanghai",
  "current_time": "${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}",
  "weekday": "${now.toLocaleDateString("zh-CN", { weekday: "long", timeZone: "Asia/Shanghai" })}"
}`;
    };

    const runDemo = async () => {
      const toolResult = getDynamicToolResult();

      setTypedFunctionInput("");
      setStreamedFunctionThink("");
      setStreamedFunctionArgs("");
      setStreamedFunctionResult("");
      setStreamedFunctionOutput("");
      setIsFunctionThinkCollapsed(false);
      setFunctionPhase("typing");

      await typeText(currentFunctionPreset.userInput, setTypedFunctionInput, 1, 20);
      if (cancelled) {
        return;
      }

      if (functionThinkEnabled) {
        setFunctionPhase("thinking");
        await typeText(
          `<think>\n${currentFunctionPreset.think}\n</think>`,
          setStreamedFunctionThink,
          2,
          16,
        );
        if (cancelled) {
          return;
        }

        await sleep(420);
        if (cancelled) {
          return;
        }

        setIsFunctionThinkCollapsed(true);
      }

      setFunctionPhase("calling");
      await typeText(currentFunctionPreset.argumentsJson, setStreamedFunctionArgs, 2, 14);
      if (cancelled) {
        return;
      }

      await sleep(200);
      if (cancelled) {
        return;
      }

      setFunctionPhase("result");
      await typeText(toolResult, setStreamedFunctionResult, 2, 16);
      if (cancelled) {
        return;
      }

      await sleep(200);
      if (cancelled) {
        return;
      }

      setFunctionPhase("answering");
      const finalOutput =
        currentFunctionPreset.id === "time"
          ? `现在是北京时间 ${toolResult.match(/"current_time": "([^"]+)"/)?.[1] ?? ""}，${toolResult.match(/"weekday": "([^"]+)"/)?.[1] ?? ""}。`
          : currentFunctionPreset.output ?? "";
      await typeText(finalOutput, setStreamedFunctionOutput, 2, 18);
      if (cancelled) {
        return;
      }

      setFunctionPhase("done");
    };

    void runDemo();

    return () => {
      cancelled = true;
    };
  }, [
    route,
    activeModule,
    activeFunctionPreset,
    functionThinkEnabled,
    functionRunSeed,
    currentFunctionPreset,
  ]);

  const phaseLabel =
    streamPhase === "typing"
      ? "正在输入问题"
      : streamPhase === "reading"
        ? "正在读取输入"
        : streamPhase === "thinking"
          ? "正在展开思考"
          : streamPhase === "answering"
            ? "正在流式输出"
            : "输出完成";

  const phaseHint = thinkEnabled
    ? "打开后，会先展示 <think> 思考流，再自动折叠。"
    : "关闭后，会跳过思考流，直接开始生成回答。";

  const replayDemo = () => {
    setRunSeed((value) => value + 1);
  };

  const systemPhaseLabel =
    systemPhase === "prompting"
      ? "正在加载系统提示词"
      : systemPhase === "typing"
        ? "正在输入用户问题"
        : systemPhase === "reading"
          ? "正在读取上下文"
          : systemPhase === "thinking"
            ? "正在展开思考"
            : systemPhase === "answering"
              ? "正在流式输出"
              : "输出完成";

  const systemPhaseHint = systemThinkEnabled
    ? "打开后，会先展示 <think> 思考流，再自动折叠。"
    : "关闭后，会跳过思考流，直接开始生成回答。";

  const replaySystemDemo = () => {
    setSystemRunSeed((value) => value + 1);
  };

  const structuredPhaseLabel =
    structuredPhase === "typing"
      ? "正在输入问题"
      : structuredPhase === "reading"
        ? "正在读取输入"
        : structuredPhase === "natural-thinking"
          ? "正在生成自然语言思路"
          : structuredPhase === "natural-output"
            ? "正在输出自然语言结果"
            : structuredPhase === "json-thinking"
              ? "正在生成结构化思路"
              : structuredPhase === "json-output"
                ? "正在输出 JSON"
                : "输出完成";

  const structuredPhaseHint = structuredThinkEnabled
    ? "打开后，会先展示两段 <think> 思考流，再输出自然语言和 JSON。"
    : "关闭后，会直接演示两种输出，不展示中间思考。";

  const replayStructuredDemo = () => {
    setStructuredRunSeed((value) => value + 1);
  };

  const functionPhaseLabel =
    functionPhase === "typing"
      ? "正在输入问题"
      : functionPhase === "thinking"
        ? "正在判断是否要调用函数"
        : functionPhase === "calling"
          ? "正在补齐函数参数"
          : functionPhase === "result"
            ? "正在接收函数结果"
            : functionPhase === "answering"
              ? "正在组织最终回答"
              : "输出完成";

  const functionPhaseHint = functionThinkEnabled
    ? "打开后，会先展示 <think>，再展示函数参数、返回值和最终回答。"
    : "关闭后，会跳过思考流，直接演示函数调用过程。";

  const replayFunctionDemo = () => {
    setFunctionRunSeed((value) => value + 1);
  };

  if (route === "learn") {
    return (
      <div className="learn-page">
        <header className="learn-topbar">
          <a className="back-link" href="#/">
            返回展示页
          </a>
          <div className="learn-brand">
            <span className="brand-mark" />
            <div>
              <p className="brand-title">学习区</p>
              <p className="brand-subtitle">从输入输出开始，一页页往后学</p>
            </div>
          </div>
        </header>

        <main className="learn-shell">
          <aside className="workspace-sidebar" aria-label="模块导航">
            {learningModules.map((module) => (
              <button
                className={`sidebar-item ${activeModule === module.id ? "is-active" : ""}`}
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                type="button"
              >
                <span className="sidebar-title">{module.title}</span>
                <span className="sidebar-subtitle">{module.subtitle}</span>
              </button>
            ))}
          </aside>

          <section className="workspace-panel">
            {activeModule === "io" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第一页</p>
                  <h1>输入与输出</h1>
                  <p>
                    先只看最基础的一件事：你输入一句话，模型怎么一点点变成最终输出。别急着上工具，先把这一步看顺。
                  </p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={thinkEnabled}
                    className={`think-switch ${thinkEnabled ? "is-on" : ""}`}
                    onClick={() => setThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{phaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="lesson-stage">
                  <section className="composer-card">
                    <div className="composer-head">
                      <span className="panel-label">输入</span>
                    </div>
                    <div className="composer-body">
                      <p>
                        {typedInput}
                        {streamPhase === "typing" ? (
                          <span className="stream-caret composer-caret" aria-hidden="true" />
                        ) : null}
                      </p>
                    </div>
                    <div className="composer-footer">
                      <span className="signal-dot" />
                      <span>这一层还没有工具、没有搜索，只有文本输入。</span>
                    </div>
                  </section>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">模型输出中</span>
                        <p className="stream-status">{phaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">input</span>
                        <span className="stream-value">text prompt</span>
                      </div>
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">
                          {thinkEnabled ? "reasoning + streaming" : "streaming only"}
                        </span>
                      </div>

                      {thinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>思考流已展示完成并自动折叠，点击上方可以重新展开查看。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedThink}
                              {streamPhase === "thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedOutput}
                          {streamPhase === "answering" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{ioDemo.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一步的重点</span>
                    <p>输入不是“随便问一句”这么简单。你写进输入里的对象、语气、结构要求，都会直接改变输出。</p>
                  </article>
                </div>
              </>
            ) : activeModule === "system" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第二页</p>
                  <h1>系统提示词</h1>
                  <p>
                    这一页不再只看“用户说了什么”，而是看模型在正式回答前，被怎样设定身份、目标、边界和语气。
                  </p>
                </div>

                <div className="preset-switcher" role="tablist" aria-label="系统提示词示例">
                  {systemPromptDemos.map((preset) => (
                    <button
                      aria-selected={activeSystemPreset === preset.id}
                      className={`preset-chip ${activeSystemPreset === preset.id ? "is-active" : ""}`}
                      key={preset.id}
                      onClick={() => setActiveSystemPreset(preset.id)}
                      role="tab"
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">当前示例</span>
                  <h2>{currentSystemPreset.title}</h2>
                  <p>{currentSystemPreset.subtitle}</p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replaySystemDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={systemThinkEnabled}
                    className={`think-switch ${systemThinkEnabled ? "is-on" : ""}`}
                    onClick={() => setSystemThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{systemPhaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="system-stage">
                  <div className="system-stage-stack">
                    <section className="system-prompt-card">
                      <div className="composer-head">
                        <span className="panel-label">System Prompt</span>
                      </div>
                      <pre className="system-prompt-body">{typedSystemPrompt}</pre>
                    </section>

                    <section className="composer-card system-user-card">
                      <div className="composer-head">
                        <span className="panel-label">用户输入</span>
                      </div>
                      <div className="composer-body system-user-body">
                        <p>
                          {typedSystemInput}
                          {systemPhase === "typing" ? (
                            <span className="stream-caret composer-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </section>
                  </div>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">系统提示词生效中</span>
                        <p className="stream-status">{systemPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">role</span>
                        <span className="stream-value">{currentSystemPreset.label}</span>
                      </div>
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">
                          {systemThinkEnabled ? "system prompt + reasoning" : "system prompt only"}
                        </span>
                      </div>

                      {systemThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsSystemThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isSystemThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isSystemThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>思考流已展示完成并自动折叠，点击上方可以重新展开查看。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedSystemThink}
                              {systemPhase === "thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedSystemOutput}
                          {systemPhase === "answering" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{currentSystemPreset.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      system prompt 不只是“加一句设定”。它会提前规定模型的身份、结构、语气和边界，所以连思考路径和最后输出都会一起被塑形。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "structured" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第三页</p>
                  <h1>结构化输出</h1>
                  <p>
                    同一个问题，模型可以像人一样写一段自然语言，也可以按你规定的字段输出 JSON。这一步，是从“能看”走向“能编程”。
                  </p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayStructuredDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={structuredThinkEnabled}
                    className={`think-switch ${structuredThinkEnabled ? "is-on" : ""}`}
                    onClick={() => setStructuredThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{structuredPhaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="structured-shell">
                  <div className="structured-inputs">
                    <section className="composer-card">
                      <div className="composer-head">
                        <span className="panel-label">用户输入</span>
                      </div>
                      <div className="composer-body structured-input-body">
                        <p>
                          {typedStructuredInput}
                          {structuredPhase === "typing" ? (
                            <span className="stream-caret composer-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </section>

                    <section className="schema-card">
                      <div className="composer-head">
                        <span className="panel-label">目标 JSON 结构</span>
                      </div>
                      <pre className="schema-pre">{structuredOutputDemo.schema}</pre>
                    </section>
                  </div>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">自然语言输出</span>
                        <p className="stream-status">{structuredPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">plain answer</span>
                      </div>

                      {structuredThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsNaturalThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isNaturalThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isNaturalThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>自然语言思考流已完成，点击上方可以重新展开。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedNaturalThink}
                              {structuredPhase === "natural-thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedNaturalOutput}
                          {structuredPhase === "natural-output" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="stream-card structured-json-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">结构化输出</span>
                        <p className="stream-status">同一个输入，被约束成固定字段</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">json object</span>
                      </div>

                      {structuredThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsJsonThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isJsonThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isJsonThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>JSON 思考流已完成，点击上方可以重新展开。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedStructuredThink}
                              {structuredPhase === "json-thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <pre className="stream-output stream-output-json">
                          {streamedStructuredOutput}
                          {structuredPhase === "json-output" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </pre>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{structuredOutputDemo.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      结构化输出的关键不是“看起来像 JSON”，而是字段稳定、键名稳定、程序可以直接拿去渲染、存库或继续传给下一个函数。
                    </p>
                  </article>
                </div>
              </>
            ) : activeModule === "function" ? (
              <>
                <div className="lesson-head">
                  <p className="eyebrow">第四页</p>
                  <h1>Function Calling</h1>
                  <p>
                    这一页开始进入“模型不只是回答，而是先决定要不要调用工具”。关键不是函数本身，而是模型如何判断、补参数、拿结果、再回来回答。
                  </p>
                </div>

                <div className="preset-switcher" role="tablist" aria-label="函数调用示例">
                  {functionCallDemos.map((preset) => (
                    <button
                      aria-selected={activeFunctionPreset === preset.id}
                      className={`preset-chip ${activeFunctionPreset === preset.id ? "is-active" : ""}`}
                      key={preset.id}
                      onClick={() => setActiveFunctionPreset(preset.id)}
                      role="tab"
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="system-intro-card">
                  <span className="panel-label">当前示例</span>
                  <h2>{currentFunctionPreset.title}</h2>
                  <p>{currentFunctionPreset.subtitle}</p>
                </div>

                <div className="lesson-toolbar">
                  <button className="replay-button" onClick={replayFunctionDemo} type="button">
                    重新播放
                  </button>
                  <button
                    aria-pressed={functionThinkEnabled}
                    className={`think-switch ${functionThinkEnabled ? "is-on" : ""}`}
                    onClick={() => setFunctionThinkEnabled((value) => !value)}
                    type="button"
                  >
                    <span className="think-switch-copy">
                      <strong>思考开关</strong>
                      <small>{functionPhaseHint}</small>
                    </span>
                    <span className="think-switch-track" aria-hidden="true">
                      <span className="think-switch-thumb" />
                    </span>
                  </button>
                </div>

                <div className="function-shell">
                  <section className="composer-card">
                    <div className="composer-head">
                      <span className="panel-label">用户输入</span>
                    </div>
                    <div className="composer-body function-input-body">
                      <p>
                        {typedFunctionInput}
                        {functionPhase === "typing" ? (
                          <span className="stream-caret composer-caret" aria-hidden="true" />
                        ) : null}
                      </p>
                    </div>
                  </section>

                  <section className="stream-card" aria-live="polite">
                    <div className="stream-head">
                      <div>
                        <span className="panel-label">函数调用流程</span>
                        <p className="stream-status">{functionPhaseLabel}</p>
                      </div>
                      <div className="stream-pulse" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="stream-console">
                      <div className="stream-line">
                        <span className="stream-key">function</span>
                        <span className="stream-value">{currentFunctionPreset.functionName}</span>
                      </div>

                      {functionThinkEnabled ? (
                        <div className="stream-think-wrap">
                          <button
                            className="think-block-head"
                            onClick={() => setIsFunctionThinkCollapsed((value) => !value)}
                            type="button"
                          >
                            <span className="stream-key">think</span>
                            <span className="think-block-state">
                              {isFunctionThinkCollapsed ? "已折叠" : "展开中"}
                            </span>
                          </button>

                          {isFunctionThinkCollapsed ? (
                            <div className="think-collapsed">
                              <p>函数决策思路已展示完成，点击上方可以重新展开。</p>
                            </div>
                          ) : (
                            <pre className="think-stream">
                              {streamedFunctionThink}
                              {functionPhase === "thinking" ? (
                                <span className="stream-caret" aria-hidden="true" />
                              ) : null}
                            </pre>
                          )}
                        </div>
                      ) : null}

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">arguments</span>
                        <pre className="stream-output stream-output-json">
                          {streamedFunctionArgs}
                          {functionPhase === "calling" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </pre>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">{currentFunctionPreset.resultLabel}</span>
                        <pre className="stream-output stream-output-json">
                          {streamedFunctionResult}
                          {functionPhase === "result" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </pre>
                      </div>

                      <div className="stream-line stream-line-live">
                        <span className="stream-key">final</span>
                        <p className="stream-output">
                          {streamedFunctionOutput}
                          {functionPhase === "answering" ? (
                            <span className="stream-caret" aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{currentFunctionPreset.note}</p>
                  </article>
                  <article className="insight-card">
                    <span className="panel-label">这一页的重点</span>
                    <p>
                      function calling 不是“模型会写代码”，而是模型先输出一个结构化调用意图，再由程序真正执行函数，并把结果送回模型继续回答。
                    </p>
                  </article>
                </div>
              </>
            ) : (
              <div className="placeholder-panel">
                <span className="panel-label">下一步</span>
                <h2>
                  {learningModules.find((module) => module.id === activeModule)?.title ?? "模块"}
                </h2>
                <p>这个模块下一步继续开发。当前先把第一页“输入与输出”做扎实。</p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark" />
            <div>
              <p className="brand-title">AI 架构可视化</p>
              <p className="brand-subtitle">给懂一点代码的小白看的入门站</p>
            </div>
          </div>

          <div className="nav-links">
            <a href="#topics">入门目录</a>
            <a href="#example">示例</a>
            <a href="#api">API</a>
          </div>
        </nav>

        <div className="hero-atmosphere" aria-hidden="true">
          <span className="glow glow-1" />
          <span className="glow glow-2" />
          <span className="glow glow-3" />
          <div className="grid-orbit" />
        </div>

        <section className="hero-copy">
          <p className="eyebrow">从 Prompt 到 ReAct</p>
          <h1>先把 AI 入门部分，一次看明白。</h1>
          <p className="hero-text">
            提示词、系统提示词、输出、结构化输出、Function Calling、搜索与 DuckDuckGo、ReAct 循环。
            先把这 6 个点讲透，再往后走。
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#/learn">
              开始学习
            </a>
            <a className="button button-secondary" href="#example">
              先看示例
            </a>
          </div>
        </section>

        <section className="stage" aria-label="首页示意">
          {examplePanels.map((panel, index) => (
            <div className={`stage-panel stage-panel-${index + 1}`} key={panel.label}>
              <span className="panel-label">{panel.label}</span>
              <pre>{panel.value}</pre>
            </div>
          ))}
        </section>

        <div className="pill-row">
          {stagePills.map((pill) => (
            <span className="pill" key={pill}>
              {pill}
            </span>
          ))}
        </div>
      </header>

      <main className="main">
        <section className="section" id="topics">
          <div className="section-heading">
            <p className="eyebrow">入门目录</p>
            <h2>这一阶段先学这 6 个点。</h2>
          </div>

          <div className="topic-grid">
            {introTopics.map((topic) => (
              <article className="topic-card" key={topic.index}>
                <span className="topic-index">{topic.index}</span>
                <h3>{topic.title}</h3>
                <p>{topic.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="example">
          <div className="section-heading">
            <p className="eyebrow">开篇示例</p>
            <h2>这一页先让你看到输入如何被约束，然后再进入学习区。</h2>
          </div>

          <div className="topic-grid">
            {examplePanels.map((panel) => (
              <article className="topic-card" key={panel.label}>
                <span className="topic-index">{panel.label}</span>
                <pre className="topic-pre">{panel.value}</pre>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="api">
          <div className="section-heading">
            <p className="eyebrow">静态站也能接 API</p>
            <h2>界面很轻，能力可以是真实的。</h2>
          </div>

          <div className="api-grid">
            {apiCards.map((card) => (
              <article className="api-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
            <article className="api-card">
              <h3>当前 API 地址</h3>
              <code>{apiBase}</code>
              <p>通过 `VITE_API_BASE_URL` 注入，不把密钥写进前端。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
