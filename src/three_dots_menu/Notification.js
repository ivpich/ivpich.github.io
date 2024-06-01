import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification">
            {message}
        </div>
    );
}

export default Notification;
