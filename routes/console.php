<?php

use App\Jobs\SendDailySalesReport;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('sales:report', function () {
    $this->info('Generating daily sales report...');
    SendDailySalesReport::dispatchSync();
    $this->info('Sales report completed!');
})->purpose('Manually trigger the daily sales report');

Artisan::command('test:low-stock', function () {
    $this->info('Testing low stock notification...');

    $product = \App\Models\Product::first();
    if (! $product) {
        $this->error('No products found!');

        return;
    }

    $adminCount = \App\Models\User::whereHas('roles', function ($query) {
        $query->where('name', 'admin');
    })->count();

    $this->info("Found {$adminCount} admin(s)");
    $this->info("Testing with product: {$product->name} (ID: {$product->id})");

    \App\Jobs\SendLowStockNotification::dispatch($product);

    $this->info('Low stock notification job dispatched!');
    $this->info('Run: php artisan queue:work --once to process the job');
})->purpose('Test low stock notification system');

// Schedule daily sales report to run every evening at 6 PM
Schedule::job(new SendDailySalesReport)->dailyAt('18:00');
