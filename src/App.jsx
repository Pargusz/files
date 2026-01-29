import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import PublicBio from './components/PublicBio';
import AdminDashboard from './components/Admin/Dashboard';
import AdminEditor from './components/Admin/Editor';
import Login from './components/Admin/Login';
import Register from './components/Admin/Register';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (More specific, should come first or are matched better by RR6) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/edit/:id" element={<AdminEditor />} />
        <Route path="/admin/new" element={<AdminEditor />} />

        {/* Home/Landing Page */}
        <Route path="/" element={
          <div className="landing-container" style={landingStyle}>
            <div className="landing-card" style={landingCardStyle}>
              <div style={badgeStyle}>v1.0 is here</div>
              <h1 style={titleStyle}>Pargusz Bio Links</h1>
              <p style={subtitleStyle}>
                Kendi premium bio link sayfanı oluştur, tarzını yansıt ve tüm dünyayla paylaş. 🚀
              </p>
              <div style={btnGroupStyle}>
                <Link to="/admin/login" className="btn-primary" style={linkBtnStyle}>Giriş Yap</Link>
                <Link to="/admin/register" className="btn-secondary" style={linkBtnStyle}>Kayıt Ol</Link>
              </div>
            </div>
          </div>
        } />

        {/* Public Bio Route - Catch-all for slugs */}
        <Route path="/:slug" element={<PublicBio />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Styles
const landingStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 100%)',
  padding: '24px',
  color: '#fff'
};

const landingCardStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  padding: '60px 40px',
  borderRadius: '40px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  textAlign: 'center',
  maxWidth: '540px',
  width: '100%',
  backdropFilter: 'blur(30px)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const badgeStyle = {
  display: 'inline-block',
  padding: '6px 16px',
  borderRadius: '20px',
  background: 'rgba(59, 130, 246, 0.1)',
  color: '#60a5fa',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '24px',
  border: '1px solid rgba(59, 130, 246, 0.2)'
};

const titleStyle = {
  fontSize: '3.5rem',
  fontWeight: '800',
  marginBottom: '20px',
  letterSpacing: '-1.5px',
  background: 'linear-gradient(to bottom right, #fff 30%, #94a3b8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const subtitleStyle = {
  fontSize: '1.15rem',
  lineHeight: '1.6',
  marginBottom: '40px',
  opacity: 0.7,
  color: '#cbd5e1'
};

const btnGroupStyle = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center'
};

const linkBtnStyle = {
  textDecoration: 'none',
  padding: '14px 36px',
  borderRadius: '16px',
  fontWeight: '700',
  fontSize: '1rem',
  transition: 'all 0.3s ease'
};

export default App;
