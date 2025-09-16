import React, { useState } from 'react';
import api from '../api/api';
import { normalizeTransaction } from '../utils/normalize';

export default function CheckStatus() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);

  const check = async () => {
    if (!id) return;
    setResult(null);
    try {
      const endpoints = [
        `/transactions/status/${encodeURIComponent(id)}`,
        `/transaction-status/${encodeURIComponent(id)}`,
        `/order-status/${encodeURIComponent(id)}`,
        `/payments/status/${encodeURIComponent(id)}`,
      ];

      let res = null;
      for (const ep of endpoints) {
        try {
          const tmp = await api.get(ep);
          if (tmp && tmp.status === 200 && tmp.data != null) {
            res = tmp;
            break;
          }
        } catch (_) { /* try next */ }
      }

      if (!res) throw new Error('No endpoint returned data');
      console.log("CheckStatus payload:", res.data);

      console.log('Check status raw:', res.data);
      const payload = res.data?.data ?? res.data ?? res.data?.order_info ?? res.data;
      console.log("CheckStatus payload extracted:", payload);

      if (Array.isArray(payload)) {
        setResult({ list: payload.map(normalizeTransaction) });
      } else if (typeof payload === 'object') {
        setResult(normalizeTransaction(payload));
      } else {
        setResult(payload);
      }
    } catch (err) {
      console.error('check status error', err);
      setResult({ error: err?.response?.data ?? err.message ?? String(err) });
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Check Transaction Status</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="custom_order_id"
          className="px-3 py-2 border rounded bg-white dark:bg-slate-700"
        />
        <button onClick={check} className="px-3 py-2 bg-blue-600 text-white rounded">
          Check
        </button>
      </div>

      <pre className="bg-white dark:bg-slate-800 p-4 rounded">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
