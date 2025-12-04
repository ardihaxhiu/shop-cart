<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct() {}

    public function handle(): void
    {
        // Get yesterday's orders
        $startOfYesterday = now()->startOfDay();
        $endOfYesterday = now()->endOfDay();

        $aggregates = Order::whereBetween('created_at', [$startOfYesterday, $endOfYesterday])
            ->selectRaw('COUNT(*) as total_orders, SUM(total_amount) as total_revenue, SUM(total_items) as total_items_sold')
            ->first();

        $totalOrders = $aggregates->total_orders ?? 0;
        $totalRevenue = $aggregates->total_revenue ?? 0;
        $totalItemsSold = $aggregates->total_items_sold ?? 0;

        // Get product sales breakdown using aggregation query
        $productSales = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startOfYesterday, $endOfYesterday])
            ->select(
                'order_items.product_id',
                'order_items.product_name as name',
                DB::raw('SUM(order_items.quantity) as quantity'),
                DB::raw('SUM(order_items.subtotal) as revenue')
            )
            ->groupBy('order_items.product_id', 'order_items.product_name')
            ->orderByDesc('revenue')
            ->get();

        // Get orders for the email (if needed for display)
        $orders = Order::with('orderItems.product')
            ->whereBetween('created_at', [$startOfYesterday, $endOfYesterday])
            ->get();

        // Prepare report data
        $reportData = [
            'date' => $startOfYesterday->format('Y-m-d'),
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'totalItemsSold' => $totalItemsSold,
            'productSales' => $productSales,
            'orders' => $orders,
        ];

        User::select('id','email')
        ->whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })
        ->chunkById(500, function ($admins) use ($reportData) {
            foreach ($admins as $admin) {
                Mail::to($admin->email)->queue(new DailySalesReport($reportData));
            }
        });
    }
}
