<?php

namespace NickKlein\Events\Tests\Unit;

use NickKlein\Events\Models\Event;
use NickKlein\Events\Services\EventService;
use NickKlein\Events\Tests\TestCase;

class EventServiceTest extends TestCase
{
    protected EventService $eventService;

    public function setUp(): void
    {
        parent::setUp();
        $this->eventService = new EventService();
    }

    public function testCreateEvent()
    {
        // Arrange
        $validated = [
            'title' => 'Test Event',
            'description' => 'This is a test event',
            'expires_at' => now()->addDays(7)->toDateTimeString(),
            'dates' => [
                ['datetime' => now()->addDays(1)->toDateTimeString()],
                ['datetime' => now()->addDays(2)->toDateTimeString()],
            ],
            'locations' => [
                ['name' => 'Location 1', 'url' => 'https://maps.google.com/1'],
                ['name' => 'Location 2', 'url' => null],
            ],
        ];

        // Act
        $event = $this->eventService->createEvent($validated);

        // Assert
        $this->assertInstanceOf(Event::class, $event);
        $this->assertEquals('Test Event', $event->title);
        $this->assertEquals('This is a test event', $event->description);
        $this->assertNotNull($event->expires_at);
        
        // Assert dates were created
        $this->assertCount(2, $event->dates);
        
        // Assert locations were created
        $this->assertCount(2, $event->locations);
        $this->assertEquals('Location 1', $event->locations[0]->name);
        $this->assertEquals('https://maps.google.com/1', $event->locations[0]->url);
        $this->assertEquals('Location 2', $event->locations[1]->name);
        $this->assertNull($event->locations[1]->url);
        
        // Assert event exists in database
        $this->assertDatabaseHas('events', [
            'title' => 'Test Event',
            'description' => 'This is a test event',
        ]);
    }
    /**/
    /*public function testCreateEventWithMinimalData()*/
    /*{*/
    /*    // Arrange*/
    /*    $validated = [*/
    /*        'title' => 'Minimal Event',*/
    /*        'description' => null,*/
    /*        'expires_at' => null,*/
    /*        'dates' => [*/
    /*            ['datetime' => now()->addDays(1)->toDateTimeString()],*/
    /*        ],*/
    /*        'locations' => [*/
    /*            ['name' => 'Only Location', 'url' => null],*/
    /*        ],*/
    /*    ];*/
    /**/
    /*    // Act*/
    /*    $event = $this->eventService->createEvent($validated);*/
    /**/
    /*    // Assert*/
    /*    $this->assertInstanceOf(Event::class, $event);*/
    /*    $this->assertEquals('Minimal Event', $event->title);*/
    /*    $this->assertNull($event->description);*/
    /*    $this->assertNull($event->expires_at);*/
    /*    $this->assertCount(1, $event->dates);*/
    /*    $this->assertCount(1, $event->locations);*/
    /*}*/
}
