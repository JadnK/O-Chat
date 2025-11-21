import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { io } from 'socket.io-client'

const SERVER_URL = 'http://localhost:3000'

export default function CreateRoom() {
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [type, setType] = useState<'public'|'private'>('public')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const socket = io(SERVER_URL)

  const createRoom = () => {
    if (!roomName.trim() || !name.trim()) return
    const id = nanoid(6)
    socket.emit('createRoom', { id, name: roomName, type, password })
    navigate(`/room/${id}?name=${encodeURIComponent(name)}${type==='private'?`&pwd=${password}`:''}`)
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Create Room</h2>
      <input type="text" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)}
        className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"/>
      <input type="text" placeholder="Room Name" value={roomName} onChange={e=>setRoomName(e.target.value)}
        className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"/>
      <div className="flex space-x-4">
        <label><input type="radio" checked={type==='public'} onChange={()=>setType('public')}/> Public</label>
        <label><input type="radio" checked={type==='private'} onChange={()=>setType('private')}/> Private</label>
      </div>
      {type==='private' && <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
        className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        placeholder="Password"/>}
      <button onClick={createRoom} className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-md">Create</button>
    </div>
  )
}
