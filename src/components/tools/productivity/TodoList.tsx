'use client'

import { useState, useEffect, useCallback } from 'react'
import { PlusIcon, TrashIcon, CheckIcon, XIcon, FlagIcon, TagIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  category: string
  tags: string[]
  subtasks?: Subtask[]
}

interface Subtask {
  id: string
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newCategory, setNewCategory] = useState('Personal')
  const [newTags, setNewTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'today' | 'overdue'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Learning', 'Other']
  const priorities = ['low', 'medium', 'high'] as const

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (error) {
        console.error('Error loading todos:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch (error) {
      console.error('Error saving todos:', error)
    }
  }, [todos])

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) {
      showMessage('Please enter a task', 'error')
      return
    }

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newDueDate || undefined,
      priority: newPriority,
      category: newCategory,
      tags: newTags,
      subtasks: [],
    }

    setTodos([todo, ...todos])
    setNewTodo('')
    setNewDueDate('')
    setNewPriority('medium')
    setNewCategory('Personal')
    setNewTags([])
    setTagInput('')
    showMessage('Task added successfully!')
  }

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    showMessage('Task deleted successfully!')
  }

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
    showMessage('Completed tasks cleared!')
  }

  const handleAddSubtask = (todoId: string, subtaskText: string) => {
    if (!subtaskText.trim()) return
    
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        const subtasks = todo.subtasks || []
        return {
          ...todo,
          subtasks: [...subtasks, {
            id: Date.now().toString(),
            text: subtaskText.trim(),
            completed: false,
          }]
        }
      }
      return todo
    }))
  }

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        const subtasks = (todo.subtasks || []).map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )
        return { ...todo, subtasks }
      }
      return todo
    }))
  }

  const handleDeleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        const subtasks = (todo.subtasks || []).filter(st => st.id !== subtaskId)
        return { ...todo, subtasks }
      }
      return todo
    }))
  }

  const toggleExpanded = (todoId: string) => {
    setExpandedTodos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(todoId)) {
        newSet.delete(todoId)
      } else {
        newSet.add(todoId)
      }
      return newSet
    })
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !newTags.includes(tag)) {
      setNewTags([...newTags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(tag => tag !== tagToRemove))
  }

  const isToday = (date: string) => {
    const today = new Date()
    const taskDate = new Date(date)
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    )
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    if (filter === 'today') return todo.dueDate && isToday(todo.dueDate)
    if (filter === 'overdue') return isOverdue(todo.dueDate)
    
    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority
    
    return matchesCategory && matchesPriority
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Sort by priority first (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    // Then by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const activeTodosCount = todos.filter(todo => !todo.completed).length
  const overdueCount = todos.filter(todo => !todo.completed && isOverdue(todo.dueDate)).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <form onSubmit={handleAddTodo} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task
              </label>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Add
                </button>
              </div>
              {newTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-600"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-md ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 text-xs rounded-md ${
                  filter === 'active'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({activeTodosCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-xs rounded-md ${
                  filter === 'completed'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`px-3 py-1 text-xs rounded-md ${
                  filter === 'today'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilter('overdue')}
                className={`px-3 py-1 text-xs rounded-md ${
                  filter === 'overdue'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overdue ({overdueCount})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                >
                  <option value="all">All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleClearCompleted}
              className="w-full text-xs text-red-600 hover:text-red-700 border border-red-300 rounded-md px-3 py-2 hover:bg-red-50"
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {sortedTodos.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
            {todos.length === 0 ? 'No tasks yet. Add your first task!' : 'No tasks match your filters.'}
          </div>
        ) : (
          sortedTodos.map((todo) => {
            const hasSubtasks = todo.subtasks && todo.subtasks.length > 0
            const isExpanded = expandedTodos.has(todo.id)
            const completedSubtasks = (todo.subtasks || []).filter(st => st.completed).length
            const totalSubtasks = (todo.subtasks || []).length

            return (
              <div
                key={todo.id}
                className={`bg-white rounded-lg border p-4 ${
                  isOverdue(todo.dueDate) && !todo.completed
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      todo.completed
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {todo.completed && <CheckIcon className="h-3 w-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span
                          className={`block ${
                            todo.completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {todo.text}
                        </span>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                            {todo.priority}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {todo.category}
                          </span>
                          {todo.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded flex items-center gap-1"
                            >
                              <TagIcon className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                          {todo.dueDate && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              isOverdue(todo.dueDate) && !todo.completed
                                ? 'bg-red-100 text-red-800'
                                : isToday(todo.dueDate)
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isToday(todo.dueDate) ? 'Today' : isOverdue(todo.dueDate) ? 'Overdue' : new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {hasSubtasks && (
                          <button
                            onClick={() => toggleExpanded(todo.id)}
                            className="text-gray-600 hover:text-gray-700"
                            title={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {hasSubtasks && (
                      <div className="mt-2 text-xs text-gray-500">
                        Subtasks: {completedSubtasks}/{totalSubtasks} completed
                      </div>
                    )}

                    {isExpanded && hasSubtasks && (
                      <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
                        {(todo.subtasks || []).map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleSubtask(todo.id, subtask.id)}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                subtask.completed
                                  ? 'bg-indigo-600 border-indigo-600'
                                  : 'border-gray-300'
                              }`}
                            >
                              {subtask.completed && <CheckIcon className="h-2 w-2 text-white" />}
                            </button>
                            <span
                              className={`flex-1 text-sm ${
                                subtask.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-700'
                              }`}
                            >
                              {subtask.text}
                            </span>
                            <button
                              onClick={() => handleDeleteSubtask(todo.id, subtask.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add subtask..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement
                                handleAddSubtask(todo.id, input.value)
                                input.value = ''
                              }
                            }}
                            className="flex-1 text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
        {overdueCount > 0 && (
          <span className="ml-2 text-red-600 font-medium">
            • {overdueCount} overdue
          </span>
        )}
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
