<?php

namespace App\Actions\Cart;

use App\Models\CartItem;

class UpdateCartItem
{
    public function handle(CartItem $cartItem, int $quantity): array
    {
        if ($cartItem->product->stock_quantity < $quantity) {
            return [
                'success' => false,
                'message' => "Only {$cartItem->product->stock_quantity} items available in stock.",
            ];
        }

        $cartItem->update(['quantity' => $quantity]);

        return [
            'success' => true,
            'message' => 'Cart quantity updated!',
        ];
    }
}
