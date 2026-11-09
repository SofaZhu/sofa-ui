import { useCallback, useMemo, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Tree 树形控件：
 * 展开受控 + 选择受控 + 复选半选联动（checkedKeys 只含全选节点）
 * + 懒加载 + 拖拽事件透传 + 连线样式 + 键盘导航
 * 节点模型统一为 label / title 兼容
 */

export interface TreeNode {
  /** 节点唯一键 */
  key: string
  /** 节点标签（优先使用），兼容 title */
  label?: React.ReactNode
  /** 兼容字段：未提供 label 时回退 */
  title?: React.ReactNode
  /** 子节点 */
  children?: TreeNode[]
  /** 是否禁用（不可选中/勾选/展开） */
  disabled?: boolean
  /** 是否可选中 */
  selectable?: boolean
  /** 是否可勾选（checkable 模式下逐节点开关） */
  checkable?: boolean
  /** 节点前缀图标 */
  icon?: React.ReactNode
  /** 是否叶子节点（懒加载时生效） */
  isLeaf?: boolean
}

export interface TreeSelectInfo {
  node: TreeNode
  selected: boolean
  /** 触发的事件（键盘触发时可能为空） */
  event?: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLDivElement>
}

export interface TreeCheckInfo {
  checked: boolean
  node: TreeNode
  /** 半选节点键集合（不计入 checkedKeys） */
  halfCheckedKeys: string[]
  /** 触发的事件（键盘触发时可能为空） */
  event?: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLDivElement>
}

export type TreeDropPosition = -1 | 0 | 1

export interface TreeDropInfo {
  /** 拖放目标节点 */
  node: TreeNode
  /** 被拖拽的节点 */
  dragNode: TreeNode
  /** -1 上方间隙 / 0 内部 / 1 下方间隙 */
  dropPosition: TreeDropPosition
  /** 是否落入间隙（非内部） */
  dropToGap: boolean
  /** 原生拖放事件 */
  event: React.DragEvent<HTMLDivElement>
}

export interface TreeProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | 'onChange'
    | 'onSelect'
    | 'onDragStart'
    | 'onDragEnter'
    | 'onDragOver'
    | 'onDragLeave'
    | 'onDrop'
    | 'onDragEnd'
  > {
  /** 树数据（label/title 兼容） */
  treeData: TreeNode[]
  /** 默认展开全部 */
  defaultExpandAll?: boolean
  /** 受控展开键 */
  expandedKeys?: string[]
  /** 默认展开键 */
  defaultExpandedKeys?: string[]
  /** 展开变化回调 */
  onExpand?: (expandedKeys: string[], info: { node: TreeNode; expanded: boolean }) => void
  /** 受控选中键 */
  selectedKeys?: string[]
  /** 默认选中键 */
  defaultSelectedKeys?: string[]
  /** 选中变化回调 */
  onSelect?: (selectedKeys: string[], info: TreeSelectInfo) => void
  /** 多选模式（Ctrl/⌘ 追加选择） */
  multiple?: boolean
  /** 是否显示复选框 */
  checkable?: boolean
  /** 受控勾选键（只含全选节点） */
  checkedKeys?: string[]
  /** 默认勾选键 */
  defaultCheckedKeys?: string[]
  /** 勾选变化回调 */
  onCheck?: (checkedKeys: string[], info: TreeCheckInfo) => void
  /** 是否显示连线样式 */
  showLine?: boolean
  /** 懒加载：展开时调用，完成后写入 children */
  loadData?: (node: TreeNode) => Promise<void>
  /** 是否可拖拽 */
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void
  /** 拖放完成回调（含位置计算信息） */
  onDrop?: (info: TreeDropInfo) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void
}

/** 收集所有包含子节点的键（defaultExpandAll 用） */
function collectExpandableKeys(nodes: TreeNode[]): string[] {
  const result: string[] = []
  const walk = (list: TreeNode[]) => {
    list.forEach((n) => {
      if (n.children && n.children.length > 0) {
        result.push(n.key)
        walk(n.children)
      }
    })
  }
  walk(nodes)
  return result
}

/** 判断子树中是否存在被勾选的节点（半选判定用） */
function hasCheckedDescendant(node: TreeNode, checked: Set<string>): boolean {
  if (!node.children) return false
  return node.children.some((child) => checked.has(child.key) || hasCheckedDescendant(child, checked))
}

/** 计算半选键集合：自身未全选但有已选后代 */
function computeHalfKeys(nodes: TreeNode[], checked: Set<string>): string[] {
  const result: string[] = []
  const walk = (list: TreeNode[]) => {
    list.forEach((n) => {
      if (!checked.has(n.key) && hasCheckedDescendant(n, checked)) {
        result.push(n.key)
      }
        if (n.children) walk(n.children)
    })
  }
  walk(nodes)
  return result
}

export function Tree({
  treeData,
  defaultExpandAll = false,
  expandedKeys,
  defaultExpandedKeys,
  onExpand,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  multiple = false,
  checkable = false,
  checkedKeys,
  defaultCheckedKeys,
  onCheck,
  showLine = false,
  loadData,
  draggable = false,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  className: cls,
  style,
  ...rest
}: TreeProps) {
  const defaultExpanded = useMemo(
    () => (defaultExpandAll ? collectExpandableKeys(treeData) : defaultExpandedKeys ?? []),
    // 默认展开只在首帧生效
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const [innerExpanded, setInnerExpanded, isExpandControlled] = useControlled(expandedKeys, defaultExpanded)
  const [innerSelected, setInnerSelected, isSelectControlled] = useControlled(selectedKeys, defaultSelectedKeys ?? [])
  const [innerChecked, setInnerChecked, isCheckControlled] = useControlled(checkedKeys, defaultCheckedKeys ?? [])
  const [loadingKeys, setLoadingKeys] = useState<string[]>([])
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [dropOver, setDropOver] = useState<{ key: string; position: TreeDropPosition } | null>(null)
  const dropPosRef = useRef<TreeDropPosition>(0)
  const dragInfoRef = useRef<{ node: TreeNode; key: string } | null>(null)
  const latestExpanded = useLatest(innerExpanded)

  const expandedSet = useMemo(() => new Set(innerExpanded), [innerExpanded])
  const selectedSet = useMemo(() => new Set(innerSelected), [innerSelected])
  const checkedSet = useMemo(() => new Set(innerChecked), [innerChecked])

  /** 节点索引：key → 父节点 key、key → 节点本体 */
  const { parentMap, nodeMap } = useMemo(() => {
    const parents = new Map<string, string | null>()
    const nodes = new Map<string, TreeNode>()
    const walk = (list: TreeNode[], parentKey: string | null) => {
      list.forEach((n) => {
        nodes.set(n.key, n)
        parents.set(n.key, parentKey)
        if (n.children) walk(n.children, n.key)
      })
    }
    walk(treeData, null)
    return { parentMap: parents, nodeMap: nodes }
  }, [treeData])

  /** 半选键集合（渲染用） */
  const halfCheckedKeys = useMemo(() => computeHalfKeys(treeData, checkedSet), [treeData, checkedSet])
  const halfSet = useMemo(() => new Set(halfCheckedKeys), [halfCheckedKeys])

  /** 可见节点序列（键盘导航用） */
  const visibleNodes = useMemo(() => {
    const list: Array<{ node: TreeNode; key: string; level: number }> = []
    const walk = (nodes: TreeNode[], level: number) => {
      nodes.forEach((n) => {
        list.push({ node: n, key: n.key, level })
        if ((n.children?.length ?? 0) > 0 && expandedSet.has(n.key)) {
          walk(n.children ?? [], level + 1)
        }
      })
    }
    walk(treeData, 0)
    return list
  }, [treeData, expandedSet])

  /** 展开/收起节点；懒加载节点展开时先加载数据 */
  const toggleExpand = useCallback(
    (node: TreeNode) => {
      const key = node.key
      const hasChildren = (node.children?.length ?? 0) > 0
      const isOpen = expandedSet.has(key)
      if (isOpen) {
        const next = innerExpanded.filter((k) => k !== key)
        if (!isExpandControlled) setInnerExpanded(next)
        onExpand?.(next, { node, expanded: false })
        return
      }
      const afterLoad = () => {
        const next = [...new Set([...latestExpanded.current, key])]
        if (!isExpandControlled) setInnerExpanded(next)
        onExpand?.(next, { node, expanded: true })
      }
      if (loadData && !hasChildren && !node.isLeaf) {
        setLoadingKeys((prev) => [...prev, key])
        loadData(node)
          .then(() => {
            setLoadingKeys((prev) => prev.filter((k) => k !== key))
            afterLoad()
          })
          .catch(() => {
            setLoadingKeys((prev) => prev.filter((k) => k !== key))
          })
        return
      }
      afterLoad()
    },
    [expandedSet, innerExpanded, isExpandControlled, onExpand, loadData, latestExpanded]
  )

  /** 节点选择 */
  const handleSelect = useCallback(
    (node: TreeNode, event?: TreeSelectInfo['event']) => {
      if (node.disabled || node.selectable === false) return
      const key = node.key
      let next: string[]
      if (multiple) {
        const add = event && 'ctrlKey' in event ? event.ctrlKey || event.metaKey : false
        if (add) {
          next = selectedSet.has(key)
            ? innerSelected.filter((k) => k !== key)
            : [...innerSelected, key]
        } else {
          next = selectedSet.has(key) ? [] : [key]
        }
      } else {
        next = selectedSet.has(key) ? [] : [key]
      }
      if (!isSelectControlled) setInnerSelected(next)
      onSelect?.(next, { node, selected: next.includes(key), event })
    },
    [innerSelected, selectedSet, multiple, isSelectControlled, onSelect]
  )

  /** 勾选切换：自身与后代级联，向上联动父节点全选/半选 */
  const handleCheck = useCallback(
    (node: TreeNode, checked: boolean, event?: TreeCheckInfo['event']) => {
      if (node.disabled || (checkable && node.checkable === false)) return
      const nextSet = new Set(innerChecked)
      if (checked) {
        const addRecursive = (n: TreeNode) => {
          if (n.disabled || (checkable && n.checkable === false)) return
          nextSet.add(n.key)
          n.children?.forEach(addRecursive)
        }
        addRecursive(node)
        // 向上：所有可勾选子节点全选时父节点入列
        let parentKey = parentMap.get(node.key) ?? null
        while (parentKey != null) {
          const parent = nodeMap.get(parentKey)
          if (!parent) break
          const checkableChildren = (parent.children ?? []).filter(
            (c) => !c.disabled && (!checkable || c.checkable !== false)
          )
          if (checkableChildren.length > 0 && checkableChildren.every((c) => nextSet.has(c.key))) {
            nextSet.add(parent.key)
          } else {
            nextSet.delete(parent.key)
          }
          parentKey = parentMap.get(parent.key) ?? null
        }
      } else {
        const removeRecursive = (n: TreeNode) => {
          nextSet.delete(n.key)
          n.children?.forEach(removeRecursive)
        }
        removeRecursive(node)
        // 向上：祖先不再全选则移出
        let parentKey = parentMap.get(node.key) ?? null
        while (parentKey != null && nextSet.has(parentKey)) {
          nextSet.delete(parentKey)
          parentKey = parentMap.get(parentKey) ?? null
        }
      }
      const result = [...nextSet]
      if (!isCheckControlled) setInnerChecked(result)
      onCheck?.(result, {
        checked,
        node,
        halfCheckedKeys: computeHalfKeys(treeData, nextSet),
        event
      })
    },
    [innerChecked, checkable, parentMap, nodeMap, treeData, isCheckControlled, onCheck]
  )

  const toggleCheck = useCallback(
    (node: TreeNode, event: React.MouseEvent<HTMLSpanElement>) => {
      if (node.disabled || (checkable && node.checkable === false)) return
      handleCheck(node, !checkedSet.has(node.key), event)
    },
    [checkable, checkedSet, handleCheck]
  )

  /** 拖拽事件透传与位置计算 */
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      const offsetY = e.clientY - rect.top
      const third = Math.max(rect.height, 24) / 3
      const position: TreeDropPosition = offsetY < third ? -1 : offsetY > third * 2 ? 1 : 0
      dropPosRef.current = position
      setDropOver({ key: node.key, position })
      onDragOver?.(e, node)
    },
    [onDragOver]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => {
      e.preventDefault()
      const drag = dragInfoRef.current
      const position = dropPosRef.current
      dragInfoRef.current = null
      setDropOver(null)
      onDrop?.({
        node,
        dragNode: drag?.node ?? node,
        dropPosition: position,
        dropToGap: position !== 0,
        event: e
      })
    },
    [onDrop]
  )

  /** 键盘导航：方向键移动焦点 / 展开收起 / Enter 或空格选中 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (focusKey == null) return
      const index = visibleNodes.findIndex((v) => v.key === focusKey)
      if (index < 0) return
      const focusNode = visibleNodes[index]
      const node = focusNode.node
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const next = visibleNodes[index + (e.key === 'ArrowDown' ? 1 : -1)]
        if (next) setFocusKey(next.key)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const hasChildren = (node.children?.length ?? 0) > 0
        if (hasChildren && !expandedSet.has(node.key)) {
          toggleExpand(node)
        } else {
          const firstChild = visibleNodes[index + 1]
          if (firstChild && firstChild.level > focusNode.level) setFocusKey(firstChild.key)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (expandedSet.has(node.key)) {
          toggleExpand(node)
        } else {
          const parentKey = parentMap.get(node.key) ?? null
          if (parentKey != null) setFocusKey(parentKey)
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelect(node)
      }
    },
    [focusKey, visibleNodes, expandedSet, toggleExpand, parentMap, handleSelect]
  )

  const renderList = (nodes: TreeNode[]): React.ReactNode => (
    <ul className={className('sofa-tree-list', nodes.length > 0 && 'sofa-tree-list-level')}>
      {nodes.map((node, index) => renderItem(node, index === nodes.length - 1))}
    </ul>
  )

  const renderItem = (node: TreeNode, isLast: boolean): React.ReactNode => {
    const children = node.children ?? []
    const hasChildren = children.length > 0
    const loadable = loadData != null && !node.isLeaf
    const expandable = hasChildren || loadable
    const expanded = expandable && expandedSet.has(node.key)
    const loading = loadingKeys.includes(node.key)
    const isChecked = checkedSet.has(node.key)
    const isHalf = halfSet.has(node.key)
    const isSelected = selectedSet.has(node.key)
    const isFocused = focusKey === node.key
    const showCheckbox = checkable && node.checkable !== false
    const dropCls =
      dropOver?.key === node.key
        ? dropOver.position === -1
          ? 'sofa-tree-node-drop-before'
          : dropOver.position === 1
            ? 'sofa-tree-node-drop-after'
            : 'sofa-tree-node-drop-inside'
        : ''

    /** 开关图标：懒加载中转圈，showLine 用加减方块，其余用箭头 */
    let switcherNode: React.ReactNode
    if (loading) {
      switcherNode = <Icon type="loading" size={12} spin />
    } else if (showLine) {
      switcherNode = (
        <span className="sofa-tree-switcher-box">
          <Icon type={expanded ? 'minus' : 'plus'} size={11} />
        </span>
      )
    } else {
      switcherNode = (
        <span className={className('sofa-tree-switcher-arrow', { 'sofa-tree-switcher-arrow-open': expanded })}>
          <Icon type="chevron-right" size={12} />
        </span>
      )
    }

    return (
      <li
        key={node.key}
        className={className('sofa-tree-item', {
          'sofa-tree-item-last': isLast,
          'sofa-tree-item-internal': expandable,
          'sofa-tree-item-leaf': !expandable,
          'sofa-tree-item-disabled': node.disabled
        })}
      >
        <div
          role="treeitem"
          aria-expanded={expandable ? expanded : undefined}
          aria-selected={isSelected}
          draggable={draggable && !node.disabled}
          tabIndex={isFocused ? 0 : -1}
          className={className(
            'sofa-tree-node',
            {
              'sofa-tree-node-expanded': expanded,
              'sofa-tree-node-collapsed': expandable && !expanded,
              'sofa-tree-node-selected': isSelected,
              'sofa-tree-node-focused': isFocused,
              'sofa-tree-node-disabled': node.disabled
            },
            dropCls
          )}
          onFocus={() => setFocusKey(node.key)}
          onKeyDown={(e) => {
            if (draggable) return
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              handleSelect(node, e)
            }
          }}
          onDragStart={(e) => {
            dragInfoRef.current = { node, key: node.key }
            onDragStart?.(e, node)
          }}
          onDragEnter={(e) => {
            onDragEnter?.(e, node)
          }}
          onDragOver={(e) => {
            if (!node.disabled) handleDragOver(e, node)
          }}
          onDragLeave={(e) => {
            setDropOver((prev) => (prev?.key === node.key ? null : prev))
            onDragLeave?.(e, node)
          }}
          onDrop={(e) => {
            if (!node.disabled) handleDrop(e, node)
          }}
          onDragEnd={(e) => {
            dragInfoRef.current = null
            setDropOver(null)
            onDragEnd?.(e, node)
          }}
        >
          <span
            className={className('sofa-tree-switcher', { 'sofa-tree-switcher-open': expanded })}
            onClick={(e) => {
              e.stopPropagation()
              if (!node.disabled && expandable) toggleExpand(node)
            }}
            aria-hidden="true"
          >
            {expandable && switcherNode}
          </span>
          {showCheckbox && (
            <span
              role="checkbox"
              aria-checked={isChecked ? 'true' : isHalf ? 'mixed' : 'false'}
              className={className(
                'sofa-tree-checkbox',
                {
                  'sofa-tree-checkbox-checked': isChecked,
                  'sofa-tree-checkbox-indeterminate': isHalf,
                  'sofa-tree-checkbox-disabled': node.disabled
                }
              )}
              onClick={(e) => {
                e.stopPropagation()
                toggleCheck(node, e)
              }}
            >
              <Icon type="check" size={12} className="sofa-tree-checkbox-icon" />
              {isHalf && <span className="sofa-tree-checkbox-dash" />}
            </span>
          )}
          {node.icon}
          <span
            className={className('sofa-tree-title', { 'sofa-tree-title-disabled': node.disabled })}
            onClick={(e) => {
              e.stopPropagation()
              handleSelect(node, e)
            }}
          >
            {node.label ?? node.title ?? node.key}
          </span>
        </div>
        {expandable && expanded && renderList(children)}
      </li>
    )
  }

  return (
    <div
      role="tree"
      tabIndex={0}
      className={className(
        'sofa-tree',
        {
          'sofa-tree-show-line': showLine,
          'sofa-tree-checkable': checkable,
          'sofa-tree-draggable': draggable
        },
        cls
      )}
      style={style}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {renderList(treeData)}
    </div>
  )
}

export default Tree