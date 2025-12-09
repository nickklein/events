<?php

namespace NickKlein\Events\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Requests\StoreEventRequest;
use NickKlein\Events\Services\EventService;

class EventsController extends Controller
{
    public function index()
    {
        return Inertia::render('Events/Index');
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request, EventService $eventService)
    {
        $event = $eventService->createEvent($request->validated());

        return response()->json([
            'public_url' => $event->public_url,
            'admin_url' => $event->admin_url,
            'event' => $event,
        ]);
    }

    public function admin($adminHash, EventService $eventService)
    {
        $data = $eventService->getAdminEventData($adminHash);

        return Inertia::render('Events/Admin', [
            ...$data,
            'adminHash' => $adminHash,
        ]);
    }

    public function destroy($adminHash)
    {
        $event = Event::where('admin_hash', $adminHash)->firstOrFail();
        $event->delete();

        return redirect()->route('events.index');
    }

    public function close($adminHash)
    {
        $event = Event::where('admin_hash', $adminHash)->firstOrFail();
        $event->update(['status' => 'closed']);

        return back();
    }
}
