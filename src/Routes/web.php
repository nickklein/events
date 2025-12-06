<?php

use Illuminate\Support\Facades\Route;
use NickKlein\Events\Controllers\VotingController;
use NickKlein\Events\Controllers\EventsController;

Route::middleware(['web'])->group(function () {
    // Public event creation (no auth required)
    Route::get('/events/create', [EventsController::class, 'create'])->name('events.create');
    Route::post('/events', [EventsController::class, 'store'])->name('events.store');

    // Public voting
    Route::get('/event/{hash}', [VotingController::class, 'show'])->name('events.vote');
    Route::post('/event/{hash}/vote', [VotingController::class, 'submitVote'])->name('events.vote.submit');

    // Admin management (requires secret admin hash)
    Route::get('/event/admin/{adminHash}', [EventsController::class, 'admin'])->name('events.admin');
    Route::post('/event/admin/{adminHash}/close', [EventsController::class, 'close'])->name('events.admin.close');
    Route::delete('/event/admin/{adminHash}', [EventsController::class, 'destroy'])->name('events.admin.destroy');
});
