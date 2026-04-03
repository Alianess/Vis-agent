import { apiCards, exampleCards, examplePanels, introTopics, stagePills } from "./content";

function App() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "未配置";

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
            <a href="#example">示例</a>
            <a href="#topics">入门目录</a>
            <a href="#api">API</a>
          </div>
        </nav>

        <section className="hero-copy">
          <p className="eyebrow">从 Prompt 到 ReAct</p>
          <h1>先把入门部分讲透。</h1>
          <p className="hero-text">
            提示词、系统提示词、输出、结构化输出、Function Calling、DuckDuckGo、搜索实现、ReAct
            循环。先把这 8 个点看明白，再进入更完整的 Agent 架构。
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#topics">
              看入门目录
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
            <h2>这一阶段先学这 8 个点。</h2>
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
            <p className="eyebrow">三个关键示例</p>
            <h2>从输出控制，到外部能力，再到 Agent 循环。</h2>
          </div>

          <div className="example-grid">
            {exampleCards.map((card) => (
              <article className="example-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <pre>{card.code}</pre>
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
