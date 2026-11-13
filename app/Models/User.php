<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'company_name',
        'sector',
        'location',
        'company_description',
        'skills',
        'cv_path',
        'cv_name',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'cv_path',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'skills' => 'array',
        ];
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'employer_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'candidate_id');
    }

    public function appNotifications(): HasMany
    {
        return $this->hasMany(AppNotification::class);
    }
}
