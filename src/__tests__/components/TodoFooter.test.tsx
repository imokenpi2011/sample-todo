import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TodoFooter } from '@/components/TodoFooter'

describe('TodoFooter', () => {
  const defaultProps = {
    activeCount: 2,
    completedCount: 1,
    filter: 'all' as const,
    onFilterChange: vi.fn(),
    onClearCompleted: vi.fn(),
  }

  it('残りタスク数が表示される', () => {
    render(<TodoFooter {...defaultProps} />)
    expect(screen.getByText('2 件残り')).toBeInTheDocument()
  })

  it('フィルターボタンが3つ表示される', () => {
    render(<TodoFooter {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
  })

  it('現在のフィルターボタンがアクティブスタイルになる', () => {
    render(<TodoFooter {...defaultProps} filter="active" />)
    expect(screen.getByRole('button', { name: '未完了' })).toHaveClass('text-blue-600')
  })

  it('フィルターボタンをクリックすると onFilterChange が呼ばれる', async () => {
    const onFilterChange = vi.fn()
    render(<TodoFooter {...defaultProps} onFilterChange={onFilterChange} />)
    await userEvent.click(screen.getByRole('button', { name: '未完了' }))
    expect(onFilterChange).toHaveBeenCalledWith('active')
    await userEvent.click(screen.getByRole('button', { name: '完了' }))
    expect(onFilterChange).toHaveBeenCalledWith('completed')
  })

  it('「完了済みを削除」ボタンをクリックすると onClearCompleted が呼ばれる', async () => {
    const onClearCompleted = vi.fn()
    render(<TodoFooter {...defaultProps} onClearCompleted={onClearCompleted} />)
    await userEvent.click(screen.getByRole('button', { name: '完了済みを削除' }))
    expect(onClearCompleted).toHaveBeenCalled()
  })

  it('完了タスクが0件のとき「完了済みを削除」ボタンが無効になる', () => {
    render(<TodoFooter {...defaultProps} completedCount={0} />)
    expect(screen.getByRole('button', { name: '完了済みを削除' })).toBeDisabled()
  })
})
