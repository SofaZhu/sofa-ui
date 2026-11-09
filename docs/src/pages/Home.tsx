import { generateColorPalette, generateThemeTokens } from 'sofa-ui'
import { Demo } from '../App'

const CODE_USAGE = `import { setPrimaryColor, setDarkMode, setTheme } from 'sofa-ui'
import 'sofa-ui/theme.css'
import 'sofa-ui/styles.css'

// 一行代码更换主色，全组件色彩联动
setPrimaryColor('#1677FF')

// 暗色模式
setDarkMode(true)

// 完整配置：语义色 / 中性色均可单独定制
setTheme({
  primaryColor: '#8A2BE2',
  semanticColors: { success: '#00B578' },
  neutralColors: { textPrimary: '#1D2129' }
})`

/** 展示当前主色及主题配置示例。 */
export function Home({ primary, onQuickStart }: { primary: string; onQuickStart?: () => void }) {
  const palette = generateColorPalette(primary)
  const tokens = generateThemeTokens({ primaryColor: primary })
  const semantic = [
    { key: 'success', label: '成功' },
    { key: 'warning', label: '警告' },
    { key: 'error', label: '危险' },
    { key: 'info', label: '信息' }
  ] as const

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Sofa UI</h1>
        <p>
          一款开源 React 组件库，
          以「单一主色 + 自动调配」为核心：全部默认色调由主色
          <code className="home-code">#8A2BE2</code> 派生，任何颜色都可配置更换。
        </p>
        <div className="home-hero-actions">
          <button type="button" className="sofa-btn sofa-btn-primary sofa-btn-lg" onClick={onQuickStart}>
            ⚡ 快速开始
          </button>
          <a
            className="sofa-btn sofa-btn-default sofa-btn-lg"
            href="https://github.com/SofaZhu/sofa-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>

      <Demo
        title="色板：单一主色，十级色阶"
        desc="色阶算法：1~5 号为浅背景/悬浮态，6 号即主色，7~10 号为按下态/强调色。更换主色后整板联动。"
      >
        <div className="palette">
          {palette.map((color, i) => (
            <div key={i} className="palette-item">
              <div className="palette-block" style={{ background: color }} />
              <span>{i + 1}</span>
              <code>{color}</code>
            </div>
          ))}
        </div>
      </Demo>

      <Demo
        title="语义色：默认独立，可配置覆盖"
        desc="成功/警告/危险/信息四种语义色遵循行业惯例独立配色，同样支持自定义替换。"
      >
        <div className="semantic-grid">
          {semantic.map((s) => (
            <div key={s.key} className="semantic-item">
              <div className="semantic-block" style={{ background: tokens[`--sofa-color-${s.key}`] }} />
              <div className="semantic-row" style={{ background: tokens[`--sofa-color-${s.key}-bg`] }}>
                {s.label}浅背景
              </div>
              <div className="semantic-row" style={{ background: tokens[`--sofa-color-${s.key}-border`] }}>
                {s.label}边框
              </div>
              <code>{tokens[`--sofa-color-${s.key}`]}</code>
            </div>
          ))}
        </div>
      </Demo>

      <Demo
        title="三种配色方式"
        desc="① CSS 变量覆盖（--sofa-color-primary 一处修改全局联动，其余色调由 color-mix 自动派生）；② 运行时 JS API；③ 构建时令牌生成。"
        code={CODE_USAGE}
      >
        <div className="usage">
          <div className="usage-item">
            <strong>方式一 · CSS 变量</strong>
            <pre><code>{`:root { --sofa-color-primary: #13C2C2; }`}</code></pre>
            <span className="usage-note">覆盖主色即全局生效（hover/背景/边框均为 color-mix 派生）</span>
          </div>
          <div className="usage-item">
            <strong>方式二 · 运行时 API</strong>
            <pre><code>{`setPrimaryColor('#EB2F96')`}</code></pre>
            <span className="usage-note">页面顶部右上角「主色」选择器即为此能力</span>
          </div>
          <div className="usage-item">
            <strong>方式三 · 令牌生成</strong>
            <pre><code>{`generateThemeTokens({ primaryColor: '#8A2BE2' })
// → { '--sofa-color-primary-1': ... , hover: ..., active: ... }`}</code></pre>
            <span className="usage-note">服务端渲染 / 构建期静态化场景使用</span>
          </div>
        </div>
      </Demo>
    </div>
  )
}

export function TypeRef() {
  return <></>
}