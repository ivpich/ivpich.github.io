import React, {useState, useEffect, useRef} from 'react';
import './Profile.css';
import {updateUser, fetchUser, fetchUnclaimedRewards} from './api';
import {useLocation, useNavigate} from 'react-router-dom';
import ClaimRewards from './ClaimRewards';
import ThreeDotsMenu from './three_dots_menu/ThreeDotsMenu'; // Import the new component

function Profile({userData, isRecommended}) {
    const {state} = useLocation();
    const navigate = useNavigate();
    const isOwnProfile = !isRecommended && !state;
    const initialUserData = state ? state.userData : userData;
    const [userDetails, setUserDetails] = useState(initialUserData);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNft, setSelectedNft] = useState(null);
    const [showClaimRewards, setShowClaimRewards] = useState(false);
    const [hasUnclaimedRewards, setHasUnclaimedRewards] = useState(false);
    const [currentReward, setCurrentReward] = useState(null);
    const bioRef = useRef(null);

    useEffect(() => {
        if (isOwnProfile) {
            const loadUserData = async () => {
                try {
                    setLoading(true);
                    const fetchedUserData = await fetchUser(initialUserData.user_id);
                    setUserDetails(fetchedUserData);

                    const unclaimedRewards = await fetchUnclaimedRewards(initialUserData.user_id);
                    setHasUnclaimedRewards(unclaimedRewards.length > 0);
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
        const {name, value} = e.target;
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
        ref.current.scrollIntoView({behavior: 'smooth', block: 'center'});
    };

    const handleRewardClaimComplete = () => {
        setShowClaimRewards(false);
        setHasUnclaimedRewards(false);
    };

    const renderExperienceBar = () => {
        const {trust_points, max_trust_points} = userDetails;
        const percentage = (trust_points / max_trust_points) * 100;
        return (
            <div className="experience-bar">
                <div className="experience-bar-fill" style={{width: `${percentage}%`}}></div>
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
                    <div key={index} className="nft-item" onClick={() => setSelectedNft(nft)}>
                        <img src={nft.image_url} alt={nft.name} className="nft-image"/>
                    </div>
                ))}
            </div>
        );
    };

    const closeModal = () => {
        setSelectedNft(null);
    };

    const renderNftModal = () => {
        if (!selectedNft) return null;

        return (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-button" onClick={closeModal}>×</button>
                    <img src={selectedNft.image_url} alt={selectedNft.name} className="modal-image"/>
                    <div className="modal-info">
                        <h2>{selectedNft.name}</h2>
                        <p>{selectedNft.description}</p>
                    </div>
                </div>
            </div>
        );
    };

    const formatTelegramLink = (telegramHandle) => {
        if (!telegramHandle) {
            return null;
        }
        return `https://t.me/${telegramHandle.replace(/[@]/g, '')}`;
    };

    return (
        <div className="profile-wrapper">
            {renderNftModal()}
            <div
                className={`profile-container ${selectedNft ? 'blurred' : ''} ${showClaimRewards ? 'blurred-rewards' : ''}`}>
                <div className="top-section">
                    <div className="left-column">
                        <div className="user-id"> user_id: {userDetails.user_id}</div>
                        <div className="profile-image"></div>
                        <div className="titles-container">
                            <div className="title-item">{userDetails.title}</div>
                        </div>
                        <div className="experience-bar-container">
                            {renderExperienceBar()}
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="three-dots-menu-container">
                            <ThreeDotsMenu userId={userDetails.user_id}/>
                        </div>
                        <div className="profile-field">
                            <label>Имя</label>
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
                            <label>Отчество</label>
                            {editMode ? (
                                <input
                                    name="middle_name"
                                    value={userDetails.middle_name || ''}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus(bioRef)}
                                />
                            ) : (
                                <p>{userDetails.middle_name}</p>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Фамилия</label>
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
                            <label>Telegram</label>
                            {editMode ? (
                                <input
                                    name="telegram"
                                    value={userDetails.telegram}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus(bioRef)}
                                />
                            ) : (
                                userDetails.telegram ? (
                                    <p>
                                        <a href={formatTelegramLink(userDetails.telegram)} target="_blank"
                                           rel="noopener noreferrer" className="telegram-link">
                                            {userDetails.telegram.replace(/[@]/g, '')}
                                        </a>
                                    </p>
                                ) : (
                                    <p>Not provided</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
                {isOwnProfile && hasUnclaimedRewards && !showClaimRewards && (
                    <button className="claim-rewards-button" onClick={() => setShowClaimRewards(true)}>
                        Принять награды
                    </button>
                )}
                {isRecommended && (
                    <div className="recommended-text">
                        Этот пользователь был рекомендован Вам.
                    </div>
                )}
                <div className="profile-field bio-field">
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
                <div className="profile-field interests-field">
                    <label>Интересы и цели:</label>
                    {editMode ? (
                        <textarea
                            name="interests_and_goals"
                            value={userDetails.interests_and_goals || ''}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{userDetails.interests_and_goals}</p>
                    )}
                </div>
                <div className="nft-showcase-container">
                    {renderNFTShowcase()}
                </div>
                {isOwnProfile && (
                    <button onClick={editMode ? handleSave : () => setEditMode(true)}>
                        {editMode ? 'Save' : 'Edit'}
                    </button>
                )}
                {!isOwnProfile && !isRecommended && (
                    <button onClick={() => navigate(-1)}>Return Back</button>
                )}
            </div>
            {showClaimRewards && (
                <ClaimRewards
                    userId={userDetails.user_id}
                    onComplete={handleRewardClaimComplete}
                />
            )}
        </div>
    );
}

export default Profile;
