import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { className } from '@/utils/classNames'
import { useLatest } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Carousel 走马灯：
 * 自动播放（悬停暂停）+ 指示点 + 左右箭头 + 滚动/淡入淡出效果 + 无限循环 + 键盘切换
 */

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** 是否自动播放 */
  autoplay?: boolean
  /** 自动播放间隔（毫秒） */
  interval?: number
  /** 指示点配置：false 隐藏，或 { position: 'top' | 'bottom' } */
  dots?: boolean | { position?: 'top' | 'bottom' }
  /** 是否显示左右箭头 */
  arrows?: boolean
  /** 切换效果：scroll 横向滑动 / fade 淡入淡出 */
  effect?: 'scroll' | 'fade'
  /** 是否无限循环 */
  infinite?: boolean
  /** 当前项变化回调（从 0 计） */
  onChange?: (current: number) => void
  /** 幻灯片内容（每个子元素一张） */
  children?: React.ReactNode
}

export function Carousel({
  autoplay = false,
  interval = 3000,
  dots = true,
  arrows = true,
  effect = 'scroll',
  infinite = false,
  onChange,
  children,
  className: cls,
  style,
  ...rest
}: CarouselProps) {
  const slides = useMemo(() => {
    // 递归展开子元素与 Fragment，保证每张幻灯片独立成项
    const collect = (nodes: React.ReactNode): React.ReactNode[] => {
      const result: React.ReactNode[] = []
      Children.forEach(nodes, (child) => {
        if (isValidElement(child)) {
          if (child.type === Fragment) {
            result.push(...collect(child.props.children))
          } else {
            result.push(child)
          }
        }
      })
      return result
    }
    return collect(children)
  }, [children])
  const n = slides.length

  // raw 下标可越界（±1），用于无限循环的克隆位跳转；normalized 为实际展示项
  const [raw, setRaw] = useState(0)
  const [noTransition, setNoTransition] = useState(false)
  const [hovering, setHovering] = useState(false)
  const rawRef = useLatest(raw)

  const normalized = ((raw % n) + n) % n

  const goTo = useCallback(
    (target: number) => {
      if (n === 0) return
      if (!infinite) {
        const clamped = Math.min(Math.max(target, 0), n - 1)
        setRaw(clamped)
        onChange?.(clamped)
        return
      }
      setRaw(target)
      onChange?.(((target % n) + n) % n)
    },
    [n, infinite, onChange]
  )

  const next = useCallback(() => goTo(raw + 1), [goTo, raw])
  const prev = useCallback(() => goTo(raw - 1), [goTo, raw])
  const nextRef = useLatest(next)
  const prevRef = useLatest(prev)

  // 自动播放：悬停时暂停，切换后重新计时
  useEffect(() => {
    if (!autoplay || n <= 1 || hovering) return
    const timer = setInterval(() => nextRef.current(), interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, n, hovering, raw, nextRef])

  // 无限循环滚动：过渡结束后瞬移到克隆位
  const handleTransitionEnd = useCallback(() => {
    if (!infinite || effect !== 'scroll') return
    const current = rawRef.current
    if (current === n) {
      setNoTransition(true)
      setRaw(0)
      requestAnimationFrame(() => setNoTransition(false))
    } else if (current === -1) {
      setNoTransition(true)
      setRaw(n - 1)
      requestAnimationFrame(() => setNoTransition(false))
    }
  }, [infinite, effect, n, rawRef])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextRef.current()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevRef.current()
      }
    },
    [nextRef, prevRef]
  )

  const dotPosition = typeof dots === 'object' ? (dots.position ?? 'bottom') : 'bottom'
  const showDots = dots !== false && n > 1
  const showArrows = arrows && n > 1

  // 滚动轨道：无限模式含首尾克隆，非无限直接平移
  const trackSlides = infinite ? [slides[n - 1], ...slides, slides[0]] : slides
  const trackCount = trackSlides.length
  const trackTransform =
    effect === 'fade'
      ? undefined
      : `translateX(${-(raw + (infinite ? 1 : 0)) * (100 / trackCount)}%)`

  return (
    <div
      className={className('sofa-carousel', `sofa-carousel-${effect}`, cls)}
      style={style}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...rest}
    >
      {dotPosition === 'top' && showDots && (
        <ul className="sofa-carousel-dots sofa-carousel-dots-top">
          {Array.from({ length: n }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`切换到第 ${i + 1} 张`}
                className={className('sofa-carousel-dot', { 'sofa-carousel-dot-active': i === normalized })}
                onClick={() => goTo(i)}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="sofa-carousel-viewport">
        <div
          className="sofa-carousel-track"
          style={{
            transform: trackTransform,
            transition: noTransition ? 'none' : 'transform 0.4s ease'
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {n === 0 ? (
            <div className="sofa-carousel-empty">暂无内容</div>
          ) : (
            trackSlides.map((slide, index) => {
              const displayIndex = infinite
                ? ((index - 1) % n + n) % n
                : index
              const active = displayIndex === normalized
              return (
                <div
                  key={infinite ? `clone-${index}` : index}
                  className={className('sofa-carousel-slide', { 'sofa-carousel-slide-active': active })}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`第 ${displayIndex + 1} 张，共 ${n} 张`}
                >
                  {slide}
                </div>
              )
            })
          )}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            className="sofa-carousel-arrow sofa-carousel-arrow-prev"
            aria-label="上一张"
            disabled={!infinite && normalized === 0}
            onClick={() => prevRef.current()}
          >
            <Icon type="chevron-left" size={16} />
          </button>
          <button
            type="button"
            className="sofa-carousel-arrow sofa-carousel-arrow-next"
            aria-label="下一张"
            disabled={!infinite && normalized === n - 1}
            onClick={() => nextRef.current()}
          >
            <Icon type="chevron-right" size={16} />
          </button>
        </>
      )}

      {dotPosition === 'bottom' && showDots && (
        <ul className="sofa-carousel-dots">
          {Array.from({ length: n }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`切换到第 ${i + 1} 张`}
                className={className('sofa-carousel-dot', { 'sofa-carousel-dot-active': i === normalized })}
                onClick={() => goTo(i)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Carousel