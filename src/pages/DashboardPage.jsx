import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

const kebabToCamel = (str) => {
  return str.replace(/-(\w)/g, (_, char) => char.toUpperCase());
};


// A simple reusable Stat Card component
const StatCard = ({ title, value }) => (
  <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <p style={{ fontSize: '2em', margin: '10px 0 0 0' }}>{value}</p>
  </div>
);

function DashboardPage() {
  const { logout, permissions } = useAuth(); // Get permissions from context
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We could create a dedicated `/dashboard/stats` endpoint for even better performance,
    // but for now, we can fetch counts individually for enabled entities.
    const fetchStats = async () => {
      setLoading(true);
      const statPromises = permissions.map(entity => 
        apiClient.get(`/api/v1/${entity}`).then(res => ({
          entity,
          count: (res.data || []).length
        }))
      );
      
      try {
        const results = await Promise.all(statPromises);
        const newStats = results.reduce((acc, curr) => {
        const camelCaseKey = kebabToCamel(curr.entity); // e.g., "job-roles" -> "jobRoles"
          acc[camelCaseKey] = curr.count;
          return acc;
        }, {});
        setStats(newStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (permissions.length > 0) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [permissions]);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>
      
      {loading ? <p>Loading dashboard...</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {/* Conditionally render stat cards based on permissions */}
          {permissions.includes('employees') && <StatCard title="Employees" value={stats.employees ?? '...'} />}
          {permissions.includes('locations') && <StatCard title="Locations" value={stats.locations ?? '...'} />}
          {permissions.includes('departments') && <StatCard title="Departments" value={stats.departments ?? '...'} />}
          {permissions.includes('managers') && <StatCard title="Managers" value={stats.managers ?? '...'} />}
          {permissions.includes('job-roles') && <StatCard title="Job Roles" value={stats.jobRoles ?? '...'} />}
          {permissions.includes('employement-types') && <StatCard title="Employment Types" value={stats.employementTypes ?? '...'} />}
          {permissions.includes('teams') && <StatCard title="Teams" value={stats.teams ?? '...'} />}
          {permissions.includes('costs') && <StatCard title="Costs" value={stats.costs ?? '...'} />}
          {permissions.includes('hardware-assets') && <StatCard title="Hardware Assets" value={stats.hardwareAssets ?? '...'} />} 
          {permissions.includes('onboarding-buddy') && <StatCard title="Onboarding Buddy" value={stats.onboardingBuddy ?? '...'} />}
          {permissions.includes('access-levels') && <StatCard title="Access Levels" value={stats.accessLevels ?? '...'} />}
        {permissions}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;