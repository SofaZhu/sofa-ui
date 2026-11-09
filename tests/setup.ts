import '@testing-library/jest-dom/vitest'

// jsdom 缺少 PointerEvent，补一个继承 MouseEvent 的最小实现（fireEvent.pointer* 依赖）
if (typeof window.PointerEvent !== 'function') {
  class JsdomPointerEvent extends MouseEvent {
    pointerId: number
    constructor(type: string, init?: MouseEventInit & { pointerId?: number }) {
      super(type, init)
      this.pointerId = init?.pointerId ?? 0
    }
  }
  Object.assign(window, { PointerEvent: JsdomPointerEvent })
}