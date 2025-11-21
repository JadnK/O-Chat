import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const joinRoom = (roomId: string) => {
    if (!name.trim()) return
    navigate(`/room/${roomId}?name=${encodeURIComponent(name)}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold">Your Name</h2>
        <input type="text" value={name} onChange={e=>setName(e.target.value)}
          className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your name..." />
      </div>
    </div>
  )
}
