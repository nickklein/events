<?php

namespace NickKlein\Events\Tests\Unit;

use NickKlein\Events\Models\Event;
use NickKlein\Events\Models\EventDate;
use NickKlein\Events\Models\EventDateVote;
use NickKlein\Events\Models\EventLocation;
use NickKlein\Events\Models\EventLocationVote;
use NickKlein\Events\Models\EventParticipant;
use NickKlein\Events\Services\VoteService;
use NickKlein\Events\Tests\TestCase;

class VoteServiceTest extends TestCase
{
    protected VoteService $voteService;
    protected Event $event;
    protected EventDate $date1;
    protected EventDate $date2;
    protected EventLocation $location1;
    protected EventLocation $location2;

    public function setUp(): void
    {
        parent::setUp();
        $this->voteService = new VoteService();

        // Create a test event with dates and locations
        $this->event = Event::create([
            'title' => 'Test Event',
            'description' => 'Test Description',
            'expires_at' => now()->addDays(7),
        ]);

        $this->date1 = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(1),
        ]);

        $this->date2 = EventDate::create([
            'event_id' => $this->event->id,
            'datetime' => now()->addDays(2),
        ]);

        $this->location1 = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Location 1',
            'url' => 'https://maps.google.com/1',
        ]);

        $this->location2 = EventLocation::create([
            'event_id' => $this->event->id,
            'name' => 'Location 2',
            'url' => null,
        ]);
    }

    public function testCreateVote()
    {
        // Arrange
        $validated = [
            'name' => 'John Doe',
            'date_votes' => [
                ['event_date_id' => $this->date1->id, 'rank' => 1],
                ['event_date_id' => $this->date2->id, 'rank' => 2],
            ],
            'location_votes' => [
                ['event_location_id' => $this->location1->id, 'rank' => 1],
                ['event_location_id' => $this->location2->id, 'rank' => 2],
            ],
        ];

        // Act
        $this->voteService->createVote($this->event, $validated, 'test_visitor_id_1');

        // Assert participant was created
        $this->assertDatabaseHas('event_participants', [
            'event_id' => $this->event->id,
            'name' => 'John Doe',
            'visitor_id' => 'test_visitor_id_1',
        ]);

        $participant = EventParticipant::where('event_id', $this->event->id)
            ->where('name', 'John Doe')
            ->first();

        $this->assertNotNull($participant);

        // Assert date votes were created
        $this->assertDatabaseHas('event_date_votes', [
            'participant_id' => $participant->id,
            'event_date_id' => $this->date1->id,
            'rank' => 1,
        ]);

        $this->assertDatabaseHas('event_date_votes', [
            'participant_id' => $participant->id,
            'event_date_id' => $this->date2->id,
            'rank' => 2,
        ]);

        // Assert location votes were created
        $this->assertDatabaseHas('event_location_votes', [
            'participant_id' => $participant->id,
            'event_location_id' => $this->location1->id,
            'rank' => 1,
        ]);

        $this->assertDatabaseHas('event_location_votes', [
            'participant_id' => $participant->id,
            'event_location_id' => $this->location2->id,
            'rank' => 2,
        ]);

        // Verify counts
        $this->assertEquals(2, EventDateVote::where('participant_id', $participant->id)->count());
        $this->assertEquals(2, EventLocationVote::where('participant_id', $participant->id)->count());
    }

    public function testCreateVoteWithSingleDateAndLocation()
    {
        // Arrange
        $validated = [
            'name' => 'Jane Smith',
            'date_votes' => [
                ['event_date_id' => $this->date1->id, 'rank' => 1],
            ],
            'location_votes' => [
                ['event_location_id' => $this->location1->id, 'rank' => 1],
            ],
        ];

        // Act
        $this->voteService->createVote($this->event, $validated, 'test_visitor_id_2');

        // Assert
        $participant = EventParticipant::where('name', 'Jane Smith')->first();
        $this->assertNotNull($participant);
        $this->assertEquals(1, EventDateVote::where('participant_id', $participant->id)->count());
        $this->assertEquals(1, EventLocationVote::where('participant_id', $participant->id)->count());
    }

    public function testCreateVoteWithEmptyVotes()
    {
        // Arrange
        $validated = [
            'name' => 'Bob Johnson',
            'date_votes' => [],
            'location_votes' => [],
        ];

        // Act
        $this->voteService->createVote($this->event, $validated, 'test_visitor_id_3');

        // Assert - participant is created but no votes
        $participant = EventParticipant::where('name', 'Bob Johnson')->first();
        $this->assertNotNull($participant);
        $this->assertEquals(0, EventDateVote::where('participant_id', $participant->id)->count());
        $this->assertEquals(0, EventLocationVote::where('participant_id', $participant->id)->count());
    }

    public function testMultipleParticipantsCanVoteOnSameEvent()
    {
        // Arrange
        $validated1 = [
            'name' => 'Participant 1',
            'date_votes' => [
                ['event_date_id' => $this->date1->id, 'rank' => 1],
            ],
            'location_votes' => [
                ['event_location_id' => $this->location1->id, 'rank' => 1],
            ],
        ];

        $validated2 = [
            'name' => 'Participant 2',
            'date_votes' => [
                ['event_date_id' => $this->date2->id, 'rank' => 1],
            ],
            'location_votes' => [
                ['event_location_id' => $this->location2->id, 'rank' => 1],
            ],
        ];

        // Act
        $this->voteService->createVote($this->event, $validated1, 'test_visitor_id_4');
        $this->voteService->createVote($this->event, $validated2, 'test_visitor_id_5');

        // Assert
        $this->assertEquals(2, EventParticipant::where('event_id', $this->event->id)->count());
        $this->assertEquals(2, EventDateVote::count());
        $this->assertEquals(2, EventLocationVote::count());
    }
}
