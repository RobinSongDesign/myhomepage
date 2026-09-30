My homepage for portfolio and blogs — [robinsong.top](https://robinsong.top)

用 [Astro](https://astro.build) 生成的纯静态站点：写的是组件和数据，产出的是普通 HTML/CSS/JS，任何静态服务器（包括现在的 nginx）都能直接托管。

## 常用命令

需要 Node ≥ 22.12（`.nvmrc` 里是 24，先 `nvm use`）。

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 本地开发，<http://localhost:4321> |
| `npm run build` | 构建到 `dist/` |
| `npm run preview` | 本地预览构建结果 |
| `npm run check` | TypeScript / Astro 类型检查 |

## 目录结构

```
src/
  data/            ← 内容的唯一来源
    site.ts          个人信息、社交链接、CV、机器人接口
    projects.ts      项目列表（顺序 = 首页顺序 = 上一个/下一个）
    about.ts         经历、教育、工具、荣誉
    image-sizes.json 图床图片的宽高（防止加载时页面跳动）
    imgdb.ts         图床 URL 工具函数
    logo-geometry.ts logo 里静态的部分：星球笔触（也是字母 R）和签名 S，从 logo.svg 提取
  layouts/
    BaseLayout.astro     <head>、主题、页眉页脚、机器人
    ProjectLayout.astro  项目页模板：标题 + 图签信息栏 + 封面 + 正文 + 翻页
  components/
    content/         项目页积木：Section / Figure / Figures / Steps / Stats / Cards / Card / Embed / Timeline / BeforeAfter
    AsciiLogo.astro      首页和 404 的 ASCII logo：文字环绕着星球实时旋转
    Chatbot.astro        AI 助手（marked + DOMPurify 首次打开时才加载）
    …
  scripts/
    stable-fluids.js     StableShape 页的 WebGL2 流体模拟
    chat-engine.ts       机器人的提示词构建与请求
  styles/
    tokens.css       设计 tokens：颜色、字体、字号、间距、动效
    global.css       基础样式和少量通用类
  pages/             一个文件 = 一个页面，路径与旧站完全一致
public/              原样发布：PDF、zip、favicon、botdata.json
scripts/
  publish.sh         在本机构建并发布到服务器（日常用这个）
  deploy.sh          在服务器上构建并替换（需要服务器有 Node）
archive/             旧站里没被任何页面引用的原图，不参与构建
```

## 新增一个项目

1. 在 `src/data/projects.ts` 里加一条（标题、副标题、封面、图签信息、链接）。首页卡片、编号、上一个/下一个会自动更新。
2. 新建 `src/pages/projects/<code|design>/<Name>.astro`，用 `ProjectLayout` 包住内容，正文用 `Section`、`Figure` 等组件拼。章节号和图号（Fig. 01…）由 CSS 计数器自动生成。
3. 本地图片放 `src/assets/`，构建时会自动转 WebP 并生成多尺寸；图床图片可以把宽高登记到 `image-sizes.json`。

## 部署（robinsong.top：Ubuntu + nginx）

nginx 直接托管服务器上仓库 `/home/ubuntu/myhomepage` 里的 `dist/`，站点配置在 `/etc/nginx/sites-available/myhomepage`（2026-10-01 从 React 版切换过来，切换前的配置备份为 `myhomepage.bak-20261001-react`，React 版文件仍在 `/home/ubuntu/myhomepage-react/`）。

### 日常更新（在本机执行）

服务器没有装 Node、内存也紧，所以在本机构建再上传：

```bash
./scripts/publish.sh
```

脚本只发布干净且最新的 `main`：构建、上传到服务器的临时目录后整体替换 `dist/`（更新时网站不会空白）、同步服务器上的仓库；`botdata.json` 变了会自动重启聊天服务。上一版保留在服务器的 `.dist-prev/`，回滚：在服务器上 `cd /home/ubuntu/myhomepage && mv dist .dist-bad && mv .dist-prev dist`。

以后如果服务器装了 Node ≥ 22.12，也可以直接在服务器上运行 `./scripts/deploy.sh`。

### AI 聊天

- 页面请求同域名的 `/api/chat`，nginx 把 `/api/` 转发给本机 8801 端口的 `portfolio-chat.service`（代码在 `/home/ubuntu/myhomepage-bridge/chat_api.py`）。
- 系统提示词由服务器根据仓库里的 `public/files/botdata.json` 生成，浏览器只发送对话内容。访客不需要访问密钥（`config.json` 里 `"require_access_key": false`），每个 IP 每天最多 50 条，另有按分钟的限速。
- 网站专用的 DeepSeek Key 写在 `/home/ubuntu/myhomepage-bridge/chat.env` 的 `CHAT_API_KEY=` 后面（文件权限 600），然后 `sudo systemctl restart portfolio-chat`。留空时沿用 `~/.hermes/.env` 里的 Key。

### nginx 配置要点

重新搭建时参考（完整配置以服务器上的文件为准）：

```nginx
root /home/ubuntu/myhomepage/dist;
index index.html;
error_page 404 /404.html;

# certbot 用 webroot 方式把验证文件写在仓库根目录，不在 dist/ 里
location ^~ /.well-known/acme-challenge/ { root /home/ubuntu/myhomepage; }

# 网站 AI 聊天
location ^~ /api/ { proxy_pass http://127.0.0.1:8801; }

# 带哈希的构建产物可以长期缓存
location ^~ /_astro/ { expires 1y; add_header Cache-Control "public, immutable"; }

# 多页静态站：先找文件，再找同名 .html（/about → about.html），都没有就 404。
# 不要用单页应用那种回退到 /index.html 的写法。
location / { try_files $uri $uri.html $uri/ =404; add_header Cache-Control "no-cache"; }
```

所有旧链接（`/about.html`、`/projects/code/StableShape.html` …）都保持可用，React 版用过的 `/projects/code/stable-shape` 这类地址会 301 跳到对应页面。
