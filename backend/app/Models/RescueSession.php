<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RescueSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_name',
        'score',
        'time_left',
        'errors_count',
        'completed',
    ];

    protected $casts = [
        'score' => 'integer',
        'time_left' => 'integer',
        'errors_count' => 'integer',
        'completed' => 'boolean',
    ];
}
