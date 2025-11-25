<?php

namespace App\Actions\Dashboard;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GetTopProducts
{
    public function handle(int $limit = 5): Collection
    {
        $thisMonth = now()->startOfMonth();

        return DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.created_at', '>=', $thisMonth)
            ->select(
                'products.id',
                'products.name',
                'products.image',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.image')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();
    }
}
