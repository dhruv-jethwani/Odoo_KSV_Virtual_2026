import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Rfqs() {
    const [view, setView] = useState('list') 
    const [searchTerm, setSearchTerm] = useState('')
    const [rfqs, setRfqs] = useState([]) 
    const [vendors, setVendors] = useState([]) // Store available vendors
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Quotes Modal State
    const [quotesModalOpen, setQuotesModalOpen] = useState(false)
    const [selectedRfqQuotes, setSelectedRfqQuotes] = useState([])
    const [loadingQuotes, setLoadingQuotes] = useState(false)

    const [newRfq, setNewRfq] = useState({
        title: '',
        category: '',
        deadline: '',
        description: '',
        itemName: '',
        quantity: '',
        invitedVendors: [] // Array of vendor IDs
    })

    const fetchRfqsAndVendors = async () => {
        try {
            const [rfqRes, vendorRes] = await Promise.all([
                axios.get('http://127.0.0.1:5000/api/rfq/'),
                axios.get('http://127.0.0.1:5000/api/vendor/')
            ])
            setRfqs(rfqRes.data)
            setVendors(vendorRes.data.filter(v => v.complianceStatus === 'Active'))
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    useEffect(() => {
        fetchRfqsAndVendors()
    }, [])

    const handleCreateRfq = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await axios.post('http://127.0.0.1:5000/api/rfq/add', newRfq)
            fetchRfqsAndVendors()
            setView('list')
            setNewRfq({ title: '', category: '', deadline: '', description: '', itemName: '', quantity: '', invitedVendors: [] })
            alert('RFQ Created and Vendors Invited successfully!')
        } catch (error) {
            alert(error.response?.data?.error || "Failed to create RFQ")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleVendorToggle = (vendorId) => {
        setNewRfq(prev => {
            const selected = new Set(prev.invitedVendors)
            if (selected.has(vendorId)) selected.delete(vendorId)
            else selected.add(vendorId)
            return { ...prev, invitedVendors: [...selected] }
        })
    }

    const handleViewQuotes = async (rfqId) => {
        setQuotesModalOpen(true)
        setLoadingQuotes(true)
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/bid/')
            // Filter quotes that match this specific RFQ
            const related = res.data.filter(b => b.rfq_id === rfqId)
            setSelectedRfqQuotes(related)
        } catch(e) {
            console.error("Error fetching quotes:", e)
        } finally {
            setLoadingQuotes(false)
        }
    }

    const filteredRfqs = rfqs.filter(rfq => 
        (rfq.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (rfq.id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    if (view === 'list') {
        return (
            <div className="animate-fade-in relative">
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
                                            <span className={`status-badge status-${rfq.status === 'Open' ? 'active' : rfq.status.toLowerCase()}`}>
                                                {rfq.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn text-blue" onClick={() => handleViewQuotes(rfq.id)}>
                                                View Quotes
                                            </button>
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

                {/* VIEW QUOTES MODAL */}
                {quotesModalOpen && (
                    <div className="modal-overlay" style={modalOverlayStyle}>
                        <div className="login-card register-card" style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto', margin: 0 }}>
                            <div className="flex-between" style={{ marginBottom: '24px' }}>
                                <h2>Quotations Received</h2>
                                <button onClick={() => setQuotesModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                            </div>
                            
                            {loadingQuotes ? (
                                <p>Loading quotes...</p>
                            ) : selectedRfqQuotes.length > 0 ? (
                                <div className="table-wrapper">
                                    <table className="compact-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Vendor</th>
                                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Delivery</th>
                                                <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRfqQuotes.map((quote, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}><strong>{quote.vendor}</strong></td>
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>${quote.amount.toLocaleString()}</td>
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{quote.delivery}</td>
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                                                        <span className={`status-badge status-${quote.status.toLowerCase()}`}>{quote.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">No quotations have been submitted for this RFQ yet.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

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
                                <select value={newRfq.category} required onChange={e => setNewRfq({...newRfq, category: e.target.value})}>
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

                    {/* NEW SECTION: VENDOR INVITATIONS */}
                    <div className="form-section">
                        <h3 className="section-title">3. Invite Vendors</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>Select active vendors to send email invitations.</p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {vendors.map(v => (
                                <label key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={newRfq.invitedVendors.includes(v.id)}
                                        onChange={() => handleVendorToggle(v.id)} 
                                        style={{ width: 'auto' }}
                                    />
                                    {v.companyName}
                                </label>
                            ))}
                            {vendors.length === 0 && <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No active vendors available to invite.</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setView('list')} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Generating & Sending Invites..." : "Generate RFQ & Invite Vendors"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};