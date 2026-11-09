import { className } from '@/utils/classNames'

/**
 * Descriptions 描述列表：
 * 用网格展示键值对信息，支持边框、分栏、标题与垂直布局
 */

export interface DescriptionsItem {
  /** 唯一键 */
  key: string
  /** 字段名 */
  label: React.ReactNode
  /** 字段值 */
  children: React.ReactNode
  /** 占据的列数 */
  span?: number
}

export interface DescriptionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 条目列表 */
  items: DescriptionsItem[]
  /** 显示边框 */
  bordered?: boolean
  /** 每行列数 */
  column?: number
  /** 尺寸 */
  size?: 'default' | 'middle' | 'small'
  /** 列表标题 */
  title?: React.ReactNode
  /** 布局：label 同行或上置 */
  layout?: 'horizontal' | 'vertical'
}

export function Descriptions({
  items,
  bordered = false,
  column = 3,
  size = 'default',
  title,
  layout = 'horizontal',
  className: cls,
  style,
  ...rest
}: DescriptionsProps) {
  return (
    <div
      className={className(
        'sofa-descriptions',
        `sofa-descriptions-size-${size}`,
        {
          'sofa-descriptions-bordered': bordered,
          'sofa-descriptions-vertical': layout === 'vertical'
        },
        cls
      )}
      style={style}
      {...rest}
    >
      {title != null && <div className="sofa-descriptions-title">{title}</div>}
      <div
        className="sofa-descriptions-body"
        style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <div
            key={item.key}
            className="sofa-descriptions-item"
            style={item.span ? { gridColumn: `span ${item.span}` } : undefined}
          >
            <div className="sofa-descriptions-item-label">{item.label}</div>
            <div className="sofa-descriptions-item-content">{item.children}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Descriptions