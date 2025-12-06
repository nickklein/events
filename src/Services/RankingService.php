<?php

namespace NickKlein\Events\Services;

use NickKlein\Events\Models\Event;

class RankingService
{
    public function calculateBestOptions(Event $event)
    {
        $event->load([
            'dates.votes',
            'locations.votes',
        ]);

        $bestDate = $this->findBestOption($event->dates);
        $bestLocation = $this->findBestOption($event->locations);

        return [
            'best_date' => $bestDate,
            'best_location' => $bestLocation,
        ];
    }

    protected function findBestOption($options)
    {
        if ($options->isEmpty()) {
            return null;
        }

        $sorted = $options->sortByDesc(function ($option) {
            return $option->score;
        })->values();

        $topScore = $sorted->first()->score;

        // Find all options with the top score (handles ties)
        $topOptions = $sorted->filter(function ($option) use ($topScore) {
            return $option->score === $topScore;
        })->values();

        // If there's a tie, return all tied options
        if ($topOptions->count() > 1) {
            return [
                'is_tie' => true,
                'options' => $topOptions,
                'score' => $topScore,
            ];
        }

        // Single winner
        return $topOptions->first();
    }

    public static function rankToScore($rank)
    {
        return max(0, 10 - $rank);
    }

    public function rankToScoreInstance($rank)
    {
        return self::rankToScore($rank);
    }

    public function getAllScores(Event $event)
    {
        $event->load([
            'dates.votes.participant',
            'locations.votes.participant',
        ]);

        $dateScores = $event->dates->map(function ($date) {
            return [
                'id' => $date->id,
                'date' => $date->date,
                'time_start' => $date->time_start,
                'time_end' => $date->time_end,
                'score' => $date->score,
                'vote_count' => $date->votes->count(),
            ];
        })->sortByDesc('score')->values();

        $locationScores = $event->locations->map(function ($location) {
            return [
                'id' => $location->id,
                'name' => $location->name,
                'address' => $location->address,
                'score' => $location->score,
                'vote_count' => $location->votes->count(),
            ];
        })->sortByDesc('score')->values();

        return [
            'dates' => $dateScores,
            'locations' => $locationScores,
        ];
    }
}
