import { apiCards, comparison, stagePills, steps } from "./content";

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
              <p className="brand-subtitle">静态站 · 中文 · 面向懂一点代码的小白</p>
            </div>
          </div>

          <div className="nav-links">
            <a href="#intro">介绍</a>
            <a href="#demo">示例</a>
            <a href="#api">API</a>
          </div>
        </nav>

        <section className="hero-copy" id="intro">
          <p className="eyebrow">从 Prompt 到 Agent</p>
          <h1>把 AI 的工作方式讲明白。</h1>
          <p className="hero-text">
            不讲框架黑话，不堆一整页术语。
            先看模型如何被引导，再看应用如何把模型变成一个真正能工作的系统。
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#demo">
              先看一个例子
            </a>
            <a className="button button-secondary" href="#flow">
              再看整体路径
            </a>
          </div>
        </section>

        <section className="stage" aria-label="架构预览">
          <div className="stage-panel stage-panel-top">
            <span className="panel-label">Prompt</span>
            <p>写一句首页副标题，介绍这个网站帮助人理解 AI 和 Agent 架构。</p>
          </div>
          <div className="stage-panel stage-panel-middle">
            <span className="panel-label">System</span>
            <p>清楚、克制、面向懂一点代码但没看懂 AI 架构的人。</p>
          </div>
          <div className="stage-panel stage-panel-bottom">
            <span className="panel-label">Output</span>
            <p>{`{ "headline": "把 AI 架构看明白" }`}</p>
          </div>
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
        <section className="section compare" id="demo">
          <div className="section-heading">
            <p className="eyebrow">一个例子</p>
            <h2>同一个请求，约束越清楚，输出越稳定。</h2>
          </div>

          <div className="request">
            <span className="request-label">用户请求</span>
            <p>{comparison.request}</p>
          </div>

          <div className="compare-grid">
            <article className="compare-card">
              <span className="card-label">Prompt</span>
              <pre>{comparison.prompt}</pre>
            </article>
            <article className="compare-card">
              <span className="card-label">System</span>
              <pre>{comparison.system}</pre>
            </article>
            <article className="compare-card compare-card-dark">
              <span className="card-label">Structured Output</span>
              <pre>{comparison.output}</pre>
            </article>
          </div>
        </section>

        <section className="section flow" id="flow">
          <div className="section-heading">
            <p className="eyebrow">学习路径</p>
            <h2>先输入，再链路，最后 Agent。</h2>
          </div>

          <div className="flow-grid">
            {steps.map((step) => (
              <article className="flow-card" key={step.index}>
                <span className="flow-index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section api" id="api">
          <div className="section-heading">
            <p className="eyebrow">静态站也能接 API</p>
            <h2>前端很轻，后端可以是真实的。</h2>
          </div>

          <div className="api-grid">
            {apiCards.map((card) => (
              <article className="api-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
            <article className="api-card">
              <h3>当前地址</h3>
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
