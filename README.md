My homepage for portfolio and blogs — [robinsong.top](https://robinsong.top)

用 [Astro](https://astro.build) 生成的纯静态站点：写的是组件和数据，产出的是普通 HTML/CSS/JS，任何静态服务器（包括现在的宝塔 nginx）都能直接托管。

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
  layouts/
    BaseLayout.astro     <head>、主题、页眉页脚、机器人
    ProjectLayout.astro  项目页模板：标题 + 图签信息栏 + 封面 + 正文 + 翻页
  components/
    content/         项目页积木：Section / Figure / Figures / Steps / Stats / Cards / Card / Embed / Timeline / BeforeAfter
    FieldCanvas.astro    首页和 404 的实时矢量场
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
archive/             旧站里没被任何页面引用的原图，不参与构建
```

## 新增一个项目

1. 在 `src/data/projects.ts` 里加一条（标题、副标题、封面、图签信息、链接）。首页卡片、编号、上一个/下一个会自动更新。
2. 新建 `src/pages/projects/<code|design>/<Name>.astro`，用 `ProjectLayout` 包住内容，正文用 `Section`、`Figure` 等组件拼。章节号和图号（Fig. 01…）由 CSS 计数器自动生成。
3. 本地图片放 `src/assets/`，构建时会自动转 WebP 并生成多尺寸；图床图片可以把宽高登记到 `image-sizes.json`。

## 部署（宝塔面板）

构建产物在 `dist/`，二选一：

- **在服务器上构建**：`git pull && npm ci && npm run build`，并把站点的「运行目录」设为 `/dist`。
- **本地构建后上传**：本地 `npm run build`，把 `dist/` 里的内容上传或 `rsync` 到 `/www/wwwroot/robinsong.top/`。

所有旧链接（`/about.html`、`/projects/code/StableShape.html` …）在新站里保持不变。
