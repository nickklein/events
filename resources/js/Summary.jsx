import React from 'react';
import { Head } from '@inertiajs/react';

export default function Summary({ event, existingName, existingDateVotes, existingLocationVotes }) {
    // Sort dates and locations by rank
    const sortedDateVotes = event.dates
        .filter(date => existingDateVotes[date.id])
        .map(date => ({ ...date, rank: existingDateVotes[date.id] }))
        .sort((a, b) => a.rank - b.rank);

    const sortedLocationVotes = event.locations
        .filter(location => existingLocationVotes[location.id])
        .map(location => ({ ...location, rank: existingLocationVotes[location.id] }))
        .sort((a, b) => a.rank - b.rank);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
            <Head title={`Your Vote: ${event.title}`} />
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-end mb-4">
                    <a
                        href="/events/create"
                        className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                        Create your event
                    </a>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                        {event.description && (
                            <p className="text-blue-100">{event.description}</p>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Vote</h2>
                            <p className="text-gray-600 mb-4">
                                Thanks for voting, <span className="font-semibold">{existingName}</span>! Here's what you selected:
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Date Preferences</h3>
                            <div className="space-y-2">
                                {sortedDateVotes.map((date) => (
                                    <div
                                        key={date.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gray-100 border border-gray-200"
                                    >
                                        <div className="text-gray-700">{date.display}</div>
                                        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">
                                            {date.rank}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Location Preferences</h3>
                            <div className="space-y-2">
                                {sortedLocationVotes.map((location) => (
                                    <div
                                        key={location.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gray-100 border border-gray-200"
                                    >
                                        <div>
                                            <div className="text-gray-700">{location.name}</div>
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
                                        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">
                                            {location.rank}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <a
                            href={`/event/${event.hash}/edit`}
                            className="block w-full py-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 text-center transition-all"
                        >
                            Edit Your Vote
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
