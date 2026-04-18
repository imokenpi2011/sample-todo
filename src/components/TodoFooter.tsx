import type { FilterType } from '../types/todo'

interface Props {
  activeCount: number
  completedCount: number
  filter: FilterType
  onFilterChange: (f: FilterType) => void
  onClearCompleted: () => void
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'active', label: '未完了' },
  { key: 'completed', label: '完了' },
]

export function TodoFooter({ activeCount, completedCount, filter, onFilterChange, onClearCompleted }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500">
      <span>{activeCount} 件残り</span>
      <div className="flex gap-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === f.key
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        完了済みを削除
      </button>
    </div>
  )
}
