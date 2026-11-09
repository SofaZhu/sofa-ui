/**
 * Sofa UI 组件库入口
 * 全色彩基于主色 #8A2BE2 自动调配
 */

// 主题系统
export {
  setPrimaryColor,
  setDarkMode,
  isDarkMode,
  toggleDarkMode,
  setTheme,
  getAppliedTokens,
  applyThemeTokens,
  generateThemeTokens,
  generateColorPalette,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SEMANTIC_COLORS,
  DEFAULT_NEUTRAL_COLORS
} from './theme'
export type { ThemeTokenInput, SemanticColorKey, NeutralColorKey } from './theme/tokens'

// 通用
export { default as Button } from './components/button/button'
export type { ButtonProps, ButtonType, ButtonSize } from './components/button/button'
export { default as Icon } from './components/icon/icon'
export type { IconProps, IconType } from './components/icon/icon'
export { default as Tag } from './components/tag/tag'
export type { TagProps, TagColor } from './components/tag/tag'
export { default as Space } from './components/space/space'
export type { SpaceProps, SpaceSize, SpaceDirection } from './components/space/space'
export { default as Divider } from './components/divider/divider'
export type { DividerProps } from './components/divider/divider'

// 布局
export { default as Row } from './components/grid/row'
export type { RowProps, Gutter, GutterValue, Breakpoint } from './components/grid/row'
export { default as Col } from './components/grid/col'
export type { ColProps } from './components/grid/col'
export { default as Layout, Header as LayoutHeader, Footer as LayoutFooter, Content as LayoutContent, Sider as LayoutSider } from './components/layout/layout'
export type { LayoutProps, SiderProps, SiderRenderProps } from './components/layout/layout'
export { default as Container } from './components/container/container'
export type { ContainerProps } from './components/container/container'

// 导航
export { default as Breadcrumb } from './components/breadcrumb/breadcrumb'
export type { BreadcrumbProps, BreadcrumbItem } from './components/breadcrumb/breadcrumb'
export { default as Pagination } from './components/pagination/pagination'
export type { PaginationProps } from './components/pagination/pagination'
export { default as BackTop } from './components/back-top/back-top'
export type { BackTopProps } from './components/back-top/back-top'
export { default as Anchor, AnchorLink } from './components/anchor/anchor'
export type { AnchorProps, AnchorLinkProps } from './components/anchor/anchor'
export { default as Menu, MenuItem, SubMenu, MenuItemGroup } from './components/menu/menu'
export type { MenuProps, MenuItemProps, SubMenuProps, MenuItemGroupProps } from './components/menu/menu'
export { default as Dropdown } from './components/dropdown/dropdown'
export type { DropdownProps, DropdownMenuProps, DropdownMenuItem } from './components/dropdown/dropdown'

// 通用
export { default as Segmented } from './components/segmented/segmented'
export type { SegmentedProps, SegmentedOption } from './components/segmented/segmented'
export { default as Typography, Text, Title, Paragraph } from './components/typography/typography'
export type {
  TypographyType,
  TitleProps,
  TextProps,
  ParagraphProps,
  ParagraphEllipsisConfig
} from './components/typography/typography'
export { default as QRCode, qrToDataURL, encodeQR } from './components/qrcode/qrcode'
export type { QRCodeProps, QRCodeLevel, QRCodeImageOptions } from './components/qrcode/qrcode'

// 数据录入
export { default as Input } from './components/input/input'
export type { InputProps, InputSize } from './components/input/input'
export { default as Textarea } from './components/input/textarea'
export type { TextareaProps } from './components/input/textarea'
export { default as Select } from './components/select/select'
export type { SelectProps, SelectOption, SelectValue } from './components/select/select'
export { default as Checkbox, CheckboxGroup } from './components/checkbox/checkbox'
export type { CheckboxProps, CheckboxGroupProps } from './components/checkbox/checkbox'
export { default as Radio, RadioGroup } from './components/radio/radio'
export type { RadioProps, RadioGroupProps } from './components/radio/radio'
export { default as Switch } from './components/switch/switch'
export type { SwitchProps } from './components/switch/switch'
export { default as Slider } from './components/slider/slider'
export type { SliderProps } from './components/slider/slider'
export { default as Rate } from './components/rate/rate'
export type { RateProps } from './components/rate/rate'
export { default as TreeSelect } from './components/tree-select/tree-select'
export type { TreeSelectProps } from './components/tree-select/tree-select'
export { default as Cascader } from './components/cascader/cascader'
export type { CascaderProps, CascaderOption } from './components/cascader/cascader'
export { default as Tree } from './components/tree/tree'
export type { TreeProps, TreeNode, TreeSelectInfo, TreeCheckInfo, TreeDropInfo, TreeDropPosition } from './components/tree/tree'

// 浮层
export { default as Tooltip } from './components/tooltip/tooltip'
export type { TooltipProps } from './components/tooltip/tooltip'
export { default as Popover, Popconfirm } from './components/popover/popover'
export type { PopoverProps, PopconfirmProps } from './components/popover/popover'
export { default as Modal, confirm } from './components/modal/modal'
export type { ModalProps, ConfirmOptions } from './components/modal/modal'
export { default as message } from './components/message/message'
export type { MessageOptions, MessageType } from './components/message/message'
export { default as notification } from './components/notification/notification'
export type { NotificationOptions, NotificationType } from './components/notification/notification'

// 数据录入
export { default as Upload } from './components/upload/upload'
export type { UploadProps, UploadFile } from './components/upload/upload'

// 数据展示
export { default as Avatar, AvatarGroup } from './components/avatar/avatar'
export type { AvatarProps, AvatarGroupProps, AvatarSize } from './components/avatar/avatar'
export { default as Badge } from './components/badge/badge'
export type { BadgeProps, BadgeStatus } from './components/badge/badge'
export { default as Alert } from './components/alert/alert'
export type { AlertProps, AlertType } from './components/alert/alert'
export { default as Tabs } from './components/tabs/tabs'
export type { TabsProps, TabItem } from './components/tabs/tabs'
export { default as Card } from './components/card/card'
export type { CardProps } from './components/card/card'
export { default as Progress } from './components/progress/progress'
export type { ProgressProps, ProgressStatus } from './components/progress/progress'
export { default as Spin } from './components/spin/spin'
export type { SpinProps } from './components/spin/spin'
export { default as Empty } from './components/empty/empty'
export type { EmptyProps } from './components/empty/empty'
export { default as Table } from './components/table/table'
export type {
  TableProps,
  TableColumn,
  TableRecord,
  TableExpandable,
  TablePaginationConfig,
  TableRowSelection,
  TableSorter,
  SortOrder
} from './components/table/table'

// 扩展数据录入
export { default as DatePicker } from './components/date-picker/date-picker'
export type { DatePickerProps } from './components/date-picker/date-picker'
export { default as TimePicker } from './components/time-picker/time-picker'
export type { TimePickerProps } from './components/time-picker/time-picker'
export { default as Form, useForm } from './components/form/form'
export type {
  FieldPath,
  FormInstance,
  FormItemProps,
  FormLayout,
  FormProps,
  FormRule,
  FormSize,
  FormValidateResult,
  FormValidateTrigger
} from './components/form/form'
export { default as Mentions, getMentions } from './components/mentions/mentions'
export type { MentionOption, MentionsProps } from './components/mentions/mentions'

// 扩展数据展示与反馈
export { default as Calendar } from './components/calendar/calendar'
export type { CalendarMode, CalendarProps } from './components/calendar/calendar'
export { default as Carousel } from './components/carousel/carousel'
export type { CarouselProps } from './components/carousel/carousel'
export { default as Collapse } from './components/collapse/collapse'
export type { CollapseItem, CollapseProps } from './components/collapse/collapse'
export { default as Descriptions } from './components/descriptions/descriptions'
export type { DescriptionsItem, DescriptionsProps } from './components/descriptions/descriptions'
export { default as Image } from './components/image/image'
export type { ImageProps, ImageStatus } from './components/image/image'
export { default as List, ListItem } from './components/list/list'
export type { ListItemProps, ListProps } from './components/list/list'
export { default as Result } from './components/result/result'
export type { ResultProps, ResultStatus } from './components/result/result'
export { default as Skeleton } from './components/skeleton/skeleton'
export type {
  SkeletonAvatarProps,
  SkeletonImageProps,
  SkeletonParagraphProps,
  SkeletonProps,
  SkeletonTitleProps
} from './components/skeleton/skeleton'
export { default as Statistic, formatStatisticValue } from './components/statistic/statistic'
export type { StatisticProps } from './components/statistic/statistic'
export { default as Timeline } from './components/timeline/timeline'
export type { TimelineItem, TimelineProps } from './components/timeline/timeline'

// 弹层定位类型
export type { PopPlacement, PopTrigger } from './hooks/usePop'