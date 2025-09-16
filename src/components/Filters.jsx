import React from 'react'

export default function Filters({
  status,
  setStatus,
  schools = [],      // array of school IDs (strings)
  schoolId,
  setSchoolId,
  from,
  setFrom,
  to,
  setTo
}) {
  const common = "px-3 py-2 border rounded bg-white text-slate-900 placeholder-slate-400 border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
      <select value={status} onChange={e => setStatus(e.target.value)} className={common}>
        <option value="">All Status</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>

      <select value={schoolId} onChange={e => setSchoolId(e.target.value)} className={common}>
        <option value="">All School IDs</option>
        {schools.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="flex items-center gap-2">
        <label className="sr-only">From</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={`${common} appearance-none`} />
        <label className="sr-only">To</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className={`${common} appearance-none`} />
      </div>
    </div>
  )
}
