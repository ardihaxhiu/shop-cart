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

// Schedule daily sales report to run every evening at 6 PM
Schedule::job(new SendDailySalesReport)->dailyAt('18:00');
