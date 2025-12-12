<?php

namespace NickKlein\Events\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'hash' => $this->hash,
            'dates' => EventDateResource::collection($this->dates)->resolve(),
            'locations' => EventLocationResource::collection($this->locations)->resolve(),
        ];
    }
}
