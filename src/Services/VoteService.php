<?php

namespace NickKlein\Events\Services;

use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventDateVote;
use NickKlein\Events\Models\EventLocationVote;
use NickKlein\Events\Models\EventParticipant;

class VoteService
{
    public function findExistingParticipant(Event $event, string $visitorId): ?EventParticipant
    {
        return EventParticipant::where('event_id', $event->id)
            ->where('visitor_id', $visitorId)
            ->with(['dateVotes', 'locationVotes'])
            ->first();
    }

    public function createVote(Event $event, array $validated, string $visitorId): void
    {
        $participant = EventParticipant::create([
            'event_id' => $event->id,
            'name' => $validated['name'],
            'visitor_id' => $visitorId,
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
    }

    public function updateVote(EventParticipant $participant, array $validated): void
    {
        $participant->update([
            'name' => $validated['name'],
        ]);

        // Delete existing votes
        $participant->dateVotes()->delete();
        $participant->locationVotes()->delete();

        // Create new votes
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
    }
}
