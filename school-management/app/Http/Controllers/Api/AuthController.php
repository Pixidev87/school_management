<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class AuthController extends Controller
{

    public function __construct(
        private AuthService $authService
    ) {}

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $result = $this->authService->login(
            $request->input('email'),
            $request->input('password')
        );

        return response()->json($result);
    }


    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Sikeresen kijelentkezve!'
        ]);
    }


    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutAll($request->user());

        return response()->json([
            'message' => 'Sikeresen kijelentkezve minden eszközről!'
        ]);
    }

    // Bejelentkezett felhasználó adatai..
    public function me(Request $request): UserResource
    {
        $user = $request->user();

        $user->load(match (true) {
            $user->isTeacher() => 'teacher',
            $user->isParent() => 'guardian',
            default => [],
        });

        return new UserResource($user);
    }
}
