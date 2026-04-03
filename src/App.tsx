import {
  audiences,
  learningPath,
  modules,
  openingDemo,
  quickFacts,
  sections,
} from "./content";

function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "未配置";

  return (
    <div className="site-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand">
            <span className="brand-mark">AI</span>
            <div>
              <p className="brand-title">看懂 AI 与 Agent 架构</p>
              <p className="brand-subtitle">中文可视化教学项目</p>
            </div>
          </div>

          <div className="topbar-links">
            <a href="#path">学习路径</a>
            <a href="#modules">模块概览</a>
            <a href="#api">API 接法</a>
          </div>
        </nav>

        <div className="hero-grid">
          <section className="hero-copy">
            <p className="eyebrow">从 Prompt 到 Agent，一步一步看懂</p>
            <h1>
              不是为了把你训练成框架用户，
              <br />
              而是帮你先建立一张真正清晰的 AI 架构地图。
            </h1>
            <p className="hero-body">
              这个项目面向懂一点代码、但还没有真正建立整体认知的人。
              你会先看懂 Prompt、大模型、System Prompt、结构化输出，
              再逐步进入工具调用、Skill、MCP、记忆与 RAG。
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#path">
                从零开始学习
              </a>
              <a className="secondary-button" href="#modules">
                直接看 Agent 全景图
              </a>
            </div>
          </section>

          <aside className="hero-panel" aria-label="架构预览">
            <div className="signal-card">
              <span className="signal-step">01</span>
              <div>
                <h2>Prompt</h2>
                <p>先知道怎样告诉模型“你要做什么”。</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-step">02</span>
              <div>
                <h2>System Prompt</h2>
                <p>再理解模型为什么会“扮演角色”和守规则。</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-step">03</span>
              <div>
                <h2>结构化输出</h2>
                <p>再看模型怎么从聊天，变成可编程接口。</p>
              </div>
            </div>
            <div className="signal-card accent">
              <span className="signal-step">04</span>
              <div>
                <h2>Agent Runtime</h2>
                <p>最后再把工具、记忆、检索、循环全部接起来。</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main className="content">
        <section className="facts-grid" aria-label="项目特征">
          {quickFacts.map((fact) => (
            <article className="fact-card" key={fact.label}>
              <p className="fact-label">{fact.label}</p>
              <h3>{fact.value}</h3>
              <p>{fact.note}</p>
            </article>
          ))}
        </section>

        <section className="narrative-grid">
          {sections.map((section) => (
            <article className="narrative-card" id={section.id} key={section.id}>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        <section className="audience-section">
          <div className="section-heading">
            <p className="eyebrow">谁需要装什么</p>
            <h2>用户和开发者不是一类人，环境要求也不一样。</h2>
          </div>

          <div className="audience-grid">
            {audiences.map((audience) => (
              <article className="audience-card" key={audience.title}>
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
                <ul className="audience-list">
                  {audience.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="demo-section">
          <div className="section-heading">
            <p className="eyebrow">开篇示例</p>
            <h2>同一个需求，为什么加了规则之后输出会完全不同。</h2>
          </div>

          <div className="demo-request">
            <span className="demo-chip">用户请求</span>
            <p>{openingDemo.request}</p>
          </div>

          <div className="demo-grid">
            <article className="demo-card">
              <p className="eyebrow">01 Prompt</p>
              <h3>只有任务，没有额外控制</h3>
              <p>{openingDemo.promptOnly}</p>
              <div className="demo-output">
                <span>输出示例</span>
                <p>{openingDemo.plainResponse}</p>
              </div>
            </article>

            <article className="demo-card">
              <p className="eyebrow">02 System Prompt</p>
              <h3>给模型角色、目标和文风边界</h3>
              <pre className="demo-code">{openingDemo.systemPrompt}</pre>
            </article>

            <article className="demo-card">
              <p className="eyebrow">03 Structured Output</p>
              <h3>让结果从“能看”变成“能编程”</h3>
              <pre className="demo-code">{openingDemo.structuredResponse}</pre>
            </article>
          </div>
        </section>

        <section className="path-section" id="path">
          <div className="section-heading">
            <p className="eyebrow">推荐学习路径</p>
            <h2>由浅入深，不一次性灌太多概念。</h2>
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
            <h2>第一版先把最关键的几层讲透。</h2>
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
            <p className="eyebrow">静态站如何接 API</p>
            <h2>页面静态，能力动态。</h2>
          </div>

          <div className="api-grid">
            <article className="api-card">
              <h3>前端职责</h3>
              <p>负责展示、讲解、交互与可视化，不保存模型密钥。</p>
            </article>
            <article className="api-card">
              <h3>后端职责</h3>
              <p>负责调用大模型、Embedding、向量检索、工具执行与密钥管理。</p>
            </article>
            <article className="api-card">
              <h3>当前 API 地址</h3>
              <p className="api-base">{apiBase}</p>
              <p className="api-note">
                通过 `VITE_API_BASE_URL` 配置。GitHub Pages 部署前端，后端单独部署即可。
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
