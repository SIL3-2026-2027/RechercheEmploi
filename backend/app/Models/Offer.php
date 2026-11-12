<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Offer extends Model
{
    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'long_description',
        'location',
        'contract',
        'missions',
        'profile',
        'benefits',
        'color',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'missions' => 'array',
            'profile' => 'array',
            'benefits' => 'array',
        ];
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
