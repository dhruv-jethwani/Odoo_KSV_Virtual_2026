import { useState, useEffect } from 'react'
import axios from 'axios'
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
    const [activeTab, setActiveTab] = useState('Dashboard')
    
    // Dynamic Data States
    const [currentUser, setCurrentUser] = useState(null)
    const [dashboardStats, setDashboardStats] = useState(null)
    const [recentPOs, setRecentPOs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Verify Auth & Fetch Data on Mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.hash = '#login'
            return
        }

        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Current Logged-in User
                const userRes = await axios.get('http://127.0.0.1:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setCurrentUser(userRes.data)

                // 2. Fetch High-Level Reports/Stats
                const statsRes = await axios.get('http://127.0.0.1:5000/api/report/')
                setDashboardStats(statsRes.data)

                // 3. Fetch Recent Purchase Orders (Take top 4)
                const poRes = await axios.get('http://127.0.0.1:5000/api/po/')
                setRecentPOs(poRes.data.slice(0, 4))

            } catch (error) {
                console.error("Dashboard Fetch Error:", error)
                if (error.response?.status === 401) {
                    localStorage.removeItem('token')
                    window.location.hash = '#login'
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.hash = '#login'
    }

    const navItems = [
        'Dashboard', 'Vendors', 'RFQs', 'Quotations', 
        'Approvals', 'Purchase orders', 'Invoices', 'Reports', 'Activity'
    ]

    // ==========================================
    // DASHBOARD OVERVIEW RENDERER
    // ==========================================
    const renderDashboardOverview = () => {
        if (isLoading) return <div className="empty-state">Loading dashboard data...</div>

        return (
            <div className="animate-fade-in">
                {/* Header with Top Right Profile */}
                <header className="dashboard-header flex-between align-center">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back, {currentUser?.firstName || currentUser?.username}. Here is your Today's Overview.</p>
                    </div>

                </header>
                {/* Top Dynamic Stats Grid */}
                <section className="stats-grid">
                    {dashboardStats?.stats?.map((stat, index) => (
                        <div className="stat-card animate-slide-up" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                            <h3 className={`text-${stat.color || 'blue'}`}>{stat.value}</h3>
                            <p className="stat-label">{stat.label}</p>
                            <small className="stat-subtext">{stat.subtext}</small>
                        </div>
                    ))}
                </section>

                {/* Main Content Split: Recent POs + Quick Actions & Trends Chart */}
                <div className="dashboard-content split-layout animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    
                    {/* Left Column */}
                    <div className="left-panel">
                        <div className="table-container">
                            <div className="section-header">
                                <h2>Recent Purchase Orders</h2>
                                <button className="view-all-btn" onClick={() => setActiveTab('Purchase orders')}>View All</button>
                            </div>
                            <div className="table-wrapper">
                                <table className="compact-table">
                                    <thead>
                                        <tr>
                                            <th>PO#</th>
                                            <th>Vendor</th>
                                            <th className="text-right">Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPOs.length > 0 ? recentPOs.map((po, idx) => (
                                            <tr key={idx}>
                                                <td><strong>{po.id}</strong></td>
                                                <td>{po.vendor}</td>
                                                <td className="text-right"><strong>{po.amount}</strong></td>
                                                <td>
                                                    <span className={`status-badge status-${po.status.toLowerCase()}`}>
                                                        {po.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="empty-state" style={{padding: '20px'}}>No recent purchase orders.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Action Buttons (Wireframe Match) */}
                        <div className="quick-actions-row">
                            <button className="btn-outline" onClick={() => setActiveTab('RFQs')}>+ new RFQ</button>
                            <button className="btn-outline" onClick={() => setActiveTab('Vendors')}>Add Vendor</button>
                            <button className="btn-outline" onClick={() => setActiveTab('Invoices')}>View Invoices</button>
                        </div>
                    </div>

                    {/* Right Column (Trends Graphic) */}
                    <div className="right-panel">
                        <div className="analytics-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ marginBottom: '20px' }}>Spending Trends last 6 months</h2>
                            
                            {/* Graphic representing the wireframe chart elements */}
                            <div className="trends-graphic">
                                <div className="mini-pie-container">
                                    <div className="mock-pie-chart"></div>
                                    <ul className="pie-legend">
                                        <li><span className="dot bg-blue"></span> Furniture</li>
                                        <li><span className="dot bg-green"></span> IT Infra</li>
                                        <li><span className="dot bg-yellow"></span> Stationery</li>
                                    </ul>
                                </div>
                                
                                <div className="bar-chart full-width-chart mt-4" style={{ height: '120px', borderBottom: '1px solid #cbd5e1' }}>
                                    {dashboardStats?.monthlyTrend?.map((data, idx) => (
                                        <div className="bar-group" key={idx}>
                                            <div className="bar" style={{ height: data.height }}></div>
                                            <span className="bar-label" style={{ fontSize: '0.7rem' }}>{data.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <div className="mobile-header flex-between w-100">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <span className="logo-text">VendorBridge</span>
                </div>
                {/* Mobile User Avatar */}
                <div className="user-avatar mobile-avatar">
                    {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
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
                                        setIsSidebarOpen(false) 
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
            </main>
        </div>
    )
}