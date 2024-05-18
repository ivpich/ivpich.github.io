import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { updateUser, fetchUser } from './api';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile({ userData }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const isOwnProfile = !state; // Determine if this is the logged-in user's profile
    const initialUserData = state ? state.userData : userData;
    const [userDetails, setUserDetails] = useState(initialUserData);
    const [editMode, setEditMode] = useState(false);
    const bioRef = useRef(null);

    useEffect(() => {
        if (isOwnProfile) {
            const loadUserData = async () => {
                try {
                    const fetchedUserData = await fetchUser(initialUserData.user_id);
                    setUserDetails(fetchedUserData);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };

            loadUserData();
        }
    }, [initialUserData.user_id, isOwnProfile]);

    if (!userDetails) {
        return <div>Loading...</div>; // Adds a loading state while userData is null
    }

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
            setUserDetails(updatedUser);
            setEditMode(false);
            console.log('Profile successfully updated');
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleFocus = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div className="profile-container">
            <div className="profile-image"></div>
            <div className="profile-field">
                <label>Имя:</label>
                {editMode ? (
                    <input
                        name="first_name"
                        value={userDetails.first_name}
                        onChange={handleChange}
                        onFocus={() => handleFocus(bioRef)}
                    />
                ) : (
                    <p>{userDetails.first_name}</p>
                )}
            </div>
            <div className="profile-field">
                <label>Фамилия:</label>
                {editMode ? (
                    <input
                        name="last_name"
                        value={userDetails.last_name}
                        onChange={handleChange}
                        onFocus={() => handleFocus(bioRef)}
                    />
                ) : (
                    <p>{userDetails.last_name}</p>
                )}
            </div>
            <div className="profile-field">
                <label>О себе:</label>
                {editMode ? (
                    <textarea
                        name="bio"
                        value={userDetails.bio}
                        onChange={handleChange}
                        ref={bioRef}
                    />
                ) : (
                    <p>{userDetails.bio}</p>
                )}
            </div>
            {isOwnProfile && (
                <button onClick={editMode ? handleSave : () => setEditMode(true)}>
                    {editMode ? 'Save' : 'Edit'}
                </button>
            )}
            {!isOwnProfile && (
                <button onClick={() => navigate(-1)}>Return Back</button>
            )}
        </div>
    );
}

export default Profile;
