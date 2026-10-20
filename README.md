# AttendancePro — Modern Student Attendance Management System

A modern, responsive, high-performance **Student Attendance Management System** built with **React 18**, **Lucide Icons**, and **Python Flask 3.0**.

This project provides an ultra-modern, user-friendly academic attendance portal featuring live statistics, one-click attendance marking, instant roster filtering, dynamic 75% examination eligibility calculators, CSV exports, and printable academic ledgers.

---

## Modern UI & UX Highlights (React Frontend)

1. **Modern Responsive Design System**
   - Palette: Deep Academic Navy (`#0F172A`), Slate Blue (`#2563EB`), Emerald Green (`#10B981`), Crimson Red (`#EF4444`).
   - Clean sidebar navigation with active indicator, live date/time clock, and quick-action shortcuts.
   - Micro-interactions, smooth hover elevations, glassmorphism cards, and animated toast notifications.

2. **Executive Analytics Dashboard**
   - **Interactive KPI Metric Cards:** Total Students card includes a dynamic **Department Filter Dropdown** to view overall or class-specific counts instantly.
   - **Live Attendance Counters:** Present Today, Absent Today, and Turnout percentage.
   - **Examination Eligibility Gauge:** Visual progress bar dividing cohort into *Eligible* ($\ge 75\%$) and *Defaulters* ($< 75\%$).
   - **Department Distribution:** Real-time breakdown of student enrollments with direct shortcut to manage departments.
   - **Recent Lecture Sessions:** Quick review of latest verified attendance records.

3. **Academic Department Management**
   - Full CRUD capability to add, edit, and safely manage academic faculties.
   - Record Department Name, Code (e.g. `CSE`, `IT`, `MECH`), Head of Department (HOD), and scope.
   - Live enrollment badges showing student allocation per department.
   - One-click **"Students"** button to jump directly to the class roster filtered by that department.
   - Delete protection safeguards preventing deletion of departments with active enrolled students.

4. **Tactile Daily Attendance Marking Sheet**
   - Interactive calendar date picker with **"Today"**, **"Prev Day"**, and **"Next Day"** shortcuts.
   - **One-Click Batch Actions:** **"Mark All Present"** and **"Mark All Absent"** buttons.
   - **Tactile Toggle Buttons:** High-visibility Present (Green) / Absent (Red) pills with instant local state updates.
   - **Live Sheet Filter:** Search-as-you-type filter to locate any student on the attendance sheet instantly.
   - **Real-Time Turnout Counter:** Sticky save bar showing live Present vs Absent counts before saving.

5. **Student Roster Management**
   - Clean directory with student avatars, roll number badges, semester, email, and phone details.
   - Department filter tabs + instant global search.
   - Modal forms for **Registering New Students**, **Editing Details**, and **Deleting Records** with confirmation safeguards.
   - Automatic unique Roll Number conflict prevention.

6. **Reports & Defaulter Audits**
   - Mathematical percentage computation down to two decimal places:
     $$\text{Attendance \%} = \left(\frac{\text{Sessions Attended}}{\text{Total Sessions Held}}\right) \times 100$$
   - Automatic `< 75%` **Defaulter Warning Badges** with alert icons.
   - Filter ledger by Department or Status (*Defaulters Only* / *Eligible Only*).
   - **Export to CSV:** Instant download of `attendance_summary_report.csv`.
   - **Print-Ready Academic Ledger:** Dedicated `@media print` styling that formats clean paper sheets for faculty.

---

## Technology Stack

- **Frontend:** React 18, Vite 5, Lucide Icons, Custom CSS Design System
- **Backend:** Python 3, Flask 3.0, Flask-CORS
- **Data Model:** Fast in-memory Python structures with JSON persistence (`data.json`)
- **API Architecture:** RESTful JSON endpoints (`/api/login`, `/api/dashboard`, `/api/students`, `/api/attendance`, `/api/reports`, `/api/search`)

---

## Quick Start & Execution Guide

### Option A: Run Full-Stack via Flask (Recommended)

1. Open your terminal in the project directory:
   ```bash
   cd d:\VsCode\Student-Attendance-Management
   ```

2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```

3. Launch the application:
   ```bash
   python app.py
   ```

4. Open your browser at:
   **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

5. Log in with demo credentials:
   - **Username:** `admin`
   - **Password:** `password123`

---

### Option B: Frontend Development Mode (Vite Hot-Reload)

If you wish to edit the React frontend with instant hot-reloading:

1. In Terminal 1, run the Flask API:
   ```bash
   cd d:\VsCode\Student-Attendance-Management
   python app.py
   ```

2. In Terminal 2, launch Vite dev server:
   ```bash
   cd d:\VsCode\Student-Attendance-Management\frontend
   npm run dev
   ```

3. Open **`http://localhost:5173`** (Vite proxies all API requests to Flask on port 5000).

4. To rebuild the production bundle anytime:
   ```bash
   cd d:\VsCode\Student-Attendance-Management\frontend
   npm run build
   ```

---

## Project Structure

```
d:\VsCode\Student-Attendance-Management\
├── app.py                      # Flask backend controller & REST API
├── data.json                   # In-memory prototype data persistence
├── requirements.txt            # Python dependencies (Flask, Flask-CORS)
├── README.md                   # Documentation
│
├── frontend/                   # Modern React Application
│   ├── package.json            # React, Lucide-react, Vite dependencies
│   ├── vite.config.js          # Vite config with React plugin and /api proxy
│   ├── index.html              # HTML5 root with Google Inter font
│   ├── dist/                   # Production build served directly by Flask
│   │   ├── index.html
│   │   └── assets/
│   └── src/
│       ├── main.jsx            # React root mount
│       ├── App.jsx             # All views: Dashboard, Attendance, Students, Reports, Search
│       └── index.css           # Modern Academic Design System styling
│
├── static/                     # Legacy SSR static assets (preserved)
└── templates/                  # Legacy SSR Jinja2 templates (preserved)
```

---

Developed for **Web Development Internship** &bull; Growfinix &bull; SRMIST Ramapuram
