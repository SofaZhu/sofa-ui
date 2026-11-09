import { useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { className } from '@/utils/classNames'
import { Icon, type IconType } from '../icon/icon'

/**
 * Message 全局消息提示：
 * 命令式调用 message.success / error / warning / info / loading
 * 单例容器挂载到 body，支持自动关闭与手动关闭
 */

export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface MessageOptions {
  /** 展示时长（毫秒），0 为不自动关闭 */
  duration?: number
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 关闭回调 */
  onClose?: () => void
  /** 位置 */
  position?: 'top' | 'topLeft' | 'topRight' | 'bottom'
  /** 可关闭 */
  closable?: boolean
}

interface MessageItem extends MessageOptions {
  id: number
  type: MessageType
  content: React.ReactNode
}

const TYPE_ICON: Record<MessageType, IconType> = {
  success: 'check-circle',
  error: 'error-circle',
  warning: 'warning-triangle',
  info: 'info-circle',
  loading: 'loading'
}

let messageContainer: HTMLDivElement | null = null
let messageRoot: Root | null = null
let messageId = 0
/** 待渲染队列：createRoot 懒初始化前暂存 */
let pendingItems: MessageItem[] = []

/** 确保单例容器与根节点存在 */
function ensureContainer(): HTMLDivElement {
  if (!messageContainer) {
    messageContainer = document.createElement('div')
    messageContainer.className = 'sofa-message-container'
    document.body.appendChild(messageContainer)
    messageRoot = createRoot(messageContainer)
    messageRoot.render(<MessageList items={pendingItems} />)
    pendingItems = []
  }
  return messageContainer
}

/** 渲染消息列表的根组件（由模块级单例持有状态） */
function MessageList({ items }: { items: MessageItem[] }) {
  return (
    <div className="sofa-message-host">
      {items.map((item) => (
        <MessageView key={item.id} item={item} />
      ))}
    </div>
  )
}

/** 单条消息视图：自动关闭由宿主管理 */
function MessageView({ item }: { item: MessageItem }) {
  const [exiting, setExiting] = useState(false)
  return (
    <div className={className('sofa-message', `sofa-message-${item.type}`, exiting && 'sofa-message-exit')}>
      {item.icon ?? (
        <span className="sofa-message-icon">
          <Icon type={TYPE_ICON[item.type]} size={16} spin={item.type === 'loading'} />
        </span>
      )}
      <span className="sofa-message-content">{item.content}</span>
      {item.closable && (
        <button
          type="button"
          className="sofa-message-close"
          aria-label="关闭消息"
          onClick={() => {
            setExiting(true)
            setTimeout(() => removeMessage(item.id), 200)
          }}
        >
          <Icon type="close" size={12} />
        </button>
      )}
    </div>
  )
}

/** 从单例列表中移除消息（容器未初始化时从待渲染队列移除） */
function removeMessage(id: number) {
  if (messageRoot) {
    const container = messageContainer
    if (!container) return
    items = items.filter((m) => m.id !== id)
    messageRoot.render(<MessageList items={items} />)
    if (items.length === 0) {
      // 全部关闭后清空容器，避免堆积
      messageRoot.unmount()
      container.remove()
      messageContainer = null
      messageRoot = null
    }
  } else {
    pendingItems = pendingItems.filter((m) => m.id !== id)
  }
}

let items: MessageItem[] = []

/** 核心：生成一条消息并启动自动关闭计时 */
function show(type: MessageType, content: React.ReactNode, options: MessageOptions = {}): () => void {
  const { duration = 3000, onClose, position = 'top' } = options
  const id = ++messageId
  const item: MessageItem = { id, type, content, duration, onClose, position, closable: options.closable }
  // 最新消息排在最上方，多条从上到下排列
  items.unshift(item)

  const container = ensureContainer()
  container.className = className('sofa-message-container', `sofa-message-container-${position}`)
  messageRoot?.render(<MessageList items={items} />)

  if (duration > 0) {
    setTimeout(() => removeMessage(id), duration)
  }
  return () => removeMessage(id)
}

export const message = {
  success: (content: React.ReactNode, options?: MessageOptions) => show('success', content, options),
  error: (content: React.ReactNode, options?: MessageOptions) => show('error', content, options),
  warning: (content: React.ReactNode, options?: MessageOptions) => show('warning', content, options),
  info: (content: React.ReactNode, options?: MessageOptions) => show('info', content, options),
  loading: (content: React.ReactNode, options?: MessageOptions) => show('loading', content, options),
  /** 手动关闭某条消息 */
  close: (closeFn: () => void) => closeFn()
}

export default message