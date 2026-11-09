import { useState } from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Typography 排版组件：
 * - Title 标题（h1 ~ h5）
 * - Text 文本（语义色 / 修饰形态 / 单行省略 / 可复制）
 * - Paragraph 段落（多行省略与展开收起）
 */

export type TypographyType = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'success' | 'warning' | 'error'

interface TypographyCommon {
  /** 语义色 */
  type?: TypographyType
}

export interface TitleProps extends TypographyCommon, Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> {
  /** 级别 1~5 */
  level?: 1 | 2 | 3 | 4 | 5
  /** 单行省略 */
  ellipsis?: boolean
  /** 是否可复制 */
  copyable?: boolean
}

export interface TextProps extends TypographyCommon, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 加粗 */
  strong?: boolean
  /** 斜体 */
  italic?: boolean
  /** 下划线 */
  underline?: boolean
  /** 删除线 */
  delete?: boolean
  /** 标记底色 */
  mark?: boolean
  /** 等宽代码样式 */
  code?: boolean
  /** 单行省略 */
  ellipsis?: boolean
  /** 可复制 */
  copyable?: boolean
}

export interface ParagraphEllipsisConfig {
  /** 省略行数 */
  rows: number
  /** 是否可展开收起 */
  expandable?: boolean
}

export interface ParagraphProps extends TypographyCommon, Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'> {
  /** 多行省略 */
  ellipsis?: ParagraphEllipsisConfig | boolean
}

const TYPE_CLASS: Record<TypographyType, string> = {
  primary: 'sofa-text-primary',
  secondary: 'sofa-text-secondary',
  tertiary: 'sofa-text-tertiary',
  disabled: 'sofa-text-disabled',
  success: 'sofa-text-success',
  warning: 'sofa-text-warning',
  error: 'sofa-text-error'
}

const levelTag: Record<1 | 2 | 3 | 4 | 5, React.ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5'
}

/** 复制文本：优先剪贴板 API，失败降级为提示选中 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** 复制按钮（复制中短暂显示成功图标） */
function CopyButton({ text, className: cls }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await copyText(text)
    setCopied(ok)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      aria-label="复制"
      className={className('sofa-typography-copy', copied && 'sofa-typography-copied', cls)}
      onClick={handleCopy}
    >
      <Icon type={copied ? 'check' : 'copy'} size={14} />
    </button>
  )
}

/** 为复制按钮保留空间，让省略样式只作用于文本。 */
function renderCopyableContent(content: React.ReactNode, source: React.ReactNode, ellipsis: boolean, copyable: boolean) {
  if (!copyable) return content
  return (
    <>
      {ellipsis ? <span className="sofa-typography-ellipsis">{content}</span> : content}
      <CopyButton text={typeof source === 'string' ? source : ''} />
    </>
  )
}

export function Title({ level = 1, type, ellipsis = false, copyable = false, className: cls, children, ...rest }: TitleProps) {
  const Tag: React.ElementType = levelTag[level]
  return (
    <Tag
      className={className(
        'sofa-typography',
        `sofa-typography-title`,
        `sofa-typography-title-${level}`,
        type && TYPE_CLASS[type],
        ellipsis && (copyable ? 'sofa-typography-copyable-ellipsis' : 'sofa-typography-ellipsis'),
        cls
      )}
      {...rest}
    >
      {renderCopyableContent(children, children, ellipsis, copyable)}
    </Tag>
  )
}

export const Text: React.FC<TextProps> = ({
  type,
  strong = false,
  italic = false,
  underline = false,
  delete: deleted = false,
  mark = false,
  code = false,
  ellipsis = false,
  copyable = false,
  className: cls,
  children,
  ...rest
}: TextProps) => {
  let content: React.ReactNode = children
  if (deleted) content = <del className="sofa-typography-del">{content}</del>
  if (mark) content = <mark className="sofa-typography-mark">{content}</mark>
  if (code) content = <code className="sofa-typography-code">{content}</code>

  return (
    <span
      className={className(
        'sofa-typography',
        type && TYPE_CLASS[type],
        strong && 'sofa-typography-strong',
        italic && 'sofa-typography-italic',
        underline && 'sofa-typography-underline',
        ellipsis && (copyable ? 'sofa-typography-copyable-ellipsis' : 'sofa-typography-ellipsis'),
        cls
      )}
      {...rest}
    >
      {renderCopyableContent(content, children, ellipsis, copyable)}
    </span>
  )
}

export function Paragraph({
  type,
  ellipsis = false,
  className: cls,
  children,
  ...rest
}: ParagraphProps) {
  const config: ParagraphEllipsisConfig | null = ellipsis && typeof ellipsis === 'object' ? ellipsis : null
  const [expanded, setExpanded] = useState(false)
  const isExpanded = config?.expandable ? expanded : false

  return (
    <p
      className={className(
        'sofa-typography',
        'sofa-typography-paragraph',
        type && TYPE_CLASS[type],
        ellipsis && !isExpanded && 'sofa-typography-ellipsis-multiple',
        ellipsis && !isExpanded && config && `sofa-typography-ellipsis-rows-${config.rows}`
      )}
      style={ellipsis && !isExpanded && config ? ({ WebkitLineClamp: config.rows } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
      {config?.expandable && (
        <button
          type="button"
          className="sofa-typography-expand"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '收起' : '展开'}
        </button>
      )}
    </p>
  )
}

const Typography = Object.assign(
  {},
  { Title, Text, Paragraph }
)

export default Typography