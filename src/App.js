import React, {useState, useEffect} from 'react';
import './App.css'
import {HashRouter as Router, Route, Routes, Navigate, useLocation} from 'react-router-dom';
import Profile from './Profile';
import Welcome from './Welcome';
import NavBar from './NavBar';
import Members from './Members';
import TrustAnimation from './TrustAnimation';

import {fetchUser} from './api';


function ConditionalNavBar() {
    const location = useLocation();
    return location.pathname !== "/welcome" ? <NavBar/> : null;
}

function App() {
    const [userData, setUserData] = useState(null);
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initializeUser() {
            let tg = window.Telegram?.WebApp;

            if (tg && tg.initDataUnsafe.user) {
                tg.ready();
                const initDataUnsafe = tg.initDataUnsafe;
                console.log(initDataUnsafe);

                const user = {
                    username: initDataUnsafe.user.username,
                    user_id: initDataUnsafe.user.id.toString(),
                    first_name: initDataUnsafe.user.first_name,
                    last_name: initDataUnsafe.user.last_name || ''
                };

                try {
                    const existingUser = await fetchUser(user.user_id);
                    if (existingUser) {
                        setUserData(existingUser);
                        setUserExists(true);
                    } else {
                        setUserData(user);
                        setUserExists(false);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }

            } else {
                // Mock data for local development
                const mocked_user = {
                    username: "ivpich",
                    user_id: "883234",
                    first_name: "Очень",
                    last_name: "Тест"
                };
                setUserData(mocked_user);
                setUserExists(true);
            }

            setLoading(false);
        }

        initializeUser();
    }, []);

    if (loading) {
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
                    <Route path="/trust-animation"
                           element={<TrustAnimation trustPoints={50}/>}/> {/* Example usage with 50 trust points */}
                </Routes>
                <ConditionalNavBar/>
            </div>
        </Router>
    );
}

export default App;