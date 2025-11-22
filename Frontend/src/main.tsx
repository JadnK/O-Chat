import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import ChatRoomPage from './pages/ChatRoomPage'
import { UserProvider } from './context/UserContext'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="create" element={<CreateRoom />} />
            <Route path="room/:id" element={<ChatRoomPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
)