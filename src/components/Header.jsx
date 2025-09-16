// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const loc = useLocation();
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navBtnClass = (active) =>
    `px-2 py-1 ${active ? 'bg-slate-100 dark:bg-slate-700 rounded' : ''}`;

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-semibold text-brand">School Payments</Link>
          <nav className="hidden md:flex gap-3 text-sm">
            <Link to="/" className={navBtnClass(loc.pathname === '/' || loc.pathname === '/dashboard')}>Transactions</Link>
            <Link to="/school" className={navBtnClass(loc.pathname === '/school')}>By School</Link>
            <Link to="/check" className={navBtnClass(loc.pathname === '/check')}>Check Status</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="text-sm hidden sm:block">Hi, <span className="font-medium">{user?.username || 'user'}</span></div>
              <button
                onClick={logout}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-brand text-white">Sign up</Link>
            </>
          )}

          {/* Theme toggle pill */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            className="relative inline-flex items-center w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 transition ml-1"
          >
            <span
              className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 transform transition ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
            />
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
    </header>
  );
}
