import { useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { className } from '@/utils/classNames'
import { Icon, type IconType } from '../icon/icon'

/**
 * Notification 通知提醒：
 * 右上角滑入的通知卡片，支持标题 + 描述 + 自定义图标，可手动 / 自动关闭
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationOptions {
  /** 标题 */
  title: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 展示时长（毫秒），0 为不自动关闭 */
  duration?: number
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 关闭回调 */
  onClose?: () => void
  /** 定位 */
  placement?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'
  /** 显示关闭按钮 */
  closable?: boolean
  /** 底部操作区 */
  footer?: React.ReactNode
}

interface NotificationItem extends NotificationOptions {
  id: number
  type: NotificationType
  leaving?: boolean
}

const TYPE_ICON: Record<NotificationType, IconType> = {
  success: 'check-circle',
  error: 'error-circle',
  warning: 'warning-triangle',
  info: 'info-circle'
}

let notificationContainer: HTMLDivElement | null = null
let notificationRoot: Root | null = null
let notificationId = 0
let items: NotificationItem[] = []
let placement: NotificationItem['placement'] = 'topRight'

function ensureContainer(): HTMLDivElement {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div')
    document.body.appendChild(notificationContainer)
    notificationRoot = createRoot(notificationContainer)
    notificationRoot.render(<NotificationList />)
  }
  return notificationContainer
}

function NotificationList() {
  const [, force] = useState(0)
  /** 通知项移除：播放退出动画后真正卸载 */
  const dismiss = (id: number, immediate = false) => {
    if (immediate) {
      items = items.filter((n) => n.id !== id)
    } else {
      items = items.map((n) => (n.id === id ? { ...n, leaving: true } : n))
      force((c) => c + 1)
      setTimeout(() => {
        items = items.filter((n) => n.id !== id)
        force((c) => c + 1)
        if (items.length === 0) destroy()
      }, 220)
    }
    force((c) => c + 1)
  }

  return (
    <div className={className('sofa-notification-container', `sofa-notification-${placement}`)}>
      {items.map((item) => {
        const target = items.find((n) => n.id === item.id)
        return (
          <div
            key={item.id}
            className={className(
              'sofa-notification',
              `sofa-notification-${item.type}`,
              target?.leaving && 'sofa-notification-leaving'
            )}
            role="alert"
          >
            <span className="sofa-notification-icon">
              {item.icon ?? <Icon type={TYPE_ICON[item.type]} size={20} />}
            </span>
            <div className="sofa-notification-main">
              <div className="sofa-notification-title">{item.title}</div>
              {item.description != null && (
                <div className="sofa-notification-description">{item.description}</div>
              )}
              {item.footer != null && (
                <div className="sofa-notification-footer">{item.footer}</div>
              )}
            </div>
            {item.closable !== false && (
              <button
                type="button"
                className="sofa-notification-close"
                aria-label="关闭通知"
                onClick={() => dismiss(item.id)}
              >
                <Icon type="close" size={13} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** 全部通知关闭后卸载容器 */
function destroy() {
  notificationRoot?.unmount()
  notificationContainer?.remove()
  notificationContainer = null
  notificationRoot = null
}

function show(type: NotificationType, options: NotificationOptions): void {
  const { duration = 4500, placement: p = 'topRight', onClose, ...rest } = options
  placement = p
  const id = ++notificationId
  // 最新通知排在最上方
  items.unshift({ id, type, ...rest })
  ensureContainer()
  if (duration > 0) {
    setTimeout(() => {
      const item = items.find((n) => n.id === id)
      if (item) {
        item.leaving = true
        setTimeout(() => {
          items = items.filter((n) => n.id !== id)
          onClose?.()
          if (items.length === 0) destroy()
          else notificationRoot?.render(<NotificationList />)
        }, 220)
        notificationRoot?.render(<NotificationList />)
      }
    }, duration)
  }
}

export const notification = {
  success: (options: NotificationOptions) => show('success', options),
  error: (options: NotificationOptions) => show('error', options),
  warning: (options: NotificationOptions) => show('warning', options),
  info: (options: NotificationOptions) => show('info', options),
  /** 清空全部通知 */
  destroy
}

export default notification