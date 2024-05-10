import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate, useLocation
} from 'react-router-dom';
import Profile from './Profile'; // Make sure to import the Profile component
import Welcome from './Welcome'; // Assuming Welcome is also a separate component
import NavBar from './NavBar'; // Make sure to import the NavBar component
import Members from './Members';


function ConditionalNavBar() {
  const location = useLocation();
  return location.pathname !== "/welcome" ? <NavBar /> : null;
}


function App() {
  let tg = window.Telegram.WebApp;
  const [userData, setUserData] = useState({});
  const [userExists, setUserExists] = useState(false); // Mock state for user existence

  useEffect(() => {
    if (tg) {
      tg.ready();
      const initDataUnsafe = tg.initDataUnsafe;
      if (initDataUnsafe && initDataUnsafe.user) {
        const user = {
          id: initDataUnsafe.user.id,
          firstName: initDataUnsafe.user.first_name,
          lastName: initDataUnsafe.user.last_name || 'Not provided',
        };
        setUserData(user);
        checkUserExistence(user.id); // Mock function to check user existence
      }
    } else {
      console.error("Telegram WebApp API is not available.");
    }
  }, []);

  // Mock function to simulate checking user existence in database
  const checkUserExistence = (userId) => {
    // This would typically be an API call
    setUserExists(false); // Change this based on real API response
  };

  const handleSaveProfile = (profileData) => {
    console.log('Profile Data to Save:', profileData);
    // Here you would typically make an API call to save the data to your backend
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={userExists ? <Navigate to="/profile" replace /> : <Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome onJoin={() => setUserExists(true)} />} />
          <Route path="/profile" element={<Profile userData={userData} onSave={handleSaveProfile} />} />
          <Route path="/members" element={<Members />} />
        </Routes>
        <ConditionalNavBar />
      </div>
    </Router>
  );
}

export default App;
