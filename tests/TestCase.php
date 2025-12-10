<?php

namespace NickKlein\Events\Tests;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use NickKlein\Events\EventsServiceProvider;
use NickKlein\Events\Tests\TestModels\User;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    public function setUp(): void
    {
        parent::setUp();

        $this->runMigrations();
        $this->truncateTables();
        $this->seedData();
    }
    
    protected function truncateTables()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('event_location_votes')->truncate();
        DB::table('event_date_votes')->truncate();
        DB::table('event_participants')->truncate();
        DB::table('event_locations')->truncate();
        DB::table('event_dates')->truncate();
        DB::table('events')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    public function runMigrations()
    {
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations/');
        
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('password');
                $table->rememberToken();
                $table->timestamps();
            });
        }
    }
    
    public function seedData()
    {
        $user = User::find(1); 
        if ($user === null) {
            User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
            ]);
        }
    }
    
    /**
     * Get package providers for the application.
     *
     * @param \Illuminate\Foundation\Application $app
     * @return array
     */
    protected function getPackageProviders($app)
    {
        return [
            EventsServiceProvider::class,
        ];
    }
    
    /**
     * Set up the environment for the tests.
     *
     * @param \Illuminate\Foundation\Application $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        $app['config']->set('auth.providers.users.model', \NickKlein\Events\Tests\TestModels\User::class);
        $app['config']->set('app.key', 'base64:'.base64_encode(random_bytes(32)));
    }

    public function tearDown(): void
    {
        $this->truncateTables();
        parent::tearDown();
    }
}
