import React, { useRef } from 'react'
import './styles.css'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CardProps {
  id: string;
  title: string;
  tag?: string;
  dueDate?: string;
  onClick?: () => void;
  isOverlay?: boolean;
}
export function Card({ id, title, tag, dueDate, onClick, isOverlay = false }: CardProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging
  } = useSortable({ id })

  const startPosRef = useRef<{ x: number; y: number } | null>(null)

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
    visibility: isDragging ? "hidden" : "visible",
  }

  const draggingClass = isOverlay
    ? "drag-overlay"
    : isDragging
    ? "dragging"
    : ""

  const handlePointerDown = (e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!onClick || !startPosRef.current) return

    const dx = Math.abs(e.clientX - startPosRef.current.x)
    const dy = Math.abs(e.clientY - startPosRef.current.y)

    // Trigger click only if pointer didn’t move much (less than 5px)
    if (dx < 5 && dy < 5) {
      onClick()
    }
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${draggingClass}`}
      onPointerDown={(e) => {
        listeners?.onPointerDown?.(e); // preserve drag
        handlePointerDown(e); // custom click logic
      }}
      onPointerUp={handlePointerUp}
    >

      {tag && <span className="task-tag">#{tag}</span>}
      <h4 className="task-title">{title}</h4>
      <div className="task-footer">
        {dueDate && <span className="task-date">⏰ {dueDate}</span>}
      </div>
    </div>
  )
}