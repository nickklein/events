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
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12">
                <Head title="Event Created!" />
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Event Created!</h2>
                            <p className="text-gray-500 dark:text-gray-400">Share these links with your friends</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Public Voting Link</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 break-all mb-3">{result.public_url}</div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.public_url);
                                        alert('Copied!');
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    Copy Link
                                </button>
                            </div>

                            <div className="p-5 bg-amber-50 dark:bg-amber-900 rounded-md border border-amber-200 dark:border-amber-700">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Admin Link (Keep Secret!)</div>
                                <div className="text-sm text-gray-600 dark:text-amber-300 break-all mb-3">{result.admin_url}</div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.admin_url);
                                        alert('Copied!');
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-amber-900 transition ease-in-out duration-150"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <a
                                href={result.admin_url}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                View Results
                            </a>
                            <a
                                href={route('events.create')}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 py-12">
            <Head title="Create Event" />
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Create Event</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm w-full"
                                placeholder="Weekend Hangout"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm w-full"
                                placeholder="Let's get together this weekend!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Possible Dates *
                            </label>
                            <div className="space-y-3">
                                {dates.map((date, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <input
                                            type="date"
                                            value={date.date}
                                            onChange={(e) => updateDate(index, 'date', e.target.value)}
                                            required
                                            className="flex-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        <input
                                            type="time"
                                            value={date.time}
                                            onChange={(e) => updateDate(index, 'time', e.target.value)}
                                            placeholder="Time (optional)"
                                            className="w-36 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        {dates.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDate(index)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                + Add Date
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Possible Locations/Activities *
                            </label>
                            <div className="space-y-3">
                                {locations.map((location, index) => (
                                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                required
                                                className="flex-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                placeholder="Location name (e.g., Joe's Pizza)"
                                            />
                                            {locations.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLocation(index)}
                                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="url"
                                            value={location.url}
                                            onChange={(e) => updateLocation(index, 'google_maps_url', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            placeholder="URL (optional)"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addLocation}
                                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                + Add Location
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Voting Deadline (optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150 ${
                                submitting
                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed opacity-25'
                                    : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                            }`}
                        >
                            {submitting ? 'Creating...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
