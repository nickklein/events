<?php

namespace NickKlein\Events\Tests\TestModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable 
{
    protected $fillable = [
        'name',
        'email',
        'password',
    ];
}
