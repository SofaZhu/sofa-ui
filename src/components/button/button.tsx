import { forwardRef, useCallback, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Button 按钮
 * 五种类型（primary/default/dashed/text/link），
 * 尺寸阶梯（large/default/small）与圆角形态（round/circle）
 */

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link'
export type ButtonSize = 'small' | 'default' | 'large'

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'> {
  /** 按钮类型，决定视觉层级 */
  type?: ButtonType
  /** 尺寸 */
  size?: ButtonSize
  /** 危险按钮，使用红色语义色 */
  danger?: boolean
  /** 幽灵按钮：透明背景 + 描边 */
  ghost?: boolean
  /** 圆角胶囊形态 */
  round?: boolean
  /** 圆形按钮 */
  circle?: boolean
  /** 撑满父容器宽度 */
  block?: boolean
  /** 加载中状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  /** 前缀图标（Icon 组件或任意 ReactNode） */
  icon?: React.ReactNode
  /** 原生 type */
  htmlType?: 'button' | 'submit' | 'reset'
  /** 点击时的波纹效果 */
  wave?: boolean
}

interface WavePosition {
  x: number
  y: number
  size: number
}

/**
 * 生成点击波纹元素：以点击位置为中心扩散的圆
 */
function createWave(event: React.MouseEvent<HTMLButtonElement>): WavePosition {
  const rect = event.currentTarget.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  return {
    x: event.clientX - rect.left - size / 2,
    y: event.clientY - rect.top - size / 2,
    size
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'default',
    size = 'default',
    danger = false,
    ghost = false,
    round = false,
    circle = false,
    block = false,
    loading = false,
    disabled = false,
    wave = true,
    icon,
    htmlType = 'button',
    children,
    className: cls,
    style,
    onClick,
    ...rest
  },
  ref
) {
  const wavesRef = useRef<Array<WavePosition & { id: number }>>([])
  const waveIdRef = useRef(0)

  const [, updateState] = useState(0)
  const forceRender = useCallback(() => updateState((n) => n + 1), [])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      if (wave) {
        const position = createWave(event)
        const id = waveIdRef.current++
        wavesRef.current.push({ ...position, id })
        forceRender()
        // 波纹动画结束后清理，避免 DOM 节点堆积
        setTimeout(() => {
          wavesRef.current = wavesRef.current.filter((w) => w.id !== id)
          forceRender()
        }, 600)
      }
      onClick?.(event)
    },
    [disabled, loading, wave, onClick, forceRender]
  )

  return (
    <button
      ref={ref}
      type={htmlType}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={className(
        'sofa-btn',
        `sofa-btn-${type}`,
        size === 'small' ? 'sofa-btn-sm' : size === 'large' ? 'sofa-btn-lg' : 'sofa-btn-md',
        {
          'sofa-btn-danger': danger,
          'sofa-btn-ghost': ghost,
          'sofa-btn-round': round,
          'sofa-btn-circle': circle,
          'sofa-btn-block': block,
          'sofa-btn-loading': loading
        },
        cls
      )}
      style={style}
      onClick={handleClick}
      {...rest}
    >
      <span className="sofa-btn-content">
        {loading && <Icon type="loading" size={size === 'large' ? 18 : 14} spin className="sofa-btn-loading-icon" />}
        {!loading && icon}
        {children != null && <span className="sofa-btn-label">{children}</span>}
      </span>
      {wavesRef.current.map((w) => (
        <span
          key={w.id}
          className="sofa-btn-wave"
          style={{
            left: w.x,
            top: w.y,
            width: w.size,
            height: w.size
          }}
        />
      ))}
    </button>
  )
})

export default Button