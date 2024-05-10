import React, { useState, useEffect } from 'react';
import './Profile.css';
import { updateUser, fetchUser } from './api';

function Profile({ userData }) {
  const [userDetails, setUserDetails] = useState({
    user_id: userData.user_id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    bio: userData.bio || ''
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch latest user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const fetchedUserData = await fetchUser(userData.user_id);
        if (fetchedUserData) {
          setUserDetails({
            user_id: fetchedUserData.user_id,
            first_name: fetchedUserData.first_name,
            last_name: fetchedUserData.last_name,
            bio: fetchedUserData.bio || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    loadUserData();
  }, [userData.user_id]);  // Dependency on userData.user_id to re-fetch if it changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(userDetails.user_id, userDetails);
      setUserDetails(updatedUser);  // Update the local state with the updated data
      setEditMode(false);
      console.log('Profile successfully updated');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="profile-container">
      <div className="profile-image"></div> {/* Consider updating or adding dynamic image handling */}
      <div className="profile-field">
        <label>Имя:</label>
        {editMode ? <input name="first_name" value={userDetails.first_name} onChange={handleChange} /> : <p>{userDetails.first_name}</p>}
      </div>
      <div className="profile-field">
        <label>Фамилия:</label>
        {editMode ? <input name="last_name" value={userDetails.last_name} onChange={handleChange} /> : <p>{userDetails.last_name}</p>}
      </div>
      <div className="profile-field">
        <label>О себе:</label>
        {editMode ? <textarea name="bio" value={userDetails.bio} onChange={handleChange} /> : <p>{userDetails.bio}</p>}
      </div>
      <button onClick={editMode ? handleSave : handleEdit}>{editMode ? 'Save' : 'Edit'}</button>
    </div>
  );
}

export default Profile;

