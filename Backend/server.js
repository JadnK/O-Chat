import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

// Räume speichern: roomId -> { name, type, password?, createdAt, createdBy }
const rooms = new Map()

// Nutzer pro Raum: roomId -> Map(socket.id -> { userName, joinedAt })
const roomUsers = new Map()

// Nachrichten pro Raum: roomId -> Array(messages)
const roomMessages = new Map()

// Hilfsfunktionen
const getRoom = (roomId) => rooms.get(roomId)
const getRoomUsers = (roomId) => roomUsers.get(roomId) || new Map()
const getRoomMessages = (roomId) => roomMessages.get(roomId) || []

// Aktive Räume an alle Clients senden
const broadcastActiveRooms = () => {
  const activeRooms = Array.from(rooms.entries()).map(([id, info]) => ({
    id,
    name: info.name,
    type: info.type,
    userCount: getRoomUsers(id).size
  }))
  io.emit('activeRooms', activeRooms)
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Aktive Räume sofort senden
  broadcastActiveRooms()

  // Room erstellen
  socket.on('createRoom', ({ id, name, type, password }) => {
    try {
      if (!id || !name || !type) {
        socket.emit('error', { message: 'Invalid room data' })
        return
      }

      if (rooms.has(id)) {
        socket.emit('error', { message: 'Room already exists' })
        return
      }

      if (type === 'private' && !password) {
        socket.emit('error', { message: 'Private rooms require a password' })
        return
      }

      const roomData = {
        name,
        type,
        password: type === 'private' ? password : undefined,
        createdAt: Date.now(),
        createdBy: socket.id
      }

      rooms.set(id, roomData)
      roomUsers.set(id, new Map())
      roomMessages.set(id, [])

      console.log(`Room created: ${id} (${name})`)
      broadcastActiveRooms()
      
      socket.emit('roomCreated', { success: true, roomId: id })
    } catch (error) {
      console.error('Error creating room:', error)
      socket.emit('error', { message: 'Failed to create room' })
    }
  })

  // Raum authentifizieren (für private Räume)
  socket.on('authenticateRoom', ({ roomId, password }, callback) => {
    try {
      const room = getRoom(roomId)
      
      if (!room) {
        callback({ success: false, error: 'Room not found' })
        return
      }

      if (room.type === 'private' && room.password !== password) {
        callback({ success: false, error: 'Invalid password' })
        return
      }

      callback({ success: true })
    } catch (error) {
      console.error('Authentication error:', error)
      callback({ success: false, error: 'Authentication failed' })
    }
  })

  // Raum beitreten
  socket.on('joinRoom', ({ roomId, userName }) => {
    try {
      const room = getRoom(roomId)
      if (!room) {
        socket.emit('error', { message: 'Room not found' })
        return
      }

      if (!userName || !userName.trim()) {
        socket.emit('error', { message: 'Username is required' })
        return
      }

      socket.join(roomId)
      
      const users = getRoomUsers(roomId)
      users.set(socket.id, {
        userName: userName.trim(),
        joinedAt: Date.now()
      })
      roomUsers.set(roomId, users)

      // Historische Nachrichten senden
      const messages = getRoomMessages(roomId)
      socket.emit('messageHistory', messages)

      // User count aktualisieren
      io.to(roomId).emit('userCount', users.size)
      
      // Willkommensnachricht
      const welcomeMessage = {
        id: String(Date.now()),
        user: 'System',
        text: `${userName.trim()} joined the room`,
        ts: Date.now(),
        type: 'system'
      }
      messages.push(welcomeMessage)
      roomMessages.set(roomId, messages)
      io.to(roomId).emit('message', welcomeMessage)

      console.log(`${userName.trim()} joined room ${roomId}`)
    } catch (error) {
      console.error('Error joining room:', error)
      socket.emit('error', { message: 'Failed to join room' })
    }
  })

  // Raum verlassen
  socket.on('leaveRoom', ({ roomId }) => {
    try {
      const users = getRoomUsers(roomId)
      const user = users.get(socket.id)
      
      if (user) {
        socket.leave(roomId)
        users.delete(socket.id)
        roomUsers.set(roomId, users)

        // User count aktualisieren
        io.to(roomId).emit('userCount', users.size)
        
        // Abschiedsnachricht
        const messages = getRoomMessages(roomId)
        const leaveMessage = {
          id: String(Date.now()),
          user: 'System',
          text: `${user.userName} left the room`,
          ts: Date.now(),
          type: 'system'
        }
        messages.push(leaveMessage)
        roomMessages.set(roomId, messages)
        io.to(roomId).emit('message', leaveMessage)

        console.log(`${user.userName} left room ${roomId}`)
      }

      // Raum löschen, wenn leer
      if (users.size === 0) {
        setTimeout(() => {
          if (getRoomUsers(roomId).size === 0) {
            rooms.delete(roomId)
            roomUsers.delete(roomId)
            roomMessages.delete(roomId)
            broadcastActiveRooms()
            console.log(`Room ${roomId} deleted (empty)`)
          }
        }, 60000) // 1 Minute warten, bevor der Raum gelöscht wird
      }
    } catch (error) {
      console.error('Error leaving room:', error)
    }
  })

  // Nachricht senden
  socket.on('message', ({ roomId, message }) => {
    try {
      if (!roomId || !getRoom(roomId)) {
        socket.emit('error', { message: 'Room not found' })
        return
      }

      if (!message || !message.text || !message.text.trim()) {
        socket.emit('error', { message: 'Message cannot be empty' })
        return
      }

      const users = getRoomUsers(roomId)
      const user = users.get(socket.id)
      
      if (!user) {
        socket.emit('error', { message: 'You must join the room first' })
        return
      }

      const messageData = {
        id: String(Date.now()),
        user: user.userName,
        text: message.text.trim(),
        ts: Date.now(),
        type: 'user'
      }

      const messages = getRoomMessages(roomId)
      messages.push(messageData)
      roomMessages.set(roomId, messages)

      io.to(roomId).emit('message', messageData)
      console.log(`Message in ${roomId}: ${user.userName}: ${message.text.trim()}`)
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // Disconnect
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        const users = getRoomUsers(roomId)
        const user = users.get(socket.id)
        
        if (user) {
          users.delete(socket.id)
          roomUsers.set(roomId, users)

          io.to(roomId).emit('userCount', users.size)
          
          const messages = getRoomMessages(roomId)
          const disconnectMessage = {
            id: String(Date.now()),
            user: 'System',
            text: `${user.userName} disconnected`,
            ts: Date.now(),
            type: 'system'
          }
          messages.push(disconnectMessage)
          roomMessages.set(roomId, messages)
          io.to(roomId).emit('message', disconnectMessage)

          console.log(`${user.userName} disconnected from room ${roomId}`)
        }
      }
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

httpServer.listen(3000, () => console.log('Server running on port 3000'))