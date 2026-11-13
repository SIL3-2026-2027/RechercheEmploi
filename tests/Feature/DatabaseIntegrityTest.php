<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\JobApplication;
use App\Models\Offer;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseIntegrityTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_offer_application_and_notification_relationships_are_connected(): void
    {
        $employer = $this->createUser('employer@example.test', 'employeur');
        $candidate = $this->createUser('candidate@example.test', 'candidat');
        $offer = $this->createOffer($employer);
        $application = JobApplication::create([
            'offer_id' => $offer->id,
            'candidate_id' => $candidate->id,
        ]);
        $notification = AppNotification::create([
            'user_id' => $employer->id,
            'title' => 'Nouvelle candidature',
            'message' => 'Une candidature a été reçue.',
        ]);

        $this->assertTrue($offer->employer->is($employer));
        $this->assertTrue($application->offer->is($offer));
        $this->assertTrue($application->candidate->is($candidate));
        $this->assertTrue($employer->appNotifications->contains($notification));
        $this->assertTrue($candidate->applications->contains($application));
    }

    public function test_email_addresses_are_unique(): void
    {
        $this->createUser('duplicate@example.test', 'candidat');

        $this->expectException(QueryException::class);

        $this->createUser('duplicate@example.test', 'employeur');
    }

    public function test_a_candidate_cannot_apply_twice_to_the_same_offer(): void
    {
        $employer = $this->createUser('employer@example.test', 'employeur');
        $candidate = $this->createUser('candidate@example.test', 'candidat');
        $offer = $this->createOffer($employer);

        JobApplication::create([
            'offer_id' => $offer->id,
            'candidate_id' => $candidate->id,
        ]);

        $this->expectException(QueryException::class);

        JobApplication::create([
            'offer_id' => $offer->id,
            'candidate_id' => $candidate->id,
        ]);
    }

    public function test_demo_seeder_can_run_more_than_once_without_duplicates(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('offers', 6);
        $this->assertDatabaseCount('users', 6);
    }

    private function createUser(string $email, string $role): User
    {
        return User::create([
            'name' => ucfirst($role),
            'email' => $email,
            'password' => 'test-password',
            'role' => $role,
        ]);
    }

    private function createOffer(User $employer): Offer
    {
        return Offer::create([
            'employer_id' => $employer->id,
            'title' => 'Développeur Laravel',
            'description' => 'Description courte',
            'long_description' => 'Description détaillée',
            'location' => 'Cotonou',
            'contract' => 'CDI',
            'missions' => ['Développer'],
            'profile' => ['Expérience Laravel'],
            'benefits' => ['Télétravail'],
        ]);
    }
}