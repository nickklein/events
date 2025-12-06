<?php

namespace NickKlein\Events\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventParticipant;
use NickKlein\Events\Models\EventDateVote;
use NickKlein\Events\Models\EventLocationVote;

class VotingController extends Controller
{
    public function show($hash)
    {
        $event = Event::with(['dates', 'locations'])
            ->where('hash', $hash)
            ->firstOrFail();

        if (!$event->isActive()) {
            return Inertia::render('Events/Closed', [
                'event' => $event,
            ]);
        }

        return Inertia::render('Events/Vote', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'hash' => $event->hash,
                'dates' => $event->dates->map(function ($date) {
                    $hasTime = $date->datetime->format('H:i:s') !== '00:00:00';
                    return [
                        'id' => $date->id,
                        'datetime' => $date->datetime->format('Y-m-d H:i'),
                        'display' => $hasTime
                            ? $date->datetime->format('D, M j \a\t g:i A')
                            : $date->datetime->format('D, M j'),
                    ];
                }),
                'locations' => $event->locations->map(function ($location) {
                    return [
                        'id' => $location->id,
                        'name' => $location->name,
                        'google_maps_url' => $location->google_maps_url,
                    ];
                }),
            ],
        ]);
    }

    public function submitVote(Request $request, $hash)
    {
        $event = Event::where('hash', $hash)->firstOrFail();

        if (!$event->isActive()) {
            return response()->json(['error' => 'Event is closed'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date_votes' => 'required|array',
            'date_votes.*.event_date_id' => 'required|exists:event_dates,id',
            'date_votes.*.rank' => 'required|integer|min:1|max:10',
            'location_votes' => 'required|array',
            'location_votes.*.event_location_id' => 'required|exists:event_locations,id',
            'location_votes.*.rank' => 'required|integer|min:1|max:10',
        ]);

        // Validate date ranks are unique and sequential
        $dateRanks = array_column($validated['date_votes'], 'rank');
        sort($dateRanks);
        $expectedDateRanks = range(1, count($dateRanks));
        if ($dateRanks !== $expectedDateRanks) {
            return response()->json([
                'error' => 'Invalid date ranks - must be sequential starting at 1 with no duplicates or gaps'
            ], 422);
        }

        // Validate location ranks are unique and sequential
        $locationRanks = array_column($validated['location_votes'], 'rank');
        sort($locationRanks);
        $expectedLocationRanks = range(1, count($locationRanks));
        if ($locationRanks !== $expectedLocationRanks) {
            return response()->json([
                'error' => 'Invalid location ranks - must be sequential starting at 1 with no duplicates or gaps'
            ], 422);
        }

        $participant = EventParticipant::create([
            'event_id' => $event->id,
            'name' => $validated['name'],
        ]);

        foreach ($validated['date_votes'] as $vote) {
            EventDateVote::create([
                'participant_id' => $participant->id,
                'event_date_id' => $vote['event_date_id'],
                'rank' => $vote['rank'],
            ]);
        }

        foreach ($validated['location_votes'] as $vote) {
            EventLocationVote::create([
                'participant_id' => $participant->id,
                'event_location_id' => $vote['event_location_id'],
                'rank' => $vote['rank'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Your vote has been recorded!',
        ]);
    }
}
