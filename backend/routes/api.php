<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function (): void {
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::get('/offers', [OfferController::class, 'index']);
    Route::get('/offers/{offer}', [OfferController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::get('/profile/cv', [ProfileController::class, 'downloadCv'])->middleware('role:candidat');
        Route::post('/profile/cv', [ProfileController::class, 'uploadCv'])->middleware('role:candidat');
        Route::get('/notifications', [ApplicationController::class, 'notifications']);
        Route::patch('/notifications/{notification}/read', [ApplicationController::class, 'markNotificationRead']);

        Route::middleware('role:candidat')->group(function (): void {
            Route::get('/applications/mine', [ApplicationController::class, 'mine']);
            Route::post('/offers/{offer}/applications', [ApplicationController::class, 'apply']);
        });

        Route::prefix('employer')->middleware('role:employeur')->group(function (): void {
            Route::get('/offers', [OfferController::class, 'employerIndex']);
            Route::post('/offers', [OfferController::class, 'store']);
            Route::patch('/offers/{offer}', [OfferController::class, 'update']);
            Route::patch('/offers/{offer}/status', [OfferController::class, 'toggleStatus']);
            Route::get('/applications', [ApplicationController::class, 'forEmployer']);
            Route::patch('/applications/{application}', [ApplicationController::class, 'updateStatus']);
            Route::get('/applications/{application}/cv', [ApplicationController::class, 'downloadCandidateCv']);
        });

        Route::prefix('admin')->middleware('role:admin')->group(function (): void {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::patch('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
            Route::get('/offers', [AdminController::class, 'offers']);
            Route::patch('/offers/{offer}/status', [AdminController::class, 'updateOfferStatus']);
        });
    });
});
