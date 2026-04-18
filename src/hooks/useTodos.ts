'use client'

import { useState, useEffect } from 'react'
import type { Todo, FilterType } from '@/types/todo'

const STORAGE_KEY = 'sample-todo-items'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos(prev => [
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ])
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const editTodo = (id: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) {
      deleteTodo(id)
      return
    }
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: trimmed } : t)))
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const toggleAll = () => {
    const allCompleted = todos.every(t => t.completed)
    setTodos(prev => prev.map(t => ({ ...t, completed: !allCompleted })))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return {
    todos: filtered,
    filter,
    setFilter,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    toggleAll,
  }
}
