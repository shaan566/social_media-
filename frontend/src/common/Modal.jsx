
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Modal = ({isOpen , setOpen , children}) => {

useEffect( () => {
    const handlekey  = (e) =>{
        if(e.key  === 'Escape') setOpen(null)
    }
if(isOpen) {
    document.addEventListener("keydown", handlekey)
}

return () => document.removeEventListener("keydown" ,handlekey)
} ,[isOpen, setOpen])
  return (
    <div
      onClick={() => setOpen(null)}
      className={`fixed inset-0 flex items-start justify-center pt-20 z-[1000] transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl p-4 w-[340px] shadow-[0_8px_40px_rgba(0,0,0,0.13)] transform transition-all duration-200 ${
          isOpen
            ? "translate-y-0 scale-100"
            : "-translate-y-2 scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
