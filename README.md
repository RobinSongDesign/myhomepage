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
scripts/deploy.sh    服务器上的一键部署
archive/             旧站里没被任何页面引用的原图，不参与构建
```

## 新增一个项目

1. 在 `src/data/projects.ts` 里加一条（标题、副标题、封面、图签信息、链接）。首页卡片、编号、上一个/下一个会自动更新。
2. 新建 `src/pages/projects/<code|design>/<Name>.astro`，用 `ProjectLayout` 包住内容，正文用 `Section`、`Figure` 等组件拼。章节号和图号（Fig. 01…）由 CSS 计数器自动生成。
3. 本地图片放 `src/assets/`，构建时会自动转 WebP 并生成多尺寸；图床图片可以把宽高登记到 `image-sizes.json`。

## 部署（Ubuntu + nginx，在 SSH 终端里操作）

nginx 直接托管仓库里的 `dist/`。下面假设服务器上的仓库就是网站目录 `/www/wwwroot/robinsong.top`，路径按实际情况替换。

### 日常更新

```bash
cd /www/wwwroot/robinsong.top && ./scripts/deploy.sh
```

脚本会拉取最新代码、安装依赖，先构建到临时目录再整体替换 `dist/`，更新时网站不会出现空白。上一版保留在 `.dist-prev/`，出问题时回滚：`mv dist .dist-bad && mv .dist-prev dist`。

### 第一次切换（只做一次）

1. **Node ≥ 22.12**：先用 `node -v` 看版本。不够的话装 nvm（不影响系统自带的 Node）：

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
   ```

   重新打开终端，执行 `nvm install 24`。之后部署脚本会按 `.nvmrc` 自动切到 Node 24。

2. **改好 nginx 配置，先不生效**。找到站点配置文件：

   ```bash
   sudo nginx -T 2>/dev/null | grep -nE "configuration file|server_name|root"
   ```

   在 robinsong.top 的 `server { … }` 里把 `root` 改到 `dist`，并补上下面几行：

   ```nginx
   root /www/wwwroot/robinsong.top/dist;
   index index.html;
   error_page 404 /404.html;

   # 证书续期的验证文件写在仓库根目录，不在 dist/ 里（已有同类 location 就保留原来的）
   location ^~ /.well-known/acme-challenge/ {
       root /www/wwwroot/robinsong.top;
   }

   # /_astro/ 下的文件名带哈希，可以长期缓存
   location ^~ /_astro/ {
       expires 1y;
   }
   ```

3. **拉取、构建、生效**，一条命令完成：

   ```bash
   git pull && ./scripts/deploy.sh && sudo nginx -t && sudo systemctl reload nginx
   ```

   `git pull` 会删掉仓库根目录的旧页面，所以从拉取到 reload 之间网站会有一两分钟打不开。切换之后 nginx 只对外提供 `dist/`，仓库里的 `.git/`、`src/`、`node_modules/` 也不会再被公开访问。

也可以不在服务器上装 Node：本地 `npm run build`，再把 `dist/` 上传到服务器的同一位置（在 VS Code 的远程资源管理器里直接拖进去即可）。

所有旧链接（`/about.html`、`/projects/code/StableShape.html` …）在新站里保持不变。
