import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { TodoApp } from '@/components/TodoApp'

describe('TodoApp (統合テスト)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('初期表示でタイトルが表示される', () => {
    render(<TodoApp />)
    expect(screen.getByText('TODO')).toBeInTheDocument()
  })

  it('タスクがないとき空メッセージが表示される', () => {
    render(<TodoApp />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスクを追加できる', async () => {
    render(<TodoApp />)
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '買い物に行く{Enter}')
    expect(screen.getByText('買い物に行く')).toBeInTheDocument()
  })

  it('タスクを完了にしてフィルタリングできる', async () => {
    render(<TodoApp />)
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'タスク1{Enter}')
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'タスク2{Enter}')

    // 先頭追加なので表示順は [タスク2, タスク1]。checkButtons[0] でタスク2を完了にする
    const checkButtons = screen.getAllByRole('button', { name: '' })
    await userEvent.click(checkButtons[0])

    // 未完了フィルター → タスク1のみ表示
    await userEvent.click(screen.getByRole('button', { name: '未完了' }))
    expect(screen.getByText('タスク1')).toBeInTheDocument()
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument()

    // 完了フィルター → タスク2のみ表示
    await userEvent.click(screen.getByRole('button', { name: '完了' }))
    expect(screen.getByText('タスク2')).toBeInTheDocument()
    expect(screen.queryByText('タスク1')).not.toBeInTheDocument()
  })

  it('タスクを削除できる', async () => {
    render(<TodoApp />)
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), '削除するタスク{Enter}')
    await userEvent.click(screen.getByTitle('削除'))
    expect(screen.queryByText('削除するタスク')).not.toBeInTheDocument()
  })

  it('完了済みタスクを一括削除できる', async () => {
    render(<TodoApp />)
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'タスク1{Enter}')
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'タスク2{Enter}')
    // 先頭追加なので checkButtons[0] はタスク2を指す
    const checkButtons = screen.getAllByRole('button', { name: '' })
    await userEvent.click(checkButtons[0])
    await userEvent.click(screen.getByRole('button', { name: '完了済みを削除' }))
    expect(screen.queryByText('タスク2')).not.toBeInTheDocument()
    expect(screen.getByText('タスク1')).toBeInTheDocument()
  })
})
