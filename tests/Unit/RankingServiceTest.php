<?php

namespace NickKlein\Events\Tests\Unit;

use NickKlein\Events\Services\RankingService;
use NickKlein\Events\Tests\TestCase;

class RankingServiceTest extends TestCase
{
    public function testRankToScoreWithRank1()
    {
        // Best rank (1) should give highest score (9)
        $score = RankingService::rankToScore(1);
        $this->assertEquals(9, $score);
    }

    public function testRankToScoreWithRank10()
    {
        // Worst rank (10) should give lowest score (0)
        $score = RankingService::rankToScore(10);
        $this->assertEquals(0, $score);
    }

    public function testRankToScoreWithMidRanks()
    {
        // Test various middle ranks
        $this->assertEquals(8, RankingService::rankToScore(2));
        $this->assertEquals(7, RankingService::rankToScore(3));
        $this->assertEquals(5, RankingService::rankToScore(5));
        $this->assertEquals(3, RankingService::rankToScore(7));
        $this->assertEquals(1, RankingService::rankToScore(9));
    }

    public function testRankToScoreWithZero()
    {
        // Edge case: rank 0 should give maximum score (10)
        $score = RankingService::rankToScore(0);
        $this->assertEquals(10, $score);
    }

    public function testRankToScoreWithNegativeRank()
    {
        // Edge case: negative ranks should give high scores
        $score = RankingService::rankToScore(-5);
        $this->assertEquals(15, $score);
    }

    public function testRankToScoreWithRankGreaterThan10()
    {
        // Edge case: ranks > 10 should give 0 (max ensures non-negative)
        $score = RankingService::rankToScore(11);
        $this->assertEquals(0, $score);

        $score = RankingService::rankToScore(20);
        $this->assertEquals(0, $score);
    }

    public function testRankToScoreFormula()
    {
        // Verify the formula: max(0, 10 - rank) works correctly
        for ($rank = 1; $rank <= 10; $rank++) {
            $expectedScore = 10 - $rank;
            $actualScore = RankingService::rankToScore($rank);
            $this->assertEquals($expectedScore, $actualScore, "Rank {$rank} should produce score {$expectedScore}");
        }
    }
}
