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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12 transition-colors duration-300">
            <Head title={`Your Vote: ${event.title}`} />
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-end mb-6">
                    <a
                        href="/events/create"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium underline underline-offset-4 transition-colors duration-200"
                        aria-label="Create a new event"
                    >
                        Create your event
                    </a>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">{event.title}</h1>
                        {event.description && (
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{event.description}</p>
                        )}
                    </div>

                    <div className="p-8">
                        {/* Success Message */}
                        <div className="mb-10 text-center">
                            <div
                                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-200"
                                aria-hidden="true"
                            >
                                <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Thanks for voting!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-base leading-relaxed">Your preferences have been successfully recorded.</p>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Your Vote</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                Here's what you selected, <span className="font-semibold text-gray-900 dark:text-gray-100">{existingName}</span>:
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">Your Date Preferences</h3>
                            <div className="space-y-3">
                                {sortedDateVotes.map((date) => (
                                    <div
                                        key={date.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-500"
                                    >
                                        <div className="text-gray-900 dark:text-gray-100 font-medium leading-snug">{date.display}</div>
                                        <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-800 flex items-center justify-center font-bold text-sm transition-transform duration-200 hover:scale-110" aria-label={`Ranked ${date.rank}`}>
                                            {date.rank}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">Your Location Preferences</h3>
                            <div className="space-y-3">
                                {sortedLocationVotes.map((location) => (
                                    <div
                                        key={location.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-500"
                                    >
                                        <div className="flex-1">
                                            <div className="text-gray-900 dark:text-gray-100 font-medium leading-snug">{location.name}</div>
                                            {location.google_maps_url && (
                                                <a
                                                    href={location.google_maps_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mt-1.5 inline-block transition-colors duration-200 underline-offset-2 hover:underline"
                                                    aria-label={`View ${location.name} on Google Maps`}
                                                >
                                                    View on Maps
                                                </a>
                                            )}
                                        </div>
                                        <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-800 flex items-center justify-center font-bold text-sm ml-4 transition-transform duration-200 hover:scale-110" aria-label={`Ranked ${location.rank}`}>
                                            {location.rank}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <a
                            href={`/event/${event.hash}/edit`}
                            className="block w-full py-3.5 rounded-lg font-semibold text-white dark:text-gray-800 bg-gray-900 dark:bg-gray-200 hover:bg-gray-800 dark:hover:bg-gray-300 text-center transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
                            aria-label="Edit your vote preferences"
                        >
                            Edit Your Vote
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
