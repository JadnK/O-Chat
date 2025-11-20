import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const [roomId, setRoomId] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()

    const joinRoom = () => {
        if (!roomId.trim() || !name.trim()) return
        navigate(`/room/${roomId}?name=${encodeURIComponent(name)}`)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <h1 className="text-4xl font-bold mb-6">Join a Chat Room</h1>

            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Room ID"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                />

                <button
                    onClick={joinRoom}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Join Room
                </button>
            </div>
        </div>
    )
}
