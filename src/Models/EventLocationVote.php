<?php

namespace NickKlein\Events\Models;

use Illuminate\Database\Eloquent\Model;

class EventLocationVote extends Model
{
    protected $fillable = [
        'participant_id',
        'event_location_id',
        'rank',
    ];

    public function participant()
    {
        return $this->belongsTo(EventParticipant::class, 'participant_id');
    }

    public function eventLocation()
    {
        return $this->belongsTo(EventLocation::class, 'event_location_id');
    }
}
