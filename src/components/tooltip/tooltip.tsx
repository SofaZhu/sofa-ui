import { cloneElement, forwardRef, isValidElement, useCallback, useId } from 'react'
import { className } from '@/utils/classNames'
import { usePop, type PopPlacement, type PopTrigger } from '@/hooks/usePop'

/**
 * Tooltip 文字提示：hover 显示轻量气泡，含箭头与 12 方向定位
 */

export interface TooltipProps {
  /** 提示内容 */
  title: React.ReactNode
  /** 气泡方向 */
  placement?: PopPlacement
  /** 触发方式 */
  trigger?: PopTrigger
  /** 受控打开 */
  open?: boolean
  /** 默认打开 */
  defaultOpen?: boolean
  /** 打开变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 禁用 */
  disabled?: boolean
  /** 包裹内容 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 气泡类名 */
  popupClassName?: string
  /** 气泡样式 */
  popupStyle?: React.CSSProperties
  /** 间距 */
  offset?: number
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    title,
    placement = 'top',
    trigger = 'hover',
    open,
    defaultOpen,
    onOpenChange,
    disabled = false,
    children,
    className: cls,
    popupClassName,
    popupStyle,
    offset
  },
  ref
) {
  const tooltipId = useId()
  const pop = usePop({
    open,
    defaultOpen,
    onOpenChange,
    trigger,
    placement,
    offset,
    disabled
  })

  // 浮层自身也维持 hover 状态，避免鼠标移动间隙导致气泡闪关
  const keepOpen = useCallback(() => pop.setOpen(true), [pop])
  const allowClose = useCallback(() => pop.setOpen(false), [pop])
  const describedChild = pop.open && title != null && isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ')
      })
    : children

  return (
    <span
      ref={ref}
      className={className('sofa-pop-wrapper', 'sofa-tooltip-wrapper', cls)}
    >
      <span
        ref={pop.anchorRef}
        className="sofa-pop-anchor"
        {...pop.events}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && pop.open && trigger !== 'click') allowClose()
        }}
      >
        {describedChild}
      </span>
      {pop.open && title != null && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-tooltip', popupClassName)}
          style={{ visibility: 'hidden', ...popupStyle }}
          id={tooltipId}
          role="tooltip"
          onMouseEnter={trigger === 'hover' ? keepOpen : undefined}
          onMouseLeave={trigger === 'hover' ? allowClose : undefined}
        >
          <div ref={pop.arrowRef} className="sofa-popup-arrow" />
          <div className="sofa-tooltip-content">{title}</div>
        </div>
      )}
    </span>
  )
})

export default Tooltip