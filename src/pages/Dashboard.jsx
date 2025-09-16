import React, { useEffect, useState } from 'react';
import Filters from '../components/Filters';
import TransactionsTable from '../components/TransactionsTable';
import Pagination from '../components/Pagination';
import useDebounce from '../hooks/useDebounce';
import api from '../api/api';
import { normalizeTransaction } from '../utils/normalize';

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 400);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [sortField, setSortField] = useState('payment_time');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // removed TypeScript annotation to keep this pure JS
        const params = { page, limit, sort: sortField, order };
        if (status) params.status = status;
        if (schoolId) params.school_id = schoolId;
        if (from) params.from = from;
        if (to) params.to = to;
        if (debSearch) params.search = debSearch;

        const res = await api.get('/transactions', { params });
        // debug logs (remove after testing)
        console.log('API /transactions raw response:', res.data);

        const payload = res.data?.data ?? res.data ?? [];
        const normalized = (Array.isArray(payload) ? payload : []).map(normalizeTransaction);

        setData(normalized);
        setTotal(res.data?.total ?? res.data?.totalCount ?? null);

        // build list of unique school IDs from returned rows
        setSchools(prev => {
          const s = Array.from(new Set(normalized.map(x => x.school_id).filter(Boolean)));
          return s.length ? s : prev;
        });
      } catch (err) {
        console.error('fetch transactions error:', err?.response?.data ?? err);
        setData([]);
        setTotal(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, limit, status, schoolId, from, to, debSearch, sortField, order]);

  const onSort = (field) => {
    if (sortField === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setOrder('desc'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order id..."
          className="px-3 py-2 border rounded bg-white dark:bg-slate-700"
        />
      </div>

      <Filters
        status={status}
        setStatus={setStatus}
        schools={schools}
        schoolId={schoolId}
        setSchoolId={setSchoolId}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />

      {loading
        ? <div>Loading...</div>
        : <TransactionsTable data={data} onSort={onSort} sortField={sortField} sortOrder={order} />
      }

      <Pagination
        page={page}
        totalPages={ total ? Math.ceil(total / limit) : Math.max(1, Math.ceil((data?.length || 0) / limit)) }
        setPage={setPage}
      />
    </div>
  );
}
