import React, { useState } from 'react'
import { Column } from '../Column/Column.tsx'
import type { Task } from '../../types/type.ts'
import { Card } from '../Card/Card.tsx'
import './styles.css'
import {
  DndContext,
  type DragEndEvent, type DragStartEvent, type DragOverEvent,
  MouseSensor, TouchSensor, useSensor, useSensors,
  DragOverlay
} from '@dnd-kit/core'
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
  const [overId, setOverId] = useState<string | null>(null)

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      }
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active
    setActiveId(String(event.active.id))

    for (const colId in columns) {
      const task = columns[colId as keyof typeof columns].find(task => task.id === id)
      if (task) {
        setActiveTask(task)
        break
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id.toString()
    if (!overId) return
    setOverId(String(overId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    setOverId(null)

    const activeId = event.active.id.toString()
    const overId = event.over?.id.toString()

    let sourceColId: keyof typeof columns | null = null
    let destinationColId: keyof typeof columns | null = null

    // If dropped outside a valid area or no change, do nothing
    if (!overId || activeId === overId) return

    for (const colId in columns) {
      const colTasks = columns[colId as keyof typeof columns]
      const taskIds = colTasks.map(task => task.id)

      if (taskIds.includes(activeId)) {
        sourceColId = colId as keyof typeof columns
      }
      if (taskIds.includes(overId) || overId === colId) {
        destinationColId = colId as keyof typeof columns
      }
    }

    if (!sourceColId || !destinationColId) return

    if (sourceColId === destinationColId) {
      // Reordering items within same column
      const column = [...columns[sourceColId]]
      const oldIndex = column.findIndex(task => task.id === activeId)
      const newIndex = column.findIndex(task => task.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const updated = arrayMove(column, oldIndex, newIndex)
        setColumns(prev => ({
          ...prev,
          [sourceColId]: updated
        }))
      }

    } else {
      // Remove item from source, insert item into destination column
      const sourceTasks = [...columns[sourceColId]]
      const destinationTasks = [...columns[destinationColId]]

      const sourceIndex = sourceTasks.findIndex(task => task.id === activeId)
      if (sourceIndex === -1) return

      const [removedTask] = sourceTasks.splice(sourceIndex, 1)

      const isDroppingIntoEmptyColumn = !columns[destinationColId].some(task => task.id === overId)
      /*
      checks whether the overId matches any task id in that column.
      If it doesn’t, it means you’re dropping into empty space — likely an empty column — so we just append the item.
      */

      if (isDroppingIntoEmptyColumn) {
        destinationTasks.push(removedTask)
      } else {
        const destinationIndex = destinationTasks.findIndex(task => task.id === overId)
        destinationTasks.splice(destinationIndex, 0, removedTask)
      }

      setColumns(prev => ({
        ...prev,
        [sourceColId]: sourceTasks,
        [destinationColId]: destinationTasks
      }))
    }
    setActiveTask(null)
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <div className="board">
        <Column id="todo" title="Todo" tasks={columns.todo} setTasks={(tasks) => setColumns(prev => ({ ...prev, todo: tasks }))} activeId={activeId} overId={overId} />
        <Column id="inProgress" title="In Progress" tasks={columns.inProgress} setTasks={(tasks) => setColumns(prev => ({ ...prev, inProgress: tasks }))} activeId={activeId} overId={overId} />
        <Column id="inReview" title="In Review" tasks={columns.inReview} setTasks={(tasks) => setColumns(prev => ({ ...prev, inReview: tasks }))} activeId={activeId} overId={overId} />
        <Column id="done" title="Done" tasks={columns.done} setTasks={(tasks) => setColumns(prev => ({ ...prev, done: tasks }))} activeId={activeId} overId={overId} />
      </div>
      <DragOverlay>
        {activeTask ? (
          <Card
            id={activeTask.id}
            title={activeTask.title}
            tag={activeTask.tag}
            dueDate={activeTask.dueDate}
            isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}