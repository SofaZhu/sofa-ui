import { useCallback, useRef, useState } from 'react'

/**
 * 受控 / 非受控双模式状态管理：
 * 当外部传入 value 时保持受控，否则内部自治
 */
export function useControlled<T>(
  controlled: T | undefined,
  defaultValue: T
): [T, (next: T) => void, boolean] {
  const [innerValue, setInnerValue] = useState<T>(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : innerValue
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInnerValue(next)
    },
    [isControlled]
  )
  return [value, setValue, isControlled]
}

/** 记录最近一次值，供回调在闭包外读取最新状态 */
export function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}