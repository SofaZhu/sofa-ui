import index from '../../api/README.md?raw'

/** 从总文档读取模块名称，避免演示页另行维护标题。 */
export const apiTitles = new Map(
  Array.from(index.matchAll(/^- \[([^\]]+)\]\(([a-z0-9-]+)\.md\)$/gm), ([, title, id]) => [id, title])
)

export const apiIndexHref = '#api'

export function getApiHref(id: string): string {
  return id === 'README' ? apiIndexHref : `#api/${id}`
}
