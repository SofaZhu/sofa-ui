import { useCallback, useMemo, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { usePop, type PopPlacement } from '@/hooks/usePop'
import { Icon } from '../icon/icon'
import { Tree, type TreeNode } from '../tree/tree'

/**
 * TreeSelect 树选择：下拉面板内嵌树形结构
 * 单选（点击节点选中）+ 多选（树复选框）
 */

export interface TreeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** 树数据 */
  treeData: TreeNode[]
  /** 受控值（单选为 key，多选为 key 数组） */
  value?: string | string[]
  /** 默认值 */
  defaultValue?: string | string[]
  /** 值变化回调（label 为选中节点文案列表） */
  onChange?: (value: string | string[] | undefined, label?: React.ReactNode) => void
  /** 多选模式（树复选框） */
  multiple?: boolean
  /** 是否可搜索（按标签过滤树） */
  searchable?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 占位文案 */
  placeholder?: string
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 弹层方向 */
  placement?: PopPlacement
  /** 是否展示连线 */
  showLine?: boolean
  /** 空数据展示 */
  emptyText?: React.ReactNode
}

/** 深度优先查找节点（按 key） */
function findNode(nodes: TreeNode[], key: string): TreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return null
}

/** 按关键词过滤树：命中节点的分支保留 */
function filterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  const kw = keyword.toLowerCase()
  const match = (n: TreeNode) => String(n.label ?? n.title ?? '').toLowerCase().includes(kw)
  return nodes
    .map((n) => {
      const self = match(n)
      const kids = n.children ? filterTree(n.children, keyword) : []
      if (!self && kids.length === 0) return null
      return self ? (kids.length > 0 ? { ...n, children: kids } : n) : { ...n, children: kids }
    })
    .filter((n): n is TreeNode => n !== null)
}

/** 收集含子节点的键（过滤后强制展开） */
function collectExpandKeys(nodes: TreeNode[], acc: string[] = []): string[] {
  nodes.forEach((n) => {
    if (n.children && n.children.length > 0) {
      acc.push(n.key)
      collectExpandKeys(n.children, acc)
    }
  })
  return acc
}

export const TreeSelect = function TreeSelect({
  treeData,
  value,
  defaultValue,
  onChange,
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  placeholder = '请选择',
  size = 'default',
  placement = 'bottom',
  showLine = false,
  emptyText,
  className: cls,
  style,
  ...rest
}: TreeSelectProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled<string | string[] | undefined>(
    value,
    defaultValue
  )
  const latestValue = useLatest(innerValue)
  const [keyword, setKeyword] = useState('')

  const pop = usePop({ trigger: 'click', placement, widthRatio: 1, offset: 4, disabled })

  const selectedKeys = multiple
    ? ((latestValue.current as string[] | undefined) ?? [])
    : latestValue.current !== undefined
      ? [latestValue.current as string]
      : []

  // 搜索过滤后的树数据与强制展开键
  const filtered = useMemo(() => {
    if (!searchable || !keyword.trim()) return null
    const data = filterTree(treeData, keyword.trim())
    return { data, expanded: collectExpandKeys(data) }
  }, [treeData, keyword, searchable])

  const displayNodes = filtered?.data ?? treeData
  const forceExpandedKeys = filtered?.expanded ?? []

  const selectedLabels = selectedKeys
    .map((k) => findNode(treeData, k))
    .filter((n): n is TreeNode => Boolean(n))
    .map((n) => n.label ?? n.title)

  const commit = useCallback(
    (next: string | string[] | undefined) => {
      if (!isControlled) setInnerValue(next)
      const nextKeys = Array.isArray(next) ? next : next !== undefined ? [next] : []
      const labels = nextKeys
        .map((k) => findNode(treeData, k))
        .filter((n): n is TreeNode => Boolean(n))
        .map((n) => n.label ?? n.title)
      onChange?.(next, labels.length > 0 ? labels : undefined)
    },
    [isControlled, setInnerValue, treeData, onChange]
  )

  const removeTag = useCallback(
    (key: string) => {
      const next = selectedKeys.filter((k) => k !== key)
      commit(multiple ? next : undefined)
    },
    [selectedKeys, multiple, commit]
  )

  const clearAll = useCallback(() => {
    commit(multiple ? [] : undefined)
  }, [multiple, commit])

  return (
    <div
      className={className(
        'sofa-tree-select',
        `sofa-tree-select-${size}`,
        {
          'sofa-tree-select-open': pop.open,
          'sofa-tree-select-disabled': disabled
        },
        cls
      )}
      style={style}
      {...rest}
    >
      <span
        ref={pop.anchorRef}
        className="sofa-tree-select-anchor"
        {...pop.events}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={pop.open}
      >
        <span
          className={className(
            'sofa-tree-select-render',
            selectedKeys.length === 0 && 'sofa-tree-select-placeholder'
          )}
        >
          {multiple ? (
            selectedKeys.length > 0 && (
              <span className="sofa-tree-select-tags">
                {selectedKeys.map((k, i) => (
                  <span key={k} className="sofa-tree-select-tag">
                    {selectedLabels[i] ?? k}
                    {!disabled && (
                      <Icon
                        type="close"
                        size={10}
                        className="sofa-tree-select-tag-close"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTag(k)
                        }}
                      />
                    )}
                  </span>
                ))}
              </span>
            )
          ) : (
            (selectedLabels[0] as React.ReactNode) ?? ''
          )}
          {selectedKeys.length === 0 && placeholder}
        </span>
        {clearable && selectedKeys.length > 0 && !disabled ? (
          <Icon
            type="close-circle"
            size={14}
            className="sofa-tree-select-suffix"
            onClick={(e) => {
              e.stopPropagation()
              clearAll()
            }}
          />
        ) : (
          <Icon type="chevron-down" size={14} className="sofa-tree-select-suffix" />
        )}
      </span>

      {pop.open && (
        <div ref={pop.popRef} className={className('sofa-popup', 'sofa-tree-select-dropdown')} role="listbox">
          {searchable && (
            <div className="sofa-tree-select-search">
              <Icon type="search" size={13} />
              <input
                className="sofa-tree-select-search-input"
                value={keyword}
                autoFocus
                placeholder="搜索"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          )}
          <div className="sofa-tree-select-body">
            {displayNodes.length === 0 ? (
              <div className="sofa-tree-select-empty">{emptyText ?? '暂无数据'}</div>
            ) : multiple ? (
              <Tree
                treeData={displayNodes}
                checkable
                defaultCheckedKeys={selectedKeys}
                showLine={showLine}
                defaultExpandAll
                expandedKeys={forceExpandedKeys.length > 0 ? forceExpandedKeys : undefined}
                onCheck={(keys) => commit(keys as string[])}
              />
            ) : (
              <Tree
                treeData={displayNodes}
                defaultSelectedKeys={selectedKeys}
                defaultExpandAll
                expandedKeys={forceExpandedKeys.length > 0 ? forceExpandedKeys : undefined}
                showLine={showLine}
                onSelect={(keys) => {
                  if (keys[0] === undefined) return
                  commit(keys[0] as string)
                  pop.setOpen(false)
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TreeSelect