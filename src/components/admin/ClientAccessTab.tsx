'use client';

import { ClientAccess } from './types';

interface ClientAccessTabProps {
  clients: ClientAccess[];
  loading: boolean;
  onDeleteClick: (client: ClientAccess) => void;
}

export default function ClientAccessTab({
  clients,
  loading,
  onDeleteClick,
}: ClientAccessTabProps) {
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-1 mb-3">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <p className="text-sm text-gray-600">Loading clients...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-purple-600 text-2xl">👥</span>
        </div>
        <p className="font-medium mb-2">No Client Access Created Yet</p>
        <p className="text-sm">Create client access from any profile to let them view their matches</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {clients.map((client: ClientAccess) => (
        <div key={client._id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900">{client.name}</h3>
                {client.isActive ? (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">📧 {client.email}</p>
              {client.profileId && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>👤</span>
                  <span>Profile: {typeof client.profileId === 'object' ? client.profileId.name : 'N/A'}</span>
                  {typeof client.profileId === 'object' && (
                    <>
                      <span>•</span>
                      <span>{client.profileId.gender}</span>
                      <span>•</span>
                      <span>{client.profileId.age} yrs</span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(client.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div className="flex-shrink-0 ml-3">
              <button
                onClick={() => onDeleteClick(client)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                title="Delete client access"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
