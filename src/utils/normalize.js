// src/utils/normalize.js
export function normalizeTransaction(r = {}) {
  const order = r.order || r.order_info || r.order_doc || r.orderDetails || {};
  const statusObj = r.order_status || r.status_info || r.payment_status || r.statusDoc || {};

  const read = (obj, ...keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (obj == null) continue;
      if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
      const alt = Object.keys(obj).find(x => x.toLowerCase() === k.toLowerCase());
      if (alt) return obj[alt];
    }
    return undefined;
  };

  const collect_id =
    r.collect_id ||
    r.collectRequestId ||
    r.collect_request_id ||
    statusObj.collect_id ||
    read(order, '_id', 'id', 'collect_id', 'collectRequestId') ||
    r._id ||
    null;

  const custom_order_id =
    r.custom_order_id ||
    r.customOrderId ||
    read(order, 'custom_order_id', 'customOrderId', 'order_id', 'orderId') ||
    read(r, 'order_id', 'orderId') ||
    collect_id ||
    null;

  // robust school_id resolution
  let school_id =
    r.school_id ||
    r.schoolId ||
    read(order, 'school_id', 'schoolId') ||
    read(order, 'school') ||
    read(order, 'school', '_id') ||
    r.school ||
    r.school_name ||
    null;

  // If the school value is an object (ObjectId or nested doc), try to extract a string id
  if (school_id && typeof school_id === 'object') {
    if (school_id._id) school_id = school_id._id;
    else if (school_id.id) school_id = school_id.id;
    else if (school_id.$oid) school_id = school_id.$oid;
    else if (school_id.toString && typeof school_id.toString === 'function') {
      const s = school_id.toString();
      const cleaned = s.replace(/^ObjectId\((?:'|")?/, '').replace(/(?:'|")?\)$/, '');
      school_id = cleaned || s;
    }
  }

  const gateway =
    r.gateway ||
    read(order, 'gateway', 'gateway_name', 'gatewayName') ||
    read(statusObj, 'gateway') ||
    r.gateway_name ||
    r.payment_mode ||
    null;

  const toNumber = (v) => {
    if (v == null) return null;
    if (typeof v === 'number') return v;
    const n = Number(String(v).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  };

  const order_amount =
    toNumber(r.order_amount ?? r.orderAmount ?? read(order, 'order_amount', 'amount', 'total') ?? read(statusObj, 'order_amount'));

  const transaction_amount =
    toNumber(r.transaction_amount ?? r.transactionAmount ?? read(statusObj, 'transaction_amount', 'amount') ?? r.amount ?? r.txn_amount);

  let st =
    r.status ??
    statusObj.status ??
    read(statusObj, 'payment_status') ??
    read(r, 'payment_status') ??
    null;
  if (typeof st === 'string') st = st.trim().toLowerCase();

  let payment_time =
    r.payment_time ??
    statusObj.payment_time ??
    statusObj.paymentTime ??
    order.payment_time ??
    order.paymentTime ??
    null;
  try { if (payment_time) { const d = new Date(payment_time); if (!isNaN(d.getTime())) payment_time = d.toISOString(); } } catch(e){}

  return {
    collect_id: collect_id ?? null,
    custom_order_id: custom_order_id ?? null,
    school_id: school_id ?? null,
    gateway: gateway ?? null,
    order_amount: order_amount,
    transaction_amount: transaction_amount,
    status: st ?? null,
    payment_time: payment_time ?? null,
    raw: r,
  };
}

export default normalizeTransaction;
