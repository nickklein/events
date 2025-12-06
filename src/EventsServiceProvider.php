<?php

namespace NickKlein\Events;

use Illuminate\Support\ServiceProvider;

class EventsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        /*
         * Optional methods to load your package assets
         */
        $this->loadRoutesFrom(__DIR__ . '/Routes/auth.php');

        // Register migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations/');

        // Publish
        //
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../resources/js/' => resource_path('js/Pages/Events'),
            ], 'assets');
        }

        $this->commands([
            // Register commands here
        ]);
    }
}
