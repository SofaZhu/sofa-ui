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

type NotificationPlacement = NonNullable<NotificationOptions['placement']>

interface NotificationItem extends NotificationOptions {
  id: number
  type: NotificationType
  placement: NotificationPlacement
  leaving?: boolean
  timer?: ReturnType<typeof setTimeout>
}

const TYPE_ICON: Record<NotificationType, IconType> = {
  success: 'check-circle',
  error: 'error-circle',
  warning: 'warning-triangle',
  info: 'info-circle'
}

const PLACEMENTS: NotificationPlacement[] = ['topRight', 'topLeft', 'bottomRight', 'bottomLeft']
const EXIT_DURATION = 220
const items = new Map<number, NotificationItem>()

let notificationContainer: HTMLDivElement | null = null
let notificationRoot: Root | null = null
let notificationId = 0

function renderNotifications() {
  if (!notificationRoot) {
    notificationContainer = document.createElement('div')
    document.body.appendChild(notificationContainer)
    notificationRoot = createRoot(notificationContainer)
  }

  // 每次新增或关闭都提交独立快照，连续调用时以最后一次提交为准。
  notificationRoot.render(<NotificationList items={Array.from(items.values()).reverse()} />)
}

function dismiss(id: number) {
  const item = items.get(id)
  if (!item || item.leaving) return

  clearTimeout(item.timer)
  const timer = setTimeout(() => {
    items.delete(id)
    if (items.size === 0) destroy()
    else renderNotifications()
    item.onClose?.()
  }, EXIT_DURATION)

  items.set(id, { ...item, leaving: true, timer })
  renderNotifications()
}

function NotificationList({ items }: { items: NotificationItem[] }) {
  return PLACEMENTS.map((placement) => {
    const stack = items.filter((item) => item.placement === placement)
    if (stack.length === 0) return null

    return (
      <div key={placement} className={className('sofa-notification-container', `sofa-notification-${placement}`)}>
        {stack.map((item) => (
          <div
            key={item.id}
            className={className(
              'sofa-notification',
              `sofa-notification-${item.type}`,
              item.leaving && 'sofa-notification-leaving'
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
                disabled={item.leaving}
                onClick={() => dismiss(item.id)}
              >
                <Icon type="close" size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    )
  })
}

/** 清空通知并取消所有未执行的自动关闭及退出计时。 */
function destroy() {
  items.forEach((item) => clearTimeout(item.timer))
  items.clear()
  notificationRoot?.unmount()
  notificationContainer?.remove()
  notificationContainer = null
  notificationRoot = null
}

function show(type: NotificationType, options: NotificationOptions): void {
  const { duration = 4500, placement = 'topRight', ...rest } = options
  const id = ++notificationId
  const timer = duration > 0 ? setTimeout(() => dismiss(id), duration) : undefined
  items.set(id, { ...rest, id, type, placement, timer })
  renderNotifications()
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