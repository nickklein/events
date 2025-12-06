<?php

use Illuminate\Support\Facades\Route;
use NickKlein\Events\Controllers\EventsController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::group(['prefix' => 'events'], function () {
        Route::get('/', [EventsController::class, 'index'])->name('events.index');
    });
});
