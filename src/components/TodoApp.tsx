'use client'

import { useTodos } from '@/hooks/useTodos'
import { TodoInput } from './TodoInput'
import { TodoItem } from './TodoItem'
import { TodoFooter } from './TodoFooter'

export function TodoApp() {
  const {
    todos,
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
  } = useTodos()

  const hasAnyTodo = activeCount + completedCount > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-light text-center text-gray-600 mb-8 tracking-widest">
          TODO
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <TodoInput onAdd={addTodo} onToggleAll={toggleAll} hasItems={hasAnyTodo} />

          {todos.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center text-gray-300 text-sm">
              タスクがありません
            </div>
          )}

          {hasAnyTodo && (
            <TodoFooter
              activeCount={activeCount}
              completedCount={completedCount}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={clearCompleted}
            />
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          ダブルクリックで編集 · Enter で確定 · Escape でキャンセル
        </p>
      </div>
    </div>
  )
}
