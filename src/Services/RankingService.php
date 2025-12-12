<?php

namespace NickKlein\Events\Services;

use NickKlein\Events\Models\Event;

class RankingService
{
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

        // Single winner
        return $topOptions->first();
    }

    public static function rankToScore($rank)
    {
        return max(0, 10 - $rank);
    }
}
