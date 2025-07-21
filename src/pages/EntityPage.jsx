import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { entityConfig } from '../config/entityConfig';
import apiClient from '../services/api';
import EntityForm from '../components/EntityForm';

const kebabToCamel = (str) => {
  return str.replace(/-(\w)/g, (_, char) => char.toUpperCase());
};

const EntityPage = () => {
  // Get the entity type from the URL, e.g., "locations", "departments"
  const { entitySlug } = useParams(); 
  const config = entityConfig[kebabToCamel(entitySlug)];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/v1/${entitySlug}`);
      setItems(response.data || []);
    } catch (error) {
      console.error(`Failed to fetch ${entitySlug}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entitySlug]); // Re-fetch if the user navigates to a different entity page

  const handleFormSubmit = async (formData) => {
    const method = editingItem ? 'put' : 'post';
    const url = editingItem ? `/api/v1/${entitySlug}/${editingItem.id}` : `/api/v1/${entitySlug}`;
    
    try {
      await apiClient[method](url, formData);
      setShowForm(false);
      setEditingItem(null);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to save item', error);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiClient.delete(`/api/v1/${entitySlug}/${itemId}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete item', error);
      }
    }
  };
  
  if (!config) return <h2>Unknown Entity: {entitySlug}</h2>;
  if (loading) return <p>Loading {config.title}...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manage {config.title}</h1>
        <button onClick={() => { setEditingItem(null); setShowForm(true); }}>Create New</button>
      </div>

      {showForm && (
        <EntityForm
          fields={config.fields}
          onSubmit={handleFormSubmit}
          initialData={editingItem || {}}
          onCancel={() => setShowForm(false)}
          title={editingItem ? `Edit ${config.title}` : `Create ${config.title}`}
        />
      )}

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            {config.listColumns.map(col => <th key={col.accessor} style={{ textAlign: 'left', padding: '8px' }}>{col.header}</th>)}
            <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              {config.listColumns.map(col => <td key={col.accessor} style={{ padding: '8px' }}>{item[col.accessor]}</td>)}
              <td style={{ padding: '8px' }}>
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntityPage;
