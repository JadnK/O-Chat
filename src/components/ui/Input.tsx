import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={(props.className || '') + ' px-3 py-2 border rounded w-full focus:outline-none focus:ring'}
        />
    )
}