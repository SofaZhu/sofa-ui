import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { usePop } from '@/hooks/usePop'
import { Icon } from '../icon/icon'
import { Input } from '../input/input'

/**
 * TimePicker 时间选择器：
 * 时分秒三列滚动面板，支持步长与 12 小时制
 */

export interface TimePickerProps {
  /** 受控时间（日期部分忽略，仅取时分秒） */
  value?: Date | null
  /** 默认时间 */
  defaultValue?: Date | null
  /** 变化回调 */
  onChange?: (date: Date | null) => void
  /** 展示格式，支持 HH/mm/ss 占位 */
  format?: string
  /** 小时步长 */
  hourStep?: number
  /** 分钟步长 */
  minuteStep?: number
  /** 秒步长 */
  secondStep?: number
  /** 12 小时制（AM/PM） */
  use12Hours?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 占位文案 */
  placeholder?: string
  /** 面板开合变化回调 */
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
}

/** 两位补零 */
export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

export interface TimeOptions {
  hours: number[]
  minutes: number[]
  seconds: number[]
}

/**
 * 生成各列可选项：
 * 12 小时制下小时列为 [12, 1, ..., 11]（第 0 位代表钟面 12 点）
 */
export function getTimeOptions(options: {
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  use12Hours?: boolean
} = {}): TimeOptions {
  const { hourStep = 1, minuteStep = 1, secondStep = 1, use12Hours = false } = options
  const hours: number[] = []
  const hourCount = use12Hours ? 12 : 24
  for (let h = 0; h < hourCount; h += hourStep) {
    hours.push(use12Hours ? (h === 0 ? 12 : h) : h)
  }
  const minutes: number[] = []
  for (let m = 0; m < 60; m += minuteStep) minutes.push(m)
  const seconds: number[] = []
  for (let s = 0; s < 60; s += secondStep) seconds.push(s)
  return { hours, minutes, seconds }
}

/** 钟面显示值与真实小时互转（12 小时制用） */
function hourToReal(h: number, isPM: boolean): number {
  if (h === 12) return isPM ? 12 : 0
  return isPM ? h + 12 : h
}

function realToFace(h: number): { face: number; isPM: boolean } {
  const isPM = h >= 12
  const face = h % 12 || 12
  return { face, isPM }
}

export function TimePicker({
  value,
  defaultValue,
  onChange,
  format = 'HH:mm:ss',
  hourStep,
  minuteStep,
  secondStep,
  use12Hours = false,
  disabled = false,
  placeholder = '请选择时间',
  onOpenChange,
  className: cls,
  style
}: TimePickerProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled<Date | null>(
    value,
    defaultValue ?? null
  )
  const current = innerValue ?? null
  const latestValue = useLatest(current)
  const latestOnChange = useLatest(onChange)

  const pop = usePop({
    trigger: 'click',
    placement: 'bottomLeft',
    offset: 4,
    disabled
  })
  const setOpen = pop.setOpen

  const options = useMemo(
    () => getTimeOptions({ hourStep, minuteStep, secondStep, use12Hours }),
    [hourStep, minuteStep, secondStep, use12Hours]
  )

  // 面板选中态：初始来源于当前值
  const base = current ?? new Date()
  const [isPM, setIsPM] = useState(base.getHours() >= 12)
  const [hour, setHour] = useState(use12Hours ? realToFace(base.getHours()).face : base.getHours())
  const [minute, setMinute] = useState(base.getMinutes())
  const [second, setSecond] = useState(base.getSeconds())

  const scrollRef = useRef<HTMLUListElement | null>(null)
  const minuteListRef = useRef<HTMLUListElement | null>(null)
  const secondListRef = useRef<HTMLUListElement | null>(null)

  const handleOpen = useCallback(() => {
    const b = latestValue.current ?? new Date()
    const h = b.getHours()
    setIsPM(h >= 12)
    setHour(use12Hours ? realToFace(h).face : h)
    setMinute(b.getMinutes())
    setSecond(b.getSeconds())
    setOpen(true)
    onOpenChange?.(true)
  }, [latestValue, use12Hours, onOpenChange])

  const handleClose = useCallback(() => {
    setOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  /** 组装新的时间值并回传 */
  const commit = useCallback(
    (h: number, m: number, s: number, pm: boolean) => {
      const realH = use12Hours ? hourToReal(h, pm) : h
      const d = latestValue.current ?? new Date()
      const next = new Date(d.getFullYear(), d.getMonth(), d.getDate(), realH, m, s)
      if (!isControlled) setInnerValue(next)
      latestOnChange.current?.(next)
    },
    [use12Hours, isControlled, setInnerValue, latestValue, latestOnChange]
  )

  // 面板打开后把选中项滚入视野
  useEffect(() => {
    if (!pop.open) return
    const cur = scrollRef.current ?? null
    cur?.scrollIntoView?.({ block: 'nearest' })
    minuteListRef.current?.scrollIntoView?.({ block: 'nearest' })
    secondListRef.current?.scrollIntoView?.({ block: 'nearest' })
  }, [pop.open, options])

  const text = current
    ? (() => {
        const h = current.getHours()
        const m = current.getMinutes()
        const s = current.getSeconds()
        const face = use12Hours ? realToFace(h).face : h
        const body = format.replace('HH', pad(face)).replace('mm', pad(m)).replace('ss', pad(s))
        return use12Hours ? `${body} ${realToFace(h).isPM ? 'PM' : 'AM'}` : body
      })()
    : ''

  return (
    <span
      ref={pop.anchorRef}
      className={className('sofa-timepicker', cls)}
      style={style}
      onFocus={() => {
        if (!pop.open) handleOpen()
      }}
      onClick={() => {
        if (!pop.open) handleOpen()
      }}
      onBlur={(e) => {
        if (e.relatedTarget && !pop.popRef.current?.contains(e.relatedTarget as Node)) {
          handleClose()
        }
      }}
    >
      <Input
        readOnly
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        suffix={<Icon type="clock" size={14} />}
      />

      {pop.open && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-timepicker-popup')}
        >
          <div className="sofa-timepicker-column-wrap">
            <div className="sofa-timepicker-column">
              <div className="sofa-timepicker-column-title">时</div>
              <ul
                role="listbox"
                aria-label="时"
                className="sofa-timepicker-list"
                ref={scrollRef}
              >
                {options.hours.map((h) => (
                  <li key={h} role="option" aria-selected={hour === h}>
                    <button
                      type="button"
                      tabIndex={-1}
                      className={className('sofa-timepicker-item', hour === h && 'sofa-timepicker-item-active')}
                      onClick={() => {
                        setHour(h)
                        commit(h, minute, second, isPM)
                      }}
                    >
                      {pad(h)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sofa-timepicker-column">
              <div className="sofa-timepicker-column-title">分</div>
              <ul role="listbox" aria-label="分" className="sofa-timepicker-list" ref={minuteListRef}>
                {options.minutes.map((m) => (
                  <li key={m} role="option" aria-selected={minute === m}>
                    <button
                      type="button"
                      tabIndex={-1}
                      className={className('sofa-timepicker-item', minute === m && 'sofa-timepicker-item-active')}
                      onClick={() => {
                        setMinute(m)
                        commit(hour, m, second, isPM)
                      }}
                    >
                      {pad(m)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sofa-timepicker-column">
              <div className="sofa-timepicker-column-title">秒</div>
              <ul role="listbox" aria-label="秒" className="sofa-timepicker-list" ref={secondListRef}>
                {options.seconds.map((s) => (
                  <li key={s} role="option" aria-selected={second === s}>
                    <button
                      type="button"
                      tabIndex={-1}
                      className={className('sofa-timepicker-item', second === s && 'sofa-timepicker-item-active')}
                      onClick={() => {
                        setSecond(s)
                        commit(hour, minute, s, isPM)
                      }}
                    >
                      {pad(s)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {use12Hours && (
              <div className="sofa-timepicker-column">
                <div className="sofa-timepicker-column-title">上下午</div>
                <ul role="listbox" aria-label="上下午" className="sofa-timepicker-list">
                  <li role="option" aria-selected={!isPM}>
                    <button
                      type="button"
                      tabIndex={-1}
                      className={className('sofa-timepicker-item', !isPM && 'sofa-timepicker-item-active')}
                      onClick={() => {
                        setIsPM(false)
                        commit(hour, minute, second, false)
                      }}
                    >
                      AM
                    </button>
                  </li>
                  <li role="option" aria-selected={isPM}>
                    <button
                      type="button"
                      tabIndex={-1}
                      className={className('sofa-timepicker-item', isPM && 'sofa-timepicker-item-active')}
                      onClick={() => {
                        setIsPM(true)
                        commit(hour, minute, second, true)
                      }}
                    >
                      PM
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  )
}

export default TimePicker