<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('app:health', function (): void {
    $this->info('API Chercheurs d\'Emplois opérationnelle.');
})->purpose('Vérifier que la console Laravel fonctionne');
