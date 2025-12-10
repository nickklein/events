<?php

namespace NickKlein\Events\Services;

use Illuminate\Support\Collection;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventDate;
use NickKlein\Events\Models\EventLocation;

class EventService
{
    /**
     * Create a new event with associated dates and locations.
     *
     * @param array $validated Validated event data containing title, description, dates, locations, and expires_at
     * @return Event The created event with loaded dates and locations relationships
     */
    public function createEvent(array $validated): Event
    {
        $event = Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        foreach ($validated['dates'] as $dateData) {
            EventDate::create([
                'event_id' => $event->id,
                'datetime' => $dateData['datetime'],
            ]);
        }

        foreach ($validated['locations'] as $locationData) {
            EventLocation::create([
                'event_id' => $event->id,
                'name' => $locationData['name'],
                'url' => $locationData['url'] ?? null,
            ]);
        }

        return $event->load(['dates', 'locations']);
    }

    /**
     * Get formatted event data for the admin view.
     *
     * Retrieves the event with all votes and participants, then formats
     * date and location scores including vote details and identifies winners.
     *
     * @param string $adminHash The admin hash to identify the event
     * @return array Contains event, dateScores, locationScores, topDates, and topLocations
     */
    public function getAdminEventData(string $adminHash): array
    {
        $event = Event::with([
            'dates.votes.participant',
            'locations.votes.participant',
            'participants.dateVotes',
            'participants.locationVotes',
        ])->where('admin_hash', $adminHash)->firstOrFail();

        $dateScores = $this->formatDateScores($event->dates);
        $locationScores = $this->formatLocationScores($event->locations);

        return [
            'event' => $event,
            'dateScores' => $dateScores,
            'locationScores' => $locationScores,
            'topDates' => $this->findTopByScore($dateScores),
            'topLocations' => $this->findTopByScore($locationScores),
        ];
    }

    /**
     * Format event dates with scores and vote details.
     *
     * Transforms EventDate models into formatted arrays with human-readable
     * date/time strings, scores, and associated votes, sorted by score.
     *
     * @param Collection $dates Collection of EventDate models
     * @return Collection Sorted collection of formatted date arrays with id, datetime, date, time, score, and votes
     */
    protected function formatDateScores(Collection $dates): Collection
    {
        return $dates->map(function ($date) {
            $hasTime = $date->datetime->format('H:i:s') !== '00:00:00';
            return [
                'id' => $date->id,
                'datetime' => $date->datetime->format('Y-m-d H:i'),
                'date' => $date->datetime->format('D, M j'),
                'time' => $hasTime ? $date->datetime->format('g:i A') : null,
                'score' => $date->score,
                'votes' => $this->formatVotes($date->votes),
            ];
        })->sortByDesc('score')->values();
    }

    /**
     * Format event locations with scores and vote details.
     *
     * Transforms EventLocation models into formatted arrays with location
     * details, scores, and associated votes, sorted by score.
     *
     * @param Collection $locations Collection of EventLocation models
     * @return Collection Sorted collection of formatted location arrays with id, name, google_maps_url, score, and votes
     */
    protected function formatLocationScores(Collection $locations): Collection
    {
        return $locations->map(function ($location) {
            return [
                'id' => $location->id,
                'name' => $location->name,
                'url' => $location->url,
                'score' => $location->score,
                'votes' => $this->formatVotes($location->votes),
            ];
        })->sortByDesc('score')->values();
    }

    /**
     * Format votes with participant details.
     *
     * Transforms Vote models into simple arrays containing participant
     * names and their rankings.
     *
     * @param Collection $votes Collection of Vote models
     * @return Collection Collection of formatted vote arrays with participant and rank
     */
    protected function formatVotes(Collection $votes): Collection
    {
        return $votes->map(function ($vote) {
            return [
                'participant' => $vote->participant->name,
                'rank' => $vote->rank,
            ];
        });
    }

    /**
     * Find all items with the highest score.
     *
     * Filters a sorted collection to return only items matching the top score.
     * Handles ties automatically by returning all items with the highest score.
     *
     * @param Collection $scores Collection of items with 'score' keys, assumed to be sorted by score descending
     * @return Collection Collection of items matching the highest score
     */
    protected function findTopByScore(Collection $scores): Collection
    {
        // Get the score from the first item (highest score, already sorted)
        // If the collection is empty, default to 0
        $topScore = $scores->first()['score'] ?? 0;

        // Filter to keep only items that match the top score
        // This handles ties - if multiple items have the same top score, they all stay
        // ->values() reindexes the array with consecutive keys (0, 1, 2...)
        return $scores->filter(fn($item) => $item['score'] === $topScore)->values();
    }

    /**
     * Get the latest active events.
     *
     * Retrieves active events that haven't expired, ordered by creation date.
     * Returns formatted arrays with basic event details and URLs.
     *
     * @param int $limit Maximum number of events to retrieve (default: 5)
     * @return Collection Collection of formatted event arrays with id, title, admin_url, public_url, and expires_at
     */
    public function getLatestEvents(int $limit = 5): Collection
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
