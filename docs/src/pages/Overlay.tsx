import {
  Tooltip, Popover, Popconfirm, Modal, message, notification,
  Button, Space, Divider, Icon, confirm, Switch
} from 'sofa-ui'
import { useState } from 'react'
import { Demo } from '../App'

export function Overlay() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [popupVisible, setPopupVisible] = useState(true)

  const handleOk = async () => {
    setConfirmLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setConfirmLoading(false)
    setModalOpen(false)
    message.success('提交成功')
  }

  return (
    <div>
      <h2 className="page-title">浮层与反馈</h2>

      <Demo
        title="Tooltip 文字提示"
        desc="12 方向自动翻转避让视口，hover 延迟进出，支持受控。"
        code={`<Tooltip title="提示文字" placement="top">
  <Button>悬浮我</Button>
</Tooltip>`}
      >
        <div className="placement-grid">
          {(['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'leftTop', 'leftBottom', 'right', 'rightTop', 'rightBottom'] as const).map((p) => (
            <Tooltip key={p} title={`placement: ${p}`} placement={p}>
              <Button size="small" className="placement-btn">{p}</Button>
            </Tooltip>
          ))}
        </div>
      </Demo>

      <Demo
        title="Popover 气泡卡片"
        desc="click 触发，可承载交互内容，点击外部或 ESC 关闭。"
      >
        <Space size="middle" wrap>
          <Popover
            title="卡片标题"
            content={
              <div>
                这是气泡卡片内容区域，
                <br />
                可以放置任意交互组件：
                <div style={{ marginTop: 8 }}>
                  <Switch size="small" defaultChecked onChange={setPopupVisible} />
                  <span style={{ marginLeft: 8, fontSize: 12 }}>{popupVisible ? '已开启' : '已关闭'}</span>
                </div>
              </div>
            }
            trigger="click"
          >
            <Button type="primary">点击弹出卡片</Button>
          </Popover>
          <Popover title="hover 触发" content="悬浮触发，带 0.15s 过渡动画。" trigger="hover">
            <Button>悬浮触发</Button>
          </Popover>
        </Space>
      </Demo>

      <Demo
        title="Popconfirm 气泡确认框"
        desc="危险操作二次确认。"
        code={`<Popconfirm title="确定要删除这条数据吗？" danger
  onConfirm={() => message.success('已删除')}>
  <Button type="primary" danger>删除</Button>
</Popconfirm>`}
      >
        <Space size="middle" wrap>
          <Popconfirm
            title="确定要删除这条数据吗？"
            description="删除后不可恢复，请谨慎操作。"
            onConfirm={() => message.success('已删除')}
          >
            <Button type="primary" danger>删除数据</Button>
          </Popconfirm>
          <Popconfirm
            title="确认提交订单？"
            okText="确认提交"
            cancelText="再想想"
            onConfirm={() => message.success('订单已提交')}
          >
            <Button type="primary">提交订单</Button>
          </Popconfirm>
        </Space>
      </Demo>

      <Demo
        title="Modal 对话框"
        desc="遮罩/ESC/点击外部关闭、确认按钮加载态、命令式 confirm 方法。"
        code={`<Modal open={open} title="编辑信息" onOk={handleOk} confirmLoading={loading}
  onCancel={() => setOpen(false)}>
  对话框内容
</Modal>
confirm({ title: '确认删除？', type: 'warning', onOk: () => {} })`}
      >
        <Space size="middle" wrap>
          <Button type="primary" onClick={() => setModalOpen(true)}>打开对话框</Button>
          <Button
            onClick={() =>
              confirm({
                title: '确认删除该记录？',
                content: '删除后数据不可恢复。',
                type: 'warning',
                onOk: () => message.success('已删除')
              })
            }
          >
            confirm 确认框
          </Button>
          <Button
            danger
            onClick={() =>
              confirm({
                title: '操作失败',
                content: '网络异常，请稍后重试。',
                type: 'error',
                okText: '知道了'
              })
            }
          >
            错误提示
          </Button>
        </Space>
        <Modal
          open={modalOpen}
          title="编辑用户信息"
          okText="保存"
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={() => setModalOpen(false)}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div className="demo-text">姓名：张三</div>
            <div className="demo-text">邮箱：zhangsan@example.com</div>
            <div className="demo-text">确认按钮会模拟 1.2s 加载态后关闭。</div>
          </Space>
        </Modal>
      </Demo>

      <Demo
        title="Message 全局消息"
        desc="命令式调用，顶部居中出现，自动消失；支持 loading 与手动关闭。"
        code={`message.success('操作成功')
message.error('保存失败')
message.loading('处理中...', { duration: 0 })`}
      >
        <Space size="middle" wrap>
          <Button type="primary" onClick={() => message.success('操作成功！')}>成功</Button>
          <Button onClick={() => message.error('保存失败，请重试')}>失败</Button>
          <Button onClick={() => message.warning('内容已过期')}>警告</Button>
          <Button onClick={() => message.info('这是一条普通消息')}>信息</Button>
          <Button
            onClick={() => {
              const close = message.loading('正在处理中...', { duration: 0 })
              setTimeout(() => close(), 2500)
            }}
          >
            加载中
          </Button>
        </Space>
      </Demo>

      <Demo
        title="Notification 通知"
        desc="右上角滑入，支持标题 + 描述 + 自定义关闭时机。"
      >
        <Space size="middle" wrap>
          <Button
            type="primary"
            onClick={() =>
              notification.success({
                title: '发布成功',
                description: '版本 v0.1.0 已成功发布到 npm registry。'
              })
            }
          >
            成功通知
          </Button>
          <Button
            onClick={() =>
              notification.error({
                title: '构建失败',
                description: 'ESLint 检查未通过，请修复后重试。',
                duration: 0
              })
            }
          >
            失败通知（不自动关闭）
          </Button>
          <Button
            onClick={() =>
              notification.warning({
                title: '磁盘空间不足',
                description: '剩余空间低于 10%，建议清理缓存。',
                footer: (
                  <Button size="small" type="primary" onClick={() => notification.destroy()}>
                    立即清理
                  </Button>
                )
              })
            }
          >
            带操作的通知
          </Button>
        </Space>
      </Demo>

      <Divider />
      <div className="demo-text">
        更多浮层能力：<Icon type="info" size={13} /> Modal 支持 destroyOnClose / lockScroll，
        Tooltip 支持受控 open 与 disabled，全部浮层支持 12 方向定位。
      </div>
    </div>
  )
}