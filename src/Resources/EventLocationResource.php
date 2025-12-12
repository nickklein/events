<?php

namespace NickKlein\Events\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventLocationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'google_maps_url' => $this->google_maps_url,
        ];
    }
}
