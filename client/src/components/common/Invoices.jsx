import { useState } from 'react'

export default function Invoices() {
    const [view, setView] = useState('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedInvoice, setSelectedInvoice] = useState(null)

    // Mock Data for Invoices
    const [invoices] = useState([
        { 
            id: 'INV-8832', poRef: 'PO-2029', vendor: 'Vendor Infra Sapphire', 
            date: '16 May 2026', dueDate: '15 June 2026', amount: '$15,400.00', status: 'Pending Payment',
            items: [
                { desc: 'Office Chair Mesh', qty: 50, rate: 150, tax: 10, amount: 8250 },
                { desc: 'Executive Desk', qty: 10, rate: 450, tax: 10, amount: 4950 },
                { desc: 'Filing Cabinet', qty: 5, rate: 400, tax: 10, amount: 2200 }
            ]
        }
    ])

    const handleViewInvoice = (inv) => {
        setSelectedInvoice(inv)
        setView('detail')
    }

    if (view === 'list') {
        const filteredInvoices = invoices.filter(inv => 
            inv.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
            inv.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                                        <td><span className="status-badge status-pending">{inv.status}</span></td>
                                        <td>
                                            <button className="action-btn text-blue" onClick={() => handleViewInvoice(inv)}>View</button>
                                        </td>
                                    </tr>
                                ))}
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
                    <button className="btn-secondary">⬇️ Download PDF</button>
                    <button className="btn-secondary">✉️ Send Email</button>
                    <button className="btn-primary">Mark as Paid</button>
                </div>
            </header>

            <section className="document-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="document-header">
                    <div className="doc-branding">
                        <h2>{selectedInvoice?.vendor}</h2>
                        <p>Supplier Address Line 1<br/>Supplier City, Country</p>
                    </div>
                    <div className="doc-meta">
                        <h1 className="doc-title text-blue">TAX INVOICE</h1>
                        <div className="doc-meta-grid">
                            <span>Invoice No:</span> <strong>{selectedInvoice?.id}</strong>
                            <span>Date:</span> <strong>{selectedInvoice?.date}</strong>
                            <span>Due Date:</span> <strong className="text-red">{selectedInvoice?.dueDate}</strong>
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
                                    <td className="text-right font-bold">{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
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
                            <span>Amount Due</span>
                            <h2 className="text-blue">{selectedInvoice?.amount}</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}