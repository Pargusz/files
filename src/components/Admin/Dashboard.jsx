import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const [bios, setBios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchBios(currentUser.uid);
            } else {
                navigate('/admin/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchBios = async (uid) => {
        try {
            const q = query(collection(db, "bios"), where("ownerId", "==", uid));
            const querySnapshot = await getDocs(q);
            const bioList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBios(bioList);
        } catch (err) {
            console.error("Error fetching bios:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu bio sayfasını silmek istediğinize emin misiniz?')) {
            try {
                await deleteDoc(doc(db, "bios", id));
                setBios(bios.filter(b => b.id !== id));
            } catch (err) {
                alert('Silme işlemi başarısız.');
            }
        }
    };

    const handleLogout = () => {
        signOut(auth);
        navigate('/admin/login');
    };

    if (loading) return <div className="loading-screen">Yükleniyor...</div>;

    return (
        <div className="admin-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Dashboard</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> Çıkış
                    </button>
                    <Link to="/admin/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Plus size={18} /> Yeni Ekle
                    </Link>
                </div>
            </header>

            <div className="bios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {bios.map((bio) => (
                    <div key={bio.id} className="bio-card" style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <img src={bio.profile?.avatar || 'https://via.placeholder.com/50'} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                <h3 style={{ margin: 0 }}>{bio.profile?.name}</h3>
                                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>/{bio.slug}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to={`/admin/edit/${bio.id}`} style={actionBtnStyle} title="Düzenle">
                                <Edit2 size={18} />
                            </Link>
                            <a href={`/${bio.slug}`} target="_blank" rel="noreferrer" style={actionBtnStyle} title="Görüntüle">
                                <ExternalLink size={18} />
                            </a>
                            <button onClick={() => handleDelete(bio.id)} style={{ ...actionBtnStyle, color: '#ff4d4d' }} title="Sil">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {bios.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                        <p>Henüz bir bio link sayfası oluşturmadınız.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.2s',
};

const actionBtnStyle = {
    padding: '8px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export default AdminDashboard;
