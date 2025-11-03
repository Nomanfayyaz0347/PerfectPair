'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DebugInfo {
  environment: {
    MONGODB_URI: boolean;
  };
  database: {
    connectionStatus: string;
    profileCount: number;
    storageType: string;
    errorDetails?: string;
  };
}

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  const syncData = async () => {
    setLoading(true);
    setMessage('🔄 Syncing data between storage systems...');
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setMessage(`✅ Sync completed: MongoDB(${result.results.mongoProfiles}) ↔ Memory(${result.results.memoryProfiles})`);
      } else {
        setMessage(`❌ Sync failed: ${result.error}`);
      }
      setTimeout(checkHealth, 1000);
    } catch {
      setMessage('❌ Sync operation failed');
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    setMessage('🔍 Checking system health...');
    try {
      const response = await fetch('/api/health');
      const result = await response.json();
      
      const mongoStatus = result.environment.MONGODB_URI ? '✅ Connected' : '❌ Missing URI';
      const profileCount = result.database.profileCount;
      const storageType = result.database.storageType;
      
      setMessage(`Health: ${mongoStatus} | Storage: ${storageType} | Profiles: ${profileCount}`);
      setDebugInfo(result);
    } catch {
      setMessage('❌ Health check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚙️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">System Setup</h1>
          <p className="text-gray-600">Manage your PerfectPair system</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={checkHealth}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '🔍 Checking...' : '🏥 System Health Check'}
          </button>

          <button
            onClick={syncData}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '🔄 Syncing...' : '🔄 Sync Storage Systems'}
          </button>

          <Link
            href="/form"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
          >
            👤 Create New Profile
          </Link>

          <Link
            href="/admin"
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
          >
            📊 Admin Dashboard
          </Link>

          <Link
            href="/matches"
            className="block w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
          >
            💕 View Matches
          </Link>

          <Link
            href="/login"
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
          >
            🔐 Admin Login
          </Link>
        </div>

        {debugInfo && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">System Status:</h3>
            <div className="text-xs space-y-1">
              <div>
                <strong>MongoDB URI:</strong> {debugInfo.environment.MONGODB_URI ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>Connection:</strong> {debugInfo.database.connectionStatus}
              </div>
              <div>
                <strong>Profiles:</strong> {debugInfo.database.profileCount}
              </div>
              <div>
                <strong>Storage:</strong> {debugInfo.database.storageType}
              </div>
              {debugInfo.database.errorDetails && (
                <div className="text-red-600">
                  <strong>Error:</strong> {debugInfo.database.errorDetails}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            PerfectPair System Management v2.0
          </p>
        </div>
      </div>
    </div>
  );
}