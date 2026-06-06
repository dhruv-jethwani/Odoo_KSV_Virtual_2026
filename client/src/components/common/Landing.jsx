import '../../App.css'

export default function Landing() {
    return (
        <main className="landing-shell">
            <section className="landing-panel vb-landing">
                
                {/* Navigation Header */}
                <header className="vb-header animate-fade-in">
                    <div className="vb-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        VendorBridge
                    </div>
                    <nav className="vb-nav">
                        <a href="#login" className="vb-nav-link">Login</a>
                        <a href="#signup" className="vb-nav-btn">Sign Up</a>
                    </nav>
                </header>

                {/* Hero Content */}
                <div className="landing-copy vb-hero">
                    <div className="animate-slide-up">
                        <span className="landing-badge">Procurement ERP</span>
                    </div>
                    <h1 className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Simplify & Digitize Your Procurement Workflow.
                    </h1>
                    <p className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        VendorBridge is a centralized platform designed to seamlessly manage vendors, automate RFQs, compare quotations, and generate purchase orders and invoices—all in one place.
                    </p>
                    
                    <div className="landing-actions animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <a className="landing-button landing-button-primary" href="#signup">
                            Get Started for Free - Register Now
                        </a>
                        <a className="landing-button landing-button-secondary" href="#login">
                            Login to Dashboard
                        </a>
                    </div>
                </div>

                {/* Features Highlights */}
                <div className="landing-highlights animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="feature-card">
                        <div className="feature-icon bg-blue">👥</div>
                        <strong>Vendor Management</strong>
                        <span>Register vendors and track structured supplier profiles and approvals.</span>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon bg-yellow">📊</div>
                        <strong>Smart RFQs & Quotes</strong>
                        <span>Create requests, receive submissions, and easily compare vendor quotations.</span>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon bg-green">📄</div>
                        <strong>Automated POs</strong>
                        <span>Generate official purchase orders and print or email invoices instantly.</span>
                    </div>
                </div>

            </section>
        </main>
    )
}