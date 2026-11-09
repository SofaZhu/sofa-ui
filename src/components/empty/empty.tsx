import { className } from '@/utils/classNames'

/**
 * Empty 空状态：无数据时的占位提示
 */

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 描述文案 */
  description?: React.ReactNode
  /** 自定义插图 */
  image?: React.ReactNode
  /** 底部操作区 */
  children?: React.ReactNode
}

export function Empty({
  description = '暂无数据',
  image,
  children,
  className: cls,
  style,
  ...rest
}: EmptyProps) {
  return (
    <div className={className('sofa-empty', cls)} style={style} {...rest}>
      <div className="sofa-empty-image">
        {image ?? (
          <svg viewBox="0 0 64 41" width={64} height={41} fill="none" aria-hidden="true">
            <ellipse cx="32" cy="33" rx="26" ry="7" fill="var(--sofa-fill-color)" />
            <path
              d="M55 12.5H9a2 2 0 0 0-2 2V32a2 2 0 0 0 2 2h46a2 2 0 0 0 2-2V14.5a2 2 0 0 0-2-2z"
              fill="var(--sofa-bg-container)"
              stroke="var(--sofa-border-color)"
            />
            <path
              d="M7 14.5L32 26l25-11.5"
              stroke="var(--sofa-border-color)"
            />
            <circle cx="32" cy="14.5" r="6.5" fill="var(--sofa-color-primary-1)" stroke="var(--sofa-color-primary-4)" />
            <circle cx="32" cy="14.5" r="3" fill="var(--sofa-color-primary)" />
          </svg>
        )}
      </div>
      {description != null && <div className="sofa-empty-description">{description}</div>}
      {children != null && <div className="sofa-empty-footer">{children}</div>}
    </div>
  )
}

export default Empty