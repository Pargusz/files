import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <Route path="/" element={<div className="landing-page"><h1>Pargusz Bio Links</h1><p>Giriş yapmak için <a href="/admin/login">tıklayın</a></p></div>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
