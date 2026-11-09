import { useCallback } from 'react'
import { className } from '@/utils/classNames'
import { usePop, type PopPlacement, type PopTrigger } from '@/hooks/usePop'

/**
 * Popover 气泡卡片：带标题与内容区域，click 触发，可承载交互内容
 */

export interface PopoverProps {
  /** 标题 */
  title?: React.ReactNode
  /** 内容 */
  content: React.ReactNode
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
  className?: string
  popupClassName?: string
  popupStyle?: React.CSSProperties
  /** 点击外部是否关闭 */
  clickOutsideClosable?: boolean
  offset?: number
}

export function Popover({
  title,
  content,
  placement = 'top',
  trigger = 'click',
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
  children,
  className: cls,
  popupClassName,
  popupStyle,
  offset
}: PopoverProps) {
  const pop = usePop({
    open,
    defaultOpen,
    onOpenChange,
    trigger,
    placement,
    offset,
    disabled
  })

  const keepOpen = useCallback(() => pop.setOpen(true), [pop])
  const allowClose = useCallback(() => pop.setOpen(false), [pop])

  return (
    <span className={className('sofa-pop-wrapper', 'sofa-popover-wrapper', cls)}>
      <span ref={pop.anchorRef} className="sofa-pop-anchor" {...pop.events}>
        {children}
      </span>
      {pop.open && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-popover', popupClassName)}
          style={{ visibility: 'hidden', ...popupStyle }}
          role="dialog"
          onMouseEnter={keepOpen}
          onMouseLeave={trigger === 'hover' ? allowClose : undefined}
        >
          <div ref={pop.arrowRef} className="sofa-popup-arrow" />
          {title != null && <div className="sofa-popover-title">{title}</div>}
          <div className="sofa-popover-content">{content}</div>
        </div>
      )}
    </span>
  )
}

export interface PopconfirmProps extends Omit<PopoverProps, 'content' | 'title'> {
  /** 确认提示文案 */
  title: React.ReactNode
  /** 描述内容（可选） */
  description?: React.ReactNode
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认回调 */
  onConfirm?: (e: React.MouseEvent) => void
  /** 取消回调 */
  onCancel?: (e: React.MouseEvent) => void
  /** 确认按钮加载态 */
  okLoading?: boolean
  /** 危险确认（按钮为红色） */
  danger?: boolean
}

/**
 * Popconfirm 气泡确认框：二次确认操作（自管打开状态，按钮点击后关闭）
 */
export function Popconfirm({
  title,
  description,
  okText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  okLoading = false,
  danger = false,
  placement = 'top',
  trigger = 'click',
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  offset,
}: PopconfirmProps) {
  const pop = usePop({
    open: openProp,
    defaultOpen,
    onOpenChange,
    trigger,
    placement,
    offset,
    disabled: false
  })

  const keepOpen = useCallback(() => pop.setOpen(true), [pop])

  const close = useCallback(() => pop.setOpen(false), [pop])

  const handleConfirm = useCallback(
    (e: React.MouseEvent) => {
      onConfirm?.(e)
      close()
    },
    [onConfirm, close]
  )

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      onCancel?.(e)
      close()
    },
    [onCancel, close]
  )

  return (
    <span className={className('sofa-pop-wrapper', 'sofa-popconfirm-wrapper')}>
      <span ref={pop.anchorRef} className="sofa-pop-anchor" {...pop.events}>
        {children}
      </span>
      {pop.open && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-popover', 'sofa-popconfirm-popup')}
          style={{ visibility: 'hidden' }}
          role="dialog"
          onMouseEnter={keepOpen}
          onMouseLeave={trigger === 'hover' ? close : undefined}
        >
          <div ref={pop.arrowRef} className="sofa-popup-arrow" />
          <div className="sofa-popconfirm">
            <div className="sofa-popconfirm-title">{title}</div>
            {description != null && (
              <div className="sofa-popconfirm-description">{description}</div>
            )}
            <div className="sofa-popconfirm-actions">
              <button type="button" className="sofa-btn sofa-btn-default sofa-btn-sm" onClick={handleCancel}>
                {cancelText}
              </button>
              <button
                type="button"
                className={className(
                  'sofa-btn',
                  'sofa-btn-sm',
                  'sofa-btn-primary',
                  danger && 'sofa-btn-danger',
                  okLoading && 'sofa-btn-loading'
                )}
                onClick={handleConfirm}
              >
                {okText}
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  )
}

export default Popover