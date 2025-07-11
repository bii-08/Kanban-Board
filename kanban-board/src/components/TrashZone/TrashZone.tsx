import React, { useRef, useState } from 'react'
import './styles.css'
import { useDroppable } from '@dnd-kit/core'

export function TrashZone() {
  const { setNodeRef: setTrashRef, isOver: isOverTrash} = useDroppable({ id: 'trash'})
  return (
    <div 
    ref={setTrashRef}
    className={`trash-zone ${isOverTrash ? 'trash-hovered' : ''}`}>
      🗑 Drop here to delete
    </div>
  )
}