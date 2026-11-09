import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Form 表单：
 * FormStore 管理字段注册、取值、设值与校验；
 * Form.Item 通过 cloneElement 向唯一子元素注入受控属性；
 * 支持 rules 校验、校验时机、依赖重校验、重置与三种布局
 */

export type FieldPath = string | string[]

export interface FormRule {
  /** 必填校验 */
  required?: boolean
  /** 校验失败提示文案（required 或 validator 返回 false 时使用） */
  message?: string
  /** 自定义校验：返回 string 视为失败文案，boolean 表示通过/失败，支持 Promise */
  validator?: (
    value: unknown,
    getFieldValue: (name: FieldPath) => unknown
  ) => string | boolean | Promise<string | boolean>
}

export type FormValidateTrigger = 'onChange' | 'onBlur'

export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormSize = 'small' | 'default' | 'large'

export interface FormValidateResult {
  /** 各失败字段的错误文案（字段路径为键） */
  errorFields: Record<string, string[]>
  /** 校验时的表单值 */
  values: Record<string, unknown>
}

export interface FormInstance {
  /** 读取单个字段值，支持 'a.b' 或数组路径 */
  getFieldValue: (name: FieldPath) => unknown
  /** 读取字段值（不传 nameList 返回全部值） */
  getFieldsValue: (nameList?: FieldPath[]) => Record<string, unknown>
  /** 批量设值 */
  setFieldsValue: (values: Record<string, unknown>) => void
  /** 重置字段到 initialValues（可指定字段） */
  resetFields: (nameList?: FieldPath[]) => void
  /** 校验全部或指定字段，失败时以 FormValidateResult 拒绝 */
  validateFields: (nameList?: FieldPath[]) => Promise<Record<string, unknown>>
  /** 提交：全量校验后触发注册的成功/失败回调 */
  submit: () => void
  /** 注册提交成功回调（会被 Form 的 onFinish 覆盖） */
  onFinish: (values: Record<string, unknown>) => void
  /** 注册提交失败回调（会被 Form 的 onFinishFailed 覆盖） */
  onFinishFailed: (errorFields: Record<string, string[]>) => void
}

/** 字段注册单元：由 Form.Item 创建并注册到 Store */
interface FieldEntity {
  namePath: string[]
  nameKey: string
  rules: FormRule[]
  validateTrigger: FormValidateTrigger
  dependencies: string[]
  /** 触发字段所在组件重渲染 */
  refresh: () => void
}

interface FinishHandlers {
  onFinish?: (values: Record<string, unknown>) => void
  onFinishFailed?: (errorFields: Record<string, string[]>) => void
}

/** 路径工具：'a.b' 与 ['a','b'] 统一为字符串数组 */
function toPath(name: FieldPath): string[] {
  if (Array.isArray(name)) return name.map(String)
  return name === '' ? [] : name.split('.')
}

function pathKey(path: string[]): string {
  return path.join('.')
}

function getPath(obj: Record<string, unknown>, path: string[]): unknown {
  let cur: unknown = obj
  for (const seg of path) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[seg]
  }
  return cur
}

function setPath(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown
): Record<string, unknown> {
  if (path.length === 0) return obj
  const next = { ...obj }
  const [head, ...rest] = path
  if (rest.length === 0) {
    next[head] = value
    return next
  }
  const child = (obj[head] ?? {}) as Record<string, unknown>
  next[head] = setPath(child, rest, value)
  return next
}

function assignPath(target: Record<string, unknown>, path: string[], value: unknown): void {
  let cur = target
  path.forEach((seg, i) => {
    if (i === path.length - 1) {
      cur[seg] = value
      return
    }
    const next = (cur[seg] ?? {}) as Record<string, unknown>
    cur[seg] = next
    cur = next
  })
}

/** 执行单条规则，返回错误文案列表 */
async function runRule(
  rule: FormRule,
  value: unknown,
  getFieldValue: (name: FieldPath) => unknown
): Promise<string[]> {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return [rule.message ?? '该字段为必填项']
  }
  if (!rule.validator) return []
  const result = await rule.validator(value, getFieldValue)
  if (typeof result === 'string') {
    return result ? [result] : []
  }
  if (result === false) {
    return [rule.message ?? '校验失败']
  }
  return []
}

/** 表单核心状态机：字段注册、值存取、校验、依赖联动 */
class FormStore {
  private values: Record<string, unknown> = {}
  private initialValues: Record<string, unknown> = {}
  private entities = new Map<string, FieldEntity>()
  private errors: Record<string, string[]> = {}
  private validatedOk = new Set<string>()
  private initialized = false
  private handlers: FinishHandlers = {}

  /** 注册字段单元 */
  register = (entity: FieldEntity): void => {
    this.entities.set(entity.nameKey, entity)
  }

  /** 注销字段单元并清理其错误状态 */
  unregister = (nameKey: string): void => {
    this.entities.delete(nameKey)
    delete this.errors[nameKey]
    this.validatedOk.delete(nameKey)
  }

  /** 注入初始值：仅在尚未初始化时使用 */
  setInitialValues = (init?: Record<string, unknown>): void => {
    this.initialValues = init ? { ...init } : {}
    if (!this.initialized && Object.keys(this.values).length === 0) {
      this.values = { ...this.initialValues }
    }
  }

  /** 注册提交回调（Form 每次渲染都会覆盖） */
  setCallbacks = (handlers: FinishHandlers): void => {
    if (handlers.onFinish) this.handlers.onFinish = handlers.onFinish
    if (handlers.onFinishFailed) this.handlers.onFinishFailed = handlers.onFinishFailed
  }

  getFieldValue = (name: FieldPath): unknown => getPath(this.values, toPath(name))

  getFieldsValue = (nameList?: FieldPath[]): Record<string, unknown> => {
    if (!nameList) return { ...this.values }
    const result: Record<string, unknown> = {}
    nameList.forEach((n) => {
      const p = toPath(n)
      assignPath(result, p, getPath(this.values, p))
    })
    return result
  }

  /** 单个字段设值并通知 */
  setFieldValue = (name: FieldPath, value: unknown): void => {
    const p = toPath(name)
    this.values = setPath(this.values, p, value)
    this.initialized = true
    this.notify([pathKey(p)])
  }

  /** 批量设值 */
  setFieldsValue = (values: Record<string, unknown>): void => {
    let next = { ...this.values }
    Object.entries(values).forEach(([k, v]) => {
      next = setPath(next, k.split('.'), v)
    })
    this.values = next
    this.initialized = true
    this.notify(this.keysAffectedBy(Object.keys(values)))
  }

  /** 重置字段到 initialValues */
  resetFields = (nameList?: FieldPath[]): void => {
    const keys =
      nameList !== undefined
        ? nameList.map((n) => pathKey(toPath(n)))
        : [...this.entities.keys()]
    let next = { ...this.values }
    keys.forEach((k) => {
      const p = k.split('.')
      next = setPath(next, p, getPath(this.initialValues, p))
    })
    this.values = next
    keys.forEach((k) => {
      delete this.errors[k]
      this.validatedOk.delete(k)
    })
    this.notify(keys)
  }

  /** 单一字段的错误文案 */
  getFieldError = (name: FieldPath): string[] =>
    this.errors[pathKey(toPath(name))] ?? []

  /** 字段是否已通过过至少一次校验（供 hasFeedback 使用） */
  isValidatedOk = (name: FieldPath): boolean => this.validatedOk.has(pathKey(toPath(name)))

  /** 校验字段，并联动重校验声明依赖它的字段 */
  validateWithDependents = async (name: FieldPath): Promise<string[]> => {
    const errors = await this.validateField(name)
    this.revalidateDependents(pathKey(toPath(name)))
    return errors
  }

  /** 校验单个字段并通知，返回错误文案 */
  validateField = async (name: FieldPath): Promise<string[]> => {
    const p = toPath(name)
    const key = pathKey(p)
    const entity = this.entities.get(key)
    if (!entity || entity.rules.length === 0) {
      delete this.errors[key]
      return []
    }
    const value = getPath(this.values, p)
    const ruleResults = await Promise.all(
      entity.rules.map((r) => runRule(r, value, this.getFieldValue))
    )
    const errors = ruleResults.flat()
    if (errors.length > 0) {
      this.errors[key] = errors
      this.validatedOk.delete(key)
    } else {
      delete this.errors[key]
      this.validatedOk.add(key)
    }
    entity.refresh()
    return errors
  }

  /** 校验全部或指定字段，全部通过时返回表单值 */
  validateFields = async (nameList?: FieldPath[]): Promise<Record<string, unknown>> => {
    const paths =
      nameList !== undefined
        ? nameList.map((n) => toPath(n))
        : [...this.entities.keys()].map((k) => k.split('.'))
    const results = await Promise.all(paths.map((p) => this.validateField(p)))
    const errorFields: Record<string, string[]> = {}
    paths.forEach((p, i) => {
      if (results[i].length > 0) errorFields[pathKey(p)] = results[i]
    })
    const values = this.getFieldsValue()
    if (Object.keys(errorFields).length > 0) {
      return Promise.reject({ errorFields, values } satisfies FormValidateResult)
    }
    return Promise.resolve(values)
  }

  /** 提交：全量校验，成功/失败分发到注册回调 */
  submit = (): void => {
    void this.validateFields()
      .then((values) => {
        this.invokeFinish(values)
      })
      .catch((result: FormValidateResult) => {
        this.invokeFinishFailed(result.errorFields)
      })
  }

  /** 触发已注册的成功回调 */
  invokeFinish = (values: Record<string, unknown>): void => {
    this.handlers.onFinish?.(values)
  }

  /** 触发已注册的失败回调 */
  invokeFinishFailed = (errorFields: Record<string, string[]>): void => {
    this.handlers.onFinishFailed?.(errorFields)
  }

  /** 依赖重校验：变更字段触发其他字段校验 */
  revalidateDependents = (nameKey: string): void => {
    this.entities.forEach((entity) => {
      if (entity.dependencies.includes(nameKey)) {
        void this.validateField(entity.namePath)
      }
    })
  }

  /** 找出 key 列表影响到的字段（含嵌套子路径） */
  private keysAffectedBy(keys: string[]): string[] {
    const result: string[] = []
    this.entities.forEach((_, k) => {
      if (keys.some((key) => k === key || k.startsWith(`${key}.`))) result.push(k)
    })
    return result
  }

  private notify(keyList: string[]): void {
    this.entities.forEach((entity) => {
      if (keyList.includes(entity.nameKey)) entity.refresh()
    })
  }
}

/** useForm 返回的实例对象（TypeScript 内携带 store，公开类型不暴露） */
type FormInstanceInternal = FormInstance & { store: FormStore }

interface FormContextValue {
  store: FormStore
  layout: FormLayout
  size: FormSize
  labelWidth?: number | string
  requiredMark: boolean | 'optional'
  disabled: boolean
}

const FormContext = createContext<FormContextValue | null>(null)

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange' | 'onReset'> {
  /** 表单实例（useForm 创建） */
  form?: FormInstance
  /** 初始值 */
  initialValues?: Record<string, unknown>
  /** 提交成功（全部字段校验通过）回调 */
  onFinish?: (values: Record<string, unknown>) => void
  /** 提交失败（存在校验错误）回调 */
  onFinishFailed?: (errorFields: Record<string, string[]>) => void
  /** 标签宽度（数字为 px） */
  labelWidth?: number | string
  /** 布局方式 */
  layout?: FormLayout
  /** 尺寸 */
  size?: FormSize
  /** 必填标记：true 显示星号；'optional' 额外显示「（可选）」 */
  requiredMark?: boolean | 'optional'
  /** 整表禁用：向所有字段的子元素传播 */
  disabled?: boolean
  children?: React.ReactNode
}

export function useForm(): [FormInstance] {
  const storeRef = useRef<FormStore | null>(null)
  if (!storeRef.current) storeRef.current = new FormStore()
  const store = storeRef.current
  const instance = useMemo<FormInstanceInternal>(
    () => ({
      store,
      getFieldValue: store.getFieldValue,
      getFieldsValue: store.getFieldsValue,
      setFieldsValue: store.setFieldsValue,
      resetFields: store.resetFields,
      validateFields: store.validateFields,
      submit: store.submit,
      onFinish: store.invokeFinish,
      onFinishFailed: store.invokeFinishFailed
    }),
    [store]
  )
  return [instance]
}

function FormImpl({
  form,
  initialValues,
  onFinish,
  onFinishFailed,
  labelWidth,
  layout = 'horizontal',
  size = 'default',
  requiredMark = true,
  disabled = false,
  children,
  className: cls,
  style,
  ...rest
}: FormProps) {
  const [innerForm] = useForm()
  const formInstance = (form ?? innerForm) as FormInstanceInternal
  const store = formInstance.store

  // 每次渲染同步回调与初始值（引用型赋值，不触发额外渲染）
  store.setCallbacks({ onFinish, onFinishFailed })
  store.setInitialValues(initialValues)

  const contextValue = useMemo<FormContextValue>(
    () => ({ store, layout, size, labelWidth, requiredMark, disabled }),
    [store, layout, size, labelWidth, requiredMark, disabled]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      store.submit()
    },
    [store]
  )

  return (
    <FormContext.Provider value={contextValue}>
      <form
        className={className(
          'sofa-form',
          `sofa-form-${layout}`,
          `sofa-form-${size}`,
          { 'sofa-form-disabled': disabled },
          cls
        )}
        style={style}
        onSubmit={handleSubmit}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

export interface FormItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 字段名：支持 'a.b' 或数组路径 */
  name?: FieldPath
  /** 标签 */
  label?: React.ReactNode
  /** 校验规则 */
  rules?: FormRule[]
  /** 字段级校验时机，覆盖默认值 */
  validateTrigger?: FormValidateTrigger
  /** 校验通过后的附加说明（常驻展示） */
  extra?: React.ReactNode
  /** 手动帮助文案（无校验错误时展示） */
  help?: React.ReactNode
  /** 显示成功/失败的反馈图标 */
  hasFeedback?: boolean
  /** 依赖字段：依赖变化时重新校验当前字段 */
  dependencies?: FieldPath | FieldPath[]
  /** 唯一受控子元素（注入 value/onChange/onBlur） */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function FormItemImpl({
  name,
  label,
  rules = [],
  validateTrigger = 'onChange',
  extra,
  help,
  hasFeedback = false,
  dependencies,
  children,
  className: cls,
  style
}: FormItemProps) {
  const ctx = useContext(FormContext)
  const fallbackStoreRef = useRef<FormStore | null>(null)
  if (!fallbackStoreRef.current) fallbackStoreRef.current = new FormStore()
  const store = ctx?.store ?? fallbackStoreRef.current

  const layout = ctx?.layout ?? 'horizontal'
  const labelWidth = ctx?.labelWidth
  const disabled = ctx?.disabled ?? false

  const namePath = useMemo(() => (name !== undefined ? toPath(name) : []), [name])
  const nameKey = namePath.join('.')

  const depKeys = useMemo<string[]>(() => {
    if (dependencies === undefined) return []
    const list = Array.isArray(dependencies) ? dependencies : [dependencies]
    return list.map((d) => pathKey(toPath(d)))
  }, [dependencies])

  const [, setTick] = useState(0)
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  // 注册单元：挂载时注册，卸载时注销；元数据随渲染同步
  const entityRef = useRef<FieldEntity | null>(null)
  if (!entityRef.current) {
    entityRef.current = {
      namePath,
      nameKey,
      rules,
      validateTrigger,
      dependencies: depKeys,
      refresh
    }
  }
  const entity = entityRef.current
  entity.namePath = namePath
  entity.nameKey = nameKey
  entity.rules = rules
  entity.validateTrigger = validateTrigger
  entity.dependencies = depKeys

  useEffect(() => {
    const current = entityRef.current
    if (!current) return
    store.register(current)
    return () => store.unregister(current.nameKey)
  }, [store])

  const errors = store.getFieldError(namePath)
  const hasError = errors.length > 0

  const handleChildChange = useCallback(
    (e: unknown) => {
      if (name === undefined) return
      const target = (e as { target?: { value?: unknown } }).target
      store.setFieldValue(namePath, target?.value)
      // 按字段校验时机即时校验，并联动依赖项
      if (validateTrigger === 'onChange') void store.validateWithDependents(namePath)
    },
    [name, namePath, store, validateTrigger]
  )

  const handleChildBlur = useCallback(() => {
    if (name === undefined) return
    if (validateTrigger === 'onBlur') void store.validateWithDependents(namePath)
  }, [name, namePath, store, validateTrigger])

  // 受控注入：将 value/onChange/onBlur 注入唯一子元素
  let control = children
  if (name !== undefined && isValidElement(children)) {
    const childElement = children as React.ReactElement
    const childProps: Record<string, unknown> = {
      value: store.getFieldValue(namePath),
      onChange: handleChildChange,
      onBlur: handleChildBlur
    }
    if (disabled) childProps.disabled = true
    if (hasError) {
      const originalClass = (childElement.props as Record<string, unknown>).className
      childProps.className = className(
        originalClass as string | undefined,
        'sofa-form-item-error-input'
      )
      if ('status' in childElement.props) childProps.status = 'error'
    }
    control = cloneElement(childElement, childProps)
  }

  const required = rules.some((r) => r.required)
  const mark = ctx?.requiredMark ?? true
  const showOptional = mark === 'optional' && rules.length > 0 && !required

  const explainContent = hasError
    ? errors[0]
    : help !== undefined
      ? help
      : extra !== undefined
        ? extra
        : null

  return (
    <div
      className={className(
        'sofa-form-item',
        {
          'sofa-form-item-vertical': layout === 'vertical',
          'sofa-form-item-inline': layout === 'inline',
          'sofa-form-item-has-error': hasError,
          'sofa-form-item-disabled': disabled,
          'sofa-form-item-no-label': label === undefined
        },
        cls
      )}
      style={style}
    >
      {label !== undefined && (
        <label
          className="sofa-form-item-label"
          style={
            labelWidth !== undefined && layout !== 'vertical'
              ? { width: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth }
              : undefined
          }
        >
          {mark !== false && required && (
            <span className="sofa-form-item-required-mark" aria-hidden="true">
              *
            </span>
          )}
          <span className="sofa-form-item-label-text">{label}</span>
          {showOptional && <span className="sofa-form-item-optional">（可选）</span>}
        </label>
      )}
      <div className="sofa-form-item-control">
        <div
          className={className('sofa-form-item-control-input', {
            'sofa-form-item-control-feedback': hasFeedback
          })}
        >
          {control}
          {hasFeedback && (
            <span
              className={className(
                'sofa-form-item-feedback-icon',
                hasError
                  ? 'sofa-form-item-feedback-error'
                  : 'sofa-form-item-feedback-success'
              )}
            >
              <Icon type={hasError ? 'error-circle' : 'check-circle'} size={14} />
            </span>
          )}
        </div>
        {explainContent !== null && (
          <div
            className={className('sofa-form-item-explain', {
              'sofa-form-item-explain-error': hasError
            })}
          >
            {explainContent}
          </div>
        )}
      </div>
    </div>
  )
}

export const Form = Object.assign(FormImpl, {
  Item: FormItemImpl,
  useForm
})

export default Form