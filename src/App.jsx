import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import PublicBio from './components/PublicBio';
import AdminDashboard from './components/Admin/Dashboard';
import AdminEditor from './components/Admin/Editor';
import Login from './components/Admin/Login';
import Register from './components/Admin/Register';
import './index.css';

function App() {
  return (
    <Router basename="/files">
      <Routes>
        {/* Public Routes */}
        <Route path="/:slug" element={<PublicBio />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/edit/:id" element={<AdminEditor />} />
        <Route path="/admin/new" element={<AdminEditor />} />

        {/* Home Redirect or Landing */}
        <Route path="/" element={
          <div className="landing-container" style={landingStyle}>
            <div className="landing-card" style={landingCardStyle}>
              <h1 style={{ marginBottom: '16px', fontSize: '2.5rem' }}>Pargusz Bio Links</h1>
              <p style={{ marginBottom: '32px', opacity: 0.8, fontSize: '1.1rem' }}>
                Kendi premium bio link sayfanı oluştur ve paylaş. 🚀
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link to="/admin/login" className="btn-primary" style={linkBtnStyle}>Giriş Yap</Link>
                <Link to="/admin/register" className="btn-secondary" style={linkBtnStyle}>Kayıt Ol</Link>
              </div>
            </div>
          </div>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const landingStyle = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  padding: '20px'
};

const landingCardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  padding: '60px 40px',
  borderRadius: '32px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%',
  backdropFilter: 'blur(20px)'
};

const linkBtnStyle = {
  textDecoration: 'none',
  padding: '12px 30px',
  borderRadius: '14px',
  fontWeight: '600'
};

export default App;
