import { useState } from 'react'

export default function Quotations() {
    // view state can be: 'list', 'submit', or 'compare'
    const [view, setView] = useState('list') 
    const [searchTerm, setSearchTerm] = useState('')

    // Mock data for Quotation List
    const [quotations, setQuotations] = useState([
        { id: 'QT-5012', rfq: 'RFQ-1042', vendor: 'Vendor Infra Sapphire', date: '12 May 2026', amount: '$15,400', status: 'Pending Approval' },
        { id: 'QT-5013', rfq: 'RFQ-1043', vendor: 'Tech Supplies Co.', date: '14 May 2026', amount: '$4,200', status: 'Approved' },
        { id: 'QT-5010', rfq: 'RFQ-1041', vendor: 'Stationery Hub', date: '02 May 2026', amount: '$850', status: 'Rejected' },
    ])

    // Mock State for New Quotation Submission
    const [quoteItems, setQuoteItems] = useState([
        { id: 1, item: 'Office Chair Mesh', qty: 50, rate: 150, tax: 10 },
        { id: 2, item: 'Executive Desk', qty: 10, rate: 450, tax: 10 }
    ])

    // Mock Data for Quotation Comparison (Screen 7)
    const comparisonData = {
        rfqTitle: "Office Furniture Procurement Q2",
        rfqId: "RFQ-1042",
        quotes: [
            { id: 'QT-5012', vendor: 'Vendor Infra Sapphire', amount: 15400, delivery: '15 Days', rating: 4, terms: 'Net 30' },
            { id: 'QT-5014', vendor: 'Global Office Sol.', amount: 14200, delivery: '20 Days', rating: 5, terms: 'Net 15' },
            { id: 'QT-5015', vendor: 'Premium Furnishers', amount: 16800, delivery: '10 Days', rating: 3, terms: 'Due on receipt' }
        ]
    }

    // Helper functions for quotation submission calculation
    const calculateRowTotal = (qty, rate, tax) => {
        const subtotal = (qty || 0) * (rate || 0)
        const taxAmount = subtotal * ((tax || 0) / 100)
        return subtotal + taxAmount
    }

    const grandTotal = quoteItems.reduce((acc, item) => acc + calculateRowTotal(item.qty, item.rate, item.tax), 0)

    const handleItemChange = (id, field, value) => {
        setQuoteItems(quoteItems.map(item => 
            item.id === id ? { ...item, [field]: parseFloat(value) || value } : item
        ))
    }

    const handleSubmitQuote = (e) => {
        e.preventDefault()
        const newQuote = {
            id: `QT-${Math.floor(5000 + Math.random() * 1000)}`,
            rfq: 'RFQ-1042',
            vendor: 'Your Company (Vendor)',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: `$${grandTotal.toLocaleString()}`,
            status: 'Pending Approval'
        }
        setQuotations([newQuote, ...quotations])
        setView('list')
    }

    // Find the lowest price for the comparison highlight
    const lowestPrice = Math.min(...comparisonData.quotes.map(q => q.amount))

    // Helper for rendering stars
    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating)
    }

    // ==========================================
    // VIEW 1: LIST
    // ==========================================
    if (view === 'list') {
        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Quotations</h1>
                        <p>Manage received quotes and submit new ones.</p>
                    </div>
                    <div className="action-group">
                        <button className="btn-secondary animate-slide-up" onClick={() => setView('compare')}>
                            📊 Compare Quotes
                        </button>
                        <button className="btn-primary animate-slide-up" style={{ animationDelay: '0.1s' }} onClick={() => setView('submit')}>
                            + Submit Quotation
                        </button>
                    </div>
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
                                placeholder="Search quotations by ID or Vendor..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Quote ID</th>
                                    <th>RFQ Ref</th>
                                    <th>Vendor Name</th>
                                    <th>Submission Date</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotations.filter(q => q.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase())).map((quote, index) => (
                                    <tr key={index}>
                                        <td><strong>{quote.id}</strong></td>
                                        <td>{quote.rfq}</td>
                                        <td>{quote.vendor}</td>
                                        <td>{quote.date}</td>
                                        <td><strong>{quote.amount}</strong></td>
                                        <td>
                                            <span className={`status-badge status-${quote.status.split(' ')[0].toLowerCase()}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn text-blue">View</button>
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
    // VIEW 2: COMPARE QUOTATIONS (Screen 7)
    // ==========================================
    if (view === 'compare') {
        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Quotation Comparison</h1>
                        <p className="subtitle-highlight">RFQ: {comparisonData.rfqTitle} — {comparisonData.quotes.length} quotations received</p>
                    </div>
                    <button className="btn-secondary" onClick={() => setView('list')}>← Back to List</button>
                </header>

                <section className="form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="table-wrapper compare-table-wrapper">
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th className="compare-header-row">Comparison Criteria</th>
                                    {comparisonData.quotes.map((quote, index) => (
                                        <th key={index} className={quote.amount === lowestPrice ? 'highlight-col-header' : ''}>
                                            {quote.vendor}
                                            <div className="compare-quote-id">{quote.id}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="compare-row-label">Total Amount</td>
                                    {comparisonData.quotes.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell best-price' : 'compare-value'}>
                                            ${quote.amount.toLocaleString()}
                                            {quote.amount === lowestPrice && <span className="best-tag">Lowest Price</span>}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="compare-row-label">Delivery Timeline</td>
                                    {comparisonData.quotes.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell' : 'compare-value'}>
                                            {quote.delivery}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="compare-row-label">Vendor Rating</td>
                                    {comparisonData.quotes.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell' : 'compare-value'}>
                                            <span className="rating-stars">{renderStars(quote.rating)}</span>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="compare-row-label">Payment Terms</td>
                                    {comparisonData.quotes.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell' : 'compare-value'}>
                                            {quote.terms}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="compare-row-label">Action</td>
                                    {comparisonData.quotes.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell' : 'compare-value'}>
                                            <button className={quote.amount === lowestPrice ? 'btn-primary w-100' : 'btn-secondary w-100'}>
                                                Select & Approve
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    }

    // ==========================================
    // VIEW 3: SUBMIT QUOTATION (Screen 6)
    // ==========================================
    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Submit Quotation</h1>
                    <p className="subtitle-highlight">RFQ: Office Furniture Procurement Q2 — Deadline: 15 June 2026</p>
                </div>
                <button className="btn-secondary" onClick={() => setView('list')}>← Back to List</button>
            </header>

            <section className="form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmitQuote}>
                    
                    {/* Quotation Table */}
                    <div className="form-section">
                        <div className="table-wrapper quote-table-wrapper">
                            <table className="quote-input-table">
                                <thead>
                                    <tr>
                                        <th>Item Description</th>
                                        <th width="12%">Qty</th>
                                        <th width="15%">Rate ($)</th>
                                        <th width="15%">Tax (%)</th>
                                        <th width="20%">Amount ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quoteItems.map((item) => (
                                        <tr key={item.id}>
                                            <td><input type="text" value={item.item} onChange={(e) => handleItemChange(item.id, 'item', e.target.value)} required /></td>
                                            <td><input type="number" min="1" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} required /></td>
                                            <td><input type="number" min="0" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} required /></td>
                                            <td><input type="number" min="0" value={item.tax} onChange={(e) => handleItemChange(item.id, 'tax', e.target.value)} required /></td>
                                            <td className="row-amount">
                                                ${calculateRowTotal(item.qty, item.rate, item.tax).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="quote-total-row">
                            <button type="button" className="btn-secondary btn-small" onClick={() => setQuoteItems([...quoteItems, { id: Date.now(), item: '', qty: 1, rate: 0, tax: 0 }])}>
                                + Add Row
                            </button>
                            <div className="grand-total">
                                <span>Grand Total:</span>
                                <h2>${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="form-section split-section">
                        <label className="input-group">
                            <span>Remarks / Notes</span>
                            <textarea rows="3" placeholder="Enter any additional notes regarding this quotation..."></textarea>
                        </label>
                        <label className="input-group">
                            <span>Terms & Conditions</span>
                            <textarea rows="3" placeholder="Payment terms, delivery timeline, warranty info..."></textarea>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setView('list')}>Cancel</button>
                        <button type="submit" className="btn-primary">Submit Quotation</button>
                    </div>
                </form>
            </section>
        </div>
    )
}