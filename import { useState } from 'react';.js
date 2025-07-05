import { useState } from 'react';
import styles from './TableView.module.css';

export function TableView({ records, loading, onUpdate, onCreate, onDelete }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [newRecord, setNewRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (loading && records.length === 0) {
    return <div>Loading records...</div>;
  }

  if (records.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No records found in this table.</p>
        <button 
          className={styles.button}
          onClick={() => setNewRecord({})}
        >
          Create New Record
        </button>
      </div>
    );
  }

  // Get field names from the first record
  const fieldNames = Object.keys(records[0].fields || {});

  const handleEdit = (record) => {
    setEditingRecord({ ...record });
  };

  const handleSave = () => {
    onUpdate(editingRecord.id, editingRecord.fields);
    setEditingRecord(null);
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setNewRecord(null);
  };

  const handleCreateSave = () => {
    onCreate(newRecord);
    setNewRecord(null);
  };

  const handleFieldChange = (recordId, fieldName, value) => {
    if (editingRecord && editingRecord.id === recordId) {
      setEditingRecord({
        ...editingRecord,
        fields: {
          ...editingRecord.fields,
          [fieldName]: value
        }
      });
    } else if (newRecord) {
      setNewRecord({
        ...newRecord,
        [fieldName]: value
      });
    }
  };

  const handleDelete = (recordId) => {
    setConfirmDelete(recordId);
  };

  const confirmDeleteRecord = () => {
    if (confirmDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <div className={styles.tableContainer}>
      <h3>Table Records</h3>
      
      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className={styles.actions}>
              <button onClick={confirmDeleteRecord} className={styles.deleteButton}>
                Delete
              </button>
              <button onClick={cancelDelete} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {newRecord && (
        <div className={styles.editForm}>
          <h4>Create New Record</h4>
          {fieldNames.map(fieldName => (
            <div key={fieldName} className={styles.field}>
              <label>{fieldName}</label>
              <input 
                type="text"
                value={newRecord[fieldName] || ''}
                onChange={(e) => handleFieldChange(null, fieldName, e.target.value)}
              />
            </div>
          ))}
          <div className={styles.actions}>
            <button onClick={handleCreateSave} className={styles.saveButton}>
              Save
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <table className={styles.table}>
        <thead>
          <tr>
            {fieldNames.map(fieldName => (
              <th key={fieldName}>{fieldName}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => {
            const isEditing = editingRecord && editingRecord.id === record.id;
            
            return (
              <tr key={record.id}>
                {fieldNames.map(fieldName => (
                  <td key={`${record.id}-${fieldName}`}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingRecord.fields[fieldName] || ''}
                        onChange={(e) => 
                          handleFieldChange(record.id, fieldName, e.target.value)
                        }
                      />
                    ) : (
                      record.fields[fieldName]
                    )}
                  </td>
                ))}
                <td>
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSave}
                        className={styles.saveButton}
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEdit(record)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {!newRecord && (
        <button 
          className={styles.button}
          onClick={() => setNewRecord({})}
        >
          Create New Record
        </button>
      )}
    </div>
  );
}
