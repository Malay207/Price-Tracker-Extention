import React, { useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';
import Trackitem from './Trackitem';
import Navbar from './Navbar';
import Footer from './Footer';
import Signup from './Signup';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import WarningMessage from 'WarningMessage';

function App() {
  return (
    <Router>
      <Navbar />
      <WarningMessage/>
      <MainRoutes />
      <Footer />
    </Router>
  );
}

function MainRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("prictracker_userid", (result) => {
      if (!result.prictracker_userid) {
        navigate("/signup");
      }
      
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trackitem" element={<Trackitem />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
