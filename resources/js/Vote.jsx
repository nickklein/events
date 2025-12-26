import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import axios from 'axios';

export default function Vote({ event, isEditing = false, existingName = '', existingDateVotes = {}, existingLocationVotes = {} }) {
    const [step, setStep] = useState(1);
    const [dateVotes, setDateVotes] = useState(existingDateVotes);
    const [locationVotes, setLocationVotes] = useState(existingLocationVotes);
    const [name, setName] = useState(existingName);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleDateClick = (dateId) => {
        setDateVotes(prevVotes => {
            const currentRank = prevVotes[dateId];
            if (currentRank) {
                // Deselect: remove and rerank
                const newVotes = { ...prevVotes };
                delete newVotes[dateId];
                Object.keys(newVotes).forEach(key => {
                    if (newVotes[key] > currentRank) {
                        newVotes[key]--;
                    }
                });
                return newVotes;
            } else {
                // Select: add with next rank
                const nextRank = Object.keys(prevVotes).length + 1;
                if (nextRank > 10) {
                    alert('You can only rank up to 10 options');
                    return prevVotes;
                }
                return { ...prevVotes, [dateId]: nextRank };
            }
        });
    };

    const handleLocationClick = (locationId) => {
        setLocationVotes(prevVotes => {
            const currentRank = prevVotes[locationId];
            if (currentRank) {
                // Deselect: remove and rerank
                const newVotes = { ...prevVotes };
                delete newVotes[locationId];
                Object.keys(newVotes).forEach(key => {
                    if (newVotes[key] > currentRank) {
                        newVotes[key]--;
                    }
                });
                return newVotes;
            } else {
                // Select: add with next rank
                const nextRank = Object.keys(prevVotes).length + 1;
                if (nextRank > 10) {
                    alert('You can only rank up to 10 options');
                    return prevVotes;
                }
                return { ...prevVotes, [locationId]: nextRank };
            }
        });
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        if (Object.keys(dateVotes).length === 0) {
            alert('Please select at least one date');
            return;
        }

        if (Object.keys(locationVotes).length === 0) {
            alert('Please select at least one location');
            return;
        }

        setSubmitting(true);

        try {
            const method = isEditing ? 'put' : 'post';
            await axios[method](`/event/${event.hash}/vote`, {
                name: name.trim(),
                date_votes: Object.entries(dateVotes).map(([event_date_id, rank]) => ({
                    event_date_id: parseInt(event_date_id),
                    rank,
                })),
                location_votes: Object.entries(locationVotes).map(([event_location_id, rank]) => ({
                    event_location_id: parseInt(event_location_id),
                    rank,
                })),
            });

            // Redirect to the summary page
            router.visit(route('events.vote', { hash: event.hash }));
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'submitting'} vote:`, error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || `Failed to ${isEditing ? 'update' : 'submit'} vote`;
            alert(errorMessage);
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
                <Head title={isEditing ? "Vote Updated!" : "Thanks for voting!"} />
                <div className="max-w-md w-full">
                    <div className="flex justify-end mb-6">
                        <a
                            href="/events/create"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium underline underline-offset-4 transition-colors duration-200"
                            aria-label="Create a new event"
                        >
                            Create your event
                        </a>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-all duration-300">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-8 transition-colors duration-200" aria-hidden="true">
                            <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                            {isEditing ? "Vote Updated!" : "Thanks for voting!"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                            {isEditing ? "Your preferences have been updated." : "Your preferences have been recorded."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12 transition-colors duration-300">
            <Head title={`${isEditing ? 'Edit Vote' : 'Vote'}: ${event.title}`} />
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
                        <div className="flex items-center justify-between mb-4 gap-3">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{event.title}</h1>
                            {isEditing && (
                                <span className="text-sm bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-lg font-semibold text-blue-700 dark:text-blue-300 transition-colors duration-200">Editing</span>
                            )}
                        </div>
                        {event.description && (
                            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-6">{event.description}</p>
                        )}
                        <div className="flex gap-2 mt-6" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="3" aria-label="Voting progress">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                                        s <= step ? 'bg-gray-900 dark:bg-gray-200' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                                    aria-label={`Step ${s}${s === 1 ? ' - Choose dates' : s === 2 ? ' - Choose locations' : ' - Enter name'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {step === 1 && (
                        <DateStep
                            dates={event.dates}
                            votes={dateVotes}
                            onVote={handleDateClick}
                            onNext={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                        <LocationStep
                            locations={event.locations}
                            votes={locationVotes}
                            onVote={handleLocationClick}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}

                    {step === 3 && (
                        <NameStep
                            name={name}
                            onNameChange={setName}
                            onSubmit={handleSubmit}
                            onBack={() => setStep(2)}
                            submitting={submitting}
                            isEditing={isEditing}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function DateStep({ dates, votes, onVote, onNext }) {
    const hasVotes = Object.keys(votes).length > 0;

    return (
        <div className="p-8 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">When works for you?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Click to select your preferred dates. Click multiple times to rank them in order (1st choice, 2nd choice, etc.). Click again to remove.
            </p>

            <div className="space-y-3 mb-8">
                {dates.map((date) => {
                    const rank = votes[date.id];
                    const isSelected = rank !== undefined;

                    return (
                        <button
                            key={date.id}
                            onClick={() => onVote(date.id)}
                            className={`group w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                                isSelected
                                    ? 'border-gray-900 dark:border-gray-200 bg-gray-50 dark:bg-gray-700 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:shadow-sm'
                            }`}
                            aria-label={`${date.display}${isSelected ? `, ranked ${rank}` : ', not selected'}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 leading-snug transition-colors duration-200">{date.display}</div>
                                    {date.time_end && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Until {date.time_end}</div>
                                    )}
                                </div>
                                {isSelected && (
                                    <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-800 flex items-center justify-center font-bold text-sm transition-transform duration-200 group-hover:scale-110" aria-hidden="true">
                                        {rank}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={!hasVotes}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all duration-200 ${
                    hasVotes
                        ? 'bg-gray-900 dark:bg-gray-200 hover:bg-gray-800 dark:hover:bg-gray-300 text-white dark:text-gray-800 hover:shadow-md transform hover:scale-[1.02]'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
                }`}
                aria-label="Continue to location selection"
            >
                Next: Choose Location
            </button>
        </div>
    );
}

function LocationStep({ locations, votes, onVote, onNext, onBack }) {
    const hasVotes = Object.keys(votes).length > 0;

    return (
        <div className="p-8 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Where should we meet?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Select and rank your preferred venues or activities.
            </p>

            <div className="space-y-3 mb-8">
                {locations.map((location) => {
                    const rank = votes[location.id];
                    const isSelected = rank !== undefined;

                    return (
                        <button
                            key={location.id}
                            onClick={() => onVote(location.id)}
                            className={`group w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                                isSelected
                                    ? 'border-gray-900 dark:border-gray-200 bg-gray-50 dark:bg-gray-700 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:shadow-sm'
                            }`}
                            aria-label={`${location.name}${isSelected ? `, ranked ${rank}` : ', not selected'}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 leading-snug transition-colors duration-200">{location.name}</div>
                                    {location.google_maps_url && (
                                        <a
                                            href={location.google_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mt-1.5 inline-block transition-colors duration-200 underline-offset-2 hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label={`View ${location.name} on Google Maps`}
                                        >
                                            View on Maps
                                        </a>
                                    )}
                                </div>
                                {isSelected && (
                                    <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-800 flex items-center justify-center font-bold text-sm ml-4 transition-transform duration-200 group-hover:scale-110 flex-shrink-0" aria-hidden="true">
                                        {rank}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-3.5 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-sm"
                    aria-label="Go back to date selection"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasVotes}
                    className={`flex-1 py-3.5 rounded-lg font-semibold transition-all duration-200 ${
                        hasVotes
                            ? 'bg-gray-900 dark:bg-gray-200 hover:bg-gray-800 dark:hover:bg-gray-300 text-white dark:text-gray-800 hover:shadow-md transform hover:scale-[1.02]'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    aria-label="Continue to enter your name"
                >
                    Next: Your Name
                </button>
            </div>
        </div>
    );
}

function NameStep({ name, onNameChange, onSubmit, onBack, submitting, isEditing = false }) {
    return (
        <div className="p-8 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Almost done!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {isEditing ? "Update your name if needed." : "Enter your name so others know who voted."}
            </p>

            <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm mb-8 transition-all duration-200"
                autoFocus
                aria-label="Your name"
                required
            />

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className="flex-1 py-3.5 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                    aria-label="Go back to location selection"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={!name.trim() || submitting}
                    className={`flex-1 py-3.5 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 ${
                        name.trim() && !submitting
                            ? 'bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-800 text-white hover:shadow-md transform hover:scale-[1.02]'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    aria-label={submitting ? (isEditing ? 'Updating your vote' : 'Submitting your vote') : (isEditing ? 'Update your vote' : 'Submit your vote')}
                >
                    {submitting && (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {submitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Vote' : 'Submit Vote')}
                </button>
            </div>
        </div>
    );
}
