<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    protected $fillable = [
        'player_id',
        'current_level',
        'score',
        'global_timer',
        'is_game_over'
    ];

    protected $casts = [
        'is_game_over' => 'boolean',
    ];

    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
