/** 轻量 className 合并工具，避免引入额外依赖 */
type ClassValue = string | number | null | undefined | false | Record<string, boolean | null | undefined>

export function className(...values: ClassValue[]): string {
  const result: string[] = []
  values.forEach((value) => {
    if (!value) return
    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, active]) => {
        if (active) result.push(key)
      })
    } else {
      result.push(String(value))
    }
  })
  return result.join(' ')
}

export { className as cx }