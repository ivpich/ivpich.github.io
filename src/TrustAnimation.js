// src/components/TrustAnimation.js
import React from 'react';
import Lottie from 'lottie-react';
import animationData from './animations/chest_animation.json'; // Adjust the path accordingly
import './TrustAnimation.css';

const TrustAnimation = ({ trustPoints, notification, onClaim }) => {
    return (
        <div className="animation-container">
            <Lottie animationData={animationData} loop={true} />
            <div className="trust-message">
                <h2>Ваша награда:</h2>
                {notification && <p className="notification-message">{notification}</p>}
                <p className="trust-points">{trustPoints} TRUST</p>
            </div>
            <button className="accept-reward-button" onClick={onClaim}>
                Принять награду
            </button>
        </div>
    );
};

export default TrustAnimation;
