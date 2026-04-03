import {
  audiences,
  highlightCards,
  learningPath,
  modules,
  openingDemo,
  quickFacts,
  sections,
} from "./content";

function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "未配置";

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand-lockup">
            <span className="brand-dot" />
            <div>
              <p className="brand-title">AI 架构可视化</p>
              <p className="brand-subtitle">给懂一点代码、但还没真正看懂 AI 的人</p>
            </div>
          </div>

          <div className="topbar-links">
            <a href="#demo">开篇示例</a>
            <a href="#path">学习路径</a>
            <a href="#api">API</a>
          </div>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">从 Prompt 到 Agent</p>
          <h1>把 AI 的工作方式，一层一层看明白。</h1>
          <p className="hero-body">
            如果你会一点代码，但总觉得 Prompt、RAG、Tool Call、MCP、Agent
            这些词始终连不起来，这个站点就是给你的。
            它不会一上来灌一堆框架名，而是先把最基本的输入、输出、角色、接口和运行链路讲清楚。
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#path">
              从头开始看
            </a>
            <a className="secondary-button" href="#modules">
              先看全景
            </a>
          </div>
        </div>

        <div className="hero-stage" aria-label="首页预览">
          <div className="hero-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="window-body">
              <div className="flow-chip">Prompt</div>
              <div className="flow-arrow" />
              <div className="flow-chip">System Prompt</div>
              <div className="flow-arrow" />
              <div className="flow-chip">Structured Output</div>
              <div className="flow-arrow" />
              <div className="flow-chip accent">Agent Runtime</div>
            </div>
          </div>

          <div className="hero-note">
            <span>推荐路径</span>
            <p>先看模型怎么回答，再看应用怎么把模型变成一个真正能工作的系统。</p>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="quick-facts" aria-label="项目摘要">
          {quickFacts.map((fact) => (
            <article className="fact-card" key={fact.label}>
              <p className="fact-label">{fact.label}</p>
              <h2>{fact.value}</h2>
              <p>{fact.note}</p>
            </article>
          ))}
        </section>

        <section className="spotlight-grid">
          {highlightCards.map((card) => (
            <article className="spotlight-card" key={card.step}>
              <span className="spotlight-step">{card.step}</span>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </article>
          ))}
        </section>

        <section className="section-grid">
          {sections.map((section) => (
            <article className="section-card" id={section.id} key={section.id}>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        <section className="demo-section" id="demo">
          <div className="section-heading">
            <p className="eyebrow">开篇示例</p>
            <h2>同一个请求，为什么加了规则之后，结果会明显变好。</h2>
          </div>

          <div className="request-card">
            <span className="request-badge">用户请求</span>
            <p>{openingDemo.request}</p>
          </div>

          <div className="demo-grid">
            <article className="demo-card">
              <p className="eyebrow">Prompt</p>
              <h3>先给一个最普通的要求</h3>
              <pre className="code-block">{openingDemo.plainPrompt}</pre>
              <div className="demo-result">
                <span>模型输出</span>
                <p>{openingDemo.plainResponse}</p>
              </div>
            </article>

            <article className="demo-card">
              <p className="eyebrow">System Prompt</p>
              <h3>再告诉模型它是谁、面对谁、该怎么说</h3>
              <pre className="code-block">{openingDemo.systemPrompt}</pre>
            </article>

            <article className="demo-card">
              <p className="eyebrow">Structured Output</p>
              <h3>最后约束结果格式，让输出变成可编程接口</h3>
              <pre className="code-block">{openingDemo.structuredResponse}</pre>
            </article>
          </div>
        </section>

        <section className="audience-section">
          <div className="section-heading">
            <p className="eyebrow">怎么使用</p>
            <h2>普通学习者直接看站点，开发者才需要环境。</h2>
          </div>

          <div className="audience-grid">
            {audiences.map((audience) => (
              <article className="audience-card" key={audience.title}>
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
                <ul>
                  {audience.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="path-section" id="path">
          <div className="section-heading">
            <p className="eyebrow">学习路径</p>
            <h2>先建立直觉，再进入架构。</h2>
          </div>

          <ol className="path-list">
            {learningPath.map((item, index) => (
              <li className="path-item" key={item}>
                <span className="path-index">{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="modules-section" id="modules">
          <div className="section-heading">
            <p className="eyebrow">模块概览</p>
            <h2>第一版先把最关键的六层讲透。</h2>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <article className="module-card" key={module.title}>
                <span className="module-tag">{module.tag}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="api-section" id="api">
          <div className="section-heading">
            <p className="eyebrow">静态站也能接 API</p>
            <h2>界面可以很轻，后端能力可以是真实的。</h2>
          </div>

          <div className="api-grid">
            <article className="api-card">
              <h3>前端</h3>
              <p>GitHub Pages 托管静态页面，负责讲解、可视化和交互体验。</p>
            </article>
            <article className="api-card">
              <h3>后端</h3>
              <p>单独部署 Python / FastAPI，用来接 OpenAI、Embedding、Chroma 和后续工具。</p>
            </article>
            <article className="api-card">
              <h3>当前 API 地址</h3>
              <p className="api-base">{apiBase}</p>
              <p className="api-note">通过 `VITE_API_BASE_URL` 注入，不把密钥放进前端。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
