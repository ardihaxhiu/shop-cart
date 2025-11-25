<?php

namespace App\Actions\Cart;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class GetCartItems
{
    public function handle(Request $request): Collection
    {
        if (Auth::check()) {
            return CartItem::where('user_id', Auth::id())->get();
        }

        $sessionId = $request->session()->getId();

        return CartItem::where('session_id', $sessionId)->get();
    }
}
