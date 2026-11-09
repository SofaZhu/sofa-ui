import {
  Input, Textarea, Select, Cascader, CheckboxGroup, RadioGroup,
  Switch, Slider, Rate, message, Divider, Icon, Space, Upload
} from 'sofa-ui'
import { useState } from 'react'
import { Demo } from '../App'

const FRAMEWORK_OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular', disabled: true },
  { label: 'Solid', value: 'solid' }
]

const REGION_OPTIONS = [
  { label: '浙江', value: 'zhejiang', children: [{ label: '杭州', value: 'hangzhou' }, { label: '宁波', value: 'ningbo' }] },
  { label: '江苏', value: 'jiangsu', children: [{ label: '南京', value: 'nanjing' }] },
  { label: '安徽', value: 'anhui', disabled: true, children: [{ label: '合肥', value: 'hefei' }] }
]

export function Entry() {
  const [selectValue, setSelectValue] = useState<string | undefined>('react')
  const [multiValue, setMultiValue] = useState<Array<string | number>>(['react'])
  const [checkedList, setCheckedList] = useState<Array<string | number>>(['a', 'c'])

  return (
    <div>
      <h2 className="page-title">数据录入</h2>

      <Demo
        title="Input 输入框"
        desc="前后缀插槽、一键清空、字数统计、错误/警告状态，三种尺寸。"
        code={`<Input placeholder="请输入用户名" prefix={<Icon type="user" size={14} />} allowClear />
<Input placeholder="带后缀" suffix=".com" />
<Input placeholder="字数统计" showCount maxLength={20} />`}
      >
        <Space direction="vertical" size="middle" style={{ width: 380 }}>
          <Input placeholder="基本输入框" allowClear />
          <Input placeholder="带前缀图标" prefix={<Icon type="search" size={14} />} allowClear />
          <Input placeholder="带后缀" suffix=".com" />
          <Input placeholder="字数统计" showCount maxLength={20} />
          <Input placeholder="错误状态" status="error" defaultValue="错误内容" />
          <Input placeholder="大尺寸" size="large" prefix={<Icon type="user" size={16} />} />
          <Input placeholder="禁用状态" disabled defaultValue="不可编辑" />
        </Space>
      </Demo>

      <Demo title="Textarea 文本域" desc="自动高度（autosize）与字数统计。">
        <Space direction="vertical" size="middle" style={{ width: 380 }}>
          <Textarea placeholder="固定高度文本域" rows={3} />
          <Textarea
            placeholder="自动高度（1~5 行）"
            autosize={{ minRows: 1, maxRows: 5 }}
            showCount
            maxLength={100}
            defaultValue="自动高度：随着输入内容变多，高度会自适应增长。"
          />
        </Space>
      </Demo>

      <Demo
        title="Select 选择器"
        desc="单选/多选、搜索过滤、清空、键盘上下键导航 + 回车确认。"
        code={`<Select
  options={[{ label: 'React', value: 'react' }, ...]}
  searchable clearable
  value={value}
  onChange={setValue}
/>
<Select multiple options={options} value={values} onChange={setValues} />`}
      >
        <Space direction="vertical" size="middle" style={{ width: 320 }}>
          <Select
            options={FRAMEWORK_OPTIONS}
            value={selectValue}
            onChange={(v) => setSelectValue(v as string)}
            searchable
            clearable
            placeholder="请选择框架（可搜索）"
          />
          <Select
            options={FRAMEWORK_OPTIONS}
            multiple
            value={multiValue}
            onChange={(v) => setMultiValue(v as Array<string | number>)}
            placeholder="多选框架"
          />
          <Select options={FRAMEWORK_OPTIONS} disabled defaultValue="react" placeholder="禁用" />
          <Select options={[]} placeholder="空数据" emptyText="没有可选项 ~" />
        </Space>
      </Demo>

      <Demo
        title="Cascader 级联选择"
        desc="展开省份选择城市，也可搜索省份或城市名称。禁用分支不可选。"
      >
        <Cascader options={REGION_OPTIONS} searchable clearable placeholder="选择省份与城市" />
      </Demo>

      <Demo
        title="Checkbox / Radio"
        desc="复选框含半选与全选联动，单选框支持按钮形态。"
      >
        <div className="demo-text">复选框组（含全选）：</div>
        <CheckboxGroup
          value={checkedList}
          onChange={setCheckedList}
          options={[
            { label: '选项 A', value: 'a' },
            { label: '选项 B', value: 'b' },
            { label: '选项 C', value: 'c' },
            { label: '禁用项', value: 'd', disabled: true }
          ]}
        />
        <Divider dashed />
        <div className="demo-text">单选按钮组：</div>
        <Space direction="vertical" size="middle">
          <RadioGroup
            optionType="button"
            defaultValue="b"
            options={[
              { label: '日', value: 'day' },
              { label: '周', value: 'week' },
              { label: '月', value: 'month' },
              { label: '年', value: 'year', disabled: true }
            ]}
          />
          {([
            { size: 'small', label: '小号' },
            { size: 'default', label: '中号' },
            { size: 'large', label: '大号' }
          ] as const).map(({ size, label }) => (
            <Space key={size} size="middle">
              <span className="demo-text">{label}</span>
              <RadioGroup
                optionType="button"
                size={size}
                defaultValue="day"
                options={[
                  { label: '日', value: 'day' },
                  { label: '周', value: 'week' },
                  { label: '月', value: 'month' }
                ]}
              />
            </Space>
          ))}
        </Space>
      </Demo>

      <Demo
        title="Slider 滑块"
        desc="单值/范围双模式、步进、刻度标记、拖动气泡。"
        code={`<Slider defaultValue={40} marks={{ 0: '0', 50: '50', 100: '100' }} />
<Slider range defaultValue={[20, 80]} />`}
      >
        <Space direction="vertical" size="large" style={{ width: 420 }}>
          <Slider defaultValue={40} marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }} />
          <Slider range defaultValue={[20, 80]} />
          <Slider defaultValue={60} disabled />
        </Space>
      </Demo>

      <Demo
        title="Rate 评分"
        desc="半星、清除、自定义字符。"
        code={`<Rate defaultValue={3} />
<Rate allowHalf defaultValue={3.5} onChange={setRate} />`}
      >
        <Space direction="vertical" size="middle">
          <Rate defaultValue={3} onChange={(v) => message.info(`评分：${v}`)} />
          <Rate allowHalf defaultValue={3.5} />
          <Rate count={7} defaultValue={5} character={<Icon type="star-filled" size={24} />} />
          <Rate defaultValue={4} disabled />
        </Space>
      </Demo>

      <Demo
        title="Upload 上传"
        desc="本地回传（不传 action 时仅展示列表）、拖拽模式、缩略图、限数与失败重试。"
        code={`<Upload listType="picture" multiple maxCount={5} />`}
      >
        <Space direction="vertical" size="middle" style={{ width: 420 }}>
          <Upload action="" multiple maxCount={3} />
          <Upload drag multiple accept="image/*" />
          <Upload listType="picture" multiple maxCount={5} />
        </Space>
      </Demo>
    </div>
  )
}