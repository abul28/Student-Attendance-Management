import os
import json
from datetime import datetime, date
from functools import wraps
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify, Response, send_from_directory
)
from flask_cors import CORS

# Configure Flask app with static folder pointing to React dist if built
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

app = Flask(
    __name__,
    static_folder=FRONTEND_DIST if os.path.exists(FRONTEND_DIST) else os.path.join(BASE_DIR, "static"),
    static_url_path="/" if os.path.exists(FRONTEND_DIST) else "/static"
)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "student_attendance_management_secret_key_2026")

# Enable CORS for all routes (supporting Vite dev server on :5173 or any port)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"])

# Administrative Configuration
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "password123"
ATTENDANCE_THRESHOLD = 75.00  # Percentage required for exam eligibility
DATA_FILE = os.path.join(BASE_DIR, "data.json")

# ------------------------------------------------------------------------------
# In-Memory Initial Seed Data (Structured Python Collections)
# ------------------------------------------------------------------------------
DEFAULT_STUDENTS = [
    {
        "id": 1,
        "roll_no": "CS-2026-001",
        "name": "Aarav Sharma",
        "department": "Computer Science",
        "semester": "Semester V",
        "email": "aarav.sharma@college.edu",
        "contact": "+91 98765 43210"
    },
    {
        "id": 2,
        "roll_no": "CS-2026-002",
        "name": "Bhavna Patel",
        "department": "Computer Science",
        "semester": "Semester V",
        "email": "bhavna.patel@college.edu",
        "contact": "+91 98765 43211"
    },
    {
        "id": 3,
        "roll_no": "CS-2026-003",
        "name": "Dinesh Kumar",
        "department": "Computer Science",
        "semester": "Semester V",
        "email": "dinesh.k@college.edu",
        "contact": "+91 98765 43212"
    },
    {
        "id": 4,
        "roll_no": "CS-2026-004",
        "name": "Fatima Zahra",
        "department": "Computer Science",
        "semester": "Semester V",
        "email": "fatima.z@college.edu",
        "contact": "+91 98765 43213"
    },
    {
        "id": 5,
        "roll_no": "CS-2026-005",
        "name": "Gokul Nath",
        "department": "Computer Science",
        "semester": "Semester V",
        "email": "gokul.n@college.edu",
        "contact": "+91 98765 43214"
    },
    {
        "id": 6,
        "roll_no": "IT-2026-001",
        "name": "Harini Venkat",
        "department": "Information Technology",
        "semester": "Semester V",
        "email": "harini.v@college.edu",
        "contact": "+91 98765 43215"
    },
    {
        "id": 7,
        "roll_no": "IT-2026-002",
        "name": "Ishaan Roy",
        "department": "Information Technology",
        "semester": "Semester V",
        "email": "ishaan.roy@college.edu",
        "contact": "+91 98765 43216"
    },
    {
        "id": 8,
        "roll_no": "AD-2026-001",
        "name": "Kavya Nair",
        "department": "AI & Data Science",
        "semester": "Semester V",
        "email": "kavya.nair@college.edu",
        "contact": "+91 98765 43217"
    },
    {
        "id": 9,
        "roll_no": "AD-2026-002",
        "name": "Mohamed Rizwan",
        "department": "AI & Data Science",
        "semester": "Semester V",
        "email": "m.rizwan@college.edu",
        "contact": "+91 98765 43218"
    },
    {
        "id": 10,
        "roll_no": "CS-2026-006",
        "name": "Pooja Sundaram",
        "department": "Computer Science",
        "semester": "Semester V",
        "email": "pooja.s@college.edu",
        "contact": "+91 98765 43219"
    }
]

# Attendance Store Mapping: { "YYYY-MM-DD": { roll_no: "Present" / "Absent" } }
DEFAULT_ATTENDANCE = {
    "2026-10-14": {
        "CS-2026-001": "Present", "CS-2026-002": "Present", "CS-2026-003": "Absent",
        "CS-2026-004": "Present", "CS-2026-005": "Present", "IT-2026-001": "Absent",
        "IT-2026-002": "Present", "AD-2026-001": "Present", "AD-2026-002": "Present",
        "CS-2026-006": "Present"
    },
    "2026-10-15": {
        "CS-2026-001": "Present", "CS-2026-002": "Present", "CS-2026-003": "Absent",
        "CS-2026-004": "Present", "CS-2026-005": "Absent",  "IT-2026-001": "Absent",
        "IT-2026-002": "Present", "AD-2026-001": "Present", "AD-2026-002": "Present",
        "CS-2026-006": "Absent"
    },
    "2026-10-16": {
        "CS-2026-001": "Present", "CS-2026-002": "Present", "CS-2026-003": "Present",
        "CS-2026-004": "Present", "CS-2026-005": "Present", "IT-2026-001": "Absent",
        "IT-2026-002": "Present", "AD-2026-001": "Present", "AD-2026-002": "Present",
        "CS-2026-006": "Present"
    },
    "2026-10-17": {
        "CS-2026-001": "Present", "CS-2026-002": "Present", "CS-2026-003": "Absent",
        "CS-2026-004": "Present", "CS-2026-005": "Present", "IT-2026-001": "Absent",
        "IT-2026-002": "Present", "AD-2026-001": "Present", "AD-2026-002": "Absent",
        "CS-2026-006": "Present"
    },
    "2026-10-20": {
        "CS-2026-001": "Present", "CS-2026-002": "Present", "CS-2026-003": "Absent",
        "CS-2026-004": "Present", "CS-2026-005": "Present", "IT-2026-001": "Absent",
        "IT-2026-002": "Present", "AD-2026-001": "Present", "AD-2026-002": "Present",
        "CS-2026-006": "Present"
    }
}

DEFAULT_DEPARTMENTS = [
    {
        "id": 1,
        "name": "Computer Science",
        "code": "CSE",
        "hod": "Dr. R. Rajesh",
        "description": "Department of Computer Science & Engineering"
    },
    {
        "id": 2,
        "name": "Information Technology",
        "code": "IT",
        "hod": "Dr. S. Priya",
        "description": "Department of Information Technology"
    },
    {
        "id": 3,
        "name": "AI & Data Science",
        "code": "AIDS",
        "hod": "Dr. K. Anand",
        "description": "Artificial Intelligence & Data Science Department"
    }
]

# Active In-Memory Store
students_store = list(DEFAULT_STUDENTS)
attendance_store = dict(DEFAULT_ATTENDANCE)
departments_store = list(DEFAULT_DEPARTMENTS)

def save_data_to_disk():
    """Saves in-memory state to data.json so prototype edits persist gracefully."""
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "students": students_store,
                "attendance": attendance_store,
                "departments": departments_store
            }, f, indent=2)
    except Exception as e:
        print(f"Warning: could not write to {DATA_FILE}: {e}")

def load_data_from_disk():
    """Loads state from data.json if available on server start."""
    global students_store, attendance_store, departments_store
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                students_store = data.get("students", DEFAULT_STUDENTS)
                attendance_store = data.get("attendance", DEFAULT_ATTENDANCE)
                departments_store = data.get("departments", DEFAULT_DEPARTMENTS)
        except Exception as e:
            print(f"Warning: could not read {DATA_FILE}: {e}")
            students_store = list(DEFAULT_STUDENTS)
            attendance_store = dict(DEFAULT_ATTENDANCE)
            departments_store = list(DEFAULT_DEPARTMENTS)

load_data_from_disk()

def get_all_department_names():
    """Returns sorted list of distinct department names across store and students."""
    names = [d["name"] for d in departments_store]
    for s in students_store:
        dept = s.get("department")
        if dept and dept not in names:
            names.append(dept)
    return sorted(names)

# ------------------------------------------------------------------------------
# Helper Computations
# ------------------------------------------------------------------------------
def compute_student_summary(students=None):
    if students is None:
        students = students_store

    total_sessions = len(attendance_store)
    summary_report = []

    for s in students:
        roll = s["roll_no"]
        present_count = 0
        for session_date, session_log in attendance_store.items():
            if session_log.get(roll) == "Present":
                present_count += 1

        absent_count = total_sessions - present_count
        percentage = round((present_count / total_sessions) * 100.0, 2) if total_sessions > 0 else 0.00
        is_defaulter = (percentage < ATTENDANCE_THRESHOLD) if total_sessions > 0 else False

        summary_report.append({
            "id": s["id"],
            "roll_no": roll,
            "name": s["name"],
            "department": s["department"],
            "semester": s.get("semester", "Semester V"),
            "email": s.get("email", ""),
            "contact": s.get("contact", ""),
            "total_sessions": total_sessions,
            "present_count": present_count,
            "absent_count": absent_count,
            "percentage": percentage,
            "is_defaulter": is_defaulter
        })

    return summary_report, total_sessions

# ------------------------------------------------------------------------------
# REST API Endpoints (For React Frontend)
# ------------------------------------------------------------------------------
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True) or request.form
    user = (data.get("username") or "").strip()
    pwd = (data.get("password") or "").strip()

    if user.lower() == ADMIN_USERNAME.lower() and pwd == ADMIN_PASSWORD:
        session["logged_in"] = True
        session["username"] = user
        return jsonify({
            "success": True,
            "message": "Signed in successfully",
            "user": {"username": user, "role": "Administrator"}
        })
    return jsonify({
        "success": False,
        "message": "Invalid username or password. Default is admin / password123"
    }), 401

@app.route("/api/logout", methods=["POST", "GET"])
def api_logout():
    session.clear()
    return jsonify({"success": True, "message": "Signed out successfully"})

@app.route("/api/me", methods=["GET"])
def api_me():
    if session.get("logged_in"):
        return jsonify({"authenticated": True, "user": {"username": session.get("username", "admin"), "role": "Administrator"}})
    return jsonify({"authenticated": False})

@app.route("/api/stats", methods=["GET"])
def api_stats():
    summaries, total_sessions = compute_student_summary()
    defaulter_count = sum(1 for item in summaries if item["is_defaulter"])
    return jsonify({
        "total_students": len(students_store),
        "defaulters": defaulter_count,
        "total_sessions": total_sessions
    })

@app.route("/api/dashboard", methods=["GET"])
def api_dashboard():
    today_str = date.today().isoformat()
    display_date = today_str if today_str in attendance_store else (
        sorted(attendance_store.keys())[-1] if attendance_store else today_str
    )

    total_students = len(students_store)
    day_records = attendance_store.get(display_date, {})
    present_count = sum(1 for status in day_records.values() if status == "Present")
    absent_count = sum(1 for status in day_records.values() if status == "Absent")
    attendance_rate = round((present_count / len(day_records)) * 100.0, 1) if (total_students > 0 and len(day_records) > 0) else 0.0

    summaries, total_sessions = compute_student_summary()
    defaulter_count = sum(1 for item in summaries if item["is_defaulter"])
    eligible_count = total_students - defaulter_count

    dept_names = get_all_department_names()
    dept_stats = {d: 0 for d in dept_names}
    for s in students_store:
        dept = s.get("department", "Other")
        dept_stats[dept] = dept_stats.get(dept, 0) + 1

    recent_dates = sorted(attendance_store.keys(), reverse=True)[:5]
    recent_activity = []
    for d in recent_dates:
        log = attendance_store[d]
        p_c = sum(1 for v in log.values() if v == "Present")
        a_c = sum(1 for v in log.values() if v == "Absent")
        pct = round((p_c / len(log)) * 100.0, 1) if log else 0.0
        recent_activity.append({
            "date": d,
            "present": p_c,
            "absent": a_c,
            "total": len(log),
            "rate": pct
        })

    return jsonify({
        "total_students": total_students,
        "present_count": present_count,
        "absent_count": absent_count,
        "attendance_rate": attendance_rate,
        "display_date": display_date,
        "today_date": today_str,
        "total_sessions": total_sessions,
        "defaulter_count": defaulter_count,
        "eligible_count": eligible_count,
        "dept_stats": dept_stats,
        "departments": dept_names,
        "recent_activity": recent_activity,
        "threshold": ATTENDANCE_THRESHOLD
    })

@app.route("/api/students", methods=["GET", "POST"])
def api_students():
    global students_store
    if request.method == "POST":
        data = request.get_json(silent=True) or request.form
        roll_no = (data.get("roll_no") or "").strip().upper()
        name = (data.get("name") or "").strip()
        dept = (data.get("department") or "Computer Science").strip()
        sem = (data.get("semester") or "Semester V").strip()
        email = (data.get("email") or f"{roll_no.lower()}@college.edu").strip()
        contact = (data.get("contact") or "+91 98765 00000").strip()

        if not roll_no or not name:
            return jsonify({"success": False, "message": "Roll number and student name are required."}), 400

        if any(s["roll_no"] == roll_no for s in students_store):
            return jsonify({"success": False, "message": f"Conflict: Roll number '{roll_no}' already exists."}), 409

        new_id = (max([s["id"] for s in students_store]) + 1) if students_store else 1
        new_student = {
            "id": new_id,
            "roll_no": roll_no,
            "name": name,
            "department": dept,
            "semester": sem,
            "email": email,
            "contact": contact
        }
        students_store.append(new_student)
        save_data_to_disk()
        return jsonify({"success": True, "message": f"Student '{name}' registered successfully.", "student": new_student}), 201

    # GET
    dept_filter = request.args.get("department", "").strip()
    query = request.args.get("q", "").strip().lower()

    filtered = students_store
    if dept_filter:
        filtered = [s for s in filtered if s.get("department") == dept_filter]
    if query:
        filtered = [
            s for s in filtered
            if query in s["roll_no"].lower()
            or query in s["name"].lower()
            or query in s.get("department", "").lower()
            or query in s.get("email", "").lower()
        ]

    departments = get_all_department_names()
    return jsonify({
        "students": filtered,
        "total_count": len(students_store),
        "filtered_count": len(filtered),
        "departments": departments
    })

@app.route("/api/students/<int:student_id>", methods=["PUT", "DELETE"])
def api_student_detail(student_id):
    global students_store
    student = next((s for s in students_store if s["id"] == student_id), None)
    if not student:
        return jsonify({"success": False, "message": "Student not found."}), 404

    if request.method == "DELETE":
        roll = student["roll_no"]
        students_store = [s for s in students_store if s["id"] != student_id]
        for d in attendance_store:
            if roll in attendance_store[d]:
                del attendance_store[d][roll]
        save_data_to_disk()
        return jsonify({"success": True, "message": f"Student '{student['name']}' deleted."})

    # PUT (Update)
    data = request.get_json(silent=True) or request.form
    if "name" in data and data["name"].strip():
        student["name"] = data["name"].strip()
    if "department" in data and data["department"].strip():
        student["department"] = data["department"].strip()
    if "semester" in data and data["semester"].strip():
        student["semester"] = data["semester"].strip()
    if "email" in data:
        student["email"] = data["email"].strip()
    if "contact" in data:
        student["contact"] = data["contact"].strip()

    save_data_to_disk()
    return jsonify({"success": True, "message": f"Student '{student['name']}' updated.", "student": student})

@app.route("/api/attendance", methods=["GET", "POST"])
def api_attendance():
    today_iso = date.today().isoformat()
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        target_date = (data.get("date") or today_iso).strip()
        records = data.get("records", {})

        if target_date not in attendance_store:
            attendance_store[target_date] = {}

        for roll, status in records.items():
            attendance_store[target_date][roll] = "Present" if status == "Present" else "Absent"

        save_data_to_disk()
        p_c = sum(1 for v in attendance_store[target_date].values() if v == "Present")
        a_c = sum(1 for v in attendance_store[target_date].values() if v == "Absent")
        return jsonify({
            "success": True,
            "message": f"Attendance for {target_date} saved successfully.",
            "present_count": p_c,
            "absent_count": a_c,
            "date": target_date
        })

    # GET
    target_date = (request.args.get("date") or today_iso).strip()
    current_log = attendance_store.get(target_date, {})
    departments = get_all_department_names()

    dept_filter = request.args.get("department", "").strip()
    roster = students_store
    if dept_filter:
        roster = [s for s in roster if s.get("department") == dept_filter]

    day_present = sum(1 for r, st in current_log.items() if st == "Present")
    day_absent = sum(1 for r, st in current_log.items() if st == "Absent")

    return jsonify({
        "target_date": target_date,
        "today_iso": today_iso,
        "students": roster,
        "current_log": current_log,
        "departments": departments,
        "day_present": day_present,
        "day_absent": day_absent,
        "has_saved_records": len(current_log) > 0,
        "all_recorded_dates": sorted(list(attendance_store.keys()), reverse=True)
    })

@app.route("/api/reports", methods=["GET"])
def api_reports():
    dept_filter = request.args.get("department", "").strip()
    status_filter = request.args.get("status", "").strip()

    summaries, total_sessions = compute_student_summary()

    if dept_filter:
        summaries = [item for item in summaries if item["department"] == dept_filter]
    if status_filter == "defaulter":
        summaries = [item for item in summaries if item["is_defaulter"]]
    elif status_filter == "eligible":
        summaries = [item for item in summaries if not item["is_defaulter"]]

    departments = get_all_department_names()
    defaulter_count = sum(1 for s in summaries if s["is_defaulter"])
    eligible_count = len(summaries) - defaulter_count

    return jsonify({
        "reports": summaries,
        "total_sessions": total_sessions,
        "threshold": ATTENDANCE_THRESHOLD,
        "departments": departments,
        "defaulter_count": defaulter_count,
        "eligible_count": eligible_count
    })

@app.route("/api/reports/export-csv", methods=["GET"])
def api_export_csv():
    summaries, total_sessions = compute_student_summary()
    csv_lines = [
        "Roll Number,Student Name,Department,Semester,Total Sessions,Present Count,Absent Count,Attendance Percentage,Eligibility Status"
    ]
    for item in summaries:
        status_text = "Defaulter (<75%)" if item["is_defaulter"] else "Eligible"
        csv_lines.append(
            f'"{item["roll_no"]}","{item["name"]}","{item["department"]}","{item["semester"]}",'
            f'{item["total_sessions"]},{item["present_count"]},{item["absent_count"]},'
            f'"{item["percentage"]}%","{status_text}"'
        )
    csv_data = "\n".join(csv_lines)
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=attendance_summary_report.csv"}
    )

@app.route("/api/search", methods=["GET"])
def api_search():
    query = (request.args.get("q") or "").strip().lower()
    selected_roll = (request.args.get("roll") or "").strip().upper()

    search_results = []
    if query:
        search_results = [
            s for s in students_store
            if query in s["roll_no"].lower()
            or query in s["name"].lower()
            or query in s.get("department", "").lower()
        ]
    else:
        search_results = students_store

    student_profile = None
    attendance_history = []
    if selected_roll:
        student_profile = next((s for s in students_store if s["roll_no"] == selected_roll), None)
        if student_profile:
            for session_date in sorted(attendance_store.keys(), reverse=True):
                status = attendance_store[session_date].get(selected_roll, "Unrecorded")
                attendance_history.append({
                    "date": session_date,
                    "status": status
                })

    return jsonify({
        "query": query,
        "results": search_results,
        "student_profile": student_profile,
        "attendance_history": attendance_history
    })

# ------------------------------------------------------------------------------
# Department Management Endpoints
# ------------------------------------------------------------------------------
@app.route("/api/departments", methods=["GET", "POST"])
def api_departments():
    global departments_store
    if request.method == "POST":
        data = request.get_json(silent=True) or request.form
        name = (data.get("name") or "").strip()
        code = (data.get("code") or "").strip().upper()
        hod = (data.get("hod") or "").strip()
        description = (data.get("description") or "").strip()

        if not name:
            return jsonify({"success": False, "message": "Department name is required."}), 400

        if any(d["name"].strip().lower() == name.lower() for d in departments_store):
            return jsonify({"success": False, "message": f"Conflict: Department '{name}' already exists."}), 409

        new_id = (max([d["id"] for d in departments_store]) + 1) if departments_store else 1
        new_dept = {
            "id": new_id,
            "name": name,
            "code": code or name[:4].upper(),
            "hod": hod or "To Be Appointed",
            "description": description or f"Department of {name}"
        }
        departments_store.append(new_dept)
        save_data_to_disk()
        return jsonify({
            "success": True,
            "message": f"Department '{name}' created successfully.",
            "department": new_dept
        }), 201

    # GET
    result = []
    for d in departments_store:
        count = sum(1 for s in students_store if s.get("department") == d["name"])
        result.append({
            "id": d["id"],
            "name": d["name"],
            "code": d.get("code", d["name"][:4].upper()),
            "hod": d.get("hod", "To Be Appointed"),
            "description": d.get("description", ""),
            "student_count": count
        })
    return jsonify({
        "departments": result,
        "total_departments": len(result),
        "total_students": len(students_store)
    })

@app.route("/api/departments/<int:dept_id>", methods=["PUT", "DELETE"])
def api_department_detail(dept_id):
    global departments_store, students_store
    dept = next((d for d in departments_store if d["id"] == dept_id), None)
    if not dept:
        return jsonify({"success": False, "message": "Department not found."}), 404

    if request.method == "DELETE":
        enrolled = sum(1 for s in students_store if s.get("department") == dept["name"])
        if enrolled > 0:
            return jsonify({
                "success": False,
                "message": f"Cannot delete '{dept['name']}': {enrolled} student(s) currently enrolled. Please reassign or update their department first."
            }), 400

        departments_store = [d for d in departments_store if d["id"] != dept_id]
        save_data_to_disk()
        return jsonify({"success": True, "message": f"Department '{dept['name']}' deleted successfully."})

    # PUT
    data = request.get_json(silent=True) or request.form
    old_name = dept["name"]
    new_name = (data.get("name") or "").strip()

    if new_name and new_name != old_name:
        if any(d["name"].strip().lower() == new_name.lower() and d["id"] != dept_id for d in departments_store):
            return jsonify({"success": False, "message": f"Conflict: Department name '{new_name}' already exists."}), 409
        # Update any students assigned to the old department name
        for s in students_store:
            if s.get("department") == old_name:
                s["department"] = new_name
        dept["name"] = new_name

    if "code" in data:
        dept["code"] = (data.get("code") or "").strip().upper()
    if "hod" in data:
        dept["hod"] = (data.get("hod") or "").strip()
    if "description" in data:
        dept["description"] = (data.get("description") or "").strip()

    save_data_to_disk()
    return jsonify({"success": True, "message": f"Department '{dept['name']}' updated successfully.", "department": dept})

@app.route("/api/reset-data", methods=["POST"])
def api_reset_data():
    global students_store, attendance_store, departments_store
    students_store = list(DEFAULT_STUDENTS)
    attendance_store = dict(DEFAULT_ATTENDANCE)
    departments_store = list(DEFAULT_DEPARTMENTS)
    save_data_to_disk()
    return jsonify({"success": True, "message": "In-memory dataset reset to initial academic seed state."})

# ------------------------------------------------------------------------------
# Serve React Frontend (Single Page Application SPA)
# ------------------------------------------------------------------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    # If React dist exists, serve index.html or requested static file
    if os.path.exists(FRONTEND_DIST):
        file_path = os.path.join(FRONTEND_DIST, path)
        if path != "" and os.path.exists(file_path):
            return send_from_directory(FRONTEND_DIST, path)
        return send_from_directory(FRONTEND_DIST, "index.html")

    # Fallback to SSR templates if dist has not been built yet
    if session.get("logged_in"):
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
