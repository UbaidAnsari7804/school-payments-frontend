import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="p-2 border rounded bg-white dark:bg-slate-700" />
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="p-2 border rounded bg-white dark:bg-slate-700" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
