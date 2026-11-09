import { lazy, Suspense, useState } from 'react'
import { apiIndexHref, apiTitles, getApiHref } from './catalog'

const ApiMarkdown = lazy(() => import('./api-markdown'))

function ReferenceBody({ id, inline = false }: { id: string; inline?: boolean }) {
  return (
    <Suspense fallback={<p className="api-loading" role="status">正在加载 API 文档…</p>}>
      <ApiMarkdown id={id} inline={inline} />
    </Suspense>
  )
}

/** 在演示区块下默认折叠，展开后显示完整文档。 */
export function ApiDetails({ id }: { id: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <details className="api-details" onToggle={(event) => setExpanded(event.currentTarget.open)}>
      <summary>{apiTitles.get(id)} API 文档</summary>
      {expanded && (
        <div className="api-details-body">
          <a className="api-standalone-link" href={getApiHref(id)}>独立查看</a>
          <ReferenceBody id={id} inline />
        </div>
      )}
    </details>
  )
}

/** 为已有 API 文档的模块提供可展开入口。 */
export function MoreApi({ ids }: { ids: readonly string[] }) {
  return (
    <section className="demo-section">
      <h3 className="demo-title">更多模块 API</h3>
      {ids.map((id) => <ApiDetails key={id} id={id} />)}
    </section>
  )
}

/** 使用同一文档渲染总索引和模块直达页。 */
export function ApiPage({ id }: { id?: string }) {
  if (id && !apiTitles.has(id)) {
    return (
      <section className="demo-section api-page">
        <h1>未找到该模块</h1>
        <p><a href={apiIndexHref}>返回 API 总文档</a></p>
      </section>
    )
  }

  return (
    <article className="demo-section api-page">
      <ReferenceBody id={id ?? 'README'} />
    </article>
  )
}
