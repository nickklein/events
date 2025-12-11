<?php

namespace NickKlein\Events\Services;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class VisitorService
{
    protected string $cookieName = 'visitor_id';
    protected int $cookieLifetime = 525600; // 1 year in minutes

    public function getOrCreateVisitorId(): string
    {
        $visitorId = request()->cookie($this->cookieName);

        if ($visitorId) {
            return $visitorId;
        }

        $visitorId = Str::random(64);
        Cookie::queue($this->cookieName, $visitorId, $this->cookieLifetime);

        return $visitorId;
    }
}
