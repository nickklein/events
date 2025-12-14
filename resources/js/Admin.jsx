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
        <div className="min-h-screen bg-gray-50 p-4 py-12">
            <Head title={`Results: ${event.title}`} />
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-end mb-4">
                    <a
                        href="/events/create"
                        className="text-gray-600 hover:text-gray-900 font-medium underline"
                    >
                        Create your event
                    </a>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
                    <div className="px-8 py-8 border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{event.title}</h1>
                        {event.description && (
                            <p className="text-gray-500 mb-4">{event.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                event.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {event.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                            <span className="text-gray-600">
                                {event.participants?.length || 0} {event.participants?.length === 1 ? 'vote' : 'votes'}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 mb-3">Share Links</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={copyPublicUrl}
                                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left flex items-center justify-between group transition-all border border-gray-200"
                                >
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Public Voting Link</div>
                                        <div className="text-xs text-gray-500 break-all mt-0.5">
                                            {window.location.origin}/event/{event.hash}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={copyAdminUrl}
                                    className="w-full p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-left flex items-center justify-between group transition-all border border-amber-200"
                                >
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Admin Link (Keep Secret!)</div>
                                        <div className="text-xs text-gray-600 break-all mt-0.5">
                                            {window.location.href}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {bestDate && bestLocation && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                                <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2">
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Date Rankings</h2>
                        <div className="space-y-3">
                            {dateScores.map((date, index) => (
                                <div key={date.id} className="border-l-4 border-gray-900 pl-4 py-2 bg-gray-50 rounded-r-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">
                                                #{index + 1} {date.date}
                                            </div>
                                            {date.time && (
                                                <div className="text-sm text-gray-500 mt-0.5">{date.time}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{date.score}</div>
                                            <div className="text-xs text-gray-500">score</div>
                                        </div>
                                    </div>
                                    {date.votes && date.votes.length > 0 && (
                                        <div className="mt-2 space-y-0.5">
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

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Location Rankings</h2>
                        <div className="space-y-3">
                            {locationScores.map((location, index) => (
                                <div key={location.id} className="border-l-4 border-gray-900 pl-4 py-2 bg-gray-50 rounded-r-lg">
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
                                                    className="text-sm text-gray-600 hover:text-gray-900 font-medium mt-0.5 inline-block"
                                                >
                                                    View on Maps
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{location.score}</div>
                                            <div className="text-xs text-gray-500">score</div>
                                        </div>
                                    </div>
                                    {location.votes && location.votes.length > 0 && (
                                        <div className="mt-2 space-y-0.5">
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

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h2>
                    <div className="flex gap-3 flex-wrap">
                        {event.status === 'active' && (
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                Close Voting
                            </button>
                        )}
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                Delete Event
                            </button>
                        ) : (
                            <div className="flex gap-3 items-center flex-wrap">
                                <span className="text-red-600 font-semibold">Are you sure?</span>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
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
