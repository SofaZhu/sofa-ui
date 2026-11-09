import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'
import { Pagination } from '../pagination/pagination'

/**
 * Table 表格：
 * 列定义渲染 + 表头排序循环 + 筛选浮层 + 本地分页 + 行选择（全选/半选/单选）
 * + 展开行 + 固定表头/固定列 + 加载态 + onRow 透传
 */

export type SortOrder = 'ascend' | 'descend'

export interface TableRecord {
  key: string
  [rest: string]: unknown
}

export interface TableColumn<T extends TableRecord = TableRecord> {
  /** 唯一键 */
  key: string
  /** 列头标题 */
  title: React.ReactNode
  /** 数据字段路径（支持 a.b 点路径） */
  dataIndex?: string
  /** 列宽 */
  width?: number | string
  /** 单元格对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 固定列方向 */
  fixed?: 'left' | 'right'
  /** 排序比较函数（提供后可排序） */
  sorter?: (a: T, b: T) => number
  /** 该列初始排序方向 */
  sortOrder?: SortOrder
  /** 筛选选项 */
  filters?: Array<{ text: React.ReactNode; value: string | number }>
  /** 筛选是否多选（默认 true，false 时为单选） */
  filterMultiple?: boolean
  /** 自定义单元格渲染 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode
}

export interface TablePaginationConfig {
  /** 每页条数 */
  pageSize?: number
  /** 受控当前页 */
  current?: number
  /** 总条数（不传时取数据长度） */
  total?: number
  /** 页码变化回调 */
  onChange?: (page: number, pageSize: number) => void
}

export interface TableRowSelection<T extends TableRecord = TableRecord> {
  /** 受控选中键 */
  selectedRowKeys?: string[]
  /** 默认选中键 */
  defaultSelectedRowKeys?: string[]
  /** 选中变化回调（键 + 行数据） */
  onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void
  /** 选择模式：复选框 / 单选 */
  type?: 'checkbox' | 'radio'
  /** 单行选择属性（如禁用） */
  getCheckboxProps?: (record: T) => { disabled?: boolean }
}

export interface TableExpandable<T extends TableRecord = TableRecord> {
  /** 受控展开键 */
  expandedRowKeys?: string[]
  /** 默认展开键 */
  defaultExpandedRowKeys?: string[]
  /** 展开状态变化回调 */
  onExpand?: (expanded: boolean, record: T) => void
  /** 展开行内容渲染 */
  renderExpandedRow?: (record: T) => React.ReactNode
}

export interface TableSorter {
  /** 排序字段（列 key） */
  field: string
  /** 排序方向 */
  order: SortOrder
}

export interface TableProps<T extends TableRecord = TableRecord>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** 列定义 */
  columns: TableColumn<T>[]
  /** 数据源 */
  dataSource: T[]
  /** 分页配置，false 关闭分页 */
  pagination?: false | TablePaginationConfig
  /** 加载态（遮罩） */
  loading?: boolean
  /** 行选择配置 */
  rowSelection?: TableRowSelection<T>
  /** 行属性透传（含行事件） */
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>
  /** 展开行配置 */
  expandable?: TableExpandable<T>
  /** 滚动区域：x 横向溢出，y 纵向滚动（表头 sticky） */
  scroll?: { x?: number | string; y?: number | string }
  /** 表格尺寸 */
  size?: 'small' | 'middle' | 'large'
  /** 是否显示边框 */
  bordered?: boolean
  /** 空数据文案 */
  emptyText?: React.ReactNode
  /** 分页 / 排序 / 筛选变化回调 */
  onChange?: (
    pagination: { current: number; pageSize: number },
    sorter: TableSorter | null,
    filters: Record<string, Array<string | number>>
  ) => void
}

/** 按点路径读取字段值 */
function getFieldValue(record: TableRecord, dataIndex?: string): unknown {
  if (dataIndex == null || dataIndex === '') return undefined
  let value: unknown = record
  for (const part of dataIndex.split('.')) {
    if (value === null || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[part]
  }
  return value
}

export function Table<T extends TableRecord>({
  columns,
  dataSource,
  pagination,
  loading = false,
  rowSelection,
  onRow,
  expandable,
  scroll,
  size = 'middle',
  bordered = false,
  emptyText,
  onChange: onTableChange,
  className: cls,
  style,
  ...rest
}: TableProps<T>) {
  const paginationConfig = pagination === false ? null : pagination ?? {}
  const pageSize = paginationConfig?.pageSize ?? 10

  // 排序状态：单列优先级，点击表头循环 descend → ascend → 取消
  const [activeSort, setActiveSort] = useState<{ key: string; order: SortOrder } | null>(null)
  // 生效的筛选条件：列 key → 选中的筛选值集合
  const [activeFilters, setActiveFilters] = useState<Record<string, Array<string | number>>>({})
  // 当前打开的筛选浮层列
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null)
  // 浮层内待确认的筛选值
  const [pendingFilters, setPendingFilters] = useState<Array<string | number>>([])
  const filterPopupRef = useRef<HTMLDivElement>(null)

  const [innerPage, setInnerPage, isPageControlled] = useControlled(paginationConfig?.current, 1)
  const [innerExpandedKeys, setInnerExpandedKeys, isExpandControlled] = useControlled(
    expandable?.expandedRowKeys,
    expandable?.defaultExpandedRowKeys ?? []
  )
  const [innerSelectedKeys, setInnerSelectedKeys, isSelectionControlled] = useControlled(
    rowSelection?.selectedRowKeys,
    rowSelection?.defaultSelectedRowKeys ?? []
  )

  /** 数据按筛选条件过滤 */
  const filteredRows = useMemo(() => {
    const filterCols = columns.filter(
      (col) => col.filters && activeFilters[col.key] && activeFilters[col.key].length > 0
    )
    if (filterCols.length === 0) return dataSource
    return dataSource.filter((row) =>
      filterCols.every((col) => {
        const values = activeFilters[col.key]
        const cell = getFieldValue(row, col.dataIndex)
        return values.some((v) => String(cell) === String(v))
      })
    )
  }, [dataSource, columns, activeFilters])

  /** 过滤后按排序规则排序 */
  const sortedRows = useMemo(() => {
    if (!activeSort) return filteredRows
    const col = columns.find((c) => c.key === activeSort.key)
    if (!col?.sorter) return filteredRows
    const dir = activeSort.order === 'ascend' ? 1 : -1
    return [...filteredRows].sort((a, b) => col.sorter!(a, b) * dir)
  }, [filteredRows, columns, activeSort])

  const total = paginationConfig?.total ?? sortedRows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, innerPage), totalPages)
  const pageRows = paginationConfig ? sortedRows.slice((page - 1) * pageSize, page * pageSize) : sortedRows

  /** 排序取值：优先当前激活排序，其次列初始排序 */
  const effectiveOrder = (col: TableColumn<T>): SortOrder | null =>
    activeSort?.key === col.key ? activeSort.order : col.sortOrder ?? null

  const cycleSort = useCallback(
    (col: TableColumn<T>) => {
      const current = effectiveOrder(col)
      let next: SortOrder | null
      if (current === null) next = 'descend'
      else if (current === 'descend') next = 'ascend'
      else next = null
      setActiveSort(next === null ? null : { key: col.key, order: next })
      if (!isPageControlled) setInnerPage(1)
      onTableChange?.(
        { current: 1, pageSize },
        next === null ? null : { field: col.key, order: next },
activeFilters
      )
    },
    [activeSort, activeFilters, columns, isPageControlled, onTableChange, pageSize]
  )

  const handlePageChange = useCallback(
    (nextPage: number, nextPageSize: number) => {
      if (!isPageControlled) setInnerPage(nextPage)
      paginationConfig?.onChange?.(nextPage, nextPageSize)
      onTableChange?.(
        { current: nextPage, pageSize: nextPageSize },
        activeSort === null ? null : { field: activeSort.key, order: activeSort.order },
        activeFilters
      )
    },
    [activeSort, activeFilters, isPageControlled, onTableChange, paginationConfig]
  )

  // 筛选浮层：点击外部关闭 + ESC 关闭
  useEffect(() => {
    if (openFilterKey === null) return
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (filterPopupRef.current && !filterPopupRef.current.contains(target)) {
        setOpenFilterKey(null)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenFilterKey(null)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openFilterKey])

  const openFilter = useCallback((col: TableColumn<T>) => {
    if (openFilterKey === col.key) {
      setOpenFilterKey(null)
      return
    }
    const current = activeFilters[col.key] ?? []
    setPendingFilters(
      col.filterMultiple === false ? (current.length > 0 ? [current[0]] : []) : [...current]
    )
    setOpenFilterKey(col.key)
  }, [openFilterKey, activeFilters])

  const toggleFilterValue = useCallback(
    (col: TableColumn<T>, value: string | number) => {
      setPendingFilters((prev) => {
        if (col.filterMultiple === false) {
          const same = prev.length === 1 && prev[0] === value
          return same ? [] : [value]
        }
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      })
    },
    []
  )

  const confirmFilter = useCallback(
    (col: TableColumn<T>) => {
      const next = { ...activeFilters }
      if (pendingFilters.length > 0) next[col.key] = pendingFilters
      else delete next[col.key]
      setActiveFilters(next)
      setOpenFilterKey(null)
      if (!isPageControlled) setInnerPage(1)
      onTableChange?.(
        { current: 1, pageSize },
        activeSort === null ? null : { field: activeSort.key, order: activeSort.order },
        next
      )
    },
    [activeFilters, pendingFilters, activeSort, isPageControlled, onTableChange, pageSize]
  )

  const resetFilter = useCallback(
    (col: TableColumn<T>) => {
      if (col.filterMultiple === false) {
        setPendingFilters([])
        return
      }
      const all = col.filters?.map((f) => f.value) ?? []
      const next = { ...activeFilters }
      delete next[col.key]
      setActiveFilters(next)
      setPendingFilters(all)
    },
    [activeFilters]
  )

  // 行选择逻辑
  const allKeys = dataSource.map((r) => r.key)
  const disabledKeys = new Set(
    dataSource.filter((r) => rowSelection?.getCheckboxProps?.(r)?.disabled).map((r) => r.key)
  )
  const enabledKeys = allKeys.filter((k) => !disabledKeys.has(k))
  const allSelected = enabledKeys.length > 0 && enabledKeys.every((k) => innerSelectedKeys.includes(k))
  const partialSelected = !allSelected && enabledKeys.some((k) => innerSelectedKeys.includes(k))

  const toggleRow = useCallback(
    (record: T, checked: boolean) => {
      if (disabledKeys.has(record.key)) return
      const next = rowSelection?.type === 'radio' ? (checked ? [record.key] : []) : checked
        ? [...new Set([...innerSelectedKeys, record.key])]
        : innerSelectedKeys.filter((k) => k !== record.key)
      if (!isSelectionControlled) setInnerSelectedKeys(next)
      const rows = dataSource.filter((r) => next.includes(r.key))
      rowSelection?.onChange?.(next, rows)
    },
    [disabledKeys, rowSelection, innerSelectedKeys, isSelectionControlled, setInnerSelectedKeys, dataSource]
  )

  const toggleAll = useCallback(
    (checked: boolean) => {
      const next = checked
        ? [...new Set([...innerSelectedKeys, ...enabledKeys])]
        : innerSelectedKeys.filter((k) => !enabledKeys.includes(k))
      if (!isSelectionControlled) setInnerSelectedKeys(next)
      const rows = dataSource.filter((r) => next.includes(r.key))
      rowSelection?.onChange?.(next, rows)
    },
    [enabledKeys, innerSelectedKeys, isSelectionControlled, setInnerSelectedKeys, dataSource, rowSelection]
  )

  // 展开行逻辑
  const toggleExpand = useCallback(
    (record: T, expanded: boolean) => {
      const next = expanded
        ? [...new Set([...innerExpandedKeys, record.key])]
        : innerExpandedKeys.filter((k) => k !== record.key)
      if (!isExpandControlled) setInnerExpandedKeys(next)
      expandable?.onExpand?.(expanded, record)
    },
    [innerExpandedKeys, isExpandControlled, setInnerExpandedKeys, expandable]
  )

  const hasExpand = expandable?.renderExpandedRow != null
  const hasSelection = rowSelection != null
  const extraColCount = (hasExpand ? 1 : 0) + (hasSelection ? 1 : 0)
  const colSpan = columns.length + extraColCount

  const scrollClass =
    scroll?.x != null || scroll?.y != null ? 'sofa-table-scroll' : ''

  return (
    <div
      className={className(
        'sofa-table',
        `sofa-table-${size}`,
        { 'sofa-table-bordered': bordered, 'sofa-table-loading-state': loading },
        cls
      )}
      style={style}
      {...rest}
    >
      <div className={className('sofa-table-scroll-x', scroll?.x != null && 'sofa-table-scroll-x-active', scrollClass)}>
        <div
          className="sofa-table-scroll-y"
          style={scroll?.y != null ? { maxHeight: scroll.y, overflowY: 'auto' } : undefined}
        >
          <table
            className="sofa-table-table"
            style={scroll?.x != null ? { minWidth: scroll.x } : undefined}
          >
            <thead className="sofa-table-thead">
              <tr>
                {hasExpand && <th className="sofa-table-expand-col" style={{ width: 48 }} />}
                {hasSelection && (
                  <th className="sofa-table-selection-col" style={{ width: 48 }}>
                    {rowSelection?.type === 'radio' ? null : (
                      <input
                        type="checkbox"
                        className="sofa-table-select-all"
                        aria-label="全选"
                        checked={allSelected}
                        disabled={enabledKeys.length === 0}
                        onChange={(e) => toggleAll(e.target.checked)}
                        ref={(el) => {
                          if (el) el.indeterminate = partialSelected && !allSelected
                        }}
                      />
                    )}
                  </th>
                )}
                {columns.map((col) => {
                  const sortable = col.sorter != null
                  const order = effectiveOrder(col)
                  const filteredActive = activeFilters[col.key]?.length > 0
                  return (
                    <th
                      key={col.key}
                      className={className(
                        'sofa-table-th',
                        col.fixed === 'left' && 'sofa-table-cell-fixed-left',
                        col.fixed === 'right' && 'sofa-table-cell-fixed-right',
                        sortable && 'sofa-table-th-sortable'
                      )}
                      style={{ width: col.width }}
                      onClick={sortable ? () => cycleSort(col) : undefined}
                    >
                      <span className="sofa-table-th-inner">
                        <span className="sofa-table-th-title">{col.title}</span>
                        {sortable && (
                          <span className="sofa-table-sort-icons" aria-hidden="true">
                            <Icon
                              type="chevron-up"
                              size={10}
                              className={className('sofa-table-sort-icon', order === 'ascend' && 'sofa-table-sort-icon-active')}
                            />
                            <Icon
                              type="chevron-down"
                              size={10}
                              className={className('sofa-table-sort-icon', order === 'descend' && 'sofa-table-sort-icon-active')}
                            />
                          </span>
                        )}
                        {col.filters != null && (
                          <span className="sofa-table-filter-wrap">
                            <button
                              type="button"
                              aria-label={`筛选 ${col.title}`}
                              className={className('sofa-table-filter-btn', { 'sofa-table-filter-btn-active': filteredActive || openFilterKey === col.key })}
                              onClick={(e) => {
                                e.stopPropagation()
                                openFilter(col)
                              }}
                            >
                              <Icon type="filter" size={12} />
                            </button>
                            {openFilterKey === col.key && (
                              <div ref={filterPopupRef} className="sofa-table-filter-popup" role="menu">
                                <div className="sofa-table-filter-list">
                                  {(col.filters ?? []).map((f) => {
                                    const selected = pendingFilters.includes(f.value)
                                    return (
                                      <label key={String(f.value)} className="sofa-table-filter-item">
                                        <input
                                          type={col.filterMultiple === false ? 'radio' : 'checkbox'}
                                          checked={selected}
                                          onChange={() => toggleFilterValue(col, f.value)}
                                        />
                                        <span className="sofa-table-filter-text">{f.text}</span>
                                      </label>
                                    )
                                  })}
                                </div>
                                <div className="sofa-table-filter-actions">
                                  <button type="button" className="sofa-table-filter-btn-sm" onClick={() => resetFilter(col)}>
                                    重置
                                  </button>
                                  <button
                                    type="button"
                                    className="sofa-table-filter-btn-sm sofa-table-filter-btn-confirm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      confirmFilter(col)
                                    }}
                                  >
                                    确定
                                  </button>
                                </div>
                              </div>
                            )}
                          </span>
                        )}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="sofa-table-tbody">
              {pageRows.length === 0 ? (
                <tr className="sofa-table-empty-row">
                  <td colSpan={colSpan}>
                    <div className="sofa-table-empty">{emptyText ?? '暂无数据'}</div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => {
                  const expanded = innerExpandedKeys.includes(row.key)
                  const selected = innerSelectedKeys.includes(row.key)
                  const rowDisabled = disabledKeys.has(row.key)
                  const rowProps = onRow?.(row, index) ?? {}
                  return (
                    <Fragment key={row.key}>
                      <tr
                        className={className('sofa-table-row', {
                          'sofa-table-row-selected': selected,
                          'sofa-table-row-expanded': expanded
                        })}
                        {...rowProps}
                      >
                        {hasExpand && (
                          <td className="sofa-table-expand-cell">
                            <button
                              type="button"
                              aria-label={expanded ? '收起' : '展开'}
                              className={className('sofa-table-expand-btn', { 'sofa-table-expand-btn-open': expanded })}
                              onClick={() => toggleExpand(row, !expanded)}
                            >
                              <Icon type="chevron-right" size={12} />
                            </button>
                          </td>
                        )}
                        {hasSelection && (
                          <td className="sofa-table-selection-cell">
                            {rowSelection?.type === 'radio' ? (
                              <input
                                type="radio"
                                className="sofa-table-row-radio"
                                aria-label={`选择行 ${row.key}`}
                                checked={selected}
                                disabled={rowDisabled}
                                onChange={() => toggleRow(row, true)}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                className="sofa-table-row-checkbox"
                                aria-label={`选择行 ${row.key}`}
                                checked={selected}
                                disabled={rowDisabled}
                                onChange={(e) => toggleRow(row, e.target.checked)}
                              />
                            )}
                          </td>
                        )}
                        {columns.map((col) => {
                          const value = getFieldValue(row, col.dataIndex)
                          return (
                            <td
                              key={col.key}
                              className={className(
                                'sofa-table-td',
                                col.align != null && `sofa-table-align-${col.align}`,
                                col.fixed === 'left' && 'sofa-table-cell-fixed-left',
                                col.fixed === 'right' && 'sofa-table-cell-fixed-right'
                              )}
                            >
                              <div className="sofa-table-cell">
                                {col.render ? col.render(value, row, index) : (value as React.ReactNode)}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                      {expanded && (
                        <tr className="sofa-table-expanded-row">
                          <td colSpan={colSpan}>
                            <div className="sofa-table-expanded-content">
                              {expandable?.renderExpandedRow?.(row)}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="sofa-table-loading">
          <Icon type="loading" size={20} spin />
        </div>
      )}
      {pagination !== false && (
        <div className="sofa-table-pagination">
          <Pagination
            total={total}
            current={page}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default Table