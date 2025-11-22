import React from 'react'
import { Link } from 'react-router-dom'

export default function RoomCard({ id, hasPassword }: { id: string; hasPassword?: boolean }) {
    return (
        <div className="p-4 bg-white rounded shadow-sm flex items-center justify-between">
            <div>
                <div className="font-medium">Room {id}</div>
                {hasPassword ? <div className="text-sm text-gray-500">Password protected</div> : <div className="text-sm text-gray-500">Open</div>}
            </div>
            <Link to={`/room/${id}`} className="text-sm text-blue-600 hover:underline">Join</Link>
        </div>
    )
}