<?php

namespace App\Actions\Cart;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class GetCartItems
{
    public function handle(Request $request): array
    {
        $cartItems = CartItem::where('user_id', Auth::id() ?? $request->session()->getId())->with('product')->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return [
            'items' => $cartItems,
            'subtotal' => $subtotal,
        ];
    }
}
