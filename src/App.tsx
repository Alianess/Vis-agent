import { useEffect, useState } from "react";
import {
  apiCards,
  examplePanels,
  introTopics,
  ioScenarios,
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
  const [activeScenario, setActiveScenario] = useState(ioScenarios[0].id);
  const [streamedOutput, setStreamedOutput] = useState("");
  const [streamPhase, setStreamPhase] = useState<"reading" | "thinking" | "answering">("reading");

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const currentScenario =
    ioScenarios.find((scenario) => scenario.id === activeScenario) ?? ioScenarios[0];

  useEffect(() => {
    if (route !== "learn" || activeModule !== "io") {
      return;
    }

    setStreamedOutput("");
    setStreamPhase("reading");

    const phaseTimers = [
      window.setTimeout(() => setStreamPhase("thinking"), 520),
      window.setTimeout(() => setStreamPhase("answering"), 1120),
    ];

    let charIndex = 0;
    const streamTimer = window.setInterval(() => {
      if (charIndex >= currentScenario.output.length) {
        window.clearInterval(streamTimer);
        return;
      }

      charIndex += 2;
      setStreamedOutput(currentScenario.output.slice(0, charIndex));
    }, 28);

    return () => {
      phaseTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(streamTimer);
    };
  }, [route, activeModule, currentScenario]);

  const phaseLabel =
    streamPhase === "reading"
      ? "正在读取输入"
      : streamPhase === "thinking"
        ? "正在组织表达"
        : "正在生成输出";

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

                <div className="scenario-tabs">
                  {ioScenarios.map((scenario) => (
                    <button
                      className={`scenario-tab ${activeScenario === scenario.id ? "is-active" : ""}`}
                      key={scenario.id}
                      onClick={() => setActiveScenario(scenario.id)}
                      type="button"
                    >
                      {scenario.label}
                    </button>
                  ))}
                </div>

                <div className="lesson-stage">
                  <section className="composer-card">
                    <div className="composer-head">
                      <span className="panel-label">输入</span>
                      <span className="composer-tip">你喂给模型的原始文字</span>
                    </div>
                    <div className="composer-body">
                      <p>{currentScenario.input}</p>
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
                        <span className="stream-value">prompt</span>
                      </div>
                      <div className="stream-line">
                        <span className="stream-key">mode</span>
                        <span className="stream-value">text generation</span>
                      </div>
                      <div className="stream-line stream-line-live">
                        <span className="stream-key">output</span>
                        <p className="stream-output">
                          {streamedOutput}
                          <span className="stream-caret" aria-hidden="true" />
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="io-insights">
                  <article className="insight-card">
                    <span className="panel-label">观察点</span>
                    <p>{currentScenario.note}</p>
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
