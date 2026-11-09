import { Button, Icon, Tag, Space, Divider, Row, Col, Switch, message } from 'sofa-ui'
import { useState } from 'react'
import { Demo } from '../App'

export function General() {
  const [checkable, setCheckable] = useState(true)
  const [closeTags, setCloseTags] = useState(['可关闭标签 A', '可关闭标签 B'])

  return (
    <div>
      <h2 className="page-title">通用</h2>

      <Demo
        title="Button 按钮"
        desc="五种类型（primary/default/dashed/text/link）+ 危险/幽灵/圆角/圆形/加载态/点击波纹，尺寸 small/default/large。"
        code={`<Button type="primary">主要按钮</Button>
<Button>默认按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="text">文字按钮</Button>
<Button type="link">链接按钮</Button>
<Button type="primary" danger>危险按钮</Button>
<Button type="primary" loading>加载中</Button>
<Button shape="circle" type="primary"><Icon type="plus" size={16} /></Button>`}
      >
        <Space size="middle" wrap>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="text">文字按钮</Button>
          <Button type="link">链接按钮</Button>
        </Space>
        <Divider orientation="left">形态</Divider>
        <Space size="middle" wrap>
          <Button type="primary" danger>危险按钮</Button>
          <Button danger>危险描边</Button>
          <Button type="primary" ghost>幽灵按钮</Button>
          <Button type="primary" round>胶囊按钮</Button>
          <Button type="primary" circle aria-label="新增">
            <Icon type="plus" size={16} />
          </Button>
          <Button type="primary" loading>加载中</Button>
          <Button type="primary" icon={<Icon type="download" size={14} />}>下载</Button>
          <Button disabled>禁用</Button>
        </Space>
        <Divider orientation="left">尺寸</Divider>
        <Space size="middle" wrap>
          <Button type="primary" size="small">小按钮</Button>
          <Button type="primary">默认按钮</Button>
          <Button type="primary" size="large">大按钮</Button>
        </Space>
      </Demo>

      <Demo
        title="Tag 标签"
        desc="预设语义色 + 自定义色值 + 可关闭 + 可勾选。"
        code={`<Tag>默认标签</Tag>
<Tag color="success">成功</Tag>
<Tag color="#8A2BE2">自定义颜色</Tag>
<Tag closable>可关闭</Tag>
<Tag checkable checked={true} onCheckedChange={setChecked}>可勾选</Tag>`}
      >
        <Space size="middle" wrap>
          <Tag>默认标签</Tag>
          <Tag color="primary">主色标签</Tag>
          <Tag color="success">成功</Tag>
          <Tag color="warning">警告</Tag>
          <Tag color="error">危险</Tag>
          <Tag color="info">信息</Tag>
          <Tag color="#EB2F96">自定义色</Tag>
        </Space>
        <Divider />
        <Space size="middle" wrap>
          <Tag size="small" color="primary">小号</Tag>
          <Tag size="large" color="primary">大号</Tag>
          <Tag
            closable
            onClose={() => message.info('标签已关闭')}
          >
            可关闭
          </Tag>
          <Tag
            checkable
            checked={checkable}
            onCheckedChange={setCheckable}
          >
            可勾选
          </Tag>
          {closeTags.map((t) => (
            <Tag key={t} closable onClose={() => setCloseTags(closeTags.filter((x) => x !== t))}>
              {t}
            </Tag>
          ))}
        </Space>
      </Demo>

      <Demo
        title="Space / Divider"
        desc="Space 统一间距（支持 split 分隔符与动态切换），Divider 水平/垂直/带标题三种形态。"
      >
        <SpaceDemo />
        <Divider orientation="left">水平分割线</Divider>
        <p className="demo-text">上方是左对齐带标题的分割线。</p>
        <Divider orientation="center">居中标题</Divider>
        <p className="demo-text">上方是居中对齐带标题的分割线。</p>
        <Divider dashed>虚线分割线</Divider>
      </Demo>

      <h2 className="page-title">布局</h2>

      <Demo
        title="Row / Col 栅格"
        desc="24 栅格体系：span/offset/order，支持 xs~xxl 六档响应式断点与响应式 gutter。"
        code={`<Row gutter={[16, 16]}>
  <Col span={8}><div className="grid-box">8</div></Col>
  <Col span={8}><div className="grid-box">8</div></Col>
  <Col span={8}><div className="grid-box">8</div></Col>
</Row>`}
      >
        <Row gutter={[16, 16]}>
          {[6, 6, 6, 6].map((s, i) => (
            <Col key={i} span={s}>
              <div className="grid-box">{s}</div>
            </Col>
          ))}
          {[8, 8, 8].map((s, i) => (
            <Col key={i} span={s}>
              <div className="grid-box grid-box-alt">{s}</div>
            </Col>
          ))}
          {[12, 12].map((s, i) => (
            <Col key={i} span={s}>
              <div className="grid-box">{s}</div>
            </Col>
          ))}
          <Col span={16}>
            <div className="grid-box grid-box-alt">16</div>
          </Col>
          <Col span={8}>
            <div className="grid-box">8</div>
          </Col>
        </Row>
        <Divider orientation="left">偏移与响应式</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <div className="grid-box">span 8</div>
          </Col>
          <Col span={8} offset={8}>
            <div className="grid-box grid-box-alt">span 8 offset 8</div>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <div className="grid-box">xs24 / md12 / lg6</div>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <div className="grid-box grid-box-alt">xs24 / md12 / lg6</div>
          </Col>
        </Row>
      </Demo>

      <Demo title="Switch 开关" desc="支持加载态与开/关文案，主色即开关底色。">
        <Space size="middle" wrap>
          <Switch />
          <Switch defaultChecked />
          <Switch defaultChecked checkedText="开" uncheckedText="关" />
          <Switch loading />
          <Switch defaultChecked disabled />
        </Space>
      </Demo>
    </div>
  )
}

/** Space 交互演示：点击按钮循环切换间距并实时反馈 */
function SpaceDemo() {
  const [size, setSize] = useState<'small' | 'middle' | 'large'>('large')
  const sizeLabel = { small: '小', middle: '中', large: '大' }[size]
  return (
    <div className="space-demo">
      <Space size={size} split={<Divider type="vertical" />} wrap>
        <Button type="primary" onClick={() => setSize(size === 'small' ? 'middle' : size === 'middle' ? 'large' : 'small')}>
          点击切换间距（当前：{sizeLabel}）
        </Button>
        <Button onClick={() => message.info(`Space 当前间距：${sizeLabel}（small=8 / middle=16 / large=24）`)}>
          间距布局
        </Button>
        <Button type="dashed" onClick={() => message.success('Space 组件：统一管理子元素间距与分隔符')}>
          Space 组件
        </Button>
      </Space>
    </div>
  )
}