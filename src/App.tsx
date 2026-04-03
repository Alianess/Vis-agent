import { useEffect, useState } from "react";
import {
  apiCards,
  examplePanels,
  introTopics,
  ioDemo,
  learningModules,
  stagePills,
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

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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
                      <span className="composer-tip">问题会像聊天框里那样一字一字出现</span>
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
            提示词、系统提示词、输出、结构化输出、Function Calling、DuckDuckGo、搜索功能实现、ReAct 循环。
            先把这 7 个点讲透，再往后走。
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
            <h2>这一阶段先学这 7 个点。</h2>
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
