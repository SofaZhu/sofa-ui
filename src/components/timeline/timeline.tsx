import { className } from '@/utils/classNames'

/**
 * Timeline 时间轴：
 * 垂直展示时间序列，支持左右/交错对齐、自定义节点颜色与
 * 图形、pending 虚线和标签
 */

export interface TimelineItem {
  /** 条目内容 */
  children?: React.ReactNode
  /** 节点颜色：语义色或任意色值 */
  color?: string | 'green' | 'red' | 'gray' | 'primary'
  /** 自定义节点图形 */
  dot?: React.ReactNode
  /** 单条对齐方式（覆盖容器 mode） */
  position?: 'left' | 'right' | 'alternate'
  /** 是否为 pending 尾项（虚线节点） */
  pending?: boolean
  /** 标签（时间等说明文字） */
  label?: React.ReactNode
}

export interface TimelineProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  /** 条目列表 */
  items: TimelineItem[]
  /** 整体对齐模式 */
  mode?: 'left' | 'right' | 'alternate'
  /** 是否倒序展示 */
  reverse?: boolean
  /** 是否为每条条目启用 pending 样式 */
  pending?: boolean
}

const COLOR_MAP: Record<string, string> = {
  green: 'var(--sofa-color-success)',
  red: 'var(--sofa-color-error)',
  gray: 'var(--sofa-text-quaternary)',
  primary: 'var(--sofa-color-primary)'
}

export function Timeline({
  items,
  mode = 'left',
  reverse = false,
  pending = false,
  className: cls,
  style,
  ...rest
}: TimelineProps) {
  const ordered = reverse ? [...items].reverse() : items

  return (
    <ul className={className('sofa-timeline', `sofa-timeline-mode-${mode}`, cls)} style={style} {...rest}>
      {ordered.map((item, index) => {
        const isPending = item.pending ?? pending
        let pos = item.position ?? mode ?? 'left'
        if (pos === 'alternate') {
          pos = index % 2 === 0 ? 'left' : 'right'
        }
        const color = item.color ? COLOR_MAP[item.color] ?? item.color : undefined

        return (
          <li
            key={index}
            className={className(
              'sofa-timeline-item',
              `sofa-timeline-item-pos-${pos}`,
              { 'sofa-timeline-item-pending': isPending }
            )}
          >
            {item.label != null && <div className="sofa-timeline-label">{item.label}</div>}
            <span className="sofa-timeline-dot" style={color && !item.dot ? { background: color } : undefined}>
              {item.dot}
            </span>
            {item.children != null && <div className="sofa-timeline-content">{item.children}</div>}
          </li>
        )
      })}
    </ul>
  )
}

export default Timeline