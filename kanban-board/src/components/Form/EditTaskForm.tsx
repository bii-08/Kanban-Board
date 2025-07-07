import React, { useState } from 'react'
import type { Task } from '../../types/type.ts'
import './styles.css'

interface EditTaskFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
}

export function EditTaskForm({task, onSave}: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [tag, setTag] = useState(task.tag || "")
  const [dueDate, setDueDate] = useState(task.dueDate || "")

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title,
      tag,
      dueDate,
    }
    onSave(updatedTask)
  }
  return (
    <div className="edit-task-form">
      <h3>Edit Task</h3>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          placeholder="Enter task title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tag">Tag</label>
        <select id="tag" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">None</option>
          <option value="design">Design</option>
          <option value="dev">Development</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button onClick={handleSave}>💾 Save</button>
      </div>
    </div>
  )
}