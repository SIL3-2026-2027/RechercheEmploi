<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('employer_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->longText('long_description');
            $table->string('location');
            $table->string('contract');
            $table->json('missions');
            $table->json('profile');
            $table->json('benefits');
            $table->string('color', 16)->default('#2563eb');
            $table->string('status')->default('active');
            $table->timestamps();
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
