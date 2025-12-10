<?php

namespace NickKlein\Events\Tests\Unit;

use NickKlein\Events\Models\Event;
use NickKlein\Events\Tests\TestCase;

class EventModelTest extends TestCase
{
    public function testEventCreatesUniqueHash()
    {
        // Act
        $event = Event::create([
            'title' => 'Test Event',
            'description' => 'Test Description',
        ]);

        // Assert
        $this->assertNotNull($event->hash);
        $this->assertNotNull($event->admin_hash);
        $this->assertEquals(10, strlen($event->hash));
        $this->assertEquals(10, strlen($event->admin_hash));
        $this->assertNotEquals($event->hash, $event->admin_hash);
    }

    public function testMultipleEventsHaveUniqueHashes()
    {
        // Act
        $event1 = Event::create(['title' => 'Event 1']);
        $event2 = Event::create(['title' => 'Event 2']);
        $event3 = Event::create(['title' => 'Event 3']);

        // Assert
        $this->assertNotEquals($event1->hash, $event2->hash);
        $this->assertNotEquals($event1->hash, $event3->hash);
        $this->assertNotEquals($event2->hash, $event3->hash);

        $this->assertNotEquals($event1->admin_hash, $event2->admin_hash);
        $this->assertNotEquals($event1->admin_hash, $event3->admin_hash);
        $this->assertNotEquals($event2->admin_hash, $event3->admin_hash);
    }

    public function testIsActiveWithActiveStatusAndNoExpiration()
    {
        // Arrange
        $event = Event::create([
            'title' => 'Test Event',
            'status' => 'active',
            'expires_at' => null,
        ]);

        // Assert
        $this->assertTrue($event->isActive());
    }

    public function testIsActiveWithActiveStatusAndFutureExpiration()
    {
        // Arrange
        $event = Event::create([
            'title' => 'Test Event',
            'status' => 'active',
            'expires_at' => now()->addDays(7),
        ]);

        // Assert
        $this->assertTrue($event->isActive());
    }

    public function testIsActiveWithActiveStatusAndPastExpiration()
    {
        // Arrange
        $event = Event::create([
            'title' => 'Test Event',
            'status' => 'active',
            'expires_at' => now()->subDays(1),
        ]);

        // Assert
        $this->assertFalse($event->isActive());
    }

    public function testIsActiveWithClosedStatus()
    {
        // Arrange
        $event = Event::create([
            'title' => 'Test Event',
            'status' => 'closed',
            'expires_at' => now()->addDays(7),
        ]);

        // Assert
        $this->assertFalse($event->isActive());
    }

    public function testEventDefaultStatusIsActive()
    {
        // Act
        $event = Event::create(['title' => 'Test Event']);
        $event = $event->fresh(); // Reload from database to get default value

        // Assert
        $this->assertEquals('active', $event->status);
    }

    public function testEventExpiresAtCanBeNull()
    {
        // Act
        $event = Event::create([
            'title' => 'Test Event',
            'expires_at' => null,
        ]);

        // Assert
        $this->assertNull($event->expires_at);
    }

    public function testEventExpiresAtIsCastToDateTime()
    {
        // Act
        $expirationDate = now()->addDays(7);
        $event = Event::create([
            'title' => 'Test Event',
            'expires_at' => $expirationDate,
        ]);

        // Assert
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $event->expires_at);
    }

    public function testEventDescriptionCanBeNull()
    {
        // Act
        $event = Event::create([
            'title' => 'Test Event',
            'description' => null,
        ]);

        // Assert
        $this->assertNull($event->description);
    }

    public function testEventHasPublicUrlAttribute()
    {
        // Arrange
        $event = Event::create(['title' => 'Test Event']);

        // Act
        $publicUrl = $event->public_url;

        // Assert
        $this->assertNotNull($publicUrl);
        $this->assertStringContainsString($event->hash, $publicUrl);
    }

    public function testEventHasAdminUrlAttribute()
    {
        // Arrange
        $event = Event::create(['title' => 'Test Event']);

        // Act
        $adminUrl = $event->admin_url;

        // Assert
        $this->assertNotNull($adminUrl);
        $this->assertStringContainsString($event->admin_hash, $adminUrl);
    }
}
