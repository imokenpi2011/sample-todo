import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TodoItem } from '@/components/TodoItem'
import type { Todo } from '@/types/todo'

const baseTodo: Todo = {
  id: '1',
  text: 'テストタスク',
  completed: false,
  createdAt: Date.now(),
}

describe('TodoItem', () => {
  it('タスクのテキストが表示される', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('完了済みタスクに取り消し線が付く', () => {
    const completed = { ...baseTodo, completed: true }
    render(<TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText('テストタスク')).toHaveClass('line-through')
  })

  it('チェックボタンをクリックすると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: '' }))
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
    const onDelete = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />)
    await userEvent.click(screen.getByTitle('削除'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('ダブルクリックで編集モードになる', async () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await userEvent.dblClick(screen.getByText('テストタスク'))
    expect(screen.getByDisplayValue('テストタスク')).toBeInTheDocument()
  })

  it('編集して Enter で onEdit が呼ばれる', async () => {
    const onEdit = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />)
    await userEvent.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByDisplayValue('テストタスク')
    await userEvent.clear(input)
    await userEvent.type(input, '更新後タスク{Enter}')
    expect(onEdit).toHaveBeenCalledWith('1', '更新後タスク')
  })

  it('編集中に Escape で変更がキャンセルされる', async () => {
    const onEdit = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />)
    await userEvent.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByDisplayValue('テストタスク')
    await userEvent.clear(input)
    await userEvent.type(input, '途中まで入力{Escape}')
    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })
})
