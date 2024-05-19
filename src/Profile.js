import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { updateUser, fetchUser} from './api';
import { useLocation, useNavigate } from 'react-router-dom';

function Profile({ userData }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const isOwnProfile = !state;
    const initialUserData = state ? state.userData : userData;
    const [userDetails, setUserDetails] = useState(initialUserData);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const bioRef = useRef(null);
    const [showAllTitles, setShowAllTitles] = useState(false);

    useEffect(() => {
        if (isOwnProfile) {
            const loadUserData = async () => {
                try {
                    setLoading(true);
                    const fetchedUserData = await fetchUser(initialUserData.user_id);
                    setUserDetails(fetchedUserData);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    setError('Failed to load user data.');
                } finally {
                    setLoading(false);
                }
            };

            loadUserData();
        }
    }, [initialUserData.user_id, isOwnProfile]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
            setLoading(true);
            const updatedUser = await updateUser(userDetails.user_id, userDetails);
            setUserDetails(updatedUser);
            setEditMode(false);
            console.log('Profile successfully updated');
        } catch (error) {
            console.error('Failed to update profile:', error);
            setError('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleFocus = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const renderExperienceBar = () => {
        const { trust_points, max_trust_points } = userDetails;
        const percentage = (trust_points / max_trust_points) * 100;
        return (
            <div className="experience-bar">
                <div className="experience-bar-fill" style={{ width: `${percentage}%` }}></div>
                <div className="experience-bar-text">{trust_points} / {max_trust_points}</div>
            </div>
        );
    };

    const renderNFTShowcase = () => {
        if (!userDetails.nfts || userDetails.nfts.length === 0) {
            return <div>No NFTs to showcase</div>;
        }

        return (
            <div className="nft-showcase">
                {userDetails.nfts.map((nft, index) => (
                    <div key={index} className="nft-item" onClick={() => handleNFTClick(nft)}>
                        <img src={nft.image_url} alt={nft.name} className="nft-image" />
                    </div>
                ))}
            </div>
        );
    };

    const handleNFTClick = (nft) => {
        // Implement NFT click handling logic here
        console.log(nft);
    };

    const renderTitles = () => {
        if (!userDetails.titles || userDetails.titles.length === 0) {
            return <div>No titles available</div>;
        }

        const topTitles = userDetails.titles.slice(0, 3);

        return (
            <div className="titles-container">
                {topTitles.map((title, index) => (
                    <div key={index} className="title-item">{title.title}</div>
                ))}
                {userDetails.titles.length > 3 && (
                    <button className="expand-titles-button" onClick={() => setShowAllTitles(!showAllTitles)}>
                        {showAllTitles ? "Show Less" : "Show More"}
                    </button>
                )}
                {showAllTitles && (
                    <div className="all-titles">
                        {userDetails.titles.slice(3).map((title, index) => (
                            <div key={index} className="title-item">{title.title}</div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="profile-container">
            <div className="profile-image"></div>
            <div className="experience-bar-container">
                {renderExperienceBar()}
            </div>
            <div className="nft-showcase-container">
                {renderNFTShowcase()}
            </div>
            <div className="titles-container">
                {renderTitles()}
            </div>
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
