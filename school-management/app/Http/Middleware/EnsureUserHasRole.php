<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */

    // A middleware a route definiálásakor kap paramétert.. pl: middleware('role:admin')..
    // A hasRole() metódust a User modellben hoztuk létre pont ezért az ellenőrzésért..
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user->hasRole($roles)) {
            return response()->json([
                'message' => 'Nincs jogosultságod belépni!'
            ], 403);
        }

        return $next($request);
    }
}
