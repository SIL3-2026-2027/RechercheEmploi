<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $rules = [
            'location' => ['nullable', 'string', 'max:180'],
        ];

        if ($user->role === 'candidat') {
            $rules['name'] = ['required', 'string', 'max:120'];
            $rules['skills'] = ['nullable', 'array', 'max:50'];
            $rules['skills.*'] = ['string', 'max:100'];
        } elseif ($user->role === 'employeur') {
            $rules['company_name'] = ['required', 'string', 'max:180'];
            $rules['name'] = ['nullable', 'string', 'max:120'];
            $rules['sector'] = ['nullable', 'string', 'max:180'];
            $rules['company_description'] = ['nullable', 'string', 'max:5000'];
        } else {
            abort(403, 'Modification de profil non autorisée.');
        }

        $validated = $request->validate($rules);
        if ($user->role === 'employeur') {
            $validated['name'] = $validated['name'] ?? $validated['company_name'];
        }
        $user->update($validated);

        return response()->json(['data' => AuthController::userData($user->refresh())]);
    }

    public function uploadCv(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'candidat', 403, 'Seuls les candidats peuvent déposer un CV.');
        $validated = $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $user = $request->user();
        $file = $validated['cv'];
        $newPath = $file->store('private/cv/'.$user->id, 'local');
        if (! $newPath) abort(500, 'Le CV n’a pas pu être enregistré.');

        $oldPath = $user->cv_path;
        $user->update(['cv_path' => $newPath, 'cv_name' => $file->getClientOriginalName()]);
        if ($oldPath) Storage::disk('local')->delete($oldPath);

        return response()->json(['data' => AuthController::userData($user->refresh())]);
    }

    public function downloadCv(Request $request)
    {
        abort_unless($request->user()->role === 'candidat', 403, 'Seuls les candidats peuvent télécharger un CV.');
        $user = $request->user();
        abort_unless($user->cv_path && Storage::disk('local')->exists($user->cv_path), 404, 'Aucun CV enregistré.');

        return Storage::disk('local')->download($user->cv_path, $user->cv_name ?: 'cv.pdf');
    }
}
