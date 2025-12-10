<?php

namespace NickKlein\Events\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean up expires_at - if empty string, set to null
        if (empty($this->expires_at)) {
            $this->merge([
                'expires_at' => null,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dates' => 'required|array|min:1',
            'dates.*.datetime' => 'required|date|after:yesterday',
            'locations' => 'required|array|min:1',
            'locations.*.name' => 'required|string|max:255',
            'locations.*.url' => 'nullable|url',
            'expires_at' => 'nullable|date|after:yesterday',
        ];
    }
}
