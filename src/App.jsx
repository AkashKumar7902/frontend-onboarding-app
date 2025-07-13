import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeePage';
import UsersPage from './pages/UserPage';
import EntityPage from './pages/EntityPage'; // Assuming you have a page for managing entities

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* The Layout component provides the Navbar for all nested routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/manage/:entitySlug" element={<EntityPage />} />
              {/* Add routes for other pages here */}
              {/* e.g., <Route path="/departments" element={<DepartmentsPage />} /> */}
            </Route>
          </Route>

          {/* Fallback route redirects to the dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
