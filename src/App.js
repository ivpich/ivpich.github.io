import React, {useState, useEffect} from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useLocation
} from 'react-router-dom';
import Profile from './Profile';
import Welcome from './Welcome';
import NavBar from './NavBar';
import Members from './Members';
import {fetchUser, createUser} from './api';

function ConditionalNavBar() {
    const location = useLocation();
    return location.pathname !== "/welcome" ? <NavBar/> : null;
}

function App() {
    const [userData, setUserData] = useState(null);
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(true);  // To handle initial loading state

    useEffect(() => {
        async function initializeUser() {
            let user;
            if (window.Telegram?.WebApp?.ready()) {
                const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
                user = {
                    user_id: initDataUnsafe.user.id,
                    first_name: initDataUnsafe.user.first_name,
                    last_name: initDataUnsafe.user.last_name || 'Not provided'
                };
            } else {
                // Mock data for local development
                user = {
                    user_id: "883234",
                    first_name: "Очень новый пользователь",
                    last_name: "Очень сильно"
                };
                console.log("Mocked user data:", user);
            }

            try {
                const existingUser = await fetchUser(user.user_id);
                if (existingUser) {
                    setUserData(existingUser);
                    setUserExists(true);
                } else {
                    // User does not exist, proceed to welcome screen to join
                    setUserData(user);
                    setUserExists(false);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            setLoading(false);
        }

        initializeUser();
    }, []);

    if (loading || !userData) {
        return <div>Loading...</div>;  // Shows loading until userData is properly fetched
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={userExists ? <Navigate to="/profile" replace/> :
                        <Navigate to="/welcome" replace/>}/>
                    <Route path="/welcome" element={<Welcome onJoin={() => setUserExists(true)} userData={userData}/>}/>
                    <Route path="/profile" element={<Profile userData={userData}/>}/>
                    <Route path="/members" element={<Members/>}/>
                </Routes>
                <ConditionalNavBar/>
            </div>
        </Router>
    );
}

export default App;
