<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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

        $orders = Order::with('orderItems.product')
            ->whereBetween('created_at', [$startOfYesterday, $endOfYesterday])
            ->get();

        // Calculate report data
        $totalOrders = $orders->count();
        $totalRevenue = $orders->sum('total_amount');
        $totalItemsSold = $orders->sum('total_items');

        // Get product sales breakdown
        $productSales = [];
        foreach ($orders as $order) {
            foreach ($order->orderItems as $item) {
                $productId = $item->product_id;
                if (! isset($productSales[$productId])) {
                    $productSales[$productId] = [
                        'name' => $item->product_name,
                        'quantity' => 0,
                        'revenue' => 0,
                    ];
                }
                $productSales[$productId]['quantity'] += $item->quantity;
                $productSales[$productId]['revenue'] += $item->subtotal;
            }
        }

        // Sort by revenue (highest first)
        usort($productSales, function ($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        // Get admin emails
        $adminEmails = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->pluck('email');

        if ($adminEmails->isEmpty()) {
            return;
        }

        // Prepare report data
        $reportData = [
            'date' => $startOfYesterday->format('Y-m-d'),
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'totalItemsSold' => $totalItemsSold,
            'productSales' => $productSales,
            'orders' => $orders,
        ];

        // Send emails individually (job itself is already queued)
        foreach ($adminEmails as $email) {
            Mail::to($email)->send(new DailySalesReport($reportData));
        }
    }
}
