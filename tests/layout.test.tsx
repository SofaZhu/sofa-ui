import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Layout, Header, Sider, Content, Footer } from '@/components/layout/layout'

describe('Layout 布局容器', () => {
  it('渲染 Header/Content/Footer 类名', () => {
    const { container } = render(
      <Layout>
        <Header>头</Header>
        <Content>内容</Content>
        <Footer>脚</Footer>
      </Layout>
    )
    expect(container.querySelector('.sofa-layout-header')).toBeTruthy()
    expect(container.querySelector('.sofa-layout-content')).toBeTruthy()
    expect(container.querySelector('.sofa-layout-footer')).toBeTruthy()
    expect(container.querySelector('.sofa-layout-has-sider')).toBeFalsy()
  })

  it('含 Sider 时启用横向排布类名', () => {
    const { container } = render(
      <Layout>
        <Sider>侧栏</Sider>
        <Content>内容</Content>
      </Layout>
    )
    expect(container.querySelector('.sofa-layout-has-sider')).toBeTruthy()
  })

  it('Sider 折叠切换触发 onCollapse', async () => {
    const fn = vi.fn()
    render(
      <Layout hasSider>
        <Sider collapsible onCollapse={fn}>
          侧栏
        </Sider>
      </Layout>
    )
    await userEvent.click(screen.getByLabelText('折叠侧边栏'))
    expect(fn).toHaveBeenCalledWith(true)
    expect(screen.getByLabelText('展开侧边栏')).toBeTruthy()
  })

  it('Sider 受控 collapsed 不改变内部状态', async () => {
    const fn = vi.fn()
    render(
      <Layout hasSider>
        <Sider collapsible collapsed={false} onCollapse={fn}>
          侧栏
        </Sider>
      </Layout>
    )
    await userEvent.click(screen.getByLabelText('折叠侧边栏'))
    expect(fn).toHaveBeenCalledWith(true)
    expect(screen.getByLabelText('折叠侧边栏')).toBeTruthy()
  })
})