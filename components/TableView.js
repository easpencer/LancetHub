'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import styles from './TableView.module.css';

export function TableView({
  records = [],
  loading = false,
  onUpdate,
  onCreate,
  onDelete
}) {
  const [editingId, setEditingId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [formData, setFormData] = useState({});
  const [newRecordData, setNewRecordData] = useState({});
  const [fieldHeaders, setFieldHeaders] = useState([]);
  
  // Determine field headers from first record
  useEffect(() => {
    if (records && records.length > 0) {
      // Get all fields from the first record
      const firstRecord = records[0];
      if (firstRecord) {
        // Filter out id field and any fields that start with _
        const fields = Object.keys(firstRecord).filter(
          field => field !== 'id' && !field.startsWith('_')
        );
        setFieldHeaders(fields);
      }
    }
  }, [records]);
  
  const handleEdit = (record) => {
    // Clone the record to avoid modifying the original
    setFormData({ ...record });
    setEditingId(record.id);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };
  
  const handleSaveEdit = async () => {
    try {
      // Remove id from the data to be sent
      const { id, ...fieldsToUpdate } = formData;
      await onUpdate(id, fieldsToUpdate);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving record:', error);
      // Show error message
    }
  };
  
  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      await onDelete(recordId);
    }
  };
  
  const handleStartCreate = () => {
    // Initialize new record with empty values for all fields
    const emptyRecord = {};
    fieldHeaders.forEach(field => {
      emptyRecord[field] = '';
    });
    
    setNewRecordData(emptyRecord);
    setCreatingNew(true);
  };
  
  const handleCancelCreate = () => {
    setCreatingNew(false);
    setNewRecordData({});
  };
  
  const handleSaveNew = async () => {
    try {
      await onCreate(newRecordData);
      setCreatingNew(false);
      setNewRecordData({});
    } catch (error) {
      console.error('Error creating record:', error);
      // Show error message
    }
  };
  
  const handleInputChange = (e, recordId) => {
    const { name, value } = e.target;
    
    if (recordId) {
      // Editing existing record
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    } else {
      // Creating new record
      setNewRecordData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="loading-animation">
          <div></div><div></div><div></div><div></div>
        </div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (records.length === 0 && !creatingNew) {
    return (
      <div className={styles.emptyState}>
        <p>No records found.</p>
        <button 
          className={styles.createButton} 
          onClick={handleStartCreate}
        >
          <FaPlus /> Create New Record
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2>Records</h2>
        <button 
          className={styles.createButton} 
          onClick={handleStartCreate}
          disabled={creatingNew}
        >
          <FaPlus /> Create New Record
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {fieldHeaders.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th className={styles.actionsColumn}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* New record form */}
            {creatingNew && (
              <tr className={styles.editingRow}>
                {fieldHeaders.map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      name={field}
                      value={newRecordData[field] || ''}
                      onChange={(e) => handleInputChange(e)}
                      className={styles.editInput}
                    />
                  </td>
                ))}
                <td className={styles.actions}>
                  <button
                    onClick={handleSaveNew}
                    className={styles.saveButton}
                    aria-label="Save new record"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={handleCancelCreate}
                    className={styles.cancelButton}
                    aria-label="Cancel create"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            )}
          
            {/* Existing records */}
            {records.map((record) => (
              <tr key={record.id} className={editingId === record.id ? styles.editingRow : ''}>
                {fieldHeaders.map((field) => (
                  <td key={field}>
                    {editingId === record.id ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(e, record.id)}
                        className={styles.editInput}
                      />
                    ) : (
                      <span className={styles.cellContent}>
                        {record[field] || '-'}
                      </span>
                    )}
                  </td>
                ))}
                <td className={styles.actions}>
                  {editingId === record.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className={styles.saveButton}
                        aria-label="Save changes"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={styles.cancelButton}
                        aria-label="Cancel edit"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(record)}
                        className={styles.editButton}
                        aria-label="Edit record"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className={styles.deleteButton}
                        aria-label="Delete record"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
