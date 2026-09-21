# Automated Raw Material Requirement Agent
> **Subject**: Agentic AI | Manufacturing Supply Chain Planning Assistant  
> **Project Type**: College Presentation & Viva Demonstration System

---

## 1. Project Overview

The **Automated Raw Material Requirement Agent** is a full-stack Agentic AI application designed for small-to-medium manufacturing businesses. Rather than acting as a static calculator, the system functions as an autonomous reasoning agent that:
- Receives production requirements (product, batch quantity, deadline).
- Reads and parses the Bill of Materials (BOM).
- Audits warehouse stock levels across physical storage bays.
- Enforces strict safety stock reserve buffers.
- Identifies critical raw material shortages.
- Formulates procurement orders with estimated cost breakdowns.
- Generates a natural-language executive report and auditable decision log.

---

## 2. Agentic AI vs. Static Calculator (Key Viva Concept)

| Dimension | Static Calculator | Automated AI Agent |
| :--- | :--- | :--- |
| **Logic Model** | Hardcoded formula (`Qty × Unit`) | Multi-step perception-action-reasoning loop |
| **Context Awareness** | Ignores safety buffers and warehouse state | Queries live SQLite database across inventory bays |
| **Tool Calling** | None | Dynamically calls BOM Analyzer, Inventory Auditor, and Shortage Detectors |
| **Transparency** | Black-box single result | 18+ step Chain-of-Thought **Agent Decision Log** |
| **Output** | Raw number | Executive procurement strategy with urgency & narrative |

---

## 3. Agent Architecture & Reasoning Pipeline

```
 USER INPUT (Product & Batch Quantity)
      ↓
 PLANNING AGENT (Deconstructs task into sub-goals)
      ↓
 BOM ANALYZER (Retrieves component recipe ratios from SQLite)
      ↓
 INVENTORY CHECKER (Audits current stock & reserves safety buffers)
      ↓
 REQUIREMENT CALCULATOR (Total Required = Production Qty × Ratio)
      ↓
 SHORTAGE DETECTOR (Usable = Stock - Safety; Shortage = max(0, Req - Usable))
      ↓
 PROCUREMENT RECOMMENDER (Batches supplier purchase orders & estimates costs)
      ↓
 FINAL SYNTHESIS REPORT (Executive brief via OpenAI GPT-4 or Deterministic Agent)
```

---

## 4. Benchmark Presentation Scenario (Office Chair Demo)

- **Product**: Office Chair
- **Production Quantity**: 500 units

| Raw Material | BOM Ratio | Total Required | Current Stock | Safety Stock | Available Usable | Shortage Deficit | Recommended Purchase | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Steel** | 2.0 kg | 1,000 kg | 700 kg | 100 kg | 600 kg | 400 kg | **+400 kg** | `Shortage` |
| **Plastic** | 1.5 kg | 750 kg | 900 kg | 100 kg | 800 kg | 0 kg | **0 kg** | `Sufficient` |
| **Foam** | 0.8 kg | 400 kg | 300 kg | 100 kg | 200 kg | 200 kg | **+200 kg** | `Shortage` |
| **Fabric** | 1.2 m | 600 m | 700 m | 100 m | 600 m | 0 m | **0 m** | `Sufficient` |

**Financial Synthesis**:
- Steel Purchase: 400 kg × $2.80/kg = $1,120.00
- Foam Purchase: 200 kg × $3.50/kg = $700.00
- **Total Estimated Procurement**: **$1,820.00**

---

## 5. Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React icons, Recharts
- **Backend**: Node.js, Express.js (REST API)
- **Database**: SQLite (Node.js native `node:sqlite` engine — zero external C++ build tools required)
- **AI Engine**: Dual-agent architecture (OpenAI GPT-4o-mini + autonomous deterministic rule-based agent fallback)

---

## 6. Directory Structure

```
ca3_agentic_ai/
├── backend/
│   ├── agent/
│   │   └── planningAgent.js       # 7-step Agent reasoning engine & decision log
│   ├── database.js               # SQLite schema & benchmark seeding
│   ├── server.js                 # Express API server & routes
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Local environment configuration
│   └── .env.example              # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top header with "AI Agent Online" badge
│   │   │   ├── Sidebar.jsx       # SaaS sidebar navigation
│   │   │   ├── Dashboard.jsx     # Metrics, BOM, animated workflow, charts
│   │   │   ├── OrdersView.jsx    # Production order manager
│   │   │   ├── BOMView.jsx       # Component recipe explorer
│   │   │   ├── InventoryView.jsx # Live stock editor & safety stock tracker
│   │   │   ├── AgentRunsView.jsx # Persistent agent execution history
│   │   │   ├── ArchitectureView.jsx # Agent pipeline & viva defense Q&A
│   │   │   └── ReportModal.jsx   # Printable procurement intelligence report
│   │   ├── App.jsx               # Root application coordinator
│   │   ├── main.jsx              # React root entry
│   │   └── index.css             # Tailwind styling & print layouts
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite config with /api proxying
│   └── tailwind.config.js        # Tailwind theme tokens
└── README.md                     # Comprehensive documentation & viva guide
```

---

## 7. Setup & Execution Instructions

### Prerequisites
- Node.js (v18+ recommended; tested on v24)
- npm (v9+)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Run the Backend Server
```bash
cd ../backend
npm start
```
*Backend starts on `http://localhost:5000` with connected SQLite database.*

### Step 4: Run the Frontend Dev Server
In a separate terminal window:
```bash
cd frontend
npm run dev
```
*Frontend opens at `http://localhost:3000`.*

---

## 8. OpenAI API Configuration (Optional)

The application includes an **Autonomous Deterministic Agent** that works 100% offline out-of-the-box without requiring any API keys.

If you wish to demonstrate OpenAI LLM intelligence during your presentation:
1. Open `backend/.env`.
2. Insert your OpenAI API key:
   ```env
   PORT=5000
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. Restart the backend (`npm start`).
4. The system will automatically detect the key and switch from deterministic synthesis to GPT-4o-mini generation while preserving all mathematical verifications.

---

## 9. 1-Click Free Cloud Deployment (Render.com)

The project is pre-configured with a **single-service fullstack setup** and a **`render.yaml` Blueprint** to run 100% free on Render.

### Option A: Automatic Blueprint (Easiest)
1. Push your repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Configure production deployment"
   git push origin main
   ```
2. Log into [Render.com](https://render.com) (free account).
3. Click **New +** in the top navigation and select **Blueprint**.
4. Connect your GitHub repository `AUTOMATED-RAW-MATERIAL-REQUIREMENT-AGENT`.
5. Render reads `render.yaml` automatically:
   - **Build Command**: `npm run build` (builds both frontend and backend)
   - **Start Command**: `npm start`
   - **Node Version**: `22.14.0` (required for built-in SQLite)
6. Click **Apply**. Your app will build and deploy on a free live HTTPS URL (e.g., `https://raw-material-agent.onrender.com`).

### Option B: Manual Web Service on Render
If creating manually instead of Blueprint:
1. Go to Render Dashboard -> **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name**: `raw-material-agent`
   - **Environment / Runtime**: `Node`
   - **Region**: Any (e.g., Oregon or Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_VERSION` = `22.14.0`
   - `OPENAI_API_KEY` = *(Optional: paste your OpenAI key, or leave blank to use the autonomous agent)*
5. Click **Create Web Service**.

### Alternative Free Hosting Platforms
- **Railway.app**: Connect repo, set build command to `npm run build` and start command to `npm start`. Add environment variable `NODE_VERSION=22.14.0`.
- **Koyeb**: Connect GitHub, select Node runtime, set build command to `npm run build` and start command to `npm start`.
