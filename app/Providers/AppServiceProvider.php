<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Broadcast::routes();

        Broadcast::channel('chat.{userId}', function ($user, $userId) {
            return (int) $user->id === (int) $userId;
        });

        require base_path('routes/channels.php');
    }
}