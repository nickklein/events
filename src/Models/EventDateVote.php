<?php

namespace NickKlein\Events\Models;

use Illuminate\Database\Eloquent\Model;

class EventDateVote extends Model
{
    protected $fillable = [
        'participant_id',
        'event_date_id',
        'rank',
    ];

    public function participant()
    {
        return $this->belongsTo(EventParticipant::class, 'participant_id');
    }

    public function eventDate()
    {
        return $this->belongsTo(EventDate::class, 'event_date_id');
    }
}
