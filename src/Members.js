import React from 'react';
import './Members.css'; // Make sure to import the stylesheet

function Members() {
  const members = [
    { id: 1, firstName: 'John', lastName: 'Doe', title: 'Member' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', title: 'Member' },
    { id: 3, firstName: 'Гей', lastName: 'Петрович', title: 'Member' },
    // Add more mock members as needed
  ];

  return (
      <div>
          <h1 className="page-title">Многоуважаемые агенты Гильдии</h1>
          <div className="members-grid">
              {members.map(member => (
                  <div key={member.id} className="member-item">
                      <img src="/default-profile.jpg" alt="Profile" className="member-image"/>
                      <div className="member-name">{member.firstName} {member.lastName}</div>
                      <div className="member-title">{member.title}</div>
                  </div>
              ))}
          </div>
      </div>
  );
}

export default Members;
