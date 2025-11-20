import { useState } from 'react'

export function useRoom() {
    const [rooms, setRooms] = useState<Record<string, { password?: string }>>({})


    function createRoom(id: string, password?: string) {
        setRooms(prev => ({ ...prev, [id]: { password } }))
    }


    function verifyRoom(id: string, password?: string) {
        const r = rooms[id]
        if (!r) return { exists: false }
        if (r.password && r.password !== password) return { exists: true, ok: false }
        return { exists: true, ok: true }
    }


    return { rooms, createRoom, verifyRoom }
}