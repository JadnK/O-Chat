import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

export default function CreateRoom() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const createRoom = () => {
        if (!name.trim()) return
        const roomId = nanoid(6) // generates 6-char unique room ID
        // encode password in query for simplicity (optional: later hash)
        navigate(`/room/${roomId}?name=${encodeURIComponent(name)}&pwd=${encodeURIComponent(password)}`)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <h1 className="text-4xl font-bold mb-6">Create a New Room</h1>

            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Room Password (optional)"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    onClick={createRoom}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                    Create Room
                </button>
            </div>
        </div>
    )
}
