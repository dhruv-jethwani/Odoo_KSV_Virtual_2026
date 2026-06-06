import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Reports() {
    const [reportData, setReportData] = useState({
        stats: [],
        categorySpend: [],
        topVendors: [],
        monthlyTrend: []
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/report/')
            setReportData(response.data)
        } catch (error) {
            console.error("Error fetching reports:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    // ==========================================
    // EXPORT TO CSV FUNCTIONALITY
    // ==========================================
    const handleExportCSV = () => {
        let csvLines = [];

        // 1. Title
        csvLines.push("PROCUREMENT DASHBOARD REPORT");
        csvLines.push(`Generated on: ${new Date().toLocaleDateString()}`);
        csvLines.push("");

        // 2. Stats Section
        csvLines.push("--- KEY METRICS ---");
        csvLines.push("Metric,Value,Details");
        reportData.stats.forEach(stat => {
            // Strip commas from values (like $1,000) to avoid breaking CSV format
            const cleanValue = stat.value.replace(/,/g, ''); 
            csvLines.push(`"${stat.label}","${cleanValue}","${stat.subtext}"`);
        });
        csvLines.push("");

        // 3. Category Spend Section
        csvLines.push("--- SPEND BY CATEGORY ---");
        csvLines.push("Category,Total Amount,Percentage");
        reportData.categorySpend.forEach(cat => {
            const cleanAmount = cat.amount.replace(/,/g, '');
            csvLines.push(`"${cat.category}","${cleanAmount}","${cat.percentage}%"`);
        });
        csvLines.push("");

        // 4. Top Vendors Section
        csvLines.push("--- TOP VENDORS ---");
        csvLines.push("Vendor Name,Total Spend,PO Count");
        reportData.topVendors.forEach(vendor => {
            const cleanSpend = vendor.spend.replace(/,/g, '');
            csvLines.push(`"${vendor.name}","${cleanSpend}","${vendor.pos}"`);
        });
        csvLines.push("");

        // 5. Monthly Trend Section
        csvLines.push("--- MONTHLY TREND ---");
        csvLines.push("Month,Spend Amount");
        reportData.monthlyTrend.forEach(trend => {
            csvLines.push(`"${trend.month}","${trend.raw}"`);
        });

        // Compile and Download
        const csvString = csvLines.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Procurement_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="animate-fade-in dashboard-header">
                <h1>Loading Reports...</h1>
                <p>Crunching your procurement data.</p>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <header className="dashboard-header flex-between">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Procurement insights, spending trends, and vendor performance.</p>
                </div>
                <div className="action-group">
                    {/* Hooked up the Export CSV function here */}
                    <button className="btn-secondary" onClick={handleExportCSV}>
                        📄 Export as CSV
                    </button>
                    <button className="btn-secondary" onClick={() => window.print()}>
                        🖨️ Print View
                    </button>
                </div>
            </header>

            {/* Top Stats Array */}
            <section className="stats-grid">
                {reportData.stats.map((stat, index) => (
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
                        {reportData.categorySpend.map((cat, idx) => (
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
                                {reportData.topVendors.map((vendor, idx) => (
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
                        {reportData.monthlyTrend.map((data, idx) => (
                            <div className="bar-group" key={idx}>
                                <div className="bar" style={{ height: data.height, animationDelay: `${idx * 0.1}s` }}>
                                    <div className="bar-tooltip" style={{ minWidth: 'max-content' }}>
                                        ${(data.raw || 0).toLocaleString()}
                                    </div>
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