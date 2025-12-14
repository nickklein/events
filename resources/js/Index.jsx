import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ events }) {
    return (
        <div className="min-h-screen bg-gray-50 p-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-2">Events</h1>
                        <p className="text-gray-500 text-lg">Organize and coordinate with ease</p>
                    </div>
                    <Link
                        href="/events/create"
                        className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-200"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Event
                        </span>
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">No events yet</h2>
                        <p className="text-gray-500 mb-8 text-base max-w-md mx-auto">
                            Create your first event to start gathering votes from your friends and make planning effortless.
                        </p>
                        <Link
                            href="/events/create"
                            className="inline-block px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-200"
                        >
                            Create Your First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-bold text-xl text-gray-900 flex-1 leading-tight">
                                        {event.title}
                                    </h3>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                        event.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>

                                {event.description && (
                                    <p className="text-gray-500 text-sm mb-5 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}

                                <div className="space-y-2.5 mb-6">
                                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{event.dates?.length || 0} date options</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.locations?.length || 0} location options</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>{event.participants?.length || 0} votes</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/event/${event.hash}`;
                                            navigator.clipboard.writeText(url);
                                            alert('Public link copied!');
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
                                    >
                                        Copy Link
                                    </button>
                                    <a
                                        href={`/event/admin/${event.admin_hash}`}
                                        className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-colors text-center"
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
