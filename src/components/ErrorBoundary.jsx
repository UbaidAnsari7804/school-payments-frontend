// src/components/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // store stack for debug
    this.setState({ error, info });
    console.error('Uncaught error in component tree:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
          <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-6 rounded shadow max-w-lg">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm mb-4">An unexpected error occurred. See the console for details.</p>
            <details className="text-xs whitespace-pre-wrap">
              {this.state.error?.toString()}
              {'\n'}
              {this.state.info?.componentStack}
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
