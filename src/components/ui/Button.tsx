import React from 'react'

export default function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={(props.className || '') + ' px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500'}
        >
            {children}
        </button>
    )
}