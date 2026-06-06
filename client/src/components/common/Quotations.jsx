import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Quotations() {
    const [view, setView] = useState('list') 
    const [searchTerm, setSearchTerm] = useState('')
    const [quotations, setQuotations] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form states
    const [rfqId, setRfqId] = useState('')
    const [deliveryTime, setDeliveryTime] = useState('')
    const [terms, setTerms] = useState('')
    const [quoteItems, setQuoteItems] = useState([
        { id: Date.now(), item: '', qty: 1, rate: 0, tax: 0 }
    ])

    // Fetch live data from backend
    const fetchQuotations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/bid/')
            setQuotations(response.data)
        } catch (error) {
            console.error("Error fetching quotes:", error)
        }
    }

    useEffect(() => {
        fetchQuotations()
    }, [])

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

    const handleSubmitQuote = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            await axios.post('http://127.0.0.1:5000/api/bid/add', {
                rfq_id: rfqId,
                amount: grandTotal,
                delivery: deliveryTime,
                terms: terms
            })
            
            fetchQuotations()
            setView('list')
            setQuoteItems([{ id: Date.now(), item: '', qty: 1, rate: 0, tax: 0 }])
        } catch (error) {
            alert(error.response?.data?.error || "Submission failed")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCompareAction = async (quote, action) => {
        try {
            await axios.patch(`http://127.0.0.1:5000/api/bid/${quote.raw_id}/status`, {
                status: action
            })
            fetchQuotations()
            setView('list')
        } catch (error) {
            alert("Error updating status")
        }
    }

    // View: List
    if (view === 'list') {
        const filteredQuotes = quotations.filter(q => 
            (q.vendor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
            (q.id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )

        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Quotations</h1>
                        <p>Manage received quotes and submit new ones.</p>
                    </div>
                    <div className="action-group">
                        <button className="btn-secondary animate-slide-up" onClick={() => setView('compare')} disabled={quotations.length === 0}>
                            📊 Compare Quotes
                        </button>
                        <button className="btn-primary animate-slide-up" onClick={() => setView('submit')}>
                            + Submit Quotation
                        </button>
                    </div>
                </header>

                <section className="table-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="vendors-toolbar">
                        <div className="search-box">
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
                                {filteredQuotes.map((quote, index) => (
                                    <tr key={index}>
                                        <td><strong>{quote.id}</strong></td>
                                        <td>{quote.rfq_id}</td>
                                        <td>{quote.vendor}</td>
                                        <td>{quote.date}</td>
                                        <td><strong>${quote.amount.toLocaleString()}</strong></td>
                                        <td>
                                            <span className={`status-badge status-${quote.status.toLowerCase()}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn text-blue" onClick={() => setView('compare')}>View / Compare</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuotes.length === 0 && (
                                    <tr><td colSpan="7" className="empty-state">No quotations found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    }

    // View: Compare Quotations
    if (view === 'compare') {
        const lowestPrice = Math.min(...quotations.map(q => q.amount))
        
        return (
            <div className="animate-fade-in">
                <header className="dashboard-header flex-between">
                    <div>
                        <h1>Quotation Comparison</h1>
                        <p className="subtitle-highlight">Comparing {quotations.length} received quotations</p>
                    </div>
                    <button className="btn-secondary" onClick={() => setView('list')}>← Back</button>
                </header>

                <section className="form-container animate-slide-up">
                    <div className="table-wrapper compare-table-wrapper">
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th className="compare-header-row">Criteria</th>
                                    {quotations.map((quote, index) => (
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
                                    {quotations.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell best-price' : 'compare-value'}>
                                            ${quote.amount.toLocaleString()}
                                            {quote.amount === lowestPrice && <span className="best-tag">Lowest Price</span>}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="compare-row-label">Delivery</td>
                                    {quotations.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell' : 'compare-value'}>
                                            {quote.delivery}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="compare-row-label">Action</td>
                                    {quotations.map((quote, index) => (
                                        <td key={index} className={quote.amount === lowestPrice ? 'highlight-cell' : 'compare-value'}>
                                            {quote.status === 'Pending' ? (
                                                <button onClick={() => handleCompareAction(quote, 'Accepted')} className={quote.amount === lowestPrice ? 'btn-primary w-100' : 'btn-secondary w-100'}>
                                                    Approve Quote
                                                </button>
                                            ) : (
                                                <span className={`status-badge status-${quote.status.toLowerCase()}`}>{quote.status}</span>
                                            )}
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

    // View: Submit Quotation
    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Submit Quotation</h1>
                    <p className="subtitle-highlight">Provide competitive pricing for your associated RFQs.</p>
                </div>
                <button className="btn-secondary" onClick={() => setView('list')}>← Back</button>
            </header>

            <section className="form-container animate-slide-up">
                <form onSubmit={handleSubmitQuote}>
                    
                    <div className="form-section">
                        <div className="form-grid">
                            <label className="input-group">
                                <span>Target RFQ Reference</span>
                                <input type="text" required placeholder="e.g., RFQ-1042" value={rfqId} onChange={(e) => setRfqId(e.target.value)} />
                            </label>
                            <label className="input-group">
                                <span>Estimated Delivery Time</span>
                                <input type="text" required placeholder="e.g., 15 Days" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                            </label>
                        </div>
                    </div>
                    
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
                        <label className="input-group full-width">
                            <span>Terms & Conditions / Remarks</span>
                            <textarea rows="3" value={terms} onChange={e => setTerms(e.target.value)} placeholder="Payment terms, warranty info..."></textarea>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setView('list')}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? "Submitting..." : "Submit Quotation"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}