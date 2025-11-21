import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import type { Message } from '../types/message'

const SERVER_URL = 'http://localhost:3000'

export function useChat(roomId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [userCount, setUserCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (!roomId) return

    const socket = io(SERVER_URL)
    socketRef.current = socket

    // Error handling
    socket.on('error', (errorData: { message: string }) => {
      setError(errorData.message)
      console.error('Socket error:', errorData.message)
    })

    // Message history (when joining a room)
    socket.on('messageHistory', (history: Message[]) => {
      setMessages(history)
    })

    // New messages
    socket.on('message', (m: Message) => {
      setMessages(prev => [...prev, m])
    })

    // User count updates
    socket.on('userCount', setUserCount)

    // Clear errors when connecting
    setError(null)

    return () => {
      socket.disconnect()
    }
  }, [roomId])

  const sendMessage = (payload: { text: string; user: string }) => {
    if (!roomId || !socketRef.current) return

    const m: Message = { 
      id: String(Date.now()), 
      user: payload.user, 
      text: payload.text, 
      ts: Date.now(),
      type: 'user'
    }
    
    socketRef.current.emit('message', { roomId, message: m })
  }

  const joinRoom = (userName: string) => {
    if (!roomId || !socketRef.current) return
    socketRef.current.emit('joinRoom', { roomId, userName })
  }

  const clearError = () => setError(null)

  return { 
    messages, 
    sendMessage, 
    userCount, 
    error, 
    clearError,
    joinRoom 
  }
}