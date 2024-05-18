import React, {useEffect, useState} from 'react';
import './Members.css';
import {fetchUsers} from './api';
import {useNavigate} from 'react-router-dom';

function Members() {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadMembers() {
            try {
                const users = await fetchUsers();
                setMembers(users);
            } catch (error) {
                console.error('Failed to fetch members:', error);
            }
        }

        loadMembers();
    }, []);

    const viewProfile = (member) => {
        navigate('/profile', {state: {userData: member}});
    };


    return (
        <div className="page-container">
            <h1 className="page-title">Многоуважаемые агенты Гильдии</h1>
            <div className="scrollable-content">
                <div className="members-grid">
                    {members.map(member => (
                        <div key={member.user_id} className="member-item">
                            <img src="/default-profile.jpg" alt="Profile" className="member-image"
                                 onClick={() => viewProfile(member)}/>
                            <div className="member-name">{member.first_name} {member.last_name}</div>
                            <div className="member-title">{member.title || 'Member'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Members;

