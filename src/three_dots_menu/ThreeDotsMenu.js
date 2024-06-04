import React, { useState, useEffect, useRef } from 'react';
import './ThreeDotsMenu.css';
import Notification from './Notification'; // Import the Notification component
import AdjustTrustPopup from './AdjustTrustPopup'; // Import the AdjustTrustPopup component

const privilegedUserIds = ["401201825", "226387751"];

function ThreeDotsMenu({ userId }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("883234"); // Default to testing user ID
    const [notification, setNotification] = useState(null); // State for notification
    const [showAdjustTrustPopup, setShowAdjustTrustPopup] = useState(false); // State for showing the popup
    const menuRef = useRef(null);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            setCurrentUserId(tg.initDataUnsafe.user.id.toString());
        } else {
            setCurrentUserId("883234"); // Use testing user ID
        }

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleRecommendClick = () => {
        const recommendationLink = `https://t.me/TLA_AI_bot/guild?startapp=user_id=${userId}`;
        navigator.clipboard.writeText(recommendationLink)
            .then(() => setNotification('Recommendation link copied!'))
            .catch((error) => console.error('Failed to copy link:', error));
    };

    const handleAdjustTrustClick = () => {
        setShowAdjustTrustPopup(true);
    };

    return (
        <div className="three-dots-menu" ref={menuRef}>
            <div className="dots" onClick={() => setMenuOpen(!menuOpen)}>⋮</div>
            {menuOpen && (
                <div className="menu">
                    <button onClick={handleRecommendClick} className="menu-button">Recommend</button>
                    {privilegedUserIds.includes(currentUserId) && (
                        <button onClick={handleAdjustTrustClick} className="menu-button">Adjust Trust (Admin)</button>
                    )}
                </div>
            )}
            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            {showAdjustTrustPopup && <AdjustTrustPopup userId={userId} onClose={() => setShowAdjustTrustPopup(false)} />}
        </div>
    );
}

export default ThreeDotsMenu;
