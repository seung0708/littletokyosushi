'use client'
import { useState } from "react"

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg">
          {["Settings", "Support", "Logout"].map((item) => (
            <button
              key={item}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
