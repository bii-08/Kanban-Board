import React, { useState } from 'react'
import type { Task } from '../../types/type.ts'
import './styles.css'

interface EditTaskFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
}

export function EditTaskForm({ task, onSave }: EditTaskFormProps) {
  const [title, setTitle] = useState<string>(task.title)
  const [tag, setTag] = useState<string>(task.tag || "")
  const [dueDate, setDueDate] = useState<string>(task.dueDate || "")
  const [tagColor, setTagColor] = useState<string>(task.tagColor || "#10b981")

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title,
      tag,
      dueDate,
      tagColor,
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
        
        <div className='tag-input-row'>
          <label htmlFor="tag">Tag</label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag name"
          />
          <label>Tag Color</label>
          <input
            type="color"
            value={tagColor}
            onChange={(e) => setTagColor(e.target.value)}
          />
        </div>
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