# robinsong.top — React 版（保存分支）

这个分支保存的是 **React + TypeScript + Vite + Tailwind** 实现的个人网站，
也就是 `robinsong.top` 在 **2026-09-30** 之前线上运行的版本。

它被单独开成分支是为了**留存**：`main` 已经前进到 Astro 重写版，这个实现
不再继续开发，但完整保留在这里，随时可以 checkout 出来重建、部署或参考。

## 分支历史

| 分支 | 内容 | 状态 |
|---|---|---|
| `legacy-html` | 初版：手写 HTML/CSS/JS 站点（commit `8569dbe`） | 已归档，不再更新 |
| **`react-site`**（本分支） | React 重写版 | 已归档，不再更新 |
| `main` | Astro 重写版（PR #1） | 当前开发线 |

## 构建

需要 Node >= 20（本机验证使用 v22）。

```bash
npm ci          # 或 npm install
npm run build   # tsc -b && vite build → dist/
```

产物在 `dist/`，是一个纯静态站点。

其它脚本：`npm run dev`（本地开发）、`npm run preview`（预览构建产物）、`npm run lint`。

## 部署（本机实际方式）

线上由 nginx 提供服务，站点根目录指向构建产物：

```nginx
root /home/ubuntu/myhomepage-react/dist;
```

- 域名：`robinsong.top` / `www.robinsong.top`，Let's Encrypt 证书，监听 80 + 443
- `^~ /api/` 反向代理到 `127.0.0.1:8801` —— 网站聊天框的后端
- 站点聊天**不经过 Hermes**：`127.0.0.1:8801` 上跑的是
  `chat_api.py`（见 `/home/ubuntu/myhomepage-bridge`），直接调用
  DeepSeek chat-completions API，按 IP 有单日对话上限
- 旧站 `.html` 地址在 nginx 里 301 跳转到本版本的干净路由（保留外链 / SEO）

## 目录结构

```
src/
  components/     Header / Footer / ProjectCard / Chatbot / FluidSim …
  pages/          Home / About / projects/*Page.tsx
  context/        ThemeContext / UiContext
  data/           projects.ts（项目内容数据）
public/
  images/         站点图片资源（与初版共用同一批文件）
  files/          CV、报告、StableShape 包、botdata.json
index.html        入口（挂载 #root，加载 /src/main.tsx）
```

路由由 `react-router-dom` 处理，nginx 侧对未知路径回退到 `index.html`（SPA 回退）。

## 注意

- `node_modules/` 和 `dist/` 已被 `.gitignore` 排除，不入库。
- 聊天框组件 `src/components/Chatbot.tsx` 请求同源 `/api/chat`，需要
  `X-Access-Key` 请求头（访问密钥由后端 `config.json` 持有，不在前端）。
