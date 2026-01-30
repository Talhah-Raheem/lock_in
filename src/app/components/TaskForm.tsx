'use client'

import { useState } from 'react'

export default function TaskForm({ onAdd }: { onAdd: (task: any) => void }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) return

    const newTask = {
      id: Date.now().toString(),
      title,
      dueDate,
      completed: false,
    }

    onAdd(newTask)
    setTitle('')
    setDueDate('')
    setIsExpanded(false)
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 transition-all duration-200">
        {/* Main Input Row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
          </div>
          <button
            type="submit"
            disabled={!title || !dueDate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Expandable Date Section */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Due date</span>
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Date Buttons */}
        {isExpanded && (
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                setDueDate(tomorrow.toISOString().split('T')[0])
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                dueDate === new Date(Date.now() + 86400000).toISOString().split('T')[0]
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date()
                const dayOfWeek = now.getDay() // 0 = Sunday
                const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
                const sunday = new Date()
                sunday.setDate(now.getDate() + daysUntilSunday)
                setDueDate(sunday.toISOString().split('T')[0])
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                (() => {
                  const now = new Date()
                  const dayOfWeek = now.getDay()
                  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
                  const sunday = new Date()
                  sunday.setDate(now.getDate() + daysUntilSunday)
                  return dueDate === sunday.toISOString().split('T')[0]
                })()
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Sunday
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
