import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Rfqs() {
    const [view, setView] = useState('list') // Toggle between 'list' and 'create'
    const [searchTerm, setSearchTerm] = useState('')
    const [rfqs, setRfqs] = useState([]) // Start empty, will fetch from DB
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State for New RFQ
    const [newRfq, setNewRfq] = useState({
        title: '',
        category: '',
        deadline: '',
        description: '',
        itemName: '',
        quantity: ''
    })

    // Fetch live RFQs from backend
    const fetchRfqs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/rfq/')
            setRfqs(response.data)
        } catch (error) {
            console.error("Error fetching RFQs:", error)
        }
    }

    // Run on component mount
    useEffect(() => {
        fetchRfqs()
    }, [])

    const handleCreateRfq = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Push to backend DB
            await axios.post('http://127.0.0.1:5000/api/rfq/add', newRfq)
            
            // Refresh list and reset view
            fetchRfqs()
            setView('list')
            setNewRfq({ title: '', category: '', deadline: '', description: '', itemName: '', quantity: '' })
        } catch (error) {
            alert(error.response?.data?.error || "Failed to create RFQ")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredRfqs = rfqs.filter(rfq => 
        (rfq.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (rfq.id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    // View: List of RFQs
    if (view === 'list') {
        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Request for Quotations (RFQs)</h1>
                        <p>Manage and track all procurement requests.</p>
                    </div>
                    <button className="btn-primary animate-slide-up" onClick={() => setView('create')}>
                        + Create RFQ
                    </button>
                </header>

                <section className="table-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="vendors-toolbar">
                        <div className="search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search RFQs by title or ID..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>RFQ ID</th>
                                    <th>Title</th>
                                    <th>Deadline</th>
                                    <th>Invited Vendors</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRfqs.map((rfq, index) => (
                                    <tr key={index}>
                                        <td><strong>{rfq.id}</strong></td>
                                        <td>{rfq.title}</td>
                                        <td>{rfq.deadline}</td>
                                        <td>{rfq.vendors} Vendors</td>
                                        <td>
                                            {/* UI Maps 'Open' to Active styling, otherwise maps directly */}
                                            <span className={`status-badge status-${rfq.status === 'Open' ? 'active' : rfq.status.toLowerCase()}`}>
                                                {rfq.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn text-blue">View Quotes</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRfqs.length === 0 && (
                                    <tr><td colSpan="6" className="empty-state">No RFQs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    }

    // View: Create New RFQ Form
    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Create RFQ</h1>
                    <p>Initiate a new request for quotation workflow.</p>
                </div>
                <button className="btn-secondary" onClick={() => setView('list')}>
                    ← Back to List
                </button>
            </header>

            <section className="form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleCreateRfq}>
                    
                    <div className="form-section">
                        <h3 className="section-title">1. Basic Details</h3>
                        <div className="form-grid">
                            <label className="input-group">
                                <span>RFQ Title</span>
                                <input type="text" required placeholder="e.g., Office Furniture Procurement Q2" value={newRfq.title} onChange={e => setNewRfq({...newRfq, title: e.target.value})} />
                            </label>
                            
                            <label className="input-group">
                                <span>Category</span>
                                <select value={newRfq.category} onChange={e => setNewRfq({...newRfq, category: e.target.value})}>
                                    <option value="">Select Category</option>
                                    <option value="IT">IT Infrastructure</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Supplies">Stationery & Supplies</option>
                                </select>
                            </label>

                            <label className="input-group">
                                <span>Submission Deadline</span>
                                <input type="date" required value={newRfq.deadline} onChange={e => setNewRfq({...newRfq, deadline: e.target.value})} />
                            </label>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">2. Product / Service Requirements</h3>
                        <div className="form-grid">
                            <label className="input-group">
                                <span>Item Name / Description</span>
                                <input type="text" required placeholder="e.g., Ergonomic Mesh Office Chair" value={newRfq.itemName} onChange={e => setNewRfq({...newRfq, itemName: e.target.value})} />
                            </label>
                            <label className="input-group">
                                <span>Quantity Required</span>
                                <input type="number" min="1" required placeholder="e.g., 50" value={newRfq.quantity} onChange={e => setNewRfq({...newRfq, quantity: e.target.value})} />
                            </label>
                        </div>
                        <label className="input-group full-width">
                            <span>Additional Notes / Specifications</span>
                            <textarea rows="4" placeholder="Add detailed specifications or terms here..." value={newRfq.description} onChange={e => setNewRfq({...newRfq, description: e.target.value})}></textarea>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setView('list')} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Generating..." : "Generate RFQ & Invite Vendors"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}