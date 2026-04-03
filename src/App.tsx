import { useState } from "react";
import {
  apiCards,
  examplePanels,
  introTopics,
  ioScenarios,
  learningModules,
  stagePills,
} from "./content";

function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "未配置";
  const [activeModule, setActiveModule] = useState("io");
  const [activeScenario, setActiveScenario] = useState(ioScenarios[0].id);

  const currentScenario =
    ioScenarios.find((scenario) => scenario.id === activeScenario) ?? ioScenarios[0];

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
            <a href="#workspace">学习工作区</a>
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
            先讲透提示词、系统提示词、输出、结构化输出，再进入 Function Calling、DuckDuckGo、
            搜索实现和 ReAct 循环。
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#workspace">
              进入第一课
            </a>
            <a className="button button-secondary" href="#topics">
              先看入门目录
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

        <section className="section workspace-section" id="workspace">
          <div className="section-heading">
            <p className="eyebrow">学习工作区</p>
            <h2>左边切换模块，右边真正开始学。</h2>
          </div>

          <div className="workspace-shell">
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
                    <h3>输入与输出</h3>
                    <p>
                      先不要急着讲系统提示词和工具。先看最朴素的一步：你给模型一条输入，它返回一条输出。
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

                  <div className="io-visual">
                    <article className="io-card io-input">
                      <span className="io-label">输入</span>
                      <p>{currentScenario.input}</p>
                    </article>

                    <div className="io-core" aria-hidden="true">
                      <span className="io-core-ring" />
                      <span className="io-core-dot" />
                      <p>模型</p>
                    </div>

                    <article className="io-card io-output">
                      <span className="io-label">输出</span>
                      <p>{currentScenario.output}</p>
                    </article>
                  </div>

                  <div className="io-note">
                    <span className="panel-label">这一页在讲什么</span>
                    <p>{currentScenario.note}</p>
                  </div>
                </>
              ) : (
                <div className="placeholder-panel">
                  <span className="panel-label">下一步</span>
                  <h3>
                    {learningModules.find((module) => module.id === activeModule)?.title ?? "模块"}
                  </h3>
                  <p>这个模块下一步继续开发。当前先把第一页“输入与输出”做扎实。</p>
                </div>
              )}
            </section>
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
