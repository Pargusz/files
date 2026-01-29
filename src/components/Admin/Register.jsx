import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with username
            await updateProfile(userCredential.user, {
                displayName: username
            });
            navigate('/admin');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Bu e-posta adresi zaten kullanımda.');
            } else if (err.code === 'auth/weak-password') {
                setError('Şifre en az 6 karakter olmalıdır.');
            } else {
                setError('Kayıt sırasında bir hata oluştu.');
            }
        } finally {
            setLoading(false);
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
            <form onSubmit={handleRegister} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '430px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Admin Kayıt</h2>
                <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '24px', fontSize: '0.9rem' }}>
                    Kendi bio link sayfalarını oluşturmak için hesap aç.
                </p>

                {error && <p style={{ color: '#ff4d4d', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                <label style={labelStyle}>Kullanıcı Adı</label>
                <input
                    type="text"
                    placeholder="pargusz"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={inputStyle}
                    required
                />

                <label style={labelStyle}>E-posta</label>
                <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                />

                <label style={labelStyle}>Şifre</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                />

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
                    Zaten hesabın var mı? <Link to="/admin/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Giriş Yap</Link>
                </p>
            </form>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    fontWeight: '500',
    opacity: 0.8
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
    cursor: 'pointer',
    marginTop: '8px'
};

export default Register;
