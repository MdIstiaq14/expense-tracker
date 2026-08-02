# Modern Full-Stack Expense Tracker

A beautiful, premium full-stack wealth management dashboard and registry system built with Node.js, Express, MongoDB, React, Tailwind CSS, and Recharts.

---

## Technical Stack

- **Backend**: Node.js & Express.js with Mongoose models
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS (v3) with class-based custom Dark Mode configuration
- **Charts**: Recharts (Interactive Line, Donut, and Bar charts)
- **Database**: MongoDB (Local or Atlas)
- **HTTP Client**: Axios
- **Icons**: React Icons (Lucide/Feather styles)
- **Toasts**: React Hot Toast

---

## Features

1. **Analytical Dashboard**:
   - Outflow summaries: Total Outflow, Current Month Spending, Current Week Activity, and Cumulative Record Count.
   - Weekly Spending Line Chart, Category Breakdown Donut Chart, and a 6-Month bar chart comparison.
   - Review panel showing the latest 5 transaction records.
2. **Registry Registry & Filters**:
   - Pagination support for long lists.
   - Text search by Title (case-insensitive database regex queries).
   - Dynamic category filter buttons.
   - Sort by latest date, earliest date, highest amount, and lowest amount.
   - Collapsible drawer for advanced filtering by month (YYYY-MM) and explicit start/end dates.
3. **Full CRUD Operations**:
   - Interactive item modal details.
   - Validation-wrapped Add & Edit forms (rejects negative numbers, requires title, date, and category).
   - Double-check confirmation modal before database deletes.
4. **Data Portability**:
   - Export all database records to a formatted `.csv` sheet.
   - Import transactions by uploading `.csv` tables.
5. **Theme Support**:
   - Real-time dark mode theme selection stored in LocalStorage.

---

## Folder Structure

```text
expense_tracker/
│
├── backend/                  # Node.js + Express API Backend
│   ├── config/               # Database connection scripts
│   ├── controllers/          # Business logic controllers
│   ├── models/               # Mongoose MongoDB Schemas
│   ├── routes/               # API Router maps
│   ├── scripts/              # DB Seeding utilities
│   ├── .env                  # Port & Connection settings
│   └── package.json          # Node dependencies
│
├── src/                      # Vite + React Frontend
│   ├── assets/               # Public assets
│   ├── components/           # Navigation & Chart items
│   ├── context/              # State & theme contexts
│   ├── layouts/              # Screen containers
│   ├── pages/                # Main dashboard screens
│   ├── services/             # Axios REST client routes
│   ├── App.jsx               # Navigation route definitions
│   └── main.jsx              # React entry point
│
├── README.md                 # Running instructions
├── package.json              # Frontend dependencies
├── tailwind.config.js        # Style parameters
├── postcss.config.js         # CSS compiler variables
└── index.html                # Main index container
```

---

## Installation & Setup Instructions

### Prerequisites
Make sure you have **Node.js** and **MongoDB** installed on your system.

### 1. Database Configuration (Backend)
Navigate to the `backend/` directory:
```bash
cd backend
```
Install backend dependencies:
```bash
npm install
```
Review the `.env` settings. The default configuration connects to a local database:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
NODE_ENV=development
```
If you are using MongoDB Atlas, replace the `MONGODB_URI` string with your Atlas connection string.

### 2. Seed Database (Optional)
To test the graphs and charts with realistic historical and weekly data, run the seeding script:
```bash
npm run seed
```
*This command clears existing records and inserts 25+ structured transactions spanning current/past weeks and months.*

### 3. Start Backend Server
Run the Express server in development hot-reload mode:
```bash
npm run dev
```
The API server will listen on [http://localhost:5000](http://localhost:5000).

### 4. Setup React Client (Frontend)
Open a new terminal window in the root directory (`expense_tracker/`):
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
The frontend application will boot up at [http://localhost:5173](http://localhost:5173). The Vite configurations are pre-mapped to proxy `/api` endpoints automatically to the backend server.
