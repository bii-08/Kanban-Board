import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import type {PopupProps} from '../../types/type.ts'

export function Popup({isOpen, onClose, children}: PopupProps) {
  
  if (!isOpen) return null
  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-button" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>,
    document.body
  );
}

