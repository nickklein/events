import React from 'react';

export default function Closed({ event }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Voting Closed</h2>
                <p className="text-gray-600 mb-4">
                    This event is no longer accepting votes.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4">
                    <div className="font-semibold text-gray-900">{event.title}</div>
                    {event.description && (
                        <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
