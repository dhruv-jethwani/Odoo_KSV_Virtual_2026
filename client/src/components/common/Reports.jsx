import { useState } from 'react'

export default function Reports() {
    // Static mock data for the reports dashboard
    const [stats] = useState([
        { label: 'Total Spend (YTD)', value: '$ 12.4 L', subtext: 'Updated today', color: 'blue' },
        { label: 'Active Vendors', value: '28', subtext: 'Across all categories', color: 'green' },
        { label: 'Compliance Rate', value: '94%', subtext: '+2% from last quarter', color: 'yellow' },
        { label: 'Rejected Quotes', value: '3', subtext: 'In the last 30 days', color: 'red' }
    ])

    const [categorySpend] = useState([
        { category: 'Furniture', percentage: 45, amount: '$ 5.5 L', color: 'bg-blue' },
        { category: 'IT Infra', percentage: 30, amount: '$ 3.7 L', color: 'bg-green' },
        { category: 'Stationery', percentage: 15, amount: '$ 1.8 L', color: 'bg-yellow' },
        { category: 'Logistics', percentage: 10, amount: '$ 1.4 L', color: 'bg-red' }
    ])

    const [topVendors] = useState([
        { name: 'Tech Supplies Co.', spend: '$ 4,20,000', pos: 4 },
        { name: 'Vendor Infra Sapphire', spend: '$ 3,10,000', pos: 2 },
        { name: 'Stationery Hub', spend: '$ 1,40,000', pos: 5 },
        { name: 'Global Office Sol.', spend: '$ 95,000', pos: 1 }
    ])

    const [monthlyTrend] = useState([
        { month: 'Jan', height: '40%' },
        { month: 'Feb', height: '55%' },
        { month: 'Mar', height: '35%' },
        { month: 'Apr', height: '80%' },
        { month: 'May', height: '65%' },
        { month: 'Jun', height: '90%' }
    ])

    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Procurement insights, spending trends, and vendor performance.</p>
                </div>
                <div className="action-group">
                    <button className="btn-secondary">📄 Export CSV</button>
                    <button className="btn-primary">⬇️ Download PDF</button>
                </div>
            </header>

            {/* Top Stats Array */}
            <section className="stats-grid">
                {stats.map((stat, index) => (
                    <div 
                        className="stat-card animate-slide-up" 
                        key={index} 
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <h3 className={`text-${stat.color}`}>{stat.value}</h3>
                        <p className="stat-label">{stat.label}</p>
                        <small className="stat-subtext">{stat.subtext}</small>
                    </div>
                ))}
            </section>

            {/* Mid Section: Category Spend & Top Vendors */}
            <section className="dashboard-content animate-slide-up" style={{ animationDelay: '0.2s', marginTop: '24px' }}>
                
                {/* Spend by Category (Progress Bars) */}
                <div className="analytics-container">
                    <div className="section-header">
                        <h2>Spend by Category</h2>
                    </div>
                    <div className="category-list">
                        {categorySpend.map((cat, idx) => (
                            <div className="category-item" key={idx}>
                                <div className="category-info">
                                    <strong>{cat.category}</strong>
                                    <span className="category-amount">{cat.amount} ({cat.percentage}%)</span>
                                </div>
                                <div className="progress-track">
                                    <div 
                                        className={`progress-fill ${cat.color}`} 
                                        style={{ width: `${cat.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Vendors Table */}
                <div className="table-container">
                    <div className="section-header">
                        <h2>Top Vendors by Spend</h2>
                    </div>
                    <div className="table-wrapper">
                        <table className="compact-table">
                            <thead>
                                <tr>
                                    <th>Vendor</th>
                                    <th className="text-right">Spend ($)</th>
                                    <th className="text-center">POs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topVendors.map((vendor, idx) => (
                                    <tr key={idx}>
                                        <td><strong>{vendor.name}</strong></td>
                                        <td className="text-right">{vendor.spend}</td>
                                        <td className="text-center">{vendor.pos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Bottom Section: Monthly Trend Chart */}
            <section className="analytics-container animate-slide-up" style={{ animationDelay: '0.3s', marginTop: '24px' }}>
                <h2>Monthly Procurement Trend (2026)</h2>
                <div className="chart-placeholder" style={{ height: '260px' }}>
                    <div className="bar-chart full-width-chart">
                        {monthlyTrend.map((data, idx) => (
                            <div className="bar-group" key={idx}>
                                <div className="bar" style={{ height: data.height, animationDelay: `${idx * 0.1}s` }}>
                                    <div className="bar-tooltip">{data.height}</div>
                                </div>
                                <span className="bar-label">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}