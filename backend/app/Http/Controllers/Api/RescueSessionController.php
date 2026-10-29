<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RescueSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RescueSessionController extends Controller
{
    /**
     * Store a newly created rescue session in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'player_name' => 'required|string|max:60',
            'score' => 'required|numeric',
            'time_left' => 'required|numeric',
            'errors_count' => 'nullable|numeric',
            'completed' => 'nullable|boolean',
        ]);

        $session = RescueSession::create([
            'player_name' => $validated['player_name'],
            'score' => (int) $validated['score'],
            'time_left' => (int) $validated['time_left'],
            'errors_count' => isset($validated['errors_count']) ? (int) $validated['errors_count'] : 0,
            'completed' => isset($validated['completed']) ? (bool) $validated['completed'] : true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $session,
        ], 201);
    }

    /**
     * Return the Top 10 rescue sessions ordered by score and time_left descending.
     */
    public function leaderboard(): JsonResponse
    {
        $topSessions = RescueSession::orderBy('score', 'desc')
            ->orderBy('time_left', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topSessions,
        ]);
    }
}
