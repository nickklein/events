<?php

namespace NickKlein\Events\Models;

use Illuminate\Database\Eloquent\Model;
use NickKlein\Events\Services\RankingService;

class EventDate extends Model
{
    protected $fillable = [
        'event_id',
        'datetime',
    ];

    protected $casts = [
        'datetime' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function votes()
    {
        return $this->hasMany(EventDateVote::class);
    }

    public function getScoreAttribute()
    {
        return $this->votes->sum(function ($vote) {
            return RankingService::rankToScore($vote->rank);
        });
    }
}
