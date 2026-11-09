# Sofa UI

一款开源的 **React 组件库**。

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

## 组件清单

### 已实现（v0.1）

| 分类 | 组件 |
| --- | --- |
| 通用 | Button（5 类型 + 波纹）、Icon、Tag（可关闭/可勾选）、Space、Divider |
| 布局 | Row / Col（24 栅格 + 6 断点响应式） |
| 数据录入 | Input（前缀后缀/清空/计数）、Textarea（autosize）、Select（单选/多选/搜索）、Checkbox/Group（半选/全选）、Radio/Group（按钮形态）、Switch（文案/加载）、Slider（范围/刻度）、Rate（半星） |
| 数据展示 | Badge（角标/状态点）、Alert、Tabs（line/card/可关闭）、Card、Breadcrumb、Pagination（跳页/每页条数）、Progress（直线/圆环/仪表盘）、Spin、Empty |
| 浮层与反馈 | Tooltip（12 方向自动翻转）、Popover、Popconfirm、Modal（含命令式 confirm）、Message（5 类型）、Notification |

### 规划中（后续版本）

| 分类 | 组件 |
| --- | --- |
| 数据录入 | DatePicker / TimePicker（日历面板）、Cascader、TreeSelect、Transfer、Upload（拖拽/多文件）、AutoComplete、Mentions、Form（校验/布局）、ColorPicker |
| 数据展示 | Table（排序/筛选/固定列）、Tree（选择/拖拽）、Calendar、Carousel、Collapse、Descriptions、List、Statistic、Timeline、Skeleton、Avatar、Image（预览）、Result |
| 导航 | Menu（横向/纵向/折叠）、Steps、Dropdown、Affix（固定）、Anchor（锚点）、BackTop（返回顶部） |
| 布局 | Layout（Header/Aside/Footer）、Container |
| 通用 | Typography（标题/段落/文本）、Segmented、QRCode |

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