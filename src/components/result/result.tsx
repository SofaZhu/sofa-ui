import { className } from '@/utils/classNames'
import { Icon, IconType } from '../icon/icon'

/**
 * Result 结果页：
 * 用于操作反馈与异常场景（成功/错误/警告/信息及 404/403/500），
 * 支持自定义图标与底部操作区
 */

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'

export interface ResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 状态（默认 info） */
  status?: ResultStatus
  /** 标题 */
  title?: React.ReactNode
  /** 副标题 */
  subTitle?: React.ReactNode
  /** 自定义图标（覆盖默认图标） */
  icon?: React.ReactNode
  /** 底部操作区 */
  extra?: React.ReactNode
}

const STATUS_ICON: Record<Exclude<ResultStatus, '404' | '403' | '500'>, { type: IconType; cls: string }> = {
  success: { type: 'check-circle', cls: 'sofa-result-success' },
  error: { type: 'close-circle', cls: 'sofa-result-error' },
  info: { type: 'info-circle', cls: 'sofa-result-info' },
  warning: { type: 'warning-triangle', cls: 'sofa-result-warning' }
}

/** 异常状态码对应图标与叠加数字 */
const STATUS_CODE_ICON: Record<'404' | '403' | '500', { type: IconType; code: string }> = {
  '404': { type: 'warning-triangle', code: '404' },
  '403': { type: 'close-circle', code: '403' },
  '500': { type: 'error-circle', code: '500' }
}

export function Result({
  status = 'info',
  title,
  subTitle,
  icon,
  extra,
  className: cls,
  style,
  ...rest
}: ResultProps) {
  const isCodeStatus = status === '404' || status === '403' || status === '500'

  return (
    <div
      className={className(
        'sofa-result',
        isCodeStatus ? `sofa-result-code` : STATUS_ICON[status].cls,
        cls
      )}
      style={style}
      {...rest}
    >
      <div className="sofa-result-icon-wrap">
        {icon ?? (
          <>
            <Icon
              type={isCodeStatus ? STATUS_CODE_ICON[status].type : STATUS_ICON[status].type}
              size={72}
              className="sofa-result-icon"
              aria-hidden="true"
            />
            {isCodeStatus && (
              <span className="sofa-result-code-text" aria-hidden="true">
                {STATUS_CODE_ICON[status].code}
              </span>
            )}
          </>
        )}
      </div>
      {title != null && <div className="sofa-result-title">{title}</div>}
      {subTitle != null && <div className="sofa-result-subtitle">{subTitle}</div>}
      {extra != null && <div className="sofa-result-extra">{extra}</div>}
    </div>
  )
}

export default Result