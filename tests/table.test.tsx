import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Table, type TableColumn, type TableRecord } from '@/components/table/table'

interface Row extends TableRecord {
  name: string
  age: number
}

const columns: TableColumn<Row>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
  { key: 'age', title: '年龄', dataIndex: 'age', sorter: (a, b) => a.age - b.age, filters: [
    { text: '20 岁', value: 20 },
    { text: '30 岁', value: 30 }
  ] }
]

const rows: Row[] = [
  { key: '1', name: '小明', age: 30 },
  { key: '2', name: '小红', age: 20 },
  { key: '3', name: '小刚', age: 20 }
]

describe('Table 表格', () => {
  it('默认渲染单元格内容与表头', () => {
    const { container } = render(<Table columns={columns} dataSource={rows} pagination={false} />)
    expect(container.querySelector('.sofa-table')).toBeTruthy()
    expect(screen.getByText('姓名')).toBeTruthy()
    expect(screen.getByText('小明')).toBeTruthy()
    expect(screen.getByText('30')).toBeTruthy()
  })

  it('点击表头排序循环 descend → ascend → 取消，并回传 sorter', async () => {
    const fn = vi.fn()
    const { container } = render(
      <Table columns={columns} dataSource={rows} pagination={false} onChange={fn} />
    )
    const ageTh = screen.getByText('年龄')
    const cells = () =>
      Array.from(container.querySelectorAll('.sofa-table-row')).map((r) => r.textContent ?? '')

    // 首次点击 desc：大值在前
    await userEvent.click(ageTh)
    expect(fn).toHaveBeenLastCalledWith(
      expect.anything(),
      { field: 'age', order: 'descend' },
      expect.anything()
    )
    expect(cells()[0]).toContain('小明')

    // 二次点击 asc：小值在前
    await userEvent.click(ageTh)
    expect(fn).toHaveBeenLastCalledWith(expect.anything(), { field: 'age', order: 'ascend' }, expect.anything())
    expect(cells()[0]).toContain('小红')

    // 三次点击取消排序，恢复原始顺序
    await userEvent.click(ageTh)
    expect(fn).toHaveBeenLastCalledWith(expect.anything(), null, expect.anything())
    expect(cells()[0]).toContain('小明')
  })

  it('筛选浮层：勾选条件确定后本地过滤，ESC 关闭', async () => {
    const filterBtn = screen.queryByRole('button', { name: /筛选/ })
    void filterBtn
    const { container } = render(<Table columns={columns} dataSource={rows} pagination={false} />)

    await userEvent.click(screen.getByRole('button', { name: '筛选 年龄' }))
    const popup = container.querySelector('.sofa-table-filter-popup')
    expect(popup).toBeTruthy()

    await userEvent.click(screen.getByText('20 岁'))
    await userEvent.click(screen.getByText('确定'))
    expect(container.querySelector('.sofa-table-filter-popup')).toBeNull()
    const bodies = () =>
      Array.from(container.querySelectorAll('.sofa-table-row')).map((r) => r.textContent ?? '')
    expect(bodies()).toHaveLength(2)
    expect(bodies()[0]).toContain('小红')
    expect(bodies()[0]).not.toContain('小明')

    // ESC 关闭浮层
    await userEvent.click(screen.getByRole('button', { name: '筛选 年龄' }))
    expect(container.querySelector('.sofa-table-filter-popup')).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(container.querySelector('.sofa-table-filter-popup')).toBeNull()
  })

  it('本地分页：每页切片并触发页码回调', async () => {
    const fn = vi.fn()
    const { container } = render(
      <Table
        columns={[{ key: 'name', title: '姓名', dataIndex: 'name' }]}
        dataSource={rows}
        pagination={{ pageSize: 2, onChange: fn }}
      />
    )
    expect(container.querySelectorAll('.sofa-table-row')).toHaveLength(2)
    expect(screen.getByText('小明')).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: '下一页' }))
    expect(container.querySelectorAll('.sofa-table-row')).toHaveLength(1)
    expect(screen.getByText('小刚')).toBeTruthy()
    expect(fn).toHaveBeenCalledWith(2, 2)
  })

  it('行选择：全选与半选联动，单选模式互斥', async () => {
    const fn = vi.fn()
    const { container } = render(
      <Table
        columns={[{ key: 'name', title: '姓名', dataIndex: 'name' }]}
        dataSource={rows}
        pagination={false}
        rowSelection={{ onChange: fn }}
      />
    )
    const rowsChecked = () =>
      Array.from(container.querySelectorAll('.sofa-table-row-checkbox') as NodeListOf<HTMLInputElement>).map(
        (i) => i.checked
      )
    await userEvent.click(screen.getByRole('checkbox', { name: '选择行 2' }))
    expect(rowsChecked()[1]).toBe(true)
    expect(fn).toHaveBeenLastCalledWith(['2'], [expect.objectContaining({ key: '2' })])
    expect(
      (container.querySelector('.sofa-table-select-all') as HTMLInputElement).indeterminate
    ).toBe(true)

    await userEvent.click(screen.getByRole('checkbox', { name: '全选' }))
    expect(rowsChecked().every(Boolean)).toBe(true)
    expect(
      (container.querySelector('.sofa-table-select-all') as HTMLInputElement).indeterminate
    ).toBe(false)
  })

it('单选模式：选中替换且不可取消', async () => {
    const { container } = render(
      <Table
        columns={[{ key: 'name', title: '姓名', dataIndex: 'name' }]}
        dataSource={rows}
        pagination={false}
        rowSelection={{ type: 'radio' }}
      />
    )
    const radios = () =>
      Array.from(container.querySelectorAll('.sofa-table-row-radio') as NodeListOf<HTMLInputElement>)
    await userEvent.click(radios()[0])
    expect(radios()[0].checked).toBe(true)
    await userEvent.click(radios()[1])
    expect(radios()[0].checked).toBe(false)
    expect(radios()[1].checked).toBe(true)
  })

  it('展开行：点击展开按钮渲染展开内容并回调', async () => {
    const fn = vi.fn()
    const { container } = render(
      <Table
        columns={[{ key: 'name', title: '姓名', dataIndex: 'name' }]}
        dataSource={[{ key: '1', name: '小明' }]}
        pagination={false}
        expandable={{
          renderExpandedRow: (r) => `详细：${r.name}`,
          onExpand: fn
        }}
      />
    )
    expect(container.querySelector('.sofa-table-expanded-row')).toBeNull()
    expect(screen.queryByText('详细：小明')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: '展开' }))
    expect(screen.getByText('详细：小明')).toBeTruthy()
    expect(fn).toHaveBeenCalledWith(true, expect.objectContaining({ key: '1' }))
  })

  it('onRow 透传属性与事件，loading/bordered/size 类名', async () => {
    const rowClick = vi.fn()
    const { container } = render(
      <Table
        columns={[{ key: 'name', title: '姓名', dataIndex: 'name' }]}
        dataSource={[{ key: '1', name: '小明' }]}
        pagination={false}
        loading
        bordered
        size="small"
        onRow={() => ({ onClick: rowClick, 'data-test-row': 'abc' })}
      />
    )
    expect(container.querySelector('.sofa-table-loading')).toBeTruthy()
    expect(container.querySelector('.sofa-table-bordered')).toBeTruthy()
    expect(container.querySelector('.sofa-table-small')).toBeTruthy()
    expect(container.querySelector('[data-test-row="abc"]')).toBeTruthy()
    await userEvent.click(container.querySelector('.sofa-table-row') as HTMLElement)
    expect(rowClick).toHaveBeenCalledTimes(1)
  })
})