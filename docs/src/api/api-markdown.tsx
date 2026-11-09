import Markdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { apiTitles, getApiHref } from './catalog'

const documents = import.meta.glob<string>('../../api/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const REPOSITORY = 'https://github.com/SofaZhu/sofa-ui'
const MARKDOWN_PLUGINS = [remarkGfm]

function resolveLink(url: string): string {
  const doc = /^(README|[a-z0-9-]+)\.md$/.exec(url)?.[1]
  if (doc && (doc === 'README' || apiTitles.has(doc))) return getApiHref(doc)

  const source = url.match(/^\.\.\/\.\.\/(src\/[\w./-]+)$/)?.[1]
  if (source) {
    const route = /\.tsx?$/.test(source) ? 'blob' : 'tree'
    return `${REPOSITORY}/${route}/main/${source}`
  }

  return defaultUrlTransform(url)
}

/** 渲染仓库中的 API 原文，保留 GFM 表格与代码块。 */
export default function ApiMarkdown({ id, inline }: { id: string; inline: boolean }) {
  return (
    <div className="api-markdown">
      <Markdown
        remarkPlugins={MARKDOWN_PLUGINS}
        urlTransform={resolveLink}
        components={{
          h1: inline ? 'h4' : 'h1',
          h2: inline ? 'h5' : 'h2',
          h3: inline ? 'h6' : 'h3',
          table: ({ children }) => (
            <div className="api-table-scroll" tabIndex={0} role="region" aria-label="API 属性表">
              <table>{children}</table>
            </div>
          )
        }}
      >
        {documents[`../../api/${id}.md`]}
      </Markdown>
    </div>
  )
}
