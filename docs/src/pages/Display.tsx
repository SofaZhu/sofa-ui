import {
  Badge, Alert, Tabs, Card, Breadcrumb, Pagination, Progress, Spin, Empty,
  Button, Space, Divider, Tag, Table, Text, Paragraph, Title
} from 'sofa-ui'
import { useState } from 'react'
import { Demo } from '../App'

interface MemberRecord {
  key: string
  name: string
  role: string
  status: '在线' | '离线'
  joined: string
  desc: string
}

const memberData: MemberRecord[] = [
  { key: '1', name: '林小满', role: '产品经理', status: '在线', joined: '2024-03-12', desc: '负责 Sofa UI 的组件规划与交互规范，主导了从设计稿到实现的完整链路。' },
  { key: '2', name: '陈一鸣', role: '前端工程师', status: '在线', joined: '2024-05-08', desc: '核心贡献者，实现了消息通知、级联选择与表格虚拟滚动等高频组件。' },
  { key: '3', name: '苏婉', role: '视觉设计师', status: '离线', joined: '2024-07-21', desc: '维护色板与主题令牌体系，负责暗色模式的全局视觉走查。' },
  { key: '4', name: '赵天阔', role: '测试工程师', status: '在线', joined: '2024-09-02', desc: '搭建了组件库的自动化测试框架，覆盖 120+ 个交互用例。' }
]

export function Display() {
  const [activeTab, setActiveTab] = useState('1')
  const [page, setPage] = useState(3)

  return (
    <div>
      <h2 className="page-title">数据展示</h2>

      <Demo
        title="Badge 徽标"
        desc="数字角标 / 状态点 / 自定义颜色，支持 overflowCount 溢出折叠。"
        code={`<Badge count={5}><Avatar /></Badge>
<Badge dot status="success" />
<Badge count={120} overflowCount={99} />`}
      >
        <Space size="large" wrap>
          <Badge count={5}>
            <span className="avatar-box">A</span>
          </Badge>
          <Badge count={0} showZero>
            <span className="avatar-box">B</span>
          </Badge>
          <Badge count={120} overflowCount={99}>
            <span className="avatar-box">C</span>
          </Badge>
          <Badge count="new">
            <span className="avatar-box">D</span>
          </Badge>
          <Badge color="#8A2BE2" count={7}>
            <span className="avatar-box">E</span>
          </Badge>
        </Space>
        <Divider dashed />
        <Space size="large" wrap>
          <Space size="small">
            <Badge dot status="success" />
            成功
          </Space>
          <Space size="small">
            <Badge dot status="warning" />
            警告
          </Space>
          <Space size="small">
            <Badge dot status="error" />
            危险
          </Space>
          <Space size="small">
            <Badge dot status="info" />
            信息
          </Space>
        </Space>
      </Demo>

      <Demo
        title="Alert 警告提示"
        desc="四种语义类型、标题/描述、可关闭、banner 通栏。"
        code={`<Alert type="success" title="操作成功" showIcon closable />
<Alert type="warning" title="警告" description="详细描述..." />`}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert type="success" title="操作成功" description="数据已保存到云端，可随时同步。" showIcon closable />
          <Alert type="info" title="提示信息" showIcon />
          <Alert type="warning" title="注意" description="当前为演示环境，数据不会真实提交。" showIcon closable />
          <Alert type="error" title="错误" description="网络连接失败，请检查后重试。" showIcon />
        </Space>
      </Demo>

      <Demo
        title="Tabs 标签页"
        desc="line / card 两种风格，可关闭、可禁用、懒渲染。"
        code={`<Tabs activeKey={active} onChange={setActive} items={[
  { key: '1', label: '标签一', children: <p>内容一</p> },
  { key: '2', label: '标签二', children: <p>内容二</p> }
]} />`}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: '1', label: '标签一', children: <p className="demo-text">这是第一个标签页的内容。</p> },
            { key: '2', label: '标签二', children: <p className="demo-text">这是第二个标签页的内容。</p> },
            { key: '3', label: '禁用标签', disabled: true, children: null },
            { key: '4', label: '可关闭标签', closable: true, children: <p className="demo-text">关闭后自动切换到相邻标签。</p> }
          ]}
        />
        <Divider />
        <Tabs
          type="card"
          defaultActiveKey="1"
          items={[
            { key: '1', label: '卡片式一', children: <p className="demo-text">卡片风格标签页内容。</p> },
            { key: '2', label: '卡片式二', children: <p className="demo-text">卡片式标签页内容。</p> }
          ]}
        />
      </Demo>

      <Demo
        title="Card 卡片"
        desc="标题/操作区/封面/底部，hover 抬升效果。"
      >
        <Space size="middle" wrap>
          <Card title="基础卡片" extra={<Tag color="primary">v0.1</Tag>} style={{ width: 300 }}>
            <p className="demo-text">卡片内容区域，可以承载任意文本或组件。</p>
            <p className="demo-text">Sofa UI 的卡片默认带边框与圆角。</p>
          </Card>
          <Card hoverable title="可悬浮卡片" style={{ width: 300 }}>
            <p className="demo-text">鼠标悬浮时阴影加深并轻微上移。</p>
          </Card>
        </Space>
      </Demo>

      <Demo
        title="Breadcrumb 面包屑"
        desc="层级导航，自定义分隔符。"
        code={`<Breadcrumb items={[
  { title: '首页', href: '#' },
  { title: '组件' },
  { title: '数据展示' }
]} />`}
      >
        <Breadcrumb
          items={[
            { title: '首页', href: '#' },
            { title: '组件库', href: '#' },
            { title: '数据展示' }
          ]}
        />
        <Divider />
        <Breadcrumb
          separator="›"
          items={[
            { title: '应用', href: '#' },
            { title: '设置', href: '#' },
            { title: '主题配置' }
          ]}
        />
      </Demo>

      <Demo
        title="Pagination 分页器"
        desc="页码省略、每页条数切换、快速跳转、总数展示。"
        code={`<Pagination total={200} current={page} showSizeChanger
  showQuickJumper showTotal={(t) => \`共 \${t} 条\`} />`}
      >
        <Pagination
          total={200}
          current={page}
          onChange={setPage}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
        />
        <Divider />
        <Pagination total={20} />
      </Demo>

      <Demo
        title="Progress 进度条"
        desc="直线 / 圆环 / 仪表盘三种形态，成功/异常/警告状态。"
        code={`<Progress percentage={66} status="success" />
<Progress type="circle" percentage={75} />
<Progress type="dashboard" percentage={40} status="warning" />`}
      >
        <Space direction="vertical" size="middle" style={{ width: 360 }}>
          <Progress percentage={66} status="normal" />
          <Progress percentage={100} status="success" />
          <Progress percentage={66} status="exception" />
          <Progress percentage={40} status="warning" striped animated />
        </Space>
        <Divider />
        <Space size="large" wrap>
          <Progress type="circle" percentage={75} size={110} />
          <Progress type="circle" percentage={100} status="success" size={110} />
          <Progress type="dashboard" percentage={40} status="warning" size={110} />
        </Space>
      </Demo>

      <Demo
        title="Spin 加载中"
        desc="包裹内容时显示遮罩层，支持全屏与文案。"
      >
        <Space size="large" wrap>
          <Spin size="small" />
          <Spin />
          <Spin size="large" tip="加载中..." />
          <div className="spin-demo-box">
            <Spin spinning tip="正在加载列表...">
              <div className="demo-text">被 Spin 包裹的内容，加载期间显示遮罩。</div>
              <div className="demo-text">内容区域会自动变淡并置灰。</div>
            </Spin>
          </div>
        </Space>
      </Demo>

      <Demo title="Empty 空状态" desc="自定义文案 / 插图 / 底部操作。">
        <Space size="large" wrap>
          <Empty />
          <Empty description="还没有任何数据">
            <Button type="primary" size="small" onClick={() => {}}>立即创建</Button>
          </Empty>
        </Space>
      </Demo>

      <Demo
        title="Table 表格：展开行详情"
        desc="点击行首箭头展开详情行，支持受控展开、行选择与分页。"
        code={`<Table
  columns={columns}
  dataSource={data}
  expandable={{
    renderExpandedRow: (record) => <div>{record.desc}</div>
  }}
/>`}
      >
        <Table<MemberRecord>
          columns={[
            {
              key: 'name',
              title: '姓名',
              dataIndex: 'name',
              render: (v, r) => (
                <div className="table-user">
                  <span className="table-user-avatar">{String(r.name).charAt(0)}</span>
                  <span>{String(v)}</span>
                </div>
              )
            },
            { key: 'role', title: '角色', dataIndex: 'role' },
            {
              key: 'status',
              title: '状态',
              dataIndex: 'status',
              render: (v) => (
                <Space size="small">
                  <Badge status={v === '在线' ? 'success' : 'default'} dot />
                  在线
                </Space>
              )
            },
            { key: 'joined', title: '加入时间', dataIndex: 'joined' }
          ]}
          dataSource={memberData}
          pagination={false}
          bordered
          expandable={{
            renderExpandedRow: (record) => (
              <div className="table-expanded-detail">
                <strong>{record.name}</strong> · {record.role}（{record.joined} 加入）
                <p>{record.desc}</p>
              </div>
            )
          }}
        />
      </Demo>

      <Demo
        title="Typography 文本：多行省略与展开"
        desc="Paragraph 支持 rows 行数省略并可展开收起，Text 支持单行省略与复制。"
        code={`<Paragraph ellipsis={{ rows: 2, expandable: true }}>
  长文本内容...
</Paragraph>
<Text ellipsis copyable>可复制且超出省略</Text>`}
      >
        <div style={{ maxWidth: 460 }}>
          <Paragraph ellipsis={{ rows: 2, expandable: true }}>
            Sofa UI 是一个以「单一主色 + 自动调配」为核心的 React 组件库，
            所有默认色调均由主色派生，色阶、语义色、暗色模式全部联动。
            本文展示了多行文本在超出两行时自动省略，并可点击展开查看完整内容。
          </Paragraph>
          <Divider />
          <Text ellipsis copyable style={{ width: '100%' }}>
            这一段文本使用了单行省略：内容超出宽度时以省略号截断，并附带一键复制按钮，方便复制组件标签与配置。
          </Text>
          <Divider />
          <Title level={5} type="secondary">标题支持 level 1-5</Title>
        </div>
      </Demo>
    </div>
  )
}