import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useControlled, useLatest } from './useControlled'

/**
 * 弹层定位 hook，服务 Tooltip / Popover / Popconfirm / Select 下拉等浮层组件：
 * - 支持 12 个方向（四方位 + 八个斜向）
 * - 打开时测量锚点与浮层尺寸，贴近视口边缘时自动翻转
 * - 支持 hover（含进出延时）/ click / focus 三种触发方式
 * - 点击外部、ESC 关闭
 */

export type PopPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'

export type PopTrigger = 'hover' | 'click' | 'focus'

export interface UsePopOptions {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: PopTrigger
  placement?: PopPlacement
  /** 弹层与锚点间距 */
  offset?: number
  /** 弹层最小宽度占锚点宽度的比例（下拉类用 1） */
  widthRatio?: number
  /** hover 进入 / 离开的延时（毫秒） */
  hoverDelayIn?: number
  hoverDelayOut?: number
  disabled?: boolean
}

export interface PopReturn {
  open: boolean
  setOpen: (open: boolean) => void
  anchorRef: React.RefObject<HTMLSpanElement>
  popRef: React.RefObject<HTMLDivElement>
  arrowRef: React.RefObject<HTMLDivElement>
  placement: PopPlacement
  events: Record<string, unknown>
  resetPosition: () => void
}

const OPPOSITE_SIDE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
} as const

type PopSide = keyof typeof OPPOSITE_SIDE

export function usePop(options: UsePopOptions = {}): PopReturn {
  const {
    trigger = 'hover',
    placement: propPlacement = 'top',
    offset: propOffset = 8,
    widthRatio = 0,
    hoverDelayIn = 120,
    hoverDelayOut = 100,
    disabled = false
  } = options

  const [open, setOpenInner] = useControlled(options.open, options.defaultOpen ?? false)
  const [placement, setPlacement] = useState<PopPlacement>(propPlacement)
  const latestOpen = useLatest(open)

  const anchorRef = useRef<HTMLSpanElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const inTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const outTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) return
      // 无论触发方式，先取消挂起的开/关定时器，避免 hover 过渡期闪关
      if (next) {
        if (outTimerRef.current) clearTimeout(outTimerRef.current)
        outTimerRef.current = null
      } else {
        if (inTimerRef.current) clearTimeout(inTimerRef.current)
        inTimerRef.current = null
      }
      setOpenInner(next)
      options.onOpenChange?.(next)
    },
    [disabled, options.onOpenChange, setOpenInner]
  )
  const latestSetOpen = useLatest(setOpen)

  const scheduleOpen = useCallback(
    (delay: number) => {
      clearTimeout(outTimerRef.current ?? undefined)
      inTimerRef.current = setTimeout(() => latestSetOpen.current(true), delay)
    },
    [latestSetOpen]
  )

  const scheduleClose = useCallback(
    (delay: number) => {
      clearTimeout(inTimerRef.current ?? undefined)
      outTimerRef.current = setTimeout(() => latestSetOpen.current(false), delay)
    },
    [latestSetOpen]
  )

  /** 计算并设置弹层位置（含视口边缘翻转） */
  const resetPosition = useCallback(() => {
    const anchor = anchorRef.current
    const pop = popRef.current
    if (!anchor || !pop) return
    const anchorRect = anchor.getBoundingClientRect()
    const main = (propPlacement.match(/^(top|bottom|left|right)/) ?? ['bottom'])[0] as PopSide
    const alignment = propPlacement.slice(main.length)
    const vertical = main === 'top' || main === 'bottom'
    const padding = 8
    const gap = propOffset
    if (widthRatio > 0) pop.style.width = `${anchorRect.width * widthRatio}px`

    const { width, height } = pop.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const space = {
      top: anchorRect.top,
      bottom: viewportHeight - anchorRect.bottom,
      left: anchorRect.left,
      right: viewportWidth - anchorRect.right
    }
    const opposite = OPPOSITE_SIDE[main]
    const requiredSpace = (vertical ? height : width) + gap + padding
    const side = space[main] < requiredSpace && space[opposite] > space[main] ? opposite : main
    const positions = {
      top: anchorRect.top - height - gap,
      bottom: anchorRect.bottom + gap,
      left: anchorRect.left - width - gap,
      right: anchorRect.right + gap
    }

    const remaining = vertical ? anchorRect.width - width : anchorRect.height - height
    const alignStart = alignment === 'Left' || alignment === 'Top'
    const crossOffset = !alignment ? remaining / 2 : alignStart ? 0 : remaining
    const clamp = (value: number, limit: number) => Math.max(padding, Math.min(value, limit - padding))
    const left = clamp(vertical ? anchorRect.left + crossOffset : positions[side], viewportWidth - width)
    const top = clamp(vertical ? positions[side] : anchorRect.top + crossOffset, viewportHeight - height)

    setPlacement(`${side}${alignment}` as PopPlacement)
    pop.style.left = `${left}px`
    pop.style.top = `${top}px`
    pop.dataset.side = side

    const arrow = arrowRef.current
    if (arrow) {
      const crossCenter = vertical
        ? anchorRect.left + anchorRect.width / 2 - left
        : anchorRect.top + anchorRect.height / 2 - top
      const offset = clamp(crossCenter, vertical ? width : height) - 6
      arrow.style.left = vertical ? `${offset}px` : ''
      arrow.style.top = vertical ? '' : `${offset}px`
    }
    pop.style.visibility = 'visible'
  }, [propPlacement, propOffset, widthRatio])

  // 打开时定位 + 每次渲染后重新应用位置（React 重写 style 会覆盖内联定位，需回写）
  useLayoutEffect(() => {
    if (!open) return
    resetPosition()
  })

  // 窗口变化 / 滚动时重新定位
  useLayoutEffect(() => {
    if (!open) return
    window.addEventListener('resize', resetPosition)
    window.addEventListener('scroll', resetPosition, true)
    return () => {
      window.removeEventListener('resize', resetPosition)
      window.removeEventListener('scroll', resetPosition, true)
    }
  }, [open, resetPosition])

  // 点击外部关闭 + ESC 关闭
  useEffect(() => {
    if (!open || trigger !== 'click') return
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (!anchorRef.current?.contains(target) && !popRef.current?.contains(target)) {
        latestSetOpen.current(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') latestSetOpen.current(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, trigger, latestSetOpen])

  // 卸载时清理定时器
  useEffect(
    () => () => {
      clearTimers(inTimerRef, outTimerRef)
    },
    []
  )

  const events: Record<string, unknown> =
    trigger === 'hover'
      ? {
          onMouseEnter: () => scheduleOpen(hoverDelayIn),
          onMouseLeave: () => scheduleClose(hoverDelayOut),
          onFocus: () => scheduleOpen(0),
          onBlur: () => scheduleClose(hoverDelayOut)
        }
      : trigger === 'click'
        ? {
            onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
            onClick: () => latestSetOpen.current(!latestOpen.current)
          }
        : {
            onFocus: () => scheduleOpen(0),
            onBlur: () => scheduleClose(0)
          }

  return {
    open,
    setOpen,
    anchorRef,
    popRef,
    arrowRef,
    placement,
    events,
    resetPosition
  }
}

function clearTimers(...refs: Array<React.MutableRefObject<ReturnType<typeof setTimeout> | null>>) {
  refs.forEach((ref) => {
    if (ref.current) clearTimeout(ref.current)
    ref.current = null
  })
}

export type { UsePopOptions as PopProps }