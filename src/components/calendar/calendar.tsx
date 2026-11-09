import { useCallback, useEffect, useMemo, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Calendar 日历：
 * 月/年双面板 + 日期/月份单元格自定义渲染 + 禁用日期 + 选中回传
 * 周起始为周一，每周 7 列、共 6 周
 */

export type CalendarMode = 'month' | 'year'

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'onSelect'> {
  /** 受控选中日期 */
  value?: Date
  /** 默认选中日期 */
  defaultValue?: Date
  /** 选中变化回调 */
  onChange?: (date: Date) => void
  /** 全屏大日历（默认 true），false 为紧凑卡片 */
  fullscreen?: boolean
  /** 日期单元格自定义渲染 */
  dateCellRender?: (date: Date) => React.ReactNode
  /** 年份面板的月份单元格自定义渲染 */
  monthCellRender?: (date: Date) => React.ReactNode
  /** 禁用日期判断 */
  disabledDate?: (date: Date) => boolean
  /** 点击单元格回调 */
  onSelect?: (date: Date) => void
  /** 受控面板模式 */
  mode?: CalendarMode
  /** 默认面板模式 */
  defaultMode?: CalendarMode
  /** 面板模式变化回调 */
  onPanelChange?: (mode: CalendarMode, value: Date) => void
}

const WEEK_HEADERS = ['一', '二', '三', '四', '五', '六', '日']

/** 生成某月 6 周（周一开头）的日期网格 */
function getMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return d
  })
}

/** 年月日是否相同 */
function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({
  value,
  defaultValue,
  onChange,
  fullscreen = true,
  dateCellRender,
  monthCellRender,
  disabledDate,
  onSelect,
  mode,
  defaultMode = 'month',
  onPanelChange,
  className: cls,
  style,
  ...rest
}: CalendarProps) {
  const [innerValue, setInnerValue, isValueControlled] = useControlled(value, defaultValue ?? new Date())
  const [panelMode, setPanelMode, isModeControlled] = useControlled(mode, defaultMode)
  const [panelDate, setPanelDate] = useState(() => new Date(innerValue.getFullYear(), innerValue.getMonth(), 1))
  const now = new Date()

  // 外部受控值变化时，面板跟随到对应月份
  useEffect(() => {
    if (value != null) setPanelDate(new Date(value.getFullYear(), value.getMonth(), 1))
  }, [value])

  const panelYear = panelDate.getFullYear()
  const panelMonth = panelDate.getMonth()
  const selectedValue = innerValue

  const grid = useMemo(() => getMonthGrid(panelYear, panelMonth), [panelYear, panelMonth])

  const toggleMode = useCallback(() => {
    const nextMode: CalendarMode = panelMode === 'month' ? 'year' : 'month'
    if (!isModeControlled) setPanelMode(nextMode)
    onPanelChange?.(nextMode, panelDate)
  }, [panelMode, isModeControlled, setPanelMode, onPanelChange, panelDate])

  const navigatePanel = useCallback(
    (delta: number) => {
      const next = new Date(panelDate)
      if (panelMode === 'month') next.setMonth(next.getMonth() + delta)
      else next.setFullYear(next.getFullYear() + delta)
      setPanelDate(next)
    },
    [panelDate, panelMode]
  )

  const selectDate = useCallback(
    (date: Date) => {
      if (disabledDate?.(date)) return
      setPanelDate(new Date(date.getFullYear(), date.getMonth(), 1))
      if (!isValueControlled) setInnerValue(date)
      onChange?.(date)
      onSelect?.(date)
    },
    [disabledDate, isValueControlled, setInnerValue, onChange, onSelect]
  )

  const selectMonth = useCallback(
    (month: number) => {
      const date = new Date(panelYear, month, 1)
      setPanelDate(date)
      if (panelMode === 'year') {
        const nextMode: CalendarMode = 'month'
        if (!isModeControlled) setPanelMode(nextMode)
        onPanelChange?.(nextMode, date)
      }
      if (!isValueControlled) setInnerValue(date)
      onChange?.(date)
      onSelect?.(date)
    },
    [panelYear, panelMode, isModeControlled, setPanelMode, onPanelChange, isValueControlled, setInnerValue, onChange, onSelect]
  )

  const labelText = panelMode === 'month' ? `${panelYear} 年 ${panelMonth + 1} 月` : `${panelYear} 年`

  return (
    <div
      className={className(
        'sofa-calendar',
        fullscreen ? 'sofa-calendar-fullscreen' : 'sofa-calendar-card',
        cls
      )}
      style={style}
      role="grid"
      {...rest}
    >
      <div className="sofa-calendar-header">
        <button
          type="button"
          className="sofa-calendar-nav-btn"
          aria-label="上一页"
          onClick={() => navigatePanel(-1)}
        >
          <Icon type="chevron-left" size={14} />
        </button>
        <button type="button" className="sofa-calendar-label" onClick={toggleMode}>
          {labelText}
        </button>
        <button
          type="button"
          className="sofa-calendar-nav-btn"
          aria-label="下一页"
          onClick={() => navigatePanel(1)}
        >
          <Icon type="chevron-right" size={14} />
        </button>
      </div>

      {panelMode === 'month' ? (
        <>
          <div className="sofa-calendar-week-row">
            {WEEK_HEADERS.map((w) => (
              <span key={w} className="sofa-calendar-week-cell">
                {w}
              </span>
            ))}
          </div>
          <div className="sofa-calendar-body">
            <div className="sofa-calendar-grid">
              {grid.map((cell) => {
                const inMonth = cell.getMonth() === panelMonth
                const isToday = isSameDate(cell, now)
                const isSelected = isSameDate(cell, selectedValue)
                const disabled = disabledDate?.(cell) ?? false
                return (
                  <div
                    key={cell.toISOString()}
                    role="gridcell"
                    className={className('sofa-calendar-cell', {
                      'sofa-calendar-cell-out': !inMonth,
                      'sofa-calendar-cell-today': isToday,
                      'sofa-calendar-cell-selected': isSelected,
                      'sofa-calendar-cell-disabled': disabled
                    })}
                  >
                    <button
                      type="button"
                      className="sofa-calendar-date-btn"
                      disabled={disabled}
                      aria-label={`${cell.getFullYear()}年${cell.getMonth() + 1}月${cell.getDate()}日`}
                      onClick={() => selectDate(cell)}
                    >
                      <span className="sofa-calendar-date-value">{cell.getDate()}</span>
                      {dateCellRender != null && (
                        <span className="sofa-calendar-date-content">{dateCellRender(cell)}</span>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="sofa-calendar-year-grid">
          {Array.from({ length: 12 }, (_, m) => {
            const date = new Date(panelYear, m, 1)
            const isSelected = selectedValue.getFullYear() === panelYear && selectedValue.getMonth() === m
            const isCurrent = now.getFullYear() === panelYear && now.getMonth() === m
            return (
              <div
                key={m}
                role="gridcell"
                className={className('sofa-calendar-month-cell', {
                  'sofa-calendar-month-cell-selected': isSelected,
                  'sofa-calendar-month-cell-current': isCurrent
                })}
              >
                <button
                  type="button"
                  className="sofa-calendar-month-btn"
                  onClick={() => selectMonth(m)}
                >
                  <span className="sofa-calendar-month-label">{m + 1} 月</span>
                  {monthCellRender != null && (
                    <span className="sofa-calendar-month-content">{monthCellRender(date)}</span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Calendar