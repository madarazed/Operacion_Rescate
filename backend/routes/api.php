<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\GameSessionController;
use App\Http\Controllers\Api\RescueSessionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('players', PlayerController::class);
Route::apiResource('game-sessions', GameSessionController::class);

Route::post('/rescue-sessions', [RescueSessionController::class, 'store']);
Route::get('/rescue-sessions/leaderboard', [RescueSessionController::class, 'leaderboard']);
