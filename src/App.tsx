import React from 'react'
import { Outlet, Link } from 'react-router-dom'


export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
                    <Link to="/" className="font-bold text-xl">o-chat</Link>
                    <nav>
                        <Link to="/create" className="px-3 py-1 rounded-md hover:bg-gray-100">Create Room</Link>
                    </nav>
                </div>
            </header>


            <main className="max-w-4xl mx-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}