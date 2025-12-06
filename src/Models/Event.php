<?php

namespace NickKlein\Events\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'hash',
        'admin_hash',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->hash)) {
                $event->hash = static::generateUniqueHash('hash');
            }
            if (empty($event->admin_hash)) {
                $event->admin_hash = static::generateUniqueHash('admin_hash');
            }
        });
    }

    protected static function generateUniqueHash($field)
    {
        do {
            $hash = Str::random(10);
        } while (static::where($field, $hash)->exists());

        return $hash;
    }

    public function dates()
    {
        return $this->hasMany(EventDate::class);
    }

    public function locations()
    {
        return $this->hasMany(EventLocation::class);
    }

    public function participants()
    {
        return $this->hasMany(EventParticipant::class);
    }

    public function getPublicUrlAttribute()
    {
        return route('events.vote', ['hash' => $this->hash]);
    }

    public function getAdminUrlAttribute()
    {
        return route('events.admin', ['adminHash' => $this->admin_hash]);
    }

    public function isActive()
    {
        return $this->status === 'active' &&
               ($this->expires_at === null || $this->expires_at->isFuture());
    }
}
