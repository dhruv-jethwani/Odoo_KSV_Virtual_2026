import '../../App.css'

export default function Landing() {
    return (
        <main className="landing-shell">
            <section className="landing-panel vb-landing">
                
                {/* Navigation Header */}
                <header className="vb-header animate-fade-in">
                    <div className="vb-logo">
                        <img
                            src="/Logo.PNG"
                            alt="VendorBridge Logo"
                            style={{ height: '40px', width: 'auto', display: 'block', flexShrink: 0 }}
                        />
                        <span>VendorBridge</span>
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