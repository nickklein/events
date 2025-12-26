import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import axios from 'axios';

export default function Create() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dates, setDates] = useState([{ date: '', time: '' }]);
    const [locations, setLocations] = useState([{ name: '', google_maps_url: '' }]);
    const [expiresAt, setExpiresAt] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const addDate = () => {
        setDates([...dates, { date: '', time: '' }]);
    };

    const removeDate = (index) => {
        setDates(dates.filter((_, i) => i !== index));
    };

    const updateDate = (index, field, value) => {
        const newDates = [...dates];
        newDates[index][field] = value;
        setDates(newDates);
    };

    const addLocation = () => {
        setLocations([...locations, { name: '', google_maps_url: '' }]);
    };

    const removeLocation = (index) => {
        setLocations(locations.filter((_, i) => i !== index));
    };

    const updateLocation = (index, field, value) => {
        const newLocations = [...locations];
        newLocations[index][field] = value;
        setLocations(newLocations);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const filteredDates = dates.filter(d => d.date).map(d => {
            // Combine date and time, or use midnight if no time specified
            const datetime = d.time ? `${d.date} ${d.time}:00` : `${d.date} 00:00:00`;
            return { datetime };
        });
        const filteredLocations = locations.filter(l => l.name);

        if (filteredDates.length === 0) {
            alert('Please add at least one date');
            setSubmitting(false);
            return;
        }

        if (filteredLocations.length === 0) {
            alert('Please add at least one location');
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(route('events.store'), {
                title,
                description,
                dates: filteredDates,
                locations: filteredLocations,
                expires_at: expiresAt && expiresAt.trim() !== '' ? expiresAt : null,
            });

            setResult(response.data);
        } catch (error) {
            console.error('Error creating event:', error);

            // Show validation errors if present
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorList = Object.values(errors).flat().join('\n');
                alert('Validation errors:\n\n' + errorList);
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                alert('Failed to create event: ' + errorMessage);
            }
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12 transition-colors duration-300">
                <Head title="Event Created!" />
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 transition-all duration-300">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-8 transition-colors duration-200" aria-hidden="true">
                                <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">Event Created!</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">Share these links with your friends</p>
                        </div>

                        <div className="space-y-5">
                            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base">Public Voting Link</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 break-all mb-4 font-mono bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">{result.public_url}</div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.public_url);
                                        alert('Copied!');
                                    }}
                                    className="inline-flex items-center px-5 py-2.5 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-lg font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                    aria-label="Copy public voting link"
                                >
                                    Copy Link
                                </button>
                            </div>

                            <div className="p-6 bg-amber-50 dark:bg-amber-900 rounded-lg border border-amber-200 dark:border-amber-700 transition-colors duration-200">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base">Admin Link (Keep Secret!)</div>
                                <div className="text-sm text-gray-600 dark:text-amber-300 break-all mb-4 font-mono bg-white dark:bg-amber-950 p-3 rounded border border-amber-200 dark:border-amber-800">{result.admin_url}</div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.admin_url);
                                        alert('Copied!');
                                    }}
                                    className="inline-flex items-center px-5 py-2.5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-amber-900 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                    aria-label="Copy admin link"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <a
                                href={result.admin_url}
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-lg font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
                                aria-label="View event results"
                            >
                                View Results
                            </a>
                            <a
                                href={route('events.create')}
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-lg font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow"
                                aria-label="Create another event"
                            >
                                Create Another
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12 transition-colors duration-300">
            <Head title="Create Event" />
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-10 transition-all duration-300">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-10 leading-tight">Create Event</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="event-title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Event Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="event-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm w-full transition-all duration-200"
                                placeholder="Weekend Hangout"
                                aria-required="true"
                            />
                        </div>

                        <div>
                            <label htmlFor="event-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Description
                            </label>
                            <textarea
                                id="event-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm w-full transition-all duration-200"
                                placeholder="Let's get together this weekend!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Possible Dates <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {dates.map((date, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <input
                                            type="date"
                                            value={date.date}
                                            onChange={(e) => updateDate(index, 'date', e.target.value)}
                                            required
                                            className="flex-1 px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200"
                                            aria-label={`Date option ${index + 1}`}
                                        />
                                        <input
                                            type="time"
                                            value={date.time}
                                            onChange={(e) => updateDate(index, 'time', e.target.value)}
                                            placeholder="Time (optional)"
                                            className="w-40 px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200"
                                            aria-label={`Time for date option ${index + 1}`}
                                        />
                                        {dates.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDate(index)}
                                                className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:shadow-sm"
                                                aria-label={`Remove date option ${index + 1}`}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addDate}
                                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
                                aria-label="Add another date option"
                            >
                                + Add Date
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Possible Locations/Activities <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-4">
                                {locations.map((location, index) => (
                                    <div key={index} className="p-5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                                        <div className="flex gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                required
                                                className="flex-1 px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200"
                                                placeholder="Location name (e.g., Joe's Pizza)"
                                                aria-label={`Location name ${index + 1}`}
                                            />
                                            {locations.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLocation(index)}
                                                    className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:shadow-sm"
                                                    aria-label={`Remove location ${index + 1}`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="url"
                                            value={location.url}
                                            onChange={(e) => updateLocation(index, 'google_maps_url', e.target.value)}
                                            className="w-full px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200"
                                            placeholder="URL (optional)"
                                            aria-label={`URL for location ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addLocation}
                                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
                                aria-label="Add another location option"
                            >
                                + Add Location
                            </button>
                        </div>

                        <div>
                            <label htmlFor="voting-deadline" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Voting Deadline (optional)
                            </label>
                            <input
                                id="voting-deadline"
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full px-4 py-3 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-lg shadow-sm transition-all duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-transparent rounded-lg font-semibold text-sm uppercase tracking-widest transition-all duration-200 ${
                                submitting
                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
                                    : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-md transform hover:scale-[1.02]'
                            }`}
                            aria-label={submitting ? 'Creating event' : 'Create event'}
                        >
                            {submitting && (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {submitting ? 'Creating...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
