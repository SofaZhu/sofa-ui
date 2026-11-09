import { useLayoutEffect, useState, useSyncExternalStore } from 'react'
import { setPrimaryColor, setDarkMode, generateColorPalette } from 'sofa-ui'
import { Home } from './pages/Home'
import { General } from './pages/General'
import { Entry } from './pages/Entry'
import { Overlay } from './pages/Overlay'
import { Display } from './pages/Display'
import { ApiDetails, ApiPage } from './api/api-reference'

/**
 * 演示用代码展示块
 */
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="demo-code">
      <code>{code}</code>
    </pre>
  )
}

/**
 * 演示区块容器：标题 + 说明 + 内容 + 可选代码
 */
export function Demo({
  title,
  desc,
  code,
  api,
  children
}: {
  title: string
  desc?: string
  code?: string
  api?: string | readonly string[]
  children: React.ReactNode
}) {
  const [showCode, setShowCode] = useState(false)
  const apiIds = typeof api === 'string' ? [api] : api
  return (
    <section className="demo-section">
      <h3 className="demo-title">{title}</h3>
      {desc && <p className="demo-desc">{desc}</p>}
      <div className="demo-body">{children}</div>
      {code && (
        <>
          <button type="button" className="demo-toggle" onClick={() => setShowCode(!showCode)}>
            {showCode ? '收起代码' : '查看代码'}
          </button>
          {showCode && <CodeBlock code={code} />}
        </>
      )}
      {apiIds?.map((id) => <ApiDetails key={id} id={id} />)}
    </section>
  )
}

const NAV = [
  { key: 'home', label: '首页 · 主题系统' },
  { key: 'general', label: '通用' },
  { key: 'entry', label: '数据录入' },
  { key: 'overlay', label: '浮层与反馈' },
  { key: 'display', label: '数据展示' },
  { key: 'api', label: 'API 总文档' }
]

const PRESET_COLORS = ['#8A2BE2', '#1677FF', '#13C2C2', '#52C41A', '#FA8C16', '#EB2F96', '#000000']

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function readHash() {
  return window.location.hash
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, readHash)
  const [route, module] = hash.slice(1).split('/')
  const page = NAV.some((item) => item.key === route) ? route : 'home'

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [page, module])
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark')
  const [primary, setPrimary] = useState('#8A2BE2')

  const palette = generateColorPalette(primary)

  const switchPrimary = (color: string) => {
    setPrimary(color)
    setPrimaryColor(color)
  }

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    setDarkMode(next)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo" style={{ background: 'var(--sofa-color-primary)' }}>
            S
          </span>
          <span>
            <strong>Sofa UI</strong>
            <span className="app-sub">全色彩可配置的 React 组件库</span>
          </span>
        </div>
        <div className="app-theme">
          <span className="app-theme-label">主色</span>
          <div className="app-theme-presets">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className="app-theme-dot"
                style={{ background: c }}
                aria-pressed={primary.toLowerCase() === c.toLowerCase()}
                onClick={() => switchPrimary(c)}
                aria-label={`切换主色 ${c}`}
              />
            ))}
          </div>
          <label className="app-theme-custom">
            自定义
            <input
              type="color"
              value={primary}
              onChange={(e) => switchPrimary(e.target.value)}
            />
          </label>
          <button type="button" className="app-dark-toggle" onClick={toggleDark}>
            {dark ? '🌙 暗色' : '☀️ 亮色'}
          </button>
        </div>
      </header>

      <div className="app-main">
        <aside className="app-nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className="app-nav-item"
              data-active={page === item.key}
              aria-current={page === item.key ? 'page' : undefined}
              onClick={() => { window.location.hash = item.key }}
            >
              {item.label}
            </button>
          ))}
          <div className="app-nav-palette">
            <div className="app-nav-palette-title">主色色阶</div>
            {palette.map((c, i) => (
              <div key={i} className="app-nav-palette-row">
                <span className="app-nav-palette-name">{i + 1}</span>
                <span className="app-nav-palette-bar" style={{ background: c }} />
                <span className="app-nav-palette-hex">{c}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="app-content">
          {page === 'home' && <Home primary={primary} onQuickStart={() => { window.location.hash = 'entry' }} />}
          {page === 'general' && <General />}
          {page === 'entry' && <Entry />}
          {page === 'overlay' && <Overlay />}
          {page === 'display' && <Display />}
          {page === 'api' && <ApiPage id={module} />}
        </main>
      </div>
    </div>
  )
}