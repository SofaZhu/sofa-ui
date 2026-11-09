# Sofa UI

一款开源的 **React 组件库**。

[在线演示（GitHub Pages）](https://sofazhu.github.io/sofa-ui/) · [在线 API 总文档](https://sofazhu.github.io/sofa-ui/#api)

**核心设计理念：「单一主色 · 全色系自动调配」**

- 主色默认 `#8A2BE2`（蓝紫），其余所有默认色调——色阶、悬浮态、按下态、浅背景、边框——均由主色经颜色算法自动调配生成
- **所有颜色都可以通过配置更换**：CSS 变量覆盖 / 运行时 JS API / 构建期令牌生成，三种方式任选

## 特性

- 🎨 **动态换肤**：`setPrimaryColor()` 一行代码更换主色，全组件色彩联动；内置暗色模式
- 🧩 **组件语义清晰**：各组件提供常用 API 与受控/非受控双模式
- 🔤 全 TypeScript 编写，类型完整，支持受控/非受控双模式
- 📦 ESM / CJS / UMD 三格式产物 + 按需样式
- 🦄 零运行时依赖（仅 peer 依赖 React）

## 安装

```bash
npm install sofa-ui
# 或 pnpm add sofa-ui / yarn add sofa-ui
```

## 快速开始

```tsx
import { Button, setPrimaryColor } from 'sofa-ui'
import 'sofa-ui/theme.css'   // 设计令牌（默认主色 #8A2BE2）
import 'sofa-ui/styles.css'  // 全量组件样式
// 或暗色模式：import 'sofa-ui/dark.css'

// 改变主色，全站联动（hover/active/背景/边框都会重新调配）
setPrimaryColor('#1677FF')

function App() {
  return <Button type="primary">Hello Sofa UI</Button>
}
```

### 三种配色方式

| 方式 | 用法 | 适用场景 |
| --- | --- | --- |
| CSS 变量 | `:root { --sofa-color-primary: #13C2C2 }` | 静态站点，覆盖一处全局生效 |
| 运行时 API | `setPrimaryColor('#EB2F96')` / `setTheme({...})` / `setDarkMode(true)` | 需要交互式换肤的应用 |
| 令牌生成 | `generateThemeTokens({ primaryColor })` → 注入任意 CSS 变量表 | SSR / 构建期静态化 |

## 命令

```bash
npm install        # 安装依赖
npm run build:watch # 监听组件库代码变更
npm run docs       # 仅启动文档站（Vite，含主题配置器演示）
npm run build      # 构建库产物（ESM/CJS/UMD + 类型 + CSS）
npm test           # 单元测试（Vitest）
npm run typecheck  # 类型检查
```

文档站启动后访问 `http://localhost:5173`：右上角可直接切换主色与明暗模式，实时观察全组件色彩联动。

## 组件文档

[API 索引](docs/api/README.md)按主题与通用、布局、导航、数据录入、浮层与反馈、数据展示分类。每份模块文档包含包根导入示例、运行时方法、属性、回调类型和默认值。在线演示中可直接展开各模块下的 API 文档，也可从在线总文档按分类查看。

## 演示站发布

演示站使用 GitHub Pages。首次启用时，在[仓库 Pages 设置](https://github.com/SofaZhu/sofa-ui/settings/pages)中将发布来源设为 **GitHub Actions**。发布流程会在更新 `main` 后构建并部署，也可以从 Actions 页面手动运行「发布演示站到 GitHub Pages」。

## 设计令牌

默认令牌由 `src/theme/tokens.ts` 生成，核心结构：

```text
--sofa-color-primary               主色（默认 #8A2BE2）
--sofa-color-primary-1 ~ 10        十级色阶（1 浅 → 10 深）
--sofa-color-primary-hover/active  悬浮 / 按下
--sofa-color-{success|warning|error|info}(-bg/-border/-text)
--sofa-text-*  --sofa-border-*  --sofa-bg-*  --sofa-fill-*
--sofa-radius-*  --sofa-shadow-*  --sofa-font-size-*
```

暗色模式通过 `html[data-theme="dark"]` 切换，色阶与语义色使用 `color-mix()` 跟随主色动态派生。

## 目录结构

```text
src/
  ├── theme/        主题系统：颜色算法、令牌生成、运行时换肤 API
  ├── components/   组件源码（每组件一个目录）
  ├── hooks/        usePop 弹层定位 / useControlled 等
  ├── styles/       组件样式（纯 CSS + 变量，构建时合并）
  └── index.ts      库入口
docs/               文档站点（Vite + React，演示主题配置器）
scripts/copy-css.mjs  样式构建脚本
tests/              单元测试（Vitest）
```

## License

MIT