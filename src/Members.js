import React, { useEffect, useState } from 'react';
import './Members.css';
import { fetchUsers } from './api';
import { useNavigate } from 'react-router-dom';

function Members() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadMembers() {
            try {
                const users = await fetchUsers();
                // Sort users by trust points in descending order
                users.sort((a, b) => b.trust_points - a.trust_points);
                setMembers(users);
            } catch (error) {
                console.error('Failed to fetch members:', error);
            }
        }

        loadMembers();
    }, []);

    const viewProfile = (member) => {
        navigate('/profile', { state: { userData: member } });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredMembers = members.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <h1 className="page-title">Многоуважаемые агенты Гильдии</h1>
            <input
                type="text"
                placeholder="Поиск участников..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <div className="scrollable-content">
                <div className="members-list">
                    {filteredMembers.map(member => (
                        <div key={member.user_id} className="member-item" onClick={() => viewProfile(member)}>
                            <img src="/default-profile.jpg" alt="Profile" className="member-image" />
                            <div className="member-details">
                                <div className="member-name">{member.first_name} {member.last_name}</div>
                                <div className="member-experience">Experience: {member.trust_points}</div>
                                <div className="member-title">{member.title || 'Member'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Members;
