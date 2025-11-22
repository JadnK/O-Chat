import React, { useState } from 'react'

export default function MessageInput({ onSend }: { onSend: (text: string) => void }) {
    const [text, setText] = useState('')


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!text.trim()) return
        onSend(text.trim())
        setText('')
    }


    return (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <input
                className="flex-1 px-3 py-2 border rounded focus:outline-none"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
            />
            <button className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
        </form>
    )
}