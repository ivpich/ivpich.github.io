import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      backgroundColor: '#040c01',
      display: 'flex',
      justifyContent: 'space-evenly',
      padding: '10px 0'
    }}>
      <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
      <Link to="/members" style={{ color: 'white', textDecoration: 'none' }}>Members</Link>
    </div>
  );
}

export default NavBar;
