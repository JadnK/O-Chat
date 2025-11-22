import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { io } from 'socket.io-client'
import { useUser } from '../context/UserContext'

const SERVER_URL = 'http://localhost:3000'

export default function CreateRoom() {
  const { name } = useUser()
  const [roomName, setRoomName] = useState('')
  const [type, setType] = useState<'public'|'private'>('public')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const socket = io(SERVER_URL)

  const createRoom = () => {
    if (!roomName.trim() || !name.trim()) {
      alert('Please enter both your name and room name!')
      return
    }
    
    if (type === 'private' && !password.trim()) {
      alert('Private rooms require a password!')
      return
    }
    
    const id = nanoid(6)
    socket.emit('createRoom', { id, name: roomName, type, password })
    navigate(`/room/${id}${type==='private'?`?pwd=${encodeURIComponent(password)}`:''}`)
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Create Room</h2>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Your Name</label>
        <input 
          type="text" 
          value={name} 
          readOnly
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Room Name</label>
        <input 
          type="text" 
          placeholder="Enter room name..." 
          value={roomName} 
          onChange={e => setRoomName(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Room Type</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              checked={type==='public'} 
              onChange={() => setType('public')}
              className="text-green-500"
            />
            <span>Public</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              checked={type==='private'} 
              onChange={() => setType('private')}
              className="text-red-500"
            />
            <span>Private</span>
          </label>
        </div>
      </div>
      
      {type==='private' && (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Enter password..."
          />
        </div>
      )}
      
      <button 
        onClick={createRoom} 
        className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-md transition-colors font-semibold"
      >
        Create Room
      </button>
    </div>
  )
}
