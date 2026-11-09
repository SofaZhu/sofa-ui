import { useCallback, useEffect, useState } from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Image 图片：
 * 点击全屏预览（缩放 0.5~3 倍 / 旋转 90°）/ 加载占位 / 失败回退 / 独立预览图源
 * 预览层固定定位 + 遮罩，ESC 或点击遮罩关闭
 */

export type ImageStatus = 'loading' | 'loaded' | 'error'

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onClick' | 'onError'> {
  /** 图片地址 */
  src: string
  /** 是否可点击预览（默认 true） */
  preview?: boolean
  /** 加载失败占位内容 */
  fallback?: React.ReactNode
  /** 加载中占位内容 */
  placeholder?: React.ReactNode
  /** 预览使用的大图地址（默认与 src 相同） */
  previewSrc?: string
  /** 预览打开回调 */
  onPreviewOpen?: () => void
  /** 预览关闭回调 */
  onPreviewClose?: () => void
}

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.25

export function Image({
  src,
  preview = true,
  fallback,
  placeholder,
  previewSrc,
  onPreviewOpen,
  onPreviewClose,
  alt = '',
  className: cls,
  style,
  ...rest
}: ImageProps) {
  const [status, setStatus] = useState<ImageStatus>('loading')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  // 图源变化时回到加载态并重置预览变换
  useEffect(() => {
    setStatus('loading')
    setScale(1)
    setRotate(0)
  }, [src])

  const handleLoad = useCallback(() => {
    setStatus('loaded')
  }, [])

  const handleError = useCallback(() => {
    setStatus('error')
  }, [])

  const openPreview = useCallback(() => {
    if (!preview) return
    setPreviewOpen(true)
    setScale(1)
    setRotate(0)
    onPreviewOpen?.()
  }, [preview, onPreviewOpen])

  const closePreview = useCallback(() => {
    setPreviewOpen(false)
    onPreviewClose?.()
  }, [onPreviewClose])

  // 预览打开时支持 ESC 关闭
  useEffect(() => {
    if (!previewOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [previewOpen, closePreview])

  const zoom = useCallback((delta: number) => {
    setScale((prev) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta)))
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      zoom(e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP)
    },
    [zoom]
  )

  const rotateStep = useCallback(() => {
    setRotate((prev) => (prev + 90) % 360)
  }, [])

  return (
    <div className={className('sofa-image', cls)} style={style} {...rest}>
      {status === 'error' ? (
        fallback != null ? (
          <div className="sofa-image-fallback">{fallback}</div>
        ) : (
          <div className="sofa-image-fallback sofa-image-fallback-broken">
            <Icon type="warning-triangle" size={24} />
          </div>
        )
      ) : (
        <>
          {status === 'loading' && placeholder != null && (
            <div className="sofa-image-placeholder">{placeholder}</div>
          )}
          <img
            className="sofa-image-img"
            src={src}
            alt={alt}
            draggable={false}
            onLoad={handleLoad}
            onError={handleError}
            onClick={openPreview}
            style={{ cursor: preview ? 'zoom-in' : undefined }}
          />
        </>
      )}

      {previewOpen && (
        <div
          className="sofa-image-preview"
          onWheel={handleWheel}
          onClick={closePreview}
          role="dialog"
          aria-label="图片预览"
        >
          <div className="sofa-image-preview-mask" />
          <img
            className="sofa-image-preview-img"
            src={previewSrc ?? src}
            alt={alt}
            draggable={false}
            style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="sofa-image-preview-toolbar" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="缩小"
              className="sofa-image-preview-tool"
              disabled={scale <= MIN_SCALE}
              onClick={() => zoom(-SCALE_STEP)}
            >
              <Icon type="minus" size={14} />
            </button>
            <span className="sofa-image-preview-scale">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              aria-label="放大"
              className="sofa-image-preview-tool"
              disabled={scale >= MAX_SCALE}
              onClick={() => zoom(SCALE_STEP)}
            >
              <Icon type="plus" size={14} />
            </button>
            <button type="button" aria-label="旋转" className="sofa-image-preview-tool" onClick={rotateStep}>
              <Icon type="refresh" size={14} />
            </button>
          </div>
          <button
            type="button"
            aria-label="关闭预览"
            className="sofa-image-preview-close"
            onClick={closePreview}
          >
            <Icon type="close" size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Image