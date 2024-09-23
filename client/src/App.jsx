import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TeamForm from './components/TeamForm';
import SignIn from './components/SignIn';
import Round1 from './components/Round1';
import { auth } from './firebase';
import axios from 'axios';
import './styles/App.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import Round2 from './components/Round2';
import Round3 from './components/Round3';
import Round4 from './components/Round4';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasRegistered, setHasRegistered] = useState(false); // New state for registration status

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${user.email}`);
          setCurrentUser(response.data);
          // Check if the user has already registered a team
          if (response.data.hasRegistered) { // Assuming this field exists in your user data
            setHasRegistered(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = () => {
    auth.signOut().then(() => {
      setUser(null);
      setCurrentUser(null);
      setHasRegistered(false); // Reset registration status on sign out
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="brand">Switchuation</div>
          <div className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={`navbar-menu ${menuOpen ? 'open' : 'hidden'}`}>
            {/* Conditional rendering for Team Registration link */}
            {!hasRegistered && (
              <li>
                <Link to="/team-registration" className="hover:text-blue-400">Team Registration</Link>
              </li>
            )}
            <li>
              <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            </li>
            <li className="ml-auto">
              {user ? (
                <div className="profile-section flex items-center space-x-2">
                  <img
                    src={user.photoURL || 'https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg';
                    }}
                  />
                  <button
                    onClick={signOut}
                    className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/signin" className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 hover:text-blue-400">
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/team-registration"
            element={
              <PrivateRoute user={user}>
                <TeamForm setHasRegistered={setHasRegistered} /> {/* Pass setHasRegistered to TeamForm */}
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard currentUser={currentUser} />
              </PrivateRoute>
            }
          />
          <Route path="/round1" element={<Round1 />} />
          <Route path="/round2" element={<Round2 />} />
          <Route path="/round3" element={<Round3 />} />
          <Route path="/round4" element={<Round4 />} />
          <Route 
            path="/" 
            element={
              <div className="welcome-container">
                <h1>Welcome to Switchuation</h1>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
