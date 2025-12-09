<?php

namespace NickKlein\Events\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Requests\StoreVoteRequest;
use NickKlein\Events\Services\VoteService;

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

    public function submitVote(StoreVoteRequest $request, $hash, VoteService $voteService)
    {
        $event = Event::where('hash', $hash)->firstOrFail();

        if (!$event->isActive()) {
            return response()->json(['error' => 'Event is closed'], 403);
        }

        $validated = $request->validated();
        $voteService->createVote($event, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Your vote has been recorded!',
        ]);
    }
}
