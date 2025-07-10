import React, { useState, type ChangeEvent } from 'react'
import './styles.css'
import { Card } from '../Card/Card.tsx'
import type { Task, ColumnProps } from '../../types/type.ts'
import { Popup } from '../Popup/Popup.tsx'
import { EditTaskForm } from '../Form/EditTaskForm.tsx'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

export function Column({ id, title, tasks, setTasks, activeId, overId }: ColumnProps) {

  const { setNodeRef: setDroppableRef } = useDroppable({ id })
  
  const isActiveColumn = activeId && tasks.some(task => task.id === activeId)
  const isOverColumn = overId === id || tasks.some(task => task.id === overId)

  const columnClass = [
  'column',
  isActiveColumn ? 'column-highlight-source' : '',
  isOverColumn ? 'column-highlight-target' : '',
].join(' ');

  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleAddNewTask = () => {
    if (newTaskTitle.trim() === "") return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle
    };
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    setNewTaskTitle("")
  }

  const handleTaskChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    setNewTaskTitle(target.value)
  }
  const handleCardClick = (task: Task) => {
    setActiveTask(task)
  }
  return (
    <>
      <div
        ref={setDroppableRef}
        className={columnClass}>

        <h3 className="column-title">{title}</h3>

        <SortableContext
          id={id}
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="column-tasks">
            {tasks.map(task => (
              <Card
                key={task.id}
                {...task}
                onClick={() => handleCardClick(task)}
              />
            ))}
          </div>
        </SortableContext>

        <div className="add-task">
          <input
            type="text"
            value={newTaskTitle}
            placeholder='Add a card...'
            onChange={handleTaskChange}
          />
          <button onClick={handleAddNewTask}>
            ➕
          </button>
        </div>
      </div>

      {activeTask && (
        <Popup
          isOpen={!!activeTask}
          // position={popupPos}
          onClose={() => { setActiveTask(null) }}>
          <EditTaskForm
            task={activeTask}
            onSave={(updatedTask) => {
              const updatedTasks = tasks.map((t) =>
                t.id === updatedTask.id ? updatedTask : t
              )
              setTasks(updatedTasks)
              setActiveTask(null);
            }}
          />
        </Popup>
      )}
    </>
  )
}