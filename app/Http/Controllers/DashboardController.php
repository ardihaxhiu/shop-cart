<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\GetDashboardStats;
use App\Actions\Dashboard\GetRecentOrders;
use App\Actions\Dashboard\GetSalesChartData;
use App\Actions\Dashboard\GetTopProducts;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(
        GetDashboardStats $getDashboardStats,
        GetRecentOrders $getRecentOrders,
        GetTopProducts $getTopProducts,
        GetSalesChartData $getSalesChartData
    ) {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $getDashboardStats->handle(),
            'recentOrders' => $getRecentOrders->handle(),
            'topProducts' => $getTopProducts->handle(),
            'salesChartData' => $getSalesChartData->handle(),
        ]);
    }
}
