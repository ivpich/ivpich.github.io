import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome({ onJoin }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    onJoin();
    navigate('/profile'); // Redirects the user to the Profile page after joining
  };

  return (
    <div className="welcome">
      <h1>Welcome to Our Telegram Guild!</h1>
      <p>We're excited to have you join us. Click below to set up your profile and get started.</p>
      <button onClick={handleJoin} className="join-button">Join the Guild</button>
    </div>
  );
}

export default Welcome;
