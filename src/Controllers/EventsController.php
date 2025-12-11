<?php

namespace NickKlein\Events\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use NickKlein\Events\Models\Event;
use NickKlein\Events\Requests\StoreEventRequest;
use NickKlein\Events\Services\EventService;
use NickKlein\Events\Services\VisitorService;

class EventsController extends Controller
{
    public function index(VisitorService $visitorService)
    {
        $visitorId = $visitorService->getOrCreateVisitorId();
        $events = Event::with(['dates', 'locations', 'participants'])
            ->where('visitor_id', $visitorId)
            ->latest()
            ->get();

        return Inertia::render('Events/Index', [
            'events' => $events
        ]);
    }

    public function create(VisitorService $visitorService)
    {
        $visitorService->getOrCreateVisitorId();

        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request, EventService $eventService, VisitorService $visitorService)
    {
        $event = $eventService->createEvent($request->validated(), $visitorService->getOrCreateVisitorId());

        return response()->json([
            'public_url' => $event->public_url,
            'admin_url' => $event->admin_url,
            'event' => $event,
        ]);
    }

    public function admin($adminHash, EventService $eventService, VisitorService $visitorService)
    {
        $visitorService->getOrCreateVisitorId();

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
