# VendorBridge 🌉
**Odoo KSV Gandhinagar Hackathon - Virtual Round Submission 2026**

VendorBridge is a centralized, full-stack Procurement ERP platform designed to seamlessly manage vendors, automate Requests for Quotations (RFQs), compare bids, and generate official Purchase Orders and Invoices. Built with a focus on workflow automation and clear audit trails, VendorBridge simplifies the complexities of B2B supply chain operations.

---

## 🎯 Core Features

* **Vendor Management:** Register suppliers, track compliance statuses, and auto-generate portal credentials.
* **Smart RFQ System:** Initiate detailed procurement requests and selectively invite connected vendors.
* **Quotation Comparison:** Receive vendor bids and visually compare pricing, delivery times, and terms side-by-side.
* **Approval Workflows:** Multi-step approval timelines that automatically reject competing bids upon selecting a winner.
* **Automated Documents:** Instant generation of standardized Purchase Orders and Tax Invoices based on approved quotations.
* **Audit & Activity Logs:** Comprehensive system timeline tracking user actions, alerts, and status changes.
* **Analytics Dashboard:** Real-time metrics tracking YTD spend, category distribution, and top-performing vendors with CSV export capabilities.

---

## 🛠️ Technology Stack

**Frontend Architecture**
* React 19 
* Vite (Build Tool)
* TailwindCSS (Styling)
* Axios (API Client)
* Zod (Form Validation)

**Backend Architecture**
* Python 3
* Flask (REST API Framework)
* Flask-SQLAlchemy (ORM)
* PyJWT (Secure Authentication)

---

## 🚀 Setup & Installation

Follow these steps to run the application locally on your machine.

### 1. Backend Setup (Flask)
Navigate to the server directory, install the Python dependencies, and start the development server.

1. Open your terminal and navigate to the `server` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment (Windows: `venv\Scripts\activate` | Mac/Linux: `source venv/bin/activate`).
4. Install requirements: `pip install -r requirements.txt`
5. Create a `.env` file in the `server` directory with the following variables:
   * `DATABASE_URL=sqlite:///vendorbridge.db`
   * `JWT_SECRET=your_secure_secret_key_here`
6. Run the Flask server: `python app.py` (The API will run on `http://127.0.0.1:5000`).

### 2. Frontend Setup (React)
Open a new terminal window to start the frontend client.

1. Navigate to the `client` directory.
2. Install Node dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open your browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

---

## 📖 Recommended Testing Workflow for Judges

To experience the full capabilities of the VendorBridge platform, we recommend testing the system in the following order:

1. **Register & Login:** Create an account with the role of "Admin" or "Manager".
2. **Onboard a Vendor:** Navigate to the "Vendors" tab and click "+ Add Vendor" to create a supplier profile.
3. **Create an RFQ:** Go to the "RFQs" tab, create a new request, and select your newly created vendor to invite.
4. **Submit a Quotation:** Navigate to the "Quotations" tab and submit a bid against the open RFQ.
5. **Compare & Approve:** Go to "Quotations" -> "Compare Quotes", or navigate to the "Approvals" tab to accept the winning bid.
6. **Review Documents:** Check the "Purchase Orders" tab to see the auto-generated PO. Click "Generate Invoice" to create the final billing document.
7. **View Analytics:** Return to the "Dashboard" and "Reports" tabs to see your simulated spending metrics update in real-time.

---

## 💡 Relevance to Odoo Hackathon

VendorBridge embodies the core philosophy of Odoo by replacing fragmented business processes with a unified, intuitive application. By tightly coupling vendor management, bidding, and accounting (invoicing) into a single continuous pipeline, this platform demonstrates a practical, scalable approach to enterprise resource planning.
