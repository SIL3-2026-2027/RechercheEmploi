<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\JobApplication;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    public function mine(Request $request): JsonResponse
    {
        $applications = $request->user()->applications()
            ->with(['offer.employer:id,name,company_name'])
            ->latest()
            ->get()
            ->map(fn (JobApplication $application) => $this->candidateData($application));

        return response()->json(['data' => $applications]);
    }

    public function apply(Request $request, Offer $offer): JsonResponse
    {
        abort_unless($offer->status === 'active', 404);

        if ($request->user()->applications()->where('offer_id', $offer->id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
        }

        try {
            $application = DB::transaction(function () use ($request, $offer): JobApplication {
                $application = $request->user()->applications()->create([
                    'offer_id' => $offer->id,
                    'status' => 'recue',
                ]);
                $application->load(['offer.employer:id,name,company_name']);

                AppNotification::create([
                    'user_id' => $request->user()->id,
                    'title' => 'Candidature envoyée',
                    'message' => 'Votre candidature pour « '.$offer->title.' » a bien été transmise à '.($offer->employer->company_name ?: $offer->employer->name).'.',
                ]);
                AppNotification::create([
                    'user_id' => $offer->employer_id,
                    'title' => 'Nouvelle candidature reçue',
                    'message' => $request->user()->name.' a postulé à votre offre « '.$offer->title.' ».',
                ]);

                return $application;
            });
        } catch (QueryException $error) {
            $message = $error->getMessage();
            $duplicate = str_contains($message, 'job_applications_offer_id_candidate_id_unique')
                || str_contains($message, 'UNIQUE constraint failed: job_applications.offer_id, job_applications.candidate_id');

            if (! $duplicate) throw $error;

            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
        }

        return response()->json(['data' => $this->candidateData($application)], 201);
    }

    public function forEmployer(Request $request): JsonResponse
    {
        $applications = JobApplication::query()
            ->with(['offer', 'candidate:id,name,email,cv_name,cv_path'])
            ->whereHas('offer', fn ($query) => $query->where('employer_id', $request->user()->id))
            ->latest()
            ->get()
            ->map(fn (JobApplication $application) => $this->employerData($application));

        return response()->json(['data' => $applications]);
    }

    public function updateStatus(Request $request, JobApplication $application): JsonResponse
    {
        abort_unless($application->offer()->where('employer_id', $request->user()->id)->exists(), 404);
        $validated = $request->validate([
            'statut' => ['required', Rule::in(['recue', 'examen', 'acceptee', 'refusee'])],
        ]);

        $allowedTransitions = [
            'recue' => ['examen', 'acceptee', 'refusee'],
            'examen' => ['acceptee', 'refusee'],
            'acceptee' => [],
            'refusee' => [],
        ];

        if (! in_array($validated['statut'], $allowedTransitions[$application->status] ?? [], true)) {
            return response()->json(['message' => 'Cette transition de statut n’est pas autorisée.'], 422);
        }

        DB::transaction(function () use ($application, $validated): void {
            $application->update(['status' => $validated['statut']]);
            $application->load('offer');

            if ($application->wasChanged('status')) {
                AppNotification::create([
                    'user_id' => $application->candidate_id,
                    'title' => 'Statut de candidature mis à jour',
                    'message' => 'Votre candidature pour « '.$application->offer->title.' » est maintenant : '.$validated['statut'].'.',
                ]);
            }
        });

        return response()->json(['data' => $this->employerData($application->load('candidate:id,name,email,cv_name,cv_path'))]);
    }

    public function downloadCandidateCv(Request $request, JobApplication $application)
    {
        abort_unless($application->offer()->where('employer_id', $request->user()->id)->exists(), 404);
        $candidate = $application->candidate;
        abort_unless($candidate->cv_path && Storage::disk('local')->exists($candidate->cv_path), 404, 'Aucun CV enregistré.');

        return Storage::disk('local')->download($candidate->cv_path, $candidate->cv_name ?: 'cv.pdf');
    }

    public function notifications(Request $request): JsonResponse
    {
        $notifications = $request->user()->appNotifications()->latest()->get()->map(fn (AppNotification $notification) => [
            'id' => $notification->id,
            'titre' => $notification->title,
            'message' => $notification->message,
            'date' => $notification->created_at->locale('fr')->diffForHumans(),
            'unread' => $notification->read_at === null,
        ]);

        return response()->json(['data' => $notifications]);
    }

    public function markNotificationRead(Request $request, AppNotification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 404);
        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    private function candidateData(JobApplication $application): array
    {
        $offer = $application->offer;
        $data = OfferController::offerData($offer);

        return [
            'id' => $application->id,
            'offerId' => $offer->id,
            'titre' => $data['titre'],
            'entreprise' => $data['entreprise'],
            'initiales' => $data['initiales'],
            'couleur' => $data['couleur'],
            'date' => $application->created_at->locale('fr')->diffForHumans(),
            'statut' => $application->status,
        ];
    }

    private function employerData(JobApplication $application): array
    {
        return [
            'id' => $application->id,
            'offerId' => $application->offer_id,
            'offre' => $application->offer->title,
            'candidat' => $application->candidate->name,
            'email' => $application->candidate->email,
            'date' => $application->created_at->locale('fr')->diffForHumans(),
            'statut' => $application->status,
            'cv' => $application->candidate->cv_name ?: 'Aucun CV',
            'cvDisponible' => $application->candidate->cv_path !== null,
        ];
    }
}
