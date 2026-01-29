import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const AdminEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        slug: '',
        profile: { name: '', bio: '', avatar: '' },
        links: [],
        styles: { background: '', buttonColor: 'rgba(255, 255, 255, 0.1)', buttonTextColor: '#ffffff', overlayOpacity: 0.4 },
        socials: { instagram: '', twitter: '', youtube: '', github: '' }
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                if (id) fetchBio(id);
            } else {
                navigate('/admin/login');
            }
        });
        return () => unsubscribe();
    }, [id, navigate]);

    const fetchBio = async (bioId) => {
        try {
            const docRef = doc(db, "bios", bioId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data());
            }
        } catch (err) {
            console.error("Error fetching bio:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.slug) {
            alert('Lütfen bir URL uzantısı (slug) belirleyin.');
            return;
        }

        setSaving(true);
        try {
            if (id) {
                await updateDoc(doc(db, "bios", id), formData);
            } else {
                await addDoc(collection(db, "bios"), {
                    ...formData,
                    ownerId: user.uid,
                    createdAt: new Date().toISOString()
                });
            }
            navigate('/admin');
        } catch (err) {
            console.error("Error saving bio:", err);
            alert('Kaydetme hatası: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const addLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { title: 'Yeni Link', url: 'https://' }]
        });
    };

    const removeLink = (index) => {
        const newLinks = [...formData.links];
        newLinks.splice(index, 1);
        setFormData({ ...formData, links: newLinks });
    };

    const updateLink = (index, field, value) => {
        const newLinks = [...formData.links];
        newLinks[index][field] = value;
        setFormData({ ...formData, links: newLinks });
    };

    if (loading) return <div className="loading-screen">Yükleniyor...</div>;

    return (
        <div className="admin-container" style={{ maxWidth: '800px' }}>
            <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px' }}>
                <ArrowLeft size={20} /> Geri Dön
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1>{id ? 'Bio Düzenle' : 'Yeni Bio Oluştur'}</h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* URL Slug */}
                <section style={sectionStyle}>
                    <h3>Özel URL</h3>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '12px' }}>Sitenizin adresi: pargusz.github.io/files/{formData.slug || 'uzantı'}</p>
                    <input
                        type="text"
                        placeholder="ozel-isim"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                        style={inputStyle}
                    />
                </section>

                {/* Profile Info */}
                <section style={sectionStyle}>
                    <h3>Profil Bilgileri</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <input
                            type="text"
                            placeholder="İsim"
                            value={formData.profile?.name}
                            onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })}
                            style={inputStyle}
                        />
                        <textarea
                            placeholder="Kısa Biyografi"
                            value={formData.profile?.bio}
                            onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, bio: e.target.value } })}
                            style={{ ...inputStyle, minHeight: '80px' }}
                        />
                        <input
                            type="text"
                            placeholder="Avatar URL (örn: https://...)"
                            value={formData.profile?.avatar}
                            onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, avatar: e.target.value } })}
                            style={inputStyle}
                        />
                    </div>
                </section>

                {/* Links */}
                <section style={sectionStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>Linkler</h3>
                        <button onClick={addLink} style={addBtnStyle}><Plus size={16} /> Link Ekle</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {formData.links.map((link, index) => (
                            <div key={index} style={linkItemStyle}>
                                <div style={{ flex: 1, display: 'grid', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Başlık"
                                        value={link.title}
                                        onChange={(e) => updateLink(index, 'title', e.target.value)}
                                        style={smallInputStyle}
                                    />
                                    <input
                                        type="text"
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                                        style={smallInputStyle}
                                    />
                                </div>
                                <button onClick={() => removeLink(index)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Socials */}
                <section style={sectionStyle}>
                    <h3>Sosyal Medya Linkleri</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {Object.keys(formData.socials).map((platform) => (
                            <div key={platform}>
                                <label style={{ ...labelStyle, textTransform: 'capitalize' }}>{platform}</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.socials[platform]}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socials: { ...formData.socials, [platform]: e.target.value }
                                    })}
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Appearance */}
                <section style={sectionStyle}>
                    <h3>Görünüm Ayarları</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Arka Plan Görseli URL</label>
                            <input
                                type="text"
                                value={formData.styles?.background}
                                onChange={(e) => setFormData({ ...formData, styles: { ...formData.styles, background: e.target.value } })}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Buton Rengi</label>
                            <input
                                type="color"
                                value={formData.styles?.buttonColor}
                                onChange={(e) => setFormData({ ...formData, styles: { ...formData.styles, buttonColor: e.target.value } })}
                                style={{ ...inputStyle, padding: '5px', height: '45px' }}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const sectionStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontSize: '1rem'
};

const smallInputStyle = {
    ...inputStyle,
    padding: '8px 12px',
    fontSize: '0.9rem'
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.85rem',
    opacity: 0.7
};

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    cursor: 'pointer',
    fontWeight: '600'
};

const linkItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.05)'
};

export default AdminEditor;
