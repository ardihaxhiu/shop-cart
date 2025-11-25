<?php

namespace App\Actions\Cart;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddToCart
{
    public function handle(Request $request, int $productId, int $quantity): array
    {
        $product = Product::findOrFail($productId);

        if ($product->stock_quantity === 0) {
            return [
                'success' => false,
                'message' => 'Sorry, this product is out of stock.',
            ];
        }

        if ($product->stock_quantity < $quantity) {
            return [
                'success' => false,
                'message' => "Only {$product->stock_quantity} items available in stock.",
            ];
        }

        $cartItem = $this->findOrCreateCartItem($request, $productId);
        $newQuantity = $cartItem->quantity + $quantity;

        if ($newQuantity > $product->stock_quantity) {
            $available = $product->stock_quantity - $cartItem->quantity;
            if ($available <= 0) {
                return [
                    'success' => false,
                    'message' => 'You already have the maximum available quantity in your cart.',
                ];
            }

            return [
                'success' => false,
                'message' => "Only {$available} more items can be added (stock limit reached).",
            ];
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->save();

        return [
            'success' => true,
            'message' => '✓ Product added to cart successfully!',
        ];
    }

    private function findOrCreateCartItem(Request $request, int $productId): CartItem
    {
        if (Auth::check()) {
            return CartItem::firstOrCreate(
                [
                    'user_id' => Auth::id(),
                    'product_id' => $productId,
                ],
                ['quantity' => 0]
            );
        }

        $sessionId = $request->session()->getId();

        return CartItem::firstOrCreate(
            [
                'session_id' => $sessionId,
                'product_id' => $productId,
            ],
            ['quantity' => 0]
        );
    }
}
