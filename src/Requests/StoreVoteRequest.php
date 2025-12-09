<?php

namespace NickKlein\Events\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreVoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'date_votes' => 'required|array',
            'date_votes.*.event_date_id' => 'required|exists:event_dates,id',
            'date_votes.*.rank' => 'required|integer|min:1|max:10',
            'location_votes' => 'required|array',
            'location_votes.*.event_location_id' => 'required|exists:event_locations,id',
            'location_votes.*.rank' => 'required|integer|min:1|max:10',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * Adds custom validation to ensure ranks are sequential starting at 1
     * with no duplicates or gaps for both date and location votes.
     *
     * @param Validator $validator
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            // Validate date ranks are unique and sequential
            $dateRanks = array_column($this->date_votes ?? [], 'rank');
            sort($dateRanks);
            $expectedDateRanks = range(1, count($dateRanks));
            if ($dateRanks !== $expectedDateRanks) {
                $validator->errors()->add(
                    'date_votes',
                    'Invalid date ranks - must be sequential starting at 1 with no duplicates or gaps'
                );
            }

            // Validate location ranks are unique and sequential
            $locationRanks = array_column($this->location_votes ?? [], 'rank');
            sort($locationRanks);
            $expectedLocationRanks = range(1, count($locationRanks));
            if ($locationRanks !== $expectedLocationRanks) {
                $validator->errors()->add(
                    'location_votes',
                    'Invalid location ranks - must be sequential starting at 1 with no duplicates or gaps'
                );
            }
        });
    }
}
