import { className } from '@/utils/classNames'
import { Empty } from '../empty/empty'
import { Spin } from '../spin/spin'

/**
 * List 列表：
 * 通用数据列表，支持加载态（Spin 遮罩）、空态（Empty）、
 * 边框分隔与头部底部插槽；List.Item 提供右侧操作区与附加内容
 */

export interface ListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 数据源 */
  dataSource: T[]
  /** 渲染单项，返回 ReactNode（可返回 List.Item） */
  renderItem: (item: T, index: number) => React.ReactNode
  /** 加载中状态（覆盖层） */
  loading?: boolean
  /** 尺寸 */
  size?: 'default' | 'small' | 'large'
  /** 显示边框 */
  bordered?: boolean
  /** 头部插槽 */
  header?: React.ReactNode
  /** 底部插槽 */
  footer?: React.ReactNode
  /** 是否显示项之间的分隔线 */
  split?: boolean
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 右侧操作区 */
  actions?: React.ReactNode[]
  /** 右侧附加内容（最右） */
  extra?: React.ReactNode
}

export function List<T>({
  dataSource,
  renderItem,
  loading = false,
  size = 'default',
  bordered = false,
  header,
  footer,
  split = true,
  className: cls,
  style,
  ...rest
}: ListProps<T>) {
  const body = (
    <div
      className={className(
        'sofa-list',
        `sofa-list-size-${size}`,
        { 'sofa-list-bordered': bordered, 'sofa-list-split': split },
        cls
      )}
      style={style}
      {...rest}
    >
      {header != null && <div className="sofa-list-header">{header}</div>}
      <ul className="sofa-list-items">
        {dataSource.length === 0 ? (
          <li className="sofa-list-empty">
            <Empty description="暂无数据" />
          </li>
        ) : (
          dataSource.map((item, index) => (
            <li key={index} className="sofa-list-item-wrapper">
              {renderItem(item, index)}
            </li>
          ))
        )}
      </ul>
      {footer != null && <div className="sofa-list-footer">{footer}</div>}
    </div>
  )

  if (loading) {
    return <Spin spinning>{body}</Spin>
  }
  return body
}

export function ListItem({
  actions,
  extra,
  children,
  className: cls,
  style,
  ...rest
}: ListItemProps) {
  return (
    <div className={className('sofa-list-item', cls)} style={style} {...rest}>
      <div className="sofa-list-item-main">{children}</div>
      {actions != null && actions.length > 0 && (
        <ul className="sofa-list-item-actions">
          {actions.map((action, index) => (
            <li key={index} className="sofa-list-item-action">
              {action}
            </li>
          ))}
        </ul>
      )}
      {extra != null && <div className="sofa-list-item-extra">{extra}</div>}
    </div>
  )
}

List.Item = ListItem

export default List