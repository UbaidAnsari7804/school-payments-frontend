import React from 'react'

function asString(v) {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (v.$oid) return v.$oid;
  if (v._id) return v._id;
  if (v.toString && typeof v.toString === 'function') {
    const s = v.toString();
    const cleaned = s.replace(/^ObjectId\((?:'|")?/, '').replace(/(?:'|")?\)$/, '');
    return cleaned || s;
  }
  try { return JSON.stringify(v); } catch { return String(v); }
}

function CopyButton({ value }) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      alert('Copied order id')
    } catch {
      alert('Copy failed')
    }
  }
  return (
    <button onClick={onCopy} className="ml-2 text-xs px-2 py-1 bg-white/90 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-sm">
      Copy
    </button>
  )
}

export default function TransactionsTable({ data, onSort, sortField, sortOrder }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left cursor-pointer" onClick={() => onSort('custom_order_id')}>Order ID {sortField==='custom_order_id' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
            <th className="p-3 text-left">School ID</th>
            <th className="p-3 text-left">Gateway</th>
            <th className="p-3 text-right cursor-pointer" onClick={() => onSort('order_amount')}>Order Amt</th>
            <th className="p-3 text-right cursor-pointer" onClick={() => onSort('transaction_amount')}>Txn Amt</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Payment Time</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900">
          {data.map((row, i) => {
            // try multiple places for school id (normalized + raw nested paths)
            const schoolCandidate =
              row.school_id ??
              row.order?.school_id ??
              row.raw?.order?.school_id ??
              row.raw?.order?.school?._id ??
              row.raw?.school_id ??
              row.raw?.school;
            const schoolStr = asString(schoolCandidate) || '-';

            const orderId = row.custom_order_id || row.collect_id || row.collect_request_id || asString(row.collect_id) || '-';
            const paymentTime = row.payment_time ? new Date(row.payment_time).toLocaleString() : '-';

            return (
              <tr key={orderId + i}
                  className="group transform transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="p-3 align-top">{i+1}</td>

                <td className="p-3 align-top">
                  <div className="flex items-center">
                    <div className="truncate max-w-xs">{orderId}</div>
                    <div className="ml-2">
                      <CopyButton value={orderId} />
                    </div>
                  </div>
                </td>

                <td className="p-3 align-top">{schoolStr}</td>

                <td className="p-3 align-top">{row.gateway ?? row.order?.gateway ?? '-'}</td>
                <td className="p-3 align-top text-right">₹{row.order_amount ?? '-'}</td>
                <td className="p-3 align-top text-right">₹{row.transaction_amount ?? '-'}</td>
                <td className="p-3 align-top">
                  <span className={`px-2 py-1 rounded text-xs ${row.status === 'success' ? 'bg-green-100 text-green-700' : row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {row.status ?? '-'}
                  </span>
                </td>
                <td className="p-3 align-top">{paymentTime}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
