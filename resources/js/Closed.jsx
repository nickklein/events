import React from 'react';
import { Head } from '@inertiajs/react';

export default function Closed({ event }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
            <Head title={`Voting Closed: ${event.title}`} />
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-10 max-w-md w-full text-center transition-all duration-300 animate-fade-in"
                role="alert"
                aria-live="polite"
            >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                    <svg
                        className="w-10 h-10 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Voting Closed</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base leading-relaxed">
                    This event is no longer accepting votes. The organizer has closed voting for this event.
                </p>
                <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">{event.title}</div>
                    {event.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{event.description}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
