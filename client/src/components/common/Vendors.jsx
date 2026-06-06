import { useState } from 'react'

export default function Vendors() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')

    // Mock data for vendors
    const [vendors] = useState([
        { id: 'V-001', name: 'Office Furniture G2', category: 'Furniture', contact: 'contact@g2furn.com', gst: '27AADCB2230M1Z2', status: 'Active' },
        { id: 'V-002', name: 'Tech Supplies Co.', category: 'IT Infra', contact: 'sales@techsupplies.com', gst: '29AAECT1142P1Z5', status: 'Pending' },
        { id: 'V-003', name: 'Stationery Hub', category: 'Supplies', contact: 'info@stationeryhub.in', gst: '07AABCS3341N1Z1', status: 'Active' },
        { id: 'V-004', name: 'Global Logistics', category: 'Transport', contact: 'support@globallog.com', gst: '24BBECT8821P1Z9', status: 'Blocked' },
        { id: 'V-005', name: 'Apex Buildmart', category: 'Raw Materials', contact: 'sales@apexbuild.com', gst: '19AACCA4455K1Z3', status: 'Active' },
    ])

    // Filter logic
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'All' || vendor.status === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Vendors</h1>
                    <p>Manage supplier profiles, registrations, and statuses.</p>
                </div>
                <button className="btn-primary animate-slide-up">+ Add Vendor</button>
            </header>

            <section className="table-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {/* Toolbar: Search and Filters */}
                <div className="vendors-toolbar">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search vendors by name or category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        {['All', 'Active', 'Pending', 'Blocked'].map(status => (
                            <button 
                                key={status}
                                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Vendor ID</th>
                                <th>Vendor Name</th>
                                <th>Category</th>
                                <th>Contact / Email</th>
                                <th>GST No.</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.length > 0 ? (
                                filteredVendors.map((vendor, index) => (
                                    <tr key={index}>
                                        <td><strong>{vendor.id}</strong></td>
                                        <td>{vendor.name}</td>
                                        <td><span className="category-tag">{vendor.category}</span></td>
                                        <td>{vendor.contact}</td>
                                        <td>{vendor.gst}</td>
                                        <td>
                                            <span className={`status-badge status-${vendor.status.toLowerCase()}`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn text-blue">Edit</button>
                                            <button className="action-btn text-red">Block</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty-state">No vendors found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}