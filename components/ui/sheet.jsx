import * as React from "react"
import { X } from "lucide-react"

const Sheet = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed right-0 top-0 w-3/4 h-full bg-white shadow-lg p-6 overflow-y-auto">
        <button 
          className="absolute top-4 right-4"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  )
}

const SheetTrigger = ({ children, onClick }) => (
  <div onClick={onClick}>{children}</div>
)

const SheetContent = ({ children }) => children

export { Sheet, SheetTrigger, SheetContent }