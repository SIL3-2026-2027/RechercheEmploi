<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:200'],
            'role' => ['required', Rule::in(['candidat', 'employeur'])],
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'company_name' => $validated['role'] === 'employeur' ? $validated['name'] : null,
        ]);

        return response()->json(['data' => $this->userData($user)], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Adresse e-mail ou mot de passe incorrect.'], 422);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Ce compte est désactivé.'], 403);
        }

        return response()->json([
            'data' => [
                'token' => $user->createToken('web', ['*'], now()->addDays(7))->plainTextToken,
                'user' => $this->userData($user),
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->userData($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public static function userData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'company_name' => $user->company_name ?: ($user->role === 'employeur' ? $user->name : null),
            'sector' => $user->sector,
            'location' => $user->location,
            'company_description' => $user->company_description,
            'skills' => $user->skills ?? [],
            'cv_name' => $user->cv_name,
            'is_active' => $user->is_active,
        ];
    }
}
