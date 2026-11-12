<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OfferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $offers = Offer::query()
            ->with('employer:id,name,company_name')
            ->withCount('applications')
            ->where('status', 'active')
            ->when($request->filled('q'), function (Builder $query) use ($request): void {
                $term = '%'.$request->string('q')->trim().'%';
                $query->where(fn (Builder $search) => $search
                    ->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhereHas('employer', fn (Builder $company) => $company
                        ->where('company_name', 'like', $term)
                        ->orWhere('name', 'like', $term)));
            })
            ->when($request->filled('localisation'), fn (Builder $query) => $query
                ->where('location', 'like', '%'.$request->string('localisation')->trim()->toString().'%'))
            ->when($request->filled('contrat'), fn (Builder $query) => $query
                ->where('contract', $request->string('contrat')->toString()))
            ->latest()
            ->get()
            ->map(fn (Offer $offer) => $this->offerData($offer));

        return response()->json(['data' => $offers]);
    }

    public function show(Offer $offer): JsonResponse
    {
        abort_unless($offer->status === 'active', 404);
        $offer->load('employer:id,name,company_name')->loadCount('applications');

        return response()->json(['data' => $this->offerData($offer)]);
    }

    public function employerIndex(Request $request): JsonResponse
    {
        $offers = $request->user()->offers()
            ->with('employer:id,name,company_name')
            ->withCount('applications')
            ->latest()
            ->get()
            ->map(fn (Offer $offer) => $this->offerData($offer));

        return response()->json(['data' => $offers]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatedOffer($request);
        $offer = $request->user()->offers()->create($validated + [
            'long_description' => $validated['description'],
            'benefits' => [],
        ]);
        $offer->load('employer:id,name,company_name')->loadCount('applications');

        return response()->json(['data' => $this->offerData($offer)], 201);
    }

    public function update(Request $request, Offer $offer): JsonResponse
    {
        abort_unless($offer->employer_id === $request->user()->id, 404);
        abort_unless($offer->status !== 'removed', 404);
        $validated = $this->validatedOffer($request);
        $offer->update($validated + ['long_description' => $validated['description']]);
        $offer->load('employer:id,name,company_name')->loadCount('applications');

        return response()->json(['data' => $this->offerData($offer)]);
    }

    public function toggleStatus(Request $request, Offer $offer): JsonResponse
    {
        abort_unless($offer->employer_id === $request->user()->id, 404);
        abort_unless($offer->status !== 'removed', 404);
        $offer->update(['status' => $offer->status === 'active' ? 'inactive' : 'active']);

        return response()->json(['data' => ['id' => $offer->id, 'statut' => $offer->status]]);
    }

    public static function offerData(Offer $offer): array
    {
        $company = $offer->employer?->company_name ?: $offer->employer?->name ?: 'Entreprise';
        $words = preg_split('/\s+/', trim($company)) ?: [];
        $firstWord = $words[0] ?? 'E';
        $initials = count($words) === 1 || preg_match('/[a-z][A-Z]/', $firstWord)
            ? mb_substr($firstWord, 0, 2)
            : mb_substr($firstWord, 0, 1).mb_substr($words[1], 0, 1);

        return [
            'id' => $offer->id,
            'titre' => $offer->title,
            'entreprise' => $company,
            'initiales' => mb_strtoupper($initials),
            'couleur' => $offer->color,
            'localisation' => $offer->location,
            'contrat' => $offer->contract,
            'date' => $offer->created_at->locale('fr')->diffForHumans(),
            'description' => $offer->description,
            'descriptionLongue' => $offer->long_description,
            'missions' => $offer->missions ?? [],
            'profil' => $offer->profile ?? [],
            'avantages' => $offer->benefits ?? [],
            'statut' => $offer->status,
            'candidatures' => $offer->applications_count ?? 0,
            'employer_id' => $offer->employer_id,
        ];
    }

    private function validatedOffer(Request $request): array
    {
        $validated = $request->validate([
            'titre' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string', 'max:10000'],
            'localisation' => ['required', 'string', 'max:180'],
            'contrat' => ['required', Rule::in(['CDI', 'CDD', 'Stage', 'Freelance'])],
            'missions' => ['sometimes', 'array', 'max:30'],
            'missions.*' => ['string', 'max:1000'],
            'profil' => ['sometimes', 'array', 'max:30'],
            'profil.*' => ['string', 'max:1000'],
        ]);

        return [
            'title' => $validated['titre'],
            'description' => $validated['description'],
            'location' => $validated['localisation'],
            'contract' => $validated['contrat'],
            'missions' => $validated['missions'] ?? [],
            'profile' => $validated['profil'] ?? [],
        ];
    }
}
