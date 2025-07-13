import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import apiClient from '../services/api';

const kebabToCamel = (str) => {
  return str.replace(/-(\w)/g, (_, char) => char.toUpperCase());
};

// A reusable Select/Dropdown component
const SelectInput = ({ name, label, value, onChange, options, placeholder }) => (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'block', marginBottom: '5px' }}>{label}:</label>
    <select name={name} value={value} onChange={onChange} required style={{ width: '100%', padding: '8px' }}>
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

const EmployeeForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const { permissions } = useAuth(); // Get permissions
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    locationId: '',
    departmentId: '',
    managerId: '',
    jobRoleId: '',
    employementTypeId: '',
    teamId: '',
    costId: '',
    hardwareAssetId: '',
    onboardingBuddyId: '',
    accessLevelId: '',
});
  
  // State to hold data for our dropdowns
  const [dropdownData, setDropdownData] = useState({});
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // This effect runs once to fetch all necessary data for the dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
      
      // Define which entities we need for the form
      const requiredEntities = ['locations', 'departments', 'managers', 'job-roles', 'employement-types', 'teams', 'costs', 'hardware-assets', 'onboarding-buddy', 'access-levels'];
      
      // Filter them based on tenant permissions
      const entitiesToFetch = requiredEntities.filter(e => permissions.includes(e));
      
      const promises = entitiesToFetch.map(entity => 
        apiClient.get(`/api/v1/${entity}`).then(res => ({
          entity,
          data: res.data || []
        }))
      );
      
      try {
        const results = await Promise.all(promises);
        const data = results.reduce((acc, curr) => {
          const camelCaseKey = kebabToCamel(curr.entity);
          acc[camelCaseKey] = curr.data;
          return acc;
        }, {});
        setDropdownData(data);
      } catch (error) {
        console.error("Failed to load form data", error);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    
    fetchDropdownData();
  }, [permissions]); // Rerun if permissions change (e.g., on login)

  // Populate form if we are editing
  useEffect(() => {
    if (initialData.id) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        locationId: initialData.locationId || '',
        departmentId: initialData.departmentId || '',
        managerId: initialData.managerId || '',
        jobRoleId: initialData.jobRoleId || '',
        employementTypeId: initialData.employementTypeId || '',
        teamId: initialData.teamId || '',
        costId: initialData.costId || '',
        hardwareAssetId: initialData.hardwareAssetId || '',
        onboardingBuddyId: initialData.onboardingBuddyId || '',
        accessLevelId: initialData.accessLevelId || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingDropdowns) {
    return <p>Loading form...</p>;
  }

  return (
    // ... (The outer modal div is the same)
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3>{initialData.id ? 'Edit Employee' : 'Create Employee'}</h3>
        {/* Basic text inputs */}
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

        {/* --- DYNAMIC DROPDOWNS --- */}
        {permissions.includes('locations') && (
          <SelectInput name="locationId" label="Location" value={formData.locationId} onChange={handleChange} options={dropdownData.locations || []} placeholder="Select a location..." />
        )}
        {permissions.includes('departments') && (
          <SelectInput name="departmentId" label="Department" value={formData.departmentId} onChange={handleChange} options={dropdownData.departments || []} placeholder="Select a department..." />
        )}
        {permissions.includes('managers') && (
          <SelectInput name="managerId" label="Manager" value={formData.managerId} onChange={handleChange} options={dropdownData.managers || []} placeholder="Select a manager..." />
        )}
        {permissions.includes('job-roles') && (
          <SelectInput name="jobRoleId" label="Job Role" value={formData.jobRoleId} onChange={handleChange} options={dropdownData.jobRoles || []} placeholder="Select a job role..." />
        )}
        {permissions.includes('employement-types') && (
            <SelectInput name="employementTypeId" label="Employement Type" value={formData.employementTypeId} onChange={handleChange} options={dropdownData.employementTypes || []} placeholder="Select an employment type..." />
        )}
        {permissions.includes('teams') && (
            <SelectInput name="teamId" label="Team" value={formData.teamId} onChange={handleChange} options={dropdownData.teams || []} placeholder="Select a team..." />

        )}
        {permissions.includes('costs') && (
            <SelectInput name="costId" label="Cost" value={formData.costId} onChange={handleChange} options={dropdownData.costs || []} placeholder="Select a cost..." />
        )}
        {permissions.includes('hardware-assets') && (
            <SelectInput name="hardwareAssetId" label="Hardware Asset" value={formData.hardwareAssetId} onChange={handleChange} options={dropdownData.hardwareAssets || []} placeholder="Select a hardware asset..." />
        )}
        {permissions.includes('onboarding-buddy') && (
            <SelectInput name="onboardingBuddyId" label="Onboarding Buddy" value={formData.onboardingBuddyId} onChange={handleChange} options={dropdownData.onboardingBuddy || []} placeholder="Select an onboarding buddy..." />
        )}
        {permissions.includes('access-levels') && (
            <SelectInput name="accessLevelId" label="Access Level" value={formData.accessLevelId} onChange={handleChange} options={dropdownData.accessLevels || []} placeholder="Select an access level..." />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
