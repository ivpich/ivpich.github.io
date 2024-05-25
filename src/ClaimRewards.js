import React, { useState, useEffect } from 'react';
import { claimReward } from './api';
import TrustAnimation from './TrustAnimation';

const ClaimRewards = ({ userId, onComplete }) => {
    const [currentReward, setCurrentReward] = useState(null);

    useEffect(() => {
        const fetchAndClaimReward = async () => {
            try {
                const reward = await claimReward(userId);
                if (reward.reward) {
                    setCurrentReward(reward.reward);
                } else {
                    onComplete();
                }
            } catch (error) {
                console.error('Failed to claim reward:', error);
                onComplete();
            }
        };

        fetchAndClaimReward();
    }, [userId, onComplete]);

    const handleClaim = async () => {
        try {
            const reward = await claimReward(userId);
            if (reward.reward) {
                setCurrentReward(reward.reward);
            } else {
                onComplete();
            }
        } catch (error) {
            console.error('Failed to claim reward:', error);
            onComplete();
        }
    };

    return currentReward ? (
        <div className="rewards-overlay">
            <TrustAnimation
                trustPoints={currentReward.trust_value}
                notification={currentReward.notification}
                onClaim={handleClaim}
            />
        </div>
    ) : null;
};

export default ClaimRewards;
