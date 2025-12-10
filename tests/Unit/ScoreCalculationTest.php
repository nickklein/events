<?php

namespace NickKlein\Events\Tests\Unit;

use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventDate;
use NickKlein\Events\Models\EventDateVote;
use NickKlein\Events\Models\EventLocation;
use NickKlein\Events\Models\EventLocationVote;
use NickKlein\Events\Models\EventParticipant;
use NickKlein\Events\Tests\TestCase;

class ScoreCalculationTest extends TestCase
{
    protected Event $event;

    public function setUp(): void
    {
        parent::setUp();

        $this->event = Event::create([
            'title' => 'Test Event',
            'description' => 'Test Description',
        ]);
    }

    public function testEventDateScoreWithNoVotes()
    {
        // Arrange
        $date = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(1),
        ]);

        // Act
        $score = $date->score;

        // Assert
        $this->assertEquals(0, $score);
    }

    public function testEventDateScoreWithSingleVote()
    {
        // Arrange
        $date = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(1),
        ]);

        $participant = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'John Doe',
        ]);

        EventDateVote::create([
            'participant_id' => $participant->id,
            'event_date_id' => $date->id,
            'rank' => 1, // Rank 1 = score 9
        ]);

        // Act - refresh to load votes
        $date = $date->fresh(['votes']);
        $score = $date->score;

        // Assert
        $this->assertEquals(9, $score);
    }

    public function testEventDateScoreWithMultipleVotes()
    {
        // Arrange
        $date = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(1),
        ]);

        $participant1 = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Participant 1',
        ]);

        $participant2 = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Participant 2',
        ]);

        $participant3 = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Participant 3',
        ]);

        // Rank 1 = 9 points, Rank 2 = 8 points, Rank 5 = 5 points
        EventDateVote::create([
            'participant_id' => $participant1->id,
            'event_date_id' => $date->id,
            'rank' => 1,
        ]);

        EventDateVote::create([
            'participant_id' => $participant2->id,
            'event_date_id' => $date->id,
            'rank' => 2,
        ]);

        EventDateVote::create([
            'participant_id' => $participant3->id,
            'event_date_id' => $date->id,
            'rank' => 5,
        ]);

        // Act
        $date = $date->fresh(['votes']);
        $score = $date->score;

        // Assert - 9 + 8 + 5 = 22
        $this->assertEquals(22, $score);
    }

    public function testEventLocationScoreWithNoVotes()
    {
        // Arrange
        $location = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Test Location',
        ]);

        // Act
        $score = $location->score;

        // Assert
        $this->assertEquals(0, $score);
    }

    public function testEventLocationScoreWithSingleVote()
    {
        // Arrange
        $location = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Test Location',
        ]);

        $participant = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'John Doe',
        ]);

        EventLocationVote::create([
            'participant_id' => $participant->id,
            'event_location_id' => $location->id,
            'rank' => 3, // Rank 3 = score 7
        ]);

        // Act
        $location = $location->fresh(['votes']);
        $score = $location->score;

        // Assert
        $this->assertEquals(7, $score);
    }

    public function testEventLocationScoreWithMultipleVotes()
    {
        // Arrange
        $location = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Test Location',
        ]);

        $participant1 = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Participant 1',
        ]);

        $participant2 = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Participant 2',
        ]);

        // Rank 1 = 9 points, Rank 10 = 0 points
        EventLocationVote::create([
            'participant_id' => $participant1->id,
            'event_location_id' => $location->id,
            'rank' => 1,
        ]);

        EventLocationVote::create([
            'participant_id' => $participant2->id,
            'event_location_id' => $location->id,
            'rank' => 10,
        ]);

        // Act
        $location = $location->fresh(['votes']);
        $score = $location->score;

        // Assert - 9 + 0 = 9
        $this->assertEquals(9, $score);
    }

    public function testScoreCalculationAcrossMultipleDates()
    {
        // Arrange
        $date1 = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(1),
        ]);

        $date2 = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(2),
        ]);

        $participant = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Voter',
        ]);

        // Date 1 gets rank 1, Date 2 gets rank 2
        EventDateVote::create([
            'participant_id' => $participant->id,
            'event_date_id' => $date1->id,
            'rank' => 1,
        ]);

        EventDateVote::create([
            'participant_id' => $participant->id,
            'event_date_id' => $date2->id,
            'rank' => 2,
        ]);

        // Act
        $date1 = $date1->fresh(['votes']);
        $date2 = $date2->fresh(['votes']);

        // Assert
        $this->assertEquals(9, $date1->score); // Rank 1 = 9
        $this->assertEquals(8, $date2->score); // Rank 2 = 8
    }

    public function testScoreCalculationAcrossMultipleLocations()
    {
        // Arrange
        $location1 = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Location 1',
        ]);

        $location2 = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Location 2',
        ]);

        $participant = EventParticipant::create([
            'event_id' => $this->event->id,
            'name' => 'Voter',
        ]);

        // Location 1 gets rank 2, Location 2 gets rank 1
        EventLocationVote::create([
            'participant_id' => $participant->id,
            'event_location_id' => $location1->id,
            'rank' => 2,
        ]);

        EventLocationVote::create([
            'participant_id' => $participant->id,
            'event_location_id' => $location2->id,
            'rank' => 1,
        ]);

        // Act
        $location1 = $location1->fresh(['votes']);
        $location2 = $location2->fresh(['votes']);

        // Assert
        $this->assertEquals(8, $location1->score); // Rank 2 = 8
        $this->assertEquals(9, $location2->score); // Rank 1 = 9
    }
}
