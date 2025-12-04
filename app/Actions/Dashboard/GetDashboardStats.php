<?php

namespace App\Actions\Dashboard;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class GetDashboardStats
{
    public function handle(): array
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();

        // Revenue stats
        $totalRevenue = Order::sum('total_amount');
        $todayRevenue = Order::where('created_at', '>=', $today)->sum('total_amount');
        $yesterdayRevenue = Order::whereBetween('created_at', [$yesterday, $today])->sum('total_amount');
        $revenueChange = $yesterdayRevenue > 0
            ? (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100
            : 0;

        // Orders stats
        $totalOrders = Order::count();
        $todayOrders = Order::where('created_at', '>=', $today)->count();
        $yesterdayOrders = Order::whereBetween('created_at', [$yesterday, $today])->count();
        $ordersChange = $yesterdayOrders > 0
            ? (($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100
            : 0;

        // Products stats
        $totalProducts = Product::count();
        $lowStockProducts = Product::where(function ($query) {
            $query->whereRaw('stock_quantity < COALESCE(low_stock_threshold, ?)', [config('inventory.low_stock_threshold', 5)]);
        })->count();

        // Customers stats
        $totalCustomers = User::whereHas('roles', function ($query) {
            $query->where('name', 'customer');
        })->count();

        return [
            'totalRevenue' => $totalRevenue,
            'todayRevenue' => $todayRevenue,
            'revenueChange' => round($revenueChange, 1),
            'totalOrders' => $totalOrders,
            'todayOrders' => $todayOrders,
            'ordersChange' => round($ordersChange, 1),
            'totalProducts' => $totalProducts,
            'lowStockProducts' => $lowStockProducts,
            'totalCustomers' => $totalCustomers,
        ];
    }
}
