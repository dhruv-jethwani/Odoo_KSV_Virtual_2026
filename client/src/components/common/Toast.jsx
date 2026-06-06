import { useEffect } from 'react'

export default function Toast({ message, type, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message, onClose])

    if (!message) return null

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 z-50 ${bgColor}`}>
            {message}
        </div>
    )
}