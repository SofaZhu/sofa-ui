import { Children, cloneElement, isValidElement, useCallback, useEffect, useState } from 'react'
import { className } from '@/utils/classNames'

/**
 * Avatar 头像：
 * 尺寸/形状 + 图片加载失败回退 + 文字缩略 + 图标
 * Avatar.Group 横向叠放，超出 maxCount 折叠为 +N
 */

export type AvatarSize = number | 'small' | 'default' | 'large'

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 尺寸：数字像素或预设档位 */
  size?: AvatarSize
  /** 形状 */
  shape?: 'circle' | 'square'
  /** 图片地址 */
  src?: string
  /** 图片 srcSet */
  srcSet?: string
  /** 图标（无图片或加载失败时展示） */
  icon?: React.ReactNode
  /** 文字内容（字符串时缩略为前 2 字） */
  children?: React.ReactNode
  /** 图片 alt */
  alt?: string
  /** 加载失败回退内容（优先于 icon/children） */
  fallback?: React.ReactNode
}

const SIZE_MAP: Record<'small' | 'default' | 'large', number> = {
  small: 24,
  default: 32,
  large: 40
}

/** 图片加载失败时回退到图标/文字 */
export function Avatar({
  size = 'default',
  shape = 'circle',
  src,
  srcSet,
  icon,
  children,
  alt = '',
  fallback,
  className: cls,
  style,
  ...rest
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  // 图源变化时重置错误状态
  useEffect(() => {
    setImgError(false)
  }, [src, srcSet])

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size]

  const handleError = useCallback(() => {
    setImgError(true)
  }, [])

  const hasImage = src != null && src !== '' && !imgError

  const renderContent = (): React.ReactNode => {
    if (hasImage) {
      return (
        <img
          className="sofa-image-avatar"
          src={src}
          srcSet={srcSet}
          alt={alt}
          draggable={false}
          onError={handleError}
        />
      )
    }
    if (fallback != null) return <span className="sofa-avatar-fallback">{fallback}</span>
    if (icon != null) return <span className="sofa-avatar-icon">{icon}</span>
    if (children == null) return null
    if (typeof children === 'string') {
      return <span className="sofa-avatar-text">{children.slice(0, 2)}</span>
    }
    return children
  }

  return (
    <span
      className={className(
        'sofa-avatar',
        shape === 'circle' ? 'sofa-avatar-circle' : 'sofa-avatar-square',
        cls
      )}
      style={{ width: pixelSize, height: pixelSize, fontSize: pixelSize * 0.4, ...style }}
      {...rest}
    >
      {renderContent()}
    </span>
  )
}

export interface AvatarGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 最大显示数量，超出折叠为 +N */
  maxCount?: number
  /** 默认尺寸（子头像未指定时生效） */
  size?: AvatarSize
  /** 默认形状（子头像未指定时生效） */
  shape?: 'circle' | 'square'
  children?: React.ReactNode
}

/**
 * Avatar.Group 头像组：横向叠放，超出折叠
 */
export function AvatarGroup({
  maxCount = 5,
  size,
  shape,
  children,
  className: cls,
  style,
  ...rest
}: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter((c) => isValidElement(c))
  const visible = maxCount > 0 ? avatars.slice(0, maxCount) : []
  const restCount = avatars.length - visible.length

  return (
    <div className={className('sofa-avatar-group', cls)} style={style} {...rest}>
      {visible.map((child, index) =>
        isValidElement<Partial<AvatarProps>>(child)
          ? cloneElement(child, {
              key: index,
              size: child.props.size ?? size,
              shape: child.props.shape ?? shape,
              className: className(child.props.className, 'sofa-avatar-group-item')
            })
          : child
      )}
      {restCount > 0 && (
        <Avatar size={size} shape={shape} className="sofa-avatar-group-item sofa-avatar-group-rest">
          +{restCount}
        </Avatar>
      )}
    </div>
  )
}

/** 组合导出：Avatar.Group 挂载在默认导出上 */
const AvatarWithGroup = Object.assign(Avatar, { Group: AvatarGroup })

export default AvatarWithGroup