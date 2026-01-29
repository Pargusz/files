import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import {
    Instagram, Twitter, Youtube, Github, Linkedin, Globe, MessageCircle,
    Music, Music2, Play, Send, Share2, Video, Ghost, ShoppingCart,
    Twitch, ExternalLink, Headphones
} from 'lucide-react';

const PublicBio = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, "bios"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const bioData = querySnapshot.docs[0].data();
                    setData(bioData);
                    if (bioData.profile?.name) {
                        document.title = `${bioData.profile.name} | Pargusz Bio`;
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching bio:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) return <div className="loading-screen">Yükleniyor...</div>;
    if (error || !data) return <div className="error-screen">Sayfa bulunamadı.</div>;

    const { profile, links, styles, socials } = data;

    const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'instagram': return <Instagram />;
            case 'twitter': return <Twitter />;
            case 'youtube': return <Youtube />;
            case 'github': return <Github />;
            case 'linkedin': return <Linkedin />;
            case 'whatsapp': return <MessageCircle />;
            default: return <Globe />;
        }
    };

    const getLinkIcon = (url) => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('instagram.com')) return <Instagram size={20} />;
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return <Twitter size={20} />;
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return <Youtube size={20} />;
        if (lowerUrl.includes('spotify.com')) return <Music size={20} />;
        if (lowerUrl.includes('music.apple.com')) return <Music2 size={20} />;
        if (lowerUrl.includes('github.com')) return <Github size={20} />;
        if (lowerUrl.includes('linkedin.com')) return <Linkedin size={20} />;
        if (lowerUrl.includes('twitch.tv')) return <Twitch size={20} />;
        if (lowerUrl.includes('tiktok.com')) return <Video size={20} />;
        if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram')) return <Send size={20} />;
        if (lowerUrl.includes('snapchat.com')) return <Ghost size={20} />;
        if (lowerUrl.includes('soundcloud.com')) return <Headphones size={20} />;

        return <ExternalLink size={20} />;
    };

    return (
        <div className="bio-container" style={{
            backgroundImage: styles?.background ? `url(${styles.background})` : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="overlay" style={{ backgroundColor: `rgba(0,0,0, ${styles?.overlayOpacity || 0.4})` }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bio-content"
            >
                <div className="profile-section">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={profile?.avatar || 'https://via.placeholder.com/150'}
                        alt={profile?.name}
                        className="avatar"
                    />
                    <h1 className="name">{profile?.name || 'İsim Belirtilmedi'}</h1>
                    <p className="bio-text">{profile?.bio || 'Kısa bilgi bulunmuyor'}</p>
                </div>

                <div className="links-section">
                    {links?.map((link, index) => (
                        <motion.a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="link-button"
                            style={{
                                backgroundColor: styles?.buttonColor || 'rgba(255, 255, 255, 0.1)',
                                color: styles?.buttonTextColor || '#fff',
                                borderColor: styles?.buttonBorderColor || 'rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {getLinkIcon(link.url)}
                                <span className="link-title">{link.title}</span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {socials && Object.keys(socials).length > 0 && (
                    <div className="socials-section">
                        {Object.entries(socials).map(([platform, url], index) => (
                            url && (
                                <motion.a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, color: '#fff' }}
                                    className="social-icon"
                                >
                                    {getSocialIcon(platform)}
                                </motion.a>
                            )
                        ))}
                    </div>
                )}
            </motion.div>

            <footer className="footer">
                <p>Created with Pargusz Bio</p>
            </footer>
        </div>
    );
};

export default PublicBio;
