import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { entityConfig } from '../config/entityConfig'; // Import config

const Navbar = () => {
  const { logout, permissions } = useAuth(); // Get permissions
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ /* ... styles ... */ }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/employees" style={{ color: 'white', textDecoration: 'none' }}>Employees</Link>
        <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
        
        {/* DYNAMICALLY GENERATED LINKS */}
        {Object.keys(entityConfig).map(slug => (
          permissions.includes(slug) && (
            <Link key={slug} to={`/manage/${slug}`} style={{ color: 'white', textDecoration: 'none' }}>
              {entityConfig[slug].title}
            </Link>
          )
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
