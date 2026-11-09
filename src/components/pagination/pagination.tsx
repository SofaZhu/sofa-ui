import { useCallback, useMemo } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Pagination 分页器：
 * 页码 + 快速跳转 + 每页条数切换
 */

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 总条数 */
  total: number
  /** 受控当前页 */
  current?: number
  /** 默认页码 */
  defaultCurrent?: number
  /** 每页条数 */
  pageSize?: number
  /** 非受控模式下的初始每页条数 */
  defaultPageSize?: number
  /** 页码变化回调 */
  onChange?: (page: number, pageSize: number) => void
  /** 每页条数变化回调 */
  onPageSizeChange?: (size: number) => void
  /** 每页条数选项 */
  pageSizeOptions?: number[]
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 是否显示总条数 */
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
}

const PAGE_SIZES = [10, 20, 50, 100]

/** 生成页码数组：首尾页 + 当前页 ±2，超宽时用省略号 */
function buildPages(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: Array<number | 'ellipsis'> = []
  const add = (p: number | 'ellipsis') => pages.push(p)
  add(1)
  if (current > 4) add('ellipsis')
  for (let p = Math.max(2, current - 2); p <= Math.min(total - 1, current + 2); p++) add(p)
  if (current < total - 3) add('ellipsis')
  add(total)
  return pages
}

export const Pagination = function Pagination({
  total,
  current,
  defaultCurrent = 1,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  onChange,
  onPageSizeChange,
  pageSizeOptions,
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal,
  disabled = false,
  className: cls,
  style,
  ...rest
}: PaginationProps) {
  const [innerPageSize, setPageSize] = useControlled(controlledPageSize, defaultPageSize)
  const pageSize = Number.isFinite(innerPageSize) && innerPageSize >= 1 ? Math.floor(innerPageSize) : 10
  const itemCount = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize))
  const [innerPage, setInnerPage, isControlled] = useControlled(current, defaultCurrent)
  const page = Math.min(Math.max(1, Number.isFinite(innerPage) ? Math.floor(innerPage) : 1), totalPages)

  const select = useCallback(
    (target: number) => {
      const next = Math.min(Math.max(1, target), totalPages)
      if (next === page) return
      if (!isControlled) setInnerPage(next)
      onChange?.(next, pageSize)
    },
    [totalPages, page, isControlled, setInnerPage, onChange, pageSize]
  )

  const pages = useMemo(() => buildPages(page, totalPages), [page, totalPages])

  const handleJump = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      const value = Number(e.currentTarget.value)
      if (Number.isInteger(value) && value > 0) select(value)
    },
    [select]
  )

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.currentTarget.value)
      if (!Number.isInteger(size) || size < 1 || size === pageSize) return
      const nextPage = Math.min(page, Math.max(1, Math.ceil(itemCount / size)))
      setPageSize(size)
      setInnerPage(nextPage)
      onPageSizeChange?.(size)
      onChange?.(nextPage, size)
    },
    [itemCount, onPageSizeChange, onChange, page, pageSize, setInnerPage, setPageSize]
  )

  const rangeStart = itemCount === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, itemCount)
  const sizes = [...new Set([...(pageSizeOptions ?? PAGE_SIZES), pageSize])]
    .filter((size) => Number.isInteger(size) && size > 0)
    .sort((a, b) => a - b)

  return (
    <div className={className('sofa-pagination', { 'sofa-pagination-disabled': disabled }, cls)} style={style} {...rest}>
      {showTotal && (
        <span className="sofa-pagination-total">
          {showTotal(itemCount, [rangeStart, rangeEnd])}
        </span>
      )}
      {showSizeChanger && (
        <select
          className="sofa-pagination-size"
          value={pageSize}
          disabled={disabled}
          onChange={handleSizeChange}
          aria-label="每页条数"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size} 条/页
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        className="sofa-pagination-btn"
        disabled={disabled || page <= 1}
        aria-label="上一页"
        onClick={() => select(page - 1)}
      >
        <Icon type="chevron-left" size={13} />
      </button>
        {pages.map((p, index) =>
          p === 'ellipsis' ? (
            <span key={`e${index}`} className="sofa-pagination-ellipsis">···</span>
          ) : (
            <button
              key={p}
              type="button"
              disabled={disabled}
              className={className('sofa-pagination-btn', { 'sofa-pagination-btn-active': p === page })}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => select(p)}
            >
              {p}
            </button>
          )
        )}
      <button
        type="button"
        className="sofa-pagination-btn"
        disabled={disabled || page >= totalPages}
        aria-label="下一页"
        onClick={() => select(page + 1)}
      >
        <Icon type="chevron-right" size={13} />
      </button>
      {showQuickJumper && (
        <span className="sofa-pagination-jumper">
          跳至
          <input
            type="number"
            min={1}
            max={totalPages}
            disabled={disabled}
            className="sofa-pagination-input"
            onKeyDown={handleJump}
          />
          页
        </span>
      )}
    </div>
  )
}

export default Pagination