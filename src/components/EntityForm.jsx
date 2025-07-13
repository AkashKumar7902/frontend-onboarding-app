import React, { useState, useEffect } from 'react';

const EntityForm = ({ fields, onSubmit, initialData = {}, onCancel, title }) => {
  const [formData, setFormData] = useState({});

  // Initialize form state based on the fields config
  useEffect(() => {
    const initialState = {};
    fields.forEach(field => {
      initialState[field.name] = initialData[field.name] || '';
    });
    setFormData(initialState);
  }, [fields, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3>{title}</h3>
        {fields.map(field => (
          <div key={field.name} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EntityForm;
