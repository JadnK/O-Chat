import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import type { Message } from '../types/message'

export default function ChatRoomPage() {
    const { roomId } = useParams<{ roomId: string }>()
    const [searchParams] = useSearchParams()
    const user = searchParams.get('name') || 'Anonymous'
    const password = searchParams.get('pwd') || ''
    const { messages, sendMessage } = useChat(roomId || null)
    const [text, setText] = useState('')
    const endRef = useRef<HTMLDivElement>(null)

    const submit = () => {
        if (!text.trim()) return
        sendMessage({ text, user })
        setText('')
    }

    // auto scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
            <header className="bg-gray-100 p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold">Room: {roomId}</h2>
                {password && <span className="text-sm text-gray-500">🔒 Protected</span>}
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m: Message) => (
                    <div
                        key={m.id}
                        className={`flex ${m.user === user ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`px-4 py-2 rounded-lg max-w-xs break-words ${m.user === user ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                            }`}>
                            <div className="text-sm font-semibold">{m.user}</div>
                            <div>{m.text}</div>
                            <div className="text-xs text-gray-400 text-right">
                                {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <div className="border-t p-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submit() }}
                />
                <button
                    onClick={submit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>
        </div>
    )
}
