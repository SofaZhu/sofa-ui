import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { usePop, type PopPlacement } from '@/hooks/usePop'
import { Icon } from '../icon/icon'

/**
 * Cascader 级联选择：多级联动列面板，支持面包屑回退与键盘操作
 */

export interface CascaderOption {
  value: string | number
  label: React.ReactNode
  children?: CascaderOption[]
  disabled?: boolean
}

export interface CascaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** 级联数据 */
  options: CascaderOption[]
  /** 受控值（各级 value 数组） */
  value?: Array<string | number>
  /** 默认值 */
  defaultValue?: Array<string | number>
  /** 值变化回调（path 为各级 value，selectedOptions 为对应节点） */
  onChange?: (path: Array<string | number> | undefined, selectedOptions: CascaderOption[]) => void
  /** 是否可搜索 */
  searchable?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 占位文案 */
  placeholder?: string
  /** 弹层方向 */
  placement?: PopPlacement
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 空数据文案 */
  emptyText?: React.ReactNode
}

/** 深度查找：返回路径上的节点链 */
function findPath(nodes: CascaderOption[], target: Array<string | number>): CascaderOption[] {
  const result: CascaderOption[] = []
  let current = nodes
  for (const v of target) {
    const node = current.find((n) => n.value === v)
    if (!node) return []
    result.push(node)
    current = node.children ?? []
  }
  return result
}

export const Cascader = function Cascader({
  options,
  value,
  defaultValue,
  onChange,
  searchable = false,
  clearable = false,
  disabled = false,
  placeholder = '请选择',
  placement = 'bottom',
  size = 'default',
  emptyText,
  className: cls,
  style,
  ...rest
}: CascaderProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled<Array<string | number> | undefined>(
    value,
    defaultValue
  )
  const currentPath = innerValue ?? []
  /** 搜索防抖：避免大数据量下每键全树遍历卡顿 */
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleKeywordChange = useCallback((kw: string) => {
    setKeyword(kw)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => setDebouncedKeyword(kw.trim()), 300)
  }, [])
  /** 当前悬停/选择到的各级索引（打开时默认定位到已选路径，否则第一级） */
  const [hoverPath, setHoverPath] = useState<Array<string | number>>([])
  const [activeRow, setActiveRow] = useState(0)

  const resetSearch = useCallback(() => {
    if (searchTimer.current !== null) clearTimeout(searchTimer.current)
    searchTimer.current = null
    setKeyword('')
    setDebouncedKeyword('')
  }, [])

  useEffect(() => () => {
    if (searchTimer.current !== null) clearTimeout(searchTimer.current)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      resetSearch()
      return
    }
    const selected = findPath(options, currentPath)
    const last = selected[selected.length - 1]
    setHoverPath(last?.children?.length ? currentPath : currentPath.slice(0, -1))
    setActiveRow(-1)
  }, [currentPath, options, resetSearch])

  const pop = usePop({ trigger: 'click', placement, offset: 4, disabled, onOpenChange: handleOpenChange })

  /** 悬停路径对应各级子节点 */
  const columns = useMemo(() => {
    const cols: CascaderOption[][] = []
    let current = options
    for (const v of hoverPath) {
      const node = current.find((n) => n.value === v)
      if (!node?.children?.length) break
      cols.push(current)
      current = node.children
    }
    cols.push(current)
    return cols
  }, [options, hoverPath])

  /** 搜索命中：输出匹配节点的完整路径（父链） */
  const searchResults = useMemo(() => {
    if (!searchable || !debouncedKeyword) return null
    const kw = debouncedKeyword.toLowerCase()
    const hits: Array<{ path: Array<string | number>; nodes: CascaderOption[] }> = []
    const walk = (list: CascaderOption[], chain: CascaderOption[]) => {
      list.forEach((n) => {
        if (n.disabled) return
        const nextChain = [...chain, n]
        if (n.children?.length) {
          walk(n.children, nextChain)
        } else if (nextChain.some((item) => String(item.label).toLowerCase().includes(kw))) {
          hits.push({ path: nextChain.map((item) => item.value), nodes: nextChain })
        }
      })
    }
    walk(options, [])
    return hits
  }, [options, debouncedKeyword, searchable])

  /** 当前选中路径的字符串签名：避免渲染期逐项 JSON.stringify 比对 */
  const currentPathKey = useMemo(() => JSON.stringify(currentPath), [currentPath])

  const displaySelected = useMemo(() => findPath(options, currentPath), [options, currentPath])
  const shownLabel = displaySelected.map((n) => n.label)

  const commit = useCallback(
    (path: Array<string | number> | undefined) => {
      if (!isControlled) setInnerValue(path)
      const nodes = path ? findPath(options, path) : []
      onChange?.(path, nodes)
    },
    [isControlled, setInnerValue, options, onChange]
  )

  /** 点击某级选项：有子级则展开下一列，叶子则选中提交 */
  const handlePick = useCallback(
    (node: CascaderOption, depth: number) => {
      const nextPath = [...hoverPath.slice(0, depth), node.value]
      setHoverPath(nextPath)
      if (node.children && node.children.length > 0) return
      commit(nextPath)
      pop.setOpen(false)
      setHoverPath([])
    },
    [hoverPath, commit, pop]
  )

  /** 点击面包屑回退 */
  const handleCrumb = useCallback(
    (index: number) => {
      const next = currentPath.slice(0, index)
      setHoverPath(next)
      commit(next.length > 0 ? next : undefined)
    },
    [currentPath, commit]
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      commit(undefined)
    },
    [commit]
  )

  return (
    <div
      className={className(
        'sofa-cascader',
        `sofa-cascader-${size}`,
        {
          'sofa-cascader-open': pop.open,
          'sofa-cascader-disabled': disabled
        },
        cls
      )}
      style={style}
      {...rest}
    >
      <span
        ref={pop.anchorRef}
        className="sofa-cascader-anchor"
        {...pop.events}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={pop.open}
      >
        <span className={className('sofa-cascader-render', shownLabel.length === 0 && 'sofa-cascader-placeholder')}>
          {shownLabel.length > 0 ? (
            shownLabel.map((l, i) => (
              <span key={i} className="sofa-cascader-selected">
                {i > 0 && <span className="sofa-cascader-separator">/</span>}
                {l}
              </span>
            ))
          ) : (
            placeholder
          )}
        </span>
        {clearable && shownLabel.length > 0 && !disabled ? (
          <Icon type="close-circle" size={14} className="sofa-cascader-suffix" onClick={handleClear} />
        ) : (
          <Icon type="chevron-down" size={14} className="sofa-cascader-suffix" />
        )}
      </span>

      {pop.open && (
        <div ref={pop.popRef} className={className('sofa-popup', 'sofa-cascader-dropdown')} role="listbox">
          {searchable && (
            <div className="sofa-cascader-search">
              <Icon type="search" size={13} />
              <input
                className="sofa-cascader-search-input"
                value={keyword}
                autoFocus
                placeholder="搜索"
                onChange={(e) => handleKeywordChange(e.target.value)}
              />
            </div>
          )}

          {searchResults ? (
            searchResults.length === 0 ? (
              <div className="sofa-cascader-empty">{emptyText ?? '暂无匹配'}</div>
            ) : (
              <div className="sofa-cascader-search-list">
                {searchResults.map((hit, i) => {
                  const hitKey = JSON.stringify(hit.path)
                  return (
                    <div
                      key={i}
                      role="option"
                      aria-selected={hitKey === currentPathKey}
                      className={className(
                        'sofa-cascader-search-item',
                        hitKey === currentPathKey && 'sofa-cascader-search-item-active'
                      )}
                      onMouseEnter={() => setActiveRow(i)}
                      onClick={() => {
                        commit(hit.path)
                        pop.setOpen(false)
                      }}
                    >
                      {hit.nodes.map((n, j) => (
                        <span key={j} className="sofa-cascader-search-crumb">
                          {j > 0 && <span className="sofa-cascader-separator">/</span>}
                          {n.label}
                        </span>
                      ))}
                    </div>
                  )
                })}
              </div>
            )
          ) : (
            <div className="sofa-cascader-panels" onKeyDown={(e) => {
              /* 键盘上下选择 + 回车确认（简单实现） */
              if (e.key === 'ArrowDown') setActiveRow((r) => r + 1)
              if (e.key === 'ArrowUp') setActiveRow((r) => Math.max(0, r - 1))
            }}>
              {columns.map((col, depth) => (
                <ul key={depth} className="sofa-cascader-panel" role="listbox" aria-label={`第 ${depth + 1} 级`}>
                  {col.length === 0 && <li className="sofa-cascader-empty">{emptyText ?? '暂无数据'}</li>}
                  {col.map((node, row) => {
                    const selected = hoverPath[depth] === node.value
                    const isLeaf = !node.children || node.children.length === 0
                    return (
                      <li
                        key={String(node.value)}
                        role="option"
                        aria-selected={selected}
                        aria-disabled={node.disabled || undefined}
                        className={className(
                          'sofa-cascader-item',
                          selected && 'sofa-cascader-item-active',
                          (node.disabled) && 'sofa-cascader-item-disabled',
                          activeRow === row && depth === columns.length - 1 && 'sofa-cascader-item-highlight'
                        )}
                        onMouseEnter={() => setActiveRow(row)}
                        onClick={() => {
                          if (!node.disabled) handlePick(node, depth)
                        }}
                      >
                        <span className="sofa-cascader-item-label">{node.label}</span>
                        {!isLeaf && <Icon type="chevron-right" size={12} className="sofa-cascader-item-arrow" />}
                      </li>
                    )
                  })}
                </ul>
              ))}
            </div>
          )}

          {shownLabel.length > 0 && !searchResults && (
            <div className="sofa-cascader-crumbs">
              {displaySelected.map((n, i) => (
                <span
                  key={i}
                  role="button"
                  tabIndex={0}
                  className="sofa-cascader-crumb"
                  onClick={() => handleCrumb(i + 1)}
                >
                  {n.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Cascader