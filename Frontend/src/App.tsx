import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useActiveRooms } from './hooks/useActiveRooms.ts'
import { UserProvider } from './context/UserContext.tsx'

function AppContent() {
  const rooms = useActiveRooms()

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col">
        <div className="p-4 font-bold text-2xl border-b border-gray-700">o-chat</div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-700">Home</Link>
          <Link to="/create" className="block px-3 py-2 rounded-md hover:bg-gray-700">Create Room</Link>
          <hr className="border-gray-700 my-2"/>
          <div className="text-gray-400 px-3 text-sm">Active Rooms</div>
          {rooms.map(room => (
            <Link key={room.id} to={`/room/${room.id}`} className="block px-3 py-1 rounded-md hover:bg-gray-700">
              {room.name} {room.type==='private'?'🔒':''}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}