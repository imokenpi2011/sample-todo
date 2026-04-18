'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import type { Todo } from '@/types/todo'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitEdit = () => {
    onEdit(todo.id, draft)
    setEditing(false)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setDraft(todo.text)
      setEditing(false)
    }
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 group hover:bg-gray-50 transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'border-green-400 bg-green-400 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commitEdit}
          className="flex-1 text-base outline-none border-b border-blue-400 bg-transparent py-0.5"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-base cursor-text select-none ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-lg leading-none"
        title="削除"
      >
        ×
      </button>
    </li>
  )
}
