import { useEffect, useRef } from 'react'
import { className } from '@/utils/classNames'

/**
 * QRCode 组件：canvas 自绘二维码
 * - 完整实现 QR 编码（GF(256) 里德-所罗门纠错、掩码优化、格式/版本信息）
 * - 支持版本 1~10、字节模式（UTF-8）、容错级别 L/M/Q/H
 */

export type QRCodeLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 编码内容 */
  value: string
  /** 尺寸（px） */
  size?: number
  /** 前景色 */
  color?: string
  /** 背景色 */
  bgColor?: string
  /** 容错级别 */
  level?: QRCodeLevel
  /** 容错级别别名 */
  errorLevel?: QRCodeLevel
  /** 中心图标（不影响解码的装饰） */
  icon?: React.ReactNode
  /** 中心图标尺寸 */
  iconSize?: number
  muted?: never
}

/* ---------------------------------- 编码核心 ---------------------------------- */

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
;(function initGalois() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
})()

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a] + GF_LOG[b]]
}

/** 计算 RS 生成多项式系数 */
function rsGenerator(degree: number): Uint8Array {
  let poly = new Uint8Array([1])
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1)
    // 乘 (x + a^i)，a = 2
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i])
    }
    poly = next
  }
  return poly
}

/** 对数据块计算纠错码（综合除法） */
function rsEncode(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGenerator(ecCount)
  const result = new Uint8Array(data.length + ecCount)
  result.set(data)
  for (let i = 0; i < data.length; i++) {
    const coef = result[i]
    if (coef === 0) continue
    for (let j = 1; j < gen.length; j++) {
      result[i + j] ^= gfMul(gen[j], coef)
    }
  }
  return result
}

/* 分块信息：(错误修正码每块数, 组1块数, 组1每块数据, 组2块数, 组2每块数据) */
const ECC_TABLE: Record<QRCodeLevel, Array<[number, number, number, number, number]>> = {
  L: [[7, 1, 19, 0, 0], [10, 1, 34, 0, 0], [15, 1, 55, 0, 0], [20, 1, 80, 0, 0], [26, 1, 108, 0, 0], [18, 2, 68, 0, 0], [20, 2, 78, 0, 0], [24, 2, 97, 0, 0], [30, 2, 116, 0, 0], [18, 2, 68, 2, 69]],
  M: [[10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0], [24, 2, 43, 0, 0], [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44]],
  Q: [[13, 1, 13, 0, 0], [22, 1, 22, 0, 0], [18, 2, 17, 0, 0], [26, 2, 24, 0, 0], [18, 2, 15, 2, 16], [24, 4, 19, 0, 0], [18, 2, 14, 4, 15], [22, 4, 18, 2, 19], [20, 4, 16, 4, 17], [24, 6, 19, 2, 20]],
  H: [[17, 1, 9, 0, 0], [28, 1, 16, 0, 0], [22, 2, 13, 0, 0], [16, 4, 9, 0, 0], [22, 2, 11, 2, 12], [28, 4, 15, 0, 0], [26, 4, 13, 1, 14], [26, 4, 14, 2, 15], [24, 4, 12, 4, 13], [28, 6, 15, 2, 16]]
}

const ALIGNMENT_POSITIONS: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50]
]

/* 格式信息（15 位，索引 = ecLevelBits(2) << 3 | mask(3)） */
const FORMAT_INFO: number[] = [
  0x5412, 0x5125, 0x5e7c, 0x5b4b, 0, 0, 0, 0,
  0x77c4, 0x72f3, 0x7daa, 0x789d, 0, 0, 0, 0,
  0x1689, 0x13be, 0x1ce7, 0x19d0, 0, 0, 0, 0,
  0x355f, 0x3068, 0x3f31, 0x3a06, 0, 0, 0, 0
]

/* 版本信息 18 位（v7~10） */
const VERSION_INFO: Record<number, number> = {
  7: 0x07c94,
  8: 0x085bc,
  9: 0x09a99,
  10: 0x0a4d3
}

const EC_LEVEL_BITS: Record<QRCodeLevel, number> = { L: 1, M: 0, Q: 3, H: 2 }

const REMAINDER_BITS: Record<number, number> = { 1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 0, 8: 0, 9: 0, 10: 0 }

function utf8Encode(text: string): Uint8Array {
  const bytes: number[] = []
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0
    if (code < 0x80) bytes.push(code)
    else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    else if (code < 0x10000) bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    else bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
  }
  return new Uint8Array(bytes)
}

/** 由数据长度与容错级别挑选最小可用版本 */
function chooseVersion(dataLen: number, level: QRCodeLevel): number {
  for (let v = 1; v <= 10; v++) {
    const [, g1b, g1d, g2b, g2d] = ECC_TABLE[level][v - 1]
    const dataCapacity = g1b * g1d + g2b * g2d
    const headerBits = 4 + (v <= 9 ? 8 : 16)
    if (dataCapacity * 8 >= headerBits + dataLen * 8) {
      return v
    }
  }
  return 10
}

/** 构建比特流并填充（黑/白填充字节） */
function buildBitStream(version: number, data: Uint8Array, level: QRCodeLevel): Uint8Array {
  const [ec, g1b, g1d, g2b, g2d] = ECC_TABLE[level][version - 1]
  const totalData = g1b * g1d + g2b * g2d
  const bits: number[] = []

  const pushBits = (value: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >> i) & 1)
  }

  pushBits(0b0100, 4) // byte 模式
  pushBits(data.length, version <= 9 ? 8 : 16)
  data.forEach((b) => pushBits(b, 8))

  // 终止符与填充
  pushBits(0, Math.min(4, totalData * 8 - bits.length))
  let pad = 0xec
  while (bits.length < totalData * 8) {
    pushBits(pad, 8)
    pad = pad === 0xec ? 0x11 : 0xec
  }

  // 分块 + 纠错
  const dataBlocks: Uint8Array[] = []
  const ecBlocks: Uint8Array[] = []
  let offset = 0
  for (let i = 0; i < g1b; i++) {
    const block = bitsToBytes(bits.slice(offset * 8, (offset + g1d) * 8), g1d)
    offset += g1d
    dataBlocks.push(block)
    ecBlocks.push(rsEncode(block, ec).slice(g1d))
  }
  for (let i = 0; i < g2b; i++) {
    const block = bitsToBytes(bits.slice(offset * 8, (offset + g2d) * 8), g2d)
    offset += g2d
    dataBlocks.push(block)
    ecBlocks.push(rsEncode(block, ec).slice(g2d))
  }

  // 交织：先数据，后纠错码
  const maxData = Math.max(...dataBlocks.map((b) => b.length))
  const result: number[] = []
  for (let i = 0; i < maxData; i++) {
    dataBlocks.forEach((b) => {
      if (i < b.length) result.push(b[i])
    })
  }
  const maxEc = Math.max(...ecBlocks.map((b) => b.length))
  for (let i = 0; i < maxEc; i++) {
    ecBlocks.forEach((b) => {
      if (i < b.length) result.push(b[i])
    })
  }
  return new Uint8Array(result)
}

function bitsToBytes(bits: number[], length: number): Uint8Array {
  const out = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i * 8 + j] ?? 0)
    out[i] = byte
  }
  return out
}

function drawFinder(modules: boolean[][], size: number, cx: number, cy: number) {
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx
      const y = cy + dy
      if (x < 0 || y < 0 || x >= size || y >= size) continue
      const ring = Math.max(Math.abs(dx), Math.abs(dy))
      modules[y][x] = ring !== 2 && ring !== 4
    }
  }
}

function drawAlignment(modules: boolean[][], size: number, cx: number, cy: number) {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const x = cx + dx
      const y = cy + dy
      if (x < 0 || y < 0 || x >= size || y >= size) continue
      modules[y][x] = Math.max(Math.abs(dx), Math.abs(dy)) !== 1
    }
  }
}

function inFunctionPattern(size: number, x: number, y: number): boolean {
  // 三个 finder 及其分隔区
  if (x < 9 && y < 9) return true
  if (x >= size - 8 && y < 9) return true
  if (x < 9 && y >= size - 8) return true
  // timing 列/行
  if (x === 6 || y === 6) return true
  // 格式信息区（已被上述 finder 区覆盖）
  // 暗模块（v>=2 时 (8, size-8)）
  if (size >= 25 && x === 8 && y === size - 8) return true
  // 对齐图案区域
  const positions = ALIGNMENT_POSITIONS[Math.floor((size - 17) / 4) - 1] ?? []
  for (const cy of positions) {
    for (const cx of positions) {
      const isFinder = (cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)
      if (isFinder) continue
      if (Math.abs(x - cx) <= 2 && Math.abs(y - cy) <= 2) return true
    }
  }
  return false
}

/** 8 种掩码条件 */
const MASKS: Array<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0,
  (x) => x % 2 === 0,
  (y) => y % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => (x * y) % 2 + (x * y) % 3 === 0,
  (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0,
  (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0
]

/** 掩码罚分评估（规则 1-4） */
function penalty(modules: boolean[][]): number {
  const size = modules.length
  let score = 0

  const runPenalty = (line: boolean[], horizontal: boolean) => {
    let runLen = 0
    let last: boolean | null = null
    for (let i = 0; i < size; i++) {
      const v = line[i]
      if (v === last) runLen++
      else {
        if (runLen >= 5) score += 3 + (runLen - 5)
        runLen = 1
        last = v
      }
    }
    if (runLen >= 5) score += 3 + (runLen - 5)
    // 规则 2：1:1:3:1:1 寻像图案（前后各空 4 模块，边界处视为满足）
    const FINDER_RUN: boolean[] = [false, false, false, false, true, false, true, true, true, false, true, false, false, false, false]
    for (let i = 0; i + 14 < size; i++) {
      let matched = true
      for (let k = 0; k < 15; k++) {
        const idx = i + k
        if (idx < 0 || idx >= size) continue
        if (line[idx] !== FINDER_RUN[k]) {
          matched = false
          break
        }
      }
      if (matched) score += 40
    }
    void horizontal
  }

  for (let y = 0; y < size; y++) runPenalty(modules[y], true)
  for (let x = 0; x < size; x++) {
    const col = modules.map((row) => row[x])
    runPenalty(col, false)
  }

  // 规则 2：2x2 同色块
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      if (modules[y][x] === modules[y][x + 1] && modules[y][x] === modules[y + 1][x] && modules[y][x] === modules[y + 1][x + 1]) {
        score += 3
      }
    }
  }

  // 规则 4：暗模块占比
  let darkCount = 0
  modules.forEach((row) => row.forEach((v) => v && darkCount++))
  const percent = (darkCount * 100) / (size * size)
  score += Math.max(0, Math.abs(percent - 50) - 5) / 5 * 10

  return Math.round(score)
}

function drawFormatAndVersion(modules: boolean[][], size: number, version: number, level: QRCodeLevel, mask: number) {
  const index = (EC_LEVEL_BITS[level] << 3) | mask
  const format = FORMAT_INFO[index] & 0x7fff
  const isDark = (k: number) => ((format >> (14 - k)) & 1) === 1

  const setFormat = (x: number, y: number, dark: boolean) => {
    if (x >= 0 && y >= 0 && x < size && y < size) modules[y][x] = dark
  }

  // 第一份：左上（绕 timing），先水平第 0-5 位，再竖直
  for (let i = 0; i <= 5; i++) setFormat(8, i, isDark(i))
  setFormat(8, 7, isDark(6))
  setFormat(8, 8, isDark(7))
  setFormat(7, 8, isDark(8))
  for (let i = 9; i <= 14; i++) setFormat(14 - i, 8, isDark(i))
  // 第二份：右上 + 左下
  for (let i = 0; i <= 7; i++) setFormat(size - 1 - i, 8, isDark(i))
  for (let i = 8; i <= 14; i++) setFormat(8, size - 15 + i, isDark(i))

  // 版本信息（v >= 7）
  if (version >= 7 && VERSION_INFO[version] !== undefined) {
    const vi = VERSION_INFO[version]
    for (let i = 0; i < 18; i++) {
      const bit = ((vi >> (17 - i)) & 1) === 1
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      modules[b][a] = bit
      modules[a][b] = bit
    }
  }
}

/** 编码二维码，返回布尔矩阵（true=暗）与版本 */
export function encodeQR(text: string, level: QRCodeLevel = 'M'): { modules: boolean[][]; version: number } {
  const bytes = utf8Encode(text)
  const version = chooseVersion(bytes.length, level)
  const size = 17 + version * 4
  const data = buildBitStream(version, bytes, level)

  const modules: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))

  drawFinder(modules, size, 3, 3)
  drawFinder(modules, size, size - 4, 3)
  drawFinder(modules, size, 3, size - 4)
  const positions = ALIGNMENT_POSITIONS[version - 1]
  for (const cy of positions) {
    for (const cx of positions) {
      const isFinder = (cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)
      if (isFinder) continue
      drawAlignment(modules, size, cx, cy)
    }
  }
  // timing 图案
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0
    modules[6][i] = dark
    modules[i][6] = dark
  }

  // 数据放置（zigzag）
  let bitIndex = 0
  const codewordBits: number[] = []
  data.forEach((b) => {
    for (let i = 7; i >= 0; i--) codewordBits.push((b >> i) & 1)
  })
  const remainder = REMAINDER_BITS[version] ?? 0
  for (let i = 0; i < remainder; i++) codewordBits.push(0)

  let upward = true
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col-- // 跳过 timing 列
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i
      for (let j = 0; j < 2; j++) {
        const x = col - j
        if (!inFunctionPattern(size, x, row) && bitIndex < codewordBits.length) {
          modules[row][x] = codewordBits[bitIndex++] === 1
        }
      }
    }
    upward = !upward
  }

  // 选择罚分最低的掩码（只掩数据区域，功能模块保持原样），并写入对应的格式信息
  let bestMask = 0
  let bestPenalty = Infinity
  const applyMask = (m: number, target: boolean[][]) =>
    target.map((row, y) =>
      row.map((v, x) => (!inFunctionPattern(size, x, y) && MASKS[m](x, y) ? !v : v))
    )
  for (let m = 0; m < 8; m++) {
    const candidate = applyMask(m, modules)
    const p = penalty(candidate)
    if (p < bestPenalty) {
      bestPenalty = p
      bestMask = m
    }
  }
  const masked = applyMask(bestMask, modules)
  drawFormatAndVersion(masked, size, version, level, bestMask)

  return { modules: masked, version }
}

/* ---------------------------------- UI ---------------------------------- */

export interface QRCodeImageOptions {
  size?: number
  color?: string
  bgColor?: string
  level?: QRCodeLevel
}

/** 生成 dataURL（供导出图片用） */
export function qrToDataURL(value: string, options: QRCodeImageOptions = {}): string {
  const { size = 128, color = '#000000', bgColor = '#ffffff', level = 'M' } = options
  const { modules } = encodeQR(value, level)
  const n = modules.length
  const scale = Math.max(1, Math.floor(size / n))
  const canvas = document.createElement('canvas')
  canvas.width = n * scale
  canvas.height = n * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (modules[y][x]) ctx.fillRect(x * scale, y * scale, scale, scale)
    }
  }
  return canvas.toDataURL('image/png')
}

export const QRCode = function QRCode({
  value,
  size = 128,
  color = '#000000',
  bgColor = '#ffffff',
  level = 'M',
  errorLevel,
  icon,
  iconSize,
  className: cls,
  style,
  ...rest
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentLevel = errorLevel ?? level

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { modules, version } = encodeQR(value, currentLevel as QRCodeLevel)
    const n = modules.length
    const scale = Math.floor(size / n)
    canvas.width = n
    canvas.height = n
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(scale, scale)
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, n, n)
    ctx.fillStyle = color
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (modules[y][x]) ctx.fillRect(x, y, 1, 1)
      }
    }
    void version
  }, [value, size, color, bgColor, currentLevel])

  return (
    <div className={className('sofa-qrcode', cls)} style={style} {...rest}>
      <canvas ref={canvasRef} aria-label={`二维码：${value}`} role="img" />
      {icon && (
        <span className="sofa-qrcode-icon" style={{ width: iconSize ?? size * 0.22, height: iconSize ?? size * 0.22 }}>
          {icon}
        </span>
      )}
    </div>
  )
}

Object.assign(QRCode, { toDataURL: qrToDataURL })

export default QRCode