<?php

namespace App\Jobs;

use App\Mail\LowStockAlert;
use App\Models\Product;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class SendLowStockNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Product $product
    ) {}

    public function handle(): void
    {
        // don't send multiple times while still low stock
        $cacheKey = "low_stock_sent_{$this->product->id}";

        if (Cache::has($cacheKey)) {
            return;
        }

        $adminEmail = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->value('email');

        if (! $adminEmail) {
            return;
        }

        Mail::to($adminEmail)->send(new LowStockAlert($this->product));

        // Mark as sent (TTL: 1 day)
        Cache::put($cacheKey, true, now()->addDay());
    }
}
