import React from 'react';

export default function Pagination({ page = 1, totalPages = 1, setPage }) {
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));
  return (
    <div className="flex items-center justify-between mt-4">
      <div>Page {page} of {totalPages}</div>
      <div className="flex gap-2">
        <button onClick={prev} className="px-3 py-1 bg-white dark:bg-slate-700 rounded border">Prev</button>
        <button onClick={next} className="px-3 py-1 bg-white dark:bg-slate-700 rounded border">Next</button>
      </div>
    </div>
  );
}
