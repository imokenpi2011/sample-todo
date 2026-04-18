import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TodoInput } from '@/components/TodoInput'

describe('TodoInput', () => {
  it('プレースホルダーが表示される', () => {
    render(<TodoInput onAdd={vi.fn()} onToggleAll={vi.fn()} hasItems={false} />)
    expect(screen.getByPlaceholderText('タスクを入力...')).toBeInTheDocument()
  })

  it('テキストを入力して追加ボタンで onAdd が呼ばれる', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} onToggleAll={vi.fn()} hasItems={false} />)
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'テストタスク')
    await userEvent.click(screen.getByRole('button', { name: '追加' }))
    expect(onAdd).toHaveBeenCalledWith('テストタスク')
  })

  it('Enter キーで onAdd が呼ばれる', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} onToggleAll={vi.fn()} hasItems={false} />)
    await userEvent.type(screen.getByPlaceholderText('タスクを入力...'), 'テストタスク{Enter}')
    expect(onAdd).toHaveBeenCalledWith('テストタスク')
  })

  it('追加後に入力欄がクリアされる', async () => {
    render(<TodoInput onAdd={vi.fn()} onToggleAll={vi.fn()} hasItems={false} />)
    const input = screen.getByPlaceholderText('タスクを入力...')
    await userEvent.type(input, 'テスト{Enter}')
    expect(input).toHaveValue('')
  })

  it('空文字のとき追加ボタンが無効になる', () => {
    render(<TodoInput onAdd={vi.fn()} onToggleAll={vi.fn()} hasItems={false} />)
    expect(screen.getByRole('button', { name: '追加' })).toBeDisabled()
  })

  it('hasItems=true のとき一括切り替えボタンが表示される', () => {
    render(<TodoInput onAdd={vi.fn()} onToggleAll={vi.fn()} hasItems={true} />)
    expect(screen.getByTitle('すべて切り替え')).toBeInTheDocument()
  })

  it('hasItems=false のとき一括切り替えボタンが表示されない', () => {
    render(<TodoInput onAdd={vi.fn()} onToggleAll={vi.fn()} hasItems={false} />)
    expect(screen.queryByTitle('すべて切り替え')).not.toBeInTheDocument()
  })

  it('一括切り替えボタンを押すと onToggleAll が呼ばれる', async () => {
    const onToggleAll = vi.fn()
    render(<TodoInput onAdd={vi.fn()} onToggleAll={onToggleAll} hasItems={true} />)
    await userEvent.click(screen.getByTitle('すべて切り替え'))
    expect(onToggleAll).toHaveBeenCalled()
  })
})
