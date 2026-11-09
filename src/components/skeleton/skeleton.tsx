import { className } from '@/utils/classNames'

/**
 * Skeleton 骨架屏：
 * 加载占位组件，支持标题、段落、头像、图片占位与流光动画；
 * loading 为 false 时直接渲染子内容
 */

export interface SkeletonTitleProps {
  /** 标题宽度 */
  width?: number | string
}

export interface SkeletonParagraphProps {
  /** 段落行数 */
  rows?: number
  /** 段落宽度：单值或逐行宽度数组 */
  width?: number | string | Array<number | string>
}

export interface SkeletonAvatarProps {
  /** 头像尺寸 */
  size?: number | 'small' | 'default' | 'large'
  /** 头像形状 */
  shape?: 'circle' | 'square'
}

export interface SkeletonImageProps {
  /** 图片占位尺寸 */
  size?: number | 'small' | 'default' | 'large'
  /** 图片形状 */
  shape?: 'circle' | 'square'
}

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** false 时渲染 children 替代骨架 */
  loading?: boolean
  /** 开启流光动画 */
  active?: boolean
  /** 标题占位：布尔或配置对象 */
  title?: boolean | SkeletonTitleProps
  /** 段落占位：布尔或配置对象 */
  paragraph?: boolean | SkeletonParagraphProps
  /** 头像占位：布尔或配置对象 */
  avatar?: boolean | SkeletonAvatarProps
  /** 图片占位：布尔或配置对象 */
  image?: boolean | SkeletonImageProps
  /** 子内容（loading 为 false 时展示） */
  children?: React.ReactNode
}

const AVATAR_SIZE = {
  small: 32,
  default: 40,
  large: 48
} as const

function resolveSize(size: number | string | undefined, fallback: number): number {
  if (typeof size === 'number') return size
  if (size && size in AVATAR_SIZE) return AVATAR_SIZE[size as keyof typeof AVATAR_SIZE]
  return fallback
}

export function Skeleton({
  loading = true,
  active = false,
  title = true,
  paragraph = { rows: 3 },
  avatar = false,
  image = false,
  className: cls,
  style,
  children,
  ...rest
}: SkeletonProps) {
  if (!loading && children != null) {
    return <>{children}</>
  }

  const titleOpts = typeof title === 'object' ? title : {}
  const paragraphOpts =
    typeof paragraph === 'object'
      ? paragraph
      : typeof paragraph === 'number'
        ? { rows: paragraph }
        : {}
  const avatarOpts = typeof avatar === 'object' ? avatar : {}
  const imageOpts = typeof image === 'object' ? image : {}

  const titleOn = title !== false
  const paragraphOn = paragraph !== false
  const avatarOn = avatar !== false
  const imageOn = image !== false

  const rows = paragraphOn ? paragraphOpts.rows ?? 3 : 0
  const widths = Array.isArray(paragraphOpts.width) ? paragraphOpts.width : []
  const lastWidth = Array.isArray(paragraphOpts.width)
    ? undefined
    : paragraphOpts.width

  return (
    <div
      className={className('sofa-skeleton', { 'sofa-skeleton-active': active }, cls)}
      style={style}
      {...rest}
      aria-hidden="true"
    >
      {avatarOn && (
        <div
          className={className(
            'sofa-skeleton-avatar',
            `sofa-skeleton-avatar-${avatarOpts.shape ?? 'circle'}`
          )}
          style={{ width: resolveSize(avatarOpts.size, 40), height: resolveSize(avatarOpts.size, 40) }}
        />
      )}
      {imageOn && (
        <div
          className={className('sofa-skeleton-image', `sofa-skeleton-image-${imageOpts.shape ?? 'square'}`)}
          style={{ width: resolveSize(imageOpts.size, 80), height: resolveSize(imageOpts.size, 80) }}
        />
      )}
      <div className="sofa-skeleton-body">
        {titleOn && (
          <div
            className="sofa-skeleton-title"
            style={titleOpts.width ? { width: titleOpts.width } : undefined}
          />
        )}
        {paragraphOn && (
          <div className="sofa-skeleton-paragraph">
            {Array.from({ length: rows }, (_, i) => {
              const isLast = i === rows - 1
              const width = isLast && widths.length > 0 ? widths[i] : widths[i] ?? (isLast ? lastWidth ?? '60%' : undefined)
              return (
                <div
                  key={i}
                  className="sofa-skeleton-line"
                  style={width ? { width } : undefined}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Skeleton