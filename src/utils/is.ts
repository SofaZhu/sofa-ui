/** 判断是否为合法的 React 元素 */
export function isReactElement(node: React.ReactNode): boolean {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in (node as object) &&
    'props' in (node as object)
  )
}

/** 简单的节流函数 */
export function throttle<T extends (...args: never[]) => void>(fn: T, wait: number): T {
  let last = 0
  return ((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn(...args)
    }
  }) as T
}

/** 简单的防抖函数 */
export function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  const wrapped = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
  wrapped.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }
  return wrapped
}