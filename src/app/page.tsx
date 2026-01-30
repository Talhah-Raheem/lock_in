'use client'

import { useState, useEffect, useCallback } from 'react'
import TaskForm from './components/TaskForm'

interface Task {
  id: string
  title: string
  dueDate: string
  completed: boolean
}

interface DeletedTask {
  task: Task
  timeoutId: NodeJS.Timeout
}

// Format date to readable string (e.g., "Jan 29, 2026")
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Check if date is overdue
const isOverdue = (dateStr: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [tab, setTab] = useState<'all' | 'completed'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [deletedTask, setDeletedTask] = useState<DeletedTask | null>(null)

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lockin-tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('lockin-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel editing
      if (e.key === 'Escape' && editingId) {
        cancelEdit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingId])

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id)
    if (!taskToDelete) return

    // Clear any existing undo timeout
    if (deletedTask) {
      clearTimeout(deletedTask.timeoutId)
    }

    // Remove task from list
    setTasks(tasks.filter((t) => t.id !== id))

    // Set up undo with 5 second timeout
    const timeoutId = setTimeout(() => {
      setDeletedTask(null)
    }, 5000)

    setDeletedTask({ task: taskToDelete, timeoutId })
  }

  const undoDelete = () => {
    if (!deletedTask) return
    clearTimeout(deletedTask.timeoutId)
    setTasks([...tasks, deletedTask.task])
    setDeletedTask(null)
  }

  const dismissToast = () => {
    if (deletedTask) {
      clearTimeout(deletedTask.timeoutId)
      setDeletedTask(null)
    }
  }

  const clearAllCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed))
  }

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDueDate(task.dueDate)
  }

  const saveEdit = () => {
    if (!editTitle.trim() || !editDueDate) return
    setTasks(
      tasks.map((t) =>
        t.id === editingId ? { ...t, title: editTitle, dueDate: editDueDate } : t
      )
    )
    setEditingId(null)
  }

  const cancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  // Handle Enter key in edit inputs
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    }
  }

  // Filter and sort tasks by due date (earliest first)
  const filteredTasks = tasks
    .filter((task) => (tab === 'completed' ? task.completed : !task.completed))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const pendingCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Lock-In
          </h1>
          <p className="text-slate-400">Stay focused. Get it done.</p>
        </div>

        {/* Task Form */}
        <TaskForm onAdd={handleAddTask} />

        {/* Tab Navigation */}
        <div className="flex bg-slate-800/50 rounded-xl p-1 mt-8 mb-6">
          <button
            onClick={() => setTab('all')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              tab === 'all'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending
            {pendingCount > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  tab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              tab === 'completed'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed
            {completedCount > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  tab === 'completed' ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {completedCount}
              </span>
            )}
          </button>
        </div>

        {/* Clear All Completed Button */}
        {tab === 'completed' && completedCount > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={clearAllCompleted}
              className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear all completed
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {tab === 'all' ? (
                <p>No pending tasks. Add one above!</p>
              ) : (
                <p>No completed tasks yet.</p>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 transition-all duration-200 hover:bg-slate-800 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() =>
                      setTasks(
                        tasks.map((t) =>
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        )
                      )
                    }
                    className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-500 hover:border-emerald-400'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">
                          Press Enter to save, Escape to cancel
                        </p>
                      </div>
                    ) : (
                      <>
                        <p
                          className={`text-white font-medium ${
                            task.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            !task.completed && isOverdue(task.dueDate)
                              ? 'text-red-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {!task.completed && isOverdue(task.dueDate) && 'Overdue: '}
                          {formatDate(task.dueDate)}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {editingId !== task.id && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 text-center text-slate-500 text-sm">
            {completedCount} of {tasks.length} tasks completed
          </div>
        )}
      </div>

      {/* Undo Delete Toast */}
      {deletedTask && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-4 animate-slide-up">
          <p className="text-white text-sm">
            Task deleted
          </p>
          <button
            onClick={undoDelete}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Undo
          </button>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </main>
  )
}
