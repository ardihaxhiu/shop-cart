<?php

namespace App\Actions\Dashboard;

use App\Models\Order;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GetSalesChartData
{
    public function handle(int $days = 7): Collection
    {
        return Order::where('created_at', '>=', now()->subDays($days - 1)->startOfDay())
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }
}
