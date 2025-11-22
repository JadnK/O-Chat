import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SERVER_URL = 'http://localhost:3000'

export function useActiveRooms() {
  const [rooms, setRooms] = useState<{id:string,name:string,type:string}[]>([])

  useEffect(() => {
    const socket = io(SERVER_URL)
    socket.on('activeRooms', setRooms)

    return () => { socket.disconnect() }
  }, [])

  return rooms
}
