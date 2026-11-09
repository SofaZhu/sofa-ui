import { forwardRef } from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Tag 标签
 * 支持预设语义色、自定义颜色与暗色模式下的自动适配
 */

export type TagColor = 'primary' | 'success' | 'warning' | 'error' | 'info'

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 标签颜色：预设语义色或任意十六进制色值 */
  color?: TagColor | string
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭时的回调 */
  onClose?: (e: React.MouseEvent<HTMLSpanElement>) => void
  /** 关闭图标的替换内容 */
  closeIcon?: React.ReactNode
  /** 是否显示边框 */
  bordered?: boolean
  /** 标签尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 可勾选模式 */
  checkable?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** 点击回调 */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
}

const PRESET_COLORS: TagColor[] = ['primary', 'success', 'warning', 'error', 'info']

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    color = 'primary',
    closable = false,
    onClose,
    closeIcon,
    bordered = true,
    size = 'default',
    checkable = false,
    checked = false,
    onCheckedChange,
    children,
    className: cls,
    style,
    onClick,
    ...rest
  },
  ref
) {
  const isPreset = PRESET_COLORS.includes(color as TagColor)
  const isCustomColor = !isPreset
  const customStyle =
    isCustomColor && color
      ? {
          backgroundColor: `${color}1a`,
          color,
          borderColor: `${color}A8`
        }
      : undefined

  const handleClose = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    onClose?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (checkable) onCheckedChange?.(!checked)
    onClick?.(e)
  }

  return (
    <span
      ref={ref}
      className={className(
        'sofa-tag',
        `sofa-tag-${isPreset ? color : 'custom'}`,
        {
          'sofa-tag-bordered': bordered,
          'sofa-tag-closable': closable,
          [size === 'small' ? 'sofa-tag-sm' : 'sofa-tag-lg']: size !== 'default',
          'sofa-tag-checked': checkable && checked,
          'sofa-tag-checkable': checkable
        },
        cls
      )}
      style={{ ...customStyle, ...style }}
      onClick={handleClick}
      {...rest}
    >
      {children}
      {closable && (
        <span
          role="button"
          aria-label="关闭标签"
          className="sofa-tag-close"
          onClick={handleClose}
        >
          {closeIcon ?? <Icon type="close" size={10} />}
        </span>
      )}
    </span>
  )
})

export default Tag