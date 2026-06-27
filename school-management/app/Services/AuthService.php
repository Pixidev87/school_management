<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    // Bejelentkezés..
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();  // email cim alapján megkeressük a felhasználót..

        // ellenőrzöm, hogy van-e ilyen felhasználó és jó-e a hozzá tartozó jelszó..
        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Érvénytelen email vagy jelszó mező'],
            ]);
        };

        // Töröljük a régi tokeneket (opcionális). Ez azt jelenti hogy bejelentkezéskor az összes korábbi token érvénytelen lesz..
        $user->tokens()->delete();

        // Új token generálása..
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ],
        ];
    }

    // Kijelentkezés.. (egy eszközről)
    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    // Kijelentkezés az összes eszközről..
    public function logoutAll(User $user): void
    {
        $user->tokens()->delete();
    }
}