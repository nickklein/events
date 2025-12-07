import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';

export default function Admin({ event, dateScores, locationScores, topDates, topLocations, adminHash }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleClose = () => {
        router.post(`/event/admin/${adminHash}/close`);
    };

    const handleDelete = () => {
        router.delete(`/event/admin/${adminHash}`);
    };

    const copyPublicUrl = () => {
        const url = `${window.location.origin}/event/${event.hash}`;
        navigator.clipboard.writeText(url);
        alert('Public voting link copied to clipboard!');
    };

    const copyAdminUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Admin link copied to clipboard!');
    };

    const bestDate = dateScores?.[0];
    const bestLocation = locationScores?.[0];
    const hasDateTie = topDates && topDates.length > 1;
    const hasLocationTie = topLocations && topLocations.length > 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
            <Head title={`Results: ${event.title}`} />
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-end mb-4">
                    <a
                        href="/events/create"
                        className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                        Create your event
                    </a>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                        {event.description && (
                            <p className="text-blue-100 mb-4">{event.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                event.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                                {event.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                            <span className="text-blue-100">
                                {event.participants?.length || 0} {event.participants?.length === 1 ? 'vote' : 'votes'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-3">Share Links</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={copyPublicUrl}
                                    className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left flex items-center justify-between group transition-colors"
                                >
                                    <div>
                                        <div className="text-sm font-semibold text-gray-700">Public Voting Link</div>
                                        <div className="text-xs text-gray-500 break-all">
                                            {window.location.origin}/event/{event.hash}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={copyAdminUrl}
                                    className="w-full p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-left flex items-center justify-between group transition-colors"
                                >
                                    <div>
                                        <div className="text-sm font-semibold text-gray-700">Admin Link (Keep Secret!)</div>
                                        <div className="text-xs text-gray-500 break-all">
                                            {window.location.href}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {bestDate && bestLocation && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                                <h3 className="font-bold text-green-900 text-lg mb-3 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Top Picks (Based on Votes)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-green-700 font-semibold mb-1">
                                            {hasDateTie ? `Tie: ${topDates.length} Dates` : 'Best Date'}
                                        </div>
                                        {hasDateTie ? (
                                            <div className="space-y-2">
                                                {topDates.map((date, idx) => (
                                                    <div key={idx}>
                                                        <div className="font-bold text-gray-900">{date.date}</div>
                                                        {date.time && (
                                                            <div className="text-sm text-gray-600">{date.time}</div>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="text-sm text-green-700 mt-1">Score: {topDates[0].score}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="font-bold text-gray-900">{bestDate.date}</div>
                                                {bestDate.time && (
                                                    <div className="text-sm text-gray-600">{bestDate.time}</div>
                                                )}
                                                <div className="text-sm text-green-700 mt-1">Score: {bestDate.score}</div>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm text-green-700 font-semibold mb-1">
                                            {hasLocationTie ? `Tie: ${topLocations.length} Locations` : 'Best Location'}
                                        </div>
                                        {hasLocationTie ? (
                                            <div className="space-y-2">
                                                {topLocations.map((location, idx) => (
                                                    <div key={idx}>
                                                        <div className="font-bold text-gray-900">{location.name}</div>
                                                        {location.google_maps_url && (
                                                            <a
                                                                href={location.google_maps_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 hover:text-blue-700"
                                                            >
                                                                View on Maps
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="text-sm text-green-700 mt-1">Score: {topLocations[0].score}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="font-bold text-gray-900">{bestLocation.name}</div>
                                                {bestLocation.google_maps_url && (
                                                    <a
                                                        href={bestLocation.google_maps_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-700"
                                                    >
                                                        View on Maps
                                                    </a>
                                                )}
                                                <div className="text-sm text-green-700 mt-1">Score: {bestLocation.score}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Date Rankings</h2>
                        <div className="space-y-3">
                            {dateScores.map((date, index) => (
                                <div key={date.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">
                                                #{index + 1} {date.date}
                                            </div>
                                            {date.time && (
                                                <div className="text-sm text-gray-500">{date.time}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600">{date.score}</div>
                                            <div className="text-xs text-gray-500">score</div>
                                        </div>
                                    </div>
                                    {date.votes && date.votes.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {date.votes.map((vote, i) => (
                                                <div key={i} className="text-xs text-gray-600">
                                                    {vote.participant}: #{vote.rank} choice
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Location Rankings</h2>
                        <div className="space-y-3">
                            {locationScores.map((location, index) => (
                                <div key={location.id} className="border-l-4 border-purple-500 pl-4 py-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">
                                                #{index + 1} {location.name}
                                            </div>
                                            {location.google_maps_url && (
                                                <a
                                                    href={location.google_maps_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    View on Maps
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-purple-600">{location.score}</div>
                                            <div className="text-xs text-gray-500">score</div>
                                        </div>
                                    </div>
                                    {location.votes && location.votes.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {location.votes.map((vote, i) => (
                                                <div key={i} className="text-xs text-gray-600">
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

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
                    <div className="flex gap-3">
                        {event.status === 'active' && (
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Close Voting
                            </button>
                        )}
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Delete Event
                            </button>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <span className="text-red-600 font-semibold">Are you sure?</span>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
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
