import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { entityConfig } from '../config/entityConfig'; // Import config

export const camelToKebab = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

const Navbar = () => {
  const { logout, permissions } = useAuth(); // Get permissions
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log('Current permissions:', permissions);

  return (
    <nav style={{ /* ... styles ... */ }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/dashboard" style={{ color: 'black', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/employees" style={{ color: 'black', textDecoration: 'none' }}>Employees</Link>
        <Link to="/users" style={{ color: 'black', textDecoration: 'none' }}>Users</Link>
        
        {/* DYNAMICALLY GENERATED LINKS */}
        {Object.keys(entityConfig).map(slug => (
          permissions.includes(camelToKebab(slug)) && (
            <Link key={slug} to={`/manage/${camelToKebab(slug)}`} style={{ textDecoration: 'none' }}>
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
