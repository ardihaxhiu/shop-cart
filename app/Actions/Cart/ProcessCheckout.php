<?php

namespace App\Actions\Cart;

use App\Jobs\SendLowStockNotification;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProcessCheckout
{
    public function handle()
    {
        $userId = Auth::id();
        $sessionId = session()->getId();

        // Get all cart items for this user/session
        $cartItems = CartItem::with('product')
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->get();

        if ($cartItems->isEmpty()) {
            throw new \Exception('Your cart is empty.');
        }

        return DB::transaction(function () use ($cartItems, $userId, $sessionId) {
            // First, check if all products have enough stock
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;

                if ($product->stock_quantity < $cartItem->quantity) {
                    throw new \Exception("Not enough stock for {$product->name}. Only {$product->stock_quantity} available.");
                }
            }

            // Calculate total amount
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            // Create order record
            $order = Order::create([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'total_amount' => $totalAmount,
                'total_items' => $cartItems->count(),
            ]);

            // If we get here, all stock checks passed, now deduct the stock
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;

                // Create order item record
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $product->price,
                    'quantity' => $cartItem->quantity,
                    'subtotal' => $product->price * $cartItem->quantity,
                ]);

                // Deduct the stock quantity
                $product->decrement('stock_quantity', $cartItem->quantity);

                // Refresh product to get updated stock
                $product->refresh();

                // Check if stock is low and send notification
                if ($product->isLowStock()) {
                    SendLowStockNotification::dispatch($product);
                }
            }

            // Clear the cart after successful purchase
            CartItem::where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })->delete();

            return [
                'success' => true,
                'message' => 'Purchase completed successfully!',
                'items_purchased' => $cartItems->count(),
                'total_amount' => $totalAmount,
                'order_id' => $order->id,
            ];
        });
    }
}
