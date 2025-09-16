// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SchoolTransactions from './pages/SchoolTransactions';
import CheckStatus from './pages/CheckStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          {/* You can keep '/' as Transactions dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/school" element={<SchoolTransactions />} />
          <Route path="/check" element={<CheckStatus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
