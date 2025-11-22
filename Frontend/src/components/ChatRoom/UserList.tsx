import React from 'react'

export default function UserList({ users }: { users: string[] }) {
    return (
        <ul className="space-y-1">
            {users.map(u => (
                <li key={u} className="text-sm">{u}</li>
            ))}
        </ul>
    )
}