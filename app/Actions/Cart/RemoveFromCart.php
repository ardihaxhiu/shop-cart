<?php

namespace App\Actions\Cart;

use App\Models\CartItem;

class RemoveFromCart
{
    public function handle(CartItem $cartItem): string
    {
        $productName = $cartItem->product->name;
        $cartItem->delete();

        return "{$productName} removed from cart.";
    }
}
