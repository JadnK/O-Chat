import { useEffect, useRef, useState } from 'react'
import type { Message } from '../types/message'
import { createSocket, createMockSocket } from '../lib/socket'
import type { Socket } from "socket.io-client";

const USE_MOCK = true

export function useChat(roomId: string | null) {
    const [messages, setMessages] = useState<Message[]>([])
    const socketRef = useRef<any>(null)


    useEffect(() => {
        if (!roomId) return


        const s = USE_MOCK ? createMockSocket() : createSocket()
        socketRef.current = s


        const onMessage = (m: Message) => setMessages(prev => [...prev, m])


        s.on('connect', () => {
            // when using socket.io, join the room
            if (!USE_MOCK) s.emit('joinRoom', { roomId })
        })


        s.on('message', onMessage)


        if (!USE_MOCK) s.connect()


        return () => {
            if (!USE_MOCK) s.emit('leaveRoom', { roomId })
            s.off('message', onMessage)
            if (!USE_MOCK) s.disconnect()
        }
    }, [roomId])


    function sendMessage(payload: { text: string; user: string }) {
        const m: Message = {
            id: String(Date.now()),
            user: payload.user,
            text: payload.text,
            ts: Date.now()
        }


        // Emit to server / mock
        socketRef.current?.emit('message', { roomId, message: m })


        // Optimistic update
        setMessages(prev => [...prev, m])
    }


    return { messages, sendMessage }
}