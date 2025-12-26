import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';

export default function Admin({ event, dateScores, locationScores, topDates, topLocations, adminHash }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [copiedPublic, setCopiedPublic] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);

    const handleClose = () => {
        router.post(`/event/admin/${adminHash}/close`);
    };

    const handleDelete = () => {
        router.delete(`/event/admin/${adminHash}`);
    };

    const copyPublicUrl = () => {
        const url = `${window.location.origin}/event/${event.hash}`;
        navigator.clipboard.writeText(url);
        setCopiedPublic(true);
        setTimeout(() => setCopiedPublic(false), 2000);
        alert('Public voting link copied to clipboard!');
    };

    const copyAdminUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2000);
        alert('Admin link copied to clipboard!');
    };

    const bestDate = dateScores?.[0];
    const bestLocation = locationScores?.[0];
    const hasDateTie = topDates && topDates.length > 1;
    const hasLocationTie = topLocations && topLocations.length > 1;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12 transition-colors duration-300">
            <Head title={`Results: ${event.title}`} />
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-end mb-6">
                    <a
                        href="/events/create"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium underline underline-offset-4 transition-colors duration-200"
                        aria-label="Create a new event"
                    >
                        Create your event
                    </a>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-all duration-300">
                    <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">{event.title}</h1>
                        {event.description && (
                            <p className="text-gray-500 dark:text-gray-400 mb-5 text-base leading-relaxed">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4">
                            <span className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                                event.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                                {event.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {event.participants?.length || 0} {event.participants?.length === 1 ? 'vote' : 'votes'}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">Share Links</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={copyPublicUrl}
                                    className="w-full p-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-left flex items-center justify-between group transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:shadow-sm"
                                    aria-label="Copy public voting link"
                                >
                                    <div className="flex-1 min-w-0 mr-3">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{copiedPublic ? 'Link Copied!' : 'Public Voting Link'}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 break-all font-mono">
                                            {window.location.origin}/event/{event.hash}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={copyAdminUrl}
                                    className="w-full p-5 bg-amber-50 dark:bg-amber-900 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg text-left flex items-center justify-between group transition-all duration-200 border border-amber-200 dark:border-amber-700 hover:shadow-sm"
                                    aria-label="Copy admin link"
                                >
                                    <div className="flex-1 min-w-0 mr-3">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{copiedAdmin ? 'Link Copied!' : 'Admin Link (Keep Secret!)'}</div>
                                        <div className="text-xs text-gray-600 dark:text-amber-300 break-all font-mono">
                                            {window.location.href}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {bestDate && bestLocation && (
                            <div className="bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-lg p-8 mb-10 transition-all duration-200 hover:shadow-sm">
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-xl mb-6 flex items-center gap-3 leading-tight">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Top Picks (Based on Votes)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-green-700 dark:text-emerald-300 font-semibold mb-1">
                                            {hasDateTie ? `Tie: ${topDates.length} Dates` : 'Best Date'}
                                        </div>
                                        {hasDateTie ? (
                                            <div className="space-y-2">
                                                {topDates.map((date, idx) => (
                                                    <div key={idx}>
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">{date.date}</div>
                                                        {date.time && (
                                                            <div className="text-sm text-gray-600 dark:text-gray-300">{date.time}</div>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="text-sm text-green-700 dark:text-emerald-300 mt-1">Score: {topDates[0].score}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="font-bold text-gray-900 dark:text-gray-100">{bestDate.date}</div>
                                                {bestDate.time && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">{bestDate.time}</div>
                                                )}
                                                <div className="text-sm text-green-700 dark:text-emerald-300 mt-1">Score: {bestDate.score}</div>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm text-green-700 dark:text-emerald-300 font-semibold mb-1">
                                            {hasLocationTie ? `Tie: ${topLocations.length} Locations` : 'Best Location'}
                                        </div>
                                        {hasLocationTie ? (
                                            <div className="space-y-2">
                                                {topLocations.map((location, idx) => (
                                                    <div key={idx}>
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">{location.name}</div>
                                                        {location.google_maps_url && (
                                                            <a
                                                                href={location.google_maps_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                            >
                                                                View on Maps
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="text-sm text-green-700 dark:text-emerald-300 mt-1">Score: {topLocations[0].score}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="font-bold text-gray-900 dark:text-gray-100">{bestLocation.name}</div>
                                                {bestLocation.google_maps_url && (
                                                    <a
                                                        href={bestLocation.google_maps_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                    >
                                                        View on Maps
                                                    </a>
                                                )}
                                                <div className="text-sm text-green-700 dark:text-emerald-300 mt-1">Score: {bestLocation.score}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Date Rankings</h2>
                        <div className="space-y-3">
                            {dateScores.map((date, index) => (
                                <div key={date.id} className="border-l-4 border-gray-900 dark:border-gray-200 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                #{index + 1} {date.date}
                                            </div>
                                            {date.time && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{date.time}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900 dark:text-gray-100">{date.score}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">score</div>
                                        </div>
                                    </div>
                                    {date.votes && date.votes.length > 0 && (
                                        <div className="mt-2 space-y-0.5">
                                            {date.votes.map((vote, i) => (
                                                <div key={i} className="text-xs text-gray-600 dark:text-gray-400">
                                                    {vote.participant}: #{vote.rank} choice
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Location Rankings</h2>
                        <div className="space-y-3">
                            {locationScores.map((location, index) => (
                                <div key={location.id} className="border-l-4 border-gray-900 dark:border-gray-200 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                #{index + 1} {location.name}
                                            </div>
                                            {location.google_maps_url && (
                                                <a
                                                    href={location.google_maps_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium mt-0.5 inline-block"
                                                >
                                                    View on Maps
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900 dark:text-gray-100">{location.score}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">score</div>
                                        </div>
                                    </div>
                                    {location.votes && location.votes.length > 0 && (
                                        <div className="mt-2 space-y-0.5">
                                            {location.votes.map((vote, i) => (
                                                <div key={i} className="text-xs text-gray-600 dark:text-gray-400">
                                                    {vote.participant}: #{vote.rank} choice
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">Admin Actions</h2>
                    <div className="flex gap-4 flex-wrap">
                        {event.status === 'active' && (
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-800 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                aria-label="Close voting for this event"
                            >
                                Close Voting
                            </button>
                        )}
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-3 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                aria-label="Delete this event"
                            >
                                Delete Event
                            </button>
                        ) : (
                            <div className="flex gap-4 items-center flex-wrap">
                                <span className="text-red-600 dark:text-red-400 font-bold text-lg">Are you sure?</span>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                    aria-label="Confirm delete event"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-200 hover:shadow-sm"
                                    aria-label="Cancel delete"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
