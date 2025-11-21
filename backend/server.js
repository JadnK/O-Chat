import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

// Räume speichern: roomId -> { name, type, password? }
const rooms = {}

// Nutzer pro Raum: roomId -> Set(socket.id)
const roomUsers = {}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Alle aktiven Räume sofort senden
  socket.emit('activeRooms', Object.entries(rooms).map(([id, info]) => ({ id, ...info })))

  // Room erstellen
  socket.on('createRoom', ({ id, name, type, password }) => {
    rooms[id] = { name, type, password }
    io.emit('activeRooms', Object.entries(rooms).map(([id, info]) => ({ id, ...info })))
  })

  // Raum beitreten
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId)
    if (!roomUsers[roomId]) roomUsers[roomId] = new Set()
    roomUsers[roomId].add(socket.id)
    io.to(roomId).emit('userCount', roomUsers[roomId].size)
  })

  // Raum verlassen
  socket.on('leaveRoom', ({ roomId }) => {
    socket.leave(roomId)
    roomUsers[roomId]?.delete(socket.id)
    io.to(roomId).emit('userCount', roomUsers[roomId]?.size || 0)
  })

  // Nachricht senden
  socket.on('message', ({ roomId, message }) => {
    if (!roomId || !rooms[roomId]) return
    io.to(roomId).emit('message', message)
  })

  // Disconnect
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomUsers[roomId]) {
        roomUsers[roomId].delete(socket.id)
        io.to(roomId).emit('userCount', roomUsers[roomId].size)
      }
    }
  })
})

httpServer.listen(3000, () => console.log('Server running on 3000'))
