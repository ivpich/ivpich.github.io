import React, {useState} from 'react';
import './AdjustTrustPopup.css';
import {BASE_URL} from "../api";

function AdjustTrustPopup({userId, onClose}) {
    const [trustValue, setTrustValue] = useState('');
    const [notification, setNotification] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const url = new URL(`${BASE_URL}/users/${userId}/adjust_trust`);
            url.searchParams.append('trust_value', trustValue);
            url.searchParams.append('notification', notification);

            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) {
                throw new Error(`Failed to adjust trust: ${await response.text()}`);
            }

            const data = await response.json();
            alert(data.message);
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to adjust trust');
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>Adjust Trust Points</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Trust Value</label>
                        <input
                            type="number"
                            value={trustValue}
                            onChange={(e) => setTrustValue(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Notification</label>
                        <textarea
                            value={notification}
                            onChange={(e) => setNotification(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit">Send</button>
                </form>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default AdjustTrustPopup;