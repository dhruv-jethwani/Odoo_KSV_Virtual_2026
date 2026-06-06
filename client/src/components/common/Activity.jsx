import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Activity() {
    const [activities, setActivities] = useState([])
    const [filter, setFilter] = useState('All')
    const [isLoading, setIsLoading] = useState(true)

    const fetchActivities = async () => {
        try {
            // First, optionally seed the DB if it's empty so you have immediate demo data
            await axios.post('http://127.0.0.1:5000/api/activity/seed').catch(() => {});
            
            // Fetch live data
            const response = await axios.get('http://127.0.0.1:5000/api/activity/')
            setActivities(response.data)
        } catch (error) {
            console.error("Error fetching activities:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities()
    }, [])

    const filteredActivities = activities.filter(log => 
        filter === 'All' ? true : log.type.toLowerCase() === filter.toLowerCase()
    )

    // Helper function to pick an icon based on the log type
    const getLogIcon = (type) => {
        switch(type.toLowerCase()) {
            case 'alert': return '🔔';
            case 'status': return '✅';
            case 'system': return '⚙️';
            default: return '📝'; // Audit / General
        }
    }

    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Activity Logs & Notifications</h1>
                    <p>Track system events, audit trails, and procurement updates.</p>
                </div>
                <div className="action-group">
                    <button className="btn-secondary" onClick={fetchActivities}>🔄 Refresh</button>
                    <button className="btn-secondary" onClick={() => window.print()}>📄 Export Log</button>
                </div>
            </header>

            {/* Changed from dashboard-content to form-container to remove the 2-column grid squishing */}
            <section className="form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                
                {/* Filter Toolbar */}
                <div className="vendors-toolbar" style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
                    <div className="filter-group">
                        {['All', 'Audit', 'Alert', 'Status', 'System'].map(f => (
                            <button 
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="empty-state">Loading activity timeline...</div>
                ) : (
                    <div className="activity-timeline-container" style={{ width: '100%', maxWidth: '900px' }}>
                        {filteredActivities.length === 0 ? (
                            <div className="empty-state">No activities found for this filter.</div>
                        ) : (
                            <div className="timeline" style={{ position: 'relative', borderLeft: '2px solid #e2e8f0', marginLeft: '16px', paddingLeft: '32px' }}>
                                {filteredActivities.map((log, idx) => (
                                    <div key={log.id} className="timeline-item animate-slide-up" style={{ position: 'relative', marginBottom: '28px', animationDelay: `${idx * 0.05}s` }}>
                                        
                                        {/* Timeline Dot/Icon */}
                                        <div className="timeline-icon" style={{
                                            position: 'absolute',
                                            left: '-50px',
                                            top: '0',
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            background: '#ffffff',
                                            border: '2px solid #cbd5e1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            zIndex: 1,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            {getLogIcon(log.type)}
                                        </div>

                                        {/* Content Card */}
                                        <div className="timeline-content" style={{ 
                                            background: '#f8fafc', 
                                            padding: '20px', 
                                            borderRadius: '12px', 
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>{log.action}</h3>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '16px', fontWeight: '500' }}>{log.time}</span>
                                            </div>
                                            <p style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                {log.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', color: '#64748b', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                                                    👤 User: <span style={{ color: '#0f172a' }}>{log.user}</span>
                                                </span>
                                                <span style={{ fontSize: '0.8rem', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', color: '#64748b', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                                                    🏷️ Type: <span style={{ color: '#0f172a' }}>{log.type}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    )
}