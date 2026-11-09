import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Modal 对话框：
 * 支持遮罩、键盘关闭、确定按钮加载态、自定义富文本标题与底部
 * 同时提供命令式 confirm 方法
 */

export interface ModalProps {
  /** 打开状态 */
  open?: boolean
  /** 默认打开 */
  defaultOpen?: boolean
  /** 打开 / 关闭回调 */
  onOpenChange?: (open: boolean) => void
  /** 标题 */
  title?: React.ReactNode
  /** 富文本页头（替代 title） */
  header?: React.ReactNode
  /** 内容 */
  children?: React.ReactNode
  /** 自定义底部 */
  footer?: React.ReactNode | null
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认回调（返回 Promise 时可等待后关闭） */
  onOk?: () => void | Promise<void>
  /** 取消 / 关闭回调 */
  onCancel?: () => void
  /** 确认按钮加载态 */
  confirmLoading?: boolean
  /** 宽度 */
  width?: number | string
  /** 点击遮罩关闭 */
  maskClosable?: boolean
  /** 显示关闭按钮 */
  closable?: boolean
  /** 打开时是否锁定页面滚动 */
  lockScroll?: boolean
  /** 对话框类名 */
  className?: string
  /** 对话框样式 */
  style?: React.CSSProperties
  /** 关闭后销毁内容 */
  destroyOnClose?: boolean
}

export function Modal({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  header,
  children,
  footer,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  confirmLoading = false,
  width = 520,
  maskClosable = true,
  closable = true,
  lockScroll = true,
  className: cls,
  style,
  destroyOnClose = false
}: ModalProps) {
  void destroyOnClose
  const isControlled = open !== undefined
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const resolvedOpen = isControlled ? open ?? false : innerOpen
  const [rendered, setRendered] = useState(resolvedOpen)
  const [visible, setVisible] = useState(false)

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInnerOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  // 打开 / 关闭的动画两段式渲染：先挂载（进入动画），关闭时延迟卸载
  useLayoutEffect(() => {
    if (resolvedOpen) {
      setRendered(true)
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    setVisible(false)
    if (lockScroll) {
      const t = setTimeout(() => {
        setRendered(false)
      }, 220)
      return () => clearTimeout(t)
    }
    setRendered(false)
  }, [resolvedOpen, lockScroll])

  // 打开时锁定滚动
  useEffect(() => {
    if (!resolvedOpen || !rendered || !lockScroll) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [resolvedOpen, rendered, lockScroll])

  // ESC 关闭
  useEffect(() => {
    if (!resolvedOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        onCancel?.()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [resolvedOpen, onCancel, setOpen])

  if (!rendered) return null
  if (typeof document === 'undefined') return null

  const handleOk = async () => {
    await onOk?.()
    if (confirmLoading) return
    setOpen(false)
  }

  return createPortal(
    <div className={className('sofa-modal-root', { 'sofa-modal-visible': visible })}>
      <div
        className="sofa-modal-mask"
        onClick={() => maskClosable && (setOpen(false), onCancel?.())}
      />
      <div className="sofa-modal-wrap">
        <div
          role="dialog"
          aria-modal="true"
          className={className('sofa-modal', cls)}
          style={{ width, ...style }}
        >
          {closable && (
            <button
              type="button"
              className="sofa-modal-close"
              aria-label="关闭对话框"
              onClick={() => {
                setOpen(false)
                onCancel?.()
              }}
            >
              <Icon type="close" size={16} />
            </button>
          )}
          {(header !== undefined || title != null) && (
            <div className="sofa-modal-header">{header ?? title}</div>
          )}
          <div className="sofa-modal-body">{children}</div>
          {footer !== null && footer !== undefined && (
            <div className="sofa-modal-footer">{footer}</div>
          )}
          {footer === undefined && (
            <div className="sofa-modal-footer">
              <button
                type="button"
                className="sofa-btn sofa-btn-default"
                onClick={() => {
                  setOpen(false)
                  onCancel?.()
                }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={className('sofa-btn sofa-btn-primary', confirmLoading && 'sofa-btn-loading')}
                onClick={handleOk}
              >
                {okText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

/**
 * Modal.confirm 命令式确认框（复用 Modal 渲染到 body）
 */
export interface ConfirmOptions {
  title?: React.ReactNode
  content?: React.ReactNode
  okText?: string
  cancelText?: string
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  type?: 'confirm' | 'warning' | 'error' | 'info'
  width?: number
}

const CONFIRM_ICONS = {
  confirm: 'warning' as const,
  warning: 'warning-triangle' as const,
  error: 'error-circle' as const,
  info: 'info-circle' as const
}

export function confirm(options: ConfirmOptions): void {
  const { type = 'confirm', ...rest } = options
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRootInstance()

  /** 关闭并清理挂载点 */
  const close = () => {
    root.unmount(container, () => container.remove())
  }

  root.render(
    container,
    <Modal
      defaultOpen
      width={rest.width ?? 420}
      onOpenChange={(o) => {
        if (!o) {
          close()
          rest.onCancel?.()
        }
      }}
      footer={
        <>
          <button
            type="button"
            className="sofa-btn sofa-btn-default"
            onClick={() => {
              close()
              rest.onCancel?.()
            }}
          >
            {rest.cancelText ?? '取消'}
          </button>
          <button
            type="button"
            className="sofa-btn sofa-btn-primary"
            onClick={async () => {
              await rest.onOk?.()
              close()
            }}
          >
            {rest.okText ?? '确定'}
          </button>
        </>
      }
    >
      <div className={className('sofa-modal-confirm', `sofa-modal-confirm-${type}`)}>
        {type !== 'confirm' && (
          <span className="sofa-modal-confirm-icon">
            <Icon type={CONFIRM_ICONS[type]} size={22} />
          </span>
        )}
        <div className="sofa-modal-confirm-body">
          {rest.title != null && <div className="sofa-modal-confirm-title">{rest.title}</div>}
          {rest.content != null && <div className="sofa-modal-confirm-content">{rest.content}</div>}
        </div>
      </div>
    </Modal>
  )
}

/** 弹层式渲染单例：命令式弹层统一挂载到 document.body */
let globalRootMap: Map<HTMLElement, Root> | null = null

function ensureRoot(container: HTMLElement): Root {
  if (!globalRootMap) {
    globalRootMap = new Map()
  }
  let root = globalRootMap.get(container)
  if (!root) {
    root = createRoot(container)
    globalRootMap.set(container, root)
  }
  return root
}

export function createRootInstance() {
  return {
    render(container: HTMLElement, node: React.ReactNode) {
      ensureRoot(container).render(node)
    },
    unmount(container: HTMLElement, after?: () => void) {
      const root = globalRootMap?.get(container)
      root?.unmount()
      globalRootMap?.delete(container)
      after?.()
    }
  }
}

export default Modal