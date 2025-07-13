import React, { useState } from 'react';

const UserForm = ({ onSubmit, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // Default to 'member'

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password, role });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3>Create New User</h3>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (email)" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Create User</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
