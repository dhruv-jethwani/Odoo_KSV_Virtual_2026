import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'

export default function Vendors() {
    const [vendors, setVendors] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    
    // Modal & Loading States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newCredentials, setNewCredentials] = useState(null)

    // Form state mapping directly to the Flask backend expectations
    const [formData, setFormData] = useState({
        companyName: '',
        contactFirstName: '',
        contactLastName: '',
        email: '',
        phone: '',
        taxId: '',
        country: ''
    })

    // Fetch live vendors from backend
    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/vendor/')
            setVendors(response.data)
        } catch (error) {
            console.error("Error fetching vendors:", error)
        }
    }

    useEffect(() => {
        fetchVendors()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/vendor/add', formData)
            fetchVendors() // Reload table rows
            setNewCredentials(response.data.generated_credentials) // Fire success popup
            
            // Clean up form
            setFormData({
                companyName: '', contactFirstName: '', contactLastName: '', 
                email: '', phone: '', taxId: '', country: ''
            })
        } catch (error) {
            alert(error.response?.data?.error || "Failed to add vendor")
        } finally {
            setIsSubmitting(false)
        }
    }

    const closeCredentialsPopup = () => {
        setNewCredentials(null)
        setIsModalOpen(false)
    }

    // Fix: Safely accessing properties using optional chaining to prevent crashes
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = (vendor.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                              (vendor.contactPerson?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        
        // Maps backend 'Active' flag to the tab filtering states
        const matchesStatus = filterStatus === 'All' || vendor.complianceStatus === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <div className="animate-fade-in">
            {/* Header Area using your structural layout blocks */}
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Vendors</h1>
                    <p>Manage supplier profiles, registrations, and statuses.</p>
                </div>
                <button 
                    className="btn-primary animate-slide-up" 
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Vendor
                </button>
            </header>

            <section className="table-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {/* Search Bar and Quick Tabs Filtering matching design system */}
                <div className="vendors-toolbar">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search vendors by name or profile..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        {['All', 'Active', 'Pending Review', 'Blocked'].map(status => (
                            <button 
                                key={status}
                                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status === 'Pending Review' ? 'Pending' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Layout */}
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Vendor ID</th>
                                <th>Company Name</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Tax ID / GST</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.length > 0 ? (
                                filteredVendors.map((vendor) => (
                                    <tr key={vendor.id}>
                                        <td><strong>V-{String(vendor.id).padStart(3, '0')}</strong></td>
                                        <td>{vendor.companyName}</td>
                                        <td>{vendor.contactPerson}</td>
                                        <td>{vendor.email}</td>
                                        <td>{vendor.taxId}</td>
                                        <td>
                                            {/* Status mapping automatically evaluates background colors via app.css templates */}
                                            <span className={`status-badge status-${vendor.complianceStatus?.toLowerCase().replace(" ", "-") || 'pending'}`}>
                                                {vendor.complianceStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">No vendors found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ADD VENDOR POPUP DIALOG */}
            {isModalOpen && !newCredentials && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <section className="login-card register-card" style={{ padding: '32px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="login-hero" style={{ marginBottom: '24px' }}>
                            <h1>Add New Vendor</h1>
                            <span>Fill out details to initialize a connected portal credential.</span>
                        </div>
                        
                        <form className="login-form register-form" onSubmit={handleSubmit} style={{ marginTop: '0' }}>
                            <div className="register-row">
                                <label className="field">
                                    <p align="left">Company Name</p>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Acme Corp" />
                                </label>
                                <label className="field">
                                    <p align="left">Tax ID / GST No.</p>
                                    <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} required placeholder="27AADCB2230M1Z2" />
                                </label>
                            </div>
                            
                            <div className="register-row">
                                <label className="field">
                                    <p align="left">Contact First Name</p>
                                    <input type="text" name="contactFirstName" value={formData.contactFirstName} onChange={handleChange} required placeholder="John" />
                                </label>
                                <label className="field">
                                    <p align="left">Contact Last Name</p>
                                    <input type="text" name="contactLastName" value={formData.contactLastName} onChange={handleChange} required placeholder="Doe" />
                                </label>
                            </div>

                            <div className="register-row">
                                <label className="field">
                                    <p align="left">Company Email</p>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@acmecorp.com" />
                                </label>
                                <label className="field">
                                    <p align="left">Phone Number</p>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 9876543210" />
                                </label>
                            </div>

                            <label className="field">
                                <p align="left">Country</p>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="India" />
                            </label>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                                <button type="button" className="filter-btn" onClick={() => setIsModalOpen(false)} style={{ flex: 1, height: '45px' }}>Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ margin: 0, flex: 2, height: '45px' }}>
                                    {isSubmitting ? 'Processing...' : 'Create Profile'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* GENERATED CREDENTIALS VIEW FOR ADMIN RECORDING */}
            {newCredentials && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <section className="login-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', margin: 0 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                        <h1>Vendor Linked!</h1>
                        <p style={{ fontSize: '0.9rem', marginBottom: '24px', color: 'var(--text-muted)' }}>
                            Provide these portal connection credentials directly to the vendor manager.
                        </p>
                        
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ opacity: 0.8 }}>Username:</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb' }}>{newCredentials.username}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.8 }}>Temporary Key:</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#2563eb' }}>{newCredentials.password}</span>
                            </div>
                        </div>

                        <button className="btn-primary" onClick={closeCredentialsPopup} style={{ margin: 0, width: '100%' }}>
                            Complete Onboarding
                        </button>
                    </section>
                </div>
            )}
        </div>
    )
}

// Basic overlay constraint to sit centered on top of dark themes smoothly
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};