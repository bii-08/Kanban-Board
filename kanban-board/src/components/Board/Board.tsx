import React, {useState} from 'react'
import { Column } from '../Column/Column.tsx'
import type { Task } from '../../types/type.ts'
import './styles.css'
import { DndContext, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

export function Board() {
   
  const todoTasks: Task[] = [];
  const inProgressTasks: Task[] = [];
  const inReviewTasks: Task[] = [];
  const doneTasks: Task[] = [];

  const [columns, setColumns] = useState({
    todo: todoTasks,
    inProgress: inProgressTasks,
    inReview: inReviewTasks,
    done: doneTasks
  })
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const {active, over} = event
    
    // If dropped outside a valid area or no change, do nothing
    if (!over || active.id === over.id) return
    console.log("ACTIVE ID:", active.id)
    console.log("OVER ID:", over.id)

    for (const columnId in columns) {
      // We need to tell TypeScript that columnId is a valid key of the columns object.
      const typedColumnId = columnId as keyof typeof columns
      const column = columns[typedColumnId]
      /*
      - findIndex() will returns the index of the item you're looking for (eg: 0, 1,2)
      - Or -1 if the item wasn't found
      */ 
      const oldIndex = column.findIndex(task => task.id === active.id)
      const newIndex = column.findIndex(task => task.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedColumn = arrayMove(column, oldIndex, newIndex);
        console.log("UPDATED COLUMN:", updatedColumn)
        setColumns(prev => ({ ...prev, [columnId]: updatedColumn}))
        break
      }
    } 
  }
  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="board">
      <Column id="todo" title="Todo" tasks={columns.todo} setTasks={(tasks) => setColumns(prev => ({...prev, todo: tasks}))} activeId={activeId}/>
      <Column id="inProgress" title="In Progress" tasks={columns.inProgress} setTasks={(tasks) => setColumns(prev => ({...prev, inProgress: tasks}))} activeId={activeId}/>
      <Column id="inReview" title="In Review" tasks={columns.inReview} setTasks={(tasks) => setColumns(prev => ({...prev, inReview: tasks}))} activeId={activeId}/>
      <Column id="done" title="Done" tasks={columns.done} setTasks={(tasks) => setColumns(prev => ({...prev, done: tasks}))} activeId={activeId}/>
    </div>
    </DndContext>
    
  )
}