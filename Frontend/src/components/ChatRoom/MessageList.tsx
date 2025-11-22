import React from 'react'
import type { Message } from '../../types/message'

export default function MessageList({ messages }: { messages: Message[] }) {
    return (
        <div className="flex-1 overflow-auto space-y-2 mb-2">
            {messages.length === 0 && <div className="text-sm text-gray-400">No messages yet</div>}
            {messages.map(m => (
                <div key={m.id} className="p-2 rounded bg-gray-100">
                    <div className="text-sm font-semibold">{m.user}</div>
                    <div className="text-sm">{m.text}</div>
                    <div className="text-xs text-gray-400">{new Date(m.ts).toLocaleTimeString()}</div>
                </div>
            ))}
        </div>
    )
}