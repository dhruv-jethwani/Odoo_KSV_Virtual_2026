import { useState } from 'react'

export default function PurchaseOrders() {
    const [view, setView] = useState('list') // 'list' or 'detail'
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedPO, setSelectedPO] = useState(null)

    // Mock Data for POs
    const [purchaseOrders] = useState([
        { 
            id: 'PO-2029', rfq: 'RFQ-1042', vendor: 'Vendor Infra Sapphire', 
            date: '15 May 2026', amount: '$15,400.00', status: 'Issued',
            items: [
                { desc: 'Office Chair Mesh', qty: 50, rate: 150, tax: 10, amount: 8250 },
                { desc: 'Executive Desk', qty: 10, rate: 450, tax: 10, amount: 4950 },
                { desc: 'Filing Cabinet', qty: 5, rate: 400, tax: 10, amount: 2200 }
            ]
        },
        { 
            id: 'PO-2030', rfq: 'RFQ-1044', vendor: 'Tech Supplies Co.', 
            date: '16 May 2026', amount: '$42,000.00', status: 'Invoiced',
            items: []
        }
    ])

    const handleViewPO = (po) => {
        setSelectedPO(po)
        setView('detail')
    }

    const handleGenerateInvoice = () => {
        alert(`Invoice auto-generated for ${selectedPO.id}! Check the Invoices tab.`)
        setView('list')
    }

    // ==========================================
    // VIEW 1: LIST POs
    // ==========================================
    if (view === 'list') {
        const filteredPOs = purchaseOrders.filter(po => 
            po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
            po.id.toLowerCase().includes(searchTerm.toLowerCase())
        )

        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Purchase Orders</h1>
                        <p>Manage generated purchase orders and initiate invoicing.</p>
                    </div>
                </header>

                <section className="table-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="vendors-toolbar">
                        <div className="search-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input 
                                type="text" 
                                placeholder="Search by PO number or Vendor..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>PO Number</th>
                                    <th>RFQ Ref</th>
                                    <th>Vendor Name</th>
                                    <th>Issue Date</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPOs.map((po, index) => (
                                    <tr key={index}>
                                        <td><strong>{po.id}</strong></td>
                                        <td>{po.rfq}</td>
                                        <td>{po.vendor}</td>
                                        <td>{po.date}</td>
                                        <td><strong>{po.amount}</strong></td>
                                        <td><span className={`status-badge status-${po.status.toLowerCase()}`}>{po.status}</span></td>
                                        <td>
                                            <button className="action-btn text-blue" onClick={() => handleViewPO(po)}>View Document</button>
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

    // ==========================================
    // VIEW 2: PO DETAIL & ACTIONS (Screen 9)
    // ==========================================
    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Purchase Order Details</h1>
                    <p className="subtitle-highlight">{selectedPO?.id} — Auto-generated after approval</p>
                </div>
                <div className="action-group">
                    <button className="btn-secondary" onClick={() => setView('list')}>← Back</button>
                    <button className="btn-secondary">🖨️ Print</button>
                    <button className="btn-secondary">✉️ Email PO</button>
                    {selectedPO.status === 'Issued' && (
                        <button className="btn-primary" onClick={handleGenerateInvoice}>Generate Invoice</button>
                    )}
                </div>
            </header>

            <section className="document-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="document-header">
                    <div className="doc-branding">
                        <h2>VENDORBRIDGE</h2>
                        <p>123 Corporate Ave, Tech Park<br/>New Delhi, India 110001</p>
                    </div>
                    <div className="doc-meta">
                        <h1 className="doc-title">PURCHASE ORDER</h1>
                        <div className="doc-meta-grid">
                            <span>PO Number:</span> <strong>{selectedPO?.id}</strong>
                            <span>Date:</span> <strong>{selectedPO?.date}</strong>
                            <span>Status:</span> <strong className="text-blue">{selectedPO?.status}</strong>
                        </div>
                    </div>
                </div>

                <div className="document-parties">
                    <div className="party-box">
                        <h3>Vendor / Supplier</h3>
                        <strong>{selectedPO?.vendor}</strong>
                        <p>Vendor ID: V-001<br/>contact@supplier.com<br/>+91 98765 43210</p>
                    </div>
                    <div className="party-box">
                        <h3>Shipping Details</h3>
                        <strong>Procurement Hub - HQ</strong>
                        <p>Receiving Dock B<br/>123 Corporate Ave, Tech Park<br/>Delivery Ref: {selectedPO?.rfq}</p>
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
                            {selectedPO?.items.map((item, idx) => (
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
                        <h4>Terms & Conditions</h4>
                        <p>1. Delivery required within 15 days of PO date.<br/>2. Payment terms: Net 30 days after invoice receipt.</p>
                    </div>
                    <div className="doc-totals">
                        <div className="total-row">
                            <span>Grand Total</span>
                            <h2 className="text-blue">{selectedPO?.amount}</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}