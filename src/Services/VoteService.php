<?php

namespace NickKlein\Events\Services;

use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventDateVote;
use NickKlein\Events\Models\EventLocationVote;
use NickKlein\Events\Models\EventParticipant;

class VoteService
{
    public function createVote(Event $event, array $validated): void
    {
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
    }
}
