# 看懂 AI 与 Agent 架构

一个面向“懂一点代码的小白”的中文可视化教学站。

目标不是把用户训练成某个 Agent 框架的使用者，而是帮助他们先建立一张清晰的 AI 架构地图：

- Prompt 是什么
- 大模型与 API 接口怎么工作
- System Prompt / 角色设定怎么影响输出
- 结构化输出为什么重要
- 工具调用、Skill、MCP、记忆、RAG 各自处在什么位置

## 用户需要装环境吗

普通学习者不需要。

这个项目的使用方式分成三类：

### 1. 普通学习者

- 只需要打开网站链接
- 不需要安装 `npm`
- 不需要安装 Python
- 不需要配置数据库

### 2. 前端开发者

只有在你需要本地修改静态站时，才需要：

- Node.js
- `npm`

本地开发：

```bash
npm install
npm run dev
```

构建静态站：

```bash
npm run build
```

### 3. 后端开发者

只有在你要接真实 API 时，才需要：

- Python
- `venv`
- FastAPI
- OpenAI API
- Chroma

## 静态站能接 API 吗

可以。

这个项目采用的是：

- 前端：静态站
- 后端：单独部署的 API 服务

也就是说：

- GitHub Pages 托管页面
- Python / FastAPI 托管真实能力
- 前端通过 `VITE_API_BASE_URL` 请求后端

注意：
不要把模型密钥直接写进前端静态站。

## 前端技术栈

- React
- Vite
- TypeScript

## 当前后端路线

- FastAPI
- OpenAI Responses API
- `text-embedding-3-small`
- Chroma
- 本地 Markdown 内容源

## 本地启动前端

```bash
npm install
npm run dev
```

## 配置 API 地址

复制 `.env.example` 为 `.env`，然后填写你的后端地址：

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

## GitHub Pages 部署

仓库中已经包含 GitHub Pages workflow：

- `.github/workflows/deploy-pages.yml`

推送到 `main` 后即可自动构建和部署静态站。

如果你的仓库启用了 GitHub Pages，请在仓库设置中确认：

- `Settings -> Pages`
- Source 使用 `GitHub Actions`

## 当前阶段

当前优先做：

1. 首页介绍页
2. 学习路径与模块总览
3. 静态站部署
4. 预留后端 API 接入位

之后再逐步接入真实后端能力。
