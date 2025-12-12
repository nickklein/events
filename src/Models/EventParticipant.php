<?php

namespace NickKlein\Events\Models;

use Illuminate\Database\Eloquent\Model;

class EventParticipant extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'visitor_id',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function dateVotes()
    {
        return $this->hasMany(EventDateVote::class, 'participant_id');
    }

    public function locationVotes()
    {
        return $this->hasMany(EventLocationVote::class, 'participant_id');
    }
}
