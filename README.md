'use client';

import { useState, useEffect } from 'react';
import { TableView } from '../components/TableView';
import styles from './page.module.css';

export default function Home() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tables on load
    fetchTables();
  }, []);

  useEffect(() => {
    // Fetch records when a table is selected
    if (selectedTable) {
      fetchRecords(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tables');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      
      const data = await response.json();
      setTables(data.tables);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRecords = async (tableId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/records?tableId=${tableId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      setRecords(data.records);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
  };

  const updateRecord = async (recordId, fields) => {
    try {
      setLoading(true);
      const response = await fetch('/api/records', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: selectedTable,
          recordId,
          fields,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update record');
      }
      
      // Refresh records
      fetchRecords(selectedTable);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createRecord = async (fields) => {
    try {
      setLoading(true);
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: selectedTable,
          fields,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create record');
      }
      
      // Refresh records
      fetchRecords(selectedTable);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/records?tableId=${selectedTable}&recordId=${recordId}`, 
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
      
      // Refresh records
      fetchRecords(selectedTable);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Airtable Interactive Portal</h1>
      
      {error && <div className={styles.error}>Error: {error}</div>}
      
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2>Tables</h2>
          {loading && tables.length === 0 ? (
            <p>Loading tables...</p>
          ) : (
            <ul className={styles.tableList}>
              {tables.map((table) => (
                <li 
                  key={table.id}
                  className={selectedTable === table.id ? styles.selected : ''}
                  onClick={() => handleTableSelect(table.id)}
                >
                  {table.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className={styles.content}>
          {selectedTable ? (
            <TableView 
              records={records} 
              loading={loading} 
              onUpdate={updateRecord}
              onCreate={createRecord}
              onDelete={deleteRecord}
            />
          ) : (
            <p>Select a table to view records</p>
          )}
        </div>
      </div>
    </main>
  );
}

# LancetHub - Societal Resilience Framework

A web platform for The Lancet Commission on US Societal Resilience in a Global Pandemic Age, showcasing research, case studies, and resources.

## Setup Instructions

1. **Install Dependencies**

```bash
npm install
```

2. **Set Environment Variables**

Create a `.env.local` file in the root directory:
