import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTodos } from '@/hooks/useTodos'

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('初期状態は空のリスト', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toHaveLength(0)
    expect(result.current.activeCount).toBe(0)
    expect(result.current.completedCount).toBe(0)
  })

  it('タスクを追加できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('テストタスク') })
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('テストタスク')
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('空文字や空白のみのタスクは追加されない', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('') })
    act(() => { result.current.addTodo('   ') })
    expect(result.current.todos).toHaveLength(0)
  })

  it('前後の空白はトリムされる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('  タスク  ') })
    expect(result.current.todos[0].text).toBe('タスク')
  })

  it('タスクを完了/未完了に切り替えできる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク') })
    const id = result.current.todos[0].id
    act(() => { result.current.toggleTodo(id) })
    expect(result.current.todos[0].completed).toBe(true)
    act(() => { result.current.toggleTodo(id) })
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('タスクを削除できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク1') })
    act(() => { result.current.addTodo('タスク2') })
    // 先頭追加なので todos[0] = タスク2、todos[1] = タスク1
    const id = result.current.todos[0].id
    act(() => { result.current.deleteTodo(id) })
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('タスク1')
  })

  it('タスクのテキストを編集できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('古いテキスト') })
    const id = result.current.todos[0].id
    act(() => { result.current.editTodo(id, '新しいテキスト') })
    expect(result.current.todos[0].text).toBe('新しいテキスト')
  })

  it('空文字で編集するとタスクが削除される', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク') })
    const id = result.current.todos[0].id
    act(() => { result.current.editTodo(id, '   ') })
    expect(result.current.todos).toHaveLength(0)
  })

  it('完了済みタスクを一括削除できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク1') })
    act(() => { result.current.addTodo('タスク2') })
    act(() => { result.current.addTodo('タスク3') })
    act(() => { result.current.toggleTodo(result.current.todos[0].id) })
    act(() => { result.current.toggleTodo(result.current.todos[1].id) })
    act(() => { result.current.clearCompleted() })
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('全タスクを一括完了できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク1') })
    act(() => { result.current.addTodo('タスク2') })
    act(() => { result.current.toggleAll() })
    expect(result.current.todos.every(t => t.completed)).toBe(true)
  })

  it('全完了済みの状態で toggleAll すると全て未完了になる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク1') })
    act(() => { result.current.addTodo('タスク2') })
    act(() => { result.current.toggleAll() })
    act(() => { result.current.toggleAll() })
    expect(result.current.todos.every(t => !t.completed)).toBe(true)
  })

  it('activeCount と completedCount が正確に更新される', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('タスク1') })
    act(() => { result.current.addTodo('タスク2') })
    act(() => { result.current.addTodo('タスク3') })
    act(() => { result.current.toggleTodo(result.current.todos[0].id) })
    expect(result.current.activeCount).toBe(2)
    expect(result.current.completedCount).toBe(1)
  })

  describe('フィルター', () => {
    it('active フィルターで未完了タスクのみ表示', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('タスク1') })
      act(() => { result.current.addTodo('タスク2') })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })
      act(() => { result.current.setFilter('active') })
      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].completed).toBe(false)
    })

    it('completed フィルターで完了タスクのみ表示', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('タスク1') })
      act(() => { result.current.addTodo('タスク2') })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })
      act(() => { result.current.setFilter('completed') })
      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].completed).toBe(true)
    })

    it('all フィルターで全タスク表示', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('タスク1') })
      act(() => { result.current.addTodo('タスク2') })
      act(() => { result.current.toggleTodo(result.current.todos[0].id) })
      act(() => { result.current.setFilter('all') })
      expect(result.current.todos).toHaveLength(2)
    })
  })

  describe('localStorage', () => {
    it('タスクが localStorage に保存される', () => {
      const { result } = renderHook(() => useTodos())
      act(() => { result.current.addTodo('保存テスト') })
      const saved = JSON.parse(localStorage.getItem('sample-todo-items') ?? '[]')
      expect(saved).toHaveLength(1)
      expect(saved[0].text).toBe('保存テスト')
    })

    it('ページ再読み込み後もデータが復元される', () => {
      const { result: r1 } = renderHook(() => useTodos())
      act(() => { r1.current.addTodo('永続化テスト') })
      const { result: r2 } = renderHook(() => useTodos())
      expect(r2.current.todos).toHaveLength(1)
      expect(r2.current.todos[0].text).toBe('永続化テスト')
    })
  })
})
