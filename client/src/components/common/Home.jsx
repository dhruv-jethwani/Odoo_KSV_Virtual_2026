import { useEffect } from 'react'
import '../../App.css'

export default function Home() {
    useEffect(() => {
        const token = localStorage.getItem('token')
        // Basic check to see if token exists; if not, kick them back to login
        if (!token) {
            window.location.hash = '#login'
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.hash = '#login'
    }

    return (
        <main className="landing-shell">
            <section className="landing-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="landing-copy">
                    <h1>Welcome to your Dashboard</h1>
                    <p style={{ margin: '0 auto' }}>
                        You have successfully logged in and your JWT is stored in local storage.
                    </p>
                </div>
                
                <button 
                    className="landing-button landing-button-secondary" 
                    onClick={handleLogout}
                    style={{ marginTop: '32px' }}
                >
                    Logout
                </button>
            </section>
        </main>
    )
}