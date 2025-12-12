<?php

namespace NickKlein\Events\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventDateResource extends JsonResource
{
    public function toArray($request)
    {
        $hasTime = $this->datetime->format('H:i:s') !== '00:00:00';

        return [
            'id' => $this->id,
            'datetime' => $this->datetime->format('Y-m-d H:i'),
            'display' => $hasTime
                ? $this->datetime->format('D, M j \a\t g:i A')
                : $this->datetime->format('D, M j'),
        ];
    }
}
