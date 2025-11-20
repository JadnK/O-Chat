// A small wrapper to create a socket.io-client instance when you have a server.
// If you don't have a server yet, useMockSocket() below for local dev.

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function createSocket(
    serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
) {
    if (!socket) {
        socket = io(serverUrl, {
            autoConnect: false
        })
    }
    return socket
}


// --- Mock socket for frontend-only development ---


type MockHandler = (ev: any) => void

export function createMockSocket() {
    const bus = new EventTarget()
    let connected = false

    return {
        on: (ev: string, fn: MockHandler) =>
            bus.addEventListener(ev, (e: any) => fn(e.detail)),

        off: (ev: string, fn: MockHandler) =>
            bus.removeEventListener(ev, fn as EventListener),

        emit: (ev: string, payload?: any) =>
            bus.dispatchEvent(new CustomEvent(ev, { detail: payload })),

        /** Simulates socket.io connect() */
        connect: () => {
            if (!connected) {
                connected = true
                // trigger "connect" listeners
                bus.dispatchEvent(new CustomEvent('connect'))
            }
        },

        /** Simulates socket.io disconnect() */
        disconnect: () => {
            if (connected) {
                connected = false
                // trigger "disconnect" listeners
                bus.dispatchEvent(new CustomEvent('disconnect'))
            }
        }
    } as const
}
