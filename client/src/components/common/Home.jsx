import { useState, useEffect } from 'react'
import Vendors from './Vendors'
import Rfqs from './Rfqs'
import Quotations from './Quotations'
import Approvals from './Approvals'
import PurchaseOrders from './PurchaseOrders'
import Invoices from './Invoices'
import Activity from './Activity'
import Reports from './Reports'
import '../../App.css'

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Dashboard') // Manage active tab

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.hash = '#login'
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.hash = '#login'
    }

    const navItems = [
        'Dashboard', 'Vendors', 'RFQs', 'Quotations', 
        'Approvals', 'Purchase orders', 'Invoices', 'Reports', 'Activity'
    ]

    // Content for the Dashboard overview
    const renderDashboardOverview = () => (
        <div className="animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Procurement Officer. Here is your Today's Overview.</p>
                </div>
            </header>
            
            <section className="stats-grid">
                <div className="stat-card animate-slide-up">
                    <h3>92</h3><p className="stat-label">Active Vendors</p><small className="stat-subtext">Updated just now</small>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3>5</h3><p className="stat-label">Pending Approvals</p><small className="stat-subtext">Requires attention</small>
                </div>
                <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3>$ 2.3L</h3><p className="stat-label">Monthly spend</p><small className="stat-subtext">+12% from last month</small>
                </div>
            </section>
        </div>
    )

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <span className="logo-text">VendorBridge</span>
                <button className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <h2>VendorBridge</h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index} className={activeTab === item ? 'active' : ''}>
                                <a 
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setActiveTab(item)
                                        setIsSidebarOpen(false) // Close mobile sidebar on click
                                    }}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </aside>

            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Dynamic Main Content Area */}
            <main className="dashboard-main">
                {activeTab === 'Dashboard' && renderDashboardOverview()}
                {activeTab === 'Vendors' && <Vendors />}
                {activeTab === 'RFQs' && <Rfqs />}
                {activeTab === 'Quotations' && <Quotations />}
                {activeTab === 'Approvals' && <Approvals />}
                {activeTab === 'Purchase orders' && <PurchaseOrders />}
                {activeTab === 'Invoices' && <Invoices />}
                {activeTab === 'Activity' && <Activity />}
                {activeTab === 'Reports' && <Reports />}
                {/* Add other components here as you build them... */}

                {![
                    'Dashboard', 'Vendors', 'RFQs', 'Quotations', 
                    'Approvals', 'Purchase orders', 'Invoices', 'Activity', 'Reports'
                ].includes(activeTab) && (
                    <div className="animate-fade-in dashboard-header">
                        <h1>{activeTab}</h1>
                        <p>This module is currently under development.</p>
                    </div>
                )}
            </main>
        </div>
    )
}