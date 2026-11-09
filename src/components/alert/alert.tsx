import { useCallback, useState } from 'react'
import { className } from '@/utils/classNames'
import { Icon, type IconType } from '../icon/icon'

/**
 * Alert 警告提示：
 * 四种语义类型 + 标题/描述 + 可关闭 + 居中展示
 */

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 标题 */
  title?: React.ReactNode
  /** 描述内容 */
  description?: React.ReactNode
  /** 语义类型 */
  type?: AlertType
  /** 显示图标 */
  showIcon?: boolean
  /** 可关闭 */
  closable?: boolean
  /** 自定义关闭图标 */
  closeIcon?: React.ReactNode
  /** 关闭回调 */
  onClose?: (e: React.MouseEvent) => void
  /** 内容居中 */
  center?: boolean
  /** 通栏模式（去掉圆角） */
  banner?: boolean
}

const ALERT_ICONS: Record<AlertType, IconType> = {
  success: 'check-circle',
  info: 'info-circle',
  warning: 'warning-triangle',
  error: 'error-circle'
}

export function Alert({
  title,
  description,
  type = 'info',
  showIcon = false,
  closable = false,
  closeIcon,
  onClose,
  center = false,
  banner = false,
  children,
  className: cls,
  style,
  ...rest
}: AlertProps) {
  const [closed, setClosed] = useState(false)

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      setClosed(true)
      onClose?.(e)
    },
    [onClose]
  )

  if (closed) return null

  return (
    <div
      role={type === 'error' ? 'alert' : undefined}
      className={className(
        'sofa-alert',
        `sofa-alert-${type}`,
        {
          'sofa-alert-center': center,
          'sofa-alert-banner': banner,
          'sofa-alert-with-icon': showIcon,
          'sofa-alert-description': description != null
        },
        cls
      )}
      style={style}
      {...rest}
    >
      {showIcon && (
        <span className="sofa-alert-icon">
          <Icon type={ALERT_ICONS[type]} size={description ? 20 : 16} />
        </span>
      )}
      <div className="sofa-alert-body">
        {title != null && <div className="sofa-alert-title">{title}</div>}
        {description != null && <div className="sofa-alert-description">{description}</div>}
        {children}
      </div>
      {closable && (
        <button
          type="button"
          className="sofa-alert-close"
          aria-label="关闭警告"
          onClick={handleClose}
        >
          {closeIcon ?? <Icon type="close" size={12} />}
        </button>
      )}
    </div>
  )
}

export default Alert