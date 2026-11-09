import { useCallback, useEffect, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'
import { message } from '../message/message'

/**
 * Upload 文件上传：
 * 受控文件列表、multipart 上传、进度、拖拽、缩略图、限数与失败重试
 */

export interface UploadFile {
  /** 唯一标识 */
  uid: string
  /** 文件名 */
  name: string
  /** 文件大小（字节） */
  size?: number
  /** 上传状态 */
  status?: 'uploading' | 'done' | 'error'
  /** 上传进度（0-100） */
  percent?: number
  /** 文件地址（如服务端返回） */
  url?: string
}

export interface UploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'onProgress'> {
  /** 受控文件列表 */
  fileList?: UploadFile[]
  /** 默认文件列表 */
  defaultFileList?: UploadFile[]
  /** 列表变化回调（每次增删或状态变化触发） */
  onChange?: (fileList: UploadFile[], file: UploadFile) => void
  /** 上传地址（为空时仅本地回传，不发请求） */
  action?: string
  /** 上传请求头 */
  headers?: Record<string, string>
  /** 上传进度回调 */
  onProgress?: (percent: number, file: UploadFile) => void
  /** 上传成功回调 */
  onSuccess?: (file: UploadFile) => void
  /** 上传失败回调 */
  onError?: (file: UploadFile) => void
  /** 上传前钩子：返回 false 拒绝，返回 File 替换原文件，支持 Promise */
  beforeUpload?: (file: File) => boolean | Promise<File | boolean>
  /** 允许的文件类型 */
  accept?: string
  /** 多选 */
  multiple?: boolean
  /** 最大文件数，超出拒绝并提示 */
  maxCount?: number
  /** 禁用 */
  disabled?: boolean
  /** 列表形态：text 文本 / picture 缩略图 */
  listType?: 'text' | 'picture'
  /** 拖拽上传模式 */
  drag?: boolean
  /** 移除文件回调 */
  onRemove?: (file: UploadFile) => void
  /** 自定义触发区内容 */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

let uidSeed = 0
function genUid(): string {
  uidSeed += 1
  return `sofa-upload-${Date.now()}-${uidSeed}`
}

export function Upload({
  fileList,
  defaultFileList,
  onChange,
  action,
  headers,
  onProgress,
  onSuccess,
  onError,
  beforeUpload,
  accept,
  multiple = false,
  maxCount,
  disabled = false,
  listType = 'text',
  drag = false,
  onRemove,
  children,
  className: cls,
  style,
  ...rest
}: UploadProps) {
  const [, setInnerList, isControlled] = useControlled<UploadFile[]>(
    fileList,
    defaultFileList ?? []
  )
  const listRef = useRef<UploadFile[]>(isControlled ? fileList ?? [] : defaultFileList ?? [])
  const latest = useLatest({ onChange, onProgress, onSuccess, onError, onRemove, beforeUpload, action, headers })
  const inputRef = useRef<HTMLInputElement | null>(null)
  const originFiles = useRef(new Map<string, File>())
  const [dragging, setDragging] = useState(false)

  // 受控模式下外部列表变化时同步内部引用
  useEffect(() => {
    if (isControlled) listRef.current = fileList ?? []
  }, [isControlled, fileList])

  /** 统一更新列表：写引用 + 更新状态 */
  const applyList = useCallback(
    (mutate: (prev: UploadFile[]) => UploadFile[]) => {
      const next = mutate(listRef.current)
      listRef.current = next
      if (!isControlled) setInnerList(next)
      return next
    },
    [isControlled]
  )

  /** 局部更新某个文件的状态字段 */
  const patchFile = useCallback(
    (uid: string, patch: Partial<UploadFile>) => {
      applyList((prev) => prev.map((f) => (f.uid === uid ? { ...f, ...patch } : f)))
    },
    [applyList]
  )

  /** 执行单文件上传：无 action 直接置为完成态 */
  const uploadOne = useCallback(
    (item: UploadFile) => {
      const origin = originFiles.current.get(item.uid)
      const { action: url } = latest.current
      if (!url || !origin) {
        patchFile(item.uid, { status: 'done', percent: 100 })
        const done = { ...item, status: 'done', percent: 100 } as UploadFile
        latest.current.onChange?.(listRef.current, done)
        latest.current.onSuccess?.(done)
        return
      }
      try {
        const formData = new FormData()
        formData.append('file', origin)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)
        const headerMap = latest.current.headers ?? {}
        Object.entries(headerMap).forEach(([k, v]) => xhr.setRequestHeader(k, v))
        xhr.upload.onprogress = (e: ProgressEvent) => {
          if (e.lengthComputable && e.total > 0) {
            const percent = Math.round((e.loaded / e.total) * 100)
            patchFile(item.uid, { status: 'uploading', percent })
            const next = { ...item, status: 'uploading', percent } as UploadFile
            latest.current.onProgress?.(percent, next)
            latest.current.onChange?.(listRef.current, next)
          }
        }
        xhr.onload = () => {
          const ok = xhr.status >= 200 && xhr.status < 300
          if (ok) {
            patchFile(item.uid, { status: 'done', percent: 100 })
            const done = { ...item, status: 'done', percent: 100 } as UploadFile
            latest.current.onSuccess?.(done)
            latest.current.onChange?.(listRef.current, done)
          } else {
            patchFile(item.uid, { status: 'error', percent: 0 })
            const failed = { ...item, status: 'error' } as UploadFile
            latest.current.onError?.(failed)
            latest.current.onChange?.(listRef.current, failed)
          }
        }
        xhr.onerror = () => {
          patchFile(item.uid, { status: 'error' })
          const failed = { ...item, status: 'error' } as UploadFile
          latest.current.onError?.(failed)
          latest.current.onChange?.(listRef.current, failed)
        }
        xhr.send(formData)
      } catch (err) {
        console.error('上传失败:', err)
        patchFile(item.uid, { status: 'error' })
        const failed = { ...item, status: 'error' } as UploadFile
        latest.current.onError?.(failed)
        latest.current.onChange?.(listRef.current, failed)
      }
    },
    [latest, patchFile]
  )

  /** 新增文件：beforeUpload 拦截 + maxCount 限数 */
  const addFiles = useCallback(
    async (rawFiles: File[]) => {
      if (disabled) return
      const accepted: File[] = []
      for (const raw of rawFiles) {
        let res: boolean | File = raw
        if (latest.current.beforeUpload) {
          try {
            res = await latest.current.beforeUpload(raw)
          } catch (err) {
            console.error('beforeUpload 执行失败:', err)
            res = false
          }
        }
        if (res === false) continue
        accepted.push(res instanceof File ? res : raw)
      }
      if (accepted.length === 0) return

      const currentCount = listRef.current.length
      const over = maxCount !== undefined && currentCount + accepted.length > maxCount
      const taken = over ? accepted.slice(0, Math.max(maxCount! - currentCount, 0)) : accepted
      if (over && maxCount !== undefined) {
        message.warning(`最多上传 ${maxCount} 个文件，超出部分已忽略`)
      }
      if (taken.length === 0) return

      const items: UploadFile[] = taken.map((f) => ({
        uid: genUid(),
        name: f.name,
        size: f.size,
        status: 'uploading',
        percent: 0
      }))
      taken.forEach((f, i) => originFiles.current.set(items[i].uid, f))

      applyList((prev) => [...prev, ...items])
      items.forEach((item) => {
        latest.current.onChange?.(listRef.current, item)
        uploadOne(item)
      })
    },
    [disabled, latest, maxCount, applyList, uploadOne]
  )

  /** 隐藏 input 选择变化 */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return
      const picked = Array.from(files)
      e.target.value = ''
      void addFiles(picked)
    },
    [addFiles]
  )

  const handleRemove = useCallback(
    (item: UploadFile) => {
      if (disabled) return
      originFiles.current.delete(item.uid)
      applyList((prev) => prev.filter((f) => f.uid !== item.uid))
      latest.current.onRemove?.(item)
      latest.current.onChange?.(listRef.current, item)
    },
    [disabled, applyList, latest]
  )

  /** 失败文件重新上传 */
  const handleRetry = useCallback(
    (item: UploadFile) => {
      patchFile(item.uid, { status: 'uploading', percent: 0 })
      uploadOne({ ...item, status: 'uploading', percent: 0 })
    },
    [patchFile, uploadOne]
  )

  /** 拖拽事件：收集 DataTransfer.files */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (disabled) return
      const files = e.dataTransfer?.files
      if (files && files.length > 0) void addFiles(Array.from(files))
    },
    [disabled, addFiles]
  )

  const triggerInput = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={className('sofa-upload', { 'sofa-upload-disabled': disabled }, cls)}
      style={style}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        className="sofa-upload-input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label="选择文件"
        onChange={handleInputChange}
      />

      {children !== undefined ? (
        <button type="button" className="sofa-upload-trigger-custom" disabled={disabled} onClick={triggerInput}>
          {children}
        </button>
      ) : drag ? (
        <button
          type="button"
          className={className('sofa-upload-trigger sofa-upload-drag', {
            'sofa-upload-dragging': dragging
          })}
          disabled={disabled}
          onClick={triggerInput}
          onDragEnter={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragging(false)
          }}
          onDrop={handleDrop}
        >
          <Icon type="upload" size={28} className="sofa-upload-drag-icon" />
          <span className="sofa-upload-drag-text">点击或拖拽文件到此区域上传</span>
        </button>
      ) : (
        <button type="button" className="sofa-upload-trigger" disabled={disabled} onClick={triggerInput}>
          <Icon type="upload" size={13} />
          <span>点击上传</span>
        </button>
      )}

      {listRef.current.length > 0 && (
        <ul className="sofa-upload-list">
          {listRef.current.map((item) => (
            <li
              key={item.uid}
              className={className('sofa-upload-item', `sofa-upload-item-${listType}`)}
            >
              {listType === 'picture' ? (
                <PictureThumb item={item} origin={originFiles.current.get(item.uid)} />
              ) : (
                <span className="sofa-upload-item-icon">
                  <Icon type="file" size={14} />
                </span>
              )}

              <div className="sofa-upload-item-main">
                <div className="sofa-upload-item-row">
                  <span className="sofa-upload-item-name">
                    {item.status === 'error' ? (
                      <span className="sofa-upload-item-error-text">{item.name}</span>
                    ) : (
                      item.name
                    )}
                  </span>
                  <span className="sofa-upload-item-status">
                    {item.status === 'uploading' && (
                      <span className="sofa-upload-item-uploading">
                        <Icon type="loading" size={13} spin />
                        {item.percent !== undefined && `${item.percent}%`}
                      </span>
                    )}
                    {item.status === 'done' && (
                      <Icon type="check-circle" size={14} className="sofa-upload-item-done" />
                    )}
                    {item.status === 'error' && (
                      <Icon type="error-circle" size={14} className="sofa-upload-item-fail" />
                    )}
                  </span>
                  {!disabled && (
                    <>
                      {item.status === 'error' && (
                        <button
                          type="button"
                          className="sofa-upload-item-retry"
                          aria-label="重试上传"
                          onClick={() => handleRetry(item)}
                        >
                          <Icon type="refresh" size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="sofa-upload-item-remove"
                        aria-label="移除文件"
                        onClick={() => handleRemove(item)}
                      >
                        <Icon type="close" size={13} />
                      </button>
                    </>
                  )}
                </div>
                {item.status === 'uploading' && (
                  <div className="sofa-upload-progress">
                    <div
                      className="sofa-upload-progress-bar"
                      style={{ width: `${item.percent ?? 0}%` }}
                    />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="sofa-upload-item-fail-text">上传失败</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** 图片缩略图：优先本地对象 URL，点击预览新窗口 */
function PictureThumb({ item, origin }: { item: UploadFile; origin?: File }) {
  const [url, setUrl] = useState<string | undefined>(item.url)
  useEffect(() => {
    let objectUrl: string | null = null
    if (!item.url && origin && typeof URL.createObjectURL === 'function') {
      try {
        objectUrl = URL.createObjectURL(origin)
        setUrl(objectUrl)
      } catch {
        setUrl(undefined)
      }
    }
    return () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl)
        } catch {
          /* 忽略回收失败 */
        }
      }
    }
  }, [item.url, origin])

  return (
    <span
      className="sofa-upload-thumb"
      role="button"
      tabIndex={0}
      aria-label="预览图片"
      onClick={() => {
        if (url) {
          try {
            window.open(url)
          } catch {
            /* jsdom 等环境无 window.open 时忽略 */
          }
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && url) {
          e.preventDefault()
          try {
            window.open(url)
          } catch {
            /* 同上 */
          }
        }
      }}
    >
      {url ? (
        <img src={url} alt={item.name} className="sofa-upload-thumb-img" />
      ) : (
        <Icon type="file" size={18} />
      )}
    </span>
  )
}

export default Upload