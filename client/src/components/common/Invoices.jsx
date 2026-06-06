import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Invoices() {
    const [view, setView] = useState('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [invoices, setInvoices] = useState([])
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isEmailing, setIsEmailing] = useState(false)

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/invoice/')
            setInvoices(response.data)
        } catch (error) {
            console.error("Error fetching invoices:", error)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    const handleViewInvoice = (inv) => {
        setSelectedInvoice(inv)
        setView('detail')
    }

    const handleMarkAsPaid = async () => {
        setIsProcessing(true)
        try {
            const response = await axios.patch(`http://127.0.0.1:5000/api/invoice/${selectedInvoice.raw_id}/pay`)
            alert(response.data.message)
            fetchInvoices() 
            setView('list')
        } catch (error) {
            alert(error.response?.data?.error || "Failed to mark as paid")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSendEmail = async () => {
        setIsEmailing(true)
        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/invoice/${selectedInvoice.raw_id}/email`)
            alert(response.data.message)
        } catch (error) {
            alert(error.response?.data?.error || "Failed to send email. Make sure SMTP variables are set in .env")
        } finally {
            setIsEmailing(false)
        }
    }

    if (view === 'list') {
        const filteredInvoices = invoices.filter(inv => 
            (inv.vendor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (inv.id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )

        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Invoices</h1>
                        <p>Track generated invoices and payment statuses.</p>
                    </div>
                </header>

                <section className="table-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="vendors-toolbar">
                        <div className="search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input 
                                type="text" 
                                placeholder="Search by Invoice number or Vendor..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Invoice Number</th>
                                    <th>PO Ref</th>
                                    <th>Vendor Name</th>
                                    <th>Issue Date</th>
                                    <th>Total Amount</th>
                                    <th>Payment Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((inv, index) => (
                                    <tr key={index}>
                                        <td><strong>{inv.id}</strong></td>
                                        <td>{inv.poRef}</td>
                                        <td>{inv.vendor}</td>
                                        <td>{inv.date}</td>
                                        <td><strong>{inv.amount}</strong></td>
                                        <td>
                                            <span className={`status-badge status-${inv.status === 'Paid' ? 'completed' : 'pending'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn text-blue" onClick={() => handleViewInvoice(inv)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && (
                                    <tr><td colSpan="7" className="empty-state">No invoices have been generated yet. Generate them from issued Purchase Orders.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Invoice Details</h1>
                    <p className="subtitle-highlight">{selectedInvoice?.id} — Generated from {selectedInvoice?.poRef}</p>
                </div>
                <div className="action-group">
                    <button className="btn-secondary" onClick={() => setView('list')}>← Back</button>
                    <button className="btn-secondary" onClick={() => window.print()}>🖨️ Print / Download PDF</button>
                    <button className="btn-secondary" onClick={handleSendEmail} disabled={isEmailing}>
                        {isEmailing ? "Sending..." : "✉️ Send Email"}
                    </button>
                    {selectedInvoice.status !== 'Paid' && (
                        <button className="btn-primary" onClick={handleMarkAsPaid} disabled={isProcessing}>
                            {isProcessing ? "Processing..." : "Mark as Paid"}
                        </button>
                    )}
                </div>
            </header>

            <section className="document-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="document-header">
                    <div className="doc-branding">
                        <h2>{selectedInvoice?.vendor}</h2>
                        <p>Registered Vendor Profile<br/>Verified Account Network</p>
                    </div>
                    <div className="doc-meta">
                        <h1 className="doc-title text-blue">TAX INVOICE</h1>
                        <div className="doc-meta-grid">
                            <span>Invoice No:</span> <strong>{selectedInvoice?.id}</strong>
                            <span>Date:</span> <strong>{selectedInvoice?.date}</strong>
                            <span>Due Date:</span> <strong className={selectedInvoice?.status === 'Paid' ? 'text-green' : 'text-red'}>{selectedInvoice?.dueDate}</strong>
                        </div>
                    </div>
                </div>

                <div className="document-parties">
                    <div className="party-box">
                        <h3>Billed To</h3>
                        <strong>VENDORBRIDGE HQ</strong>
                        <p>123 Corporate Ave, Tech Park<br/>New Delhi, India 110001<br/>GSTIN: 07AABCD1234E1Z5</p>
                    </div>
                </div>

                <div className="table-wrapper doc-table-wrapper">
                    <table className="doc-table">
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Rate ($)</th>
                                <th className="text-right">Tax (%)</th>
                                <th className="text-right">Amount ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedInvoice?.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.desc}</td>
                                    <td className="text-center">{item.qty}</td>
                                    <td className="text-right">{item.rate.toFixed(2)}</td>
                                    <td className="text-right">{item.tax}%</td>
                                    <td className="text-right font-bold">${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="document-footer">
                    <div className="doc-notes">
                        <h4>Payment Information</h4>
                        <p>Bank Name: Global Trust Bank<br/>A/C No: 123456789012<br/>IFSC: GTB0001234</p>
                    </div>
                    <div className="doc-totals">
                        <div className="total-row">
                            <span>{selectedInvoice?.status === 'Paid' ? 'Amount Paid' : 'Amount Due'}</span>
                            <h2 className="text-blue">{selectedInvoice?.amount}</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}