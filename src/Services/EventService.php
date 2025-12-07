<?php

namespace NickKlein\Events\Services;

use NickKlein\Events\Models\Event;

class EventService
{
    public function getLatestEvents($limit = 5)
    {
        return Event::where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'admin_url' => $event->admin_url,
                    'public_url' => $event->public_url,
                    'expires_at' => $event->expires_at?->format('M j, Y'),
                ];
            });
    }
}
