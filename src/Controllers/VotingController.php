<?php

namespace NickKlein\Events\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Requests\StoreVoteRequest;
use NickKlein\Events\Resources\EventResource;
use NickKlein\Events\Services\VisitorService;
use NickKlein\Events\Services\VoteService;

class VotingController extends Controller
{
    public function show($hash, VisitorService $visitorService, VoteService $voteService)
    {
        $visitorId = $visitorService->getOrCreateVisitorId();

        $event = Event::with(['dates', 'locations'])
            ->where('hash', $hash)
            ->firstOrFail();

        if (!$event->isActive()) {
            return Inertia::render('Events/Closed', [
                'event' => $event,
            ]);
        }

        // Check if user already voted
        $existingParticipant = $voteService->findExistingParticipant($event, $visitorId);
        if ($existingParticipant) {
            return redirect()->route('events.vote.edit', ['hash' => $hash]);
        }

        return Inertia::render('Events/Vote', [
            'event' => EventResource::make($event)->resolve(),
        ]);
    }

    public function submitVote(StoreVoteRequest $request, $hash, VoteService $voteService, VisitorService $visitorService)
    {
        $event = Event::where('hash', $hash)->firstOrFail();

        if (!$event->isActive()) {
            return response()->json(['error' => 'Event is closed'], 403);
        }

        $validated = $request->validated();
        $visitorId = $visitorService->getOrCreateVisitorId();
        $voteService->createVote($event, $validated, $visitorId);

        return response()->json([
            'success' => true,
            'message' => 'Your vote has been recorded!',
        ]);
    }

    public function edit($hash, VisitorService $visitorService, VoteService $voteService)
    {
        $visitorId = $visitorService->getOrCreateVisitorId();

        $event = Event::with(['dates', 'locations'])
            ->where('hash', $hash)
            ->firstOrFail();

        if (!$event->isActive()) {
            return Inertia::render('Events/Closed', [
                'event' => $event,
            ]);
        }

        $participant = $voteService->findExistingParticipant($event, $visitorId);
        if (!$participant) {
            return redirect()->route('events.vote', ['hash' => $hash]);
        }

        // Format existing votes for the form
        $existingDateVotes = [];
        foreach ($participant->dateVotes as $vote) {
            $existingDateVotes[$vote->event_date_id] = $vote->rank;
        }

        $existingLocationVotes = [];
        foreach ($participant->locationVotes as $vote) {
            $existingLocationVotes[$vote->event_location_id] = $vote->rank;
        }

        return Inertia::render('Events/Vote', [
            'event' => EventResource::make($event)->resolve(),
            'isEditing' => true,
            'existingName' => $participant->name,
            'existingDateVotes' => $existingDateVotes,
            'existingLocationVotes' => $existingLocationVotes,
        ]);
    }

    public function update(StoreVoteRequest $request, $hash, VoteService $voteService, VisitorService $visitorService)
    {
        $event = Event::where('hash', $hash)->firstOrFail();

        if (!$event->isActive()) {
            return response()->json(['error' => 'Event is closed'], 403);
        }

        $visitorId = $visitorService->getOrCreateVisitorId();
        $participant = $voteService->findExistingParticipant($event, $visitorId);

        if (!$participant) {
            return response()->json(['error' => 'No existing vote found'], 404);
        }

        $validated = $request->validated();
        $voteService->updateVote($participant, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Your vote has been updated!',
        ]);
    }
}
