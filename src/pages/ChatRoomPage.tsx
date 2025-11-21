import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import { useUser } from '../context/UserContext'
import { io } from 'socket.io-client'

const SERVER_URL = 'http://localhost:3000'

export default function ChatRoomPage() {
  const { roomId } = useParams<{roomId:string}>()
  const [searchParams] = useSearchParams()
  const { name } = useUser()
  const { messages, sendMessage, userCount, error, clearError, joinRoom } = useChat(roomId || null)
  const [text, setText] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (!roomId || !name.trim()) return

    const socket = io(SERVER_URL)
    socketRef.current = socket

    // Check if room requires authentication
    const password = searchParams.get('pwd')
    
    socket.emit('authenticateRoom', { roomId, password }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        setIsAuthenticated(true)
        joinRoom(name)
      } else {
        setAuthError(response.error || 'Authentication failed')
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId, name, searchParams, joinRoom])

  const submit = () => {
    if (!text.trim() || !isAuthenticated) return
    sendMessage({ text, user: name })
    setText('')
  }

  useEffect(() => { 
    endRef.current?.scrollIntoView({behavior:'smooth'}) 
  }, [messages])

  if (!name.trim()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Name Required</h2>
          <p className="text-gray-400">Please enter your name on the home page first.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 text-red-400">Access Denied</h2>
          <p className="text-gray-400 mb-4">{authError}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Joining Room...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-gray-800 p-4 rounded-xl shadow-md overflow-hidden">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-red-200">{error}</span>
            <button 
              onClick={clearError}
              className="text-red-400 hover:text-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
        <div>
          <h2 className="text-xl font-semibold">Room: {roomId}</h2>
          <p className="text-sm text-gray-400">Welcome, {name}</p>
        </div>
        <div className="text-right">
          <span className="text-gray-400">{userCount} online</span>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.user===name?'justify-end':'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                m.type === 'system' 
                  ? 'bg-yellow-900 text-yellow-200 text-sm italic' 
                  : m.user===name 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-100'
              }`}>
                {m.type !== 'system' && (
                  <div className="text-sm font-semibold">{m.user}</div>
                )}
                <div>{m.text}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(m.ts).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef}/>
      </div>
      
      <div className="flex space-x-2 border-t border-gray-700 pt-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={text} 
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {if(e.key==='Enter') submit()}}
          className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={!isAuthenticated}
        />
        <button 
          onClick={submit} 
          disabled={!text.trim() || !isAuthenticated}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}