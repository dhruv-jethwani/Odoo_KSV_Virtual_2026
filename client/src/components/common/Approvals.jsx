import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Approvals() {
    const [view, setView] = useState('list') // 'list' or 'detail'
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedApproval, setSelectedApproval] = useState(null)
    const [approvals, setApprovals] = useState([])
    const [remarks, setRemarks] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch live pending approvals from backend
    const fetchApprovals = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/approval/')
            setApprovals(response.data)
        } catch (error) {
            console.error("Error fetching approvals:", error)
        }
    }

    useEffect(() => {
        fetchApprovals()
    }, [])

    const handleSelectApproval = (item) => {
        setSelectedApproval(item)
        setRemarks('') // Reset remarks on new selection
        setView('detail')
    }

    const handleAction = async (e, actionType) => {
        e.preventDefault()
        
        if (actionType === 'Rejected' && !remarks.trim()) {
            alert('Remarks are required to reject a quotation.')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/approval/${selectedApproval.bid_id}/action`, {
                action: actionType,
                remarks: remarks
            })
            alert(response.data.message)
            fetchApprovals() // Refresh the list
            setView('list')
        } catch (error) {
            alert(error.response?.data?.error || "Failed to process approval")
        } finally {
            setIsSubmitting(false)
        }
    }

    // ==========================================
    // VIEW 1: LIST PENDING APPROVALS
    // ==========================================
    if (view === 'list') {
        const filteredApprovals = approvals.filter(item => 
            (item.vendor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (item.rfq?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )

        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Approvals</h1>
                        <p>Review and manage pending procurement requests.</p>
                    </div>
                </header>

                <section className="table-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="vendors-toolbar">
                        <div className="search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search by RFQ or Vendor..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Approval ID</th>
                                    <th>RFQ Ref</th>
                                    <th>Title</th>
                                    <th>Vendor</th>
                                    <th>Amount</th>
                                    <th>Submission Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApprovals.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.id}</strong></td>
                                        <td>{item.rfq}</td>
                                        <td>{item.title}</td>
                                        <td>{item.vendor}</td>
                                        <td><strong>{item.amount}</strong></td>
                                        <td>{item.date}</td>
                                        <td>
                                            <span className={`status-badge status-${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="action-btn text-blue"
                                                onClick={() => handleSelectApproval(item)}
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApprovals.length === 0 && (
                                    <tr><td colSpan="8" className="empty-state">No pending approvals require your attention.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    }

    // ==========================================
    // VIEW 2: APPROVAL WORKFLOW (Screen 8)
    // ==========================================
    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Approval Workflow</h1>
                    <p className="subtitle-highlight">
                        {selectedApproval?.rfq}: {selectedApproval?.title} — {selectedApproval?.vendor} — {selectedApproval?.amount}
                    </p>
                </div>
                <button className="btn-secondary" onClick={() => setView('list')}>← Back to List</button>
            </header>

            <section className="form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                
                {/* Visual Progress Stepper */}
                <div className="workflow-stepper-container">
                    <div className="stepper-line"></div>
                    <div className="stepper-steps">
                        <div className="step completed">
                            <div className="step-circle">✓</div>
                            <div className="step-label">RFQ Created</div>
                        </div>
                        <div className="step completed">
                            <div className="step-circle">✓</div>
                            <div className="step-label">Quotations Received</div>
                        </div>
                        <div className="step active">
                            <div className="step-circle">3</div>
                            <div className="step-label">Pending Approval</div>
                        </div>
                        <div className="step pending">
                            <div className="step-circle">4</div>
                            <div className="step-label">Purchase Order</div>
                        </div>
                    </div>
                </div>

                <div className="split-section" style={{ marginTop: '40px' }}>
                    {/* Quotation Details Summary */}
                    <div className="approval-summary-card">
                        <h3 className="section-title">Quotation Details</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span>Vendor Name</span>
                                <strong>{selectedApproval?.vendor}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Total Amount</span>
                                <strong className="text-blue">{selectedApproval?.amount}</strong>
                            </div>
                            <div className="summary-item full-width">
                                <span>Action Details</span>
                                <p className="summary-text">Approving this quotation will automatically close the target RFQ, reject competing bids, and generate a Purchase Order.</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Form */}
                    <div className="approval-action-area">
                        <h3 className="section-title">Manager Decision</h3>
                        <form onSubmit={(e) => handleAction(e, 'Approved')}>
                            <label className="input-group full-width">
                                <span>Approval Remarks / Feedback</span>
                                <textarea 
                                    rows="4" 
                                    placeholder="Enter your remarks here (Required for rejection)..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                            </label>
                            
                            <div className="approval-buttons mt-4">
                                <button 
                                    type="button" 
                                    className="btn-reject w-100"
                                    disabled={isSubmitting}
                                    onClick={(e) => handleAction(e, 'Rejected')}
                                >
                                    Reject
                                </button>
                                <button type="submit" className="btn-approve w-100" disabled={isSubmitting}>
                                    {isSubmitting ? "Processing..." : "Approve & Generate PO"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}