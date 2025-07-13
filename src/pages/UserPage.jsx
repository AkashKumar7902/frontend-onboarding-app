import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import UserForm from '../components/UserForm';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth(); // Get the currently logged-in user

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/v1/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      await apiClient.post('/api/v1/users', formData);
      setShowForm(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to create user', error);
      alert('Error: Could not create user. They may already exist.');
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>User Management</h1>
        {/* Crucially, only show this button if the user is an admin */}
        {user && user?.role === 'admin' && (
          <button onClick={() => setShowForm(true)}>Create New User</button>
        )}
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Username</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{u.username}</td>
              <td style={{ padding: '8px' }}>{u?.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
