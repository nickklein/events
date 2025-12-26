import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ events }) {
    const [copiedId, setCopiedId] = React.useState(null);

    const handleCopyLink = (eventId, hash) => {
        const url = `${window.location.origin}/event/${hash}`;
        navigator.clipboard.writeText(url);
        setCopiedId(eventId);
        setTimeout(() => setCopiedId(null), 2000);
        alert('Public link copied!');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 py-12 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Events</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">Organize and coordinate with ease</p>
                    </div>
                    <Link
                        href="/events/create"
                        className="inline-flex items-center px-5 py-2.5 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-lg font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                        aria-label="Create a new event"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-20 text-center transition-all duration-300">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-8 transition-colors duration-200" aria-hidden="true">
                            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">No events yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-10 text-base max-w-md mx-auto leading-relaxed">
                            Create your first event to start gathering votes from your friends and make planning effortless.
                        </p>
                        <Link
                            href="/events/create"
                            className="inline-flex items-center px-6 py-3 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-lg font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                            aria-label="Create your first event"
                        >
                            Create Your First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-start justify-between mb-5 gap-3">
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 flex-1 leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
                                        {event.title}
                                    </h3>
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        event.status === 'active'
                                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>

                                {event.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                        {event.description}
                                    </p>
                                )}

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{event.dates?.length || 0} date option{event.dates?.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.locations?.length || 0} location option{event.locations?.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>{event.participants?.length || 0} vote{event.participants?.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleCopyLink(event.id, event.hash)}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-lg font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition-all duration-200 hover:shadow"
                                        aria-label={`Copy public link for ${event.title}`}
                                    >
                                        {copiedId === event.id ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <a
                                        href={`/event/admin/${event.admin_hash}`}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-lg font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                        aria-label={`Manage ${event.title}`}
                                    >
                                        Manage
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
