import { useState, useEffect } from 'react'
import '../../App.css'

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Redirect to login if no token is found
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const navItems = [
        { name: 'Dashboard', active: true },
        { name: 'Vendors', active: false },
        { name: 'RFQs', active: false },
        { name: 'Quotations', active: false },
        { name: 'Approvals', active: false },
        { name: 'Purchase orders', active: false },
        { name: 'Invoices', active: false },
        { name: 'Reports', active: false },
        { name: 'Activity', active: false },
    ]

    const stats = [
        { label: 'Active Vendors', value: '92', subtext: 'Updated just now' },
        { label: 'Pending Approvals', value: '5', subtext: 'Requires attention' },
        { label: 'Monthly spend', value: '$ 2.3L', subtext: '+12% from last month' },
        { label: 'Completed', value: '3', subtext: 'Purchase orders today' }
    ]

    const recentPOs = [
        { id: 'PO-2029', vendor: 'Office Furniture G2', date: '10 May 2026', amount: '$12,400', status: 'Approved' },
        { id: 'PO-2030', vendor: 'Tech Supplies Co.', date: '11 May 2026', amount: '$4,500', status: 'Pending' },
        { id: 'PO-2031', vendor: 'Stationery Hub', date: '12 May 2026', amount: '$850', status: 'Completed' },
    ]

    return (
        <div className="dashboard-layout">
            {/* Mobile Header & Hamburger */}
            <div className="mobile-header">
                <span className="logo-text">VendorBridge</span>
                <button className="hamburger" onClick={toggleSidebar}>
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
                            <li key={index} className={item.active ? 'active' : ''}>
                                <a href={`#${item.name.toLowerCase().replace(' ', '-')}`}>
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            {/* Main Content Area */}
            <main className="dashboard-main">
                <header className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back, Procurement Officer. Here is your Today's Overview.</p>
                    </div>
                </header>

                {/* Statistics Cards */}
                <section className="stats-grid">
                    {stats.map((stat, index) => (
                        <div 
                            className="stat-card animate-slide-up" 
                            key={index} 
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <h3>{stat.value}</h3>
                            <p className="stat-label">{stat.label}</p>
                            <small className="stat-subtext">{stat.subtext}</small>
                        </div>
                    ))}
                </section>

                {/* Main Data Section */}
                <section className="dashboard-content animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="table-container">
                        <div className="section-header">
                            <h2>Recent Purchase Orders</h2>
                            <button className="view-all-btn">View All</button>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>PO Number</th>
                                        <th>Vendor</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPOs.map((po, index) => (
                                        <tr key={index}>
                                            <td><strong>{po.id}</strong></td>
                                            <td>{po.vendor}</td>
                                            <td>{po.date}</td>
                                            <td>{po.amount}</td>
                                            <td>
                                                <span className={`status-badge status-${po.status.toLowerCase()}`}>
                                                    {po.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="analytics-container">
                        <h2>Procurement Analytics</h2>
                        <div className="chart-placeholder">
                            {/* Simple CSS-based mock chart for the wireframe look */}
                            <div className="bar-chart">
                                <div className="bar" style={{ height: '40%' }}></div>
                                <div className="bar" style={{ height: '70%' }}></div>
                                <div className="bar" style={{ height: '50%' }}></div>
                                <div className="bar" style={{ height: '90%' }}></div>
                                <div className="bar" style={{ height: '60%' }}></div>
                            </div>
                            <p className="chart-label">Monthly Spend Trend</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}