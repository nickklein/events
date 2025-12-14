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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Head title={isEditing ? "Vote Updated!" : "Thanks for voting!"} />
                <div className="max-w-md w-full">
                    <div className="flex justify-end mb-4">
                        <a
                            href="/events/create"
                            className="text-gray-600 hover:text-gray-900 font-medium underline"
                        >
                            Create your event
                        </a>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isEditing ? "Vote Updated!" : "Thanks for voting!"}
                        </h2>
                        <p className="text-gray-500">
                            {isEditing ? "Your preferences have been updated." : "Your preferences have been recorded."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 py-12">
            <Head title={`${isEditing ? 'Edit Vote' : 'Vote'}: ${event.title}`} />
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-end mb-4">
                    <a
                        href="/events/create"
                        className="text-gray-600 hover:text-gray-900 font-medium underline"
                    >
                        Create your event
                    </a>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="px-8 py-8 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                            {isEditing && (
                                <span className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg font-semibold text-gray-700">Editing</span>
                            )}
                        </div>
                        {event.description && (
                            <p className="text-gray-500 text-base">{event.description}</p>
                        )}
                        <div className="flex gap-2 mt-6">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                                        s <= step ? 'bg-gray-900' : 'bg-gray-200'
                                    }`}
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
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">When works for you?</h2>
            <p className="text-gray-500 mb-6">
                Tap to select. Tap again to rank (1st, 2nd, 3rd...). Tap once more to remove.
            </p>

            <div className="space-y-3 mb-8">
                {dates.map((date) => {
                    const rank = votes[date.id];
                    const isSelected = rank !== undefined;

                    return (
                        <button
                            key={date.id}
                            onClick={() => onVote(date.id)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-900">{date.display}</div>
                                    {date.time_end && (
                                        <div className="text-sm text-gray-500 mt-0.5">Until {date.time_end}</div>
                                    )}
                                </div>
                                {isSelected && (
                                    <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
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
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                    hasVotes
                        ? 'bg-gray-900 hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                Next: Choose Location
            </button>
        </div>
    );
}

function LocationStep({ locations, votes, onVote, onNext, onBack }) {
    const hasVotes = Object.keys(votes).length > 0;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Where should we meet?</h2>
            <p className="text-gray-500 mb-6">
                Select your preferred venues or activities.
            </p>

            <div className="space-y-3 mb-8">
                {locations.map((location) => {
                    const rank = votes[location.id];
                    const isSelected = rank !== undefined;

                    return (
                        <button
                            key={location.id}
                            onClick={() => onVote(location.id)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{location.name}</div>
                                    {location.google_maps_url && (
                                        <a
                                            href={location.google_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-gray-600 hover:text-gray-900 font-medium mt-0.5 inline-block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View on Maps
                                        </a>
                                    )}
                                </div>
                                {isSelected && (
                                    <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm ml-4">
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
                    className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasVotes}
                    className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                        hasVotes
                            ? 'bg-gray-900 hover:bg-gray-800'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    Next: Your Name
                </button>
            </div>
        </div>
    );
}

function NameStep({ name, onNameChange, onSubmit, onBack, submitting, isEditing = false }) {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost done!</h2>
            <p className="text-gray-500 mb-6">
                {isEditing ? "Update your name if needed." : "Enter your name so others know who voted."}
            </p>

            <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Your name"
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none mb-8 transition-all"
                autoFocus
            />

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={!name.trim() || submitting}
                    className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                        name.trim() && !submitting
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {submitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Vote' : 'Submit Vote')}
                </button>
            </div>
        </div>
    );
}
