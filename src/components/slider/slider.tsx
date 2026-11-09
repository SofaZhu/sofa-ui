import { useCallback, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'

/**
 * Slider 滑块：单值 / 范围双模式，支持步进与刻度
 */

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'value'> {
  /** 受控值（范围模式为 [min, max]） */
  value?: number | [number, number]
  /** 默认值 */
  defaultValue?: number | [number, number]
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 范围模式 */
  range?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 是否显示数值气泡 */
  showTooltip?: boolean
  /** 刻度标记：{ 位置: 文案 } */
  marks?: Record<number, React.ReactNode>
  /** 变化回调（拖动中） */
  onChange?: (value: number | [number, number]) => void
  /** 拖动结束回调 */
  onChangeAfter?: (value: number | [number, number]) => void
}

/** 按步长取整并夹取到 min/max 范围 */
function clampStep(value: number, min: number, max: number, step: number): number {
  let result = Math.round((value - min) / step) * step + min
  result = Math.min(max, Math.max(min, result))
  // 浮点误差修正
  return Number(result.toFixed(6))
}

export const Slider = function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  disabled = false,
  showTooltip = true,
  marks,
  onChange,
  onChangeAfter,
  className: cls,
  style,
  ...rest
}: SliderProps) {
  const fallback: number | [number, number] =
    (defaultValue as number | [number, number] | undefined) ??
    (range ? [min, max] : min)
  const [innerValue, setInnerValue, isControlled] = useControlled<
    number | [number, number]
  >(value as number | [number, number] | undefined, fallback)
  const [dragging, setDragging] = useState<null | number>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const values = range
    ? (Array.isArray(innerValue) ? innerValue : [min, max])
    : [innerValue as number]
  const [lo, hi] = range ? [values[0], values[1]] : [values[0], values[0]]

  /** 将鼠标坐标换算为滑块值 */
  const valueFromEvent = useCallback(
    (clientX: number): number => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      return clampStep(min + ratio * (max - min), min, max, step)
    },
    [min, max, step]
  )

  const commit = useCallback(
    (next: number | [number, number]) => {
      if (!isControlled) setInnerValue(next)
      onChange?.(next)
    },
    [isControlled, onChange, setInnerValue]
  )

  /** 计算离点击位置最近的手柄索引 */
  const nearestIndex = useCallback(
    (clientX: number): number => {
      const track = trackRef.current
      if (!track) return 0
      const rect = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const candidate = clampStep(min + ratio * (max - min), min, max, step)
      const list = range ? values : [values[0]]
      return list.length < 2
        ? 0
        : Math.abs(list[0] - candidate) <= Math.abs(list[1] - candidate)
          ? 0
          : 1
    },
    [min, max, step, range, values]
  )

  /** 拖动起始：选定要拖动的把手；点击空白轨道时直接跳转 */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, index?: number) => {
      if (disabled) return
      e.preventDefault()
      const which = index !== undefined ? index : nearestIndex(e.clientX)
      setDragging(which)
      if (index === undefined) {
        const next = valueFromEvent(e.clientX)
        if (range) {
          commit(which === 0 ? [Math.min(next, hi), hi] : [lo, Math.max(next, lo)])
        } else {
          commit(next)
        }
      }
      const target = e.currentTarget as HTMLElement
      target.setPointerCapture?.(e.pointerId)
    },
    [disabled, nearestIndex, valueFromEvent, range, hi, lo, commit]
  )

  /** 拖动中更新值 */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null || disabled) return
      const next = valueFromEvent(e.clientX)
      if (range) {
        const nextPair: [number, number] =
          dragging === 0 ? [Math.min(next, hi), hi] : [lo, Math.max(next, lo)]
        commit(nextPair)
      } else {
        commit(next)
      }
    },
    [dragging, disabled, range, valueFromEvent, hi, lo]
  )

  const handlePointerUp = useCallback(() => {
    if (dragging === null) return
    setDragging(null)
    onChangeAfter?.(innerValue)
  }, [dragging, onChangeAfter, innerValue])

  /** 键盘微调 / Home / End */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (disabled) return
      const current = (range ? values[idx] : lo) as number
      let next = current
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          next = current - step
          break
        case 'ArrowRight':
        case 'ArrowUp':
          next = current + step
          break
        case 'Home':
          next = min
          break
        case 'End':
          next = max
          break
        default:
          return
      }
      e.preventDefault()
      next = clampStep(next, min, max, step)
      if (range) {
        commit(idx === 0 ? [Math.min(next, hi), hi] : [lo, Math.max(next, lo)])
      } else {
        commit(next)
      }
    },
    [disabled, range, values, lo, hi, step, min, max, commit]
  )

  const percent = (v: number) => ((v - min) / (max - min)) * 100
  const loPct = percent(lo)
  const hiPct = percent(hi)
  const markKeys = marks ? Object.keys(marks).map(Number) : []
  const markPct = (v: number) => percent(clampStep(v, min, max, step))

  return (
    <div
      className={className('sofa-slider', { 'sofa-slider-disabled': disabled }, cls)}
      style={style}
      {...rest}
    >
      <div
        className="sofa-slider-track-wrap"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="sofa-slider-track" />
        <div
          className="sofa-slider-active"
          style={{
            left: `${loPct}%`,
            width: `${hiPct - loPct}%`
          }}
        />
        {markKeys.map((mk) => (
          <span
            key={mk}
            className="sofa-slider-mark-dot"
            style={{ left: `${markPct(mk)}%` }}
          />
        ))}
        {marks && (
          <div className="sofa-slider-marks">
            {markKeys.map((mk) => (
              <span
                key={mk}
                className="sofa-slider-mark-label"
                style={{ left: `${markPct(mk)}%` }}
              >
                {marks[mk]}
              </span>
            ))}
          </div>
        )}
        {(range ? [0, 1] : [0]).map((idx) => {
          const v = range ? (idx === 0 ? lo : hi) : lo
          return (
            <div
              key={idx}
              className={className('sofa-slider-handle', { 'sofa-slider-handle-active': dragging === idx })}
              style={{ left: `calc(${percent(v)}% - 8px)` }}
              onPointerDown={(e) => handlePointerDown(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={v}
              tabIndex={disabled ? -1 : 0}
            >
              {(showTooltip || dragging === idx) && (
                <span className="sofa-slider-tooltip">{v}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Slider