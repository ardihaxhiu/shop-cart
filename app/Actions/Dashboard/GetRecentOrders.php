<?php

namespace App\Actions\Dashboard;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;

class GetRecentOrders
{
    public function handle(int $limit = 5): Collection
    {
        return Order::with('orderItems.product')
            ->latest()
            ->take($limit)
            ->get();
    }
}
