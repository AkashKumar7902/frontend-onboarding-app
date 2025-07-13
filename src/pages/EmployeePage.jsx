import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import EmployeeForm from '../components/EmployeeForm'; // Import the form

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // To hold data for editing

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/v1/employees');
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = () => {
    setEditingEmployee(null); // Ensure we are in "create" mode
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee); // Set the employee to edit
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiClient.delete(`/api/v1/employees/${employeeId}`);
        fetchEmployees(); // Refresh the list after deleting
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        // We are editing an existing employee
        await apiClient.put(`/api/v1/employees/${editingEmployee.id}`, formData);
      } else {
        console.log('Creating new employee with data:', formData);
        // We are creating a new one
        // Note: You need to add all required fields to the form
        await apiClient.post('/api/v1/employees', formData);
      }
      setShowForm(false);
      setEditingEmployee(null);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Failed to save employee', error);
    }
  };

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Employees</h1>
        <button onClick={handleCreate}>Create New Employee</button>
      </div>

      {showForm && (
        <EmployeeForm
          onSubmit={handleFormSubmit}
          initialData={editingEmployee || {}}
          onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
        />
      )}

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{emp.firstName} {emp.lastName}</td>
              <td style={{ padding: '8px' }}>{emp.email}</td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => handleEdit(emp)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesPage;
