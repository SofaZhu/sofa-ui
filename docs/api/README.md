# Sofa UI 公开 API

所有页面使用 `sofa-ui` 的包根入口。先在应用入口加载全量样式及主题令牌，再复制模块示例。

```ts
import 'sofa-ui/theme.css'
import 'sofa-ui/styles.css'
```

属性表中的「—」表示没有单独列出默认值。组件继承的原生 React 属性按表上方的类型使用。受控属性由应用更新，`default*` 属性用于初始化非受控状态。

## 主题与通用

- [主题与设计令牌](theme.md)
- [Button 按钮](button.md)
- [Icon 图标](icon.md)
- [Tag 标签](tag.md)
- [Space 间距](space.md)
- [Divider 分割线](divider.md)
- [Segmented 分段选择](segmented.md)
- [Typography 排版](typography.md)
- [QRCode 二维码](qrcode.md)

## 布局

- [Row / Col 栅格](grid.md)
- [Layout 布局](layout.md)
- [Container 容器](container.md)

## 导航

- [Anchor 锚点](anchor.md)
- [BackTop 回到顶部](back-top.md)
- [Breadcrumb 面包屑](breadcrumb.md)
- [Dropdown 下拉菜单](dropdown.md)
- [Menu 菜单](menu.md)
- [Pagination 分页](pagination.md)
- [Tabs 标签页](tabs.md)

## 数据录入

- [Input / Textarea 输入框](input.md)
- [Select 选择器](select.md)
- [Checkbox 复选框](checkbox.md)
- [Radio 单选框](radio.md)
- [Switch 开关](switch.md)
- [Slider 滑块](slider.md)
- [Rate 评分](rate.md)
- [Cascader 级联选择](cascader.md)
- [TreeSelect 树选择](tree-select.md)
- [DatePicker 日期选择器](date-picker.md)
- [TimePicker 时间选择器](time-picker.md)
- [Form 表单](form.md)
- [Mentions 提及](mentions.md)
- [Upload 上传](upload.md)

## 浮层与反馈

- [浮层定位类型](popup.md)
- [Tooltip 文字提示](tooltip.md)
- [Popover / Popconfirm 气泡卡片](popover.md)
- [Modal 对话框](modal.md)
- [message 全局消息](message.md)
- [notification 通知](notification.md)
- [Alert 警告提示](alert.md)
- [Spin 加载中](spin.md)
- [Empty 空状态](empty.md)
- [Result 结果页](result.md)

## 数据展示

- [Avatar 头像](avatar.md)
- [Badge 徽标](badge.md)
- [Calendar 日历](calendar.md)
- [Card 卡片](card.md)
- [Carousel 走马灯](carousel.md)
- [Collapse 折叠面板](collapse.md)
- [Descriptions 描述列表](descriptions.md)
- [Image 图片](image.md)
- [List 列表](list.md)
- [Progress 进度条](progress.md)
- [Skeleton 骨架屏](skeleton.md)
- [Statistic 数值展示](statistic.md)
- [Table 表格](table.md)
- [Timeline 时间轴](timeline.md)
- [Tree 树](tree.md)
