<?php

namespace NickKlein\Events\Models;

use Illuminate\Database\Eloquent\Model;
use NickKlein\Events\Services\RankingService;

class EventLocation extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'google_maps_url',
        'url',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function votes()
    {
        return $this->hasMany(EventLocationVote::class);
    }

    public function getScoreAttribute()
    {
        return $this->votes->sum(function ($vote) {
            return RankingService::rankToScore($vote->rank);
        });
    }
}
