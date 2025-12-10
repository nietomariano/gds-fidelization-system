<?php

use App\Http\Controllers\Business\AuthController as BusinessAuthController;
use App\Http\Controllers\Business\CustomerController;
use App\Http\Controllers\Business\UserController;
use App\Http\Controllers\Business\RewardController;
use App\Http\Controllers\Business\PurchaseController;
use App\Http\Controllers\Business\SettingsController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::prefix('business')->group(function () {

    // -------------------------
    // AUTH
    // -------------------------
    Route::prefix('auth')->controller(BusinessAuthController::class)->group(function () {
        Route::post('/register', 'register');

        Route::post('/login', 'login');

        Route::get('/email/verify/{id}/{hash}', 'verify')
            ->middleware(['signed'])
            ->name('verification.verify');

        Route::post('/revalidate-email', 'revalidateEmail');

        Route::post('/logout', 'logout')->middleware('auth:sanctum');

        Route::get('/me', 'me')->middleware('auth:sanctum');

        Route::get('/complete-registration/{user}', 'validateInvitationLink')
            ->middleware('signed')
            ->name('user.complete-registration');

        Route::post('/complete-registration/{user}', 'completeRegistration')
            ->middleware('signed');
    });

    // -------------------------
    // CUSTOMERS
    // -------------------------
    Route::prefix('customers')->controller(CustomerController::class)
        ->middleware('auth:sanctum')->group(function () {

        Route::post('/', 'create');

        Route::get('/', 'get');

        Route::put('/{customer}', 'update');

        Route::delete('/{customerId}', 'deleteCustomerRelation');

        Route::get('/metrics', 'getCustomersDashboard');
    });

    // -------------------------
    // USERS
    // -------------------------
    Route::prefix('users')->controller(UserController::class)
        ->middleware('auth:sanctum')->group(function () {

        Route::get('/', 'getUsers');

        Route::post('/', 'create');

        Route::delete('/{userId}', 'delete');

        Route::put('/{user}', 'update');
    });

    // -------------------------
    // REWARDS  
    // -------------------------
    Route::prefix('rewards')->controller(RewardController::class)
        ->middleware('auth:sanctum')->group(function () {

        Route::get('/', 'get');           // GET list

        Route::post('/', 'create');       // POST create

        Route::put('/{reward}', 'update'); // PUT update

        Route::delete('/{rewardId}', 'delete'); // DELETE
    });

    // -------------------------
    // PURCHASES
    // -------------------------
    Route::prefix('purchases')->controller(PurchaseController::class)
        ->middleware('auth:sanctum')->group(function () {

        Route::get('/', 'get');           // GET list with filters

        Route::post('/', 'create');       // POST create purchase
    });

    // -------------------------
    // SETTINGS
    // -------------------------
    Route::prefix('settings')->controller(SettingsController::class)
        ->middleware('auth:sanctum')->group(function () {

        Route::get('/', 'getSettings');   // GET business settings and loyalty config

        Route::put('/', 'updateSettings'); // PUT update business and loyalty config
    });

    // -------------------------
    // DASHBOARD
    // -------------------------
    Route::prefix('dashboard')->controller(\App\Http\Controllers\Business\DashboardController::class)
        ->middleware('auth:sanctum')->group(function () {

        Route::get('/stats', 'getStats');                   // GET dashboard statistics

        Route::get('/points-chart', 'getPointsChart');      // GET points chart data

        Route::get('/rewards-chart', 'getRewardsChart');    // GET rewards chart data

        Route::get('/recent-activity', 'getRecentActivity'); // GET recent activity

        Route::get('/top-customers', 'getTopCustomers');    // GET top customers
    });
});

// Contact form (outside /business)
Route::post('/contacts', [ContactController::class, 'create']);
