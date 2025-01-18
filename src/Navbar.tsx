import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
  const [name, setName] = useState<string>('Signup'); // Default name

  const fetchName = () => {
    // Fetch the user's name from chrome storage
    chrome.storage.local.get("prictracker_userid", (result) => {
      if (result.prictracker_userid) {
        setName(result.prictracker_userid.name); // Update state with the name
      } else {
        setName("Signup"); // Reset to default if not found
      }
    });
  };

  useEffect(() => {
    fetchName(); // Fetch name when component mounts

    // Listen for storage changes to update name in Navbar
    const handleStorageChange = () => {
      fetchName();
    };

    chrome.storage.onChanged.addListener(handleStorageChange); // Add event listener

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange); // Clean up listener on unmount
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className='navbar'>
      <Link to="/"><span>{name}</span></Link>
      <Link to="/trackitem"><span>Track items</span></Link>
    </div>
  );
}

export default Navbar;
