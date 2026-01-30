'use client' // Tells Next.js this is a client-side component (needed for useState)

import { useState } from 'react' // Import React hook for managing state

// Component receives an onAdd function from the parent to send the new task back
export default function TaskForm({ onAdd }: { onAdd: (task: any) => void }) {
  // State for the task title input
  const [title, setTitle] = useState('')
  // State for the due date input
  const [dueDate, setDueDate] = useState('')

  // Called when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Prevents the page from refreshing
    if (!title || !dueDate) return // Don't allow empty fields

    // Create a new task object
    const newTask = {
      id: Date.now().toString(), // Unique ID using the timestamp
      title,
      dueDate,
      completed: false, // Default to incomplete
    }

    onAdd(newTask) // Send the new task to the parent component
    setTitle('')    // Clear the input field
    setDueDate('')  // Clear the date picker
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Input for the task title */}
      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="What now? 😑"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Update title state
      />

      {/* Input for the due date */}
      <input
        className="w-full p-2 border rounded"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)} // Update due date state
      />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Add Task
      </button>
    </form>
  )
}
