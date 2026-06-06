import { useState } from 'react'

export default function Activity() {
    const [filter, setFilter] = useState('All')

    // Mock data for activity logs and notifications
    const [logs] = useState([
        { 
            id: 'LOG-001', 
            type: 'invoice', 
            title: 'Invoice Auto-Generated', 
            message: 'Invoice INV-8832 was automatically generated for PO-2029.', 
            user: 'System', 
            timestamp: 'Just now',
            icon: '📄'
        },
        { 
            id: 'LOG-002', 
            type: 'approval', 
            title: 'Quotation Approved', 
            message: 'Manager approved Quotation QT-5012 from Vendor Infra Sapphire. PO generation initiated.', 
            user: 'Alex Manager', 
            timestamp: '2 hours ago',
            icon: '✅'
        },
        { 
            id: 'LOG-003', 
            type: 'rfq', 
            title: 'New Quotation Received', 
            message: 'Tech Supplies Co. submitted a new quotation (QT-5013) for RFQ-1043.', 
            user: 'Vendor Portal', 
            timestamp: '5 hours ago',
            icon: '📥'
        },
        { 
            id: 'LOG-004', 
            type: 'rfq', 
            title: 'RFQ Published', 
            message: 'RFQ-1044 "IT Servers" was published and invitations sent to 4 vendors.', 
            user: 'Procurement Officer', 
            timestamp: 'Yesterday at 14:30',
            icon: '📢'
        },
        { 
            id: 'LOG-005', 
            type: 'system', 
            title: 'Vendor Account Blocked', 
            message: 'Vendor "Global Logistics" was temporarily blocked due to expired compliance documents.', 
            user: 'Admin', 
            timestamp: 'Yesterday at 09:15',
            icon: '⚠️'
        }
    ])

    const filteredLogs = filter === 'All' 
        ? logs 
        : logs.filter(log => log.type === filter.toLowerCase())

    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Activity & Logs</h1>
                    <p>Track all procurement events, approvals, and system notifications.</p>
                </div>
                <button className="btn-secondary">⬇️ Export Audit Log</button>
            </header>

            <section className="form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                
                {/* Filter Controls */}
                <div className="vendors-toolbar" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '32px' }}>
                    <div className="filter-group">
                        {['All', 'RFQ', 'Approval', 'Invoice', 'System'].map(f => (
                            <button 
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vertical Activity Timeline */}
                <div className="timeline-container">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                            <div className="timeline-item" key={log.id}>
                                <div className={`timeline-icon bg-${log.type}`}>
                                    {log.icon}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-header">
                                        <h4>{log.title}</h4>
                                        <span className="timeline-time">{log.timestamp}</span>
                                    </div>
                                    <p className="timeline-message">{log.message}</p>
                                    <div className="timeline-meta">
                                        <span className="timeline-user">User: <strong>{log.user}</strong></span>
                                        <span className="timeline-id text-muted">Ref: {log.id}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No activities found for this filter.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}