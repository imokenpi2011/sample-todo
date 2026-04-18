import { useState, type KeyboardEvent } from 'react'

interface Props {
  onAdd: (text: string) => void
  onToggleAll: () => void
  hasItems: boolean
}

export function TodoInput({ onAdd, onToggleAll, hasItems }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    onAdd(value)
    setValue('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
      {hasItems && (
        <button
          onClick={onToggleAll}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          title="すべて切り替え"
        >
          ❯
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="タスクを入力..."
        className="flex-1 text-lg outline-none placeholder-gray-300 bg-transparent"
        autoFocus
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        追加
      </button>
    </div>
  )
}
