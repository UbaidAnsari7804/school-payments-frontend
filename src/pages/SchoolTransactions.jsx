import React, { useState } from 'react';
import api from '../api/api';
import TransactionsTable from '../components/TransactionsTable';
import { normalizeTransaction } from '../utils/normalize';

export default function SchoolTransactions() {
  const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState([]);

  async function fetchBySchool() {
    if (!schoolId) return;
    try {
      const res = await api.get(`/transactions/school/${schoolId}`);
      console.log('/transactions/school raw:', res.data);
      const payload = res.data?.data ?? res.data ?? [];
      const normalized = (Array.isArray(payload) ? payload : []).map(normalizeTransaction);
      setData(normalized);
    } catch (err) {
      console.error('fetchBySchool error', err?.response?.data ?? err);
      setData([]);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Transactions By School</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={schoolId}
          onChange={e => setSchoolId(e.target.value)}
          placeholder="Enter school id"
          className="px-3 py-2 border rounded bg-white dark:bg-slate-700"
        />
        <button onClick={fetchBySchool} className="px-3 py-2 bg-blue-600 text-white rounded">
          Fetch
        </button>
      </div>

      <TransactionsTable data={data} onSort={() => {}} />
    </div>
  );
}
