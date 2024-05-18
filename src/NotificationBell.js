import React, { useEffect, useState, useRef } from 'react';
import './NotificationBell.css';
import { fetchNotifications } from './api';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }
    loadNotifications();
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button onClick={toggleDropdown}>
        🔔
      </button>
      <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
        {notifications.length ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              {notification.message}
            </div>
          ))
        ) : (
          <div className="no-notifications">No notifications</div>
        )}
      </div>
    </div>
  );
}

export default NotificationBell;
