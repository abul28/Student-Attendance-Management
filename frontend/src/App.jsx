import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CalendarCheck,
  BarChart3,
  Search,
  Plus,
  Pencil,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogOut,
  Clock,
  Building,
  ShieldCheck,
  ChevronRight,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Calendar,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalLoading, setGlobalLoading] = useState(true);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('');

  // Quick live badge counts for sidebar
  const [sidebarStats, setSidebarStats] = useState({ totalStudents: 10, defaulters: 2 });

  // Toast System
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Check initial login session
  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(data.user);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setGlobalLoading(false));

    // Fetch stats for sidebar badge
    fetch('/api/stats')
      .then((res) => res.json())
      .then((d) => {
        setSidebarStats({
          totalStudents: d.total_students || 10,
          defaulters: d.defaulters || 2
        });
      })
      .catch(() => {});
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${user.username}! Signed in successfully.`, 'success');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {}
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Signed out safely.', 'info');
  };

  if (globalLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18181B', color: '#FFF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #0078D4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }}></div>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em' }}>Loading Attendance Management System...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification Stack */}
      <div className="toast-container no-print">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={16} color="#10B981" />}
            {t.type === 'error' && <XCircle size={16} color="#EF4444" />}
            {t.type === 'info' && <AlertTriangle size={16} color="#0078D4" />}
            <span style={{ fontSize: '0.82rem', fontWeight: 500, flexGrow: 1 }}>{t.message}</span>
          </div>
        ))}
      </div>

      {!isAuthenticated ? (
        <LoginView onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      ) : (
        <>
          {/* Dark Matte Sidebar (Styling matched to Reference Screenshot) */}
          <aside className="sidebar no-print">
            {/* Top Brand Header */}
            <div className="sidebar-header">
              <div className="brand-icon-box">
                A
              </div>
              <div className="brand-text">
                <h1>AttendancePro</h1>
                <span>Student Management</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="nav-item-icon">🏠</span>
                <span>Dashboard</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDepartmentFilter('');
                  setActiveTab('students');
                }}
              >
                <span className="nav-item-icon">👥</span>
                <span>Students</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'departments' ? 'active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                <span className="nav-item-icon">🏛️</span>
                <span>Departments</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <span className="nav-item-icon">📅</span>
                <span>Attendance</span>
              </button>

              <button
                className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <span className="nav-item-icon">📊</span>
                <span>Reports</span>
                <span className="nav-badge-pill" title={`${sidebarStats.defaulters} Defaulters (<75%)`}>
                  {sidebarStats.defaulters > 0 ? sidebarStats.defaulters : sidebarStats.totalStudents}
                </span>
              </button>
            </nav>

            {/* Footer with User & Sign Out */}
            <div className="sidebar-footer">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0078D4', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>
                    {currentUser?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#FFF', lineHeight: 1.2 }}>{currentUser?.username || 'Admin'}</div>
                    <div style={{ fontSize: '0.66rem', color: '#8E8E93' }}>{currentUser?.role || 'Administrator'}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ background: 'transparent', border: 'none', color: '#8E8E93', cursor: 'pointer', padding: '4px' }}
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Layout Area */}
          <div className="main-wrapper">
            {/* Top Bar Header */}
            <header className="top-header no-print">
              <div className="page-title">
                <h2>
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'students' && 'Student Management'}
                  {activeTab === 'departments' && 'Department Management'}
                  {activeTab === 'attendance' && 'Daily Attendance Marking'}
                  {activeTab === 'reports' && 'Attendance Reports & Eligibility Audit'}
                </h2>
                <p>
                  SRMIST Ramapuram &bull; Department of Computer Science &bull; Growfinix Web Development
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F1F5F9', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.76rem', color: '#475569', fontWeight: 500 }}>
                  <Clock size={13} color="#0078D4" />
                  <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {activeTab === 'departments' ? (
                  <button
                    onClick={() => {
                      const btn = document.getElementById('btn-open-add-dept');
                      if (btn) btn.click();
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Add Department</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Take Attendance</span>
                  </button>
                )}
              </div>
            </header>

            {/* View Content Area */}
            <div className="content-area">
              {activeTab === 'dashboard' && (
                <DashboardView setActiveTab={setActiveTab} showToast={showToast} />
              )}
              {activeTab === 'attendance' && (
                <AttendanceView showToast={showToast} />
              )}
              {activeTab === 'students' && (
                <StudentsView
                  showToast={showToast}
                  initialDeptFilter={selectedDepartmentFilter}
                />
              )}
              {activeTab === 'departments' && (
                <DepartmentsView
                  setActiveTab={setActiveTab}
                  onSelectDepartment={(dept) => {
                    setSelectedDepartmentFilter(dept);
                    setActiveTab('students');
                  }}
                  showToast={showToast}
                />
              )}
              {activeTab === 'reports' && (
                <ReportsView showToast={showToast} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==============================================================================
// 1. LOGIN VIEW
// ==============================================================================
function LoginView({ onLoginSuccess, showToast }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        showToast(data.message || 'Invalid credentials.', 'error');
      }
    } catch (err) {
      showToast('Could not reach backend server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #1E1E24 0%, #111113 100%)', padding: '1.25rem' }}>
      <div style={{ width: '100%', maxWidth: '380px', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.45)', overflow: 'hidden' }}>
        <div style={{ background: '#19191C', padding: '1.75rem 1.5rem', textAlign: 'center', color: '#FFF', borderBottom: '1px solid #27272A' }}>
          <div style={{ width: '48px', height: '48px', background: '#0078D4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800, fontSize: '1.4rem' }}>
            A
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>Attendance POC</h2>
          <p style={{ fontSize: '0.76rem', color: '#8E8E93', margin: 0 }}>Student Attendance &amp; Proposals Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
              Admin Username
            </label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.62rem', fontSize: '0.84rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>

          <div style={{ marginTop: '1.25rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center', fontSize: '0.74rem', color: '#64748B' }}>
            <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '0.15rem' }}>Evaluation Credentials</div>
            <div>Username: <code style={{ color: '#0078D4', fontWeight: 700 }}>admin</code> &bull; Password: <code style={{ color: '#0078D4', fontWeight: 700 }}>password123</code></div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================================================
// 2. DASHBOARD VIEW
// ==============================================================================
function DashboardView({ setActiveTab, showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('ALL');

  const fetchDashboard = () => {
    setLoading(true);
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => showToast('Failed to load dashboard data.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>Loading real-time analytics...</div>;
  }

  const eligibleRatio = data.total_students > 0 ? (data.eligible_count / data.total_students) * 100 : 0;

  return (
    <div>
      {/* 4 Top KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-blue">
          <div className="kpi-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span>Total Students</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '5px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  color: '#1E293B',
                  cursor: 'pointer',
                  maxWidth: '135px'
                }}
              >
                <option value="ALL">All Departments</option>
                {(data.departments || Object.keys(data.dept_stats || {})).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <h3 style={{ color: '#0078D4', transition: 'all 0.15s ease' }}>
              {selectedDept === 'ALL'
                ? data.total_students
                : (data.dept_stats?.[selectedDept] ?? 0)}
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                {selectedDept === 'ALL'
                  ? `Across ${(data.departments || Object.keys(data.dept_stats || {})).length} academic disciplines`
                  : `Enrolled in ${selectedDept}`}
              </span>
              {selectedDept !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedDept('ALL')}
                  style={{ background: 'transparent', border: 'none', color: '#0078D4', fontSize: '0.68rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="kpi-icon" style={{ marginLeft: '0.5rem', flexShrink: 0 }}>
            <Users size={20} />
          </div>
        </div>

        <div className="kpi-card kpi-emerald">
          <div className="kpi-info">
            <span>Present ({data.display_date})</span>
            <h3 style={{ color: '#10B981' }}>{data.present_count}</h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>Confirmed attendees today</div>
          </div>
          <div className="kpi-icon">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="kpi-card kpi-rose">
          <div className="kpi-info">
            <span>Absent ({data.display_date})</span>
            <h3 style={{ color: '#EF4444' }}>{data.absent_count}</h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>Absent from recorded lecture</div>
          </div>
          <div className="kpi-icon">
            <XCircle size={20} />
          </div>
        </div>

        <div className="kpi-card kpi-amber">
          <div className="kpi-info">
            <span>Session Turnout</span>
            <h3 style={{ color: '#F59E0B' }}>{data.attendance_rate}%</h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>Rate for {data.display_date}</div>
          </div>
          <div className="kpi-icon">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      {/* Middle Row: Eligibility Health & Department Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.15rem', marginBottom: '1.25rem' }}>
        {/* Exam Eligibility Health Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ShieldCheck size={17} color="#10B981" />
              Examination Eligibility Ratio
            </h3>
            <span className="badge badge-gray" style={{ fontSize: '0.66rem' }}>Threshold: {data.threshold}%</span>
          </div>

          <p style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '0.9rem' }}>
            Cumulative eligibility evaluated across <strong>{data.total_sessions}</strong> conducted sessions stored in memory:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '7px', border: '1px solid #A7F3D0' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Eligible Students</span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669' }}>{data.eligible_count}</div>
              <span style={{ fontSize: '0.68rem', color: '#047857' }}>&ge; 75% Attendance</span>
            </div>

            <div style={{ background: '#FEF2F2', padding: '0.75rem', borderRadius: '7px', border: '1px solid #FECACA' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>Defaulters Flagged</span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#DC2626' }}>{data.defaulter_count}</div>
              <span style={{ fontSize: '0.68rem', color: '#B91C1C' }}>&lt; 75% Warning Alert</span>
            </div>
          </div>

          <div style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 600 }}>
            <span>Class-Wide Eligibility Rate</span>
            <span>{eligibleRatio.toFixed(1)}%</span>
          </div>
          <div style={{ width: '100%', height: '7px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${eligibleRatio}%`, background: '#10B981' }}></div>
            <div style={{ width: `${100 - eligibleRatio}%`, background: '#EF4444' }}></div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Building size={17} color="#0078D4" />
              Department Breakdown
            </h3>
            <button onClick={() => setActiveTab('departments')} className="btn btn-outline btn-sm">
              Manage Depts <ArrowRight size={11} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(data.dept_stats).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1E293B' }}>{dept}</span>
                <span className="badge badge-blue">{count} Enrolled</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Ready to record today's turnout?</span>
            <button onClick={() => setActiveTab('attendance')} style={{ background: 'transparent', border: 'none', color: '#0078D4', fontWeight: 600, fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
              Open Sheet <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>Recent Attendance Sessions</h3>
            <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0 }}>Latest verified lecture sessions logged in active memory</p>
          </div>
          <button onClick={() => setActiveTab('reports')} className="btn btn-outline btn-sm">
            Review Queue
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Lecture Date</th>
                <th>Enrolled Roster</th>
                <th>Present Count</th>
                <th>Absent Count</th>
                <th>Session Turnout</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_activity.map((act) => (
                <tr key={act.date}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Calendar size={13} color="#0078D4" />
                      <span>{act.date}</span>
                      {act.date === data.today_date && (
                        <span className="badge badge-blue" style={{ fontSize: '0.64rem' }}>Today</span>
                      )}
                    </div>
                  </td>
                  <td>{act.total} Students</td>
                  <td style={{ color: '#10B981', fontWeight: 700 }}>{act.present}</td>
                  <td style={{ color: '#EF4444', fontWeight: 700 }}>{act.absent}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.76rem' }}>{act.rate}%</span>
                      <div style={{ width: '65px', height: '5px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${act.rate}%`, height: '100%', background: act.rate >= 75 ? '#10B981' : '#F59E0B' }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="btn btn-outline btn-sm"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 3. ATTENDANCE VIEW (Tactile, User-Friendly Marking Sheet)
// ==============================================================================
function AttendanceView({ showToast }) {
  const todayIso = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAttendance = (dateToFetch, deptToFetch) => {
    setLoading(true);
    const params = new URLSearchParams({ date: dateToFetch });
    if (deptToFetch) params.append('department', deptToFetch);

    fetch(`/api/attendance?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
        setDepartments(data.departments);
        const map = {};
        data.students.forEach((s) => {
          map[s.roll_no] = data.current_log[s.roll_no] || 'Present';
        });
        setAttendanceRecords(map);
      })
      .catch(() => showToast('Could not load attendance sheet.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance(selectedDate, selectedDept);
  }, [selectedDate, selectedDept]);

  const handleToggle = (rollNo, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [rollNo]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = { ...attendanceRecords };
    students.forEach((s) => {
      updated[s.roll_no] = 'Present';
    });
    setAttendanceRecords(updated);
    showToast('All roster students marked Present!', 'success');
  };

  const handleMarkAllAbsent = () => {
    const updated = { ...attendanceRecords };
    students.forEach((s) => {
      updated[s.roll_no] = 'Absent';
    });
    setAttendanceRecords(updated);
    showToast('All roster students marked Absent!', 'info');
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          records: attendanceRecords
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Attendance for ${selectedDate} saved! (Present: ${data.present_count}, Absent: ${data.absent_count})`, 'success');
      } else {
        showToast(data.message || 'Error saving attendance.', 'error');
      }
    } catch (e) {
      showToast('Network error while saving attendance.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchFilter.trim()) return students;
    const q = searchFilter.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.roll_no.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }, [students, searchFilter]);

  const presentCount = useMemo(() => {
    return Object.values(attendanceRecords).filter((v) => v === 'Present').length;
  }, [attendanceRecords]);
  const absentCount = students.length - presentCount;

  return (
    <div>
      {/* Date & Filter Toolbar Card */}
      <div className="card" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          {/* Date Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Select Date:
            </label>
            <input
              type="date"
              className="form-input"
              style={{ width: '140px', fontWeight: 600 }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              onClick={() => setSelectedDate(todayIso)}
              className="btn btn-outline btn-sm"
              title="Jump to Today"
            >
              Today
            </button>
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Department:
            </label>
            <select
              className="form-select"
              style={{ width: '185px' }}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments ({students.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Search-on-sheet Input */}
          <div style={{ position: 'relative', width: '210px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '28px' }}
              placeholder="Filter roster..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Batch Actions & Live Count Banner */}
        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Quick Batch:</span>
            <button onClick={handleMarkAllPresent} className="btn btn-outline btn-sm" style={{ color: '#10B981', borderColor: '#A7F3D0' }}>
              <UserCheck size={12} /> Mark All Present
            </button>
            <button onClick={handleMarkAllAbsent} className="btn btn-outline btn-sm" style={{ color: '#EF4444', borderColor: '#FECACA' }}>
              <UserX size={12} /> Mark All Absent
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.74rem', padding: '0.22rem 0.6rem' }}>
              Present: <strong>{presentCount}</strong>
            </span>
            <span className="badge badge-rose" style={{ fontSize: '0.74rem', padding: '0.22rem 0.6rem' }}>
              Absent: <strong>{absentCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="table-wrapper" style={{ marginBottom: '1.15rem' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '55px' }}>S.No</th>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Department</th>
              <th style={{ textAlign: 'center', width: '190px' }}>Mark Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  Loading attendance records for {selectedDate}...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  No students found matching current filter.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => {
                const status = attendanceRecords[s.roll_no] || 'Present';
                return (
                  <tr key={s.roll_no}>
                    <td style={{ color: '#94A3B8', fontSize: '0.74rem' }}>{idx + 1}</td>
                    <td>
                      <span className="badge badge-gray" style={{ fontFamily: 'var(--font-mono)' }}>
                        {s.roll_no}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{s.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{s.email}</div>
                    </td>
                    <td>{s.department}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="attendance-toggle">
                        <button
                          type="button"
                          className={`toggle-btn ${status === 'Present' ? 'active-present' : ''}`}
                          onClick={() => handleToggle(s.roll_no, 'Present')}
                        >
                          <CheckCircle2 size={11} /> Present
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn ${status === 'Absent' ? 'active-absent' : ''}`}
                          onClick={() => handleToggle(s.roll_no, 'Absent')}
                        >
                          <XCircle size={11} /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Save Action Bar */}
      <div style={{ background: '#FFFFFF', padding: '0.75rem 1.15rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
          Turnout for <strong>{selectedDate}</strong>: <span style={{ color: '#10B981', fontWeight: 700 }}>{presentCount} Present</span>, <span style={{ color: '#EF4444', fontWeight: 700 }}>{absentCount} Absent</span>
        </div>
        <button
          onClick={handleSaveAttendance}
          className="btn btn-success"
          disabled={saving}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          {saving ? 'Saving...' : `Save ${selectedDate} Attendance`}
        </button>
      </div>
    </div>
  );
}

// ==============================================================================
// 4. STUDENTS VIEW (Directory, Add, Edit, Delete Modals)
// ==============================================================================
function StudentsView({ showToast, initialDeptFilter = '' }) {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState(initialDeptFilter);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialDeptFilter) {
      setDeptFilter(initialDeptFilter);
    }
  }, [initialDeptFilter]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Form inputs
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newSem, setNewSem] = useState('Semester V');
  const [newEmail, setNewEmail] = useState('');
  const [newContact, setNewContact] = useState('');

  const fetchStudents = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (deptFilter) params.append('department', deptFilter);
    if (searchQuery) params.append('q', searchQuery);

    fetch(`/api/students?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
        setDepartments(data.departments);
      })
      .catch(() => showToast('Failed to load student roster.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, [deptFilter, searchQuery]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roll_no: newRoll,
          name: newName,
          department: newDept,
          semester: newSem,
          email: newEmail,
          contact: newContact
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        setShowAddModal(false);
        setNewRoll('');
        setNewName('');
        setNewEmail('');
        setNewContact('');
        fetchStudents();
      } else {
        showToast(data.message || 'Error adding student.', 'error');
      }
    } catch (e) {
      showToast('Network error while adding student.', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingStudent.name,
          department: editingStudent.department,
          semester: editingStudent.semester,
          email: editingStudent.email,
          contact: editingStudent.contact
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        setEditingStudent(null);
        fetchStudents();
      } else {
        showToast(data.message || 'Error updating student.', 'error');
      }
    } catch (e) {
      showToast('Network error while updating student.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'info');
        setDeletingStudent(null);
        fetchStudents();
      } else {
        showToast(data.message || 'Error deleting student.', 'error');
      }
    } catch (e) {
      showToast('Network error while deleting student.', 'error');
    }
  };

  return (
    <div>
      {/* Top Toolbar */}
      <div className="card" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          {/* Live Search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '30px' }}
              placeholder="Search by Name, Roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Filter size={13} color="#64748B" />
            <select
              className="form-select"
              style={{ width: '180px' }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Add Student Button */}
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={14} /> Register New Student
          </button>
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Contact Details</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  Loading students roster...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="badge badge-gray" style={{ fontFamily: 'var(--font-mono)' }}>
                      {s.roll_no}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#EFF6FF', color: '#0078D4', fontWeight: 700, fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.name[0]}
                      </div>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{s.name}</span>
                    </div>
                  </td>
                  <td>{s.department}</td>
                  <td><span className="badge badge-gray">{s.semester}</span></td>
                  <td>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      <div>{s.email}</div>
                      <div>{s.contact}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => setEditingStudent({ ...s })}
                        className="btn btn-outline btn-sm"
                        title="Edit Details"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => setDeletingStudent(s)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#EF4444', borderColor: '#FECACA' }}
                        title="Delete Student"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Register New Student */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleAddSubmit}>
              <div className="modal-header">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={17} color="#0078D4" /> Register New Student
                </h3>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <X size={17} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS-2026-008"
                    value={newRoll}
                    onChange={(e) => setNewRoll(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Full Student Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Kavya Nair"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Department
                    </label>
                    <select
                      className="form-select"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Semester
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newSem}
                      onChange={(e) => setNewSem(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@college.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 98765 00000"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {editingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleEditSubmit}>
              <div className="modal-header">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Edit Student: {editingStudent.roll_no}
                </h3>
                <button type="button" onClick={() => setEditingStudent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <X size={17} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Full Student Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Department
                    </label>
                    <select
                      className="form-select"
                      value={editingStudent.department}
                      onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Semester
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingStudent.semester}
                      onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingStudent.contact}
                    onChange={(e) => setEditingStudent({ ...editingStudent, contact: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingStudent(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '360px' }}>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.65rem' }}>
                <Trash2 size={22} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>Delete Student Record?</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1.15rem' }}>
                Are you sure you want to delete <strong>{deletingStudent.name}</strong> ({deletingStudent.roll_no})? Associated attendance logs will be removed.
              </p>

              <div style={{ display: 'flex', gap: '0.55rem', justifyContent: 'center' }}>
                <button onClick={() => setDeletingStudent(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="btn btn-danger">
                  Yes, Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// 5. REPORTS & ELIGIBILITY VIEW
// ==============================================================================
function ReportsView({ showToast }) {
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [threshold, setThreshold] = useState(75.0);
  const [defaulterCount, setDefaulterCount] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const fetchReports = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (deptFilter) params.append('department', deptFilter);
    if (statusFilter) params.append('status', statusFilter);

    fetch(`/api/reports?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports);
        setDepartments(data.departments);
        setTotalSessions(data.total_sessions);
        setThreshold(data.threshold);
        setDefaulterCount(data.defaulter_count);
        setEligibleCount(data.eligible_count);
      })
      .catch(() => showToast('Could not fetch attendance reports.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [deptFilter, statusFilter]);

  const filteredReports = useMemo(() => {
    if (!searchFilter.trim()) return reports;
    const q = searchFilter.toLowerCase().trim();
    return reports.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.roll_no.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
    );
  }, [reports, searchFilter]);

  return (
    <div>
      {/* Print Academic Banner */}
      <div className="print-only" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Department of Computer Science &bull; Consolidated Attendance Report</p>
        <div style={{ fontSize: '0.75rem', marginTop: '0.35rem' }}>Evaluated across {totalSessions} Sessions &bull; Minimum Threshold: {threshold}%</div>
        <hr style={{ margin: '0.65rem 0' }} />
      </div>

      {/* Top Action Bar */}
      <div className="card no-print" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Attendance Ledgers &amp; Defaulter Audits</h3>
            <p style={{ fontSize: '0.74rem', color: '#64748B', margin: 0 }}>
              Calculated across {totalSessions} lecture sessions with automated 75% threshold checking
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button onClick={() => window.print()} className="btn btn-outline btn-sm">
              <Printer size={13} /> Print Ledger
            </button>
            <a href="/api/reports/export-csv" className="btn btn-primary btn-sm" download>
              <Download size={13} /> Export CSV
            </a>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '28px' }}
              placeholder="Search reports..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>Dept:</span>
            <select
              className="form-select"
              style={{ width: '165px' }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: '155px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Students</option>
              <option value="eligible">Eligible (&ge; 75%)</option>
              <option value="defaulter">Defaulters Only (&lt; 75%)</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-emerald">Eligible: {eligibleCount}</span>
            <span className="badge badge-rose">Defaulters: {defaulterCount}</span>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Department</th>
              <th style={{ textAlign: 'center' }}>Total Held</th>
              <th style={{ textAlign: 'center', color: '#10B981' }}>Present</th>
              <th style={{ textAlign: 'center', color: '#EF4444' }}>Absent</th>
              <th style={{ minWidth: '125px' }}>Turnout %</th>
              <th style={{ textAlign: 'center' }}>Eligibility Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  Calculating percentages and compiling reports...
                </td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  No attendance records found matching filters.
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r.roll_no} style={{ background: r.is_defaulter ? 'rgba(254, 242, 242, 0.4)' : 'transparent' }}>
                  <td>
                    <span className="badge badge-gray" style={{ fontFamily: 'var(--font-mono)' }}>
                      {r.roll_no}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{r.email}</div>
                  </td>
                  <td>{r.department}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.total_sessions}</td>
                  <td style={{ textAlign: 'center', color: '#10B981', fontWeight: 700 }}>{r.present_count}</td>
                  <td style={{ textAlign: 'center', color: '#EF4444', fontWeight: 700 }}>{r.absent_count}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem', color: r.is_defaulter ? '#EF4444' : '#10B981' }}>
                        {r.percentage}%
                      </span>
                      <div style={{ flexGrow: 1, height: '5px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${r.percentage}%`, height: '100%', background: r.is_defaulter ? '#EF4444' : '#10B981' }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {r.is_defaulter ? (
                      <span className="badge badge-rose">
                        <AlertTriangle size={11} /> Defaulter (&lt;75%)
                      </span>
                    ) : (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={11} /> Eligible
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==============================================================================
// 6. DEPARTMENTS VIEW (Academic Department Management)
// ==============================================================================
function DepartmentsView({ setActiveTab, onSelectDepartment, showToast }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDept, setEditDept] = useState(null);

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formHod, setFormHod] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = () => {
    setLoading(true);
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || []);
      })
      .catch(() => showToast('Failed to load departments.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormCode('');
    setFormHod('');
    setFormDesc('');
    setShowAddModal(true);
  };

  const openEditModal = (d) => {
    setEditDept(d);
    setFormName(d.name);
    setFormCode(d.code);
    setFormHod(d.hod);
    setFormDesc(d.description);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Department name is required.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          code: formCode.trim(),
          hod: formHod.trim(),
          description: formDesc.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        setShowAddModal(false);
        fetchDepartments();
      } else {
        showToast(data.message || 'Could not add department.', 'error');
      }
    } catch (err) {
      showToast('Failed to connect to server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Department name is required.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/departments/${editDept.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          code: formCode.trim(),
          hod: formHod.trim(),
          description: formDesc.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        setEditDept(null);
        fetchDepartments();
      } else {
        showToast(data.message || 'Could not update department.', 'error');
      }
    } catch (err) {
      showToast('Failed to connect to server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (d) => {
    if (d.student_count > 0) {
      showToast(`Cannot delete '${d.name}': ${d.student_count} student(s) currently enrolled. Please reassign their department first.`, 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the department '${d.name}'?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/departments/${d.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        fetchDepartments();
      } else {
        showToast(data.message || 'Could not delete department.', 'error');
      }
    } catch (err) {
      showToast('Failed to delete department.', 'error');
    }
  };

  const filteredDepartments = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.code && d.code.toLowerCase().includes(q)) ||
      (d.hod && d.hod.toLowerCase().includes(q))
    );
  });

  const totalStudentsEnrolled = departments.reduce((acc, curr) => acc + (curr.student_count || 0), 0);

  return (
    <div>
      {/* 3 Metric Cards */}
      <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="kpi-card kpi-blue">
          <div className="kpi-info">
            <span>Total Departments</span>
            <h3>{departments.length}</h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>Active academic programs</div>
          </div>
          <div className="kpi-icon">
            <Building size={20} />
          </div>
        </div>

        <div className="kpi-card kpi-emerald">
          <div className="kpi-info">
            <span>Total Enrolled</span>
            <h3 style={{ color: '#10B981' }}>{totalStudentsEnrolled}</h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>Students allocated across faculties</div>
          </div>
          <div className="kpi-icon">
            <Users size={20} />
          </div>
        </div>

        <div className="kpi-card kpi-amber">
          <div className="kpi-info">
            <span>Avg Enrollment</span>
            <h3 style={{ color: '#F59E0B' }}>
              {departments.length > 0 ? (totalStudentsEnrolled / departments.length).toFixed(1) : 0}
            </h3>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>Students per department</div>
          </div>
          <div className="kpi-icon">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      {/* Toolbar Card */}
      <div className="card" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.78rem' }}
              placeholder="Search departments by name, code, HOD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button onClick={fetchDepartments} className="btn btn-outline btn-sm" title="Refresh">
              <RefreshCw size={13} />
            </button>
            <button id="btn-open-add-dept" onClick={openAddModal} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add Department</span>
            </button>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Code</th>
              <th>Department Name</th>
              <th>Head of Department (HOD)</th>
              <th>Description / Scope</th>
              <th style={{ textAlign: 'center' }}>Enrollment</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  Loading departments directory...
                </td>
              </tr>
            ) : filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                  No departments found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((d) => (
                <tr key={d.id}>
                  <td>
                    <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {d.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>{d.name}</div>
                  </td>
                  <td>
                    <div style={{ color: '#334155', fontWeight: 500 }}>{d.hod}</div>
                  </td>
                  <td style={{ color: '#64748B', fontSize: '0.76rem', maxWidth: '300px' }}>
                    {d.description || '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
                      <Users size={11} /> {d.student_count} Students
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      <button
                        onClick={() => {
                          if (onSelectDepartment) onSelectDepartment(d.name);
                          setActiveTab('students');
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                        title="View students in this department"
                      >
                        <Users size={12} /> Students
                      </button>
                      <button
                        onClick={() => openEditModal(d)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.55rem' }}
                        title="Edit Department"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(d)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.55rem' }}
                        title="Delete Department"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleAddSubmit}>
              <div className="modal-header">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={17} color="#0078D4" /> Add Academic Department
                </h3>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <X size={17} />
                </button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Department Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mechanical Engineering"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Code (Abbreviation)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. MECH"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Head of Department (HOD)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. M. Senthil"
                      value={formHod}
                      onChange={(e) => setFormHod(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Description / Scope
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Brief description of academic syllabus or department scope..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editDept && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleEditSubmit}>
              <div className="modal-header">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Pencil size={17} color="#0078D4" /> Edit Department: {editDept.name}
                </h3>
                <button type="button" onClick={() => setEditDept(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <X size={17} />
                </button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Department Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Code
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                      Head of Department (HOD)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formHod}
                      onChange={(e) => setFormHod(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>
                    Description / Scope
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditDept(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Update Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
