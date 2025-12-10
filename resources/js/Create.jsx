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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
                <Head title="Event Created!" />
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Created!</h2>
                            <p className="text-gray-600">Share these links with your friends</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="font-semibold text-gray-700 mb-2">Public Voting Link</div>
                                <div className="text-sm text-gray-600 break-all mb-2">{result.public_url}</div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.public_url);
                                        alert('Copied!');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                >
                                    Copy Link
                                </button>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                                <div className="font-semibold text-gray-700 mb-2">Admin Link (Keep Secret!)</div>
                                <div className="text-sm text-gray-600 break-all mb-2">{result.admin_url}</div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.admin_url);
                                        alert('Copied!');
                                    }}
                                    className="text-amber-600 hover:text-amber-700 text-sm font-semibold"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <a
                                href={result.admin_url}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-colors"
                            >
                                View Results
                            </a>
                            <a
                                href={route('events.create')}
                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-center transition-colors"
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
            <Head title="Create Event" />
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Event</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                                placeholder="Weekend Hangout"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                                placeholder="Let's get together this weekend!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Possible Dates *
                            </label>
                            <div className="space-y-3">
                                {dates.map((date, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <input
                                            type="date"
                                            value={date.date}
                                            onChange={(e) => updateDate(index, 'date', e.target.value)}
                                            required
                                            className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                                        />
                                        <input
                                            type="time"
                                            value={date.time}
                                            onChange={(e) => updateDate(index, 'time', e.target.value)}
                                            placeholder="Time (optional)"
                                            className="w-36 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                                        />
                                        {dates.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDate(index)}
                                                className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
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
                                className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                            >
                                + Add Date
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Possible Locations/Activities *
                            </label>
                            <div className="space-y-3">
                                {locations.map((location, index) => (
                                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg">
                                        <div className="flex gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                required
                                                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                                                placeholder="Location name (e.g., Joe's Pizza)"
                                            />
                                            {locations.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLocation(index)}
                                                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
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
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                                            placeholder="URL (optional)"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addLocation}
                                className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                            >
                                + Add Location
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Voting Deadline (optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                                submitting
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
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
