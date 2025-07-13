import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        {/* The <Outlet> will render the specific page component for the current route */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
