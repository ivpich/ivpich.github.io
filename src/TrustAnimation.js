import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from './animations/chest_animation.json'; // Adjust the path accordingly
import './TrustAnimation.css';

const TrustAnimation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const trustPoints = searchParams.get('trust_points');
    const notification = searchParams.get('notification'); // Get the notification parameter

    const handleAcceptReward = () => {
        navigate('/profile');
    };

    return (
        <div className="animation-container">
            <Lottie animationData={animationData} loop={false} />
            <div className="trust-message">
                <h2>Ваша награда:</h2>
                {notification && <p className="notification-message">{notification}</p>} {/* Display notification message */}
                <p className="trust-points">{trustPoints} TRUST</p>
            </div>
            <button className="accept-reward-button" onClick={handleAcceptReward}>
                Принять награду!
            </button>
        </div>
    );
};

export default TrustAnimation;
