<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\JobApplication;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        $activity = collect([
            ...User::latest()->limit(3)->get()->map(fn (User $user) => [
                'timestamp' => $user->created_at,
                'date' => $user->created_at->locale('fr')->diffForHumans(),
                'action' => 'Nouvelle inscription',
                'details' => $user->email.' ('.$user->role.')',
            ]),
            ...Offer::with('employer:id,name,company_name')->latest()->limit(3)->get()->map(fn (Offer $offer) => [
                'timestamp' => $offer->created_at,
                'date' => $offer->created_at->locale('fr')->diffForHumans(),
                'action' => 'Nouvelle offre publiée',
                'details' => $offer->title.' — '.($offer->employer->company_name ?: $offer->employer->name),
            ]),
            ...JobApplication::with(['candidate:id,name', 'offer:id,title'])->latest()->limit(3)->get()->map(fn (JobApplication $application) => [
                'timestamp' => $application->created_at,
                'date' => $application->created_at->locale('fr')->diffForHumans(),
                'action' => 'Candidature reçue',
                'details' => $application->candidate->name.' a postulé à « '.$application->offer->title.' »',
            ]),
        ])->sortByDesc('timestamp')->take(5)->map(fn (array $entry) => [
            'date' => $entry['date'],
            'action' => $entry['action'],
            'details' => $entry['details'],
        ])->values();

        return response()->json(['data' => [
            'users' => User::count(),
            'offers' => Offer::where('status', 'active')->count(),
            'reports' => 0,
            'activity' => $activity,
        ]]);
    }

    public function users(): JsonResponse
    {
        $users = User::query()->latest()->get()->map(fn (User $user) => [
            'id' => $user->id,
            'nom' => $user->company_name ?: $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'actif' => $user->is_active,
        ]);

        return response()->json(['data' => $users]);
    }

    public function updateUserStatus(Request $request, User $user): JsonResponse
    {
        if ($user->is($request->user()) && ! $request->boolean('is_active')) {
            throw ValidationException::withMessages(['is_active' => 'Vous ne pouvez pas désactiver votre propre compte.']);
        }

        $validated = $request->validate(['is_active' => ['required', 'boolean']]);
        $user->update($validated);

        if (! $user->is_active) $user->tokens()->delete();

        return response()->json(['data' => ['id' => $user->id, 'actif' => $user->is_active]]);
    }

    public function offers(): JsonResponse
    {
        $offers = Offer::query()->with('employer:id,name,company_name')->withCount('applications')->latest()->get()
            ->map(fn (Offer $offer) => OfferController::offerData($offer));

        return response()->json(['data' => $offers]);
    }

    public function updateOfferStatus(Request $request, Offer $offer): JsonResponse
    {
        $validated = $request->validate(['statut' => ['required', 'in:active,inactive,removed']]);
        $offer->update(['status' => $validated['statut']]);

        return response()->json(['data' => OfferController::offerData($offer->load('employer:id,name,company_name')->loadCount('applications'))]);
    }
}
