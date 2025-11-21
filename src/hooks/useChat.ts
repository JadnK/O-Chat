import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { Message } from '../types/message'

const SERVER_URL = 'http://localhost:3000'

export function useChat(roomId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [userCount, setUserCount] = useState(0)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (!roomId) return
    const socket = io(SERVER_URL)
    socketRef.current = socket

    socket.emit('joinRoom', { roomId })
    socket.on('message', (m: Message) => setMessages(prev => [...prev, m]))
    socket.on('userCount', setUserCount)

    return () => {
      socket.emit('leaveRoom', { roomId })
      socket.disconnect()
    }
  }, [roomId])

  const sendMessage = (payload: { text: string; user: string }) => {
    if (!roomId) return
    const m: Message = { id: String(Date.now()), user: payload.user, text: payload.text, ts: Date.now() }
    socketRef.current?.emit('message', { roomId, message: m })
    setMessages(prev => [...prev, m])
  }

  return { messages, sendMessage, userCount }
}
