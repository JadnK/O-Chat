import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useChat } from '../hooks/useChat'

export default function ChatRoomPage() {
  const { roomId } = useParams<{roomId:string}>()
  const [searchParams] = useSearchParams()
  const user = searchParams.get('name') || 'Anonymous'
  const { messages, sendMessage, userCount } = useChat(roomId || null)
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const submit = () => {
    if (!text.trim()) return
    sendMessage({ text, user })
    setText('')
  }

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-gray-800 p-4 rounded-xl shadow-md overflow-hidden">
      <header className="flex justify-between border-b border-gray-700 pb-2 mb-2">
        <h2 className="text-xl font-semibold">{roomId}</h2>
        <span className="text-gray-400">{userCount} online</span>
      </header>
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map(m=>(
          <div key={m.id} className={`flex ${m.user===user?'justify-end':'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs break-words ${m.user===user?'bg-blue-500 text-white':'bg-gray-700 text-gray-100'}`}>
              <div className="text-sm font-semibold">{m.user}</div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div className="flex space-x-2 border-t border-gray-700 pt-2">
        <input type="text" placeholder="Type a message..." value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter') submit()}}
          className="flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <button onClick={submit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Send</button>
      </div>
    </div>
  )
}
