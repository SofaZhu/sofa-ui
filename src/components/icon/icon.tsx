import { className } from '@/utils/classNames'

/**
 * 内置图标集合：24x24 viewBox 描边风格 SVG，继承 currentColor。
 */

export type IconType =
  | 'check' | 'close' | 'info' | 'warning' | 'error' | 'loading'
  | 'search' | 'chevron-down' | 'chevron-up' | 'chevron-right' | 'chevron-left'
  | 'star' | 'star-filled' | 'plus' | 'minus' | 'user' | 'home' | 'settings'
  | 'edit' | 'trash' | 'email' | 'calendar'
  | 'check-circle' | 'error-circle' | 'warning-triangle' | 'info-circle' | 'close-circle'
  | 'eye' | 'eye-off' | 'refresh' | 'upload' | 'download' | 'file'
  | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down' | 'more' | 'clock' | 'bell'
  | 'filter' | 'copy' | 'menu' | 'link'

export interface IconProps {
  type: IconType
  size?: number | string
  color?: string
  spin?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void
}

const ICON_PATHS: Record<IconType, React.ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  info: <path d="M12 8h.01M12 12v5" />,
  warning: <path d="M12 4l9 16H3z" />,
  error: <path d="M12 4l9 16H3z" />,
  loading: <path d="M12 3a9 9 0 1 0 9 9" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></>),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-up': <path d="M6 15l6-6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  star: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />,
  'star-filled': <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" fill="currentColor" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20c1.2-3.2 4.2-5 7.5-5s6.3 1.8 7.5 5" /></>),
  home: (<><path d="M4 11l8-7 8 7" /><path d="M6 9.5V20h12V9.5" /></>),
  settings: <path d="M19 12a7 7 0 0 0-.15-1.4l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.4-1.4L13.6 2h-3.2l-.45 2.6a7 7 0 0 0-2.4 1.4l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.8l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2.4 1.4l.45 2.6h3.2l.45-2.6a7 7 0 0 0 2.4-1.4l2.4 1 2-3.4-2-1.6c.1-.45.15-.9.15-1.4z" />,
  edit: <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17zM13.5 6.5l3 3" />,
  trash: (<><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /><path d="M10 11v5M14 11v5" /></>),
  email: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>),
  'check-circle': (<><circle cx="12" cy="12" r="9" /><path d="M8 12.2l2.8 2.8L16 9.5" /></>),
  'error-circle': (<><circle cx="12" cy="12" r="9" /><path d="M12 7.5V13M12 16.5h.01" /></>),
  'warning-triangle': (<><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 16.5h.01" /></>),
  'info-circle': (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5h.01" /></>),
  'close-circle': (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" /></>),
  eye: (<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>),
  'eye-off': (<><path d="M4 4l16 16" /><path d="M9.5 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.4 3M6.2 7.2C3.8 8.8 2.5 12 2.5 12S6 18.5 12 18.5c1.2 0 2.3-.3 3.3-.8" /></>),
  refresh: (<><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 3v6h-6" /></>),
  upload: (<><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></>),
  download: (<><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></>),
  'arrow-right': <path d="M4 12h16M13 5l7 7-7 7" />,
  'arrow-left': <path d="M20 12H4M11 5l-7 7 7 7" />,
  'arrow-up': <path d="M12 20V4M5 11l7-7 7 7" />,
  'arrow-down': <path d="M12 4v16M5 13l7 7 7-7" />,
  more: (<><circle cx="5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="19" cy="12" r="1.6" fill="currentColor" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  bell: (<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 19a2.2 2.2 0 0 0 4 0" /></>),
  file: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></>),
  filter: <path d="M4 5h16l-6 7v5.2l-4 2V12z" />,
  copy: (<><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>),
  menu: (<><path d="M4 7h16M4 12h16M4 17h16" /></>),
  link: (<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></>)
}

/**
 * 通用图标组件，可单独使用，也可作为按钮、输入框等组件的图标插槽
 */
export function Icon({ type, size = 16, color, spin = false, className: cls, style, onClick }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className('sofa-icon', `sofa-icon-${type}`, spin && 'sofa-icon-spin', cls)}
      style={{ color, ...style }}
      aria-hidden="true"
      onClick={onClick}
    >
      {ICON_PATHS[type]}
    </svg>
  )
}

export default Icon