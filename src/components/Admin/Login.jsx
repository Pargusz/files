import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        }
    };

    return (
        <div className="login-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a'
        }}>
            <form onSubmit={handleLogin} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Admin Girişi</h2>
                {error && <p style={{ color: '#ff4d4d', marginBottom: '16px' }}>{error}</p>}
                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                />
                <button type="submit" style={buttonStyle}>Giriş Yap</button>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
                    Henüz hesabın yok mu? <Link to="/admin/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>Kayıt Ol</Link>
                </p>
            </form>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '14px',
    marginBottom: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.2)',
    color: '#fff',
    fontSize: '1rem'
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
};

export default Login;
