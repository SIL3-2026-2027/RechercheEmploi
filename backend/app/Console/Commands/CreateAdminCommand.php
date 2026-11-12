<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminCommand extends Command
{
    protected $signature = 'app:create-admin {name} {email}';

    protected $description = 'Créer un compte administrateur';

    public function handle(): int
    {
        $email = $this->argument('email');
        if (User::where('email', $email)->exists()) {
            $this->components->error('Cette adresse e-mail est déjà utilisée.');

            return self::FAILURE;
        }

        $password = $this->secret('Mot de passe');
        $confirmation = $this->secret('Confirmer le mot de passe');
        if (! $password || $password !== $confirmation || strlen($password) < 8) {
            $this->components->error('Les mots de passe doivent correspondre et contenir au moins 8 caractères.');

            return self::FAILURE;
        }

        User::create([
            'name' => $this->argument('name'),
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        $this->components->info('Compte administrateur créé.');

        return self::SUCCESS;
    }
}
