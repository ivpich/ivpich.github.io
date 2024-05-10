import React, { useState } from 'react';
import './Profile.css'; // Ensure CSS is properly linked

function Profile({ userData, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    bio: userData.bio || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(userDetails);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="profile-container">
      <div className="profile-image"></div>
      <div className="profile-field">
        <label>First Name:</label>
        <div>{editMode ? <input name="firstName" value={userDetails.firstName} onChange={handleChange} /> : <p>{userDetails.firstName}</p>}</div>
      </div>
      <div className="profile-field">
        <label>Last Name:</label>
        <div>{editMode ? <input name="lastName" value={userDetails.lastName} onChange={handleChange} /> : <p>{userDetails.lastName}</p>}</div>
      </div>
      <div className="profile-field">
        <label>Bio:</label>
        <div>{editMode ? <textarea name="bio" value={userDetails.bio} onChange={handleChange} /> : <p>{userDetails.bio}</p>}</div>
      </div>
      <button onClick={editMode ? handleSave : handleEdit}>{editMode ? 'Save' : 'Edit'}</button>
    </div>
  );
}

export default Profile;
