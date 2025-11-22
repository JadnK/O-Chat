import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useActiveRooms } from '../hooks/useActiveRooms'

export default function Home() {
  const { name, setName } = useUser()
  const [joinPassword, setJoinPassword] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const navigate = useNavigate()
  const rooms = useActiveRooms()

  const joinRoom = (roomId: string) => {
    if (!name.trim()) {
      alert('Please enter your name first!')
      return
    }
    
    const room = rooms.find(r => r.id === roomId)
    if (!room) return

    if (room.type === 'private') {
      setSelectedRoom(roomId)
    } else {
      navigate(`/room/${roomId}`)
    }
  }

  const joinPrivateRoom = () => {
    if (!selectedRoom || !joinPassword.trim()) return
    
    const room = rooms.find(r => r.id === selectedRoom)
    if (!room || room.type !== 'private') return

    // Here we would normally validate the password with the server
    // For now, we'll just proceed (backend will handle validation)
    navigate(`/room/${selectedRoom}?pwd=${encodeURIComponent(joinPassword)}`)
    setSelectedRoom(null)
    setJoinPassword('')
  }

  const publicRooms = rooms.filter(room => room.type === 'public')
  const privateRooms = rooms.filter(room => room.type === 'private')

  return (
    <div className="space-y-6">
      {/* Name Input Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold">Your Name</h2>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your name..." 
        />
        <p className="text-sm text-gray-400">Your name will be saved automatically</p>
      </div>

      {/* Available Rooms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Public Rooms */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-xl font-bold text-green-400">Public Rooms</h3>
          {publicRooms.length === 0 ? (
            <p className="text-gray-400">No public rooms available</p>
          ) : (
            <div className="space-y-2">
              {publicRooms.map(room => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-semibold">{room.name}</div>
                    <div className="text-sm text-gray-400">ID: {room.id}</div>
                  </div>
                  <button 
                    onClick={() => joinRoom(room.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Private Rooms */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-xl font-bold text-red-400">Private Rooms</h3>
          {privateRooms.length === 0 ? (
            <p className="text-gray-400">No private rooms available</p>
          ) : (
            <div className="space-y-2">
              {privateRooms.map(room => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-semibold">{room.name} 🔒</div>
                    <div className="text-sm text-gray-400">ID: {room.id}</div>
                  </div>
                  <button 
                    onClick={() => joinRoom(room.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Password Modal for Private Rooms */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4 w-96">
            <h3 className="text-xl font-bold">Enter Password</h3>
            <input 
              type="password" 
              value={joinPassword}
              onChange={e => setJoinPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter room password..."
            />
            <div className="flex space-x-2">
              <button 
                onClick={joinPrivateRoom}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Join Room
              </button>
              <button 
                onClick={() => {
                  setSelectedRoom(null)
                  setJoinPassword('')
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}