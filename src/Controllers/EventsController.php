<?php

namespace NickKlein\Events\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventDate;
use NickKlein\Events\Models\EventLocation;

class EventsController extends Controller
{
    public function index()
    {
        return Inertia::render('Events/Index');
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dates' => 'required|array|min:1',
            'dates.*.datetime' => 'required|date|after:yesterday',
            'locations' => 'required|array|min:1',
            'locations.*.name' => 'required|string|max:255',
            'locations.*.google_maps_url' => 'nullable|url',
            'expires_at' => 'nullable|date|after:yesterday',
        ]);

        // Clean up expires_at - if empty string, set to null
        if (empty($validated['expires_at'])) {
            $validated['expires_at'] = null;
        }

        $event = Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        foreach ($validated['dates'] as $dateData) {
            EventDate::create([
                'event_id' => $event->id,
                'datetime' => $dateData['datetime'],
            ]);
        }

        foreach ($validated['locations'] as $locationData) {
            EventLocation::create([
                'event_id' => $event->id,
                'name' => $locationData['name'],
                'google_maps_url' => $locationData['google_maps_url'] ?? null,
            ]);
        }

        return response()->json([
            'public_url' => $event->public_url,
            'admin_url' => $event->admin_url,
            'event' => $event->load(['dates', 'locations']),
        ]);
    }

    public function admin($adminHash)
    {
        $event = Event::with([
            'dates.votes.participant',
            'locations.votes.participant',
            'participants.dateVotes',
            'participants.locationVotes',
        ])->where('admin_hash', $adminHash)->firstOrFail();

        $dateScores = $event->dates->map(function ($date) {
            $hasTime = $date->datetime->format('H:i:s') !== '00:00:00';
            return [
                'id' => $date->id,
                'datetime' => $date->datetime->format('Y-m-d H:i'),
                'date' => $date->datetime->format('D, M j'),
                'time' => $hasTime ? $date->datetime->format('g:i A') : null,
                'score' => $date->score,
                'votes' => $date->votes->map(function ($vote) {
                    return [
                        'participant' => $vote->participant->name,
                        'rank' => $vote->rank,
                    ];
                }),
            ];
        })->sortByDesc('score')->values();

        $locationScores = $event->locations->map(function ($location) {
            return [
                'id' => $location->id,
                'name' => $location->name,
                'google_maps_url' => $location->google_maps_url,
                'score' => $location->score,
                'votes' => $location->votes->map(function ($vote) {
                    return [
                        'participant' => $vote->participant->name,
                        'rank' => $vote->rank,
                    ];
                }),
            ];
        })->sortByDesc('score')->values();

        // Check for ties
        $topDateScore = $dateScores->first()->score ?? 0;
        $topDates = $dateScores->filter(fn($d) => $d['score'] === $topDateScore)->values();

        $topLocationScore = $locationScores->first()->score ?? 0;
        $topLocations = $locationScores->filter(fn($l) => $l['score'] === $topLocationScore)->values();

        return Inertia::render('Events/Admin', [
            'event' => $event,
            'dateScores' => $dateScores,
            'locationScores' => $locationScores,
            'topDates' => $topDates,
            'topLocations' => $topLocations,
            'adminHash' => $adminHash,
        ]);
    }

    public function destroy($adminHash)
    {
        $event = Event::where('admin_hash', $adminHash)->firstOrFail();
        $event->delete();

        return redirect()->route('events.index');
    }

    public function close($adminHash)
    {
        $event = Event::where('admin_hash', $adminHash)->firstOrFail();
        $event->update(['status' => 'closed']);

        return back();
    }
}
