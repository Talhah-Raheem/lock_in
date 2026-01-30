'use client' // Required for using client-side hooks like useState and useEffect

import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm' // Import the form component

// Define what a Task looks like
interface Task {
  id: string
  title: string
  dueDate: string
  completed: boolean
}

export default function Home() {
  // All tasks stored here
  const [tasks, setTasks] = useState<Task[]>([])

  // Tab state: "all" or "completed"
  const [tab, setTab] = useState<'all' | 'completed'>('all')

  // Load tasks from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem('lockin-tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  // Save tasks to localStorage anytime they change
  useEffect(() => {
    localStorage.setItem('lockin-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Add a new task to the list
  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  // Delete a task by id
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <main className="max-w-xl mx-auto mt-10 p-4">
      {/* App title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Lock-In 🔒</h1>

      {/* Tab Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded transition-all ${
            tab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-4 py-2 rounded transition-all ${
            tab === 'completed' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Completed Tasks
        </button>
      </div>

      {/* Task Input Form */}
      <TaskForm onAdd={handleAddTask} />

      {/* Task List */}
      <ul className="mt-6 space-y-2">
        {tasks
          // Filter tasks based on active tab
          .filter((task) => (tab === 'completed' ? task.completed : !task.completed))
          .map((task) => (
            <li
              key={task.id}
              className={`p-3 border rounded flex justify-between items-center transition-all ${
                task.completed ? 'bg-green-900 text-black-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Checkbox to toggle complete */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    setTasks(
                      tasks.map((t) =>
                        t.id === task.id
                          ? { ...t, completed: !t.completed }
                          : t
                      )
                    )
                  }
                />

                {/* Task Text */}
                <div>
                  <p
                    className={`font-medium transition-all ${
                      task.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">{task.dueDate}</p>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded transition-all"
                title="Delete task"
              >
                ✕
              </button>
            </li>
          ))}
      </ul>
    </main>
  )
}
